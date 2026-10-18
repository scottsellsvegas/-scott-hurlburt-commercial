export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  const contentType = req.headers['content-type'] || '';
  if (!contentType.startsWith('application/json')) return res.status(415).json({ error: 'JSON required' });
  const origin = req.headers.origin;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  if (origin && origin !== `https://${host}` && origin !== `http://${host}`) return res.status(403).json({ error: 'Invalid origin' });
  let data = req.body;
  try { if (typeof data === 'string') data = JSON.parse(data); } catch { return res.status(400).json({ error: 'Invalid input' }); }
  if (!data || typeof data !== 'object') return res.status(400).json({ error: 'Invalid input' });
  if (data.website) return res.status(200).json({ ok: true });
  const limits = { name: 100, email: 254, phone: 40, address: 300, interest: 100, message: 5000 };
  for (const [field, max] of Object.entries(limits)) {
    if (data[field] !== undefined && (typeof data[field] !== 'string' || data[field].length > max)) return res.status(400).json({ error: 'Invalid input' });
  }
  if (!data.name?.trim() || !data.message?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '') || data.consent !== 'on') return res.status(400).json({ error: 'Required fields missing' });
  if (!process.env.RESEND_API_KEY || !process.env.LEAD_FROM_EMAIL || !process.env.LEAD_TO_EMAIL) return res.status(503).json({ error: 'Please contact Scott directly while email delivery is being configured.' });
  const text = `New commercial property inquiry\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || ''}\nInterest: ${data.interest || ''}\nProperty address: ${data.address || ''}\n\n${data.message}\n\nConsent to inquiry follow-up: yes`;
  try {
    const result = await fetch('https://api.resend.com/emails', { method: 'POST', signal: AbortSignal.timeout(10000), headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.LEAD_FROM_EMAIL, to: [process.env.LEAD_TO_EMAIL], reply_to: data.email, subject: 'New website commercial real estate inquiry', text }) });
    if (!result.ok) return res.status(502).json({ error: 'Delivery unavailable. Please contact Scott directly.' });
    return res.status(200).json({ ok: true });
  } catch { return res.status(502).json({ error: 'Delivery unavailable. Please contact Scott directly.' }); }
}
