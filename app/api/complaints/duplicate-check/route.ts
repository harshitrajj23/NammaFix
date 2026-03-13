import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    const { title, description, category, latitude, longitude } = await request.json()

    if (!latitude || !longitude) {
      return NextResponse.json({ duplicate: false })
    }

    // 1. Fetch complaints in a rough square (0.02 deg ~ 2km)
    // For a more precise search, postgis could be used, but for a demo this is effective.
    const delta = 0.015 
    const { data: nearbyComplaints, error } = await supabase
      .from('complaints')
      .select('*')
      .gte('latitude', latitude - delta)
      .lte('latitude', latitude + delta)
      .gte('longitude', longitude - delta)
      .lte('longitude', longitude + delta)
      .eq('category', category)
      .neq('status', 'resolved')
      .neq('status', 'completed')

    if (error) throw error
    if (!nearbyComplaints || nearbyComplaints.length === 0) {
      return NextResponse.json({ duplicate: false })
    }

    // 2. Simple Similarity Check (Word overlap)
    // In a real app, we'd use Mistral embeddings or a specialized similarity search
    const newKeywords = new Set(`${title} ${description}`.toLowerCase().split(/\W+/).filter(w => w.length > 3))
    
    let bestMatch = null
    let maxOverlap = 0

    for (const comp of nearbyComplaints) {
      const compKeywords = new Set(`${comp.title} ${comp.description}`.toLowerCase().split(/\W+/).filter(w => w.length > 3))
      let overlap = 0
      newKeywords.forEach(k => {
        if (compKeywords.has(k)) overlap++
      })

      if (overlap > maxOverlap) {
        maxOverlap = overlap
        bestMatch = comp
      }
    }

    // Threshold: if 3+ keywords overlap, consider it a potential duplicate
    if (maxOverlap >= 3 && bestMatch) {
      return NextResponse.json({
        duplicate: true,
        similarComplaint: {
          id: bestMatch.id,
          title: bestMatch.title,
          description: bestMatch.description,
          location: bestMatch.location,
          category: bestMatch.category,
          severity: bestMatch.severity,
          status: bestMatch.status,
          votes: bestMatch.votes || 0
        }
      })
    }

    return NextResponse.json({ duplicate: false })
  } catch (error) {
    console.error('Duplicate check error:', error)
    return NextResponse.json({ error: 'Check failed' }, { status: 500 })
  }
}
