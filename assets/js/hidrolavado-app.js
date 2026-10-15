/* ─── Calendario de Hidrolavados ─────────────────────────────────
   Roof Top + UTA (AAC_DATA) y condensadoras de los sistemas VRF / multi split
   (cabezas de AAC_SISTEMAS). Cada equipo se hidrolava DOS veces por año
   (pedido de la usuaria 2026-10-01/02): una en la campaña ABRIL–MAYO y otra en
   la campaña SEPTIEMBRE–OCTUBRE, en cualquier momento dentro de esos 2 meses
   (no hay mes fijo por equipo).
   "Hecho" = hay un registro de hidrolavado (OT del historial que dice "hidrolav"
   o fecha cargada a mano en Estado de Equipos) dentro de la ventana de la
   campaña: feb–jul para Abr–May, ago–ene para Sep–Oct (cubren el año sin pisarse).
   La columna SAP dice si la OT que SAP ya genera hoy (HIDRO_SAP,
   scratchpad/gen_hidrolavado_sap.py) trae el hidrolavado dentro de la campaña,
   o si hay que ajustar el plan en SAP.
   Usa helpers de estado-app.js (ubicación, guardado admin). */

const HIDRO_MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const HIDRO_MESES_CORTO = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const HIDRO_CAMPANAS = [
  { nombre: 'Abril – Mayo',         corto: 'Abr–May', meses: [4, 5],  ventana: [2, 7],  icon: '🍂' },  // ventana feb–jul
  { nombre: 'Septiembre – Octubre', corto: 'Sep–Oct', meses: [9, 10], ventana: [8, 13], icon: '🌱' },  // ventana ago–ene (13 = enero siguiente)
];
const HIDRO_PLAN_DESDE = '2026-09';   // primera campaña del calendario: Sep–Oct 2026
const HIDRO_ESTADOS = {
  hecho:      { label: 'Hecho',            color: '#10b981' },
  curso:      { label: 'Pendiente',        color: '#0096d6' },
  atrasado:   { label: 'No realizado',     color: '#dc2626' },
  programado: { label: 'Programado',       color: '#64748b' },
  previo:     { label: 'Antes del plan',   color: '#a3b1c2' },
};

let hidroVista = 'calendario';
let hidroOffset = 0;              // campañas desde la actual (de a 2 = un año)
let hidroSearch = '';
let hidroFiltroTipo = '';
let hidroFiltroEdificio = '';
let hidroCampSel = null;          // idx de la campaña abierta en el detalle

/* ─── Utilidades ─────────────────────────────────────────────── */
function hidroEsc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function hidroYm(y, m) { return y + '-' + String(m).padStart(2, '0'); }
function hidroIso(d) { return hidroYm(d.getFullYear(), d.getMonth() + 1) + '-' + String(d.getDate()).padStart(2, '0'); }
function hidroFecha(f) { return f ? new Date(f + 'T00:00:00').toLocaleDateString('es-AR') : 'Nunca'; }
function hidroHoyYm() { const d = new Date(); return hidroYm(d.getFullYear(), d.getMonth() + 1); }
function hidroIsAdmin() { return document.body.classList.contains('admin-mode'); }

/* Campañas numeradas en orden: idx = año·2 + (0 Abr–May | 1 Sep–Oct) */
function hidroCamp(idx) {
  const y = Math.floor(idx / 2), c = idx % 2, def = HIDRO_CAMPANAS[c];
  return { idx, y, c, def, desde: hidroYm(y, def.meses[0]), hasta: hidroYm(y, def.meses[1]) };
}
function hidroCampLabel(camp) { return `${camp.def.corto} ${camp.y}`; }
/* La campaña en curso o, si no hay, la próxima */
function hidroCampActualIdx() {
  const d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1;
  if (m <= 5) return y * 2;
  if (m <= 10) return y * 2 + 1;
  return (y + 1) * 2;
}
function hidroCampanasVisibles() {
  const base = hidroCampActualIdx() + hidroOffset;
  return [hidroCamp(base), hidroCamp(base + 1)];
}
function hidroCampDesdeIdx() {
  const m = Number(HIDRO_PLAN_DESDE.slice(5));
  return Number(HIDRO_PLAN_DESDE.slice(0, 4)) * 2 + HIDRO_CAMPANAS.findIndex(c => c.meses.includes(m));
}

/* ─── Universo de equipos ────────────────────────────────────── */
function hidroFicha(e, tipo) {
  const ubic = String(e.ubicacion || '').trim().toUpperCase();
  const { desc, ref } = estadoPartirSector(e.sector);
  return {
    equipo: e.equipo, denominacion: e.denominacion || '', tipo, sub: e.tipo || '',
    ubic, ubicDesc: desc, ubicRef: ref, edificio: estadoEdificioDeUbicacion(ubic),
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

function hidroEstadoCamp(regs, camp, hoyYm) {
  const [a, b] = camp.def.ventana;
  const desde = hidroIso(new Date(camp.y, a - 1, 1));
  const hasta = hidroIso(new Date(camp.y, b, 0));
  const r = (regs || []).filter(f => f >= desde && f <= hasta);
  if (r.length) return { estado: 'hecho', fecha: r[r.length - 1] };
  if (camp.hasta < HIDRO_PLAN_DESDE) return { estado: 'previo' };
  if (hoyYm > camp.hasta) return { estado: 'atrasado' };
  if (hoyYm >= camp.desde) return { estado: 'curso' };
  return { estado: 'programado' };
}
/* ¿La OT que SAP genera hoy trae el hidrolavado dentro de la campaña c? */
function hidroSapEnCamp(e, c) {
  return !!(e.sap && e.sap.meses && e.sap.meses.some(m => HIDRO_CAMPANAS[c].meses.includes(m)));
}
function hidroSapTexto(e) {
  const s = e.sap;
  if (!s) return 'Sin plan SAP con hidrolavado';
  const per = s.per === 12 ? 'Anual' : s.per === 6 ? 'Semestral' : `Cada ${s.per} meses`;
  if (s.meses) return `${per} · ${s.meses.map(m => HIDRO_MESES_CORTO[m - 1]).join(' y ')}`;
  return `${per} · a definir (${s.cand.map(c => c.map(m => HIDRO_MESES_CORTO[m - 1]).join('+')).join(' ó ')})`;
}
function hidroSapAjuste(e) {
  const faltan = HIDRO_CAMPANAS.filter((_, c) => !hidroSapEnCamp(e, c)).map(c => c.corto);
  return faltan.length ? `Falta en SAP: ${faltan.join(' y ')}` : 'Nada: SAP ya la trae en las dos campañas';
}
function hidroMesesDesde(f) {
  if (!f) return Infinity;
  return (Date.now() - new Date(f + 'T00:00:00').getTime()) / (1000 * 60 * 60 * 24 * 30.44);
}

/* ─── Datos del render ───────────────────────────────────────── */
function hidroDatos() {
  const sapIdx = typeof HIDRO_SAP !== 'undefined' ? HIDRO_SAP : {};
  const regs = hidroRegistros();
  const todos = hidroEquiposBase();
  todos.forEach(e => {
    e.sap = sapIdx[e.equipo] || null;
    e.sapCoinc = HIDRO_CAMPANAS.filter((_, c) => hidroSapEnCamp(e, c)).length;
    e.regs = regs[e.equipo] || [];
    e.ultimo = e.regs.length ? e.regs[e.regs.length - 1] : null;
  });
  const filtrados = todos.filter(e => {
    if (hidroFiltroTipo && e.tipo !== hidroFiltroTipo) return false;
    if (hidroFiltroEdificio && e.edificio !== hidroFiltroEdificio) return false;
    if (hidroSearch) {
      const hay = [e.equipo, e.denominacion, e.ubic, e.ubicDesc, e.ubicRef].join(' ').toLowerCase();
      if (!hay.includes(hidroSearch)) return false;
    }
    return true;
  });
  return { todos, filtrados, hoyYm: hidroHoyYm(), campanas: hidroCampanasVisibles() };
}
function hidroOrdenar(a, b) {
  return a.ubic.localeCompare(b.ubic) || a.equipo.localeCompare(b.equipo, 'es', { numeric: true });
}
function hidroGrupos(lista) {
  const g = {};
  lista.forEach(e => { (g[e.ubic] = g[e.ubic] || []).push(e); });
  return Object.keys(g).sort().map(k => ({ ubic: k, desc: g[k][0].ubicDesc, items: g[k].sort(hidroOrdenar) }));
}

/* ─── Render: stats + intro ─────────────────────────────────── */
function renderHidroStats(D) {
  const L = D.filtrados;
  const porTipo = t => L.filter(e => e.tipo === t).length;
  const actual = hidroCamp(hidroCampActualIdx());
  const enCurso = D.hoyYm >= actual.desde;
  const hechosAct = L.filter(e => hidroEstadoCamp(e.regs, actual, D.hoyYm).estado === 'hecho').length;
  let noHechos = 0;
  for (let i = hidroCampDesdeIdx(); i < actual.idx; i++) {
    const camp = hidroCamp(i);
    noHechos += L.filter(e => hidroEstadoCamp(e.regs, camp, D.hoyYm).estado === 'atrasado').length;
  }
  const sinSeis = L.filter(e => hidroMesesDesde(e.ultimo) > 6).length;
  const conSap = L.reduce((s, e) => s + e.sapCoinc, 0);
  const cards = [
    { label: 'Equipos en el plan', value: L.length, sub: `${porTipo('Roof Top')} RTF · ${porTipo('UTA')} UTA · ${porTipo('Condensadora')} cond.`, icon: '🚿', color: '#1a56a4' },
    { label: `Campaña ${hidroCampLabel(actual)} (${enCurso ? 'en curso' : 'próxima'})`, value: `${hechosAct}/${L.length}`, sub: `hechos · faltan ${L.length - hechosAct}`, icon: actual.def.icon, color: '#0096d6' },
    { label: 'No realizados', value: noHechos, sub: 'en campañas ya terminadas (desde Sep–Oct 2026)', icon: '⏰', color: '#dc2626' },
    { label: 'Más de 6 meses sin hidrolavado', value: sinSeis, sub: 'o nunca registrado', icon: '⚠️', color: '#d97706' },
    { label: 'Ya caen con una OT de SAP', value: `${conSap}/${L.length * 2}`, sub: 'hidrolavados del año; el resto hay que ajustarlo en SAP', icon: '📋', color: '#10b981' },
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
  const leyenda = ['hecho', 'curso', 'atrasado', 'programado'].map(k =>
    `<span class="hidro-leyenda-item"><span class="hidro-dot" style="background:${HIDRO_ESTADOS[k].color}"></span>${HIDRO_ESTADOS[k].label}</span>`).join('');
  document.getElementById('hidro-intro').innerHTML = `
    <p>Cada equipo se hidrolava <strong>dos veces por año</strong>: una en la campaña <strong>abril–mayo</strong> y otra en la
    campaña <strong>septiembre–octubre</strong>, en cualquier momento dentro de esos dos meses. Figura <strong>hecho</strong> si
    tiene un hidrolavado registrado (OT del historial o fecha cargada en Estado de Equipos) dentro de la campaña: de febrero
    a julio para Abr–May, de agosto a enero para Sep–Oct. 📋 = la OT que SAP genera hoy ya trae el hidrolavado en esa campaña.${hidroIsAdmin() ? ' Como admin, podés marcar hidrolavados hechos desde el detalle de la campaña.' : ''}</p>
    <div class="hidro-leyenda">${leyenda}<span class="hidro-leyenda-item">📋 Cae con una OT de SAP</span></div>`;
}

/* ─── Render: calendario por campañas ───────────────────────── */
function renderHidroResumenActual(D) {
  const camp = hidroCamp(hidroCampActualIdx());
  const L = D.filtrados;
  const hechos = L.filter(e => hidroEstadoCamp(e.regs, camp, D.hoyYm).estado === 'hecho').length;
  const fin = new Date(camp.y, camp.def.meses[1], 0);
  const ini = new Date(camp.y, camp.def.meses[0] - 1, 1);
  const hoy = new Date();
  const enCurso = hoy >= ini;
  const dias = Math.max(0, Math.ceil(((enCurso ? fin : ini) - hoy) / 86400000));
  document.getElementById('hidro-carga').innerHTML = `
    <div class="hidro-carga-titulo">${camp.def.icon} Campaña ${camp.def.nombre} ${camp.y}
      <span>· ${enCurso ? `en curso, quedan ${dias} días` : `empieza en ${dias} días`}</span></div>
    <div class="hidro-carga-item">
      <span class="hidro-carga-bar"><span style="width:${L.length ? (hechos / L.length) * 100 : 0}%;background:#10b981"></span></span>
      <span class="hidro-carga-num" style="width:auto">${hechos} de ${L.length} hechos · faltan ${L.length - hechos}</span>
    </div>`;
}

function renderHidroCalendario(D) {
  renderHidroResumenActual(D);
  const actualIdx = hidroCampActualIdx();
  const wrap = document.getElementById('hidro-cal');
  wrap.innerHTML = D.campanas.map(camp => {
    const estDe = {};
    D.filtrados.forEach(e => { estDe[e.equipo] = hidroEstadoCamp(e.regs, camp, D.hoyYm); });
    const hechos = D.filtrados.filter(e => estDe[e.equipo].estado === 'hecho').length;
    const etapa = camp.idx < actualIdx ? 'Terminada' : camp.idx === actualIdx ? (D.hoyYm >= camp.desde ? 'En curso' : 'Próxima') : 'Programada';
    const vd = new Date(camp.y, camp.def.ventana[0] - 1, 1), vh = new Date(camp.y, camp.def.ventana[1] - 1, 1);
    const nTipo = t => D.filtrados.filter(e => e.tipo === t).length;
    return `
      <section class="hidro-campana ${camp.idx === actualIdx ? 'actual' : ''} ${camp.idx === hidroCampSel ? 'sel' : ''}" data-camp="${camp.idx}">
        <div class="hidro-campana-head">
          <span class="hidro-campana-icon">${camp.def.icon}</span>
          <div class="hidro-campana-tit">
            <h3>Campaña ${camp.def.nombre} ${camp.y}</h3>
            <span>${nTipo('Roof Top')} RTF · ${nTipo('UTA')} UTA · ${nTipo('Condensadora')} cond. · ✅ ${hechos} de ${D.filtrados.length} ·
              cuentan los hidrolavados de ${HIDRO_MESES_CORTO[vd.getMonth()].toLowerCase()} ${vd.getFullYear()} a ${HIDRO_MESES_CORTO[vh.getMonth()].toLowerCase()} ${vh.getFullYear()}</span>
          </div>
          <span class="hidro-campana-etapa">${etapa}</span>
          <button type="button" class="prog-btn prog-btn-primary hidro-campana-ver">${camp.idx === hidroCampSel ? 'Viendo detalle' : 'Ver detalle'}</button>
        </div>
        <div class="hidro-mes-prog"><span style="width:${D.filtrados.length ? (hechos / D.filtrados.length) * 100 : 0}%"></span></div>
        <div class="hidro-campana-grupos">
          ${hidroGrupos(D.filtrados).map(g => `
            <div class="hidro-mes-grupo">
              <span class="hidro-mes-ubic" title="${hidroEsc(g.ubic)}">${hidroEsc(g.desc || g.ubic || 'Sin ubicación técnica')} · ${g.items.length}</span>
              <div class="hidro-chips">
                ${g.items.map(e => {
                  const o = estDe[e.equipo];
                  const sap = hidroSapEnCamp(e, camp.c);
                  return `<span class="hidro-chip" style="--c:${HIDRO_ESTADOS[o.estado].color}" title="${hidroEsc(e.equipo + ' — ' + e.denominacion + ' · ' + HIDRO_ESTADOS[o.estado].label + (o.fecha ? ' ' + hidroFecha(o.fecha) : '') + (sap ? ' · cae con una OT de SAP' : ''))}">${e.equipo}${sap ? ' 📋' : ''}</span>`;
                }).join('')}
              </div>
            </div>`).join('') || '<p class="hidro-vacio">Sin equipos con los filtros actuales.</p>'}
        </div>
      </section>`;
  }).join('');
  wrap.querySelectorAll('.hidro-campana').forEach(sec => {
    sec.querySelector('.hidro-campana-ver').addEventListener('click', () => {
      hidroCampSel = Number(sec.dataset.camp);
      renderHidrolavados();
      const det = document.getElementById('hidro-mes-detalle');
      if (det) det.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  renderHidroDetalleCamp(D);
}

function renderHidroDetalleCamp(D) {
  const wrap = document.getElementById('hidro-mes-detalle');
  if (hidroCampSel === null) { wrap.innerHTML = ''; return; }
  const camp = hidroCamp(hidroCampSel);
  const admin = hidroIsAdmin();
  const hoy = hidroIso(new Date());
  wrap.innerHTML = `
    <div class="hidro-detalle">
      <div class="hidro-detalle-head">
        <h3>Campaña ${camp.def.nombre} ${camp.y} <span>· ${D.filtrados.length} equipos</span></h3>
        <button type="button" class="prog-btn" id="hidro-detalle-cerrar">✕</button>
      </div>
      ${hidroGrupos(D.filtrados).map(g => `
        <div class="hidro-detalle-grupo">
          <div class="hidro-detalle-ubic">
            <span>📍 <strong>${hidroEsc(g.desc || 'Sin descripción')}</strong> <code>${hidroEsc(g.ubic)}</code> · ${g.items.length}</span>
          </div>
          <div class="table-wrap"><table class="hidro-tabla hidro-tabla-mes ${admin ? 'con-admin' : ''}">
            <thead><tr><th>Equipo</th><th>Denominación</th><th>Tipo</th><th>OT de SAP</th><th>Último hidrolavado</th><th>Estado</th>${admin ? '<th>Admin</th>' : ''}</tr></thead>
            <tbody>
              ${g.items.map(e => {
                const o = hidroEstadoCamp(e.regs, camp, D.hoyYm);
                const meta = HIDRO_ESTADOS[o.estado];
                const sap = hidroSapEnCamp(e, camp.c);
                return `<tr>
                  <td class="hidro-cod">${e.equipo}</td>
                  <td>${hidroEsc(e.denominacion)}${e.ubicRef ? `<div class="hidro-ref">${hidroEsc(e.ubicRef)}</div>` : ''}</td>
                  <td>${e.tipo}${e.tipo === 'Condensadora' ? ` <span class="hidro-ref">${e.sub}${e.interiores ? ' · ' + e.interiores + ' int.' : ''}</span>` : ''}</td>
                  <td title="${hidroEsc(e.sap ? e.sap.plan + ' (' + e.sap.hr + ')' : '')}">${sap ? '📋 La trae' : '<span class="hidro-ajustar">Ajustar en SAP</span>'}<div class="hidro-ref">Hoy: ${hidroEsc(hidroSapTexto(e))}</div></td>
                  <td>${hidroFecha(e.ultimo)}</td>
                  <td><span class="estado-badge" style="background:${meta.color}18;color:${meta.color};border:1px solid ${meta.color}40">${meta.label}${o.fecha ? ' · ' + hidroFecha(o.fecha) : ''}</span></td>
                  ${admin ? `<td class="hidro-admin">
                    <input type="date" class="estado-hidro-fecha-input" value="${hoy}" max="${hoy}" />
                    <button type="button" class="prog-btn prog-btn-primary hidro-hecho-btn" data-equipo="${e.equipo}">✓ Hecho</button>
                  </td>` : ''}
                </tr>`;
              }).join('')}
            </tbody>
          </table></div>
        </div>`).join('') || '<p class="hidro-vacio">No hay equipos con los filtros actuales.</p>'}
    </div>`;
  document.getElementById('hidro-detalle-cerrar').addEventListener('click', () => { hidroCampSel = null; renderHidrolavados(); });
  hidroWireAdmin(wrap);
}

/* ─── Render: por equipo ────────────────────────────────────── */
function hidroBadge(o) {
  const meta = HIDRO_ESTADOS[o.estado];
  return `<span class="estado-badge" style="background:${meta.color}18;color:${meta.color};border:1px solid ${meta.color}40">${meta.label}${o.fecha ? ' · ' + hidroFecha(o.fecha) : ''}</span>`;
}
function renderHidroEquipos(D) {
  const wrap = document.getElementById('hidro-equipos-wrap');
  const lista = [...D.filtrados].sort(hidroOrdenar);
  const [c1, c2] = D.campanas;
  wrap.innerHTML = `
    <div class="estado-lista-count">${lista.length} equipos</div>
    <div class="table-wrap"><table class="hidro-tabla hidro-tabla-equipos">
      <thead><tr><th>Equipo</th><th>Denominación</th><th>Tipo</th><th>Ubicación técnica</th>
        <th>${hidroCampLabel(c1)}</th><th>${hidroCampLabel(c2)}</th><th>SAP hoy</th><th>¿SAP la trae?</th><th>Último</th></tr></thead>
      <tbody>
        ${lista.map(e => {
          const vencido = hidroMesesDesde(e.ultimo) > 6;
          const col = e.sapCoinc === 2 ? '#10b981' : e.sapCoinc === 1 ? '#d97706' : '#dc2626';
          return `<tr>
            <td class="hidro-cod">${e.equipo}</td>
            <td>${hidroEsc(e.denominacion)}</td>
            <td>${e.tipo}${e.tipo === 'Condensadora' ? ` <span class="hidro-ref">${e.sub}</span>` : ''}</td>
            <td><code>${hidroEsc(e.ubic)}</code><div class="hidro-ref">${hidroEsc(e.ubicDesc)}</div></td>
            <td>${hidroBadge(hidroEstadoCamp(e.regs, c1, D.hoyYm))}</td>
            <td>${hidroBadge(hidroEstadoCamp(e.regs, c2, D.hoyYm))}</td>
            <td title="${hidroEsc(e.sap ? e.sap.plan + ' (' + e.sap.hr + ')' : '')}">${hidroEsc(hidroSapTexto(e))}</td>
            <td><span style="color:${col};font-weight:700">${e.sapCoinc} de 2</span><div class="hidro-ref">${hidroEsc(hidroSapAjuste(e))}</div></td>
            <td><span style="color:${vencido ? '#dc2626' : '#10b981'};font-weight:700">${hidroFecha(e.ultimo)}</span></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>`;
}

/* ─── Admin: marcar hechos ──────────────────────────────────── */
function hidroWireAdmin(container) {
  container.querySelectorAll('.hidro-hecho-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fecha = btn.closest('td').querySelector('input[type="date"]').value;
      if (!fecha) { estadoToast('Elegí una fecha.', 'error'); return; }
      hidroMarcarHecho(btn.dataset.equipo, fecha);
    });
  });
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
  const lista = [...D.filtrados].sort(hidroOrdenar);
  const cal = [];
  D.campanas.forEach(camp => {
    lista.forEach(e => {
      const o = hidroEstadoCamp(e.regs, camp, D.hoyYm);
      cal.push({
        'Campaña': `${camp.def.nombre} ${camp.y}`, 'Equipo': e.equipo, 'Denominación': e.denominacion, 'Tipo': e.tipo,
        'Edificio / Zona': e.edificio, 'Ubicación técnica': e.ubic, 'Descripción ubicación': e.ubicDesc, 'Referencia': e.ubicRef,
        'OT de SAP en la campaña': hidroSapEnCamp(e, camp.c) ? 'Sí, la trae' : 'No (ajustar en SAP)', 'Estado': HIDRO_ESTADOS[o.estado].label,
        'Fecha registrada': o.fecha ? hidroFecha(o.fecha) : '', 'Último hidrolavado': hidroFecha(e.ultimo),
      });
    });
  });
  const eqs = lista.map(e => {
    const meses = hidroMesesDesde(e.ultimo);
    return {
      'Equipo': e.equipo, 'Denominación': e.denominacion, 'Tipo': e.tipo + (e.tipo === 'Condensadora' ? ` (${e.sub})` : ''),
      'Edificio / Zona': e.edificio, 'Ubicación técnica': e.ubic, 'Descripción ubicación': e.ubicDesc,
      'Hidrolavado en SAP hoy': hidroSapTexto(e), 'Plan SAP': e.sap ? `${e.sap.plan} (${e.sap.hr})` : '',
      'Campañas que SAP ya trae': `${e.sapCoinc} de 2`, 'Qué ajustar en SAP': hidroSapAjuste(e),
      'Último hidrolavado': hidroFecha(e.ultimo), 'Meses desde el último': isFinite(meses) ? Math.round(meses * 10) / 10 : '',
    };
  });
  const hoja = rows => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const cols = Object.keys(rows[0] || {});
    ws['!cols'] = cols.map(c => ({ wch: Math.min(60, Math.max(c.length, ...rows.map(r => String(r[c] || '').length)) + 2) }));
    return ws;
  };
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, hoja(cal), 'Campañas');
  XLSX.utils.book_append_sheet(wb, hoja(eqs), 'Equipos');
  const [a, b] = D.campanas;
  XLSX.writeFile(wb, `AEP_Calendario_Hidrolavados_${a.desde}_a_${b.hasta}.xlsx`);
}

/* ─── Render principal ──────────────────────────────────────── */
function renderHidrolavados() {
  const page = document.getElementById('page-hidrolavados');
  if (!page) return;
  const D = hidroDatos();
  if (hidroCampSel === null && hidroOffset === 0 && !renderHidrolavados._abierto) {
    hidroCampSel = hidroCampActualIdx();   // la primera vez se abre la campaña actual
    renderHidrolavados._abierto = true;
  }
  if (hidroCampSel !== null && !D.campanas.some(c => c.idx === hidroCampSel)) hidroCampSel = null;
  document.getElementById('hidro-nav-label').textContent = D.campanas.map(hidroCampLabel).join(' · ');
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
  document.getElementById('hidro-prev').addEventListener('click', () => { hidroOffset -= 2; renderHidrolavados(); });
  document.getElementById('hidro-next').addEventListener('click', () => { hidroOffset += 2; renderHidrolavados(); });
  document.getElementById('hidro-hoy').addEventListener('click', () => { hidroOffset = 0; hidroCampSel = hidroCampActualIdx(); renderHidrolavados(); });
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
