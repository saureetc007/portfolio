import { validateContactForm } from '../src/lib/contactValidation.ts';

// Simple in-memory rate limiter for serverless instance
// Tracks IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitMap.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

export async function POST(request: Request): Promise<Response> {
  try {
    // 1. Rate Limiting Check
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown-ip';

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Rate limit exceeded. Please wait a few minutes before submitting another message.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 2. Parse JSON Body
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON payload received.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Honeypot check (Spam protection)
    if (body.website && String(body.website).trim().length > 0) {
      // Return 200 decoy to discourage bot retries
      return new Response(
        JSON.stringify({
          success: true,
          message: "Message received. Thanks for reaching out — I'll get back to you soon.",
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Validate Data
    const { isValid, errors, sanitized } = validateContactForm(body);
    if (!isValid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Please fix the errors in your submission.',
          errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Check Server Environment Configuration
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not defined in server environment variables.');
      return new Response(
        JSON.stringify({
          success: false,
          error:
            'Email delivery is not yet configured on this server. Please contact saureetc007@gmail.com directly.',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
    const toEmail = process.env.CONTACT_TO_EMAIL || 'saureetc007@gmail.com';
    const timestamp = new Date().toUTCString();

    // 6. Transmit Email via Resend Transactional API
    const emailPayload = {
      from: fromEmail,
      to: [toEmail],
      reply_to: sanitized.email,
      subject: `[Portfolio Inquiry] ${sanitized.subject}`,
      text: [
        `NEW CONTACT FORM SUBMISSION`,
        `==================================`,
        `Timestamp: ${timestamp}`,
        `Sender:    ${sanitized.name} <${sanitized.email}>`,
        `Subject:   ${sanitized.subject}`,
        `IP:        ${ip}`,
        `----------------------------------`,
        `Message:`,
        sanitized.message,
        `==================================`,
      ].join('\n'),
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #121212; color: #FFFFFF; padding: 24px; margin: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #181818; border: 1px solid #282828; border-radius: 10px; overflow: hidden; }
            .header { background-color: #0E0E0E; padding: 20px 24px; border-bottom: 2px solid #E50914; }
            .header h1 { font-size: 18px; margin: 0; color: #FFFFFF; font-weight: 700; letter-spacing: -0.02em; }
            .header p { font-size: 12px; margin: 4px 0 0; color: #888888; font-family: monospace; }
            .body { padding: 24px; }
            .field { margin-bottom: 16px; }
            .field-label { font-size: 11px; text-transform: uppercase; color: #888888; letter-spacing: 0.08em; margin-bottom: 4px; font-weight: 600; }
            .field-value { font-size: 15px; color: #FFFFFF; line-height: 1.5; }
            .message-box { background-color: #141414; border: 1px solid #262626; border-radius: 6px; padding: 16px; color: #E5E5E5; white-space: pre-wrap; font-size: 14px; line-height: 1.6; }
            .footer { background-color: #111111; padding: 14px 24px; border-top: 1px solid #222222; font-size: 12px; color: #666666; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Portfolio Contact Submission</h1>
              <p>RECEIVED ${timestamp}</p>
            </div>
            <div class="body">
              <div class="field">
                <div class="field-label">Sender</div>
                <div class="field-value"><strong>${sanitized.name}</strong> &lt;<a href="mailto:${sanitized.email}" style="color: #E50914; text-decoration: none;">${sanitized.email}</a>&gt;</div>
              </div>
              <div class="field">
                <div class="field-label">Subject</div>
                <div class="field-value">${sanitized.subject}</div>
              </div>
              <div class="field">
                <div class="field-label">Message</div>
                <div class="message-box">${sanitized.message.replace(/\n/g, '<br/>')}</div>
              </div>
            </div>
            <div class="footer">
              <span>Saureet Portfolio Notification</span>
              <span>Client IP: ${ip}</span>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API returned error:', resendData);
      return new Response(
        JSON.stringify({
          success: false,
          error:
            resendData.message ||
            'Failed to dispatch message via email provider. Please contact directly at saureetc007@gmail.com.',
        }),
        {
          status: resendResponse.status >= 400 && resendResponse.status < 500 ? resendResponse.status : 502,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message received. Thanks for reaching out — I'll get back to you soon.",
        id: resendData.id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    console.error('Unhandled contact handler exception:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An internal error occurred while processing your request. Please try again.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Node.js handler fallback for standard serverless runtimes
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  // Convert incoming Node request to Web API Request
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || 'localhost';
  const url = `${protocol}://${host}${req.url}`;

  const webRequest = new Request(url, {
    method: 'POST',
    headers: req.headers,
    body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
  });

  const webResponse = await POST(webRequest);
  const data = await webResponse.json();
  return res.status(webResponse.status).json(data);
}
