# -*- coding: utf-8 -*-
import os
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
p = os.path.join(root, 'assets', 'js', 'auditoria-app.js')
s = open(p, encoding='utf-8').read()

FN = r'''  /* Sistemas de aire (condensadora + interiores): base del agrupado de OTs del Planificador. */
  function sistemasAireHTML() {
    if (typeof AAC_SISTEMAS === 'undefined') return '';
    const PL = (typeof PLANES_SAP !== 'undefined') ? PLANES_SAP : [];
    const porEq = {};
    PL.forEach((p) => { (porEq[p.equipo] = porEq[p.equipo] || []).push(p); });
    const resumenPlan = (eqs) => {
      const c = {};
      eqs.forEach((e) => (porEq[e] || []).forEach((p) => {
        const k = (p.desc || '—') + ' · ' + (p.realBucket || '—');
        c[k] = (c[k] || 0) + 1;
      }));
      return Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${esc(k)}${n > 1 ? ' <b>×' + n + '</b>' : ''}`).join('<br>') || '<span style="color:#dc2626">sin plan</span>';
    };
    const bucketsDe = (eqs) => new Set(eqs.flatMap((e) => (porEq[e] || []).map((p) => p.realBucket)));
    const filas = AAC_SISTEMAS.map((sis) => {
      const bC = bucketsDe([sis.cabeza]), bI = bucketsDe(sis.miembros);
      const distinta = [...bC].some((b) => !bI.has(b)) || [...bI].some((b) => !bC.has(b));
      return `<tr>
        <td><span class="equipo-tag" style="background:#6366f1">${esc(sis.cabeza)}</span><div style="font-size:11.5px">${esc(sis.nombre)}</div></td>
        <td style="text-align:center">${sis.miembros.length}</td>
        <td><span class="aud-pill aud-${sis.conf === 'alta' ? 'ok' : 'curso'}" title="${sis.conf === 'alta' ? 'Misma ubicación técnica' : 'Deducido por la secuencia de códigos: conviene revisarlo'}">${sis.conf === 'alta' ? 'Seguro' : 'Revisar'}</span></td>
        <td style="font-size:11.5px">${resumenPlan([sis.cabeza])}</td>
        <td style="font-size:11.5px">${resumenPlan(sis.miembros)}${distinta ? '<div style="color:#b45309;font-weight:700">⚠ frecuencia distinta a la de la condensadora</div>' : ''}</td>
        <td><details><summary style="cursor:pointer;color:var(--color-blue,#0096d6);font-size:12px">ver</summary><div style="font-size:11.5px;max-width:260px">${sis.miembros.map(esc).join(', ')}</div></details></td>
      </tr>`;
    }).join('');
    const sinExt = (typeof AAC_SIN_EXTERIOR !== 'undefined') ? AAC_SIN_EXTERIOR : [];
    const nRev = AAC_SISTEMAS.filter((x) => x.conf !== 'alta').length;
    return `
      ${heading('Sistemas de aire · condensadora + interiores · ' + AAC_SISTEMAS.length)}
      <div style="font-size:12px;color:var(--color-muted);margin-bottom:8px;line-height:1.5">
        SAP genera una OT por equipo, así que la unidad exterior y sus interiores salen por separado. El Planificador usa esta lista para juntarlos en <b>una sola tarea</b>
        (mismo día, guardia y hora). SAP no informa qué interior depende de qué exterior: se deduce de la denominación, la ubicación técnica y la secuencia de códigos.
        <b>${nRev}</b> sistemas están marcados "Revisar" porque solo se dedujeron por secuencia de códigos.
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Condensadora / exterior</th><th style="text-align:center">Interiores</th><th>Vínculo</th><th>Plan de la condensadora</th><th>Plan de los interiores</th><th>Equipos</th></tr></thead>
        <tbody>${filas}</tbody>
      </table></div>
      ${sinExt.length ? `<div style="font-size:12px;margin-top:8px"><b>Unidades interiores sin condensadora identificable (${sinExt.length}):</b> ${sinExt.map((x) => esc(x.equipo)).join(', ')} — piso-techo aisladas; no se agrupan.</div>` : ''}
    `;
  }

'''
marker = "  function planesHTML() {"
assert marker in s
s = s.replace(marker, FN + marker, 1)

anchor = "        <div style=\"margin-top:14px;padding:10px 12px;background:var(--color-surface);border-radius:8px;font-size:12px\">\n          Cumplimiento"
assert anchor in s
s = s.replace(anchor, "        ${sistemasAireHTML()}\n\n" + anchor, 1)
open(p, 'w', encoding='utf-8').write(s)
print('ok')
