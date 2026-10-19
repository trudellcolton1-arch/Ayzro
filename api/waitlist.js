import { put } from '@vercel/blob';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const email = String((req.body || {}).email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ error: 'Invalid email' });
  try {
    await put(`waitlist/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`,
      JSON.stringify({ email, at: new Date().toISOString() }),
      { access: 'private', contentType: 'application/json', addRandomSuffix: false });
    return res.status(200).json({ ok: true });
  } catch (e) { console.error(e); return res.status(502).json({ error: 'Storage failed' }); }
}
