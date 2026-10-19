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
  const st = { rows: [], sel: null, tab: 'jornada', vf: 'todas' };
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
        save(); render();
        $('sg-msg').textContent = `✅ ${nuevos.length} renglones del ${fmtDia(desde)} al ${fmtDia(hasta)}` + (reemplazados ? ` · reemplazaron ${reemplazados} anteriores de ese período.` : '.');
      } catch (err) { $('sg-msg').textContent = '❌ ' + err.message; }
    };
    rd.readAsArrayBuffer(file);
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
  function jornadas(rows) {
    const g = {};
    rows.forEach(r => { if (r.p === 'Sin asignar') return; const k = r.p + '|' + r.d + '|' + r.t; (g[k] = g[k] || []).push(r); });
    const meta = metaH() * 60;
    return Object.keys(g).map(k => {
      const [p, d, t] = k.split('|'), rr = g[k], cv = cobertura(rr, t);
      return { p, d, t, rows: rr, cv, cub: cv.cub, pctMeta: cv.cub / meta, pctJ: cv.cub / DUR, ots: new Set(rr.map(r => r.o)).size };
    });
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

  /* Matriz técnico × día: cada celda = horas con OT, color = % de la meta productiva del turno */
  function matrizTecnicos(js) {
    if (!js.length) return '<p class="sg-hint">Sin datos.</p>';
    const dias = [...new Set(js.map(j => j.d))].sort(), tecs = [...new Set(js.map(j => j.p))].sort((a, b) => a.localeCompare(b));
    const idx = {}; js.forEach(j => { (idx[j.p + '|' + j.d] = idx[j.p + '|' + j.d] || []).push(j); });
    const sel = st.sel || {};
    const cab = dias.map(d => `<th title="${fmtDia(d)}">${fmtDiaCorto(d)}<small>${['D', 'L', 'M', 'X', 'J', 'V', 'S'][new Date(d + 'T12:00:00').getDay()]}</small></th>`).join('');
    const filas = tecs.map(p => {
      const tot = js.filter(j => j.p === p), hs = tot.reduce((s, j) => s + j.cub, 0) / 60;
      return `<tr><th class="sg-mt-n" title="${esc(p)}">${esc(p.split(' ').slice(0, 2).join(' '))}<small>${tot.length} turnos · ${fh(hs)} h</small></th>` + dias.map(d => {
        const cs = idx[p + '|' + d];
        if (!cs) return '<td class="sg-mt-c libre"></td>';
        return `<td class="sg-mt-c">` + cs.map(j => `<button class="sg-cell ${clsMeta(j.pctMeta)}${sel.d === j.d && sel.t === j.t && sel.p === j.p ? ' on' : ''}" data-d="${j.d}" data-t="${j.t}" data-p="${esc(j.p)}" ` +
          `title="${esc(p)} · ${fmtDia(d)} · ${TURNO[j.t]}&#10;${fh(j.cub / 60)} h con OT = ${Math.round(j.pctJ * 100)}% de 12 h · ${Math.round(j.pctMeta * 100)}% de la meta (${fh(metaH())} h)&#10;${j.ots} OT">${fh(j.cub / 60)}<em>${j.t === 'manana' ? '☀' : '☾'}</em></button>`).join('') + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return `<div class="sg-scroll"><table class="sg-mt"><thead><tr><th></th>${cab}</tr></thead><tbody>${filas}</tbody></table></div>` +
      `<div class="sg-leyenda">Horas con OT por técnico y turno · <span class="sw m4"></span> alcanza la meta · <span class="sw m3"></span> 75–99% · <span class="sw m2"></span> 50–74% · <span class="sw m1"></span> menos de la mitad · ☀ mañana ☾ tarde · celda vacía = ese día no cargó ninguna OT (o no trabajó)</div>`;
  }

  /* Mapa de calor: filas = días (operativos), columnas = 24 h desde las 06:00 (mañana | tarde). */
  function mapaCalor(rows) {
    const dias = {};
    rows.forEach(r => {
      const ini = ((r.hi - 360) % 1440 + 1440) % 1440, len = r.hf == null ? r.m : durRow(r);
      if (!len) return;
      const fin = Math.min(1440, ini + len), d = dias[r.d] = dias[r.d] || Array.from({ length: 24 }, () => new Set());
      for (let h = Math.floor(ini / 60); h < 24 && h * 60 < fin; h++) d[h].add(r.p);
    });
    const ks = Object.keys(dias).sort();
    if (!ks.length) return '<p class="sg-hint">Sin datos.</p>';
    let max = 1; ks.forEach(k => dias[k].forEach(x => { if (x.size > max) max = x.size; }));
    const cab = Array.from({ length: 24 }, (_, h) => `<div class="sg-hh${h === 12 ? ' cut' : ''}">${h % 3 === 0 ? String((6 + h) % 24).padStart(2, '0') : ''}</div>`).join('');
    const filas = ks.map(k => `<div class="sg-hl">${fmtDia(k).slice(0, 9)}</div>` + dias[k].map((x, h) => {
      const n = x.size, a = n ? (0.25 + 0.75 * n / max) : 0;
      return `<div class="sg-hc${h === 12 ? ' cut' : ''}${n ? '' : ' vacio'}" style="${n ? `background:rgba(22,163,74,${a.toFixed(2)})` : ''}" title="${fmtDia(k)} · ${String((6 + h) % 24).padStart(2, '0')}:00 · ${n} técnico${n === 1 ? '' : 's'} con OT"></div>`;
    }).join('')).join('');
    return `<div class="sg-heat"><div></div>${cab}${filas}</div><div class="sg-leyenda"><span class="vac"></span> sin actividad <span class="alt"></span> más técnicos con OT · el corte divide Mañana | Tarde</div>`;
  }

  function graficosJornada(g) {
    const ks = Object.keys(g).sort();
    chart('sg-ch-dias', {
      type: 'bar',
      data: {
        labels: ks.map(k => fmtDia(k).slice(0, 9)),
        datasets: [
          { type: 'line', label: 'Horas con OT por técnico (media)', data: ks.map(k => { const js = jornadas(['manana', 'tarde'].flatMap(t => g[k][t] || [])); return js.length ? +(js.reduce((s, j) => s + j.cub, 0) / js.length / 60).toFixed(1) : 0; }),
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
    const rows = filtrado(), tot = resumir(rows), js = jornadas(rows), cs = compararOTs(rows);
    const prom = js.length ? js.reduce((s, j) => s + j.cub, 0) / js.length : 0;
    const bajo50 = js.filter(j => j.pctMeta < .5).length;
    const comp = cs.filter(c => c.std && c.v !== 'parcial'), regC = comp.reduce((s, c) => s + c.reg, 0), expC = comp.reduce((s, c) => s + (c.std.min + c.std.max) / 2, 0);
    const kp = [
      ['OTs trabajadas', tot.ots, `${tot.fin} con notificación final`],
      ['Horas registradas', fh(tot.horas), `${tot.pers} técnicos · tiempo de reloj`],
      ['Horas con OT por turno', fh(prom / 60), `de 12 h · ${js.length ? Math.round(prom / DUR * 100) : 0}% de la jornada`],
      ['Frente a la meta', js.length ? Math.round(prom / (metaH() * 60) * 100) + '%' : '—', `meta ${fh(metaH())} h productivas por turno`],
      ['Turnos bajo la mitad de la meta', bajo50, `de ${js.length} turnos-técnico`],
      ['Registrado vs estándar', expC ? Math.round(regC / expC * 100) + '%' : '—', `${comp.length} OTs preventivas comparables`]];
    $('sg-kpis').innerHTML = kp.map(([l, v, s]) => `<div class="sg-kpi"><b>${v}</b><span>${l}</span><small>${s}</small></div>`).join('');
    document.querySelectorAll('.sg-tabbtn').forEach(b => b.classList.toggle('on', b.dataset.tab === st.tab));
    document.querySelectorAll('.sg-panel').forEach(p => p.classList.toggle('hidden', p.dataset.tab !== st.tab));
    const g = {};
    rows.forEach(r => { (g[r.d] = g[r.d] || {})[r.t] = (g[r.d][r.t] || []).concat(r); });

    /* Pestaña 1: jornada */
    $('sg-matriz').innerHTML = matrizTecnicos(js);
    $('sg-heatmap').innerHTML = mapaCalor(rows);
    renderJornadaSel(rows);
    /* Pestaña 2: estándar */
    renderEstandar(cs, comp, regC, expC);
    /* Pestaña 3: día y turno */
    const dias = Object.keys(g).sort().reverse();
    $('sg-dias').innerHTML = dias.map(d => {
      const ts = ['manana', 'tarde'].filter(t => g[d][t]);
      return ts.map((t, i) => {
        const s = resumir(g[d][t]), cv = cobertura(g[d][t], t), sel = st.sel && st.sel.d === d && st.sel.t === t && !st.sel.p;
        return `<tr class="sg-row${sel ? ' on' : ''}" data-d="${d}" data-t="${t}">${i === 0 ? `<td rowspan="${ts.length}"><b>${fmtDia(d)}</b></td>` : ''}` +
          `<td>${TURNO[t]}</td><td>${s.ots}</td><td>${s.fin}</td><td>${s.conf}</td><td>${s.pers}</td><td>${fh(s.horas)}</td>` +
          `<td><span class="sg-pct ${cv.pct >= 75 ? 'ok' : cv.pct >= 50 ? 'mid' : 'bad'}">${cv.pct}%</span></td><td class="sg-huecos">${fmtHuecos(cv.huecos, t)}</td></tr>`;
      }).join('');
    }).join('') || '<tr><td colspan="9" class="sg-hint">Sin datos para el filtro.</td></tr>';
    renderDetalle(rows);
    /* los gráficos sólo se dibujan si su pestaña está visible (canvas oculto = tamaño 0) */
    if (st.tab === 'jornada') graficosJornada(g); else if (st.tab === 'estandar') graficosEstandar(cs);
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
  function renderJornadaSel(rows) {
    const box = $('sg-jsel'), s = st.sel;
    if (!s || !s.p) { box.innerHTML = '<p class="sg-hint">Tocá una celda de la matriz para ver el turno de ese técnico hora por hora.</p>'; return; }
    const j = jornadas(rows.filter(r => r.p === s.p && r.d === s.d && r.t === s.t))[0];
    if (!j) { box.innerHTML = '<p class="sg-hint">Ese turno no está en el filtro actual.</p>'; return; }
    const cm = {}; compararOTs(j.rows).forEach(c => { cm[c.o] = c; });
    box.innerHTML = `<h3 class="sg-h">${esc(s.p)} · ${fmtDia(s.d)} · ${TURNO[s.t]}</h3>` + ganttTecnico(j, cm);
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
    if (!st.sel || st.sel.p) { box.innerHTML = '<p class="sg-hint">Tocá un día/turno de la tabla para ver quién hizo qué.</p>'; return; }
    const rr = rows.filter(r => r.d === st.sel.d && r.t === st.sel.t);
    const porP = {};
    rr.forEach(r => { (porP[r.p] = porP[r.p] || []).push(r); });
    const cv = cobertura(rr, st.sel.t);
    box.innerHTML = `<h3>${fmtDia(st.sel.d)} · ${TURNO[st.sel.t]}</h3><p class="sg-hint">Con al menos un técnico trabajando ${cv.pct}% del turno (${fh(cv.cub / 60)} de 12 h). Huecos de 30 min o más: ${fmtHuecos(cv.huecos, st.sel.t)}</p>` + lineaTiempo(rr, st.sel.t) + Object.keys(porP).sort().map(p => {
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
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(jornadas(rows).sort((a, b) => a.d.localeCompare(b.d) || a.p.localeCompare(b.p)).map(j => ({
      Fecha: j.d, Turno: TURNO[j.t], Técnico: j.p, OTs: j.ots, 'Horas con OT': +(j.cub / 60).toFixed(2), '% de 12 h': Math.round(j.pctJ * 100), 'Meta (h)': metaH(), '% de la meta': Math.round(j.pctMeta * 100), 'Tramos sin OT (>=30 min)': fmtHuecos(j.cv.huecos, j.t) }))), 'Jornada por técnico');
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
    gate.classList.add('hidden'); body.classList.remove('hidden'); load(); render();
  }

  function init() {
    const page = $('page-ots-seguimiento');
    if (!page) return;
    $('sg-file').addEventListener('change', e => { if (e.target.files[0]) importFile(e.target.files[0]); e.target.value = ''; });
    ['sg-desde', 'sg-hasta', 'sg-turno'].forEach(id => $(id).addEventListener('change', render));
    $('sg-buscar').addEventListener('input', render);
    $('sg-export').addEventListener('click', exportar);
    try { const m = localStorage.getItem(META_KEY); if (m) $('sg-meta').value = m; } catch (e) { /* sin storage */ }
    $('sg-meta').addEventListener('change', () => { try { localStorage.setItem(META_KEY, $('sg-meta').value); } catch (e) { /* sin storage */ } render(); });
    document.querySelectorAll('.sg-tabbtn').forEach(b => b.addEventListener('click', () => { st.tab = b.dataset.tab; render(); }));
    $('sg-matriz').addEventListener('click', e => {
      const b = e.target.closest('.sg-cell'); if (!b) return;
      st.sel = { d: b.dataset.d, t: b.dataset.t, p: b.dataset.p }; render();
    });
    $('sg-est-res').addEventListener('click', e => { const b = e.target.closest('.sg-vc'); if (b) { st.vf = b.dataset.v; render(); } });
    $('sg-borrar').addEventListener('click', () => {
      if (confirm('¿Borrar todos los datos de seguimiento guardados en este navegador?')) { st.rows = []; st.sel = null; save(); render(); }
    });
    $('sg-dias').addEventListener('click', e => {
      const tr = e.target.closest('tr[data-d]'); if (!tr) return;
      st.sel = { d: tr.dataset.d, t: tr.dataset.t }; render();
    });
    /* se re-verifica cada vez que se muestra la página; al salir se limpian los datos del DOM */
    new MutationObserver(() => {
      if (!page.classList.contains('hidden')) verificar();
      else { $('sg-body').classList.add('hidden'); $('sg-dias').innerHTML = ''; $('sg-detalle').innerHTML = ''; st.sel = null; st.rows = []; destruirCharts(); ['sg-heatmap', 'sg-matriz', 'sg-jsel', 'sg-est-tab', 'sg-est-res'].forEach(id => { $(id).innerHTML = ''; }); }
    }).observe(page, { attributes: true, attributeFilter: ['class'] });
  }
  init();
  if (typeof module !== 'undefined') module.exports = { estandarOT, compararOTs, minPorPersona, jornadas, cobertura, parseSheet, st };
})();
