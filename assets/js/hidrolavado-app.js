/* ─── Calendario de Hidrolavados ─────────────────────────────────
   Roof Top + UTA (AAC_DATA) y condensadoras de los sistemas VRF / multi split
   (cabezas de AAC_SISTEMAS): cada equipo se hidrolava cada 6 meses, siempre en
   el mismo par de meses (Ene/Jul, Feb/Ago … Jun/Dic).
   El par de cada equipo sale de, en este orden:
     1. un cambio manual de un admin (HIDRO_PLAN);
     2. el mes en que SAP ya programa el MP que trae el hidrolavado (HIDRO_SAP,
        scratchpad/gen_hidrolavado_sap.py): así uno de los dos hidrolavados del año
        (los dos, en los planes semestrales) cae con la OT que SAP ya abre;
     3. si SAP todavía no lo define, el par con menos carga, juntando los equipos
        de la misma ubicación técnica.
   "Hecho" = hay un registro de hidrolavado (OT del historial que dice "hidrolav"
   o fecha cargada a mano en Estado de Equipos) dentro de la ventana de 6 meses
   que rodea al mes programado: de 3 meses antes a 2 después. Las ventanas de dos
   meses programados seguidos no se pisan. Usa helpers de estado-app.js
   (ubicación, guardado admin). */

const HIDRO_MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const HIDRO_MESES_CORTO = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const HIDRO_PLAN_DESDE = '2026-10';   // arranque del calendario: antes no se marca "atrasado"
const HIDRO_ESTADOS = {
  hecho:      { label: 'Hecho',          color: '#10b981' },
  mes:        { label: 'Este mes',       color: '#0096d6' },
  atrasado:   { label: 'Atrasado',       color: '#dc2626' },
  programado: { label: 'Programado',     color: '#64748b' },
  previo:     { label: 'Antes del plan', color: '#a3b1c2' },
};
const HIDRO_ORIGEN = {
  manual: 'Movido a mano',
  sap:    'Mes del MP de SAP',
  auto:   'Reparto por carga (SAP aún sin mes)',
};
const HIDRO_TIPO_CORTO = { 'Roof Top': 'RTF', 'UTA': 'UTA', 'Condensadora': 'Cond.' };

let hidroVista = 'calendario';
let hidroOffset = 0;              // meses desde el mes actual (de a 12)
let hidroSearch = '';
let hidroFiltroTipo = '';
let hidroFiltroEdificio = '';
let hidroMesSel = null;           // 'YYYY-MM' del mes abierto en el detalle

/* ─── Utilidades ─────────────────────────────────────────────── */
function hidroEsc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function hidroParDeMes(m) { return ((m - 1) % 6) + 1; }
function hidroParLabel(p) { return HIDRO_MESES_CORTO[p - 1] + ' / ' + HIDRO_MESES_CORTO[p + 5]; }
function hidroYm(y, m) { return y + '-' + String(m).padStart(2, '0'); }
function hidroIso(d) { return hidroYm(d.getFullYear(), d.getMonth() + 1) + '-' + String(d.getDate()).padStart(2, '0'); }
function hidroFecha(f) { return f ? new Date(f + 'T00:00:00').toLocaleDateString('es-AR') : 'Nunca'; }
function hidroHoyYm() { const d = new Date(); return hidroYm(d.getFullYear(), d.getMonth() + 1); }
function hidroIsAdmin() { return document.body.classList.contains('admin-mode'); }

/* Los 12 meses visibles: desde el mes actual + hidroOffset */
function hidroMesesVentana() {
  const d = new Date();
  const out = [];
  for (let k = 0; k < 12; k++) {
    const x = new Date(d.getFullYear(), d.getMonth() + hidroOffset + k, 1);
    out.push({ y: x.getFullYear(), m: x.getMonth() + 1, ym: hidroYm(x.getFullYear(), x.getMonth() + 1) });
  }
  return out;
}

/* ─── Universo de equipos ────────────────────────────────────── */
function hidroFicha(e, tipo) {
  const ubic = String(e.ubicacion || '').trim().toUpperCase();
  const { desc, ref } = estadoPartirSector(e.sector);
  return {
    equipo: e.equipo, denominacion: e.denominacion || '', tipo, sub: e.tipo || '',
    ubic, ubicDesc: desc, ubicRef: ref, edificio: estadoEdificioDeUbicacion(ubic),
    capacidad: e.capacidad || '', fabricante: e.fabricante || '', modelo: e.modelo || '',
  };
}
function hidroEquiposBase() {
  const aac = typeof AAC_DATA !== 'undefined' ? AAC_DATA : [];
  const idx = {};
  aac.forEach(e => { idx[e.equipo] = e; });
  const out = aac.filter(e => e.tipo === 'Roof Top' || e.tipo === 'UTA').map(e => hidroFicha(e, e.tipo));
  (typeof AAC_SISTEMAS !== 'undefined' ? AAC_SISTEMAS : []).forEach(s => {
    const f = hidroFicha(idx[s.cabeza] || { equipo: s.cabeza, denominacion: s.nombre, ubicacion: s.ubic }, 'Condensadora');
    f.sub = f.sub === 'Split' ? 'Multi Split' : 'VRF';
    f.interiores = (s.miembros || []).length;
    out.push(f);
  });
  return out;
}

/* Par de meses de cada equipo (ver cabecera). Se calcula siempre sobre TODOS
   los equipos, así los filtros de pantalla no cambian los meses. */
function hidroAsignarPares(equipos) {
  const manual = {};
  (typeof HIDRO_PLAN !== 'undefined' ? HIDRO_PLAN : []).forEach(o => { if (o.par >= 1 && o.par <= 6) manual[o.equipo] = o.par; });
  const sapIdx = typeof HIDRO_SAP !== 'undefined' ? HIDRO_SAP : {};
  const carga = [0, 0, 0, 0, 0, 0, 0];
  equipos.forEach(e => {
    const sap = sapIdx[e.equipo] || null;
    e.sap = sap;
    e.sapPar = null;
    if (sap && sap.meses) e.sapPar = hidroParDeMes(sap.meses[0]);
    else if (sap && sap.cand) {
      const pares = new Set(sap.cand.map(c => hidroParDeMes(c[0])));
      if (pares.size === 1) e.sapPar = [...pares][0];   // p. ej. "enero o julio": mismo par
    }
    if (manual[e.equipo]) { e.par = manual[e.equipo]; e.origen = 'manual'; }
    else if (e.sapPar) { e.par = e.sapPar; e.origen = 'sap'; }
    else e.par = null;
    if (e.par) carga[e.par]++;
  });
  const bloques = {};
  equipos.filter(e => !e.par).forEach(e => { (bloques[e.ubic + '|' + e.tipo] = bloques[e.ubic + '|' + e.tipo] || []).push(e); });
  Object.values(bloques).sort((a, b) => b.length - a.length).forEach(bl => {
    let best = 1;
    for (let p = 2; p <= 6; p++) if (carga[p] < carga[best]) best = p;
    bl.forEach(e => { e.par = best; e.origen = 'auto'; });
    carga[best] += bl.length;
  });
  return equipos;
}

/* Todas las fechas de hidrolavado registradas por equipo (ordenadas) */
function hidroRegistros() {
  const idx = {};
  const add = (eq, f) => { if (eq && f) (idx[eq] = idx[eq] || []).push(String(f).slice(0, 10)); };
  if (typeof getOTs === 'function') getOTs().forEach(o => {
    const t = ((o.comentario || '') + ' ' + (o.ot_nombre || '')).toLowerCase();
    if (t.includes('hidrolav')) add(o.equipo, o.fecha);
  });
  (typeof ESTADO_OVERRIDES !== 'undefined' ? ESTADO_OVERRIDES : []).forEach(o => add(o.equipo, o.hidrolavadoManual));
  Object.values(idx).forEach(a => a.sort());
  return idx;
}

function hidroEstadoOcurrencia(regs, y, m, hoyYm) {
  const desde = hidroIso(new Date(y, m - 4, 1));
  const hasta = hidroIso(new Date(y, m + 2, 0));
  const r = (regs || []).filter(f => f >= desde && f <= hasta);
  const ym = hidroYm(y, m);
  if (r.length) return { estado: 'hecho', fecha: r[r.length - 1] };
  if (ym < HIDRO_PLAN_DESDE) return { estado: 'previo' };
  if (ym === hoyYm) return { estado: 'mes' };
  if (ym < hoyYm) return { estado: 'atrasado' };
  return { estado: 'programado' };
}
function hidroCoincideSap(e, m) { return !!(e.sap && e.sap.meses && e.sap.meses.includes(m)); }
function hidroSapTexto(e) {
  const s = e.sap;
  if (!s) return 'Sin plan SAP con hidrolavado';
  const per = s.per === 12 ? 'Anual' : s.per === 6 ? 'Semestral' : `Cada ${s.per} meses`;
  if (s.meses) return `${per} · ${s.meses.map(m => HIDRO_MESES_CORTO[m - 1]).join(' y ')}`;
  return `${per} · a definir (${s.cand.map(c => c.map(m => HIDRO_MESES_CORTO[m - 1]).join('+')).join(' ó ')})`;
}
function hidroUltimo(regs) { return regs && regs.length ? regs[regs.length - 1] : null; }
function hidroMesesDesde(f) {
  if (!f) return Infinity;
  return (Date.now() - new Date(f + 'T00:00:00').getTime()) / (1000 * 60 * 60 * 24 * 30.44);
}
/* Próximo mes programado (desde el actual) que todavía no figura hecho */
function hidroProximo(e, regs, hoyYm) {
  const d = new Date();
  for (let k = 0; k < 12; k++) {
    const x = new Date(d.getFullYear(), d.getMonth() + k, 1);
    const y = x.getFullYear(), m = x.getMonth() + 1;
    if (hidroParDeMes(m) !== e.par) continue;
    if (hidroEstadoOcurrencia(regs, y, m, hoyYm).estado !== 'hecho') return { y, m };
  }
  return null;
}

/* ─── Datos del render ───────────────────────────────────────── */
function hidroDatos() {
  const todos = hidroAsignarPares(hidroEquiposBase());
  const regs = hidroRegistros();
  todos.forEach(e => { e.regs = regs[e.equipo] || []; e.ultimo = hidroUltimo(e.regs); });
  const filtrados = todos.filter(e => {
    if (hidroFiltroTipo && e.tipo !== hidroFiltroTipo) return false;
    if (hidroFiltroEdificio && e.edificio !== hidroFiltroEdificio) return false;
    if (hidroSearch) {
      const hay = [e.equipo, e.denominacion, e.ubic, e.ubicDesc, e.ubicRef].join(' ').toLowerCase();
      if (!hay.includes(hidroSearch)) return false;
    }
    return true;
  });
  return { todos, filtrados, hoyYm: hidroHoyYm(), meses: hidroMesesVentana() };
}
function hidroOrdenar(a, b) {
  return a.ubic.localeCompare(b.ubic) || a.equipo.localeCompare(b.equipo, 'es', { numeric: true });
}

/* ─── Render: stats + intro ─────────────────────────────────── */
function renderHidroStats(D) {
  const L = D.filtrados;
  const porTipo = t => L.filter(e => e.tipo === t).length;
  const [hy, hm] = D.hoyYm.split('-').map(Number);
  const esteMes = L.filter(e => e.par === hidroParDeMes(hm));
  const hechosMes = esteMes.filter(e => hidroEstadoOcurrencia(e.regs, hy, hm, D.hoyYm).estado === 'hecho').length;
  let atrasados = 0;
  L.forEach(e => {
    for (let p = HIDRO_PLAN_DESDE; p < D.hoyYm;) {
      const [y, m] = p.split('-').map(Number);
      if (hidroParDeMes(m) === e.par && hidroEstadoOcurrencia(e.regs, y, m, D.hoyYm).estado === 'atrasado') atrasados++;
      p = m === 12 ? hidroYm(y + 1, 1) : hidroYm(y, m + 1);
    }
  });
  const sinSeis = L.filter(e => hidroMesesDesde(e.ultimo) > 6).length;
  const conSap = L.filter(e => e.origen === 'sap').length;
  const cards = [
    { label: 'Equipos en el plan', value: L.length, sub: `${porTipo('Roof Top')} RTF · ${porTipo('UTA')} UTA · ${porTipo('Condensadora')} cond.`, icon: '🚿', color: '#1a56a4' },
    { label: `${HIDRO_MESES[hm - 1]} (este mes)`, value: esteMes.length, sub: `${hechosMes} hechos`, icon: '📅', color: '#0096d6' },
    { label: 'Atrasados', value: atrasados, sub: `meses programados sin registro desde ${HIDRO_MESES_CORTO[Number(HIDRO_PLAN_DESDE.slice(5)) - 1]} ${HIDRO_PLAN_DESDE.slice(0, 4)}`, icon: '⏰', color: '#dc2626' },
    { label: 'Más de 6 meses sin hidrolavado', value: sinSeis, sub: 'o nunca registrado', icon: '⚠️', color: '#d97706' },
    { label: 'Caen con el MP de SAP', value: conSap, sub: 'equipos anclados al mes SAP', icon: '📋', color: '#10b981' },
  ];
  document.getElementById('hidro-stats').innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="hidro-stat-sub">${c.sub}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>`).join('');
}

function renderHidroIntro() {
  const leyenda = ['hecho', 'mes', 'atrasado', 'programado'].map(k =>
    `<span class="hidro-leyenda-item"><span class="hidro-dot" style="background:${HIDRO_ESTADOS[k].color}"></span>${HIDRO_ESTADOS[k].label}</span>`).join('');
  document.getElementById('hidro-intro').innerHTML = `
    <p>Cada equipo se hidrolava <strong>cada 6 meses</strong>, siempre en el mismo par de meses. El par se toma del
    mes en que SAP ya programa el MP que incluye el hidrolavado (📋): en Roof Top y UTA es el anual, así que
    uno de los dos cae con esa OT; en las condensadoras es semestral y caen los dos. Un mes figura
    <strong>hecho</strong> si hay un hidrolavado registrado (OT del historial o fecha cargada en Estado de Equipos)
    entre 3 meses antes y 2 después.${hidroIsAdmin() ? ' Como admin, podés mover equipos de mes y marcar hidrolavados desde el detalle.' : ''}</p>
    <div class="hidro-leyenda">${leyenda}<span class="hidro-leyenda-item">📋 Cae con el MP de SAP</span></div>`;
}

/* ─── Render: calendario ────────────────────────────────────── */
function renderHidroCarga(D) {
  const carga = [0, 0, 0, 0, 0, 0, 0];
  D.filtrados.forEach(e => { carga[e.par]++; });
  const max = Math.max(1, ...carga.slice(1));
  const prom = D.filtrados.length / 6;
  const parSel = hidroMesSel ? hidroParDeMes(Number(hidroMesSel.slice(5))) : null;
  document.getElementById('hidro-carga').innerHTML = `
    <div class="hidro-carga-titulo">Equipos por par de meses <span>(promedio ${prom.toFixed(1)})</span></div>
    <div class="hidro-carga-grid">
      ${[1, 2, 3, 4, 5, 6].map(p => `
        <div class="hidro-carga-item ${p === parSel ? 'sel' : ''}" title="${carga[p]} equipos se hidrolavan en ${HIDRO_MESES[p - 1]} y ${HIDRO_MESES[p + 5]}">
          <span class="hidro-carga-label">${hidroParLabel(p)}</span>
          <span class="hidro-carga-bar"><span style="width:${(carga[p] / max) * 100}%"></span></span>
          <span class="hidro-carga-num">${carga[p]}</span>
        </div>`).join('')}
    </div>`;
}

function hidroGrupos(lista) {
  const g = {};
  lista.forEach(e => { (g[e.ubic] = g[e.ubic] || []).push(e); });
  return Object.keys(g).sort().map(k => ({ ubic: k, desc: g[k][0].ubicDesc, items: g[k].sort(hidroOrdenar) }));
}

function renderHidroCalendario(D) {
  renderHidroCarga(D);
  const cal = document.getElementById('hidro-cal');
  cal.innerHTML = D.meses.map(({ y, m, ym }) => {
    const items = D.filtrados.filter(e => e.par === hidroParDeMes(m));
    const est = items.map(e => ({ e, o: hidroEstadoOcurrencia(e.regs, y, m, D.hoyYm) }));
    const hechos = est.filter(x => x.o.estado === 'hecho').length;
    const nTipo = t => items.filter(e => e.tipo === t).length;
    const estDe = {};
    est.forEach(x => { estDe[x.e.equipo] = x.o; });
    const grupos = hidroGrupos(items);
    return `
      <div class="hidro-mes-card ${ym === D.hoyYm ? 'actual' : ''} ${ym === hidroMesSel ? 'sel' : ''}" data-ym="${ym}">
        <div class="hidro-mes-head">
          <span class="hidro-mes-nombre">${HIDRO_MESES[m - 1]}</span>
          <span class="hidro-mes-anio">${y}</span>
          <span class="hidro-mes-total">${items.length}</span>
        </div>
        <div class="hidro-mes-prog" title="${hechos} de ${items.length} hechos"><span style="width:${items.length ? (hechos / items.length) * 100 : 0}%"></span></div>
        <div class="hidro-mes-tipos">${nTipo('Roof Top')} RTF · ${nTipo('UTA')} UTA · ${nTipo('Condensadora')} cond. · ✅ ${hechos}/${items.length}</div>
        <div class="hidro-mes-grupos">
          ${grupos.map(g => `
            <div class="hidro-mes-grupo">
              <span class="hidro-mes-ubic" title="${hidroEsc(g.ubic)}">${hidroEsc(g.desc || g.ubic || 'Sin ubicación técnica')}</span>
              <div class="hidro-chips">
                ${g.items.map(e => {
                  const o = estDe[e.equipo];
                  const c = HIDRO_ESTADOS[o.estado].color;
                  const sap = hidroCoincideSap(e, m);
                  return `<span class="hidro-chip" style="--c:${c}" title="${hidroEsc(e.equipo + ' — ' + e.denominacion + ' · ' + HIDRO_ESTADOS[o.estado].label + (o.fecha ? ' ' + hidroFecha(o.fecha) : '') + (sap ? ' · cae con el MP de SAP' : ''))}">${e.equipo}${sap ? ' 📋' : ''}</span>`;
                }).join('')}
              </div>
            </div>`).join('') || '<p class="hidro-vacio">Sin equipos</p>'}
        </div>
      </div>`;
  }).join('');
  cal.querySelectorAll('.hidro-mes-card').forEach(card => {
    card.addEventListener('click', () => {
      hidroMesSel = card.dataset.ym;
      renderHidrolavados();
      const det = document.getElementById('hidro-mes-detalle');
      if (det) det.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  renderHidroDetalleMes(D);
}

function hidroSelectPar(attrs, actual, conAuto) {
  return `<select class="filter-select hidro-par-select" ${attrs}>
    ${conAuto ? '<option value="">↺ Automático</option>' : '<option value="">Mover a…</option>'}
    ${[1, 2, 3, 4, 5, 6].map(p => `<option value="${p}" ${p === actual ? 'selected' : ''}>${hidroParLabel(p)}</option>`).join('')}
  </select>`;
}

function renderHidroDetalleMes(D) {
  const wrap = document.getElementById('hidro-mes-detalle');
  if (!hidroMesSel) { wrap.innerHTML = ''; return; }
  const [y, m] = hidroMesSel.split('-').map(Number);
  const admin = hidroIsAdmin();
  const items = D.filtrados.filter(e => e.par === hidroParDeMes(m));
  const hoy = hidroIso(new Date());
  const grupos = hidroGrupos(items);
  wrap.innerHTML = `
    <div class="hidro-detalle">
      <div class="hidro-detalle-head">
        <h3>${HIDRO_MESES[m - 1]} ${y} <span>· ${items.length} equipos · se repiten en ${HIDRO_MESES[(m + 5) % 12]}</span></h3>
        <button type="button" class="prog-btn" id="hidro-detalle-cerrar">✕</button>
      </div>
      ${grupos.map(g => `
        <div class="hidro-detalle-grupo">
          <div class="hidro-detalle-ubic">
            <span>📍 <strong>${hidroEsc(g.desc || 'Sin descripción')}</strong> <code>${hidroEsc(g.ubic)}</code> · ${g.items.length}</span>
            ${admin ? hidroSelectPar(`data-grupo="${hidroEsc(g.items.map(e => e.equipo).join(','))}"`, null, false) : ''}
          </div>
          <div class="table-wrap"><table class="hidro-tabla hidro-tabla-mes ${admin ? 'con-admin' : ''}">
            <thead><tr><th>Equipo</th><th>Denominación</th><th>Tipo</th><th>SAP</th><th>Último hidrolavado</th><th>Estado</th>${admin ? '<th>Admin</th>' : ''}</tr></thead>
            <tbody>
              ${g.items.map(e => {
                const o = hidroEstadoOcurrencia(e.regs, y, m, D.hoyYm);
                const meta = HIDRO_ESTADOS[o.estado];
                const sap = hidroCoincideSap(e, m);
                return `<tr>
                  <td class="hidro-cod">${e.equipo}</td>
                  <td>${hidroEsc(e.denominacion)}${e.ubicRef ? `<div class="hidro-ref">${hidroEsc(e.ubicRef)}</div>` : ''}</td>
                  <td>${e.tipo}${e.tipo === 'Condensadora' ? ` <span class="hidro-ref">${e.sub}${e.interiores ? ' · ' + e.interiores + ' int.' : ''}</span>` : ''}</td>
                  <td title="${hidroEsc(e.sap ? e.sap.plan + ' (' + e.sap.hr + ')' : '')}">${sap ? '📋 Con el MP' : e.sap ? '<span class="hidro-ref">Extra</span>' : '—'}<div class="hidro-ref">${hidroEsc(hidroSapTexto(e))}</div></td>
                  <td>${hidroFecha(e.ultimo)}</td>
                  <td><span class="estado-badge" style="background:${meta.color}18;color:${meta.color};border:1px solid ${meta.color}40">${meta.label}${o.fecha ? ' · ' + hidroFecha(o.fecha) : ''}</span></td>
                  ${admin ? `<td class="hidro-admin">
                    <input type="date" class="estado-hidro-fecha-input" value="${hoy}" max="${hoy}" />
                    <button type="button" class="prog-btn prog-btn-primary hidro-hecho-btn" data-equipo="${e.equipo}">✓ Hecho</button>
                    ${hidroSelectPar(`data-equipo="${e.equipo}"`, e.origen === 'manual' ? e.par : null, true)}
                  </td>` : ''}
                </tr>`;
              }).join('')}
            </tbody>
          </table></div>
        </div>`).join('') || '<p class="hidro-vacio">No hay equipos con los filtros actuales.</p>'}
    </div>`;
  document.getElementById('hidro-detalle-cerrar').addEventListener('click', () => { hidroMesSel = null; renderHidrolavados(); });
  hidroWireAdmin(wrap);
}

/* ─── Render: por equipo ────────────────────────────────────── */
function renderHidroEquipos(D) {
  const wrap = document.getElementById('hidro-equipos-wrap');
  const admin = hidroIsAdmin();
  const lista = [...D.filtrados].sort((a, b) => a.par - b.par || hidroOrdenar(a, b));
  wrap.innerHTML = `
    <div class="estado-lista-count">${lista.length} equipos</div>
    <div class="table-wrap"><table class="hidro-tabla hidro-tabla-equipos">
      <thead><tr><th>Equipo</th><th>Denominación</th><th>Tipo</th><th>Ubicación técnica</th><th>Meses</th><th>Según SAP</th><th>Último</th><th>Próximo</th></tr></thead>
      <tbody>
        ${lista.map(e => {
          const prox = hidroProximo(e, e.regs, D.hoyYm);
          const vencido = hidroMesesDesde(e.ultimo) > 6;
          return `<tr>
            <td class="hidro-cod">${e.equipo}</td>
            <td>${hidroEsc(e.denominacion)}</td>
            <td>${e.tipo}${e.tipo === 'Condensadora' ? ` <span class="hidro-ref">${e.sub}</span>` : ''}</td>
            <td><code>${hidroEsc(e.ubic)}</code><div class="hidro-ref">${hidroEsc(e.ubicDesc)}</div></td>
            <td>${admin ? hidroSelectPar(`data-equipo="${e.equipo}"`, e.par, true) : `<strong>${hidroParLabel(e.par)}</strong>`}
              <div class="hidro-ref">${HIDRO_ORIGEN[e.origen]}</div></td>
            <td title="${hidroEsc(e.sap ? e.sap.plan + ' (' + e.sap.hr + ')' : '')}">${hidroEsc(hidroSapTexto(e))}</td>
            <td><span style="color:${vencido ? '#dc2626' : '#10b981'};font-weight:700">${hidroFecha(e.ultimo)}</span></td>
            <td>${prox ? `${HIDRO_MESES_CORTO[prox.m - 1]} ${prox.y}` : '—'}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>`;
  hidroWireAdmin(wrap);
}

/* ─── Admin: mover de mes y marcar hechos ───────────────────── */
function hidroWireAdmin(container) {
  container.querySelectorAll('.hidro-par-select[data-equipo]').forEach(sel => {
    sel.addEventListener('change', () => hidroGuardarPares({ [sel.dataset.equipo]: Number(sel.value) || null }));
  });
  container.querySelectorAll('.hidro-par-select[data-grupo]').forEach(sel => {
    sel.addEventListener('change', () => {
      if (!sel.value) return;
      const cambios = {};
      sel.dataset.grupo.split(',').forEach(eq => { cambios[eq] = Number(sel.value); });
      hidroGuardarPares(cambios);
    });
  });
  container.querySelectorAll('.hidro-hecho-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fecha = btn.closest('td').querySelector('input[type="date"]').value;
      if (!fecha) { estadoToast('Elegí una fecha.', 'error'); return; }
      hidroMarcarHecho(btn.dataset.equipo, fecha);
    });
  });
}

/* cambios = { equipo: par (1-6) | null para volver al automático } */
async function hidroGuardarPares(cambios) {
  const fresh = (await estadoFetchLatestArray('assets/js/hidrolavado-plan-data.js', 'HIDRO_PLAN')) || HIDRO_PLAN;
  const map = {};
  fresh.forEach(o => { map[o.equipo] = o.par; });
  Object.entries(cambios).forEach(([eq, par]) => { if (par) map[eq] = par; else delete map[eq]; });
  const data = Object.keys(map).sort().map(eq => ({ equipo: eq, par: map[eq] }));
  const n = Object.keys(cambios).length;
  const ok = await estadoCommit('hidrolavado', data, `✓ Calendario actualizado (${n} equipo${n === 1 ? '' : 's'}). El sitio tarda ~1 min en redesplegar.`);
  if (ok) {
    HIDRO_PLAN.length = 0;
    HIDRO_PLAN.push(...data);
  }
  renderHidrolavados();
}

async function hidroMarcarHecho(equipo, fecha) {
  const ov = (typeof ESTADO_OVERRIDES !== 'undefined' ? ESTADO_OVERRIDES : []).find(o => o.equipo === equipo);
  if (ov && ov.hidrolavadoManual && ov.hidrolavadoManual > fecha) {
    estadoToast(`${equipo} ya tiene cargado un hidrolavado más reciente (${hidroFecha(ov.hidrolavadoManual)}).`, 'error');
    return;
  }
  const ok = await estadoMutateOverrides(arr => {
    estadoFindOrCreate(arr, equipo).hidrolavadoManual = fecha;
  }, `✓ Hidrolavado de ${equipo} registrado (${hidroFecha(fecha)}).`);
  if (ok) renderHidrolavados();
}

/* ─── Excel ──────────────────────────────────────────────────── */
function hidroDescargar() {
  if (typeof XLSX === 'undefined') { alert('La librería de Excel no está disponible. Verificá tu conexión a internet.'); return; }
  const D = hidroDatos();
  if (!D.filtrados.length) { estadoToast('No hay equipos con los filtros actuales.', 'error'); return; }
  const cal = [];
  D.meses.forEach(({ y, m }) => {
    D.filtrados.filter(e => e.par === hidroParDeMes(m)).sort(hidroOrdenar).forEach(e => {
      const o = hidroEstadoOcurrencia(e.regs, y, m, D.hoyYm);
      cal.push({
        'Mes': `${HIDRO_MESES[m - 1]} ${y}`, 'Equipo': e.equipo, 'Denominación': e.denominacion, 'Tipo': e.tipo,
        'Edificio / Zona': e.edificio, 'Ubicación técnica': e.ubic, 'Descripción ubicación': e.ubicDesc, 'Referencia': e.ubicRef,
        'Cae con el MP de SAP': hidroCoincideSap(e, m) ? 'Sí' : 'No', 'Estado': HIDRO_ESTADOS[o.estado].label,
        'Fecha registrada': o.fecha ? hidroFecha(o.fecha) : '', 'Último hidrolavado': hidroFecha(e.ultimo),
      });
    });
  });
  const eqs = [...D.filtrados].sort((a, b) => a.par - b.par || hidroOrdenar(a, b)).map(e => {
    const prox = hidroProximo(e, e.regs, D.hoyYm);
    const meses = hidroMesesDesde(e.ultimo);
    return {
      'Equipo': e.equipo, 'Denominación': e.denominacion, 'Tipo': e.tipo + (e.tipo === 'Condensadora' ? ` (${e.sub})` : ''),
      'Edificio / Zona': e.edificio, 'Ubicación técnica': e.ubic, 'Descripción ubicación': e.ubicDesc,
      'Meses de hidrolavado': hidroParLabel(e.par), 'Cómo se eligió el mes': HIDRO_ORIGEN[e.origen],
      'Hidrolavado según SAP': hidroSapTexto(e), 'Plan SAP': e.sap ? `${e.sap.plan} (${e.sap.hr})` : '',
      'Último hidrolavado': hidroFecha(e.ultimo), 'Meses desde el último': isFinite(meses) ? Math.round(meses * 10) / 10 : '',
      'Próximo programado': prox ? `${HIDRO_MESES[prox.m - 1]} ${prox.y}` : '',
    };
  });
  const hoja = rows => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const cols = Object.keys(rows[0] || {});
    ws['!cols'] = cols.map(c => ({ wch: Math.min(60, Math.max(c.length, ...rows.map(r => String(r[c] || '').length)) + 2) }));
    return ws;
  };
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, hoja(cal), 'Calendario');
  XLSX.utils.book_append_sheet(wb, hoja(eqs), 'Equipos');
  const a = D.meses[0], b = D.meses[11];
  XLSX.writeFile(wb, `AEP_Calendario_Hidrolavados_${a.ym}_a_${b.ym}.xlsx`);
}

/* ─── Render principal ──────────────────────────────────────── */
function renderHidrolavados() {
  const page = document.getElementById('page-hidrolavados');
  if (!page) return;
  const D = hidroDatos();
  const ventana = D.meses.map(x => x.ym);
  if (hidroMesSel && !ventana.includes(hidroMesSel)) hidroMesSel = null;
  if (hidroMesSel === null && hidroOffset === 0 && !renderHidrolavados._abierto) {
    hidroMesSel = D.hoyYm;               // la primera vez se abre el mes actual
    renderHidrolavados._abierto = true;
  }
  const a = D.meses[0], b = D.meses[11];
  document.getElementById('hidro-nav-label').textContent = `${HIDRO_MESES_CORTO[a.m - 1]} ${a.y} – ${HIDRO_MESES_CORTO[b.m - 1]} ${b.y}`;
  renderHidroStats(D);
  renderHidroIntro();
  document.getElementById('hidro-calendario-wrap').classList.toggle('hidden', hidroVista !== 'calendario');
  document.getElementById('hidro-equipos-wrap').classList.toggle('hidden', hidroVista !== 'equipos');
  if (hidroVista === 'calendario') renderHidroCalendario(D);
  else renderHidroEquipos(D);
}

/* ─── Init ───────────────────────────────────────────────────── */
(function initHidrolavados() {
  if (!document.getElementById('page-hidrolavados')) return;

  const edificios = [...new Set(hidroEquiposBase().map(e => e.edificio))].sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
  const selEd = document.getElementById('hidro-filter-edificio');
  edificios.forEach(ed => { const o = document.createElement('option'); o.value = ed; o.textContent = ed; selEd.appendChild(o); });

  document.getElementById('hidro-search').addEventListener('input', function () {
    hidroSearch = this.value.trim().toLowerCase();
    document.getElementById('hidro-clear-search').style.display = hidroSearch ? 'flex' : 'none';
    renderHidrolavados();
  });
  document.getElementById('hidro-clear-search').addEventListener('click', function () {
    hidroSearch = '';
    document.getElementById('hidro-search').value = '';
    this.style.display = 'none';
    renderHidrolavados();
  });
  document.getElementById('hidro-filter-tipo').addEventListener('change', function () { hidroFiltroTipo = this.value; renderHidrolavados(); });
  selEd.addEventListener('change', function () { hidroFiltroEdificio = this.value; renderHidrolavados(); });
  document.getElementById('hidro-descargar').addEventListener('click', hidroDescargar);
  document.getElementById('hidro-prev').addEventListener('click', () => { hidroOffset -= 12; renderHidrolavados(); });
  document.getElementById('hidro-next').addEventListener('click', () => { hidroOffset += 12; renderHidrolavados(); });
  document.getElementById('hidro-hoy').addEventListener('click', () => { hidroOffset = 0; hidroMesSel = hidroHoyYm(); renderHidrolavados(); });
  document.querySelectorAll('[data-hview]').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-hview]').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      hidroVista = this.dataset.hview;
      renderHidrolavados();
    });
  });

  // Re-renderizar si cambia la sesión admin con la página abierta
  new MutationObserver(() => {
    const page = document.getElementById('page-hidrolavados');
    if (page && !page.classList.contains('hidden')) renderHidrolavados();
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Enganchar a la navegación: traer el historial de OTs si hace falta (los registros "hidrolav")
  const _hidroOrigShowPage = window.showPage;
  window.showPage = function (pageId) {
    _hidroOrigShowPage(pageId);
    if (pageId !== 'hidrolavados') return;
    renderHidrolavados();
    if (typeof getOTs === 'function' && getOTs().length === 0 && typeof initOTsFromServer === 'function') {
      initOTsFromServer().then(renderHidrolavados);
    }
  };
})();
