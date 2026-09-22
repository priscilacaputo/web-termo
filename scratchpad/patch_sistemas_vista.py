# -*- coding: utf-8 -*-
import os
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'js', 'auditoria-app.js')
s = open(p, encoding='utf-8').read()

a = s.index("  function sistemasAireHTML() {")
b = s.index("  function planesHTML() {", a)

NEW = r'''  window.audSisFiltro = function (btn, k) {
    const box = btn.closest('.aud-sis-box');
    box.querySelectorAll('.aud-sis-filtro').forEach((x) => x.classList.toggle('active', x === btn));
    box.querySelectorAll('.aud-sis-card').forEach((c) => {
      c.style.display = (k === 'todos' || (k === 'revisar' && c.dataset.conf !== 'alta') || (k === 'freq' && c.dataset.freq === '1')) ? '' : 'none';
    });
  };

  function sistemasAireHTML() {
    if (typeof AAC_SISTEMAS === 'undefined') return '';
    const heading = (t) => `<div style="font-weight:700;font-size:12px;margin:16px 0 4px;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted)">${t}</div>`;
    const PL = (typeof PLANES_SAP !== 'undefined') ? PLANES_SAP : [];
    const maestro = {};
    getMaestro().forEach((e) => { maestro[e.equipo] = e; });
    const porEq = {};
    PL.forEach((p) => { (porEq[p.equipo] = porEq[p.equipo] || []).push(p); });
    const chipF = (k) => `<span style="display:inline-block;padding:0 7px;border-radius:9px;font-size:10.5px;font-weight:700;color:#fff;background:${perColor(k)}">${esc(k)}</span>`;
    /* Planes de un grupo de equipos: "descripción" + frecuencia real, con cuántos equipos lo usan */
    const planesDe = (eqs) => {
      const c = {};
      eqs.forEach((e) => (porEq[e] || []).forEach((p) => {
        const k = (p.desc || '—') + '' + (p.realBucket || '—');
        c[k] = (c[k] || 0) + 1;
      }));
      const filas = Object.entries(c).sort((x, y) => y[1] - x[1]).map(([k, n]) => {
        const [desc, b] = k.split('');
        return `<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:1px 0"><span>${esc(desc)}</span>${chipF(b)}${eqs.length > 1 ? `<span style="color:var(--color-muted);font-size:11px">${n} de ${eqs.length}</span>` : ''}</div>`;
      });
      return filas.join('') || '<span style="color:#dc2626;font-weight:600">sin plan</span>';
    };
    const bucketsDe = (eqs) => new Set(eqs.flatMap((e) => (porEq[e] || []).map((p) => p.realBucket)));
    const tag = (e, fondo) => `<span class="equipo-tag" style="background:${fondo};font-size:10.5px" title="${esc((maestro[e] || {}).denom || '')}">${esc(e)}</span>`;

    const sis = AAC_SISTEMAS.map((x) => {
      const bC = bucketsDe([x.cabeza]), bI = bucketsDe(x.miembros);
      return { x, distinta: [...bC].some((b) => !bI.has(b)) || [...bI].some((b) => !bC.has(b)) };
    });
    const nInt = AAC_SISTEMAS.reduce((t, x) => t + x.miembros.length, 0);
    const nRev = AAC_SISTEMAS.filter((x) => x.conf !== 'alta').length;
    const nDist = sis.filter((x) => x.distinta).length;

    const tarjetas = sis.map(({ x, distinta }) => `<div class="aud-sis-card" data-conf="${x.conf}" data-freq="${distinta ? 1 : 0}"
        style="border:1px solid var(--color-border);border-radius:10px;padding:12px 14px;background:var(--color-surface)">
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:8px;min-width:0">
          ${tag(x.cabeza, '#6366f1')}<b style="font-size:13px">${esc(x.nombre)}</b>
        </div>
        <span class="aud-pill aud-${x.conf === 'alta' ? 'ok' : 'curso'}" title="${x.conf === 'alta' ? 'Misma ubicación técnica que sus interiores' : 'Deducido por la secuencia de códigos: conviene confirmarlo'}">${x.conf === 'alta' ? '✓ Seguro' : 'Revisar'}</span>
      </div>
      <div style="font-size:11px;color:var(--color-muted);margin:2px 0 8px">${esc(x.ubic)}</div>
      <div style="display:grid;grid-template-columns:96px 1fr;gap:4px 10px;font-size:12px">
        <div style="color:var(--color-muted)">Condensadora</div><div>${planesDe([x.cabeza])}</div>
        <div style="color:var(--color-muted)">${x.miembros.length} interior${x.miembros.length > 1 ? 'es' : ''}</div><div>${planesDe(x.miembros)}</div>
      </div>
      ${distinta ? `<div style="margin-top:6px;font-size:11.5px;color:#b45309;font-weight:700">⚠ La frecuencia de los interiores no coincide con la de la condensadora</div>` : ''}
      <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px">${x.miembros.map((m) => tag(m, '#64748b')).join('')}</div>
    </div>`).join('');

    const sinExt = (typeof AAC_SIN_EXTERIOR !== 'undefined') ? AAC_SIN_EXTERIOR : [];
    const filtroBtn = (k, txt, act) => `<button class="mant-tab aud-sis-filtro${act ? ' active' : ''}" onclick="audSisFiltro(this,'${k}')">${txt}</button>`;
    return `<div class="aud-sis-box">
      <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
        <div style="flex:1;min-width:220px">${heading('Sistemas de aire · condensadora + interiores · ' + AAC_SISTEMAS.length)}</div>
        <button class="mant-tab" onclick="audSistemasExport()">⬇ Descargar Excel</button>
      </div>
      <div style="font-size:12px;color:var(--color-muted);margin-bottom:10px;line-height:1.5">
        SAP genera una OT por equipo, así que la unidad exterior y sus interiores salen por separado. El Planificador usa esta lista para juntarlos en <b>una sola tarea</b>
        (mismo día, guardia y hora). SAP no informa qué interior depende de qué exterior: se deduce de la denominación, la ubicación técnica y la secuencia de códigos.
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:10px">
        ${filtroBtn('todos', `Todos · ${AAC_SISTEMAS.length}`, true)}
        ${filtroBtn('revisar', `A confirmar · ${nRev}`, false)}
        ${filtroBtn('freq', `Frecuencia distinta · ${nDist}`, false)}
        <span style="font-size:12px;color:var(--color-muted);margin-left:auto">${nInt} interiores en total · pasá el mouse sobre un equipo para ver su denominación</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:10px">${tarjetas}</div>
      ${sinExt.length ? `<div style="font-size:12px;margin-top:10px"><b>Unidades interiores sin condensadora identificable (${sinExt.length}):</b> ${sinExt.map((z) => tag(z.equipo, '#94a3b8')).join(' ')} <span style="color:var(--color-muted)">— piso-techo aisladas; no se agrupan.</span></div>` : ''}
    </div>`;
  }

'''
s = s[:a] + NEW + s[b:]
open(p, 'w', encoding='utf-8').write(s)
print('ok')
