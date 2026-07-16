const https = require('https');

const SECTION_CONFIG = {
  mangas:      { file: 'assets/js/mangas-data.js',      varName: 'MANGAS_DATA' },
  ascensores:  { file: 'assets/js/ascensores-data.js',  varName: 'ASCENSORES_DATA' },
  escaleras:   { file: 'assets/js/escaleras-data.js',   varName: 'ESCALERAS_DATA' },
  extractores: { file: 'assets/js/extractores-data.js', varName: 'EXTRACTORES_DATA' },
  persianas:   { file: 'assets/js/persianas-data.js',   varName: 'PERSIANAS_DATA' },
  cortinas:    { file: 'assets/js/cortinas-data.js',    varName: 'CORTINAS_DATA' },
  bombas:      { file: 'assets/js/bombas-data.js',      varName: 'BOMBAS_DATA' },
  patio:       { file: 'assets/js/patio-data.js',       varName: 'PATIO_DATA' },
  puertas:     { file: 'assets/js/puertas-data.js',     varName: 'PUERTAS_DATA' },
  aac:         { file: 'assets/js/aac-data.js',         varName: 'AAC_DATA' },
  ecas:        { file: 'assets/js/ecas-data.js',        varName: 'ECAS_DATA' },
  otros:       { file: 'assets/js/otros-data.js',       varName: 'OTROS_DATA' },
  estados:     { file: 'assets/js/estado-equipos-data.js', varName: 'ESTADO_OVERRIDES' },
  tareas:      { file: 'assets/js/tareas-data.js',      varName: 'TAREAS_DATA' },
};

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

/**
 * Replace a top-level `const VARNAME = [...];` in JS source.
 * Uses bracket counting to find the matching closing bracket.
 */
function replaceDataArray(content, varName, newData) {
  const declPattern = new RegExp(`const\\s+${varName}\\s*=\\s*`);
  const declMatch = declPattern.exec(content);
  if (!declMatch) throw new Error(`No se encontró la declaración de ${varName}`);

  const declEnd = declMatch.index + declMatch[0].length;
  let i = declEnd;
  while (i < content.length && content[i] !== '[') i++;
  if (i >= content.length) throw new Error('No se encontró el [ de apertura del array');

  const arrayStart = i;
  let depth = 0;
  i = arrayStart;
  while (i < content.length) {
    const ch = content[i];
    if (ch === '[') {
      depth++;
    } else if (ch === ']') {
      depth--;
      if (depth === 0) break;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      const q = ch;
      i++;
      while (i < content.length && content[i] !== q) {
        if (content[i] === '\\') i++;
        i++;
      }
    }
    i++;
  }
  const arrayEnd = i;

  // Skip optional whitespace and semicolon after ]
  let j = arrayEnd + 1;
  while (j < content.length && (content[j] === ' ' || content[j] === '\n' || content[j] === '\r' || content[j] === '\t')) j++;
  const endPos = content[j] === ';' ? j + 1 : arrayEnd + 1;

  return (
    content.slice(0, declMatch.index) +
    `const ${varName} = ` +
    JSON.stringify(newData, null, 2) +
    ';\n' +
    content.slice(endPos)
  );
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { section, data, password } = req.body || {};

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'Datos inválidos: se esperaba un array' });
  }

  const config = SECTION_CONFIG[section];
  if (!config) return res.status(400).json({ error: `Sección desconocida: ${section}` });

  const owner  = (process.env.GITHUB_OWNER  || '').trim();
  const repo   = (process.env.GITHUB_REPO   || '').trim();
  const branch = (process.env.GITHUB_BRANCH || 'main').trim();
  const token  = (process.env.GITHUB_TOKEN  || '').trim();

  if (!owner || !repo || !token) {
    return res.status(500).json({ error: 'Configuración del servidor incompleta (env vars faltantes)' });
  }

  try {
    const getRes = await githubRequest('GET', `/repos/${owner}/${repo}/contents/${config.file}?ref=${branch}`, token);
    if (getRes.status !== 200) {
      return res.status(500).json({ error: `GitHub: ${getRes.body.message || getRes.status}` });
    }

    const fileSha = getRes.body.sha;
    const currentContent = Buffer.from(getRes.body.content, 'base64').toString('utf8');
    const newContent = replaceDataArray(currentContent, config.varName, data);

    const date = new Date().toISOString().split('T')[0];
    const putRes = await githubRequest('PUT', `/repos/${owner}/${repo}/contents/${config.file}`, token, {
      message: `Admin: actualizar ${section} [${date}]`,
      content: Buffer.from(newContent).toString('base64'),
      sha: fileSha,
      branch,
    });

    if (putRes.status !== 200 && putRes.status !== 201) {
      return res.status(500).json({ error: `GitHub commit: ${putRes.body.message || putRes.status}` });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
