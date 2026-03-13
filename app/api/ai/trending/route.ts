import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { mistral } from '@/lib/mistral'

// Simple in-memory cache for demo purposes
// In a production app, use Redis or Next.js unstable_cache
let cache: { data: any; timestamp: number } | null = null
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

async function fetchBengaluruNews() {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) {
    console.warn('NEWS_API_KEY is missing, skipping news fetch')
    return []
  }

  // Exact endpoint requested by user for maximum reliability
  const url = `https://gnews.io/api/v4/search?q=bengaluru%20civic%20issues&lang=en&max=10&apikey=${apiKey}`

  try {
    const res = await fetch(url)
    const data = await res.json()
    
    // VERIFICATION LOGGING as requested
    console.log("News API response:", data)
    
    if (data.errors) {
      console.error("GNews API Errors:", data.errors)
      return []
    }

    // Filter and map articles, ensuring headlines are relevant to civic issues
    const keywords = ['gas', 'shortage', 'water', 'pothole', 'garbage', 'traffic', 'flooding', 'infrastructure', 'supply', 'crisis']
    return (data.articles || [])
      .filter((a: any) => {
        const content = `${a.title} ${a.description} ${a.content}`.toLowerCase()
        return keywords.some(k => content.includes(k)) || content.includes('bengaluru')
      })
      .map((a: any) => ({
        title: a.title,
        description: a.description,
        source: 'news'
      }))
  } catch (err) {
    console.error('Error fetching Bengaluru news:', err)
    return []
  }
}


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

export async function GET(request: NextRequest) {
  try {
    // Check cache (10 minutes)
    const now = Date.now()
    if (cache && now - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data)
    }

    const supabase = await getSupabaseClient()

    // 1. Fetch complaints (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { data: complaints, error: dbError } = await supabase
      .from('complaints')
      .select('title, category, description, location')
      .gte('created_at', sevenDaysAgo.toISOString())

    // 2. Fetch Bengaluru News
    const news = await fetchBengaluruNews()

    if (dbError) {
      console.error('Error fetching complaints:', dbError)
    }

    const complaintItems = (complaints || []).map(c => 
      `Issue: ${c.title}, Type: ${c.category}, Details: ${c.description}`
    )

    const newsHeadlines = news.map((n: { title: string }) => n.title)

    // 3. Call Mistral AI with user's specific prompt
    const response = await mistral.chat.complete({
      model: 'mistral-small',
      messages: [
        {
          role: 'system',
          content: 'You are a Bengaluru civic data analyst. You identify trending problems by combining citizen reports and news media.'
        },
        {
          role: 'user',
          content: `You are analyzing civic issues happening in Bengaluru using two sources: citizen complaints and recent news headlines. Identify the top trending civic problems.

DATA SOURCE 1 (Citizen Complaints):
${complaintItems.length > 0 ? JSON.stringify(complaintItems, null, 2) : 'No recent complaints.'}

DATA SOURCE 2 (Recent News Headlines):
${newsHeadlines.length > 0 ? JSON.stringify(newsHeadlines, null, 2) : 'No recent news found.'}

Analysis Requirements:
1. Identify the top 5 trending issues.
2. If news headlines are present, ensure they are weighed heavily in the trending analysis.
3. For each issue, specify the source as "news", "complaints", or "combined".
4. Return ONLY a valid JSON object with a "trending" key containing an array of objects with the fields: "issue", "source", "trend" (high/medium/low), and "count" (mentions).`
        }
      ],
      responseFormat: { type: 'json_object' }
    })

    const aiResponse = response.choices?.[0]?.message?.content
    if (!aiResponse) throw new Error('No AI response')

    const trendingData = JSON.parse(typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse))

    // Log the combined result for verification
    console.log("Mistral Analysis Result (Combined):", trendingData)

    cache = { data: trendingData, timestamp: now }
    return NextResponse.json(trendingData)

  } catch (error) {
    console.error('Trending API Error:', error)
    return NextResponse.json({ error: 'Failed to analyze trends' }, { status: 500 })
  }
}


