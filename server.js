const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3030;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

/* Dev: ejecuta las funciones serverless de api/ igual que Vercel, para
   probar /api/grilla, /api/save-ots, etc. localmente. */
function runApi(name, req, res) {
  let handler;
  try { handler = require(path.join(__dirname, 'api', name + '.js')); }
  catch (e) { res.writeHead(404); res.end('No such API: ' + name); return; }

  const u = new URL(req.url, 'http://localhost');
  req.query = Object.fromEntries(u.searchParams.entries());
  res.status = code => { res.statusCode = code; return res; };
  res.json = obj => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };

  let raw = '';
  req.on('data', c => (raw += c));
  req.on('end', () => {
    try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
    Promise.resolve()
      .then(() => handler(req, res))
      .catch(err => { if (!res.headersSent) res.writeHead(500); res.end('API error: ' + err.message); });
  });
}

http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];

  if (urlPath.startsWith('/api/')) {
    return runApi(urlPath.slice(5).split('/')[0], req, res);
  }

  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(__dirname, urlPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
