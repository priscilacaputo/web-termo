# -*- coding: utf-8 -*-
import os
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'js')

# ── hdr-audit.js: detalle por puesto ──
p = os.path.join(base, 'hdr-audit.js')
s = open(p, encoding='utf-8').read()
end = s.rindex('})();')
FN = r'''
  /* Detalle de un puesto: qué hojas de ruta (y qué operaciones) hay que corregir en SAP. */
  window.hdrPuestoDetalleHTML = function (puesto) {
    if (typeof HDR_OPS_FUERA === 'undefined' || typeof HDR_PLAN === 'undefined') return '';
    if (PUESTOS_OK.includes(puesto)) {
      return `<div style="padding:8px 12px;font-size:12px;color:#059669">✓ Puesto válido: no hay nada que modificar.</div>`;
    }
    const porRC = new Map();
    HDR_OPS_FUERA.filter((o) => o[5] === puesto).forEach((o) => {
      const k = o[0] + '/' + o[1];
      const d = porRC.get(k) || porRC.set(k, { ruta: o[0], cont: o[1], desc: o[2], ops: [] }).get(k);
      d.ops.push(o);
    });
    /* Planes cuyo puesto responsable (no el de la operación) es este puesto */
    const respPorRC = new Map();
    HDR_PLAN.filter((r) => r[6] === puesto).forEach((r) => {
      const k = r[3] + '/' + r[4];
      if (!porRC.has(k)) porRC.set(k, { ruta: r[3], cont: r[4], desc: r[2], ops: [] });
      respPorRC.set(k, (respPorRC.get(k) || 0) + 1);
    });
    const filas = [...porRC.entries()].map(([k, d]) => {
      const usan = HDR_PLAN.filter((r) => r[3] === d.ruta && r[4] === d.cont);
      const equipos = [...new Set(usan.map((r) => r[0]).filter(Boolean))];
      return { k, d, planes: usan.length, equipos, resp: respPorRC.get(k) || 0 };
    }).sort((a, b) => b.planes - a.planes);
    if (!filas.length) return `<div style="padding:8px 12px;font-size:12px;color:var(--color-muted)">Este puesto no aparece en las hojas de ruta vigentes de los planes.</div>`;
    const totP = filas.reduce((t, f) => t + f.planes, 0);
    return `<div style="padding:8px 12px 12px">
      <div style="font-size:12px;margin-bottom:8px"><b>${filas.length} hoja${filas.length > 1 ? 's' : ''} de ruta a modificar</b> (afectan ${totP} posiciones de plan). En SAP: <b>IA17</b> → hoja de ruta → contador → operación → cambiar el puesto de trabajo.</div>
      ${filas.map((f) => `<div style="border:1px solid var(--color-border);border-radius:8px;padding:8px 10px;margin-bottom:6px;background:var(--color-surface)">
        <div style="font-weight:700;font-size:12.5px"><code>${esc(f.d.ruta)}</code> contador <code>${esc(f.d.cont)}</code> — ${esc(f.d.desc)}</div>
        ${f.d.ops.length ? `<div style="font-size:12px;margin-top:4px"><span style="color:var(--color-muted)">Operaciones a cambiar:</span> ${f.d.ops.map((o) => `<b>${esc(o[3])}</b> ${esc(o[4])}`).join(' · ')}</div>` : ''}
        ${f.resp ? `<div style="font-size:12px;margin-top:2px"><span style="color:var(--color-muted)">Además, ${f.resp} plan${f.resp > 1 ? 'es tienen' : ' tiene'} este puesto como responsable (IP02).</span></div>` : ''}
        <div style="font-size:11.5px;color:var(--color-muted);margin-top:3px">${f.planes} posiciones de plan · ${f.equipos.length} equipos${f.equipos.length ? ': ' + f.equipos.slice(0, 12).map(esc).join(', ') + (f.equipos.length > 12 ? ' …' : '') : ''}</div>
      </div>`).join('')}
    </div>`;
  };
'''
s = s[:end] + FN + s[end:]
open(p, 'w', encoding='utf-8').write(s)

# ── auditoria-app.js: barras desplegables ──
p = os.path.join(base, 'auditoria-app.js')
s = open(p, encoding='utf-8').read()
old = """      (S.porPuestoHH || []).map((x) => `<div style="display:flex;align-items:center;gap:8px;padding:3px 0;font-size:12px">
        <span style="flex:0 0 110px">${esc(x.k)}</span>
        <span style="flex:1;height:10px;background:var(--color-surface);border-radius:5px;overflow:hidden"><span style="display:block;height:100%;width:${Math.round((x.h / maxH) * 100)}%;background:#6366f1"></span></span>
        <span style="flex:0 0 64px;text-align:right;font-weight:700">${x.h.toLocaleString('es-AR')} h</span></div>`).join('') +"""
new = """      `<div style="font-size:11.5px;color:var(--color-muted);margin-bottom:4px">Tocá un puesto para ver qué hojas de ruta hay que modificar. Solo deberían quedar AUX_TER, AUX_MEC y MOEX.</div>` +
      (S.porPuestoHH || []).map((x) => {
        const ok = ['AUX_TER', 'AUX_MEC', 'MOEX'].includes(x.k);
        const det = (typeof hdrPuestoDetalleHTML === 'function') ? hdrPuestoDetalleHTML(x.k) : '';
        return `<details style="border-bottom:1px solid var(--color-surface)"><summary style="list-style:none;cursor:pointer;display:flex;align-items:center;gap:8px;padding:5px 0;font-size:12px">
        <span style="flex:0 0 122px;font-weight:${ok ? 400 : 700};color:${ok ? 'inherit' : '#b45309'}">${ok ? '' : '⚠ '}${esc(x.k)} ▾</span>
        <span style="flex:1;height:10px;background:var(--color-surface);border-radius:5px;overflow:hidden"><span style="display:block;height:100%;width:${Math.round((x.h / maxH) * 100)}%;background:${ok ? '#6366f1' : '#f59e0b'}"></span></span>
        <span style="flex:0 0 64px;text-align:right;font-weight:700">${x.h.toLocaleString('es-AR')} h</span></summary>${det}</details>`;
      }).join('') +"""
assert old in s
s = s.replace(old, new)
open(p, 'w', encoding='utf-8').write(s)
print('ok')
