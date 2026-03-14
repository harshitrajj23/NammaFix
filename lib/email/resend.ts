import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface ResponseConfirmationProps {
  officerEmail: string
  complaintId: string
  complaintTitle: string
  responseMessage: string
  deadline: string | null
}

export async function sendResponseConfirmation({
  officerEmail,
  complaintId,
  complaintTitle,
  responseMessage,
  deadline
}: ResponseConfirmationProps) {
  if (!resend) {
    console.warn('RESEND_API_KEY not found. Skipping confirmation email.')
    return { success: false, error: 'Resend not initialized' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'NammaFix <onboarding@resend.dev>',
      to: officerEmail,
      subject: 'Government Response Submitted – NammaFix',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 12px;">
          <h2 style="color: #FFD700; margin-bottom: 20px;">Response Submitted</h2>
          <p>Hello Officer,</p>
          <p>You have successfully submitted a response to a civic complaint.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">Complaint ID: #${complaintId.slice(0, 8)}</p>
            <p style="margin: 5px 0 10px 0; font-weight: bold; font-size: 16px;">${complaintTitle}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
            <p style="margin: 0; font-weight: bold;">Your Response:</p>
            <p style="margin: 5px 0;">${responseMessage}</p>
            ${deadline ? `
              <p style="margin: 15px 0 0 0; font-weight: bold; color: #ef4444;">Resolution Deadline:</p>
              <p style="margin: 5px 0;">${new Date(deadline).toLocaleString()}</p>
            ` : ''}
          </div>
          <p>Please ensure the issue is resolved before the assigned deadline to maintain city standards.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #999;">This is an automated confirmation from the NammaFix Governance Platform.</p>
        </div>
      `
    })

    if (error) throw error
    console.log(`Confirmation email sent to ${officerEmail} for complaint ${complaintId}`)
    return { success: true, data }
  } catch (err) {
    console.error('Failed to send response confirmation email:', err)
    return { success: false, error: err }
  }
}

interface DeadlineAlertProps {
  officerEmail: string
  complaintId: string
  complaintTitle: string
  location: string
}

export async function sendDeadlineAlert({
  officerEmail,
  complaintId,
  complaintTitle,
  location
}: DeadlineAlertProps) {
  if (!resend) {
    console.warn('RESEND_API_KEY not found. Skipping deadline alert email.')
    return { success: false, error: 'Resend not initialized' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'NammaFix Alerts <onboarding@resend.dev>',
      to: officerEmail,
      subject: 'Deadline Missed – Immediate Action Required',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #fee2e2; border-radius: 12px;">
          <h2 style="color: #ef4444; margin-bottom: 20px;">🚨 Deadline Missed</h2>
          <p>Hello Officer,</p>
          <p style="font-weight: bold; color: #ef4444;">The resolution deadline for a complaint assigned to you has passed and the issue is still unresolved.</p>
          <div style="background-color: #fff1f2; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #fecaca;">
            <p style="margin: 0; font-size: 14px; color: #991b1b;">Complaint ID: #${complaintId.slice(0, 8)}</p>
            <p style="margin: 5px 0 10px 0; font-weight: bold; font-size: 16px;">${complaintTitle}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${location}</p>
          </div>
          <p><strong>Please take immediate action to resolve this complaint.</strong> Missing deadlines impacts city performance ratings and citizen trust.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #999;">This is an automated alert from the NammaFix Governance Platform.</p>
        </div>
      `
    })

    if (error) throw error
    console.log(`Deadline alert email sent to ${officerEmail} for complaint ${complaintId}`)
    return { success: true, data }
  } catch (err) {
    console.error('Failed to send deadline alert email:', err)
    return { success: false, error: err }
  }
}
