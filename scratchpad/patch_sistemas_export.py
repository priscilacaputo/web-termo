# -*- coding: utf-8 -*-
import os
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'js', 'auditoria-app.js')
s = open(p, encoding='utf-8').read()

FN = r'''  /* Descarga de los sistemas de aire (condensadora + interiores) en Excel. */
  window.audSistemasExport = function () {
    if (typeof XLSX === 'undefined' || typeof AAC_SISTEMAS === 'undefined') return;
    const PL = (typeof PLANES_SAP !== 'undefined') ? PLANES_SAP : [];
    const maestro = {};
    getMaestro().forEach((e) => { maestro[e.equipo] = e; });
    const porEq = {};
    PL.forEach((p) => { (porEq[p.equipo] = porEq[p.equipo] || []).push(p); });
    const planTxt = (eq) => (porEq[eq] || []).map((p) => `${p.desc} (plan ${p.plan})`).join(' + ') || 'SIN PLAN';
    const frecTxt = (eq) => [...new Set((porEq[eq] || []).map((p) => p.realBucket))].join(' + ') || '';
    const vinc = (sis) => (sis.conf === 'alta' ? 'Seguro (misma ubicación técnica)' : 'Revisar (deducido por secuencia de códigos)');
    const filaEq = (sis, eq, rol) => ({
      'Sistema': sis.cabeza, 'Nombre del sistema': sis.nombre, 'Rol': rol, 'Equipo': eq,
      'Denominación': (maestro[eq] || {}).denom || '', 'Ubicación técnica': (maestro[eq] || {}).ubic || '',
      'Plan': planTxt(eq), 'Frecuencia real': frecTxt(eq), 'Vínculo': vinc(sis),
      'Correcto? (completar)': '', 'Condensadora correcta (completar)': '',
    });
    const sistemas = AAC_SISTEMAS.map((sis) => {
      const bC = new Set((porEq[sis.cabeza] || []).map((p) => p.realBucket));
      const bI = new Set(sis.miembros.flatMap((m) => (porEq[m] || []).map((p) => p.realBucket)));
      const distinta = [...bC].some((b) => !bI.has(b)) || [...bI].some((b) => !bC.has(b));
      return {
        'Sistema': sis.cabeza, 'Nombre': sis.nombre, 'Ubicación técnica condensadora': sis.ubic,
        'Cantidad de interiores': sis.miembros.length, 'Vínculo': vinc(sis),
        'Plan de la condensadora': planTxt(sis.cabeza), 'Frecuencia condensadora': frecTxt(sis.cabeza),
        'Frecuencia de los interiores': [...bI].join(' + '),
        'Frecuencia distinta': distinta ? 'Sí' : '',
        'Interiores': sis.miembros.join(', '),
      };
    });
    const equipos = [];
    AAC_SISTEMAS.forEach((sis) => {
      equipos.push(filaEq(sis, sis.cabeza, 'Condensadora / exterior'));
      sis.miembros.forEach((m) => equipos.push(filaEq(sis, m, 'Interior')));
    });
    const sinExt = ((typeof AAC_SIN_EXTERIOR !== 'undefined') ? AAC_SIN_EXTERIOR : []).map((x) => ({
      'Equipo': x.equipo, 'Denominación': x.denom, 'Ubicación técnica': (maestro[x.equipo] || {}).ubic || '',
      'Plan': planTxt(x.equipo), 'Frecuencia real': frecTxt(x.equipo),
    }));
    const wb = XLSX.utils.book_new();
    const add = (rows, name, cols) => {
      const ws = XLSX.utils.json_to_sheet(rows);
      if (cols) ws['!cols'] = cols.map((w) => ({ wch: w }));
      XLSX.utils.book_append_sheet(wb, ws, name);
    };
    add(sistemas, 'Sistemas', [10, 44, 26, 12, 34, 46, 18, 26, 12, 70]);
    add(equipos, 'Equipos por sistema', [10, 40, 22, 10, 44, 28, 60, 16, 34, 16, 24]);
    if (sinExt.length) add(sinExt, 'Interiores sin condensadora', [10, 44, 28, 60, 16]);
    XLSX.writeFile(wb, 'Sistemas_de_aire_condensadora_interiores.xlsx');
  };

'''
marker = "  /* Sistemas de aire (condensadora + interiores): base del agrupado de OTs del Planificador. */"
assert marker in s
s = s.replace(marker, FN + marker, 1)

old = "      ${heading('Sistemas de aire · condensadora + interiores · ' + AAC_SISTEMAS.length)}"
new = ("      <div style=\"display:flex;flex-wrap:wrap;gap:10px;align-items:center\">\n"
       "        <div style=\"flex:1;min-width:220px\">${heading('Sistemas de aire · condensadora + interiores · ' + AAC_SISTEMAS.length)}</div>\n"
       "        <button class=\"mant-tab\" onclick=\"audSistemasExport()\">⬇ Descargar Excel</button>\n"
       "      </div>")
assert old in s
s = s.replace(old, new, 1)
open(p, 'w', encoding='utf-8').write(s)
print('ok')
