/* ─── Seguimiento de OTs (sección secreta, sólo administrador) ──────────
   Se sube el export SAP "Confirmaciones de orden de mantenimiento" (.xlsx) y se resume por
   día y por turno. Turnos de 12 h (igual que el Planificador): Mañana 06–18 · Tarde 18–06.
   Un renglón nocturno de madrugada (00:00–05:59) pertenece al turno que arrancó el día anterior.
   Privacidad: los datos NO van al repo; quedan sólo en este navegador (localStorage) y la
   página exige contraseña verificada contra el servidor (/api/verify-admin). */
(function () {
  const KEY = 'seg_ots_rows_v1';
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const TURNO = { manana: 'Mañana (06–18)', tarde: 'Tarde (18–06)' };
  const st = { rows: [], sel: null, tab: 'dias', vf: 'todas', grilla: {} };
  const META_KEY = 'seg_ots_meta_h';
  const metaH = () => { const v = parseFloat(($('sg-meta') || {}).value); return v > 0 && v <= 12 ? v : 7.5; };

  function load() { try { st.rows = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { st.rows = []; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st.rows)); } catch (e) { alert('No se pudo guardar en el navegador (¿espacio lleno?).'); } }

  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const hhm = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  const fh = h => h.toFixed(1).replace('.', ',');
  function addDays(isoStr, n) { const d = new Date(isoStr + 'T12:00:00'); d.setDate(d.getDate() + n); return iso(d); }
  function fmtDia(isoStr) {
    const [y, m, d] = isoStr.split('-');
    const dow = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'][new Date(isoStr + 'T12:00:00').getDay()];
    return `${dow} ${d}/${m}/${y}`;
  }

  /* Minutos del día desde una celda de hora de Excel (Date o fracción) */
  function toMin(v) {
    if (v instanceof Date) return v.getHours() * 60 + v.getMinutes();
    if (typeof v === 'number') return Math.round((v % 1) * 1440);
    return null;
  }

  /* Excel → renglones normalizados */
  function parseSheet(ws) {
    const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, cellDates: true, defval: null });
    const hdr = (aoa[0] || []).map(norm);
    const col = pref => hdr.findIndex(h => h.startsWith(pref));
    const c = { orden: col('orden'), estado: col('estado'), oper: col('operacion'), texto: col('texto de la notif'), fecha: col('fe contab'),
      pers: col('numero de personal'), final: col('notificacion final'), obj: col('objeto tecnico'), trab: col('trabajo real'),
      hini: Math.max(col('hora del inicio'), col('hora de inicio')), ffin: col('fecha de fin'), fini: col('fecha de inicio'), hfin: col('hora de fin') };
    /* Dos versiones del export: con "Fecha de fin" (la hora de inicio puede caer el día anterior) o con "Fecha de inicio" */
    if (c.orden < 0 || c.pers < 0 || (c.ffin < 0 && c.fini < 0) || c.hini < 0) throw new Error('El archivo no parece el export "Confirmaciones de orden de mantenimiento".');
    const out = [];
    for (let i = 1; i < aoa.length; i++) {
      const r = aoa[i]; if (!r || !r[c.orden]) continue;
      const mi = toMin(r[c.hini]), mf = toMin(r[c.hfin]);
      const ini = c.fini >= 0 && r[c.fini] instanceof Date ? r[c.fini] : null;
      const fin = r[c.ffin] instanceof Date ? r[c.ffin] : (r[c.fecha] instanceof Date ? r[c.fecha] : null);
      if (mi == null || !(ini || fin)) continue;
      let dia = ini ? iso(ini) : iso(fin);
      if (!ini && mf != null && mi > mf) dia = addDays(dia, -1);      // arrancó el día anterior
      const turno = (mi >= 360 && mi < 1080) ? 'manana' : 'tarde';
      const opDia = (turno === 'tarde' && mi < 360) ? addDays(dia, -1) : dia;
      const ordTxt = String(r[c.orden]), m = ordTxt.match(/\((\d+)\)\s*$/);
      const pTxt = String(r[c.pers] || ''), pm = pTxt.match(/^(.*?)\s*\((\d+)\)\s*$/);
      const nombre = pm ? pm[1].trim() : pTxt.trim();
      const objTxt = String(r[c.obj] || ''), om = objTxt.match(/\(([A-Z]{2,4}\d+)\)\s*$/);
      out.push({
        o: m ? m[1] : ordTxt, on: ordTxt.replace(/\s*\(\d+\)\s*$/, ''), d: opDia, t: turno,
        hi: mi, hf: mf, p: nombre || 'Sin asignar', pl: pm ? pm[2] : '',
        f: r[c.final] ? 1 : 0, m: Math.round(Number(r[c.trab]) || 0),
        eq: om ? om[1] : '', ob: objTxt.replace(/\s*\([A-Z]{2,4}\d+\)\s*$/, ''),
        op: String(r[c.oper] || '').replace(/\s*\(\d+\)\s*$/, ''), x: String(r[c.texto] || '').slice(0, 200)
      });
    }
    return out;
  }
  const rowKey = r => [r.o, r.op, r.pl || r.p, r.d, r.hi, r.hf, r.m, r.f, r.x].join('|');

  function importFile(file) {
    const rd = new FileReader();
    rd.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array', cellDates: true });
        const nuevos = parseSheet(wb.Sheets[wb.SheetNames[0]]);
        if (!nuevos.length) throw new Error('No se encontraron renglones con fecha y hora en el archivo.');
        /* El export nuevo reemplaza al anterior en el período que cubre (SAP corrige horas entre descargas);
           lo anterior fuera de ese período se conserva. */
        const desde = nuevos.reduce((m, r) => r.d < m ? r.d : m, nuevos[0].d), hasta = nuevos.reduce((m, r) => r.d > m ? r.d : m, nuevos[0].d);
        const antes = st.rows.length;
        st.rows = st.rows.filter(r => r.d < desde || r.d > hasta);
        const reemplazados = antes - st.rows.length;
        const have = new Set(); nuevos.forEach(r => { const k = rowKey(r); if (!have.has(k)) { have.add(k); st.rows.push(r); } });
        save(); render(); traerGrilla();
        $('sg-msg').textContent = `✅ ${nuevos.length} renglones del ${fmtDia(desde)} al ${fmtDia(hasta)}` + (reemplazados ? ` · reemplazaron ${reemplazados} anteriores de ese período.` : '.');
      } catch (err) { $('sg-msg').textContent = '❌ ' + err.message; }
    };
    rd.readAsArrayBuffer(file);
  }

  /* El análisis es del mes más reciente del export (hoy octubre): los meses anteriores quedan guardados pero fuera del filtro. */
  function periodoPorDefecto() {
    if (!st.rows.length || $('sg-desde').value || $('sg-hasta').value) return;
    const mx = st.rows.reduce((m, r) => r.d > m ? r.d : m, st.rows[0].d), [y, m] = mx.split('-').map(Number);
    $('sg-desde').value = `${y}-${String(m).padStart(2, '0')}-01`;
    $('sg-hasta').value = `${y}-${String(m).padStart(2, '0')}-${String(new Date(y, m, 0).getDate()).padStart(2, '0')}`;
  }

  /* ── Agregación ── */
  function filtrado() {
    const d1 = $('sg-desde').value, d2 = $('sg-hasta').value, tu = $('sg-turno').value, q = norm($('sg-buscar').value);
    return st.rows.filter(r => (!d1 || r.d >= d1) && (!d2 || r.d <= d2) && (!tu || r.t === tu) &&
      (!q || norm(r.p + ' ' + r.on + ' ' + r.o + ' ' + r.eq + ' ' + r.ob).includes(q)));
  }
  /* Minutos de reloj de UNA confirmación (hora fin − hora inicio). */
  const durRow = r => (r.hi == null || r.hf == null) ? 0 : ((r.hf - r.hi) % 1440 + 1440) % 1440;
  /* Minutos registrados por (OT, operación, técnico). "Trabajo real acumulado" de SAP se repite en cada
     confirmación de la misma operación (y acumula a todas las personas), así que sumarlo duplica horas:
     se usa el reloj de cada confirmación y el acumulado sólo si el reloj no sirve (inicio = fin). */
  function minPorPersona(rows) {
    const g = new Map();
    rows.forEach(r => {
      const k = r.o + '|' + r.op + '|' + r.p, x = g.get(k) || { s: 0, mx: 0, o: r.o, p: r.p };
      x.s += durRow(r); x.mx = Math.max(x.mx, r.m || 0); g.set(k, x);
    });
    return [...g.values()].map(x => ({ o: x.o, p: x.p, min: x.s > 0 ? x.s : x.mx }));
  }
  function resumir(rows) {
    const ots = new Set(), fin = new Set(), pers = new Set();
    rows.forEach(r => { ots.add(r.o); if (r.f) fin.add(r.o); if (r.p !== 'Sin asignar') pers.add(r.p); });
    const min = minPorPersona(rows).reduce((s, x) => s + x.min, 0);
    return { ots: ots.size, fin: fin.size, pers: pers.size, horas: min / 60, conf: rows.length };
  }

  /* ── Cobertura de la jornada ──
     Intervalos [ini,fin] en minutos relativos al arranque del turno (0..720). Para el TURNO se unen
     todos los técnicos ("hay alguien con una OT en curso"); para cada TÉCNICO se unen sus propias OTs. */
  const INI_TURNO = { manana: 360, tarde: 1080 }, DUR = 720;
  function intervalos(rows, t) {
    const out = [];
    rows.forEach(r => {
      const ini = ((r.hi - INI_TURNO[t]) % 1440 + 1440) % 1440;
      const len = r.hf == null ? r.m : durRow(r);
      if (!len || ini >= DUR) return;
      out.push([ini, Math.min(DUR, ini + len), r]);
    });
    return out.sort((a, b) => a[0] - b[0]);
  }
  function unir(iv) {
    const u = [];
    iv.forEach(([a, b]) => { const l = u[u.length - 1]; if (l && a <= l[1]) l[1] = Math.max(l[1], b); else u.push([a, b]); });
    return u;
  }
  function cobertura(rows, t) {
    const u = unir(intervalos(rows, t)), cub = u.reduce((s, [a, b]) => s + (b - a), 0), huecos = [];
    let cur = 0;
    u.forEach(([a, b]) => { if (a > cur) huecos.push([cur, a]); cur = b; });
    if (cur < DUR) huecos.push([cur, DUR]);
    return { u, cub, pct: Math.round(cub / DUR * 100), huecos };
  }
  const absHM = (rel, t) => hhm((rel + INI_TURNO[t]) % 1440);
  const fmtHuecos = (hs, t) => hs.filter(([a, b]) => b - a >= 30).map(([a, b]) => `${absHM(a, t)}–${absHM(b, t)}`).join(' · ') || '—';
  const marcasHTML = t => [0, 3, 6, 9, 12].map(h => `<span style="left:${h / 12 * 100}%">${absHM(h * 60, t)}</span>`).join('');
  function lineaTiempo(rows, t, mini) {
    const c = cobertura(rows, t);
    const bar = `<div class="sg-tl-bar">${c.u.map(([a, b]) => `<i style="left:${a / DUR * 100}%;width:${(b - a) / DUR * 100}%"></i>`).join('')}</div>`;
    return mini ? `<div class="sg-tl mini">${bar}</div>` : `<div class="sg-tl">${bar}<div class="sg-tl-marks">${marcasHTML(t)}</div></div>`;
  }
  /* Una fila por técnico y turno: minutos con OT (sin contar dos veces lo simultáneo) frente a la meta */
  const legDe = r => r.pl ? String(+r.pl) : '';
  function entrada(p, leg, d, t, rr) {
    const cv = cobertura(rr, t), meta = metaH() * 60;
    return { p, leg, key: leg || 'n:' + p, d, t, rows: rr, cv, cub: cv.cub, pctMeta: cv.cub / meta, pctJ: cv.cub / DUR, ots: new Set(rr.map(r => r.o)).size, prog: null, estado: '', sup: false, cuenta: true, gd: 0 };
  }
  function jornadas(rows) {
    const g = {};
    rows.forEach(r => { if (r.p === 'Sin asignar') return; const k = (legDe(r) || r.p) + '|' + r.d + '|' + r.t; (g[k] = g[k] || []).push(r); });
    return Object.keys(g).map(k => { const [, d, t] = k.split('|'), rr = g[k]; return entrada(rr[0].p, legDe(rr[0]), d, t, rr); });
  }

  /* ── Cruce con la Grilla Inteligente (guardias) ──
     st.grilla[fecha] = [[legajo, apellido, especialidad, turno, estado], ...] de las guardias que trabajan ese día
     (estado: TRABAJO · COMP_FRANCO · FRANCO · LICENCIA · VACACIONES). El legajo del export es el "Número de personal". */
  const EST = { TRABAJO: 'de guardia', COMP_FRANCO: 'franco compensatorio', FRANCO: 'franco', LICENCIA: 'licencia', VACACIONES: 'vacaciones' };
  const GR_KEY = 'seg_ots_grilla_v2';
  function cargarCacheGrilla() { try { st.grilla = Object.assign(JSON.parse(localStorage.getItem(GR_KEY) || '{}'), st.grilla); } catch (e) { /* sin cache */ } }
  async function traerGrilla(force) {
    periodoPorDefecto();
    const d1 = $('sg-desde').value, d2 = $('sg-hasta').value;
    const ds = [...new Set(st.rows.filter(r => (!d1 || r.d >= d1) && (!d2 || r.d <= d2)).map(r => r.d))].sort();
    if (!ds.length) return;
    const fechas = []; for (let f = ds[0]; f <= ds[ds.length - 1]; f = addDays(f, 1)) fechas.push(f);
    cargarCacheGrilla();
    const need = fechas.filter(f => force || !st.grilla[f]), msg = $('sg-gr-msg');
    if (!need.length) { render(); if (msg) msg.textContent = `Grilla: ${fechas.length} días cruzados.`; return; }
    let fallos = 0, hechos = 0;
    for (let i = 0; i < need.length; i += 6) {
      await Promise.all(need.slice(i, i + 6).map(async f => {
        try {
          const j = await fetch('/api/grilla?date=' + f).then(r => r.json());
          if (!j || !j.success || !j.data || !Array.isArray(j.data.guards)) throw new Error('respuesta inesperada');
          const out = [];
          j.data.guards.filter(g => g.worksToday).forEach(g => (g.members || []).forEach(m =>
            out.push([String(m.userId).replace(/\D/g, ''), m.surname, m.specialty, String(g.shiftType).toUpperCase() === 'NOCHE' ? 'tarde' : 'manana', m.status, g.guardNumber])));
          st.grilla[f] = out;
        } catch (e) { fallos++; }
        hechos++; if (msg) msg.textContent = `Cruzando con la grilla… ${hechos}/${need.length}`;
      }));
    }
    try { const hoy = iso(new Date()), c = {}; Object.keys(st.grilla).forEach(f => { if (f < hoy) c[f] = st.grilla[f]; }); localStorage.setItem(GR_KEY, JSON.stringify(c)); } catch (e) { /* sin storage */ }
    if (msg) msg.textContent = fallos ? `⚠ Grilla: no se pudieron traer ${fallos} de ${need.length} días (sin conexión con la Grilla Inteligente); el cruce queda incompleto.` : `✅ Grilla cruzada: ${fechas.length} días.`;
    render();
  }
  /* Una entrada por técnico y turno: lo que cargó + si le tocaba trabajar. Con grilla, se suman los que estaban
     de guardia y no cargaron nada; los supervisores sólo aparecen si cargaron OTs. */
  function jornadasGrilla(rows) {
    const base = jornadas(rows), ds = Object.keys(st.grilla || {});
    if (!ds.length) return base;
    const q = norm($('sg-buscar').value), tu = $('sg-turno').value;
    const d1 = $('sg-desde').value || (rows.length ? rows.reduce((m, r) => r.d < m ? r.d : m, rows[0].d) : ''), d2 = $('sg-hasta').value || (rows.length ? rows.reduce((m, r) => r.d > m ? r.d : m, rows[0].d) : '');
    const porLD = new Map(); base.forEach(e => { if (!e.leg) return; const k = e.leg + '|' + e.d; (porLD.get(k) || porLD.set(k, []).get(k)).push(e); });
    const nombres = new Map(); st.rows.forEach(r => { if (legDe(r) && r.p !== 'Sin asignar' && !nombres.has(legDe(r))) nombres.set(legDe(r), r.p); });
    /* Si el legajo de SAP no figura en la grilla (o al revés), se empareja por apellido cuando es único */
    const gl = new Map(); ds.forEach(f => st.grilla[f].forEach(([leg, ap]) => { if (!gl.has(leg)) gl.set(leg, ap); }));
    const alias = {}; st.avisos = [];
    nombres.forEach((nom, leg) => {
      if (gl.has(leg)) return;
      const cand = [...gl].filter(([l, ap]) => !nombres.has(l) && norm(ap).split(' ').every(w => norm(nom).split(' ').includes(w)));
      if (cand.length === 1) { alias[cand[0][0]] = leg; st.avisos.push(`${nom}: legajo ${leg} en SAP y ${cand[0][0]} en la grilla (se cruzó por apellido; conviene corregir uno de los dos)`); }
    });
    const todas = base.slice();
    ds.filter(f => f >= d1 && f <= d2).sort().forEach(f => st.grilla[f].forEach(([leg0, ap, esp, t, estado, gd]) => {
      const leg = alias[leg0] || leg0, es = porLD.get(leg + '|' + f), sup = esp === 'SUPERVISOR';
      if (es) { es.forEach(e => { e.estado = estado; e.sup = sup; e.prog = estado === 'TRABAJO'; e.otroTurno = e.prog && e.t !== t; e.cuenta = e.prog && !sup; e.gd = e.prog ? gd : 0; }); return; }
      if (estado !== 'TRABAJO' || sup || (tu && t !== tu)) return;
      const nom = nombres.get(leg) || ap;
      if (q && !norm(nom + ' ' + ap).includes(q)) return;
      const e = entrada(nom, leg, f, t, []); e.prog = true; e.estado = 'TRABAJO'; e.cuenta = true; e.gd = gd; todas.push(e);
    }));
    base.forEach(e => { if (e.prog == null && st.grilla[e.d]) { e.prog = false; e.cuenta = false; } });   // sin grilla ese día: no se juzga
    return todas;
  }
  const clsMeta = x => x >= 1 ? 'm4' : x >= .75 ? 'm3' : x >= .5 ? 'm2' : 'm1';

  /* ── Tiempo registrado vs tiempo estándar (hoja de ruta de SAP) ── */
  const ORD_FREQ = ['Mensual', 'Bimestral', 'Trimestral', 'Cuatrimestral', 'Semestral', 'Anual'];
  let _hdrKey = null;
  function hdrEntry(ruta) {
    if (typeof HDR_DATA === 'undefined') return null;
    if (!_hdrKey) _hdrKey = new Map(HDR_DATA.map(e => [e.ruta + '/' + e.cont, e]));
    return _hdrKey.get(ruta) || null;
  }
  /* Estándar de una OT preventiva: rango [min,max] en horas-hombre y personas de la gama.
     Una OT "2M-6M" hace en la visita las tareas de todas sus frecuencias, así que el máximo suma
     las frecuencias que dice el nombre y el mínimo es sólo la más corta. */
  function estandarOT(nombre, eq) {
    /* vehículos: el estándar los mide por kilómetros, no por tiempo */
    if (!eq || /^AVO/.test(eq) || typeof hdrParaEquipo !== 'function' || !/^\s*(MP|IP|PD)\b/i.test(nombre)) return null;
    const h = hdrParaEquipo(eq, nombre), e = h && hdrEntry(h.ruta);
    if (!h || !e) return null;
    const toks = (String(nombre).toUpperCase().match(/(?<![A-Z0-9])(1M|2M|3M|4M|6M|1A)(?![A-Z0-9])/g) || []).map(t => HDR_BUCKET[t]);
    let fr = ORD_FREQ.filter(f => toks.includes(f));
    if (!fr.length && h.bucket) fr = [h.bucket];
    const pf = e.porFrec || {}, base = (pf._base && pf._base.dur) || 0;
    const ds = fr.map(f => pf[f] && pf[f].dur > 0 ? pf[f].dur : 0).filter(x => x > 0);
    let min, max;
    if (ds.length) { min = base + Math.min(...ds); max = base + ds.reduce((a, b) => a + b, 0); }
    else if (h.durMin != null) { min = max = h.durMin; }
    else return null;
    if (min > 480) return null;
    return { min: min * h.nPers, max: max * h.nPers, durMin: min, durMax: max, np: h.nPers, ruta: h.ruta, freq: fr.join('+') };
  }
  const TOL = 0.2;
  function compararOTs(rows) {
    const g = new Map();
    rows.forEach(r => { const x = g.get(r.o) || { o: r.o, on: r.on, eq: r.eq, ob: r.ob, rows: [], fin: 0, d: r.d }; x.rows.push(r); if (r.f) x.fin = 1; if (!x.eq && r.eq) x.eq = r.eq; g.set(r.o, x); });
    const out = [];
    g.forEach(x => {
      const pm = minPorPersona(x.rows), reg = pm.reduce((s, y) => s + y.min, 0);
      const tecs = [...new Set(pm.filter(y => y.min > 0 && y.p.trim() && y.p !== 'Sin asignar').map(y => y.p))];
      const std = estandarOT(x.on, x.eq);
      let v = 'sin';
      if (std) v = !x.fin ? 'parcial' : reg < std.min * (1 - TOL) ? 'bajo' : reg > std.max * (1 + TOL) ? 'alto' : 'ok';
      out.push({ ...x, reg, tecs, std, v, desv: std ? reg / ((std.min + std.max) / 2) - 1 : null });
    });
    return out;
  }
  const VER = { ok: ['En rango', 'ok'], bajo: ['Menos de lo que pide la gama', 'bajo'], alto: ['Más de lo que pide la gama', 'alto'], parcial: ['Sin notificación final', 'parcial'], sin: ['Sin estándar', 'sin'] };
  function barraEst(c) {
    if (!c.std) return '';
    const esc100 = Math.max(c.reg, c.std.max * (1 + TOL)) * 1.1 || 1, pc = x => (x / esc100 * 100).toFixed(1);
    return `<div class="sg-vs"><i class="band" style="left:${pc(c.std.min * (1 - TOL))}%;width:${pc(c.std.max * (1 + TOL) - c.std.min * (1 - TOL))}%"></i>` +
      `<i class="core" style="left:${pc(c.std.min)}%;width:${Math.max(.6, pc(c.std.max - c.std.min))}%"></i><b class="mk ${VER[c.v][1]}" style="left:${pc(c.reg)}%"></b></div>`;
  }

  /* ── Visuales ── */
  const FAM = { AAC: 'Aire acondicionado', MEQ: 'Patio de valijas', PPA: 'Puertas automáticas', AVO: 'Vehículos' };
  const famDe = r => { const m = (r.eq || '').match(/^[A-Z]+/); return m ? (FAM[m[0]] || m[0]) : 'Sin equipo'; };
  const charts = {};
  function chart(id, cfg) {
    if (typeof Chart === 'undefined' || !$(id)) return;
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart($(id), cfg);
  }
  function destruirCharts() { Object.keys(charts).forEach(k => { charts[k].destroy(); delete charts[k]; }); }
  const fmtDiaCorto = d => { const [, m, dd] = d.split('-'); return dd + '/' + m; };

  /* Avisos sobre la calidad del cruce: legajos distintos y días con muy pocas OTs en el export */
  function avisosHTML(rows, js) {
    if (!Object.keys(st.grilla).length) return '';
    const porDia = {}; rows.forEach(r => { (porDia[r.d] = porDia[r.d] || new Set()).add(r.o); });
    const cant = Object.values(porDia).map(x => x.size).sort((a, b) => a - b), med = cant.length ? cant[Math.floor(cant.length / 2)] : 0;
    const pocos = [...new Set(js.filter(j => j.cuenta).map(j => j.d))].filter(d => (porDia[d] ? porDia[d].size : 0) < med * 0.25).sort();
    const out = [];
    if (pocos.length >= 3) out.push(`<b>Ojo:</b> ${pocos.length} días tienen muy pocas OTs en el export (${fmtDiaCorto(pocos[0])} a ${fmtDiaCorto(pocos[pocos.length - 1])}), así que ahí "de guardia y sin OT" puede ser un export incompleto y no falta de carga. Usá Desde/Hasta para mirar sólo el período completo.`);
    (st.avisos || []).forEach(a => out.push(esc(a)));
    return out.length ? `<div class="sg-aviso">${out.map(x => `<p>${x}</p>`).join('')}</div>` : '';
  }

  /* Matriz técnico × día: cada celda = horas con OT, color = % de la meta productiva del turno.
     Con la grilla: rojo "0" = estaba de guardia y no cargó ninguna OT; borde violeta = cargó OTs en un día que figuraba de franco/licencia. */
  function matrizTecnicos(js) {
    if (!js.length) return '<p class="sg-hint">Sin datos.</p>';
    const dias = [...new Set(js.map(j => j.d))].sort(), nom = {};
    js.forEach(j => { nom[j.key] = nom[j.key] || j.p; });
    const tecs = Object.keys(nom).sort((a, b) => nom[a].localeCompare(nom[b]));
    const idx = {}; js.forEach(j => { (idx[j.key + '|' + j.d] = idx[j.key + '|' + j.d] || []).push(j); });
    const sel = st.sel || {}, conGrilla = Object.keys(st.grilla || {}).length > 0;
    const cab = dias.map(d => `<th title="${fmtDia(d)}">${fmtDiaCorto(d)}<small>${['D', 'L', 'M', 'X', 'J', 'V', 'S'][new Date(d + 'T12:00:00').getDay()]}</small></th>`).join('');
    const filas = tecs.map(k => {
      const tot = js.filter(j => j.key === k), hs = tot.reduce((s, j) => s + j.cub, 0) / 60, prog = tot.filter(j => j.cuenta).length, sin = tot.filter(j => j.cuenta && !j.ots).length;
      const sub = conGrilla ? `${prog} de guardia${sin ? ` · <b class="sg-rojo">${sin} sin OT</b>` : ''} · ${fh(hs)} h` : `${tot.length} turnos · ${fh(hs)} h`;
      return `<tr><th class="sg-mt-n" title="${esc(nom[k])}">${esc(nom[k].split(' ').slice(0, 2).join(' '))}<small>${sub}</small></th>` + dias.map(d => {
        const cs = idx[k + '|' + d];
        if (!cs) return '<td class="sg-mt-c libre"></td>';
        return `<td class="sg-mt-c">` + cs.map(j => {
          const cero = j.cuenta && !j.ots, fuera = conGrilla && j.prog === false && j.ots, on = sel.d === j.d && sel.t === j.t && sel.k === j.key;
          const quien = j.estado ? EST[j.estado] || j.estado : (conGrilla && j.prog === false ? 'no figura de guardia ese día' : '');
          return `<button class="sg-cell ${cero ? 'cero' : clsMeta(j.pctMeta)}${fuera ? ' fuera' : ''}${on ? ' on' : ''}" data-d="${j.d}" data-t="${j.t}" data-k="${esc(j.key)}" ` +
            `title="${esc(nom[k])} · ${fmtDia(j.d)} · ${TURNO[j.t]}${quien ? ' (' + esc(quien) + ')' : ''}&#10;${cero ? 'De guardia y sin ninguna OT cargada' : `${fh(j.cub / 60)} h con OT = ${Math.round(j.pctJ * 100)}% de 12 h · ${Math.round(j.pctMeta * 100)}% de la meta (${fh(metaH())} h)&#10;${j.ots} OT`}">${cero ? '0' : fh(j.cub / 60)}<em>${j.t === 'manana' ? '☀' : '☾'}</em></button>`;
        }).join('') + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return `<div class="sg-scroll"><table class="sg-mt"><thead><tr><th></th>${cab}</tr></thead><tbody>${filas}</tbody></table></div>` +
      `<div class="sg-leyenda">Horas con OT por técnico y turno · <span class="sw m4"></span> alcanza la meta · <span class="sw m3"></span> 75–99% · <span class="sw m2"></span> 50–74% · <span class="sw m1"></span> menos de la mitad` +
      (conGrilla ? ` · <span class="sw cero"></span> de guardia y sin ninguna OT · <span class="sw fuera"></span> cargó OTs sin figurar de guardia (franco, licencia…)` : '') +
      ` · 0,0 = cargó OTs pero sin horas · ☀ mañana ☾ tarde · casillero rayado = ese día no le tocaba${conGrilla ? '' : ' (o no cargó nada: sin la grilla no se puede distinguir)'}</div>`;
  }

  const COL_GUARDIA = { 1: '#2980b9', 2: '#27ae60', 3: '#9b59b6', 4: '#e67e22', 0: '#94a3b8' };
  /* Horas con OT por guardia y día (suma de lo que cargó cada técnico) contra la meta de los técnicos de guardia ese día */
  function graficoGuardias(js) {
    const hint = $('sg-ch-gd-hint'), conGrilla = Object.keys(st.grilla).length > 0;
    hint.classList.toggle('hidden', conGrilla);
    if (!conGrilla) { if (charts['sg-ch-gd']) { charts['sg-ch-gd'].destroy(); delete charts['sg-ch-gd']; } return; }
    const dias = [...new Set(js.map(j => j.d))].sort(), gds = [...new Set(js.map(j => j.gd))].sort((a, b) => a - b);
    const horas = (d, n) => +(js.filter(j => j.d === d && j.gd === n).reduce((s, j) => s + j.cub, 0) / 60).toFixed(1);
    chart('sg-ch-gd', {
      type: 'bar',
      data: {
        labels: dias.map(d => fmtDia(d).slice(0, 9)),
        datasets: [
          { type: 'line', label: `Meta de las guardias del día (${fh(metaH())} h × técnico de guardia)`, data: dias.map(d => +(js.filter(j => j.d === d && j.cuenta).length * metaH()).toFixed(1)),
            borderColor: '#0f172a', backgroundColor: '#0f172a', borderDash: [6, 4], tension: .2, pointRadius: 2, order: 0 },
          ...gds.map(n => ({ label: n ? 'Guardia ' + n : 'Sin figurar de guardia', data: dias.map(d => horas(d, n)), backgroundColor: COL_GUARDIA[n] || '#64748b', stack: 'h', borderRadius: 2, order: 1 }))
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
        scales: { y: { stacked: true, beginAtZero: true, title: { display: true, text: 'horas con OT' } }, x: { stacked: true } },
        plugins: { legend: { position: 'bottom' } } }
    });
  }

  function graficosJornada(g, js) {
    const ks = Object.keys(g).sort();
    chart('sg-ch-dias', {
      type: 'bar',
      data: {
        labels: ks.map(k => fmtDia(k).slice(0, 9)),
        datasets: [
          { type: 'line', label: 'Horas con OT por técnico de guardia (media)', data: ks.map(k => { const e = js.filter(j => j.d === k && j.cuenta); return e.length ? +(e.reduce((s, j) => s + j.cub, 0) / e.length / 60).toFixed(1) : 0; }),
            yAxisID: 'y2', borderColor: '#f59e0b', backgroundColor: '#f59e0b', tension: .3, pointRadius: 3 },
          { label: 'OTs mañana', data: ks.map(k => g[k].manana ? resumir(g[k].manana).ots : 0), backgroundColor: '#38bdf8', stack: 'a', borderRadius: 3 },
          { label: 'OTs tarde', data: ks.map(k => g[k].tarde ? resumir(g[k].tarde).ots : 0), backgroundColor: '#6366f1', stack: 'a', borderRadius: 3 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
        scales: { y: { stacked: true, beginAtZero: true, title: { display: true, text: 'OTs' } }, y2: { position: 'right', min: 0, max: 12, grid: { drawOnChartArea: false }, title: { display: true, text: 'horas con OT' } }, x: { stacked: true } },
        plugins: { legend: { position: 'bottom' } } }
    });
  }
  function graficosEstandar(cs) {
    const fam = {};
    cs.filter(c => c.std && c.v !== 'parcial').forEach(c => { const f = famDe(c), x = fam[f] = fam[f] || { reg: 0, exp: 0 }; x.reg += c.reg / 60; x.exp += (c.std.min + c.std.max) / 2 / 60; });
    const fk = Object.keys(fam).sort((a, b) => fam[b].exp - fam[a].exp);
    chart('sg-ch-vs', {
      type: 'bar',
      data: { labels: fk, datasets: [
        { label: 'Debería tardar (hoja de ruta)', data: fk.map(k => +fam[k].exp.toFixed(1)), backgroundColor: '#93c5fd', borderRadius: 3 },
        { label: 'Registrado en SAP', data: fk.map(k => +fam[k].reg.toFixed(1)), backgroundColor: '#1d4ed8', borderRadius: 3 }] },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'horas-hombre' } } }, plugins: { legend: { position: 'bottom' } } }
    });
  }

  /* ── Render ── */
  function render() {
    $('sg-vacio').classList.toggle('hidden', st.rows.length > 0);
    $('sg-main').classList.toggle('hidden', st.rows.length === 0);
    if (!st.rows.length) return;
    const rows = filtrado(), tot = resumir(rows), js = jornadasGrilla(rows), cs = compararOTs(rows), conGrilla = Object.keys(st.grilla).length > 0;
    const cj = js.filter(j => j.cuenta), prom = cj.length ? cj.reduce((s, j) => s + j.cub, 0) / cj.length : 0;
    const bajo50 = cj.filter(j => j.pctMeta < .5).length, sinOT = cj.filter(j => !j.ots).length, fuera = js.filter(j => j.prog === false && j.ots).length;
    const comp = cs.filter(c => c.std && c.v !== 'parcial'), regC = comp.reduce((s, c) => s + c.reg, 0), expC = comp.reduce((s, c) => s + (c.std.min + c.std.max) / 2, 0);
    const kp = [
      ['OTs trabajadas', tot.ots, `${tot.fin} con notificación final`],
      ['Horas registradas', fh(tot.horas), `${tot.pers} técnicos · tiempo de reloj`],
      ['Horas con OT por turno', fh(prom / 60), `de 12 h · ${cj.length ? Math.round(prom / DUR * 100) : 0}% de la jornada${conGrilla ? ' · incluye los que no cargaron' : ''}`],
      ['Frente a la meta', cj.length ? Math.round(prom / (metaH() * 60) * 100) + '%' : '—', `meta ${fh(metaH())} h · ${bajo50} turnos bajo la mitad`],
      conGrilla ? ['De guardia y sin ninguna OT', sinOT, `de ${cj.length} turnos programados${fuera ? ` · ${fuera} con OTs sin figurar de guardia` : ''}`]
        : ['Turnos con OT', cj.length, 'sin cruce con la grilla: no se ven los que no cargaron'],
      ['Registrado vs estándar', expC ? Math.round(regC / expC * 100) + '%' : '—', `${comp.length} OTs preventivas comparables`]];
    $('sg-kpis').innerHTML = kp.map(([l, v, s]) => `<div class="sg-kpi"><b>${v}</b><span>${l}</span><small>${s}</small></div>`).join('');
    document.querySelectorAll('.sg-tabbtn').forEach(b => b.classList.toggle('on', b.dataset.tab === st.tab));
    document.querySelectorAll('.sg-panel').forEach(p => p.classList.toggle('hidden', p.dataset.tab !== st.tab));
    const g = {};
    rows.forEach(r => { (g[r.d] = g[r.d] || {})[r.t] = (g[r.d][r.t] || []).concat(r); });

    /* Pestaña 1: jornada */
    $('sg-matriz').innerHTML = avisosHTML(rows, js) + matrizTecnicos(js);
    renderJornadaSel(js);
    /* Pestaña 2: estándar */
    renderEstandar(cs, comp, regC, expC);
    /* Pestaña 3: día y turno */
    const dias = Object.keys(g).sort().reverse();
    $('sg-dias').innerHTML = dias.map(d => {
      const ts = ['manana', 'tarde'].filter(t => g[d][t]);
      return ts.map((t, i) => {
        const s = resumir(g[d][t]), cv = cobertura(g[d][t], t), sel = st.sel && st.sel.d === d && st.sel.t === t && !st.sel.k;
        return `<tr class="sg-row${sel ? ' on' : ''}" data-d="${d}" data-t="${t}">${i === 0 ? `<td rowspan="${ts.length}"><b>${fmtDia(d)}</b></td>` : ''}` +
          `<td>${TURNO[t]}</td><td>${s.ots}</td><td>${s.fin}</td><td>${s.conf}</td><td>${s.pers}</td><td>${fh(s.horas)}</td>` +
          `<td>${conGrilla ? (n => n ? `<b class="sg-rojo">${n}</b>` : '0')(js.filter(j => j.d === d && j.t === t && j.cuenta && !j.ots).length) : '—'}</td>` +
          `<td><span class="sg-pct ${cv.pct >= 75 ? 'ok' : cv.pct >= 50 ? 'mid' : 'bad'}">${cv.pct}%</span></td><td class="sg-huecos">${fmtHuecos(cv.huecos, t)}</td></tr>`;
      }).join('');
    }).join('') || '<tr><td colspan="10" class="sg-hint">Sin datos para el filtro.</td></tr>';
    renderDetalle(rows);
    /* los gráficos sólo se dibujan si su pestaña está visible (canvas oculto = tamaño 0) */
    if (st.tab === 'jornada') { graficosJornada(g, js); graficoGuardias(js); } else if (st.tab === 'estandar') graficosEstandar(cs);
  }

  /* Línea de tiempo de un técnico en un turno: un bloque por OT, y lo que queda sin OT */
  const PAL = ['#0ea5e9', '#6366f1', '#16a34a', '#f59e0b', '#ec4899', '#14b8a6', '#8b5cf6', '#ef4444', '#84cc16', '#f97316'];
  function ganttTecnico(j, cmpPorOT) {
    const t = j.t, ivs = intervalos(j.rows, t), ots = [...new Set(ivs.map(x => x[2].o))], col = o => PAL[ots.indexOf(o) % PAL.length];
    const bloques = ivs.map(([a, b, r]) => `<i style="left:${a / DUR * 100}%;width:${Math.max(.4, (b - a) / DUR * 100)}%;background:${col(r.o)}" title="${esc(r.on)} (${esc(r.eq)})&#10;${hhm(r.hi)}–${r.hf == null ? '' : hhm(r.hf)}"></i>`).join('');
    const meta = metaH() * 60;
    const lista = ots.map(o => {
      const rr = j.rows.filter(r => r.o === o), r0 = rr[0], c = cmpPorOT[o], mins = minPorPersona(rr).reduce((s, y) => s + y.min, 0);
      const hor = rr.filter(r => r.hf != null && durRow(r) > 0).sort((a, b) => a.hi - b.hi).map(r => `${hhm(r.hi)}–${hhm(r.hf)}`).join(' · ');
      const est = c && c.std ? `<span class="sg-chip ${VER[c.v][1]}">${VER[c.v][0]}${c.v !== 'parcial' ? ` · gama ${fh(c.std.min / 60)}${c.std.max > c.std.min ? '–' + fh(c.std.max / 60) : ''} h-h` : ''}</span>` : '';
      return `<li><span class="dot" style="background:${col(o)}"></span><b>${esc(r0.on)}</b> <small>${esc(r0.eq)} · OT ${esc(o)}</small><span class="sg-li-d">${hor} · ${fh(mins / 60)} h ${est}</span></li>`;
    }).join('');
    return `<div class="sg-g"><div class="sg-g-bar"><div class="sg-g-meta" style="width:${Math.min(100, meta / DUR * 100)}%" title="meta productiva ${fh(metaH())} h"></div>${bloques}</div><div class="sg-tl-marks">${marcasHTML(t)}</div></div>` +
      `<p class="sg-hint"><b>${fh(j.cub / 60)} h con OT</b> de 12 h (${Math.round(j.pctJ * 100)}%) · ${Math.round(j.pctMeta * 100)}% de la meta de ${fh(metaH())} h. Sin OT cargada: ${fmtHuecos(j.cv.huecos, t)}. La franja gris marca lo que se espera productivo; el resto es almuerzo, descansos y recorridas.</p><ul class="sg-li">${lista}</ul>`;
  }
  function renderJornadaSel(js) {
    const box = $('sg-jsel'), s = st.sel;
    if (!s || !s.k) { box.innerHTML = '<p class="sg-hint">Tocá una celda de la matriz para ver el turno de ese técnico hora por hora.</p>'; return; }
    const j = js.find(x => x.key === s.k && x.d === s.d && x.t === s.t);
    if (!j) { box.innerHTML = '<p class="sg-hint">Ese turno no está en el filtro actual.</p>'; return; }
    const cm = {}; compararOTs(j.rows).forEach(c => { cm[c.o] = c; });
    const quien = j.estado ? EST[j.estado] || j.estado : (Object.keys(st.grilla).length ? 'no figura de guardia ese día' : '');
    const aviso = j.cuenta && !j.ots ? '<p class="sg-hint"><b class="sg-rojo">Estaba de guardia y no cargó ninguna OT en este turno.</b></p>'
      : j.prog === false && Object.keys(st.grilla).length && j.estado ? `<p class="sg-hint"><b>Figuraba de ${esc(quien)}</b> y cargó OTs este día.</p>`
      : j.otroTurno ? '<p class="sg-hint">Le tocaba el otro turno de ese día.</p>' : '';
    box.innerHTML = `<h3 class="sg-h">${esc(j.p)} · ${fmtDia(j.d)} · ${TURNO[j.t]}${quien ? ` <span class="sg-chip sin">${esc(quien)}</span>` : ''}</h3>${aviso}` + ganttTecnico(j, cm);
  }

  function renderEstandar(cs, comp, regC, expC) {
    const cero = comp.filter(c => c.reg === 0).length, cnt = v => comp.filter(c => c.v === v).length, sin = cs.filter(c => c.v === 'sin').length, par = cs.filter(c => c.v === 'parcial').length;
    $('sg-est-res').innerHTML = comp.length ? `<div class="sg-resumen">` +
      `<div class="chipbox"><b>${comp.length}</b> OTs preventivas con notificación final · <b>${fh(regC / 60)} h-h</b> registradas contra <b>${fh(expC / 60)} h-h</b> que pide la gama (${Math.round(regC / expC * 100)}%)</div>` +
      `<div class="sg-vchips">` + ['ok', 'bajo', 'alto'].map(v => `<button class="sg-vc ${v}${st.vf === v ? ' on' : ''}" data-v="${v}"><b>${cnt(v)}</b>${VER[v][0]}</button>`).join('') +
      `<button class="sg-vc todas${st.vf === 'todas' ? ' on' : ''}" data-v="todas"><b>${comp.length}</b>Todas</button></div>` +
      `<p class="sg-hint">${cero ? `<b>${cero} OT quedaron cerradas con 0 horas cargadas</b> (cuentan como "menos de lo que pide la gama"). ` : ''}${par} OT sin notificación final (no se juzgan) · ${sin} sin estándar (correctivas, trabajos puntuales, vehículos o equipos sin hoja de ruta).</p></div>`
      : '<p class="sg-hint">No hay OTs preventivas con estándar en este filtro.</p>';
    const ver = comp.filter(c => st.vf === 'todas' || c.v === st.vf).sort((a, b) => Math.abs(b.reg - (b.std.min + b.std.max) / 2) - Math.abs(a.reg - (a.std.min + a.std.max) / 2));
    $('sg-est-tab').innerHTML = ver.map(c => {
      const pct = Math.round(c.desv * 100);
      return `<tr><td><b>${esc(c.on)}</b><br><small>OT ${esc(c.o)} · ${fmtDia(c.d)}</small></td><td>${esc(c.eq)}<br><small>${esc(c.ob)}</small></td>` +
        `<td>${c.tecs.length} / ${c.std.np}<br><small>reales / gama</small></td>` +
        `<td><b>${fh(c.reg / 60)} h</b></td><td>${fh(c.std.min / 60)}${c.std.max > c.std.min ? '–' + fh(c.std.max / 60) : ''} h<br><small>${c.std.freq || ''} · ${esc(c.std.ruta)}</small></td>` +
        `<td class="sg-vscell">${barraEst(c)}</td><td><span class="sg-chip ${VER[c.v][1]}">${pct > 0 ? '+' : ''}${pct}%</span></td></tr>`;
    }).join('') || '<tr><td colspan="7" class="sg-hint">Nada para mostrar con ese filtro.</td></tr>';
  }

  function renderDetalle(rows) {
    const box = $('sg-detalle');
    if (!st.sel || st.sel.k) { box.innerHTML = '<p class="sg-hint">Tocá un día/turno de la tabla para ver quién hizo qué.</p>'; return; }
    const rr = rows.filter(r => r.d === st.sel.d && r.t === st.sel.t);
    const porP = {};
    rr.forEach(r => { (porP[r.p] = porP[r.p] || []).push(r); });
    const cv = cobertura(rr, st.sel.t);
    const sinCarga = Object.keys(st.grilla).length ? jornadasGrilla(rows).filter(j => j.d === st.sel.d && j.t === st.sel.t && j.cuenta && !j.ots).map(j => j.p) : null;
    const lineaGrilla = sinCarga ? `<p class="sg-hint">${sinCarga.length ? `<b class="sg-rojo">De guardia y sin ninguna OT (${sinCarga.length}):</b> ${esc(sinCarga.sort().join(', '))}` : 'Todos los técnicos de guardia cargaron OTs.'}</p>` : '';
    box.innerHTML = `<h3>${fmtDia(st.sel.d)} · ${TURNO[st.sel.t]}</h3>${lineaGrilla}<p class="sg-hint">Con al menos un técnico trabajando ${cv.pct}% del turno (${fh(cv.cub / 60)} de 12 h). Huecos de 30 min o más: ${fmtHuecos(cv.huecos, st.sel.t)}</p>` + lineaTiempo(rr, st.sel.t) + Object.keys(porP).sort().map(p => {
      const s = resumir(porP[p]);
      return `<details class="sg-pers"><summary><span class="sg-pn"><b>${esc(p)}</b> — ${s.ots} OT · ${fh(s.horas)} h</span>${lineaTiempo(porP[p], st.sel.t, true)}</summary><div class="sg-scroll"><table class="sg-tab"><thead><tr><th>OT</th><th>Equipo</th><th>Operación</th><th>Horario</th><th>Horas</th><th>Final</th><th>Texto</th></tr></thead><tbody>` +
        porP[p].sort((a, b) => a.hi - b.hi).map(r => `<tr><td>${esc(r.o)}<br><small>${esc(r.on)}</small></td><td>${esc(r.eq)}<br><small>${esc(r.ob)}</small></td><td>${esc(r.op)}</td>` +
          `<td>${hhm(r.hi)}–${r.hf == null ? '' : hhm(r.hf)}</td><td>${fh(durRow(r) / 60)}</td><td>${r.f ? '✔' : ''}</td><td>${esc(r.x)}</td></tr>`).join('') +
        '</tbody></table></div></details>';
    }).join('');
  }

  function exportar() {
    const rows = filtrado().sort((a, b) => a.d.localeCompare(b.d) || a.t.localeCompare(b.t) || a.hi - b.hi);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows.map(r => ({ Fecha: r.d, Turno: TURNO[r.t], Técnico: r.p, OT: r.o, 'Descripción OT': r.on, Equipo: r.eq, Objeto: r.ob, Operación: r.op,
      Inicio: hhm(r.hi), Fin: r.hf == null ? '' : hhm(r.hf), Horas: +(durRow(r) / 60).toFixed(2), 'Notif. final': r.f ? 'Sí' : 'No', Texto: r.x }))), 'Detalle');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(jornadasGrilla(rows).sort((a, b) => a.d.localeCompare(b.d) || a.p.localeCompare(b.p)).map(j => ({
      Fecha: j.d, Turno: TURNO[j.t], Técnico: j.p, 'Legajo': j.leg, 'Grilla': j.estado ? (EST[j.estado] || j.estado) : (Object.keys(st.grilla).length ? 'no figura de guardia' : ''), OTs: j.ots, 'Horas con OT': +(j.cub / 60).toFixed(2), '% de 12 h': Math.round(j.pctJ * 100), 'Meta (h)': metaH(), '% de la meta': Math.round(j.pctMeta * 100), 'Tramos sin OT (>=30 min)': fmtHuecos(j.cv.huecos, j.t) }))), 'Jornada por técnico');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(compararOTs(rows).filter(c => c.std).sort((a, b) => a.d.localeCompare(b.d)).map(c => ({
      Fecha: c.d, OT: c.o, 'Descripción OT': c.on, Equipo: c.eq, Técnicos: c.tecs.join(', '), 'Personas reales': c.tecs.length, 'Personas gama': c.std.np,
      'Registrado (h-h)': +(c.reg / 60).toFixed(2), 'Gama mín (h-h)': +(c.std.min / 60).toFixed(2), 'Gama máx (h-h)': +(c.std.max / 60).toFixed(2), 'Desvío %': Math.round(c.desv * 100), Veredicto: VER[c.v][0], 'Hoja de ruta': c.std.ruta }))), 'Vs estándar');
    const g = {};
    rows.forEach(r => { (g[r.d + '|' + r.t] = g[r.d + '|' + r.t] || []).push(r); });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(Object.keys(g).sort().map(k => {
      const [d, t] = k.split('|'), s = resumir(g[k]);
      const cv = cobertura(g[k], t);
      return { Fecha: d, Turno: TURNO[t], OTs: s.ots, 'Con final': s.fin, Confirmaciones: s.conf, Técnicos: s.pers, Horas: +s.horas.toFixed(2), 'Cobertura %': cv.pct, 'Huecos (>=30 min)': fmtHuecos(cv.huecos, t) };
    })), 'Por día y turno');
    XLSX.writeFile(wb, 'Seguimiento_OTs.xlsx');
  }

  /* ── Acceso: contraseña verificada en el servidor ── */
  async function verificar() {
    const gate = $('sg-gate'), body = $('sg-body');
    body.classList.add('hidden'); gate.classList.remove('hidden');
    const pwd = sessionStorage.getItem('admin_pwd');
    if (!window.adminMode || !pwd) { gate.textContent = '🔒 Sección reservada. Entrá con el candado (modo administrador) y volvé a abrirla.'; return; }
    gate.textContent = 'Verificando acceso…';
    try {
      const r = await fetch('/api/verify-admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd }) });
      if (!r.ok) {
        gate.textContent = r.status === 401 ? '❌ Contraseña incorrecta.' : '❌ No se pudo verificar el acceso (' + r.status + ').';
        if (r.status === 401 && typeof _adminLogout === 'function') setTimeout(_adminLogout, 1500);
        return;
      }
    } catch (e) { gate.textContent = '❌ No se pudo verificar el acceso (sin conexión con el servidor).'; return; }
    gate.classList.add('hidden'); body.classList.remove('hidden'); load(); periodoPorDefecto(); render(); traerGrilla();
  }

  function init() {
    const page = $('page-ots-seguimiento');
    if (!page) return;
    $('sg-file').addEventListener('change', e => { if (e.target.files[0]) importFile(e.target.files[0]); e.target.value = ''; });
    ['sg-desde', 'sg-hasta'].forEach(id => $(id).addEventListener('change', () => { render(); traerGrilla(); }));
    $('sg-turno').addEventListener('change', render);
    $('sg-buscar').addEventListener('input', render);
    $('sg-export').addEventListener('click', exportar);
    $('sg-gr-btn').addEventListener('click', () => traerGrilla(true));
    try { const m = localStorage.getItem(META_KEY); if (m) $('sg-meta').value = m; } catch (e) { /* sin storage */ }
    $('sg-meta').addEventListener('change', () => { try { localStorage.setItem(META_KEY, $('sg-meta').value); } catch (e) { /* sin storage */ } render(); });
    document.querySelectorAll('.sg-tabbtn').forEach(b => b.addEventListener('click', () => { st.tab = b.dataset.tab; render(); }));
    $('sg-matriz').addEventListener('click', e => {
      const b = e.target.closest('.sg-cell'); if (!b) return;
      st.sel = { d: b.dataset.d, t: b.dataset.t, k: b.dataset.k }; render();
    });
    $('sg-est-res').addEventListener('click', e => { const b = e.target.closest('.sg-vc'); if (b) { st.vf = b.dataset.v; render(); } });
    $('sg-borrar').addEventListener('click', () => {
      if (confirm('¿Borrar todos los datos de seguimiento guardados en este navegador?')) { st.rows = []; st.sel = null; st.grilla = {}; try { localStorage.removeItem(GR_KEY); } catch (e) { /* sin storage */ } save(); render(); }
    });
    $('sg-dias').addEventListener('click', e => {
      const tr = e.target.closest('tr[data-d]'); if (!tr) return;
      st.sel = { d: tr.dataset.d, t: tr.dataset.t }; render();
    });
    /* se re-verifica cada vez que se muestra la página; al salir se limpian los datos del DOM */
    new MutationObserver(() => {
      if (!page.classList.contains('hidden')) verificar();
      else { $('sg-body').classList.add('hidden'); $('sg-dias').innerHTML = ''; $('sg-detalle').innerHTML = ''; st.sel = null; st.rows = []; destruirCharts(); ['sg-matriz', 'sg-jsel', 'sg-est-tab', 'sg-est-res'].forEach(id => { $(id).innerHTML = ''; }); }
    }).observe(page, { attributes: true, attributeFilter: ['class'] });
  }
  init();
  if (typeof module !== 'undefined') module.exports = { estandarOT, compararOTs, minPorPersona, jornadas, jornadasGrilla, cobertura, parseSheet, st };
})();
