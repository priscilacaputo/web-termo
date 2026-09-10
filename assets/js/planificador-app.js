/* ─── Planificador real de OTs ─────────────────────────────────────────
   Calendario mensual → cada OT queda con fecha, guardia, turno y franja
   horaria. Respeta:
     · Turnos de 12 h: Mañana 06:00–18:00 · Tarde 18:00–06:00 (clave
       interna del turno Tarde = `noche`).
     · Reglas de turno: MEQ → tarde · AVO → mañana · Roof Top → mañana ·
       Sala VIP → tarde (regla nueva de este planificador).
     · Rotación de guardias del mes (editor de calendario propio).
     · Altura repartida lo más pareja posible entre las 4 guardias.
     · Cercanía física: las OTs de una misma guardia-día se agrupan por
       zona / ubicación técnica y las cintas por línea contigua.
     · Primeras 2 h del turno = recorridas · almuerzo/cena · un descanso.
     · Cupo real de cada guardia = minutos útiles del turno × Nº técnicos
       del gremio (Aire = TERMO*, Mecánicos = MEC*) de esa guardia.
   Las OTs del patio de valijas (MEQ) se IMPORTAN del export de la app
   "Plan Maestro BHS" (patio-de-valijas-aep.vercel.app): ya vienen con
   fecha / hora / línea propuesta; acá sólo se ubican y se les pone la
   guardia de noche que corresponde a esa fecha.
   Todo editable a mano (drag & drop) y se pueden sumar preventivos que
   surgen en el momento. Persiste en localStorage. */

/* ════════ Estado ════════ */
let planState = {
  mes: '',
  rotacion: {},          // "YYYY-MM-DD" → { manana: 1..4|null, noche: 1..4|null }
  grilla: {},            // "YYYY-MM-DD" → { manana:{g,aire,mec,sup,ausentes}, noche:{...} } (Grilla Inteligente)
  cfg: JSON.parse(JSON.stringify(PLAN_DIA_TEMPLATE)),
  hidrolavado: false,
  ots: [],               // ver planNormalizarItem()
};
let planDiaSel = null;    // "YYYY-MM-DD" mostrado en el panel del día
let planHist = { porOt: {}, porEquipo: {} };   // antigüedad desde el historial
let planGrillaCargando = false;

function planLoad() {
  try {
    const raw = localStorage.getItem(PLAN_STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && Array.isArray(p.ots)) {
        planState = Object.assign(planState, p);
        if (!planState.cfg) planState.cfg = JSON.parse(JSON.stringify(PLAN_DIA_TEMPLATE));
        if (!planState.rotacion) planState.rotacion = {};
        if (!planState.grilla) planState.grilla = {};
      }
    }
  } catch (e) { /* arranque limpio */ }
}
function planSave() {
  try { localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(planState)); }
  catch (e) { planToast('⚠ No se pudo guardar en este navegador.', 'error'); }
}
function planToast(msg, type = 'success') {
  if (typeof progToast === 'function') return progToast(msg, type);
  alert(msg);
}

/* ════════ Utilidades de tiempo ════════ */
function planHHMMtoMin(hhmm) {
  const m = String(hhmm || '').match(/(\d{1,2}):(\d{2})/);
  return m ? (+m[1]) * 60 + (+m[2]) : 0;
}
function planMinToHHMM(min) {
  min = ((Math.round(min) % 1440) + 1440) % 1440;
  const h = Math.floor(min / 60), m = min % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}
/* minuto absoluto (0..1439) → minuto relativo al arranque del turno (0..dur) */
function planRelDesdeInicio(absMin, inicioTurnoMin) {
  return ((absMin - inicioTurnoMin) % 1440 + 1440) % 1440;
}
function planDurTurno(turnoCfg) {
  const a = planHHMMtoMin(turnoCfg.inicio), b = planHHMMtoMin(turnoCfg.fin);
  return ((b - a) % 1440 + 1440) % 1440 || 1440;
}
/* Intervalos [ini,fin] (relativos al arranque del turno, en minutos) en
   los que la guardia SÍ puede intervenir equipos (fuera de recorridas,
   almuerzo y descanso). */
function planTramosLibres(turno) {
  const cfg = planState.cfg[turno];
  const dur = planDurTurno(cfg);
  const ini = planHHMMtoMin(cfg.inicio);
  const ocupados = [[0, Math.min(cfg.recorridasMin || 0, dur)]];
  [cfg.almuerzo, cfg.descanso].forEach(b => {
    if (!b || !b.min) return;
    const r = planRelDesdeInicio(planHHMMtoMin(b.inicio), ini);
    ocupados.push([r, Math.min(r + b.min, dur)]);
  });
  ocupados.sort((x, y) => x[0] - y[0]);
  const libres = [];
  let cursor = 0;
  ocupados.forEach(([a, b]) => {
    if (a > cursor) libres.push([cursor, a]);
    cursor = Math.max(cursor, b);
  });
  if (cursor < dur) libres.push([cursor, dur]);
  return libres.filter(([a, b]) => b - a > 0);
}
function planMinutosUtiles(turno) {
  return planTramosLibres(turno).reduce((s, [a, b]) => s + (b - a), 0);
}

/* ════════ Guardias / grilla virtual ════════ */
const PLAN_TURNO_DEFAULT = { aire: 'manana', mecanico: 'noche' };

/* Dotación fija de la guardia (composición nominal, sin francos). */
function planTecnicosGuardia(gid, gremio) {
  if (typeof GUARDIAS === 'undefined') return 3;
  const g = GUARDIAS.find(x => x.id === gid);
  if (!g) return 0;
  return g.miembros.filter(m => {
    const r = m.rol.toUpperCase();
    return gremio === 'aire' ? r.startsWith('TERMO') : r.startsWith('MEC');
  }).length;
}
/* Técnicos que REALMENTE trabajan ese día/turno/gremio. Usa la dotación
   de la Grilla Inteligente (presentes, ya descontados francos y
   vacaciones) si está cargada para esa fecha; si no, cae en la
   composición nominal de la guardia. */
function planPresentes(fecha, turno, gremio) {
  const g = planState.grilla && planState.grilla[fecha] && planState.grilla[fecha][turno];
  if (g && g[gremio] != null) return g[gremio];
  return planTecnicosGuardia(planGuardiaDe(fecha, turno), gremio);
}
/* Cupo (minutos-persona) de una guardia-día-turno para un gremio. */
function planCupoDia(fecha, turno, gremio) {
  return planMinutosUtiles(turno) * planPresentes(fecha, turno, gremio);
}

/* ════════ Grilla Inteligente (rotación + dotación real) ════════
   Se consulta vía el proxy /api/grilla (el navegador no puede pegarle
   directo por CORS). monthly-summary da la rotación del mes; una llamada
   daily por día da presentes por especialidad. */
function planGremioDeSpecialty(s) {
  const u = String(s || '').toUpperCase();
  if (u.startsWith('TERMO')) return 'aire';
  if (u.startsWith('MEC')) return 'mecanico';
  if (u.startsWith('SUP')) return 'sup';
  return null;
}
async function planTraerGrilla(mes) {
  mes = mes || planState.mes;
  const m = String(mes).match(/(\d{4})-(\d{2})/);
  if (!m) { planToast('Elegí un mes primero.', 'error'); return; }
  const year = +m[1], month = +m[2];
  planGrillaCargando = true;
  renderPlanRotacion();
  try {
    const resp = await fetch(`/api/grilla?year=${year}&month=${month}`);
    const j = await resp.json();
    if (!j || !j.success || !j.data || !Array.isArray(j.data.days)) {
      throw new Error((j && j.error) || 'respuesta inesperada');
    }
    j.data.days.forEach(d => {
      if (d.day && d.day.guardNumber) (planState.rotacion[d.date] = planState.rotacion[d.date] || {}).manana = d.day.guardNumber;
      if (d.night && d.night.guardNumber) (planState.rotacion[d.date] = planState.rotacion[d.date] || {}).noche = d.night.guardNumber;
    });
    /* Dotación real por día (presentes por especialidad). En paralelo. */
    const dias = j.data.days.map(d => d.date);
    const daily = await Promise.all(dias.map(fecha =>
      fetch(`/api/grilla?date=${fecha}`).then(r => r.json()).then(x => ({ fecha, x })).catch(() => ({ fecha, x: null }))
    ));
    daily.forEach(({ fecha, x }) => {
      if (!x || !x.success || !x.data || !Array.isArray(x.data.guards)) return;
      const slot = { manana: null, noche: null };
      x.data.guards.forEach(gd => {
        if (!gd.worksToday) return;
        const turno = String(gd.shiftType || '').toUpperCase() === 'NOCHE' ? 'noche' : 'manana';
        const cnt = { g: gd.guardNumber, aire: 0, mecanico: 0, sup: 0, ausentes: 0 };
        (gd.members || []).forEach(mm => {
          const gr = planGremioDeSpecialty(mm.specialty);
          const trabaja = String(mm.status || '').toUpperCase() === 'TRABAJO';
          if (!trabaja) { cnt.ausentes++; return; }
          if (gr === 'aire') cnt.aire++;
          else if (gr === 'mecanico') cnt.mecanico++;
          else if (gr === 'sup') cnt.sup++;
        });
        slot[turno] = cnt;
      });
      planState.grilla[fecha] = slot;
    });
    planGrillaCargando = false;
    planDistribuir();
    planSave();
    renderPlanificador();
    planToast(`✓ Rotación y dotación traídas de la Grilla Inteligente (${dias.length} días).`, 'success');
  } catch (err) {
    planGrillaCargando = false;
    renderPlanRotacion();
    planToast('❌ No se pudo traer la grilla: ' + err.message, 'error');
  }
}

/* ════════ Rotación del mes ════════ */
function planDiasDelMes(mes) {
  const m = String(mes || '').match(/(\d{4})-(\d{2})/);
  if (!m) return [];
  const y = +m[1], mo = +m[2];
  const n = new Date(y, mo, 0).getDate();
  const out = [];
  for (let d = 1; d <= n; d++) {
    out.push(`${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }
  return out;
}
function planGuardiaDe(fecha, turno) {
  const r = planState.rotacion[fecha];
  return r ? (r[turno] || null) : null;
}
/* Aplica un patrón repetitivo: desde una fecha ancla, la guardia de
   mañana y de noche rotan +1 cada N días (ciclo). Sobrescribe todo el
   mes; después se editan días sueltos a mano. */
function planAplicarPatron(ancla, gManana, gNoche, ciclo) {
  const dias = planDiasDelMes(planState.mes);
  if (!dias.length) return;
  const base = new Date(ancla + 'T00:00:00');
  ciclo = Math.max(1, ciclo | 0);
  dias.forEach(f => {
    const dif = Math.floor((new Date(f + 'T00:00:00') - base) / 86400000);
    const off = Math.floor((dif % (ciclo * 4) + (ciclo * 4)) % (ciclo * 4) / ciclo);
    planState.rotacion[f] = {
      manana: ((gManana - 1 + off) % 4) + 1,
      noche: ((gNoche - 1 + off) % 4) + 1,
    };
  });
}

/* ════════ Normalización de una OT ════════ */
function planFamilia(equipo) { return String(equipo || '').toUpperCase().slice(0, 3); }

function planClasificarTurno(equipo, textoOT) {
  if (planEsSalaVIP(equipo, textoOT)) return { regla: 'Sala VIP', turno: 'noche' };
  if (typeof progClasificar === 'function') {
    const c = progClasificar(equipo, textoOT, '');
    if (c.turno) return { regla: c.regla, turno: c.turno === 'mañana' ? 'manana' : 'noche' };
  }
  const fam = planFamilia(equipo);
  if (fam === 'MEQ') return { regla: 'MEQ', turno: 'noche' };
  if (fam === 'AVO') return { regla: 'AVO', turno: 'manana' };
  return { regla: null, turno: null };
}
function planGremio(equipo, regla) {
  if (typeof progGrupoEquipo === 'function') return progGrupoEquipo(equipo, null, regla);
  return planFamilia(equipo) === 'AAC' ? 'aire' : 'mecanico';
}
function planEsAltura(equipo) {
  const eq = String(equipo || '').toUpperCase();
  if (typeof ALTURA_EQUIPOS === 'undefined' || !ALTURA_EQUIPOS.has(eq)) return false;
  if (!planState.hidrolavado && typeof ALTURA_HIDROLAVADO !== 'undefined' && ALTURA_HIDROLAVADO.has(eq)) return false;
  return true;
}
function planZona(equipo) {
  return (typeof progZonaEquipo === 'function') ? progZonaEquipo(equipo, '') : 'General';
}
function planUbicTecnica(equipo) {
  return (typeof progUbicacionTecnicaEquipo === 'function') ? progUbicacionTecnicaEquipo(equipo, '') : 'SIN UBICACIÓN';
}
function planAntiguedadDias(otNum, equipo) {
  const hoy = Date.now();
  let f = planHist.porOt[String(otNum || '')];
  if (!f) f = planHist.porEquipo[String(equipo || '').toUpperCase()];
  if (!f) return null;
  const d = Math.round((hoy - new Date(f).getTime()) / 86400000);
  return d >= 0 ? d : null;
}

/* Construye un item de OT a partir de una fila cruda (Excel mensual o
   alta manual). `origen`: 'mensual' | 'adhoc'. */
function planNormalizarItem(raw, origen) {
  const equipo = String(raw.equipo || '').trim().toUpperCase();
  const texto = String(raw.texto || raw.denom || '').trim();
  const otNum = raw.ot_num ? String(raw.ot_num).trim() : '';
  const { regla, turno } = planClasificarTurno(equipo, texto);
  const gremio = planGremio(equipo, regla);
  const denom = texto || ((typeof progGetEquipoIndex === 'function' &&
    progGetEquipoIndex()[equipo] && progGetEquipoIndex()[equipo].denominacion) || '');
  const tipo = /^\s*(atenci|reparar|correctivo|falla|emergencia|cambio)/i.test(texto) ? 'correctivo' : 'preventivo';

  /* Duración y Nº de personas reales desde la Hoja de Ruta de SAP
     (hdr-data.js): equipo → PLANES_SAP → hoja de ruta → duración por
     frecuencia. Si no hay match, se estima por regla. La duración cargada
     a mano (raw.duracionMin: alta manual, o import del patio) manda. */
  const hd = (typeof hdrParaEquipo === 'function') ? hdrParaEquipo(equipo, texto) : null;
  let duracionMin, durFuente;
  if (raw.duracionMin != null) { duracionMin = +raw.duracionMin; durFuente = origen === 'patio' ? 'patio' : 'manual'; }
  else if (hd && hd.durMin != null) { duracionMin = hd.durMin; durFuente = 'sap'; }
  else { duracionMin = planDuracionEstimada(texto, equipo); durFuente = 'estim'; }
  const nPers = raw.nPers != null ? Math.max(1, +raw.nPers) : (hd ? Math.max(1, hd.nPers) : 1);

  return {
    id: raw.id || (equipo + '#' + otNum + '#' + Math.random().toString(36).slice(2, 8)),
    ot_num: otNum, equipo, denom,
    origen, tipo,
    regla, turno: turno || null,
    gremio,
    esAltura: raw.esAltura != null ? !!raw.esAltura : planEsAltura(equipo),
    zona: planZona(equipo),
    ubicacionTecnica: planUbicTecnica(equipo),
    numSecuenciaCinta: (typeof progNumeroSecuenciaCinta === 'function' && equipo.startsWith('MEQ'))
      ? progNumeroSecuenciaCinta(denom) : null,
    duracionMin, durFuente, nPers,
    hdrRuta: hd ? hd.ruta : null,
    antiguedadDias: planAntiguedadDias(otNum, equipo),
    /* patio (Plan Maestro BHS) */
    linea: raw.linea || null,
    nivelPatio: raw.nivelPatio || null,
    motivoPatio: raw.motivoPatio || null,
    /* asignación */
    fecha: raw.fecha || null,
    guardia: raw.guardia || null,
    inicio: raw.inicio || null,
    fin: raw.fin || null,
    pin: !!raw.pin,           // fijada a mano (no la mueve el reparto)
    motivoSinUbicar: null,
  };
}

/* ════════ Carga del Excel mensual de OTs ════════ */
const PLAN_ALIASES_MES = {
  'equipo': 'equipo', 'código de equipo': 'equipo', 'codigo de equipo': 'equipo',
  'objeto técnico': 'objeto_tecnico', 'objeto tecnico': 'objeto_tecnico',
  'denominación': 'denom', 'denominacion': 'denom',
  'denominación de objeto técnico': 'denom', 'denominacion de objeto tecnico': 'denom',
  'descripción': 'denom', 'descripcion': 'denom',
  'texto breve': 'texto', 'texto breve de la orden': 'texto', 'texto breve orden': 'texto',
  'denominación de la orden': 'texto', 'clase de orden': 'texto',
  'orden': 'ot_num', 'ot': 'ot_num', 'n° de orden': 'ot_num', 'número de orden': 'ot_num',
  'nº orden': 'ot_num', 'no orden': 'ot_num',
};
function planLeerFilas(rows, aliases) {
  return rows.map(row => {
    const obj = {};
    Object.entries(row).forEach(([h, v]) => {
      const k = aliases[String(h).trim().toLowerCase()];
      if (k) obj[k] = (v == null) ? '' : (v instanceof Date ? v : String(v).trim());
    });
    if (obj.objeto_tecnico) {
      const cod = (typeof extractEquipoCode === 'function') ? extractEquipoCode(obj.objeto_tecnico) : String(obj.objeto_tecnico).toUpperCase();
      if (cod) obj.equipo = cod;
      if (!obj.denom && typeof extractEquipoDesc === 'function') obj.denom = extractEquipoDesc(obj.objeto_tecnico);
    }
    if (obj.ot_num && typeof extractOTNum === 'function') obj.ot_num = extractOTNum(obj.ot_num);
    return obj;
  }).filter(o => String(o.equipo || '').trim() !== '');
}
function planHandleFileMensual(file) {
  if (typeof XLSX === 'undefined') { planToast('❌ Falta la librería para leer Excel.', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const wb = XLSX.read(e.target.result, { type: 'array' });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
      const filas = planLeerFilas(rows, PLAN_ALIASES_MES);
      if (!filas.length) {
        planToast('❌ No encontré la columna "Objeto técnico" ni "Equipo".\nColumnas: ' + Object.keys(rows[0] || {}).join(', '), 'error');
        return;
      }
      /* Conserva las OTs de patio ya importadas y las asignaciones
         manuales (pin) de equipos que vuelvan a venir. */
      const pinPorClave = {};
      planState.ots.forEach(o => {
        if (o.pin) pinPorClave[o.equipo + '|' + o.ot_num] = o;
      });
      const patio = planState.ots.filter(o => o.origen === 'patio');
      const nuevas = filas.map(f => {
        const it = planNormalizarItem(f, 'mensual');
        const prev = pinPorClave[it.equipo + '|' + it.ot_num];
        if (prev) Object.assign(it, { fecha: prev.fecha, guardia: prev.guardia, inicio: prev.inicio, fin: prev.fin, pin: true, duracionMin: prev.duracionMin });
        return it;
      });
      planState.ots = [...nuevas, ...patio];
      if (!planState.mes) planState.mes = document.getElementById('plan-mes-input').value || new Date().toISOString().slice(0, 7);
      planDistribuir();
      planSave();
      renderPlanificador();
      planToast(`✓ ${nuevas.length} OTs del mes cargadas y distribuidas.`, 'success');
    } catch (err) {
      planToast('❌ Error al leer el archivo: ' + err.message, 'error');
    }
  };
  reader.readAsArrayBuffer(file);
}

/* ════════ Importar el plan del patio (Plan Maestro BHS) ════════ */
const PLAN_ALIASES_PATIO = {
  'ot': 'ot_num', 'orden': 'ot_num', 'orden sap': 'ot_num', 'n° ot': 'ot_num', 'nº ot': 'ot_num',
  'equipo': 'equipo', 'código': 'equipo', 'codigo': 'equipo',
  'línea': 'linea', 'linea': 'linea',
  'inicio propuesto': 'inicio', 'inicio': 'inicio', 'desde': 'inicio',
  'fin propuesto': 'fin', 'fin': 'fin', 'hasta': 'fin',
  'nivel': 'nivel', 'compatibilidad': 'nivel',
  'motivo': 'motivo', 'detalle': 'motivo',
  'duración': 'durMin', 'duracion': 'durMin', 'duración (min)': 'durMin', 'duracion (min)': 'durMin', 'duracionmin': 'durMin',
};
function planParseFechaHora(v) {
  if (v instanceof Date && !isNaN(v)) return (v.getFullYear() > 2000 && v.getFullYear() < 2100) ? v : null;
  const s = String(v || '').trim();
  if (!s) return null;
  let m = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ ,T]+(\d{1,2}):(\d{2}))?/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0));
  m = s.match(/(\d{4})-(\d{2})-(\d{2})(?:[ ,T]+(\d{1,2}):(\d{2}))?/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
  const d = new Date(s);
  return (!isNaN(d) && d.getFullYear() > 2000 && d.getFullYear() < 2100) ? d : null;
}
function planFechaISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
/* CSV mínimo (comillas dobles + comas). Devuelve filas como objetos con
   los headers de la primera línea. */
function planParseCSV(text) {
  const rows = [];
  let row = [], cur = '', q = false;
  const t = String(text || '').replace(/\r\n?/g, '\n');
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) {
      if (c === '"') { if (t[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else cur += c;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  if (!rows.length) return [];
  const head = rows[0].map(h => h.trim());
  return rows.slice(1).filter(r => r.some(c => String(c).trim() !== '')).map(r => {
    const o = {};
    head.forEach((h, i) => { o[h] = (r[i] != null ? String(r[i]).trim() : ''); });
    return o;
  });
}
function planHandleFilePatio(file) {
  if (typeof XLSX === 'undefined') { planToast('❌ Falta la librería para leer Excel/CSV.', 'error'); return; }
  const esCsv = /\.csv$/i.test(file.name);
  const reader = new FileReader();
  reader.onload = e => {
    try {
      let rows;
      if (esCsv) {
        rows = planParseCSV(e.target.result);
      } else {
        const wb = XLSX.read(e.target.result, { type: 'array', cellDates: true });
        rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '', raw: false });
      }
      const filas = rows.map(row => {
        const obj = {};
        Object.entries(row).forEach(([h, v]) => {
          const k = PLAN_ALIASES_PATIO[String(h).trim().toLowerCase()];
          if (k) obj[k] = v;
        });
        return obj;
      }).filter(o => String(o.equipo || '').trim() || String(o.ot_num || '').trim());
      if (!filas.length) {
        planToast('❌ No reconozco el formato. Esperaba columnas OT / Equipo / Línea / Inicio propuesto / Fin propuesto / Nivel.', 'error');
        return;
      }
      const items = [];
      let incompat = 0;
      filas.forEach(f => {
        const equipo = String(f.equipo || '').trim().toUpperCase();
        const nivel = PLAN_NIVEL_PATIO[String(f.nivel || '').trim().toLowerCase()] || (f.nivel ? 'condiciones' : null);
        const dIni = planParseFechaHora(f.inicio);
        const dFin = planParseFechaHora(f.fin);
        const it = planNormalizarItem({
          equipo, ot_num: f.ot_num, texto: '', denom: '',
          esAltura: planEsAltura(equipo),
          duracionMin: f.durMin ? +f.durMin : (dIni && dFin ? Math.max(15, Math.round((dFin - dIni) / 60000)) : planDuracionEstimada('', equipo)),
          linea: f.linea ? String(f.linea).trim() : null,
          nivelPatio: nivel,
          motivoPatio: f.motivo ? String(f.motivo).trim() : null,
        }, 'patio');
        it.regla = 'MEQ'; it.turno = 'noche'; it.gremio = 'mecanico';
        if (dIni) {
          it.fecha = planFechaISO(dIni);
          it.inicio = planMinToHHMM(dIni.getHours() * 60 + dIni.getMinutes());
          if (dFin) it.fin = planMinToHHMM(dFin.getHours() * 60 + dFin.getMinutes());
        }
        if (nivel === 'incompatible') incompat++;
        items.push(it);
      });
      const noPatio = planState.ots.filter(o => o.origen !== 'patio');
      planState.ots = [...noPatio, ...items];
      if (!planState.mes && items[0] && items[0].fecha) planState.mes = items[0].fecha.slice(0, 7);
      planDistribuir();
      planSave();
      renderPlanificador();
      planToast(`✓ ${items.length} OTs de patio importadas${incompat ? ` · ${incompat} sin ventana (a "Sin ubicar")` : ''}.`, 'success');
    } catch (err) {
      planToast('❌ Error al leer el archivo: ' + err.message, 'error');
    }
  };
  if (esCsv) reader.readAsText(file, 'utf-8'); else reader.readAsArrayBuffer(file);
}

/* ════════ Motor de distribución ════════ */
function planDistribuir() {
  const dias = planDiasDelMes(planState.mes);
  const hayRot = dias.some(f => planState.rotacion[f]);

  /* Estado por guardia-día-gremio: lanes (una por técnico) con su cursor
     a lo largo de los tramos libres del turno. */
  const laneCache = {};
  const minDiaG = {};        // "fecha|guardia|gremio" → minutos ya asignados ese día
  function laneState(fecha, guardia, turno, gremio) {
    const key = `${fecha}|${guardia}|${gremio}`;
    if (!laneCache[key]) {
      const n = Math.max(1, planPresentes(fecha, turno, gremio));
      const libres = planTramosLibres(turno);
      laneCache[key] = {
        turno,
        lanes: Array.from({ length: n }, () => ({ libres: libres.map(x => x.slice()), cursor: 0 })),
        zonas: {}, ubic: {},
      };
    }
    return laneCache[key];
  }
  /* Ubica `dur` minutos de trabajo efectivo en un lane (técnico) a partir
     de `cursor`, saltando los cortes (recorridas / almuerzo / descanso).
     Una OT larga puede "pausarse" en un corte y seguir después: cuenta
     sólo minutos útiles, pero su reloj de fin queda más tarde. */
  function fitLane(libresTramos, cursor, dur) {
    let need = dur, ini = null, pos = cursor;
    for (const [a, b] of libresTramos) {
      const s = Math.max(a, pos);
      if (s >= b) continue;
      if (ini === null) ini = s;
      const avail = b - s;
      if (avail >= need) return { ini, fin: s + need };
      need -= avail; pos = b;
    }
    return null;   // no entra en el día
  }
  /* Ubica una OT que necesita `nPers` técnicos en paralelo por `dur`
     minutos. Toma los `nPers` lanes que liberan antes y arranca cuando
     todos están libres. Todos los tramos libres son iguales entre lanes
     (mismos cortes), así que basta fittear desde el cursor más tardío de
     los elegidos. Devuelve {ini,fin,nPers} (rel. al arranque del turno)
     o null si no entra en el día. */
  function colocar(ls, dur, nPers) {
    nPers = Math.max(1, Math.min(nPers || 1, ls.lanes.length));
    const orden = ls.lanes.map((l, i) => ({ i, c: l.cursor })).sort((a, b) => a.c - b.c);
    const elegidos = orden.slice(0, nPers);
    const desde = elegidos[elegidos.length - 1].c;
    const r = fitLane(ls.lanes[elegidos[0].i].libres, desde, dur);
    if (!r) return null;
    elegidos.forEach(o => { ls.lanes[o.i].cursor = r.fin; });
    return { ini: r.ini, fin: r.fin, nPers };
  }
  /* Reserva (aprox.) el hueco de una OT ya ubicada a mano: adelanta el
     cursor de los `nPers` lanes menos cargados hasta iniRel+dur. */
  function reservar(ls, iniRel, dur, nPers) {
    nPers = Math.max(1, Math.min(nPers || 1, ls.lanes.length));
    ls.lanes.map((l, i) => ({ i, c: l.cursor })).sort((a, b) => a.c - b.c)
      .slice(0, nPers).forEach(o => { ls.lanes[o.i].cursor = Math.max(ls.lanes[o.i].cursor, iniRel + dur); });
  }
  function registrarCercania(ls, it) {
    ls.zonas[it.zona] = (ls.zonas[it.zona] || 0) + 1;
    ls.ubic[it.ubicacionTecnica] = (ls.ubic[it.ubicacionTecnica] || 0) + 1;
  }
  function minAbs(turno, rel) {
    return planMinToHHMM(planHHMMtoMin(planState.cfg[turno].inicio) + rel);
  }

  /* Contadores de equidad entre las 4 guardias (acumulado del mes). */
  const alturaG = { 1: 0, 2: 0, 3: 0, 4: 0 };
  const cargaG = { 1: 0, 2: 0, 3: 0, 4: 0 };

  /* 1) OTs fijadas a mano (pin): reservan su lugar primero. */
  planState.ots.filter(o => o.pin && o.fecha && o.guardia).forEach(o => {
    const turno = o.turno || 'noche';
    const ls = laneState(o.fecha, o.guardia, turno, o.gremio);
    const dur = Math.max(5, o.duracionMin || PLAN_DUR_DEFAULT);
    const rel = planRelDesdeInicio(planHHMMtoMin(o.inicio || planState.cfg[turno].inicio), planHHMMtoMin(planState.cfg[turno].inicio));
    reservar(ls, rel, dur, o.nPers);
    registrarCercania(ls, o);
    alturaG[o.guardia] += o.esAltura ? 1 : 0;
    cargaG[o.guardia] += 1;
    o.motivoSinUbicar = null;
  });

  /* 2) OTs de patio: ya traen fecha/hora/línea. Guardia = la de noche de
        esa fecha. Sin recalcular ventanas. */
  planState.ots.filter(o => o.origen === 'patio' && !o.pin).forEach(o => {
    o.guardia = null; o.motivoSinUbicar = null;
    if (o.nivelPatio === 'incompatible') { o.motivoSinUbicar = o.motivoPatio || 'La app del patio no encontró ventana.'; return; }
    if (!o.fecha) { o.motivoSinUbicar = 'El export del patio no traía fecha para esta OT.'; return; }
    const g = planGuardiaDe(o.fecha, 'noche');
    if (!g) { o.motivoSinUbicar = `Definí la guardia de turno Tarde del ${o.fecha} en la rotación.`; return; }
    o.guardia = g; o.turno = 'noche';
    const ls = laneState(o.fecha, g, 'noche', 'mecanico');
    const durP = Math.max(5, o.duracionMin || PLAN_DUR_DEFAULT);
    const relP = o.inicio ? planRelDesdeInicio(planHHMMtoMin(o.inicio), planHHMMtoMin(planState.cfg.noche.inicio)) : 0;
    reservar(ls, relP, durP, o.nPers);
    registrarCercania(ls, o);
    alturaG[g] += o.esAltura ? 1 : 0;
    cargaG[g] += 1;
  });

  /* 3) Resto de OTs (mensual / adhoc no fijadas). */
  const libres = planState.ots.filter(o => o.origen !== 'patio' && !o.pin);
  libres.forEach(o => { o.fecha = null; o.guardia = null; o.inicio = null; o.fin = null; o.motivoSinUbicar = null; });

  if (!hayRot) {
    libres.forEach(o => { o.motivoSinUbicar = 'Todavía no definiste la rotación de guardias del mes.'; });
    return;
  }

  ['aire', 'mecanico'].forEach(gremio => {
    const items = libres.filter(o => o.gremio === gremio);
    /* Prioridad: correctivos primero, luego los que llevan más días
       abiertos, luego agrupados por zona / ubicación / secuencia de
       cinta para que salgan juntos. */
    items.sort((a, b) => {
      if ((a.tipo === 'correctivo') !== (b.tipo === 'correctivo')) return a.tipo === 'correctivo' ? -1 : 1;
      const aa = a.antiguedadDias || 0, ba = b.antiguedadDias || 0;
      if (aa !== ba) return ba - aa;
      if (a.zona !== b.zona) return a.zona.localeCompare(b.zona);
      if (a.ubicacionTecnica !== b.ubicacionTecnica) return a.ubicacionTecnica.localeCompare(b.ubicacionTecnica);
      if (a.numSecuenciaCinta != null && b.numSecuenciaCinta != null) return a.numSecuenciaCinta - b.numSecuenciaCinta;
      return a.equipo.localeCompare(b.equipo);
    });

    items.forEach(o => {
      const turno = o.turno || PLAN_TURNO_DEFAULT[gremio];
      const dur = Math.max(5, o.duracionMin || PLAN_DUR_DEFAULT);
      /* Días candidatos: los del mes con guardia definida en ese turno. */
      const cand = dias
        .map(f => ({ f, g: planGuardiaDe(f, turno) }))
        .filter(x => x.g);
      if (!cand.length) { o.motivoSinUbicar = `No hay ninguna guardia de turno ${PLAN_TURNO_LBL[turno]} en la rotación.`; return; }
      /* Ordena los días candidatos por, en este orden:
           1. equidad de altura entre las 4 guardias (acumulado del mes)
           2. equidad de carga total entre las 4 guardias
           3. cercanía física ya presente ese día-guardia (misma zona y
              misma ubicación técnica) → agrupa el sector, no cruza el
              aeropuerto
           4. día menos cargado (reparte a lo largo del mes)
           5. antes en el mes */
      cand.sort((x, y) => {
        const ax = alturaG[x.g] + (o.esAltura ? 1 : 0), ay = alturaG[y.g] + (o.esAltura ? 1 : 0);
        if (ax !== ay) return ax - ay;
        if (cargaG[x.g] !== cargaG[y.g]) return cargaG[x.g] - cargaG[y.g];
        const lx = laneCache[`${x.f}|${x.g}|${gremio}`], ly = laneCache[`${y.f}|${y.g}|${gremio}`];
        const cx = lx ? ((lx.zonas[o.zona] || 0) + 0.5 * (lx.ubic[o.ubicacionTecnica] || 0)) : 0;
        const cy = ly ? ((ly.zonas[o.zona] || 0) + 0.5 * (ly.ubic[o.ubicacionTecnica] || 0)) : 0;
        if (cx !== cy) return cy - cx;
        const mx = minDiaG[`${x.f}|${x.g}|${gremio}`] || 0, my = minDiaG[`${y.f}|${y.g}|${gremio}`] || 0;
        if (mx !== my) return mx - my;
        return x.f.localeCompare(y.f);
      });
      for (const { f, g } of cand) {
        const ls = laneState(f, g, turno, gremio);
        const slot = colocar(ls, dur, o.nPers);
        if (!slot) continue;
        o.fecha = f; o.guardia = g; o.turno = turno;
        o.nPersUsadas = slot.nPers;
        o.inicio = minAbs(turno, slot.ini);
        o.fin = minAbs(turno, slot.fin);
        registrarCercania(ls, o);
        alturaG[g] += o.esAltura ? 1 : 0;
        cargaG[g] += 1;
        minDiaG[`${f}|${g}|${gremio}`] = (minDiaG[`${f}|${g}|${gremio}`] || 0) + dur * slot.nPers;
        return;
      }
      o.motivoSinUbicar = 'No quedó cupo en ninguna guardia del mes para esta OT.';
    });
  });
}

/* ════════ Reasignar / mover a mano ════════ */
function planMoverOT(id, fecha, guardia, inicioHHMM) {
  const o = planState.ots.find(x => x.id === id);
  if (!o) return;
  o.fecha = fecha; o.guardia = guardia; o.pin = true; o.motivoSinUbicar = null;
  if (fecha && guardia) {
    const turno = planGuardiaDe(fecha, 'manana') === guardia ? 'manana'
      : planGuardiaDe(fecha, 'noche') === guardia ? 'noche'
      : (o.turno || 'noche');
    o.turno = turno;
    const ini = inicioHHMM || o.inicio || planState.cfg[turno].inicio;
    o.inicio = ini;
    o.fin = planMinToHHMM(planHHMMtoMin(ini) + Math.max(5, o.duracionMin || PLAN_DUR_DEFAULT));
  } else {
    o.inicio = null; o.fin = null; o.pin = false;
  }
  planSave();
  renderPlanificador();
}
function planQuitarOT(id) { planMoverOT(id, null, null, null); }
function planLiberarPin(id) {
  const o = planState.ots.find(x => x.id === id);
  if (!o) return;
  o.pin = false;
  planDistribuir(); planSave(); renderPlanificador();
}

/* ════════ Alta de preventivo en el momento ════════ */
function planAgregarAdhoc(equipo, denom, durMin, turno, esAltura) {
  const it = planNormalizarItem({ equipo, texto: denom, denom, duracionMin: durMin, esAltura }, 'adhoc');
  if (turno) it.turno = turno;
  planState.ots.push(it);
  planDistribuir(); planSave(); renderPlanificador();
  planToast('✓ Preventivo agregado.', 'success');
}

/* ════════ Historial → antigüedad ════════ */
async function planCargarHistorial() {
  if (typeof loadOTsFromServer !== 'function') return;
  try {
    const ots = await loadOTsFromServer();
    if (!ots) return;
    ots.forEach(o => {
      if (o.ot_num && o.fecha) planHist.porOt[String(o.ot_num)] = o.fecha;
      if (o.equipo && o.fecha) {
        const k = String(o.equipo).toUpperCase();
        if (!planHist.porEquipo[k] || new Date(o.fecha) < new Date(planHist.porEquipo[k])) planHist.porEquipo[k] = o.fecha;
      }
    });
    planState.ots.forEach(o => { o.antiguedadDias = planAntiguedadDias(o.ot_num, o.equipo); });
    renderPlanificador();
  } catch (e) { /* sin historial, no pasa nada */ }
}

/* ════════════════════════════════════════════════════════════════════
   RENDER
   ════════════════════════════════════════════════════════════════════ */
const PLAN_DOW = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const PLAN_NIVEL_LBL = { recomendado: '✅ Recomendado', condiciones: '⚠️ Con condiciones', incompatible: '⛔ Sin ventana', insuficiente: 'ℹ️ Info insuficiente' };

function planFmtDur(min) {
  min = Math.round(min || 0);
  const h = Math.floor(min / 60), m = min % 60;
  return h ? (m ? `${h} h ${m} min` : `${h} h`) : `${m} min`;
}
function planDiaLegible(f) {
  const d = new Date(f + 'T00:00:00');
  return `${PLAN_DOW[(d.getDay() + 6) % 7]} ${d.getDate()}/${d.getMonth() + 1}`;
}
function planTurnoDe(fecha, guardia) {
  if (planGuardiaDe(fecha, 'manana') === guardia) return 'manana';
  if (planGuardiaDe(fecha, 'noche') === guardia) return 'noche';
  return null;
}

function renderPlanificador() {
  const hasData = planState.ots.length > 0;
  const empty = document.getElementById('plan-empty-state');
  const tb = document.getElementById('plan-toolbar');
  if (empty) empty.classList.toggle('hidden', hasData);
  if (tb) tb.style.display = hasData ? '' : 'none';
  renderPlanCfg();
  renderPlanRotacion();
  renderPlanStats();
  renderPlanCalendario();
  renderPlanDia();
  renderPlanSinUbicar();
}

/* ─── Stats + equidad ─── */
function renderPlanStats() {
  const wrap = document.getElementById('plan-stats');
  if (!wrap) return;
  const ots = planState.ots;
  const ubic = ots.filter(o => o.fecha && o.guardia);
  const sinUbic = ots.length - ubic.length;
  const manana = ubic.filter(o => o.turno === 'manana').length;
  const noche = ubic.filter(o => o.turno === 'noche').length;
  const altura = ots.filter(o => o.esAltura).length;
  const cards = [
    { label: 'OTs totales', value: ots.length, icon: '🗂️', color: '#1a56a4' },
    { label: '☀️ Turno Día', value: manana, icon: '☀️', color: '#d97706' },
    { label: '🌙 Turno Noche', value: noche, icon: '🌙', color: '#4338ca' },
    { label: '⛰️ Pagan altura', value: altura, icon: '⛰️', color: '#92400e' },
    { label: '📌 Sin ubicar', value: sinUbic, icon: '📌', color: sinUbic ? '#dc2626' : '#10b981' },
  ];
  wrap.innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>`).join('');

  const eq = document.getElementById('plan-equidad');
  if (!eq) return;
  const alturaG = { 1: 0, 2: 0, 3: 0, 4: 0 }, cargaG = { 1: 0, 2: 0, 3: 0, 4: 0 }, minG = { 1: 0, 2: 0, 3: 0, 4: 0 }, capG = { 1: 0, 2: 0, 3: 0, 4: 0 };
  ubic.forEach(o => { alturaG[o.guardia] += o.esAltura ? 1 : 0; cargaG[o.guardia] += 1; minG[o.guardia] += (o.duracionMin || 0) * (o.nPersUsadas || o.nPers || 1); });
  const dias = planDiasDelMes(planState.mes);
  dias.forEach(f => {
    ['manana', 'noche'].forEach(t => {
      const g = planGuardiaDe(f, t);
      if (g) capG[g] += planCupoDia(f, t, 'aire') + planCupoDia(f, t, 'mecanico');
    });
  });
  eq.innerHTML = `<div class="plan-equidad-title">Equidad entre guardias (mes)</div><div class="plan-equidad-grid">` +
    [1, 2, 3, 4].map(g => {
      const pct = capG[g] ? Math.round(minG[g] / capG[g] * 100) : 0;
      return `<div class="plan-equidad-cell">
        <span class="plan-eq-g">Guardia ${g}</span>
        <span class="plan-eq-row">⛰️ ${alturaG[g]} altura</span>
        <span class="plan-eq-row">🗂️ ${cargaG[g]} OTs</span>
        <span class="plan-eq-bar"><span style="width:${Math.min(100, pct)}%;background:${pct > 100 ? '#dc2626' : pct > 85 ? '#d97706' : '#10b981'}"></span></span>
        <span class="plan-eq-row">⏱️ ${pct}% de cupo</span>
      </div>`;
    }).join('') + `</div>`;
}

/* ─── Configuración de día tipo ─── */
function renderPlanCfg() {
  const body = document.getElementById('plan-cfg-body');
  if (!body) return;
  const campo = (turno, path, label, tipo = 'time') => {
    const cfg = planState.cfg[turno];
    let val;
    if (path === 'inicio') val = cfg.inicio;
    else if (path === 'fin') val = cfg.fin;
    else if (path === 'recorridasMin') val = cfg.recorridasMin;
    else if (path === 'almuerzo.inicio') val = cfg.almuerzo.inicio;
    else if (path === 'almuerzo.min') val = cfg.almuerzo.min;
    else if (path === 'descanso.inicio') val = cfg.descanso.inicio;
    else if (path === 'descanso.min') val = cfg.descanso.min;
    return `<label class="plan-cfg-field"><span>${label}</span>
      <input type="${tipo}" data-turno="${turno}" data-path="${path}" value="${val}" ${tipo === 'number' ? 'min="0" step="5" style="width:70px"' : ''}></label>`;
  };
  body.innerHTML = ['manana', 'noche'].map(t => `
    <div class="plan-cfg-col">
      <div class="plan-cfg-h">${PLAN_TURNO_ICON[t]} Turno ${PLAN_TURNO_LBL[t]} — ${planFmtDur(planMinutosUtiles(t))} útiles / técnico</div>
      ${campo(t, 'inicio', 'Inicio')} ${campo(t, 'fin', 'Fin')}
      ${campo(t, 'recorridasMin', 'Recorridas (min)', 'number')}
      ${campo(t, 'almuerzo.inicio', t === 'manana' ? 'Almuerzo' : 'Cena')} ${campo(t, 'almuerzo.min', 'min', 'number')}
      ${campo(t, 'descanso.inicio', 'Descanso')} ${campo(t, 'descanso.min', 'min', 'number')}
    </div>`).join('') +
    `<button class="prog-btn prog-btn-primary" id="plan-cfg-apply">Guardar y recalcular</button>`;

  body.querySelector('#plan-cfg-apply').addEventListener('click', () => {
    body.querySelectorAll('input[data-path]').forEach(inp => {
      const t = inp.dataset.turno, p = inp.dataset.path, cfg = planState.cfg[t];
      const v = inp.type === 'number' ? Math.max(0, +inp.value || 0) : inp.value;
      if (p === 'inicio') cfg.inicio = v;
      else if (p === 'fin') cfg.fin = v;
      else if (p === 'recorridasMin') cfg.recorridasMin = v;
      else if (p === 'almuerzo.inicio') cfg.almuerzo.inicio = v;
      else if (p === 'almuerzo.min') cfg.almuerzo.min = v;
      else if (p === 'descanso.inicio') cfg.descanso.inicio = v;
      else if (p === 'descanso.min') cfg.descanso.min = v;
    });
    planDistribuir(); planSave(); renderPlanificador();
    planToast('✓ Día tipo actualizado y plan recalculado.', 'success');
  });
}

/* ─── Editor de rotación ─── */
function renderPlanRotacion() {
  const body = document.getElementById('plan-rotacion-body');
  if (!body) return;
  const dias = planDiasDelMes(planState.mes);
  const opts = sel => `<option value="">—</option>` + [1, 2, 3, 4].map(n => `<option value="${n}" ${n === sel ? 'selected' : ''}>G${n}</option>`).join('');
  const anclaDefault = dias[0] || (planState.mes ? planState.mes + '-01' : '');

  const conGrilla = Object.keys(planState.grilla || {}).length;
  body.innerHTML = `
    <div class="plan-rot-patron">
      <button class="prog-btn prog-btn-primary" id="plan-rot-grilla" ${planGrillaCargando ? 'disabled' : ''}>
        ${planGrillaCargando ? '⏳ Trayendo…' : '🔄 Traer rotación y dotación de la Grilla Inteligente'}
      </button>
      ${conGrilla ? `<span class="prog-mangas-hint">✓ ${conGrilla} días con dotación real de la grilla</span>` : `<span class="prog-mangas-hint">— o armá el patrón a mano abajo</span>`}
    </div>
    <details class="plan-rot-manual"><summary>Patrón manual / ajustes por día</summary>
    <div class="plan-rot-patron" style="margin-top:8px">
      <label>Desde <input type="date" id="plan-rot-ancla" value="${anclaDefault}"></label>
      <label>☀️ Día <select id="plan-rot-gm">${opts(1)}</select></label>
      <label>🌙 Noche <select id="plan-rot-gn">${opts(3)}</select></label>
      <label>Ciclo (días) <input type="number" id="plan-rot-ciclo" value="2" min="1" style="width:60px"></label>
      <button class="prog-btn" id="plan-rot-apply">Aplicar patrón</button>
    </div>
    <div class="plan-rot-grid">
      ${dias.map(f => {
    const r = planState.rotacion[f] || {};
    const gr = planState.grilla && planState.grilla[f];
    const dotTxt = t => { const c = gr && gr[t]; return c ? ` title="${c.aire} aire · ${c.mecanico} mec${c.ausentes ? ' · ' + c.ausentes + ' aus.' : ''}"` : ''; };
    return `<div class="plan-rot-cell">
          <span class="plan-rot-day">${planDiaLegible(f)}</span>
          <span class="plan-rot-sel"${dotTxt('manana')}>☀️<select data-f="${f}" data-t="manana">${opts(r.manana || null)}</select></span>
          <span class="plan-rot-sel"${dotTxt('noche')}>🌙<select data-f="${f}" data-t="noche">${opts(r.noche || null)}</select></span>
        </div>`;
  }).join('')}
    </div>
    </details>`;

  body.querySelector('#plan-rot-grilla').addEventListener('click', () => planTraerGrilla());
  const applyBtn = body.querySelector('#plan-rot-apply');
  if (applyBtn) applyBtn.addEventListener('click', () => {
    const ancla = body.querySelector('#plan-rot-ancla').value;
    const gm = +body.querySelector('#plan-rot-gm').value || 1;
    const gn = +body.querySelector('#plan-rot-gn').value || 3;
    const ciclo = +body.querySelector('#plan-rot-ciclo').value || 2;
    if (!ancla) { planToast('Elegí una fecha de inicio para el patrón.', 'error'); return; }
    planAplicarPatron(ancla, gm, gn, ciclo);
    planDistribuir(); planSave(); renderPlanificador();
    planToast('✓ Rotación aplicada a todo el mes.', 'success');
  });
  body.querySelectorAll('.plan-rot-cell select').forEach(sel => {
    sel.addEventListener('change', function () {
      const f = this.dataset.f, t = this.dataset.t;
      planState.rotacion[f] = planState.rotacion[f] || { manana: null, noche: null };
      planState.rotacion[f][t] = this.value ? +this.value : null;
      if (!planState.rotacion[f].manana && !planState.rotacion[f].noche) delete planState.rotacion[f];
      planDistribuir(); planSave(); renderPlanificador();
    });
  });
}

/* ─── Calendario mensual ─── */
function renderPlanCalendario() {
  const wrap = document.getElementById('plan-cal');
  if (!wrap) return;
  const dias = planDiasDelMes(planState.mes);
  if (!dias.length) { wrap.innerHTML = '<p class="prog-guardia-empty">Elegí un mes para empezar.</p>'; return; }
  const lead = (new Date(dias[0] + 'T00:00:00').getDay() + 6) % 7;
  const porDia = {};
  planState.ots.forEach(o => { if (o.fecha && o.guardia) (porDia[o.fecha] = porDia[o.fecha] || []).push(o); });

  let html = `<div class="plan-cal-grid">` + PLAN_DOW.map(d => `<div class="plan-cal-dow">${d}</div>`).join('');
  for (let i = 0; i < lead; i++) html += `<div class="plan-cal-blank"></div>`;
  dias.forEach(f => {
    const gm = planGuardiaDe(f, 'manana'), gn = planGuardiaDe(f, 'noche');
    const items = porDia[f] || [];
    const alt = items.filter(o => o.esAltura).length;
    const sel = planDiaSel === f ? ' sel' : '';
    const sinRot = !gm && !gn ? ' plan-cal-sinrot' : '';
    html += `<div class="plan-cal-cell${sel}${sinRot}" data-f="${f}">
      <div class="plan-cal-num">${new Date(f + 'T00:00:00').getDate()}</div>
      <div class="plan-cal-guardias">${gm ? `<span class="turno-badge manana">☀️ G${gm}</span>` : ''}${gn ? `<span class="turno-badge noche">🌙 G${gn}</span>` : ''}${!gm && !gn ? '<span class="plan-cal-norot">sin rotación</span>' : ''}</div>
      ${items.length ? `<div class="plan-cal-count">🗂️ ${items.length}${alt ? ` · ⛰️ ${alt}` : ''}</div>` : ''}
    </div>`;
  });
  html += `</div>`;
  wrap.innerHTML = html;

  wrap.querySelectorAll('.plan-cal-cell').forEach(cell => {
    cell.addEventListener('click', () => { planDiaSel = cell.dataset.f; renderPlanificador(); document.getElementById('plan-dia').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    cell.addEventListener('dragover', e => { e.preventDefault(); cell.classList.add('plan-drop'); });
    cell.addEventListener('dragleave', () => cell.classList.remove('plan-drop'));
    cell.addEventListener('drop', e => {
      e.preventDefault(); cell.classList.remove('plan-drop');
      const id = e.dataTransfer.getData('text/plain');
      const o = planState.ots.find(x => x.id === id);
      if (!o) return;
      const f = cell.dataset.f;
      const turno = o.turno || PLAN_TURNO_DEFAULT[o.gremio];
      const g = planGuardiaDe(f, turno);
      if (!g) { planToast(`El ${planDiaLegible(f)} no tiene guardia de turno ${PLAN_TURNO_LBL[turno]}.`, 'error'); return; }
      planMoverOT(id, f, g, null);
    });
  });
}

/* ─── Panel del día (línea de tiempo por guardia) ─── */
function renderPlanDia() {
  const wrap = document.getElementById('plan-dia');
  if (!wrap) return;
  if (!planDiaSel) { wrap.innerHTML = '<p class="prog-guardia-empty">Hacé clic en un día del calendario para ver y ajustar su plan hora por hora.</p>'; return; }
  const f = planDiaSel;
  const guardias = [];
  ['manana', 'noche'].forEach(t => { const g = planGuardiaDe(f, t); if (g) guardias.push({ g, t }); });
  if (!guardias.length) { wrap.innerHTML = `<div class="plan-dia-head">${planDiaLegible(f)}</div><p class="prog-guardia-empty">Ese día no tiene guardias definidas en la rotación.</p>`; return; }

  let html = `<div class="plan-dia-head">📅 ${planDiaLegible(f)} — ${f}</div>`;
  guardias.forEach(({ g, t }) => {
    const cfg = planState.cfg[t];
    const dur = planDurTurno(cfg);
    const iniT = planHHMMtoMin(cfg.inicio);
    const items = planState.ots.filter(o => o.fecha === f && o.guardia === g).sort((a, b) => planHHMMtoMin(a.inicio) - planHHMMtoMin(b.inicio));
    const nAire = planPresentes(f, t, 'aire'), nMec = planPresentes(f, t, 'mecanico');
    const gr = planState.grilla && planState.grilla[f] && planState.grilla[f][t];
    /* lanes para dibujar: cada OT ocupa `nPers` carriles contiguos por su
       tramo horario (first-fit por solapamiento). */
    const laneEnds = [];
    items.forEach(o => {
      let s = planRelDesdeInicio(planHHMMtoMin(o.inicio), iniT);
      if (s > dur - 5) s = dur - 5;                 // OT del patio fuera del turno: la pegamos al borde
      o._s = s;
      o._w = Math.min(Math.max(5, o.duracionMin || PLAN_DUR_DEFAULT), dur - s);
      const k = Math.max(1, o.nPersUsadas || o.nPers || 1);
      let start = -1;
      for (let i = 0; i + k <= laneEnds.length; i++) {
        let ok = true;
        for (let j = 0; j < k; j++) if (laneEnds[i + j] > s) { ok = false; break; }
        if (ok) { start = i; break; }
      }
      if (start === -1) { start = laneEnds.length; for (let j = 0; j < k; j++) laneEnds.push(0); }
      for (let j = 0; j < k; j++) laneEnds[start + j] = s + o._w;
      o._lane = start; o._k = k;
    });
    const nLanes = Math.max(1, laneEnds.length);
    const rowH = 42;
    const ticks = [];
    for (let m = 0; m <= dur; m += 60) ticks.push(m);
    const busy = [['Recorridas', 0, Math.min(cfg.recorridasMin, dur), 'rec']];
    [['almuerzo', cfg.almuerzo], ['descanso', cfg.descanso]].forEach(([nm, b]) => {
      if (b && b.min) { const r = planRelDesdeInicio(planHHMMtoMin(b.inicio), iniT); busy.push([nm === 'almuerzo' ? (t === 'manana' ? 'Almuerzo' : 'Cena') : 'Descanso', r, Math.min(r + b.min, dur), 'brk']); }
    });

    html += `<div class="plan-guardia-block" data-g="${g}" data-t="${t}">
      <div class="plan-guardia-head">
        <span class="prog-guardia-name">Guardia ${g}</span>
        <span class="turno-badge ${t === 'manana' ? 'manana' : 'noche'}">${PLAN_TURNO_ICON[t]} ${PLAN_TURNO_LBL[t]} ${cfg.inicio}–${cfg.fin}</span>
        <span class="prog-guardia-count">👷 ${nAire} aire · ${nMec} mec${gr && gr.ausentes ? ` · ${gr.ausentes} aus.` : ''}${gr ? ' (grilla)' : ''} · 🗂️ ${items.length} OTs</span>
      </div>
      <div class="plan-timeline" style="height:${nLanes * rowH + 22}px" data-init="${iniT}" data-dur="${dur}">
        <div class="plan-tl-ticks">${ticks.map(m => `<span style="left:${m / dur * 100}%">${planMinToHHMM(iniT + m)}</span>`).join('')}</div>
        ${busy.map(([lbl, a, b, cls]) => `<div class="plan-tl-busy ${cls}" style="left:${a / dur * 100}%;width:${(b - a) / dur * 100}%;top:22px;bottom:0"><span>${lbl}</span></div>`).join('')}
        ${items.map(o => {
      const s = o._s, w = o._w;
      const np = o.nPersUsadas || o.nPers || 1;
      const fu = o.durFuente === 'sap' ? '⚙️' : o.durFuente === 'estim' ? '~' : '';
      const fuTxt = o.durFuente === 'sap' ? 'según SAP' + (o.hdrRuta ? ' (' + o.hdrRuta + ')' : '') : o.durFuente === 'estim' ? 'estimada' : 'cargada a mano';
      return `<div class="plan-ot-card${o.esAltura ? ' altura' : ''}${o.origen === 'patio' ? ' patio' : ''}${o.origen === 'adhoc' ? ' adhoc' : ''}" draggable="true" data-id="${o.id}"
          style="left:${s / dur * 100}%;width:${w / dur * 100}%;top:${22 + o._lane * rowH}px;height:${o._k * rowH - 6}px"
          title="${o.equipo} · ${o.denom} · ${o.inicio}–${o.fin} · ${planFmtDur(o.duracionMin)} · ${np} persona${np > 1 ? 's' : ''} · ${fuTxt}${o.antiguedadDias != null ? ' · lleva ' + o.antiguedadDias + ' d' : ''}">
          <span class="plan-ot-eq">${o.equipo}${o.pin ? ' 📌' : ''}${np > 1 ? ` 👥${np}` : ''}</span>
          <span class="plan-ot-meta">${o.inicio} · ${planFmtDur(o.duracionMin)} ${fu}${o.linea ? ' · ' + o.linea : ''}</span>
        </div>`;
    }).join('')}
      </div>
    </div>`;
  });
  wrap.innerHTML = html;

  wrap.querySelectorAll('.plan-ot-card').forEach(card => {
    card.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', card.dataset.id));
    card.addEventListener('dblclick', () => planEditarOT(card.dataset.id));
  });
  wrap.querySelectorAll('.plan-timeline').forEach(tl => {
    tl.addEventListener('dragover', e => { e.preventDefault(); tl.classList.add('plan-drop'); });
    tl.addEventListener('dragleave', () => tl.classList.remove('plan-drop'));
    tl.addEventListener('drop', e => {
      e.preventDefault(); tl.classList.remove('plan-drop');
      const id = e.dataTransfer.getData('text/plain');
      const blk = tl.closest('.plan-guardia-block');
      const rect = tl.getBoundingClientRect();
      const dur = +tl.dataset.dur, iniT = +tl.dataset.init;
      let rel = Math.max(0, Math.round((e.clientX - rect.left) / rect.width * dur / 15) * 15);
      planMoverOT(id, planDiaSel, +blk.dataset.g, planMinToHHMM(iniT + rel));
    });
  });
}

function planEditarOT(id) {
  const o = planState.ots.find(x => x.id === id);
  if (!o) return;
  const nd = prompt(`Duración de ${o.equipo} (${o.denom}) en minutos:`, o.duracionMin);
  if (nd == null) return;
  o.duracionMin = Math.max(5, +nd || o.duracionMin);
  if (o.pin && o.inicio) o.fin = planMinToHHMM(planHHMMtoMin(o.inicio) + o.duracionMin);
  planDistribuir(); planSave(); renderPlanificador();
}

/* ─── Bandeja "Sin ubicar" ─── */
function renderPlanSinUbicar() {
  const wrap = document.getElementById('plan-sin-ubicar');
  if (!wrap) return;
  const sin = planState.ots.filter(o => !o.fecha || !o.guardia);
  wrap.innerHTML = `<div class="plan-sinub-head">📌 Sin ubicar <span class="prog-mangas-hint">— arrastrá una OT a un día del calendario o a la línea de tiempo</span></div>`;
  if (!sin.length) { wrap.innerHTML += '<p class="prog-guardia-empty">Todas las OTs quedaron ubicadas.</p>'; return; }
  wrap.innerHTML += `<div class="plan-sinub-list">` + sin.map(o => `
    <div class="plan-ot-card sinub${o.esAltura ? ' altura' : ''}${o.origen === 'patio' ? ' patio' : ''}" draggable="true" data-id="${o.id}">
      <span class="plan-ot-eq">${o.equipo}</span>
      <span class="plan-ot-meta">${o.denom || o.regla || ''} · ${planFmtDur(o.duracionMin)}${o.turno ? ' · ' + PLAN_TURNO_ICON[o.turno] : ''}${o.linea ? ' · ' + o.linea : ''}</span>
      ${o.motivoSinUbicar ? `<span class="plan-ot-motivo">${o.motivoSinUbicar}</span>` : ''}
    </div>`).join('') + `</div>`;
  wrap.querySelectorAll('.plan-ot-card').forEach(card => {
    card.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', card.dataset.id));
  });
}

/* ─── Export ─── */
function planExport() {
  if (typeof XLSX === 'undefined') { planToast('❌ Falta la librería para exportar.', 'error'); return; }
  if (!planState.ots.length) { planToast('No hay OTs para exportar.', 'error'); return; }
  const rows = [...planState.ots].sort((a, b) =>
    (a.fecha || '9999').localeCompare(b.fecha || '9999') || (a.guardia || 9) - (b.guardia || 9) || planHHMMtoMin(a.inicio) - planHHMMtoMin(b.inicio)
  ).map(o => ({
    'Fecha': o.fecha || '', 'Día': o.fecha ? planDiaLegible(o.fecha) : '',
    'Guardia': o.guardia ? 'Guardia ' + o.guardia : 'Sin ubicar',
    'Turno': PLAN_TURNO_LBL[o.turno] || '',
    'Inicio': o.inicio || '', 'Fin': o.fin || '',
    'OT': o.ot_num || '', 'Equipo': o.equipo, 'Denominación': o.denom || '',
    'Zona': o.zona, 'Línea': o.linea || '',
    'Altura': o.esAltura ? 'Sí' : 'No',
    'Duración (min)': o.duracionMin || '',
    'Personas': o.nPersUsadas || o.nPers || 1,
    'Duración fuente': o.durFuente === 'sap' ? 'SAP (hoja de ruta)' : o.durFuente === 'estim' ? 'Estimada' : o.durFuente === 'patio' ? 'Plan patio BHS' : 'Manual',
    'Hoja de ruta': o.hdrRuta || '',
    'Tipo': o.tipo, 'Origen': o.origen,
    'Nivel patio': o.nivelPatio ? (PLAN_NIVEL_LBL[o.nivelPatio] || o.nivelPatio) : '',
    'Antigüedad (d)': o.antiguedadDias != null ? o.antiguedadDias : '',
    'Regla turno': o.regla || '',
    'Motivo sin ubicar': o.motivoSinUbicar || '',
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Planificador');
  XLSX.writeFile(wb, `Planificador_OTs_${planState.mes || 'mes'}.xlsx`);
}

/* ─── Reset ─── */
function planReset() {
  if (!planState.ots.length && !Object.keys(planState.rotacion).length) return;
  if (!window.confirm('¿Vaciar el planificador? Se borran las OTs cargadas y la rotación (no afecta los archivos originales).')) return;
  planState = { mes: document.getElementById('plan-mes-input').value || '', rotacion: {}, grilla: {}, cfg: JSON.parse(JSON.stringify(PLAN_DIA_TEMPLATE)), hidrolavado: false, ots: [] };
  planDiaSel = null;
  planSave();
  renderPlanificador();
}

/* ════════ Init ════════ */
(function initPlanificador() {
  if (!document.getElementById('page-planificador')) return;
  planLoad();

  const mesInput = document.getElementById('plan-mes-input');
  mesInput.value = planState.mes || new Date().toISOString().slice(0, 7);
  planState.mes = mesInput.value;
  mesInput.addEventListener('change', function () {
    planState.mes = this.value; planDiaSel = null;
    planState.grilla = {};
    planDistribuir(); planSave(); renderPlanificador();
    planTraerGrilla();          // rotación + dotación del mes nuevo
  });

  const wire = (btnId, inputId, handler) => {
    document.getElementById(btnId).addEventListener('click', () => document.getElementById(inputId).click());
    document.getElementById(inputId).addEventListener('change', function () {
      const file = this.files[0]; this.value = '';
      if (file) handler(file);
    });
  };
  wire('plan-upload-btn', 'plan-file-input', planHandleFileMensual);
  wire('plan-patio-btn', 'plan-patio-input', planHandleFilePatio);

  document.getElementById('plan-export-btn').addEventListener('click', planExport);
  document.getElementById('plan-reset-btn').addEventListener('click', planReset);

  const addBtn = document.getElementById('plan-adhoc-btn');
  if (addBtn) addBtn.addEventListener('click', () => {
    const eq = document.getElementById('plan-adhoc-equipo').value.trim().toUpperCase();
    const dn = document.getElementById('plan-adhoc-denom').value.trim();
    const du = +document.getElementById('plan-adhoc-dur').value || 60;
    const tu = document.getElementById('plan-adhoc-turno').value || null;
    const al = document.getElementById('plan-adhoc-altura').checked;
    if (!eq) { planToast('Poné al menos el código de equipo.', 'error'); return; }
    planAgregarAdhoc(eq, dn, du, tu, al);
    document.getElementById('plan-adhoc-equipo').value = '';
    document.getElementById('plan-adhoc-denom').value = '';
  });

  renderPlanificador();
  planCargarHistorial();
  /* Primera vez (sin rotación cargada): traé todo de la Grilla Inteligente. */
  if (!Object.keys(planState.rotacion).length && planState.mes) planTraerGrilla();
})();

