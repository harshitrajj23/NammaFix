import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Initialize Supabase with service role for admin access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function GET() {
  try {
    const now = new Date().toISOString()

    // 1. Fetch complaints where deadline reached and email not yet sent
    const { data: overdueComplaints, error: fetchError } = await supabase
      .from('complaints')
      .select('*')
      .lte('deadline_at', now)
      .eq('email_sent', false)

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
      
      if (resend) {
        try {
          // Send real email via Resend
          await resend.emails.send({
            from: 'NammaFix Alerts <alerts@nammafix.in>',
            to: officerEmail,
            subject: 'Complaint Deadline Reached',
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h1 style="color: #ef4444;">Deadline Reached</h1>
                <p><strong>Officer Assigned:</strong> ${complaint.officer_id || 'N/A'}</p>
                <p>A complaint assigned to you has reached its resolution deadline.</p>
                <hr />
                <p><strong>Complaint:</strong> "${complaint.title}"</p>
                <p><strong>Location:</strong> ${complaint.location}</p>
                <hr />
                <p style="color: #666;">Please resolve this issue immediately to maintain city standards.</p>
              </div>
            `
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
        console.log(`SUBJECT: Complaint Deadline Reached`)
        console.log(`BODY: Complaint "${complaint.title}" at ${complaint.location} reached its deadline.`)
        console.log('---------------------------------------')
        emailStatus = 'mocked'
      }

      // 2. Mark as sent regardless of success in demo to avoid loops (or based on status in production)
      await supabase
        .from('complaints')
        .update({ email_sent: true })
        .eq('id', complaint.id)

      results.push({ id: complaint.id, status: emailStatus })
    }

    return NextResponse.json({ 
      message: `Processed ${overdueComplaints.length} complaints.`,
      details: results,
      mode: resend ? 'production' : 'demo'
    })

  } catch (error: any) {
    console.error('Deadline check failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
