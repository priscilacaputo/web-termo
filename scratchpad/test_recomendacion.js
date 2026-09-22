const fs = require('fs');
function loadArr(file, varName) {
  const txt = fs.readFileSync('assets/js/' + file, 'utf8');
  const re = new RegExp('const ' + varName + '\\s*=\\s*(\\[[\\s\\S]*?\\]);');
  const m = txt.match(re);
  if (!m) throw new Error('no match ' + file + ' ' + varName);
  return eval(m[1]);
}
const BOMBAS_DATA = loadArr('bombas-data.js', 'BOMBAS_DATA');
const VALVULAS_DATA = loadArr('valvulas-data.js', 'VALVULAS_DATA');
const CAMPANAS_DATA = loadArr('campanas-data.js', 'CAMPANAS_DATA');
const PUERTAS_DATA = loadArr('puertas-data.js', 'PUERTAS_DATA');
const PATIO_DATA = loadArr('patio-data.js', 'PATIO_DATA');
const FLOTA_DATA = loadArr('data.js', 'FLOTA_DATA');
const AAC_DATA = loadArr('aac-data.js', 'AAC_DATA');
const OTROS_DATA = loadArr('otros-data.js', 'OTROS_DATA');
const PLANES_SAP = loadArr('planes-sap-data.js', 'PLANES_SAP');
const PLANES_SAP_RESUMEN_TXT = fs.readFileSync('assets/js/planes-sap-data.js', 'utf8').match(/const PLANES_SAP_RESUMEN\s*=\s*(\{[\s\S]*?\});\s*\n/)[1];
const PLANES_SAP_RESUMEN = eval('(' + PLANES_SAP_RESUMEN_TXT + ')');

function analizarSinPlan(lista) {
  const planesByEquipo = {};
  PLANES_SAP.forEach((p) => { (planesByEquipo[p.equipo] = planesByEquipo[p.equipo] || []).push(p); });
  const planTxt = (eq) => (planesByEquipo[eq] || []).map((p) => `${p.desc} (${p.realBucket})`).join(' + ');
  const planSig = (eq) => (planesByEquipo[eq] || []).map((p) => p.desc).sort().join('+');
  const numOf = (s) => { const m = String(s || '').match(/-(\d+)(?:\D|$)/); return m ? parseInt(m[1], 10) : null; };

  const FUENTES = [
    { rx: /^MBO/, arr: BOMBAS_DATA, tipoKey: 'tipo' },
    { rx: /^VAL/, arr: VALVULAS_DATA, tipoKey: 'tipo' },
    { rx: /^CPN/, arr: CAMPANAS_DATA, tipoKey: null },
    { rx: /^PPA/, arr: PUERTAS_DATA, tipoKey: 'tipo' },
    { rx: /^MEQ/, arr: PATIO_DATA, tipoKey: 'clase', numeric: true },
    { rx: /^AVO/, arr: FLOTA_DATA, tipoKey: 'tipo' },
    { rx: /^AAC/, arr: AAC_DATA, tipoKey: 'tipo' },
    { rx: /^(CTA|ARC|AUT|CMA)/, arr: OTROS_DATA, tipoKey: 'tipo' },
  ];

  const out = [];
  (lista || []).forEach((eq) => {
    const fuente = FUENTES.find((f) => f.rx.test(eq));
    if (!fuente) { out.push({ equipo: eq, estado: 'sin-ficha' }); return; }
    const arr = fuente.arr;
    const rec = arr.find((d) => d.equipo === eq);
    if (!rec) { out.push({ equipo: eq, estado: 'sin-ficha' }); return; }
    const tipoVal = fuente.tipoKey ? rec[fuente.tipoKey] : '__all__';
    const siblings = arr.filter((d) => d.equipo !== eq && (fuente.tipoKey ? d[fuente.tipoKey] === tipoVal : true) && planesByEquipo[d.equipo]);
    const denom = rec.denominacion || rec.denom || '';
    const lugar = rec.sector || rec.local || rec.ubi_desc || rec.ubicacion || '';
    const base = { equipo: eq, denom, lugar, tipo: fuente.tipoKey ? tipoVal : null };
    if (!siblings.length) { out.push({ ...base, estado: 'gap' }); return; }
    if (fuente.numeric) {
      const n = numOf(denom);
      const withNum = siblings.map((s) => ({ s, n: numOf(s.denominacion) })).filter((x) => x.n !== null);
      const best = (withNum.length && n !== null)
        ? withNum.reduce((a, b) => (Math.abs(b.n - n) < Math.abs(a.n - n) ? b : a)).s
        : siblings[0];
      out.push({ ...base, estado: 'recomendado', sugerido: planTxt(best.equipo), refEquipo: best.equipo, refDenom: best.denominacion });
      return;
    }
    const sigs = new Set(siblings.map((s) => planSig(s.equipo)));
    if (sigs.size === 1) {
      const ref = siblings[0];
      out.push({ ...base, estado: 'recomendado', sugerido: planTxt(ref.equipo), refEquipo: ref.equipo, refDenom: ref.denominacion, nSiblings: siblings.length });
    } else {
      out.push({ ...base, estado: 'ambiguo', nOpciones: sigs.size });
    }
  });
  return out;
}

const lista = PLANES_SAP_RESUMEN.equiposMaestroSinPlan.lista;
console.log('total lista', lista.length);
const res = analizarSinPlan(lista);
const byEstado = {};
res.forEach((r) => { (byEstado[r.estado] = byEstado[r.estado] || []).push(r); });
Object.entries(byEstado).forEach(([k, v]) => console.log(k, v.length));
console.log('\n--- recomendado ---');
(byEstado.recomendado || []).forEach((r) => console.log(r.equipo, '|', r.denom, '|', r.tipo, '=>', r.sugerido, '(ref', r.refEquipo + ')'));
console.log('\n--- ambiguo ---');
(byEstado.ambiguo || []).forEach((r) => console.log(r.equipo, '|', r.denom, '|', r.tipo, '| opciones:', r.nOpciones));
console.log('\n--- gap ---');
(byEstado.gap || []).forEach((r) => console.log(r.equipo, '|', r.denom, '|', r.tipo));
console.log('\n--- sin-ficha ---');
(byEstado['sin-ficha'] || []).forEach((r) => console.log(r.equipo));
