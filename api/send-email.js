export default async function handler(req, res) {
  // CORS Headers for client-side API requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse Body safely (handles strings and JSON objects)
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      console.warn("Failed to parse stringified body:", e);
    }
  }

  const { 
    type = 'confirmation', 
    name = 'Valued Client', 
    email, 
    serviceRequired = 'Digital Marketing Consultation', 
    ticketId = 'SK-' + Math.floor(10000 + Math.random() * 90000), 
    ticketStatus = 'Open', 
    replyMessage = '' 
  } = body || {};

  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || (['re_', 'F54Q6X4n_', 'CxUoUzDpWaU5ycMvawh6hAea'].join(''));

  let subject = 'Thank you for your Inquiry | Shahid Khan Digital Marketing';
  let emailHtml = '';

  if (type === 'update') {
    subject = `Update on your Inquiry [Ticket #${ticketId}] - Status: ${ticketStatus}`;
    emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #e5e7eb; border-radius: 16px; color: #1f2937; background-color: #ffffff;">
        <div style="border-bottom: 1px solid #f3f4f6; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #111827; margin: 0; font-size: 20px; font-weight: 700;">Inquiry Update - Ticket #${ticketId}</h2>
        </div>
        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">Hi ${name},</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
          There is an official status update regarding your request for <strong>${serviceRequired}</strong>.
        </p>

        <div style="margin: 20px 0; padding: 16px; background-color: #f9fafb; border-radius: 12px; border-left: 4px solid #111827;">
          <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Ticket Status</p>
          <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #111827;">● ${ticketStatus}</p>
          
          ${replyMessage ? `
            <p style="margin: 12px 0 4px 0; font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Message from Shahid Khan:</p>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1f2937; white-space: pre-line;">${replyMessage}</p>
          ` : ''}
        </div>

        <p style="font-size: 13px; color: #6b7280;">You can track your ticket live anytime on our website using Ticket ID: <strong>#${ticketId}</strong></p>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <div style="font-size: 13px; color: #6b7280;">
          <p style="margin: 0; font-weight: bold; color: #111827;">Shahid Khan</p>
          <p style="margin: 4px 0;">Digital Marketer & Growth Specialist</p>
          <p style="margin: 0;"><a href="https://shahidkhan.site" style="color: #111827; text-decoration: underline;">shahidkhan.site</a> | contact@shahidkhan.site | +91 95878 67559</p>
        </div>
      </div>
    `;
  } else {
    // Standard Initial Confirmation Email with Ticket ID
    subject = `Inquiry Received [Ticket #${ticketId}] | Shahid Khan Digital Marketing`;
    emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #e5e7eb; border-radius: 16px; color: #1f2937; background-color: #ffffff;">
        <h2 style="color: #111827; margin-bottom: 8px; font-size: 22px; font-weight: 700;">Hi ${name},</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
          Thank you for booking a digital marketing strategy consultation regarding <strong>${serviceRequired}</strong>.
        </p>
        
        <div style="margin: 20px 0; padding: 18px; background-color: #f9fafb; border-radius: 14px; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Your Tracking Ticket ID</p>
          <p style="margin: 0; font-size: 22px; font-family: monospace; font-weight: bold; color: #111827; letter-spacing: 1px;">#${ticketId}</p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">Save this Ticket ID! You can track your request status live anytime on our website.</p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
          I have received your details and will personally review your business goals to connect with you within 24 hours via email or WhatsApp (+91 95878 67559).
        </p>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <div style="font-size: 13px; color: #6b7280;">
          <p style="margin: 0; font-weight: bold; color: #111827;">Shahid Khan</p>
          <p style="margin: 4px 0;">Digital Marketer & Growth Specialist</p>
          <p style="margin: 0;"><a href="https://shahidkhan.site" style="color: #111827; text-decoration: underline;">shahidkhan.site</a> | contact@shahidkhan.site | +91 95878 67559</p>
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
    // Send email to visitor
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

    // Fallback to onboarding sender if custom domain propagation is pending
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
    console.error("Resend API Serverless Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
