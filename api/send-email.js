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
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Shahid Khan <noreply@shahidkhan.site>',
        to: [email],
        subject: 'Thank you for your Inquiry | Shahid Khan Digital Marketing',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; color: #1f2937; background-color: #ffffff;">
            <h2 style="color: #111827; margin-bottom: 12px; font-size: 20px;">Hi ${name || 'there'},</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
              Thank you for reaching out and booking a digital marketing strategy session regarding <strong>${serviceRequired || 'your business growth goals'}</strong>.
            </p>
            <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
              I have successfully received your inquiry and will personally review your project details. I will connect with you within 24 hours via email or WhatsApp (+91 95878 67559).
            </p>
            <div style="margin: 24px 0; padding: 16px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #f3f4f6;">
              <p style="margin: 0; font-size: 13px; font-weight: bold; color: #111827;">What happens next?</p>
              <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 13px; color: #4b5563;">
                <li>Review of your ad campaign goals & industry competition</li>
                <li>Custom proposal for Meta / Google Ads & Lead Funnel architecture</li>
                <li>Direct strategy consultation schedule</li>
              </ul>
            </div>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <div style="font-size: 13px; color: #6b7280;">
              <p style="margin: 0; font-weight: bold; color: #111827;">Shahid Khan</p>
              <p style="margin: 4px 0;">Digital Marketer & Growth Specialist</p>
              <p style="margin: 0;"><a href="https://shahidkhan.site" style="color: #111827; text-decoration: underline;">shahidkhan.site</a> | contact@shahidkhan.site</p>
            </div>
          </div>
        `
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Resend API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
