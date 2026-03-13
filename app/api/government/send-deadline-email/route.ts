import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: Request) {
  try {
    const { complaintId, officerEmail } = await request.json()

    if (!complaintId || !officerEmail) {
      return NextResponse.json({ error: 'Missing complaintId or officerEmail' }, { status: 400 })
    }

    // 1. Check if email was already sent to avoid duplicates
    const { data: complaint, error: fetchError } = await supabase
      .from('complaints')
      .select('email_sent, title, deadline_at')
      .eq('id', complaintId)
      .single()

    if (fetchError) throw fetchError
    if (complaint.email_sent) {
      return NextResponse.json({ message: 'Email already sent' })
    }

    // 2. Send Email
    const subject = `🚨 DEADLINE EXCEEDED: ${complaint.title}`
    const html = `
      <h1>Urgent: Resolution Deadline Exceeded</h1>
      <p>The deadline for complaint <strong>${complaint.title}</strong> has been exceeded.</p>
      <p><strong>Complaint ID:</strong> ${complaintId}</p>
      <p><strong>Deadline was:</strong> ${new Date(complaint.deadline_at).toLocaleString()}</p>
      <p>Please resolve this issue immediately to maintain city service standards.</p>
      <hr />
      <p>This is an automated alert from NammaFix Government Portal.</p>
    `

    console.log(`[DEADLINE ALERT] Sending email to ${officerEmail} for complaint ${complaintId}`)

    if (resend) {
      await resend.emails.send({
        from: 'NammaFix Alerts <alerts@nammafix.in>',
        to: officerEmail,
        subject,
        html,
      })
    } else {
      console.log('RESEND_API_KEY not configured. Mock email logged above.')
    }

    // 3. Mark as sent in DB
    const { error: updateError } = await supabase
      .from('complaints')
      .update({ email_sent: true })
      .eq('id', complaintId)

    if (updateError) throw updateError

    return NextResponse.json({ status: 'success', message: 'Deadline email sent' })

  } catch (error: any) {
    console.error('Send Deadline Email Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to send deadline email' }, { status: 500 })
  }
}
