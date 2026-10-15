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
  const st = { rows: [], sel: null };

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
      hini: col('hora del inicio'), ffin: col('fecha de fin'), hfin: col('hora de fin') };
    if (c.orden < 0 || c.pers < 0 || c.ffin < 0 || c.hini < 0) throw new Error('El archivo no parece el export "Confirmaciones de orden de mantenimiento".');
    const out = [];
    for (let i = 1; i < aoa.length; i++) {
      const r = aoa[i]; if (!r || !r[c.orden]) continue;
      const mi = toMin(r[c.hini]), mf = toMin(r[c.hfin]);
      const fin = r[c.ffin] instanceof Date ? r[c.ffin] : (r[c.fecha] instanceof Date ? r[c.fecha] : null);
      if (mi == null || !fin) continue;
      let dia = iso(fin);
      if (mf != null && mi > mf) dia = addDays(dia, -1);              // arrancó el día anterior
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
        const have = new Set(st.rows.map(rowKey)); let add = 0;
        nuevos.forEach(r => { const k = rowKey(r); if (!have.has(k)) { have.add(k); st.rows.push(r); add++; } });
        save(); render();
        $('sg-msg').textContent = `✅ ${nuevos.length} renglones leídos · ${add} nuevos · ${nuevos.length - add} ya estaban.`;
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
  function resumir(rows) {
    const ots = new Set(), fin = new Set(), pers = new Set(); let min = 0;
    rows.forEach(r => { ots.add(r.o); if (r.f) fin.add(r.o); if (r.p !== 'Sin asignar') pers.add(r.p); min += r.m; });
    return { ots: ots.size, fin: fin.size, pers: pers.size, horas: min / 60, conf: rows.length };
  }

  /* ── Cobertura del turno ──
     Intervalos [ini,fin] en minutos relativos al arranque del turno (0..720), unidos entre todos los
     técnicos: "hay alguien con una OT en curso". Huecos = tramos del turno sin ninguna actividad. */
  const INI_TURNO = { manana: 360, tarde: 1080 }, DUR = 720;
  function intervalos(rows, t) {
    const out = [];
    rows.forEach(r => {
      const ini = ((r.hi - INI_TURNO[t]) % 1440 + 1440) % 1440;
      let len = r.hf == null ? r.m : ((r.hf - r.hi) % 1440 + 1440) % 1440;
      if (!len || ini >= DUR) return;
      out.push([ini, Math.min(DUR, ini + len)]);
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
  function lineaTiempo(rows, t) {
    const c = cobertura(rows, t);
    const marcas = [0, 3, 6, 9, 12].map(h => `<span style="left:${h / 12 * 100}%">${absHM(h * 60, t)}</span>`).join('');
    return `<div class="sg-tl"><div class="sg-tl-bar">${c.u.map(([a, b]) => `<i style="left:${a / DUR * 100}%;width:${(b - a) / DUR * 100}%"></i>`).join('')}</div><div class="sg-tl-marks">${marcas}</div></div>`;
  }

  function g0(rows) { const g = {}; rows.forEach(r => { (g[r.d + '|' + r.t] = g[r.d + '|' + r.t] || []).push(r); }); return g; }
  function covMedia(g) {
    const k = Object.keys(g); if (!k.length) return 0;
    return Math.round(k.reduce((s, x) => s + cobertura(g[x], x.split('|')[1]).pct, 0) / k.length);
  }

  function render() {
    $('sg-vacio').classList.toggle('hidden', st.rows.length > 0);
    $('sg-main').classList.toggle('hidden', st.rows.length === 0);
    if (!st.rows.length) return;
    const rows = filtrado(), tot = resumir(rows);
    $('sg-kpis').innerHTML = [['OTs trabajadas', tot.ots], ['Con notificación final', tot.fin], ['Confirmaciones', tot.conf], ['Técnicos', tot.pers], ['Horas trabajadas', fh(tot.horas)], ['Cobertura media del turno', covMedia(g0(rows)) + '%']]
      .map(([l, v]) => `<div class="sg-kpi"><b>${v}</b><span>${l}</span></div>`).join('');
    const g = {};
    rows.forEach(r => { (g[r.d] = g[r.d] || {})[r.t] = (g[r.d][r.t] || []).concat(r); });
    const dias = Object.keys(g).sort().reverse();
    $('sg-dias').innerHTML = dias.map(d => {
      const ts = ['manana', 'tarde'].filter(t => g[d][t]);
      return ts.map((t, i) => {
        const s = resumir(g[d][t]), cv = cobertura(g[d][t], t), sel = st.sel && st.sel.d === d && st.sel.t === t;
        return `<tr class="sg-row${sel ? ' on' : ''}" data-d="${d}" data-t="${t}">${i === 0 ? `<td rowspan="${ts.length}"><b>${fmtDia(d)}</b></td>` : ''}` +
          `<td>${TURNO[t]}</td><td>${s.ots}</td><td>${s.fin}</td><td>${s.conf}</td><td>${s.pers}</td><td>${fh(s.horas)}</td>` +
          `<td><span class="sg-pct ${cv.pct >= 75 ? 'ok' : cv.pct >= 50 ? 'mid' : 'bad'}">${cv.pct}%</span></td><td class="sg-huecos">${fmtHuecos(cv.huecos, t)}</td></tr>`;
      }).join('');
    }).join('') || '<tr><td colspan="9" class="sg-hint">Sin datos para el filtro.</td></tr>';
    renderDetalle(rows);
  }

  function renderDetalle(rows) {
    const box = $('sg-detalle');
    if (!st.sel) { box.innerHTML = '<p class="sg-hint">Tocá un día/turno de la tabla para ver quién hizo qué.</p>'; return; }
    const rr = rows.filter(r => r.d === st.sel.d && r.t === st.sel.t);
    const porP = {};
    rr.forEach(r => { (porP[r.p] = porP[r.p] || []).push(r); });
    const cv = cobertura(rr, st.sel.t);
    box.innerHTML = `<h3>${fmtDia(st.sel.d)} · ${TURNO[st.sel.t]}</h3><p class="sg-hint">Cobertura ${cv.pct}% (${fh(cv.cub / 60)} de 12 h con al menos una OT en curso). Huecos de 30 min o más: ${fmtHuecos(cv.huecos, st.sel.t)}</p>` + lineaTiempo(rr, st.sel.t) + Object.keys(porP).sort().map(p => {
      const s = resumir(porP[p]);
      return `<details class="sg-pers"><summary><b>${esc(p)}</b> — ${s.ots} OT · ${fh(s.horas)} h</summary><div class="sg-scroll"><table class="sg-tab"><thead><tr><th>OT</th><th>Equipo</th><th>Operación</th><th>Horario</th><th>Horas</th><th>Final</th><th>Texto</th></tr></thead><tbody>` +
        porP[p].sort((a, b) => a.hi - b.hi).map(r => `<tr><td>${esc(r.o)}<br><small>${esc(r.on)}</small></td><td>${esc(r.eq)}<br><small>${esc(r.ob)}</small></td><td>${esc(r.op)}</td>` +
          `<td>${hhm(r.hi)}–${r.hf == null ? '' : hhm(r.hf)}</td><td>${fh(r.m / 60)}</td><td>${r.f ? '✔' : ''}</td><td>${esc(r.x)}</td></tr>`).join('') +
        '</tbody></table></div></details>';
    }).join('');
  }

  function exportar() {
    const rows = filtrado().sort((a, b) => a.d.localeCompare(b.d) || a.t.localeCompare(b.t) || a.hi - b.hi);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows.map(r => ({ Fecha: r.d, Turno: TURNO[r.t], Técnico: r.p, OT: r.o, 'Descripción OT': r.on, Equipo: r.eq, Objeto: r.ob, Operación: r.op,
      Inicio: hhm(r.hi), Fin: r.hf == null ? '' : hhm(r.hf), Horas: +(r.m / 60).toFixed(2), 'Notif. final': r.f ? 'Sí' : 'No', Texto: r.x }))), 'Detalle');
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
      else { $('sg-body').classList.add('hidden'); $('sg-dias').innerHTML = ''; $('sg-detalle').innerHTML = ''; st.sel = null; st.rows = []; }
    }).observe(page, { attributes: true, attributeFilter: ['class'] });
  }
  init();
})();
