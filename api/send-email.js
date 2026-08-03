export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type = 'confirmation', name, email, serviceRequired, ticketId, ticketStatus, replyMessage } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured on server' });
  }

  let subject = 'Thank you for your Inquiry | Shahid Khan Digital Marketing';
  let emailHtml = '';

  if (type === 'update') {
    subject = `Update on your Inquiry [Ticket #${ticketId || 'SK-REQUEST'}] - Status: ${ticketStatus || 'Updated'}`;
    emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #e5e7eb; border-radius: 16px; color: #1f2937; background-color: #ffffff;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-b: 1px solid #f3f4f6; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #111827; margin: 0; font-size: 20px; font-weight: 700;">Inquiry Update - Ticket #${ticketId || 'SK-REQUEST'}</h2>
        </div>
        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">Hi ${name || 'there'},</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
          There is an update on your digital marketing inquiry regarding <strong>${serviceRequired || 'your growth goals'}</strong>.
        </p>

        <div style="margin: 20px 0; padding: 16px; background-color: #f9fafb; border-radius: 12px; border-left: 4px solid #111827;">
          <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Ticket Status</p>
          <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #111827;">${ticketStatus || 'In Progress'}</p>
          
          ${replyMessage ? `
            <p style="margin: 12px 0 4px 0; font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Message from Shahid Khan:</p>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1f2937; white-space: pre-line;">${replyMessage}</p>
          ` : ''}
        </div>

        <p style="font-size: 13px; color: #6b7280;">You can track your ticket live on our website using Ticket ID: <strong>${ticketId}</strong></p>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <div style="font-size: 13px; color: #6b7280;">
          <p style="margin: 0; font-weight: bold; color: #111827;">Shahid Khan</p>
          <p style="margin: 4px 0;">Digital Marketer & Growth Specialist</p>
          <p style="margin: 0;"><a href="https://shahidkhan.site" style="color: #111827; text-decoration: underline;">shahidkhan.site</a> | contact@shahidkhan.site</p>
        </div>
      </div>
    `;
  } else {
    // Standard Confirmation Email with Ticket ID
    subject = `Inquiry Received [Ticket #${ticketId || 'SK-REQUEST'}] | Shahid Khan Digital Marketing`;
    emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #e5e7eb; border-radius: 16px; color: #1f2937; background-color: #ffffff;">
        <h2 style="color: #111827; margin-bottom: 8px; font-size: 22px; font-weight: 700;">Hi ${name || 'there'},</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
          Thank you for booking a digital marketing strategy consultation regarding <strong>${serviceRequired || 'your business growth goals'}</strong>.
        </p>
        
        <div style="margin: 20px 0; padding: 16px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Your Tracking Ticket ID</p>
          <p style="margin: 0; font-size: 20px; font-family: monospace; font-weight: bold; color: #111827; letter-spacing: 1px;">#${ticketId || 'SK-REQUEST'}</p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">Use this Ticket ID on our website anytime to track your request status live!</p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
          I have received your details and will personally review your campaign goals within 24 hours.
        </p>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <div style="font-size: 13px; color: #6b7280;">
          <p style="margin: 0; font-weight: bold; color: #111827;">Shahid Khan</p>
          <p style="margin: 4px 0;">Digital Marketer & Growth Specialist</p>
          <p style="margin: 0;"><a href="https://shahidkhan.site" style="color: #111827; text-decoration: underline;">shahidkhan.site</a> | contact@shahidkhan.site</p>
        </div>
      </div>
    `;
  }

  const headers = {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  try {
    let response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: 'Shahid Khan <noreply@shahidkhan.site>',
        to: [email],
        subject,
        html: emailHtml
      })
    });

    let resData = await response.json();

    if (!response.ok && (response.status === 403 || response.status === 422)) {
      console.warn("Retrying with fallback sender onboarding@resend.dev...");
      response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          from: 'Shahid Khan <onboarding@resend.dev>',
          to: [email],
          subject,
          html: emailHtml
        })
      });
      resData = await response.json();
    }

    return res.status(response.status).json(resData);
  } catch (error) {
    console.error("Resend API Exception:", error);
    return res.status(500).json({ error: error.message });
  }
}
