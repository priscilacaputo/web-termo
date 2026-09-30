/* ─── Gamas para SAM ───────────────────────────────────────────────────
   Toma el texto de cada operación de las hojas de ruta (HDR_GAMAS, del IA17) y lo rearma en
   texto plano legible para SAP SAM: una tarea por línea, numeradas, con encabezados por
   frecuencia. SAM no respeta el formato del SAP GUI (une los renglones sin espacio), por eso:
     · cada tarea lleva número / símbolo al inicio (se distingue aunque se peguen los renglones);
     · las líneas largas se parten con sangría de 2 espacios (si SAM las une, queda el espacio);
     · se separan las frases pegadas ("operación.Limpieza") y se corrigen palabras pegadas conocidas.
   Regenerar datos: python scratchpad/gen_hdr_gamas.py "<ia17.xlsx>". */
(function () {
  if (typeof HDR_GAMAS === 'undefined') return;

  /* Palabras pegadas conocidas en los textos largos de SAP → corrección (sólo palabra completa). */
  const PEGADAS = {
    controlesde: 'controles de', dedrenaje: 'de drenaje', yforzador: 'y forzador', delevaporador: 'del evaporador',
    deltermostato: 'del termostato', defuncionamiento: 'de funcionamiento', encaso: 'en caso', deaguapor: 'de agua por',
    'y/obandeja': 'y/o bandeja', ycarteles: 'y carteles', delárea: 'del área', nivelde: 'nivel de', convalores: 'con valores',
    pinturaen: 'pintura en', graly: 'gral. y', deretorno: 'de retorno', delcondensado: 'del condensado',
    vibraciones: 'vibraciones', vibracionescon: 'vibraciones con', equipobackup: 'equipo backup', decalefacción: 'de calefacción', desala: 'de sala',
    conchapa: 'con chapa', chapacaracterística: 'chapa característica', modomanual: 'modo manual', volvera: 'volver a',
    alternarfuncionamiento: 'alternar funcionamiento', pantallassimatic: 'pantallas Simatic', ymecanismos: 'y mecanismos',
    delos: 'de los', delequipo: 'del equipo', delmotor: 'del motor', deequipo: 'de equipo'
  };
  const FRECS = [['DIARIA', /diari/], ['SEMANAL', /semanal/], ['QUINCENAL', /quincenal/], ['MENSUAL', /mensual/], ['BIMESTRAL', /bimestral/],
    ['TRIMESTRAL', /trimestral/], ['CUATRIMESTRAL', /cuatrimestral/], ['SEMESTRAL', /semestral/], ['ANUAL', /anual/], ['BIENAL', /bienal/]];
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const st = { key: null, ops: {}, sel: null };

  /* ── equipos por hoja de ruta (HDR_PLAN: [equipo, plan, desc, ruta, cont, ...]) ── */
  const equiposPorKey = {};
  if (typeof HDR_PLAN !== 'undefined') HDR_PLAN.forEach(r => { (equiposPorKey[r[3] + '/' + r[4]] = equiposPorKey[r[3] + '/' + r[4]] || []).push(r[0]); });

  /* ════════ Normalización del texto ════════ */
  /* Frases rotas en el propio SAP (falta texto) */
  const FRASES = [[/ruidos, ciones/gi, 'ruidos, vibraciones']];
  /* Palabras pegadas no listadas: se separan solas cuando una palabra rara es "palabra de uso común + palabra funcional"
     (de, del, la, con, por… o un verbo de tarea), p. ej. "funcionamientode" → "funcionamiento de". */
  const FUNC = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'en', 'con', 'por', 'para', 'que', 'se', 'si', 'sin', 'al', 'un', 'una', 'su', 'sus', 'ser', 'sea', 'hasta', 'cada', 'como', 'desde', 'sobre', 'entre', 'lo', 'no']);
  const VERBO = new Set(['verificar', 'verificación', 'registrar', 'reemplazar', 'retirar', 'tomar', 'chequear', 'controlar', 'limpiar', 'limpieza', 'realizar', 'efectuar', 'medir', 'medición', 'ajustar', 'revisar', 'inspección', 'energizado', 'detectar', 'comprobar', 'alternar', 'lubricar', 'cambiar', 'hidrolavado', 'garantizar']);
  let vocab = null;
  function getVocab() {
    if (vocab) return vocab; vocab = {};
    const vistos = new Set();   // textos distintos: las hojas de ruta copian el mismo texto y eso inflaría la frecuencia de los errores
    const add = t => { t = String(t || ''); if (vistos.has(t)) return; vistos.add(t); (t.toLowerCase().match(/[a-záéíóúñ]+/g) || []).forEach(w => { vocab[w] = (vocab[w] || 0) + 1; }); };
    Object.values(HDR_GAMAS).forEach(h => { add(h.d); h.o.forEach(o => { add(o.d); (o.ga || []).forEach(g => g.i.forEach(add)); (o.li || []).forEach(add); (o.sb || []).forEach(s => { add(s.d); add(s.x); }); }); });
    HDR_GAMAS_TXT.forEach(a => a.forEach(add));
    return vocab;
  }
  const COLA_NO = new Set(['al', 'su', 'no', 'lo', 'se', 'si', 'un']);   // "Bienal", "ensual"… no son palabras pegadas
  function segmentar(w, V) {                        // sólo 2 trozos: palabra de uso común + palabra funcional/verbo
    for (let i = 2; i <= w.length - 2; i++) {
      const a = w.slice(0, i), b = w.slice(i);
      if (!(FUNC.has(a) || (V[a] >= 6 && a.length >= 3))) continue;
      if (!(FUNC.has(b) || (V[b] >= 6 && b.length >= 3))) continue;
      if (COLA_NO.has(b) || (/^(lo|la|los|las|se)$/.test(b) && /(ar|er|ir)$/.test(a))) continue;   // verbo + pronombre: palabra válida
      return [a, b];
    }
    return null;
  }
  function separarPegadas(w) {
    const V = getVocab(), lw = w.toLowerCase();
    const cm = /^([a-záéíóúñ]{3,})([A-ZÁÉÍÓÚ][a-záéíóúñ]{2,})$/.exec(w);   // "adecuadosAlternar"
    if (cm && (V[cm[1]] || 0) >= 6) {
      const pk = PEGADAS[cm[2].toLowerCase()];
      return cm[1] + ' ' + (pk ? pk.replace(/^./, c => c.toUpperCase()) : separarPegadas(cm[2]));
    }
    if (lw.length < 4 || (V[lw] || 0) > 2) return w;
    let p = segmentar(lw, V);
    if (lw.length < 6 && !(p && FUNC.has(p[0]) && FUNC.has(p[1]))) return w;   // "dela" → "de la"
    if (!p && /^y./.test(lw) && (V[lw.slice(1)] || 0) >= 10 && lw.length >= 7) p = ['y', lw.slice(1)];
    if (!p || !p.some(x => FUNC.has(x) || VERBO.has(x))) return w;
    let i = 0; return p.map(x => { const s = w.slice(i, i + x.length); i += x.length; return s; }).join(' ');
  }
  function arreglarPegadas(t) {
    FRASES.forEach(([re, rep]) => { t = t.replace(re, rep); });
    return t.replace(/[A-Za-zÁÉÍÓÚáéíóúñÑ\/]+/g, w => PEGADAS[w.toLowerCase()] ? (w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase()
      ? PEGADAS[w.toLowerCase()].replace(/^./, c => c.toUpperCase()) : PEGADAS[w.toLowerCase()]) : separarPegadas(w));
  }
  /* Suboperación: el texto breve de SAP se corta a 40 caracteres; si el texto largo no lo repite, es la continuación. */
  function textoSub(s) {
    const d = (s.d || '').trim(), x = (s.x || '').trim();
    if (!x) return d;
    if (norm(x).startsWith(norm(d).slice(0, Math.min(d.length, 24)))) return x;
    const V = getVocab(), ult = (d.match(/[a-záéíóúñ]+$/i) || [''])[0].toLowerCase(), pri = (x.match(/^[a-záéíóúñ]+/) || [''])[0];
    const pega = d.length >= 38 && ult && pri && (V[ult + pri] || 0) >= 2 && (V[ult] || 0) <= 2;
    return d + (pega ? '' : ' ') + x;
  }
  /* "operación.Limpieza de" → frases separadas; devuelve lista de tareas. */
  function partirFrases(t) {
    t = arreglarPegadas(t).replace(/\s*,,\s*/g, '\n').replace(/[ \t]+/g, ' ').trim();
    t = t.replace(/,(?=[A-Za-záéíóúñ])/g, ', ').replace(/([a-záéíóúñ]{3})(?=(?:Verificar|Verificación|Limpieza|Limpiar|Realizar|Efectuar|Controlar|Retirar|Garantizar|Energizado|Medir|Ajustar|Revisar|Inspeccionar|Lubricar|Cambiar)\b)/g, '$1\n');
    t = t.replace(/([a-záéíóúñ\)\d])\.(?=[A-ZÁÉÍÓÚ¿])/g, '$1.\n');
    return t.split('\n').map(x => x.trim()).filter(Boolean);
  }
  function fcOf(h) { const n = norm(h); for (const [k, re] of FRECS) if (re.test(n)) return k; return ''; }
  function tituloFrec(h) { const f = fcOf(h); if (f) return f; return h.replace(/^gama$/i, '').toUpperCase(); }

  /* ── Operación → {seg:[], tareas:[{h,i:[]}], auto:[], libre:[]} ── */
  function estructurar(o) {
    const r = { seg: [], tareas: [], auto: [], libre: [] };
    if (o.S != null) r.seg = HDR_GAMAS_TXT[o.S].slice();
    if (o.A != null) r.auto = HDR_GAMAS_TXT[o.A].slice();
    (o.ga || []).forEach(g => r.tareas.push({ h: g.h, i: g.i.flatMap(partirFrases) }));
    (o.li || []).forEach(x => r.libre.push(...partirFrases(x)));
    /* Todas las suboperaciones sueltas van en UN solo bloque de tareas (numeración continua 1) 2) 3)…). */
    let bloqueSubs = null;
    const subs = () => bloqueSubs || (bloqueSubs = r.tareas[r.tareas.push({ h: '', i: [] }) - 1]);
    (o.sb || []).forEach(s => {
      const n = norm(s.d);
      if (/^1\s*-\s*consignas de seguridad/.test(n)) return;           // título, sin texto propio
      if (/^consignas de autocontrol/.test(n)) {                        // texto largo pegado en la suboperación
        partirFrases((s.x || '').replace(/^CONSIGNAS DE AUTOCONTROL\s*/i, '')).forEach(t => r.auto.push(t)); return;
      }
      if (/^gama de tareas/.test(n) || /^gama de tareas/.test(norm(s.x))) {
        subs().i.push(...partirFrases((s.x || s.d).replace(/^GAMA DE TAREAS\s*/i, ''))); return;
      }
      subs().i.push(...partirFrases(textoSub(s)));                    // suboperación suelta = una tarea
    });
    const dupAuto = new Set(); r.auto = r.auto.filter(t => !dupAuto.has(t) && dupAuto.add(t));
    return r;
  }

  /* ════════ Formato de salida ════════ */
  function marca(i, estilo) { return estilo === 'guion' ? '- ' : estilo === 'simbolo' ? '▪ ' + (i + 1) + ') ' : (i + 1) + ') '; }
  function partir(linea, ancho) {                   // líneas largas: continuación con 2 espacios de sangría
    if (!ancho || linea.length <= ancho) return [linea];
    const out = []; let cur = '';
    linea.split(' ').forEach(w => {
      if ((cur + ' ' + w).trim().length > ancho && cur) { out.push(cur); cur = '  ' + w; } else cur = cur ? cur + ' ' + w : w;
    });
    out.push(cur); return out;
  }
  function opcs() {
    return { estilo: $('gsm-estilo').value, ancho: +$('gsm-ancho').value || 0, seg: $('gsm-seg').value, auto: $('gsm-auto').value,
      frec: $('gsm-frec').value, titulo: $('gsm-titulo').checked, vacias: $('gsm-blank').checked };
  }
  /* Rutas "SAP MOBILE": cada paso es una operación (sin texto largo). Se arma una lista agrupada por paquete de mantenimiento. */
  function nombrePaq(pq) {
    return (pq || []).map(p => { const m = /(\d+)\s*mes/i.exec(p), n = m ? +m[1] : 0;
      return ({ 1: 'MENSUAL', 2: 'BIMESTRAL', 3: 'TRIMESTRAL', 4: 'CUATRIMESTRAL', 6: 'SEMESTRAL', 12: 'ANUAL', 24: 'BIENAL' })[n] || p.toUpperCase(); }).join(' + ');
  }
  function pasosDeRuta(k) {
    const ops = HDR_GAMAS[k].o.filter(o => !o.ga && !o.sb && !o.li && o.pq && o.pq.length && !/log[ií]stica/i.test(o.d) && o.t !== undefined);
    const tareas = ops.filter(o => !/^MP |^PD |^IP |^Preventivo /i.test(o.d) || o.t > 0);
    return tareas.length >= 4 ? tareas : [];
  }
  function formatearPasos(o, op) {
    const grupos = new Map();
    o.pasos.forEach(p => { const h = nombrePaq(p.pq); (grupos.get(h) || grupos.set(h, []).get(h)).push(arreglarPegadas(p.d.trim())); });
    const L = [];
    if (op.titulo) L.push('GAMA DE TAREAS - ' + (o.d || '').toUpperCase());
    grupos.forEach((arr, h) => { L.push(h + ':'); arr.forEach((t, i) => L.push(marca(i, op.estilo) + t)); });
    const flat = []; L.forEach(l => partir(l, op.ancho).forEach(x => flat.push(x)));
    return op.vacias ? flat.join('\n\n') : flat.join('\n');
  }
  function formatearOp(o, op) {
    if (o.pasos) return formatearPasos(o, op);
    const e = estructurar(o), L = [];
    let tl = (o.d || '').trim();
    if (e.libre.length && e.libre.join(" ").length < 25) { tl += (/[a-záéíóúñ]$/i.test(tl) && /^[a-záéíóúñ]{1,4}(?![a-záéíóúñ])/.test(e.libre[0]) ? "" : " ") + e.libre.join(" "); e.libre = []; }
    if (op.titulo) L.push('GAMA DE TAREAS - ' + tl.toUpperCase());
    const seccion = (nombre, arr, modo) => {
      if (!arr.length || modo === 'omitir') return;
      if (modo === 'linea') { L.push(nombre + ': ' + arr.map(x => x.replace(/[.;\s]+$/, '')).join('; ') + '.'); return; }
      L.push(nombre + ':'); arr.forEach((t, i) => L.push(marca(i, op.estilo) + t));
    };
    seccion('SEGURIDAD', e.seg, op.seg);
    e.libre.forEach((t, i) => { if (i === 0) L.push('NOTA:'); L.push(t); });
    const bloques = e.tareas.filter(b => {
      if (op.frec === 'todas') return true;
      const f = fcOf(b.h); return !f || f === op.frec;
    });
    bloques.forEach(b => {
      if (!b.i.length) return;
      const h = tituloFrec(b.h);
      L.push((h || 'TAREAS') + ':');
      b.i.forEach((t, i) => L.push(marca(i, op.estilo) + t));
    });
    seccion('AL FINALIZAR', e.auto, op.auto);
    const flat = []; L.forEach(l => partir(l, op.ancho).forEach(x => flat.push(x)));
    return op.vacias ? flat.join('\n\n') : flat.join('\n');
  }
  /* "MENSUAL:" etc. como primera línea de bloque: una línea en blanco antes da aire visual en SAM. */
  function conAire(txt) { return txt.replace(/\n(?=(?:[A-ZÁÉÍÓÚ ]+:$|AL FINALIZAR:|SEGURIDAD:|NOTA:))/gm, '\n\n').replace(/\n{3,}/g, '\n\n'); }

  function frecsDeRuta(k) {
    const s = new Set(); HDR_GAMAS[k].o.forEach(o => (o.ga || []).forEach(g => { const f = fcOf(g.h); if (f) s.add(f); }));
    return FRECS.map(x => x[0]).filter(f => s.has(f));
  }
  function opsConTexto(k) {
    const r = HDR_GAMAS[k].o.filter(o => o.ga || o.sb || o.li);
    const pasos = pasosDeRuta(k);
    if (pasos.length) r.unshift({ n: 'TODOS', d: HDR_GAMAS[k].d, pasos, pq: ['lista de pasos'] });
    return r;
  }

  /* ════════ Diagnóstico: ¿qué hojas de ruta hay que mejorar? ════════
     Mejorar = tiene equipos vinculados (HDR_PLAN) y el texto se ve mal en SAM (texto corrido en suboperaciones,
     renglones cortados, palabras pegadas o frecuencias sin encabezado). Revisar = tiene equipos y la estructura
     ya es aceptable. Sin equipos = ningún plan la usa (baja prioridad). */
  const PRIO = { mejorar: ['Mejorar', 0], revisar: ['Revisar', 1], baja: ['Sin uso', 2], nousar: ['NO USAR', 3] };
  const GLUE = /[a-záéíóúñ]{2,}\.[A-ZÁÉÍÓÚ]|\b(?:de|del|y|en|con|por)(?:drenaje|retorno|condensado|valores|funcionamiento|evaporador|termostato)\b/;
  const noUsar = {};
  if (typeof HDR_DATA !== 'undefined') HDR_DATA.forEach(h => { if (h.noUsar) noUsar[h.ruta + '/' + h.cont] = 1; });
  const hechas = (() => { try { return JSON.parse(localStorage.getItem('gamasSamHechas') || '{}'); } catch (e) { return {}; } })();
  const guardarHechas = () => { try { localStorage.setItem('gamasSamHechas', JSON.stringify(hechas)); } catch (e) { /* sin storage */ } };
  /* Uso real: OTs de 2026 por hoja de ruta (PROG_ANUAL). HDR_PLAN solo no alcanza: es un archivo de planes
     que puede estar desactualizado y dejaba como "sin equipos" hojas que hoy generan OTs. */
  const otPorKey = {};
  if (typeof PROG_ANUAL !== 'undefined') PROG_ANUAL.filas.forEach(r => {
    if (!r[4]) return; const o = otPorKey[r[4]] || (otPorKey[r[4]] = { n: 0, eq: new Set() }); o.n++; o.eq.add(r[1]);
  });
  const diagCache = {};
  function diagnostico(k) {
    if (diagCache[k]) return diagCache[k];
    const h = HDR_GAMAS[k]; let ga = 0, li = 0, sb = 0, pasos = 0, sinEnc = 0, pegs = 0, conTexto = 0;
    h.o.forEach(o => {
      if (/log[ií]stica/i.test(o.d)) return;
      if (o.ga || o.sb || o.li) conTexto++;
      if (o.ga) { ga++; if ((o.pq || []).length > 1 && o.ga.length <= 1 && !o.ga[0].h) sinEnc++; }
      if (o.li) li++; if (o.sb) sb++;
      if (!o.ga && !o.sb && !o.li && o.pq && o.pq.length && o.t > 0) pasos++;
      if (GLUE.test(JSON.stringify([o.ga, o.sb, o.li, o.d]))) pegs++;
    });
    const tipo = pasos >= 4 && conTexto <= 2 ? 'Un paso por operación (SAP Mobile)' : ga && !li && !sb ? 'Texto largo por frecuencia'
      : sb ? 'Suboperaciones con texto corrido' : li ? 'Texto libre con renglones cortados' : pasos ? 'Pasos sueltos como operaciones' : 'Sin texto de tareas';
    const nPlan = (equiposPorKey[k] || []).length, nOt = otPorKey[k] ? otPorKey[k].n : 0, eqOt = otPorKey[k] ? otPorKey[k].eq.size : 0;
    const ne = Math.max(nPlan, eqOt), nu = !!noUsar[k] || /NO USAR/i.test(h.d), motivos = [];
    if (!ne) motivos.push('Sin planes vinculados ni OTs en 2026: candidata a depurar (confirmar en SAP).');
    if (nu) motivos.push('Marcada NO USAR: confirmar y dejarla fuera.');
    if (tipo.startsWith('Sub')) motivos.push('El texto de las tareas está corrido dentro de suboperaciones (SAM lo une sin espacios).');
    if (tipo.startsWith('Texto libre')) motivos.push('Gama en texto libre con renglones cortados: reescribir una tarea por línea.');
    if (sinEnc) motivos.push(`${sinEnc} operación(es) mezclan frecuencias sin encabezado (mensual / trimestral…).`);
    if (pegs) motivos.push(`${pegs} operación(es) con palabras o frases pegadas.`);
    if (tipo.startsWith('Un paso') || tipo.startsWith('Pasos')) motivos.push('Estructura correcta (un paso por operación); verificar que el texto breve (40 caracteres) quede completo.');
    if (tipo.startsWith('Sin texto')) motivos.push('No tiene texto de tareas en el export.');
    const grave = pegs || sinEnc || tipo.startsWith('Sub') || tipo.startsWith('Texto libre');
    const prio = nu ? 'nousar' : !ne ? 'baja' : grave ? 'mejorar' : 'revisar';
    return (diagCache[k] = { prio, tipo, ne, nPlan, nOt, motivos });
  }

  /* ════════ UI ════════ */
  function resumen() {
    const c = { mejorar: 0, revisar: 0, baja: 0, nousar: 0 }; let eq = 0, hec = 0;
    Object.keys(HDR_GAMAS).forEach(k => { const d = diagnostico(k); c[d.prio]++; if (d.prio === 'mejorar') { eq += d.ne; if (hechas[k]) hec++; } });
    $('gsm-resumen').innerHTML = `<b>${c.mejorar}</b> para <b style="color:#b42318">mejorar</b> (${eq} equipos afectados · ${hec} ya marcadas como hechas) · ` +
      `<b>${c.revisar}</b> para revisar · ${c.baja} sin uso (sin planes ni OTs 2026) · ${c.nousar} NO USAR`;
  }
  function listar() {
    const q = norm($('gsm-buscar').value).trim(), f = $('gsm-filtro').value;
    const items = Object.keys(HDR_GAMAS).filter(k => {
      const d = diagnostico(k);
      if (f === 'mejorar' && !(d.prio === 'mejorar' && !hechas[k])) return false;
      if (f === 'aprox' && !(d.prio === 'mejorar' || d.prio === 'revisar')) return false;
      if (['revisar', 'baja', 'nousar'].includes(f) && d.prio !== f) return false;
      if (f === 'hechas' && !hechas[k]) return false;
      if (!q) return true;
      const h = HDR_GAMAS[k];
      return norm(k + ' ' + h.d).includes(q) || (equiposPorKey[k] || []).some(e => norm(e).includes(q));
    }).sort((a, b) => { const da = diagnostico(a), db = diagnostico(b);
      return (hechas[a] ? 1 : 0) - (hechas[b] ? 1 : 0) || PRIO[da.prio][1] - PRIO[db.prio][1] || db.ne - da.ne || a.localeCompare(b, undefined, { numeric: true }); });
    $('gsm-lista').innerHTML = items.map(k => {
      const h = HDR_GAMAS[k], n = opsConTexto(k).length, d = diagnostico(k);
      return `<button class="gsm-item${k === st.key ? ' on' : ''}" data-k="${esc(k)}"><b>${esc(k)} <i class="gsm-tag gsm-${hechas[k] ? 'hecha' : d.prio}">${hechas[k] ? '✓ Hecha' : PRIO[d.prio][0]}</i></b><span>${esc(h.d)}</span>` +
        `<em>${n} oper.${d.ne ? ' · ' + d.ne + ' equipos' : ''}</em></button>`;
    }).join('') || '<div class="gsm-vacio">Sin resultados.</div>';
    $('gsm-lista').querySelectorAll('.gsm-item').forEach(b => b.onclick = () => elegir(b.dataset.k));
    $('gsm-cuenta').textContent = items.length + ' hojas de ruta / contadores';
    resumen();
  }
  function pintarDiag() {
    if (!st.key) { $('gsm-diag').innerHTML = ''; return; }
    const d = diagnostico(st.key), h = !!hechas[st.key];
    $('gsm-diag').innerHTML = `<div class="gsm-diagbox gsm-b-${h ? 'hecha' : d.prio}"><b>${h ? '✓ Marcada como mejorada' : d.prio === 'mejorar' ? '⚠ Hay que mejorarla' : d.prio === 'revisar' ? 'Para revisar' : PRIO[d.prio][0]}</b> · ${esc(d.tipo)}` +
      `${d.ne ? ` · ${d.nPlan} equipos en planes · ${d.nOt} OTs en 2026` : ' · ningún plan ni OT 2026 la usa'}<ul>${d.motivos.map(m => '<li>' + esc(m) + '</li>').join('')}</ul>` +
      `<button class="prog-btn" id="gsm-hecha">${h ? 'Desmarcar' : '✓ Marcar como mejorada en SAP'}</button></div>`;
    $('gsm-hecha').onclick = () => { if (hechas[st.key]) delete hechas[st.key]; else hechas[st.key] = 1; guardarHechas(); listar(); pintarDiag(); };
  }
  function elegir(k) {
    st.key = k; st.sel = null;
    const fs = frecsDeRuta(k);
    $('gsm-frec').innerHTML = '<option value="todas">Todas las frecuencias de la operación</option>' + fs.map(f => `<option value="${f}">Solo ${f.toLowerCase()}</option>`).join('');
    const ops = opsConTexto(k);
    $('gsm-ops').innerHTML = ops.map((o, i) => `<button class="gsm-op" data-i="${i}"><b>${esc(o.n)}</b> ${esc(o.d)}` +
      `${o.pq && o.pq.length ? `<em>${esc(o.pq.join(', '))}</em>` : ''}</button>`).join('');
    $('gsm-ops').querySelectorAll('.gsm-op').forEach(b => b.onclick = () => { st.sel = +b.dataset.i; render(); });
    st.ops = ops; st.sel = 0;
    const eq = equiposPorKey[k] || [];
    $('gsm-eq').innerHTML = eq.length ? 'Equipos con esta hoja de ruta: ' + esc(eq.slice(0, 14).join(', ')) + (eq.length > 14 ? ` … (+${eq.length - 14})` : '') : '';
    listar(); pintarDiag(); render();
  }
  function problemas(txt) {
    const P = [];
    const largas = txt.split('\n').filter(l => l.length > 72).length;
    if (largas) P.push(`${largas} línea(s) superan los 72 caracteres (SAP las parte).`);
    const pegadas = (txt.match(/[a-záéíóú]{2,}\.[A-ZÁÉÍÓÚ]/g) || []).length;
    if (pegadas) P.push(`${pegadas} frase(s) pegadas ("palabra.Otra").`);
    return P;
  }
  function textoActual() {
    if (st.sel == null || !st.ops[st.sel]) return '';
    return conAire(formatearOp(st.ops[st.sel], opcs()));
  }
  function render() {
    $('gsm-ops').querySelectorAll('.gsm-op').forEach((b, i) => b.classList.toggle('on', i === st.sel));
    if (!st.key) { $('gsm-salida').value = ''; return; }
    const txt = textoActual();
    $('gsm-salida').value = txt;
    actualizar();
  }
  function actualizar() {
    const txt = $('gsm-salida').value;
    $('gsm-contador').textContent = txt.length + ' caracteres · ' + (txt ? txt.split('\n').length : 0) + ' líneas';
    const P = problemas(txt);
    $('gsm-alertas').innerHTML = P.length ? P.map(p => `<div class="gsm-warn">⚠ ${esc(p)}</div>`).join('') : (txt ? '<div class="gsm-ok">✓ Sin alertas de formato.</div>' : '');
    /* vista como en SAM: la versión "une renglones" o la normal */
    const join = $('gsm-sim').checked;
    const v = join ? txt.replace(/\n/g, '') : txt;
    $('gsm-vista').innerHTML = esc(v).replace(/\n/g, '<br>') || '<span style="color:#999">Elegí una hoja de ruta</span>';
  }
  async function copiar(txt, btn) {
    try { await navigator.clipboard.writeText(txt); } catch (e) { const t = document.createElement('textarea'); t.value = txt; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
    const old = btn.textContent; btn.textContent = '✓ Copiado'; setTimeout(() => btn.textContent = old, 1400);
  }
  function textoRuta(k, op) {
    return opsConTexto(k).map(o => formatearOp(o, op)).map(conAire).join('\n\n' + '-'.repeat(40) + '\n\n');
  }
  function descargarTodo() {
    const op = opcs(), partes = [];
    Object.keys(HDR_GAMAS).sort().forEach(k => {
      opsConTexto(k).forEach(o => {
        partes.push('=== ' + k + ' · ' + HDR_GAMAS[k].d + ' · op ' + o.n + ' ===\n' + conAire(formatearOp(o, op)));
      });
    });
    const blob = new Blob(['﻿' + partes.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'gamas-para-sam.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  function init() {
    if (!$('gsm-buscar')) return;
    $('gsm-buscar').oninput = listar;
    $('gsm-filtro').onchange = listar;
    ['gsm-estilo', 'gsm-ancho', 'gsm-seg', 'gsm-auto', 'gsm-frec', 'gsm-titulo', 'gsm-blank'].forEach(id => $(id).onchange = render);
    $('gsm-sim').onchange = actualizar;
    $('gsm-salida').oninput = actualizar;
    $('gsm-copiar').onclick = e => copiar($('gsm-salida').value, e.target);
    $('gsm-copiar-ruta').onclick = e => st.key && copiar(textoRuta(st.key, opcs()), e.target);
    $('gsm-descargar').onclick = descargarTodo;
    $('gsm-orig').onclick = () => {
      if (st.sel == null) return;
      const o = st.ops[st.sel];
      const raw = [(o.sb || []).map(s => s.n + ' ' + s.d + '\n' + s.x).join('\n'), (o.ga || []).map(g => g.h + '\n' + g.i.join(' ')).join('\n')].join('\n').trim();
      $('gsm-vista').textContent = raw || '(sin texto)';
    };
    listar();
  }
  init();
  window.gamasSamRender = () => { listar(); };
})();
