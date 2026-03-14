import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendDeadlineAlert } from '@/lib/email/resend'

// Initialize Supabase with service role for admin access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const resendApiKey = process.env.RESEND_API_KEY

export async function GET() {
  try {
    const now = new Date().toISOString()

    // 1. Fetch complaints where deadline reached and email not yet sent
    const { data: overdueComplaints, error: fetchError } = await supabase
      .from('complaints')
      .select('*')
      .lte('deadline_at', now)
      .eq('email_sent', false)
      .eq('status', 'in_progress') // Only alert for unresolved issues

    if (fetchError) {
      console.error('Error fetching overdue complaints:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!overdueComplaints || overdueComplaints.length === 0) {
      return NextResponse.json({ message: 'No new deadlines reached.' })
    }

    console.log(`Processing ${overdueComplaints.length} overdue complaints...`)

    const results = []

    for (const complaint of overdueComplaints) {
      const officerEmail = complaint.officer_email || 'government@nammafix.in'
      
      let emailStatus = 'skipped'
      
      if (resendApiKey) {
        try {
          await sendDeadlineAlert({
            officerEmail,
            complaintId: complaint.id,
            complaintTitle: complaint.title,
            location: complaint.location
          })
          emailStatus = 'sent'
        } catch (emailErr) {
          console.error(`Failed to send email to ${officerEmail}:`, emailErr)
          emailStatus = 'failed'
        }
      } else {
        // Mock mode for Hackathon Demo
        console.log('--- HACKATHON DEMO EMAIL TRIGGERED ---')
        console.log(`TO: ${officerEmail}`)
        console.log(`SUBJECT: Deadline Missed – Immediate Action Required`)
        console.log(`BODY: Complaint "${complaint.title}" at ${complaint.location} reached its deadline.`)
        console.log('---------------------------------------')
        emailStatus = 'mocked'
      }

      // 2. Mark as sent regardless of success in demo to avoid loops
      await supabase
        .from('complaints')
        .update({ email_sent: true })
        .eq('id', complaint.id)

      results.push({ id: complaint.id, status: emailStatus })
    }

    return NextResponse.json({ 
      message: `Processed ${overdueComplaints.length} complaints.`,
      details: results,
      mode: resendApiKey ? 'production' : 'demo'
    })

  } catch (error: any) {
    console.error('Deadline check failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
