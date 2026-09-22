# -*- coding: utf-8 -*-
import os
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'js', 'hdr-audit.js')
s = open(p, encoding='utf-8').read()
a = s.index("  /* Detalle de un puesto: qué hojas de ruta")
b = s.rindex('})();')
FN = r'''  /* Detalle de un puesto: qué hojas de ruta (y qué operaciones) hay que corregir en SAP. */
  window.hdrPuestoDetalleHTML = function (puesto) {
    if (typeof HDR_OPS_FUERA === 'undefined' || typeof HDR_PLAN === 'undefined') return '';
    if (PUESTOS_OK.includes(puesto)) {
      return `<div style="padding:8px 12px;font-size:12px;color:#059669">✓ Puesto válido: no hay nada que modificar.</div>`;
    }
    const map = new Map();
    const get = (ruta, cont, desc) => map.get(ruta + '/' + cont) || map.set(ruta + '/' + cont, { ruta, cont, desc, ops: [], resp: [], plans: [] }).get(ruta + '/' + cont);
    HDR_OPS_FUERA.filter((o) => o[5] === puesto).forEach((o) => get(o[0], o[1], o[2]).ops.push(o));
    HDR_PLAN.forEach((r) => {
      const d = map.get(r[3] + '/' + r[4]);
      if (d) d.plans.push(r);
      if (r[6] === puesto) get(r[3], r[4], r[2]).resp.push(r);
    });
    HDR_PLAN.forEach((r) => { const d = map.get(r[3] + '/' + r[4]); if (d && !d.plans.includes(r)) d.plans.push(r); });
    const filas = [...map.values()].map((d) => {
      /* planes afectados: todos los de la hoja de ruta si hay operaciones a cambiar; si no, solo los que tienen ese responsable */
      const afect = d.ops.length ? d.plans : d.resp;
      return { d, afect, equipos: [...new Set(afect.map((r) => r[0]).filter(Boolean))] };
    });
    const enUso = filas.filter((f) => f.afect.length).sort((a, b) => b.afect.length - a.afect.length);
    const sinUso = filas.filter((f) => !f.afect.length);
    const totP = enUso.reduce((t, f) => t + f.afect.length, 0);

    const card = (f) => {
      const d = f.d;
      const ops = d.ops.length
        ? `<div style="font-size:12px;margin-top:4px"><span style="color:var(--color-muted)">Operaciones a cambiar (IA17):</span> ${d.ops.map((o) => `<b>${esc(o[3])}</b> ${esc(o[4])}`).join(' · ')}</div>` : '';
      const resp = d.resp.length
        ? `<div style="font-size:12px;margin-top:2px"><span style="color:var(--color-muted)">Puesto responsable del plan a cambiar (IP02):</span> ${d.resp.slice(0, 10).map((r) => `<b>${esc(r[1])}</b>${r[0] ? ' (' + esc(r[0]) + ')' : ''}`).join(', ')}${d.resp.length > 10 ? ' …' : ''}</div>` : '';
      const cuenta = f.afect.length
        ? `${f.afect.length} posiciones de plan · ${f.equipos.length} equipos${f.equipos.length ? ': ' + f.equipos.slice(0, 10).map(esc).join(', ') + (f.equipos.length > 10 ? ' …' : '') : ''}`
        : 'Ningún plan vigente usa esta hoja de ruta';
      return `<div style="border:1px solid var(--color-border);border-radius:8px;padding:8px 10px;margin-bottom:6px;background:var(--color-surface)">
        <div style="font-weight:700;font-size:12.5px"><code>${esc(d.ruta)}</code> contador <code>${esc(d.cont)}</code> — ${esc(d.desc)}</div>
        ${ops}${resp}
        <div style="font-size:11.5px;color:var(--color-muted);margin-top:3px">${cuenta}</div>
      </div>`;
    };

    if (!filas.length) return `<div style="padding:8px 12px;font-size:12px;color:var(--color-muted)">Este puesto no aparece en ninguna hoja de ruta ni plan.</div>`;
    return `<div style="padding:8px 12px 12px">
      <div style="font-size:12px;margin-bottom:8px"><b>${enUso.length} hoja${enUso.length === 1 ? '' : 's'} de ruta en uso a modificar</b> (afectan ${totP} posiciones de plan).
        En SAP: <b>IA17</b> → hoja de ruta → contador → operación → puesto de trabajo. El puesto responsable del plan se cambia en <b>IP02</b>.</div>
      ${enUso.map(card).join('') || '<div style="font-size:12px;color:var(--color-muted)">Ninguna hoja de ruta en uso.</div>'}
      ${sinUso.length ? `<details style="margin-top:8px"><summary style="cursor:pointer;font-size:12px;color:var(--color-muted)">${sinUso.length} hojas de ruta más con este puesto, pero que ningún plan vigente usa (versiones sin uso: se pueden ignorar o dar de baja)</summary><div style="margin-top:6px">${sinUso.map(card).join('')}</div></details>` : ''}
    </div>`;
  };
'''
s = s[:a] + FN + s[b:]
open(p, 'w', encoding='utf-8').write(s)
print('ok')
