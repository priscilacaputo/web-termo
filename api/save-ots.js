const https = require('https');

function githubRequest(method, path, token, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'WEB-TERMO-Admin/1.0',
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST')   { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { password, ots } = req.body || {};

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Contraseña incorrecta' });
    return;
  }
  if (!Array.isArray(ots)) {
    res.status(400).json({ error: 'Se esperaba un array de OTs' });
    return;
  }

  const token  = process.env.GITHUB_TOKEN;
  const owner  = process.env.GITHUB_OWNER;
  const repo   = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const FILE   = 'data/ots-historico.json';

  /* Comprimir OTs al mínimo necesario para reducir tamaño */
  const compressed = ots.map(o => {
    const r = {
      n:  String(o.ot_num || o.ot || ''),
      t:  (o.tipo || 'o')[0],            // p / c / o
      e:  String(o.equipo || ''),
      f:  String(o.fecha  || ''),
      tc: String(o.tecnico || '').substring(0, 50),
      h:  Number(o.tiempo) || 0,
      c:  String(o.comentario || '').substring(0, 250),
      s:  String(o.estado || 'ok'),
      a:  String(o.accion  || '').substring(0, 120),
    };
    /* Campos manuales — solo si tienen valor */
    if (o.estado_manual)  r.sm = String(o.estado_manual);
    if (o.nota_manual)    r.nn = String(o.nota_manual).substring(0, 500);
    if (o.fecha_revision) r.fr = String(o.fecha_revision);
    return r;
  });

  const content = JSON.stringify({
    updated: new Date().toISOString().split('T')[0],
    total:   compressed.length,
    ots:     compressed
  });
  const encoded = Buffer.from(content).toString('base64');

  /* Obtener SHA actual del archivo (si existe) */
  const getResp = await githubRequest('GET',
    `/repos/${owner}/${repo}/contents/${FILE}?ref=${branch}`,
    token, null);
  const sha = getResp.status === 200 ? getResp.body.sha : null;

  /* PUT al archivo */
  const putResp = await githubRequest('PUT',
    `/repos/${owner}/${repo}/contents/${FILE}`,
    token, {
      message: `Historial OTs actualizado — ${compressed.length} registros`,
      content: encoded,
      branch,
      ...(sha ? { sha } : {})
    });

  if (putResp.status === 200 || putResp.status === 201) {
    res.status(200).json({ ok: true, total: compressed.length });
  } else {
    res.status(500).json({ error: 'Error al guardar en GitHub', detail: putResp.body?.message || putResp.body });
  }
};
