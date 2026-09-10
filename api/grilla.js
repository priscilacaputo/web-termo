/* Proxy a la "Grilla Inteligente" (grilla-inteligente-termo.vercel.app).
   El navegador no puede pegarle directo por CORS, así que el planificador
   pide acá y esta función serverless reenvía la consulta.
     GET /api/grilla?year=2026&month=9   → rotación del mes (monthly-summary)
     GET /api/grilla?date=2026-09-10     → dotación del día (daily) */
const https = require('https');

const GRILLA = 'https://grilla-inteligente-termo.vercel.app';

function getJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'WEB-TERMO/1.0', Accept: 'application/json' },
      /* Destino fijo y conocido (la Grilla en Vercel), datos no sensibles
         (rol de guardias). En algunos entornos corporativos el Node local
         no tiene la cadena de CA para vercel.app y falla el TLS; en Vercel
         la cadena está OK igual. */
      rejectUnauthorized: false,
    }, r => {
      let d = '';
      r.on('data', c => (d += c));
      r.on('end', () => resolve({ status: r.statusCode, text: d }));
    }).on('error', reject);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const q = req.query || {};
  let target;
  if (q.date) {
    target = `${GRILLA}/api/schedule/daily?date=${encodeURIComponent(q.date)}`;
  } else if (q.year && q.month) {
    target = `${GRILLA}/api/schedule/monthly-summary?year=${encodeURIComponent(q.year)}&month=${encodeURIComponent(q.month)}`;
  } else {
    res.status(400).json({ error: 'Falta ?year=&month= (rotación del mes) o ?date=YYYY-MM-DD (dotación del día)' });
    return;
  }

  try {
    const r = await getJSON(target);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=1800');
    res.status(r.status).end(r.text);
  } catch (err) {
    res.status(502).json({ error: 'No se pudo consultar la Grilla Inteligente', detail: err.message });
  }
};
