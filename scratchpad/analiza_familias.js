const fs = require('fs');
function loadArr(file, varName) {
  const txt = fs.readFileSync('assets/js/' + file, 'utf8');
  const re = new RegExp('const ' + varName + '\\s*=\\s*(\\[[\\s\\S]*?\\]);');
  const m = txt.match(re);
  if (!m) throw new Error('no match ' + file + ' ' + varName);
  return eval(m[1]);
}
const PLANES_SAP = loadArr('planes-sap-data.js', 'PLANES_SAP');
const byEquipo = {};
PLANES_SAP.forEach((p) => { (byEquipo[p.equipo] = byEquipo[p.equipo] || []).push(p); });

const families = [
  ['bombas-data.js', 'BOMBAS_DATA', 'tipo'],
  ['valvulas-data.js', 'VALVULAS_DATA', 'tipo'],
  ['puertas-data.js', 'PUERTAS_DATA', 'tipo'],
  ['aac-data.js', 'AAC_DATA', 'tipo'],
  ['data.js', 'FLOTA_DATA', 'tipo'],
  ['otros-data.js', 'OTROS_DATA', 'tipo'],
];
families.forEach(([file, varName, tipoField]) => {
  const DATA = loadArr(file, varName);
  const byTipo = {};
  DATA.forEach((d) => { (byTipo[d[tipoField]] = byTipo[d[tipoField]] || []).push(d); });
  console.log('===', varName, '===');
  Object.entries(byTipo).forEach(([tipo, arr]) => {
    const withPlan = arr.filter((d) => byEquipo[d.equipo]);
    const withoutPlan = arr.filter((d) => !byEquipo[d.equipo]);
    if (!withoutPlan.length) return;
    const planSets = new Set(withPlan.map((d) => byEquipo[d.equipo].map((p) => p.desc).sort().join('+')));
    console.log(tipo, '| total', arr.length, '| conPlan', withPlan.length, '| sinPlan', withoutPlan.length, '| distintos planes:', [...planSets]);
    withoutPlan.forEach((d) => console.log('   SIN PLAN:', d.equipo, d.denominacion));
  });
});

console.log('=== CAMPANAS_DATA ===');
const CAMPANAS_DATA = loadArr('campanas-data.js', 'CAMPANAS_DATA');
CAMPANAS_DATA.forEach((c) => {
  console.log(c.equipo, byEquipo[c.equipo] ? byEquipo[c.equipo].map((p) => p.desc + ' (' + p.realBucket + ')').join(' + ') : 'SIN PLAN');
});
