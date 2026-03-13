import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Complaint } from '@/lib/types'

async function getSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (_) {}
        },
      },
    }
  )
}


/**
 * GET /api/complaints
 * Fetch complaints for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isGov = profile?.role === 'government'

    let query = supabase.from('complaints').select('*')

    // If not government, only show own complaints
    if (!isGov) {
      query = query.eq('user_id', user.id)
    }

    // Apply filtering based on type
    if (type === 'emergency') {
      query = query.in('severity', ['critical', 'high'])
    } else if (type === 'new') {
      query = query.in('severity', ['medium', 'low'])
    }

    // Special handling for recurring (Grouped aggregation)
    if (type === 'recurring') {
      // Supabase JS doesn't support complex GROUP BY / HAVING directly easily in a single .select()
      // We'll use a RPC or just fetch and aggregate in Node for simplicity in this demo, 
      // or try to use a raw query if possible. 
      // Let's do a raw fetch of all complaints and group them here for reliability.
      const { data: allComplaints, error: fetchErr } = await supabase
        .from('complaints')
        .select('*')
      
      if (fetchErr) throw fetchErr

      // Aggregate
      const groups: Record<string, any> = {}
      allComplaints?.forEach(c => {
        const key = `${c.category}-${c.location}`
        if (!groups[key]) {
          groups[key] = {
            id: `recurring-${key}`,
            title: `${c.category} in ${c.location}`,
            category: c.category,
            location: c.location,
            occurrences: 0,
            lastReportedAt: c.created_at,
            severity: c.severity, // Use last reported severity
            type: 'recurring'
          }
        }
        groups[key].occurrences += 1
        if (new Date(c.created_at) > new Date(groups[key].lastReportedAt)) {
          groups[key].lastReportedAt = c.created_at
          groups[key].severity = c.severity
        }
      })

      const recurringIssues = Object.values(groups).filter(g => g.occurrences >= 3)
      return NextResponse.json(recurringIssues)
    }

    const { data: complaints, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Map database snake_case to frontend camelCase
    const formattedComplaints = complaints.map(c => ({
      id: c.id,
      userId: c.user_id,
      title: c.title,
      category: c.category,
      description: c.description,
      location: c.location,
      imageUrl: c.image_url,
      audioUrl: c.audio_url,
      severity: c.severity,
      status: c.status,
      createdAt: c.created_at,
      updatedAt: c.created_at 
    }))

    return NextResponse.json(formattedComplaints)
  } catch (error) {
    console.error('Error fetching complaints:', error)
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    )
  }
}


/**
 * POST /api/complaints
 * Submit a new complaint (handles FormData with files)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const category = formData.get('category') as string || 'Other'
    
    const imageFile = formData.get('image') as File | null
    const audioFile = formData.get('audio') as File | null

    // Validate required fields
    if (!title || !description || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, location' },
        { status: 400 }
      )
    }

    let imageUrl = null
    let audioUrl = null

    // Upload Image if present
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("complaint-images")
        .upload(fileName, imageFile)

      if (uploadError) {
        console.error("Image upload error:", uploadError.message)
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
      }
      
      const { data: urlData } = supabase.storage
        .from("complaint-images")
        .getPublicUrl(fileName)

      imageUrl = urlData.publicUrl
    }


    // Upload Audio if present
    if (audioFile && audioFile.size > 0) {
      const fileExt = 'webm' // Default WebM from MediaRecorder
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("complaint-audio")
        .upload(fileName, audioFile, {
          contentType: 'audio/webm'
        })

      if (uploadError) {
        console.error("Audio upload error:", uploadError.message)
        return NextResponse.json({ error: 'Failed to upload audio' }, { status: 500 })
      }
      
      const { data: urlData } = supabase.storage
        .from("complaint-audio")
        .getPublicUrl(fileName)

      audioUrl = urlData.publicUrl
    }


    // Determine Severity using AI
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
    try {
      const { mistral } = await import('@/lib/mistral')
      const severityResponse = await mistral.chat.complete({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'user',
            content: `You are an AI analyzing civic complaints.
Based on the complaint category and description, determine the severity of the issue.

Problem: ${title}
Category: ${category}
Description: ${description}

Categories:
- pothole
- garbage
- water leakage
- broken streetlight
- drainage issue
- fallen tree
- road damage
- gas leak
- other

Return ONLY JSON:
{
  "severity": "low | medium | high | critical"
}

Rules:
gas leak → critical
fallen tree → high
road damage → high
garbage → medium
pothole → medium
streetlight → low
other → medium`
          }
        ],
        responseFormat: { type: 'json_object' }
      })

      const severityText = severityResponse.choices?.[0]?.message?.content || "{}"
      const parsedSeverity = JSON.parse(typeof severityText === 'string' ? severityText : JSON.stringify(severityText))
      severity = (parsedSeverity.severity || "medium").toLowerCase() as any
      
      // Safety check for valid severity values
      const validSeverities = ['low', 'medium', 'high', 'critical']
      if (!validSeverities.includes(severity)) {
        severity = 'medium'
      }
    } catch (aiErr) {
      console.error('AI Severity Detection Error:', aiErr)
      severity = 'medium' // Fallback
    }


    // Insert into database
    const { data: insertedData, error: insertError } = await supabase
      .from('complaints')
      .insert([
        {
          user_id: user.id,
          title,
          description,
          location,
          category,
          severity,
          image_url: imageUrl,
          audio_url: audioUrl,
          status: 'submitted'
        }
      ])
      .select()
      .single()

    if (insertError || !insertedData) {
      console.error('DB Insert Error:', insertError?.message || insertError)
      return NextResponse.json({ error: 'Failed to save complaint' }, { status: 500 })
    }


    const complaint: Complaint = {
      id: insertedData.id,
      userId: insertedData.user_id,
      title: insertedData.title,
      description: insertedData.description,
      location: insertedData.location,
      category: insertedData.category,
      severity: insertedData.severity,
      imageUrl: insertedData.image_url,
      audioUrl: insertedData.audio_url,
      status: insertedData.status,
      createdAt: insertedData.created_at,
      updatedAt: insertedData.created_at
    }


    return NextResponse.json(complaint, { status: 201 })
  } catch (error) {
    console.error('Error processing complaint API:', error)
    return NextResponse.json(
      { error: 'Failed to process complaint' },
      { status: 500 }
    )
  }
}
