export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, serviceRequired } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured on server' });
  }

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border: 1px solid #e5e7eb; border-radius: 16px; color: #1f2937; background-color: #ffffff;">
      <h2 style="color: #111827; margin-bottom: 12px; font-size: 22px; font-weight: 700;">Hi ${name || 'there'},</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
        Thank you for booking a digital marketing strategy consultation regarding <strong>${serviceRequired || 'your business growth goals'}</strong>.
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
        I have successfully received your inquiry and will personally review your campaign details. I will connect with you within 24 hours via email or WhatsApp (+91 95878 67559).
      </p>
      <div style="margin: 24px 0; padding: 18px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #f3f4f6;">
        <p style="margin: 0; font-size: 14px; font-weight: bold; color: #111827;">What happens next?</p>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 13px; color: #4b5563; line-height: 1.6;">
          <li>Review of your ad campaign goals & competitor analysis</li>
          <li>Custom Meta / Google Ads & High-ROAS Funnel proposal</li>
          <li>Direct strategy call schedule</li>
        </ul>
      </div>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <div style="font-size: 13px; color: #6b7280;">
        <p style="margin: 0; font-weight: bold; color: #111827;">Shahid Khan</p>
        <p style="margin: 4px 0;">Digital Marketer & Growth Specialist</p>
        <p style="margin: 0;"><a href="https://shahidkhan.site" style="color: #111827; text-decoration: underline;">shahidkhan.site</a> | contact@shahidkhan.site</p>
      </div>
    </div>
  `;

  // Standard User-Agent header prevents Cloudflare 403 anti-bot error
  const headers = {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  try {
    // 1. Send confirmation email to visitor from noreply@shahidkhan.site
    let response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: 'Shahid Khan <noreply@shahidkhan.site>',
        to: [email],
        subject: 'Thank you for your Inquiry | Shahid Khan Digital Marketing',
        html: emailHtml
      })
    });

    let resData = await response.json();

    // 2. Fallback to onboarding@resend.dev if custom domain requires DNS propagation
    if (!response.ok && (response.status === 403 || response.status === 422)) {
      console.warn("Retrying with fallback sender onboarding@resend.dev...");
      response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          from: 'Shahid Khan <onboarding@resend.dev>',
          to: [email],
          subject: 'Thank you for your Inquiry | Shahid Khan Digital Marketing',
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
