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
    const { complaint_id } = await request.json()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!complaint_id) {
      return NextResponse.json({ error: 'Missing complaint_id' }, { status: 400 })
    }

    // Insert vote record
    // The DB trigger handles updating the 'votes' count in the complaints table
    const { error: voteError } = await supabase
      .from('complaint_votes')
      .insert([
        {
          complaint_id,
          user_id: user.id
        }
      ])

    if (voteError) {
      if (voteError.code === '23505') {
        return NextResponse.json({ error: 'You have already voted for this issue' }, { status: 400 })
      }
      throw voteError
    }

    // Fetch updated complaint stats
    const { data: updatedComplaint } = await supabase
      .from('complaints')
      .select('votes, severity')
      .eq('id', complaint_id)
      .single()

    return NextResponse.json({ 
      success: true, 
      votes: updatedComplaint?.votes || 0,
      severity: updatedComplaint?.severity
    })
  } catch (error) {
    console.error('Voting error:', error)
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 })
  }
}
