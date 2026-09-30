/* ─── Capacidad del personal vs. carga preventiva (pestaña de Auditoría SAP) ───
   ¿Alcanzan los técnicos de hoy para hacer TODAS las OTs preventivas que salen por plan?

   OFERTA (personas-hora por mes, por gremio):
     técnicos × días trabajados al mes × horas NETAS del turno
     horas netas = 12 h − almuerzo/cena − descanso − recorridas/entrega de guardia, × eficiencia
     Aire = TERMO (AUX_TER) · Mecánicos = MEC (AUX_MEC). Se puede reemplazar el nominal por la dotación
     REAL del mes de la Grilla Inteligente (francos compensatorios y vacaciones ya descontados).

   DEMANDA (personas-hora por mes, por gremio):
     Para cada posición de plan (PLANES_SAP) se cuentan las tomas que caen en el mes (a partir de la
     "próxima toma" y el ciclo del plan) y cada toma cuesta las horas-hombre de su hoja de ruta (HDR_DATA):
     tareas base + tareas de cada frecuencia que entra en esa toma. Como el plan mezcla frecuencias
     (p. ej. 2M-6M-12M) y no se sabe en qué vuelta del ciclo está cada equipo, se usa el costo
     PROMEDIO por toma del ciclo completo. Puesto de la hoja de ruta: AUX_TER → Aire, AUX_MEC → Mecánicos,
     MOEX → contratista (no cuenta), AUX_ELC/AUX_INF → otro gremio (no cuenta).

   El margen que queda es el tiempo disponible para reclamos, correctivos, etc. */

const CAP_STORAGE_KEY = 'capacidad_params_v1';
const CAP_MESES_LBL = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const CAP_BUCKET_MESES = { Semanal: 7 / 30.4375, Quincenal: 15 / 30.4375, Mensual: 1, Bimestral: 2, Trimestral: 3, Cuatrimestral: 4, Semestral: 6, Anual: 12, Bianual: 24 };
const CAP_LABEL_A_BUCKET = { '7D': 'Semanal', '15D': 'Quincenal', '1M': 'Mensual', '2M': 'Bimestral', '3M': 'Trimestral', '4M': 'Cuatrimestral', '6M': 'Semestral', '12M': 'Anual', '24M': 'Bianual' };
const CAP_MESES_DE_LABEL = { '7D': 7 / 30.4375, '15D': 15 / 30.4375 };

function capCuentaTecnicos(gremio) {
  if (typeof GUARDIAS === 'undefined') return gremio === 'aire' ? 15 : 13;
  return GUARDIAS.flatMap(g => g.miembros).filter(m => {
    const r = String(m.rol || '').toUpperCase();
    return gremio === 'aire' ? r.startsWith('TERMO') : r.startsWith('MEC');
  }).length;
}

function capParamsDefault() {
  const cfg = (typeof planState !== 'undefined' && planState.cfg && planState.cfg.manana) ? planState.cfg.manana : null;
  return {
    tecAire: capCuentaTecnicos('aire'),
    tecMec: capCuentaTecnicos('mecanico'),
    diasMes: 12,
    turnoHs: 12,
    almuerzoMin: cfg && cfg.almuerzo ? cfg.almuerzo.min : 60,
    descansoMin: cfg && cfg.descanso ? cfg.descanso.min : 20,
    recorridasMin: cfg ? (cfg.recorridasMin || 0) : 120,
    eficiencia: 90,
    persDefault: 2,
    reservaAire: null,   // horas/mes a reservar para reclamos; null = promedio histórico
    reservaMec: null,
    usarGrilla: false,
  };
}
let capState = { mes: '', params: capParamsDefault(), grilla: {}, cargandoGrilla: false, hist: null, proy: null };
try {
  const raw = localStorage.getItem(CAP_STORAGE_KEY);
  if (raw) capState.params = Object.assign(capState.params, JSON.parse(raw));
} catch (e) { /* arranque limpio */ }
function capSaveParams() { try { localStorage.setItem(CAP_STORAGE_KEY, JSON.stringify(capState.params)); } catch (e) { /* sin storage */ } }

/* ═══════════ OFERTA ═══════════ */
function capMinNetosTurno(p) {
  const bruto = p.turnoHs * 60;
  return Math.max(0, bruto - p.almuerzoMin - p.descansoMin - p.recorridasMin) * (p.eficiencia / 100);
}
function capDiasDelMes(mes) {
  const m = String(mes).match(/(\d{4})-(\d{2})/);
  if (!m) return [];
  const n = new Date(+m[1], +m[2], 0).getDate();
  return Array.from({ length: n }, (_, i) => `${m[1]}-${m[2]}-${String(i + 1).padStart(2, '0')}`);
}
/* Personas-turno del mes desde la Grilla Inteligente (si está cargada para todos los días), o null. */
function capGrillaDelMes(mes) {
  const dias = capDiasDelMes(mes);
  const fuentes = [capState.grilla, (typeof planState !== 'undefined' && planState.grilla) ? planState.grilla : {}];
  for (const f of fuentes) {
    if (!dias.length || !dias.every(d => f[d])) continue;
    const t = { aire: 0, mecanico: 0, dia: { aire: 0, mecanico: 0 }, noche: { aire: 0, mecanico: 0 } };
    dias.forEach(d => {
      [['manana', 'dia'], ['noche', 'noche']].forEach(([k, out]) => {
        const s = f[d][k];
        if (!s) return;
        ['aire', 'mecanico'].forEach(g => { const n = s[g] != null ? s[g] : 0; t[g] += n; t[out][g] += n; });
      });
    });
    return t;
  }
  return null;
}
/* Personas-turno por gremio ese mes: {aire, mecanico, dia:{}, noche:{}, fuente} */
function capOferta(mes) {
  const p = capState.params;
  const min = capMinNetosTurno(p);
  const g = p.usarGrilla ? capGrillaDelMes(mes) : null;
  const pt = g ? { aire: g.aire, mecanico: g.mecanico, dia: g.dia, noche: g.noche }
    : { aire: p.tecAire * p.diasMes, mecanico: p.tecMec * p.diasMes,
        dia: { aire: p.tecAire * p.diasMes / 2, mecanico: p.tecMec * p.diasMes / 2 },
        noche: { aire: p.tecAire * p.diasMes / 2, mecanico: p.tecMec * p.diasMes / 2 } };
  const h = x => x * min / 60;
  return {
    fuente: g ? 'grilla' : 'nominal',
    minNetosTurno: min,
    personasTurno: { aire: pt.aire, mecanico: pt.mecanico },
    brutoH: { aire: pt.aire * p.turnoHs, mecanico: pt.mecanico * p.turnoHs },
    netoH: { aire: h(pt.aire), mecanico: h(pt.mecanico) },
    netoHTurno: { dia: { aire: h(pt.dia.aire), mecanico: h(pt.dia.mecanico) }, noche: { aire: h(pt.noche.aire), mecanico: h(pt.noche.mecanico) } },
  };
}
async function capTraerGrilla(mes) {
  const dias = capDiasDelMes(mes);
  if (!dias.length) return;
  capState.cargandoGrilla = true; capRender();
  try {
    const daily = await Promise.all(dias.map(fecha =>
      fetch(`/api/grilla?date=${fecha}`).then(r => r.json()).then(x => ({ fecha, x })).catch(() => ({ fecha, x: null }))));
    let ok = 0;
    daily.forEach(({ fecha, x }) => {
      if (!x || !x.success || !x.data || !Array.isArray(x.data.guards)) return;
      const slot = { manana: { aire: 0, mecanico: 0 }, noche: { aire: 0, mecanico: 0 } };
      x.data.guards.forEach(gd => {
        if (!gd.worksToday) return;
        const turno = String(gd.shiftType || '').toUpperCase() === 'NOCHE' ? 'noche' : 'manana';
        (gd.members || []).forEach(mm => {
          if (String(mm.status || '').toUpperCase() !== 'TRABAJO') return;
          const sp = String(mm.specialty || '').toUpperCase();
          if (sp.startsWith('TERMO')) slot[turno].aire++;
          else if (sp.startsWith('MEC')) slot[turno].mecanico++;
        });
      });
      capState.grilla[fecha] = slot; ok++;
    });
    if (ok < dias.length) throw new Error(`solo ${ok} de ${dias.length} días`);
    capState.params.usarGrilla = true; capSaveParams();
  } catch (e) {
    alert('No se pudo traer la Grilla Inteligente: ' + e.message + '\nSe sigue con la dotación nominal.');
    capState.params.usarGrilla = false;
  }
  capState.cargandoGrilla = false; capRender();
}

/* ═══════════ DEMANDA ═══════════ */
let _capHdrPorPlan = null, _capHdrEntry = null;
function capIndices() {
  if (_capHdrPorPlan) return;
  _capHdrPorPlan = new Map();
  _capHdrEntry = new Map(HDR_DATA.map(e => [e.ruta + '/' + e.cont, e]));
  HDR_PLAN.forEach(r => _capHdrPorPlan.set(r[1], { ruta: r[3], cont: r[4], puesto: r[6], entry: _capHdrEntry.get(r[3] + '/' + r[4]) || null }));
}
function capGremioDePuesto(puesto) {
  const u = String(puesto || '').toUpperCase();
  if (u === 'AUX_TER') return 'aire';
  if (u === 'AUX_MEC') return 'mecanico';
  if (u === 'MOEX') return 'externo';
  if (u) return 'otro';
  return null;
}
/* Frecuencias del plan: 'declara' es la secuencia de paquetes (p. ej. "2M-6M-12M"). Devuelve
   [{label, bucket, meses}] ordenadas; el ciclo del plan es el menor. */
function capFrecuencias(pl) {
  const labels = String(pl.declara || '').split('-').map(s => s.trim().toUpperCase()).filter(Boolean);
  const out = [];
  labels.forEach(l => {
    const meses = CAP_MESES_DE_LABEL[l] != null ? CAP_MESES_DE_LABEL[l] : (/^\d+M$/.test(l) ? parseInt(l, 10) : null);
    if (meses) out.push({ label: l, bucket: CAP_LABEL_A_BUCKET[l] || null, meses });
  });
  out.sort((a, b) => a.meses - b.meses);
  return out;
}
/* Horas-hombre (minutos-persona) promedio por toma, con las frecuencias que entran.
   Devuelve {min, nPers, ok} — ok=false si la hoja de ruta no tiene horas confiables. */
function capCostoToma(entry, frecs) {
  if (!entry || !frecs.length) return { ok: false };
  const pf = entry.porFrec || {};
  const base = pf._base || { trab: 0, np: 0 };
  const cicloM = frecs[0].meses;
  let min = base.trab || 0, np = Math.max(1, entry.nPers || 1, base.np || 0);
  let algo = (base.trab || 0) > 0;
  frecs.forEach(f => {
    const b = f.bucket && pf[f.bucket];
    if (!b || !(b.trab > 0)) return;
    algo = true;
    min += b.trab * (cicloM / f.meses);     // fracción de tomas que incluyen ese paquete
    np = Math.max(np, b.np || 0);
  });
  if (!algo) return { ok: false, nPers: np };
  /* Contadores "SAP MOBILE" que agrupan decenas de equipos: la duración no es de una visita */
  const dur = min / np;
  if (dur > 8 * 60) return { ok: false, nPers: np, agrupa: true };
  return { ok: true, min, nPers: np };
}
/* Cantidad de tomas del plan dentro de [ini, fin) (fechas ISO). */
function capTomasEnMes(pl, frecs, mes) {
  const [y, m] = mes.split('-').map(Number);
  const ini = new Date(y, m - 1, 1), fin = new Date(y, m, 1);
  const cicloM = frecs.length ? frecs[0].meses : (pl.realDias ? pl.realDias / 30.4375 : null);
  if (!cicloM) return 0;
  const cicloDias = cicloM * 30.4375;
  if (!pl.proxima) return (fin - ini) / 86400000 / cicloDias;   // sin fecha: reparto uniforme
  const d = new Date(pl.proxima + 'T12:00:00');
  const paso = k => (cicloM >= 1 && Number.isInteger(cicloM))
    ? new Date(d.getFullYear(), d.getMonth() + k * cicloM, d.getDate(), 12)
    : new Date(d.getTime() + k * cicloDias * 86400000);
  let n = 0;
  for (let k = 0; k < 4000; k++) {
    const t = paso(k);
    if (t >= fin) break;
    if (t >= ini) n++;
  }
  return n;
}
function capFamilia(equipo) { return String(equipo || '').toUpperCase().replace(/[^A-Z].*$/, '').slice(0, 3); }
function capTurnoObligatorio(equipo, texto) {
  if (typeof progClasificar !== 'function') return null;
  try { const r = progClasificar(equipo, texto, ''); return r && r.turno ? (r.turno === 'noche' ? 'noche' : 'dia') : null; }
  catch (e) { return null; }
}
/* Demanda de un mes: {aire:{ots,horas,...}, mecanico:{...}, externo:{ots}, otro:{ots}, detalle:[…]} */
function capDemanda(mes) {
  capIndices();
  const p = capState.params;
  const res = {
    aire: { ots: 0, horas: 0, horasSap: 0, horasEstim: 0, otsSap: 0, otsEstim: 0, dia: 0, noche: 0, libre: 0, porFamilia: {} },
    mecanico: { ots: 0, horas: 0, horasSap: 0, horasEstim: 0, otsSap: 0, otsEstim: 0, dia: 0, noche: 0, libre: 0, porFamilia: {} },
    externo: { ots: 0 }, otro: { ots: 0 }, detalle: [],
  };
  PLANES_SAP.forEach(pl => {
    if (pl.equipoBaja || pl.sinEquipo) return;
    const frecs = capFrecuencias(pl);
    const n = capTomasEnMes(pl, frecs, mes);
    if (!n) return;
    const hp = _capHdrPorPlan.get(pl.plan) || null;
    let gremio = hp ? capGremioDePuesto(hp.puesto) : null;
    if (!gremio) gremio = (typeof progGrupoEquipo === 'function') ? progGrupoEquipo(pl.equipo, null, null) : (capFamilia(pl.equipo) === 'AAC' ? 'aire' : 'mecanico');
    if (gremio === 'externo' || gremio === 'otro') { res[gremio].ots += n; return; }
    const c = hp ? capCostoToma(hp.entry, frecs) : { ok: false };
    let minPersona, nPers, fuente;
    if (c.ok) { minPersona = c.min; nPers = c.nPers; fuente = 'sap'; }
    else {
      const base = (typeof planDuracionEstimada === 'function') ? planDuracionEstimada(pl.desc, pl.equipo) : 90;
      nPers = c.nPers && c.nPers > 0 ? c.nPers : p.persDefault;
      minPersona = base;               // la regla está calibrada para 1 persona: son horas-hombre totales
      fuente = 'estim';
    }
    const horas = n * minPersona / 60;
    const g = res[gremio];
    g.ots += n; g.horas += horas;
    if (fuente === 'sap') { g.horasSap += horas; g.otsSap += n; } else { g.horasEstim += horas; g.otsEstim += n; }
    const t = capTurnoObligatorio(pl.equipo, pl.denomOT || pl.desc) || 'libre';
    g[t] += horas;
    const fam = capFamilia(pl.equipo) || '—';
    const f = g.porFamilia[fam] || (g.porFamilia[fam] = { ots: 0, horas: 0 });
    f.ots += n; f.horas += horas;
    res.detalle.push({ gremio, plan: pl.plan, pos: pl.pos, equipo: pl.equipo, desc: pl.desc, declara: pl.declara, tomas: Math.round(n * 100) / 100,
      hhPorToma: Math.round(minPersona / 6) / 10, personas: nPers, horas: Math.round(horas * 10) / 10, fuente, ruta: hp ? hp.ruta + '/' + hp.cont : '', turno: t });
  });
  return res;
}

/* ═══════════ HISTÓRICO DE CORRECTIVOS (para dimensionar la reserva) ═══════════ */
async function capCargarHist() {
  if (capState.hist) return;
  capState.hist = { ok: false };
  try {
    const r = await fetch('/data/ots-historico.json?t=' + Date.now());
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    const porMes = {};
    const gremioDe = tc => {
      const u = String(tc || '').toUpperCase();
      if (typeof GUARDIAS !== 'undefined') {
        for (const g of GUARDIAS) for (const m of g.miembros) {
          if (u.includes(m.nombre.toUpperCase().replace(/^D'/, "D'"))) {
            const rol = m.rol.toUpperCase();
            return rol.startsWith('TERMO') ? 'aire' : rol.startsWith('MEC') ? 'mecanico' : null;
          }
        }
      }
      return null;
    };
    (d.ots || []).forEach(o => {
      if (o.t !== 'c') return;
      const mes = String(o.f || '').slice(0, 7);
      const g = gremioDe(o.tc);
      const k = porMes[mes] || (porMes[mes] = { n: 0, h: 0, aire: 0, mecanico: 0, sinGremio: 0 });
      k.n++; k.h += o.h || 0; k[g || 'sinGremio'] += o.h || 0;
    });
    capState.hist = { ok: true, actualizado: d.updated, porMes };
  } catch (e) { capState.hist = { ok: false, error: e.message }; }
  capRender();
}
/* Promedio mensual de horas de correctivos de los meses completos (excluye el último cargado). */
function capReservaHistorica() {
  const h = capState.hist;
  if (!h || !h.ok) return null;
  const meses = Object.keys(h.porMes).sort();
  const completos = meses.length > 1 ? meses.slice(0, -1) : meses;
  if (!completos.length) return null;
  const sum = k => completos.reduce((s, m) => s + h.porMes[m][k], 0) / completos.length;
  const tot = sum('aire') + sum('mecanico');
  const sg = sum('sinGremio');
  /* lo que no se puede asignar a un gremio se reparte en proporción */
  const ra = tot ? sum('aire') + sg * sum('aire') / tot : sg / 2;
  const rm = tot ? sum('mecanico') + sg * sum('mecanico') / tot : sg / 2;
  return { aire: ra, mecanico: rm, meses: completos, nOts: completos.reduce((s, m) => s + h.porMes[m].n, 0) / completos.length };
}

/* ═══════════ Vista ═══════════ */
function capMesesSiguientes(n) {
  const hoy = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() + 1 + i, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
}
function capMesLbl(m) { const [y, mo] = m.split('-'); return `${CAP_MESES_LBL[+mo - 1]} ${y}`; }
const capFmtH = h => Math.round(h).toLocaleString('es-AR') + ' h';
const capFmtPct = x => (isFinite(x) ? Math.round(x * 100) : 0) + '%';
function capEsc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

function capEstado(uso, margenH, reservaH) {
  if (margenH < 0) return { k: 'no', txt: 'NO ALCANZA', color: '#dc2626' };
  if (margenH < reservaH) return { k: 'justo', txt: 'ALCANZA, pero sin colchón para reclamos', color: '#f59e0b' };
  return { k: 'ok', txt: 'ALCANZA con colchón', color: '#10b981' };
}
function capAnalisis(mes) {
  const of = capOferta(mes);
  const dem = capDemanda(mes);
  const rh = capReservaHistorica();
  const p = capState.params;
  const out = { mes, of, dem, gremios: {} };
  ['aire', 'mecanico'].forEach(g => {
    const cap = of.netoH[g], carga = dem[g].horas;
    const reserva = (g === 'aire' ? p.reservaAire : p.reservaMec) != null ? (g === 'aire' ? p.reservaAire : p.reservaMec) : (rh ? rh[g] : 0);
    const margen = cap - carga;
    out.gremios[g] = { cap, carga, uso: cap ? carga / cap : 0, margen, reserva, estado: capEstado(carga / (cap || 1), margen, reserva),
      personasNecesarias: of.minNetosTurno && p.diasMes ? carga * 60 / of.minNetosTurno / p.diasMes : 0 };
  });
  return out;
}

function capBarra(uso, color) {
  const w = Math.min(100, Math.round(uso * 100));
  return `<div style="height:8px;background:var(--color-border,#e5e7eb);border-radius:4px;overflow:hidden;min-width:90px"><div style="width:${w}%;height:100%;background:${color}"></div></div>`;
}
function capInput(key, label, extra = {}) {
  const v = capState.params[key];
  return `<label style="display:flex;flex-direction:column;gap:2px;font-size:11.5px;color:var(--color-muted)">${label}
    <input type="number" step="${extra.step || 1}" min="0" value="${v == null ? '' : v}" placeholder="${extra.ph || ''}" style="width:96px;padding:5px 7px;border:1px solid var(--color-border,#d1d5db);border-radius:6px;background:transparent;color:inherit"
      onchange="capSet('${key}', this.value)"></label>`;
}

function capacidadHTML() {
  if (typeof PLANES_SAP === 'undefined' || typeof HDR_DATA === 'undefined' || typeof HDR_PLAN === 'undefined') {
    return '<div class="empty-state"><p>Faltan los maestros de planes / hojas de ruta.</p></div>';
  }
  if (!capState.mes) capState.mes = capMesesSiguientes(1)[0];
  if (!capState.hist) capCargarHist();
  const mes = capState.mes, p = capState.params;
  const A = capAnalisis(mes);
  const meses = capMesesSiguientes(12);
  const nominal = capOferta(mes);
  const rh = capReservaHistorica();
  const grillaLista = !!capGrillaDelMes(mes);

  const card = (g, titulo, tec) => {
    const x = A.gremios[g], d = A.dem[g];
    const e = x.estado;
    const sapPct = d.horas ? d.horasSap / d.horas : 0;
    return `<div class="table-card" style="padding:16px;flex:1;min-width:290px;border-top:4px solid ${e.color}">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><b style="font-size:15px">${titulo}</b><span style="font-size:11px;color:var(--color-muted)">${tec} técnicos · ${nominal.personasTurno[g]} turnos-persona</span></div>
      <div style="margin:8px 0;font-weight:700;color:${e.color}">${e.txt}</div>
      ${capBarra(x.uso, e.color)}
      <div style="font-size:12px;margin-top:4px">Los preventivos usan el <b>${capFmtPct(x.uso)}</b> de las horas netas</div>
      <table style="width:100%;font-size:12.5px;margin-top:10px;border-collapse:collapse">
        <tr><td>Horas brutas (turnos de ${p.turnoHs} h)</td><td style="text-align:right">${capFmtH(A.of.brutoH[g])}</td></tr>
        <tr><td>Horas netas de trabajo</td><td style="text-align:right"><b>${capFmtH(x.cap)}</b></td></tr>
        <tr><td>Carga preventiva del mes (${Math.round(d.ots)} OTs)</td><td style="text-align:right"><b>${capFmtH(x.carga)}</b></td></tr>
        <tr style="border-top:1px solid var(--color-border,#e5e7eb)"><td>Queda para reclamos / correctivos</td><td style="text-align:right;color:${x.margen < 0 ? '#dc2626' : 'inherit'}"><b>${capFmtH(x.margen)}</b></td></tr>
        <tr><td style="color:var(--color-muted)">Reserva estimada necesaria${p[g === 'aire' ? 'reservaAire' : 'reservaMec'] != null ? '' : ' (histórico)'}</td><td style="text-align:right;color:var(--color-muted)">${capFmtH(x.reserva)}</td></tr>
        <tr><td style="color:var(--color-muted)">Margen por técnico y por mes</td><td style="text-align:right;color:var(--color-muted)">${(x.margen / (tec || 1)).toFixed(0)} h</td></tr>
      </table>
      <div style="font-size:11px;color:var(--color-muted);margin-top:8px">${capFmtPct(sapPct)} de las horas salen de la hoja de ruta SAP; el resto está estimado por regla (${Math.round(d.otsEstim)} OTs).</div>
    </div>`;
  };

  const filas = meses.map(m => {
    const a = capAnalisis(m);
    const c = g => { const x = a.gremios[g]; return `<td style="text-align:right">${capFmtH(x.carga)}</td><td style="text-align:right">${capFmtH(x.cap)}</td><td>${capBarra(x.uso, x.estado.color)}</td><td style="text-align:right;color:${x.estado.color};font-weight:600">${capFmtPct(x.uso)}</td><td style="text-align:right;color:${x.margen < 0 ? '#dc2626' : 'inherit'}">${capFmtH(x.margen)}</td>`; };
    return `<tr class="${m === mes ? 'active' : ''}" style="cursor:pointer;${m === mes ? 'background:rgba(0,150,214,.08)' : ''}" onclick="capSetMes('${m}')"><td><b>${capMesLbl(m)}</b></td>${c('aire')}${c('mecanico')}</tr>`;
  }).join('');

  const tabla = `<div class="table-card" style="margin-top:16px"><div style="padding:14px 16px 0"><b>Año móvil: carga preventiva vs. capacidad</b>
    <div style="font-size:11.5px;color:var(--color-muted)">Tocá un mes para ver su detalle. La capacidad de los meses futuros es la nominal (sin francos compensatorios ni vacaciones).</div></div>
    <div class="table-wrap"><table><thead><tr><th rowspan="2">Mes</th><th colspan="5" style="text-align:center">❄️ Aire (AUX_TER)</th><th colspan="5" style="text-align:center">⚙️ Mecánicos (AUX_MEC)</th></tr>
    <tr>${['Carga', 'Capacidad', '', 'Uso', 'Margen'].map(t => `<th style="text-align:right">${t}</th>`).join('').repeat(2)}</tr></thead><tbody>${filas}</tbody></table></div></div>`;

  /* turnos */
  const t = g => {
    const d = A.dem[g], nh = A.of.netoHTurno;
    return `<tr><td>${g === 'aire' ? '❄️ Aire' : '⚙️ Mecánicos'}</td>
      <td style="text-align:right">${capFmtH(d.dia)}</td><td style="text-align:right">${capFmtH(nh.dia[g])}</td><td style="text-align:right;color:${d.dia > nh.dia[g] ? '#dc2626' : 'inherit'}">${capFmtPct(nh.dia[g] ? d.dia / nh.dia[g] : 0)}</td>
      <td style="text-align:right">${capFmtH(d.noche)}</td><td style="text-align:right">${capFmtH(nh.noche[g])}</td><td style="text-align:right;color:${d.noche > nh.noche[g] ? '#dc2626' : 'inherit'}">${capFmtPct(nh.noche[g] ? d.noche / nh.noche[g] : 0)}</td>
      <td style="text-align:right">${capFmtH(d.libre)}</td></tr>`;
  };
  const turnos = `<div class="table-card" style="margin-top:16px"><div style="padding:14px 16px 0"><b>¿Cae en el turno que corresponde? — ${capMesLbl(mes)}</b>
    <div style="font-size:11.5px;color:var(--color-muted)">Hay equipos con turno obligatorio (MEQ y Sala VIP de noche; Roof Top, AVO y oficinas de día). La mitad de la capacidad es de día y la mitad de noche: si la carga obligatoria de un turno supera su capacidad, el resto de las OTs no compensa.</div></div>
    <div class="table-wrap"><table><thead><tr><th></th><th style="text-align:right">Obligatorio día</th><th style="text-align:right">Capacidad día</th><th style="text-align:right">Uso</th><th style="text-align:right">Obligatorio noche</th><th style="text-align:right">Capacidad noche</th><th style="text-align:right">Uso</th><th style="text-align:right">Sin turno fijo</th></tr></thead><tbody>${t('aire')}${t('mecanico')}</tbody></table></div></div>`;

  /* familias */
  const fam = g => {
    const rows = Object.entries(A.dem[g].porFamilia).sort((a, b) => b[1].horas - a[1].horas).slice(0, 8);
    const tot = A.dem[g].horas || 1;
    return `<div style="flex:1;min-width:280px"><b>${g === 'aire' ? '❄️ Aire' : '⚙️ Mecánicos'}: dónde se va el tiempo</b><table style="width:100%;font-size:12.5px;margin-top:6px">${rows.map(([k, v]) => `<tr><td>${capEsc(k)}</td><td style="text-align:right">${Math.round(v.ots)} OTs</td><td style="text-align:right">${capFmtH(v.horas)}</td><td style="text-align:right;color:var(--color-muted)">${capFmtPct(v.horas / tot)}</td></tr>`).join('')}</table></div>`;
  };

  const progInfo = (typeof progState !== 'undefined' && progState.otsMes === mes && progState.ots && progState.ots.length)
    ? (() => { const a = progState.ots.filter(o => o.grupo === 'aire').length, m = progState.ots.filter(o => o.grupo === 'mecanico').length;
        return `<div style="font-size:12px;margin-top:10px;padding:8px 12px;background:rgba(0,150,214,.08);border-radius:6px">📌 Contraste: la página <b>Programación</b> tiene cargadas <b>${progState.ots.length} OTs</b> reales de ${capMesLbl(mes)} (Aire ${a}, Mecánicos ${m}); esta proyección desde los planes da Aire ${Math.round(A.dem.aire.ots)} y Mecánicos ${Math.round(A.dem.mecanico.ots)}.</div>`; })()
    : '';

  const histTxt = rh
    ? `Reserva histórica: promedio de ${rh.meses.map(m => capMesLbl(m)).join(' y ')} en <code>ots-historico.json</code> (${Math.round(rh.nOts)} correctivas/mes; Aire ${capFmtH(rh.aire)}, Mecánicos ${capFmtH(rh.mecanico)} de horas cargadas). El tiempo de un reclamo sin OT no está ahí.`
    : (capState.hist && capState.hist.ok === false ? 'No se pudo leer el histórico de correctivas: cargá la reserva a mano.' : 'Cargando histórico de correctivas…');

  return `<div id="cap-root">
    <div class="table-card" style="padding:16px">
      <b style="font-size:15px">⏱️ ¿Alcanza el personal para las OTs preventivas del plan?</b>
      <div style="font-size:12.5px;color:var(--color-muted);margin:4px 0 12px">Compara las horas-hombre que piden las hojas de ruta de SAP contra las horas netas que tienen los técnicos (turnos de 12 h, sin almuerzo, descansos ni recorridas). Lo que sobra es el tiempo para reclamos, correctivos, etc.</div>
      <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end">
        <label style="display:flex;flex-direction:column;gap:2px;font-size:11.5px;color:var(--color-muted)">Mes a analizar
          <select onchange="capSetMes(this.value)" style="padding:5px 7px;border:1px solid var(--color-border,#d1d5db);border-radius:6px;background:transparent;color:inherit">${meses.map(m => `<option value="${m}"${m === mes ? ' selected' : ''}>${capMesLbl(m)}</option>`).join('')}</select></label>
        ${capInput('tecAire', 'Técnicos Aire')}${capInput('tecMec', 'Técnicos Mecánicos')}${capInput('diasMes', 'Días trabajados/mes')}${capInput('turnoHs', 'Horas por turno')}
        ${capInput('almuerzoMin', 'Almuerzo/cena (min)')}${capInput('descansoMin', 'Descansos (min)')}${capInput('recorridasMin', 'Recorridas (min)')}${capInput('eficiencia', 'Eficiencia (%)')}
        ${capInput('persDefault', 'Personas por OT sin dato')}
        ${capInput('reservaAire', 'Reserva Aire (h/mes)', { ph: rh ? Math.round(rh.aire) : '' })}${capInput('reservaMec', 'Reserva Mec. (h/mes)', { ph: rh ? Math.round(rh.mecanico) : '' })}
        <div style="display:flex;flex-direction:column;gap:3px"><span style="font-size:11.5px;color:var(--color-muted)">Dotación</span>
          <button class="mant-tab${p.usarGrilla && grillaLista ? ' active' : ''}" ${capState.cargandoGrilla ? 'disabled' : ''} onclick="capUsarGrilla()">${capState.cargandoGrilla ? 'Consultando…' : (p.usarGrilla && grillaLista ? '✓ Grilla real del mes' : '🔄 Usar grilla real del mes')}</button></div>
        <button class="mant-tab" onclick="capReset()">↺ Valores por defecto</button>
        <button class="mant-tab" onclick="capExport()">⬇ Excel</button>
      </div>
      <div style="font-size:11.5px;color:var(--color-muted);margin-top:10px">Horas netas por turno: <b>${(A.of.minNetosTurno / 60).toFixed(1)} h</b> (${p.turnoHs} h − ${p.almuerzoMin} almuerzo − ${p.descansoMin} descanso − ${p.recorridasMin} recorridas, × ${p.eficiencia}%). Dotación: <b>${A.of.fuente === 'grilla' ? 'real de la Grilla Inteligente (francos y vacaciones descontados)' : 'nominal (' + p.tecAire + ' + ' + p.tecMec + ' técnicos × ' + p.diasMes + ' días)'}</b>.</div>
      <div style="font-size:11.5px;color:var(--color-muted);margin-top:4px">${histTxt}</div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:16px;margin-top:16px">${card('aire', '❄️ Técnicos de Aire · AUX_TER', p.tecAire)}${card('mecanico', '⚙️ Técnicos Mecánicos · AUX_MEC', p.tecMec)}</div>
    ${progInfo}
    ${tabla}${turnos}
    <div class="table-card" style="margin-top:16px;padding:16px;display:flex;flex-wrap:wrap;gap:24px">${fam('aire')}${fam('mecanico')}</div>
    <div class="table-card" style="margin-top:16px;padding:14px 16px;font-size:12px;color:var(--color-muted);line-height:1.55">
      <b style="color:inherit">Cómo se calculó / límites</b><ul style="margin:6px 0 0 18px">
        <li>${Math.round(A.dem.externo.ots)} OTs del mes son de contratista (MOEX) y ${Math.round(A.dem.otro.ots)} de otro gremio (AUX_ELC / AUX_INF): no cuentan contra estos técnicos.</li>
        <li>Horas-hombre = las de la hoja de ruta (IA17) por persona × tareas base + tareas de cada frecuencia que entra en esa toma. Cuando el plan mezcla frecuencias (2M-6M-12M) se usa el costo promedio del ciclo, porque no se sabe en qué vuelta va cada equipo: un mes puntual puede cargar más o menos.</li>
        <li>Si la hoja de ruta no trae horas confiables se usa la regla del Planificador (${Math.round(A.dem.aire.otsEstim + A.dem.mecanico.otsEstim)} OTs) — es la parte menos firme del estudio.</li>
        <li>No se descuenta el ahorro de tocar un sistema completo de aire en una sola visita, ni se suma el traslado entre equipos: la eficiencia (${p.eficiencia}%) es el único colchón para eso.</li>
        <li>Los supervisores no cuentan como mano de obra. Las vencidas sin OT no están sumadas a la carga.</li></ul></div>
  </div>`;
}

function capRender() {
  const host = document.querySelector('#auditoria-content [data-pane="capacidad"]');
  if (host) host.innerHTML = capacidadHTML();
}
function capSet(k, v) {
  const n = v === '' || v == null ? null : Number(v);
  if (n != null && !isFinite(n)) return;
  capState.params[k] = n == null && !/^reserva/.test(k) ? capParamsDefault()[k] : n;
  if (k !== 'usarGrilla') capState.params.usarGrilla = capState.params.usarGrilla && ['tecAire', 'tecMec', 'diasMes'].indexOf(k) < 0;
  capSaveParams(); capRender();
}
function capSetMes(m) { capState.mes = m; capState.params.usarGrilla = false; capRender(); }
function capUsarGrilla() { capTraerGrilla(capState.mes); }
function capReset() { capState.params = capParamsDefault(); capSaveParams(); capRender(); }

function capExport() {
  if (typeof XLSX === 'undefined') { alert('Falta la librería XLSX.'); return; }
  const wb = XLSX.utils.book_new();
  const rows = [];
  capMesesSiguientes(12).forEach(m => {
    const a = capAnalisis(m);
    ['aire', 'mecanico'].forEach(g => { const x = a.gremios[g];
      rows.push({ Mes: m, Gremio: g === 'aire' ? 'Aire (AUX_TER)' : 'Mecánicos (AUX_MEC)', 'OTs del mes': Math.round(a.dem[g].ots), 'Carga preventiva (h)': Math.round(x.carga), 'Horas netas disponibles': Math.round(x.cap),
        'Uso %': Math.round(x.uso * 100), 'Margen p/ reclamos (h)': Math.round(x.margen), 'Reserva necesaria (h)': Math.round(x.reserva), Estado: x.estado.txt }); });
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Resumen anual');
  const det = capDemanda(capState.mes).detalle.sort((a, b) => b.horas - a.horas);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(det.map(d => ({ Gremio: d.gremio, Equipo: d.equipo, Plan: d.plan, Posición: d.pos, Descripción: d.desc, Frecuencias: d.declara, 'Tomas en el mes': d.tomas, 'HH por toma': d.hhPorToma, Personas: d.personas, 'Horas del mes': d.horas, Fuente: d.fuente === 'sap' ? 'Hoja de ruta SAP' : 'Estimada', 'Hoja de ruta': d.ruta, Turno: d.turno }))), 'Detalle ' + capState.mes);
  XLSX.writeFile(wb, `capacidad-vs-carga-${capState.mes}.xlsx`);
}
