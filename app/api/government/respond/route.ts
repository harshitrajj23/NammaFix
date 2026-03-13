import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Use service role key to bypass RLS for this admin function
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { complaint_id, response_message, officer_id, deadline_at } = body

    if (!complaint_id || !response_message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Insert into responses table
    const { data: responseData, error: responseError } = await supabase
      .from('responses')
      .insert({
        complaint_id,
        government_response: response_message,
        responded_at: new Date().toISOString()
      })
      .select()
      .single()

    if (responseError) throw responseError

    // 2. Fetch complaint to get user_id for notification
    const { data: complaintData, error: complaintFetchError } = await supabase
      .from('complaints')
      .select('user_id, title')
      .eq('id', complaint_id)
      .single()

    if (complaintFetchError) throw complaintFetchError

    // 3. Update complaints table
    const { error: complaintUpdateError } = await supabase
      .from('complaints')
      .update({
        status: 'in_progress',
        deadline_at: deadline_at || null,
        officer_email: officer_id, // We store officer identity here
        email_sent: false
      })
      .eq('id', complaint_id)

    if (complaintUpdateError) throw complaintUpdateError

    // 4. Send notification to citizen
    await supabase.from('notifications').insert({
      user_id: complaintData.user_id,
      complaint_id: complaint_id,
      message: `Government responded to your complaint: ${complaintData.title}`
    })

    return NextResponse.json({ 
      status: 'success', 
      message: 'Government response saved successfully',
      data: responseData 
    })

  } catch (error: any) {
    console.error('Government Response API Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to submit response' }, { status: 500 })
  }
}
