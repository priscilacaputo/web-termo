/* ─── Programación de OTs — distribución mensual entre guardias ───
   Reglas fijas de turno (no negociables):
     - Equipos MEQ*        → siempre Turno Noche
     - Equipos Roof Top    → siempre Turno Mañana
     - Equipos AVO*        → siempre Turno Mañana
   Guardias 1 y 2 = Turno Mañana · Guardias 3 y 4 = Turno Noche.

   Dentro de esas reglas, el resto de los equipos (y también los que sí
   tienen regla fija) se reparten entre las guardias del turno que les
   corresponde optimizando estos criterios, en este orden:
     0. Bloque por sector físico chico (solo altura, lista curada): un
        puñado de equipos de altura que están físicamente juntos en un
        sector puntual (p. ej. las 4 UTAs del Comedor de Aeropuertos, ver
        PROG_ALTURA_GRUPOS_SECTOR) van siempre a la misma guardia. Esto NO
        se infiere del campo "Ubicación técnica" de SAP porque ese campo
        suele ser mucho más amplio que un sector real — p. ej. todo el
        Patio de Valijas comparte un único código técnico — y agrupar
        automáticamente por él metería decenas de equipos en una sola
        guardia, rompiendo la equidad. Si el sector ya tenía equipos de
        altura asignados en meses anteriores, el resto hereda esa misma
        guardia en vez de recalcularse.
     1. Cintas de Patio de Valijas (MEQ) que pagan altura: se ordenan por
        su número de secuencia física (el código BF/BC/BFR/VB/GR/TT que
        trae la denominación, p. ej. BF-1301) y se reparten en tramos
        contiguos entre las guardias del turno noche — el corte se elige
        para que la cantidad final quede lo más pareja posible, pero cada
        guardia se lleva un tramo seguido en vez de cintas salteadas, para
        no ir y volver por todo el patio.
     2. Equidad de altura: el resto de los equipos que pagan altura se
        reparten lo más parejo posible entre las guardias del turno (a
        nivel de equipo individual, o de bloque completo cuando aplica la
        regla 0; los bloques más grandes se ubican primero para que el
        resultado final quede parejo).
     4. Equidad de carga total: la cantidad total de OTs también se
        reparte lo más parejo posible entre las guardias del turno.
     5. Cercanía física: a igualdad de equidad, se prioriza agrupar
        equipos de la misma zona/edificio en la misma guardia, para no
        perder tiempo en logística.
   Aire y Mecánicos se reparten cada uno por separado (ver progHandleFile),
   así que la equidad (altura y carga total) se calcula de forma
   independiente para cada gremio, no mezclada.
   Todo queda 100% editable por fila con el desplegable de guardia. */

const PROG_STORAGE_KEY   = 'programacion_ots_v1';
const PROG_GUARDIA_TURNO = { 1: 'mañana', 2: 'mañana', 3: 'noche', 4: 'noche' };
const PROG_POOL_TURNO    = { 'mañana': [1, 2], 'noche': [3, 4], 'libre': [1, 2, 3, 4] };

/* ─── Mangas de Embarque ↔ sus equipos de Aire asociados ────────────
   La guardia que atiende la Manga (MAN*) es la que manda: sus equipos
   de Aire (Roof Top, Split, UTA, acondicionadores) de esa misma manga
   quedan siempre en la misma guardia, para no partir la logística de
   un mismo puente de embarque entre dos guardias distintas. */
const PROG_MANGA_AAC_MAP = {
  'MAN005': ['AAC2114', 'AAC2115', 'AAC2116', 'AAC2117', 'AAC2118'],
  'MAN008': ['AAC2230', 'AAC2231', 'AAC2232', 'AAC2233', 'AAC2236', 'AAC3824', 'AAC3825'],
  'MAN009': ['AAC2239', 'AAC3826', 'AAC3827'],
  'MAN010': ['AAC2238', 'AAC3828', 'AAC3829'],
  'MAN011': ['AAC2146', 'AAC2171', 'AAC2172'],
  'MAN012': ['AAC2147', 'AAC2173', 'AAC2174'],
  'MAN029': ['AAC2144', 'AAC2167', 'AAC2168'],
  'MAN030': ['AAC2145', 'AAC2169', 'AAC2170'],
  'MAN234': ['AAC3820', 'AAC3821', 'AAC9313', 'AAC9314'],
  'MAN235': ['AAC3822', 'AAC3823', 'AAC9315', 'AAC9316'],
};
const PROG_MANGA_LABELS = {
  'MAN005': 'Manga POS N°3',  'MAN234': 'Manga POS N°4',  'MAN235': 'Manga POS N°5',
  'MAN008': 'Manga POS N°6',  'MAN009': 'Manga POS N°7',  'MAN010': 'Manga POS N°8',
  'MAN029': 'Manga POS N°9',  'MAN030': 'Manga POS N°10', 'MAN011': 'Manga POS N°11',
  'MAN012': 'Manga POS N°12',
};
const PROG_AAC_A_MANGA = {};
Object.entries(PROG_MANGA_AAC_MAP).forEach(([man, aacs]) => {
  aacs.forEach(aac => { PROG_AAC_A_MANGA[aac] = man; });
});
function progMangaDeEquipo(equipo) {
  const eq = String(equipo || '').trim().toUpperCase();
  if (PROG_MANGA_AAC_MAP[eq]) return eq;
  return PROG_AAC_A_MANGA[eq] || null;
}

/* ─── Sectores físicos chicos con varios equipos de altura juntos ───────
   Lista curada a mano (no derivada de "Ubicación técnica" de SAP, que es
   demasiado amplia para esto — ver nota en el bloque de reglas arriba).
   Cada entrada agrupa equipos que están realmente en el mismo sector
   puntual y por eso siempre deben quedar en la misma guardia. */
const PROG_ALTURA_GRUPOS_SECTOR = [
  ['AAC4107', 'AAC4108', 'AAC4109', 'AAC4132'], // Comedor de Aeropuertos: 4 UTAs del mismo techo
];
const PROG_EQUIPO_A_GRUPO_SECTOR = {};
PROG_ALTURA_GRUPOS_SECTOR.forEach((grupo, i) => {
  grupo.forEach(eq => { PROG_EQUIPO_A_GRUPO_SECTOR[eq] = i; });
});

/* ─── Número de secuencia física de una cinta de Patio de Valijas (MEQ) ──
   Se extrae del código (BF/BC/BFR/VB/GR/TT/RX...) que trae la
   denominación del equipo (p. ej. "Cinta Equipaje - BF-1301" → 1301): ese
   número marca la posición física de la cinta a lo largo del recorrido,
   así que dos equipos con números consecutivos están físicamente
   seguidos. Se usa para repartir las cintas de altura en tramos
   contiguos entre guardias en vez de salteadas (ver progAsignarPendientes),
   para minimizar los traslados dentro del Patio de Valijas. */
function progNumeroSecuenciaCinta(denominacion) {
  const matches = String(denominacion || '').match(/-(\d+)/g);
  if (!matches || !matches.length) return null;
  return parseInt(matches[matches.length - 1].slice(1), 10);
}
/* Fuerza que la Manga (MAN*) y sus equipos de Aire asociados compartan
   guardia. Manda la guardia fija elegida a mano en el panel de Mangas
   (progState.mangaGuardia, independiente de si ese mes hay o no una OT
   de la Manga en sí); si no hay una fija para esa manga, se usa como
   respaldo la guardia de la fila de la Manga si ese mes sí vino cargada. */
function progSincronizarMangas(items) {
  const porManga = {};
  items.forEach(o => {
    const man = progMangaDeEquipo(o.equipo);
    if (man) (porManga[man] = porManga[man] || []).push(o);
  });
  Object.keys(porManga).forEach(man => {
    const grupo = porManga[man];
    const fija = progState.mangaGuardia && progState.mangaGuardia[man];
    if (fija != null) {
      grupo.forEach(o => { o.guardia = fija; });
      return;
    }
    const manRow = grupo.find(o => o.equipo === man && o.guardia != null);
    if (!manRow) return;
    grupo.forEach(o => { if (o.equipo !== man) o.guardia = manRow.guardia; });
  });
}

let progState  = { mes: '', ots: [], mangaGuardia: {} };
let progSearch = '';
let progFiltroTurno  = '';
let progFiltroRegla  = '';
let progFiltroZona   = '';
let progFiltroAltura = false;

/* ─── Índice global equipo → registro (ubicación, denominación, tipo) ──
   Las demás secciones declaran sus datos con `const NOMBRE_DATA = [...]`
   a nivel de script, lo que NO cuelga la variable de `window` — por eso
   se referencian directamente (con typeof-guard) en vez de window[nombre]. */
let _progEquipoIndex = null;
function progGetEquipoIndex() {
  if (_progEquipoIndex) return _progEquipoIndex;
  const idx = {};
  const sources = [];
  if (typeof AAC_DATA !== 'undefined')         sources.push(AAC_DATA);
  if (typeof MANGAS_DATA !== 'undefined')      sources.push(MANGAS_DATA);
  if (typeof ASCENSORES_DATA !== 'undefined')  sources.push(ASCENSORES_DATA);
  if (typeof ESCALERAS_DATA !== 'undefined')   sources.push(ESCALERAS_DATA);
  if (typeof EXTRACTORES_DATA !== 'undefined') sources.push(EXTRACTORES_DATA);
  if (typeof PERSIANAS_DATA !== 'undefined')   sources.push(PERSIANAS_DATA);
  if (typeof CORTINAS_DATA !== 'undefined')    sources.push(CORTINAS_DATA);
  if (typeof BOMBAS_DATA !== 'undefined')      sources.push(BOMBAS_DATA);
  if (typeof PATIO_DATA !== 'undefined')       sources.push(PATIO_DATA);
  if (typeof PUERTAS_DATA !== 'undefined')     sources.push(PUERTAS_DATA);
  if (typeof ECAS_DATA !== 'undefined')        sources.push(ECAS_DATA);
  if (typeof OTROS_DATA !== 'undefined')       sources.push(OTROS_DATA);

  sources.forEach(arr => {
    if (Array.isArray(arr)) arr.forEach(e => { if (e && e.equipo) idx[e.equipo] = e; });
  });
  _progEquipoIndex = idx;
  return idx;
}

/* ─── Zona / ubicación física ────────────────────────────────────── */
function progZonaFromUbicacion(ubicacion) {
  const u = String(ubicacion || '').toUpperCase();
  if (!u) return 'Sin ubicación';
  if (u.includes('-ED1-')) return 'Ed. I';
  if (u.includes('-ED2-')) return 'Ed. II';
  if (u.includes('-ED3-')) return 'Ed. III';
  if (u.includes('-ED4-')) return 'Ed. IV';
  if (u.includes('-ED5-')) return 'Ed. V';
  if (u.includes('-ED6-')) return 'Ed. VI';
  if (u.includes('-ED7-')) return 'Ed. VII';
  if (u.includes('-LAA-')) return 'LAA / Plataforma';
  if (u.includes('-ESR-')) return 'Ed. Sur / Estación';
  if (u.includes('-TER-')) return 'Terminal';
  return 'General';
}
function progZonaEquipo(equipo, ubicacionFallback) {
  if (String(equipo).toUpperCase().startsWith('AVO')) return 'Flota Vehicular';
  const rec = progGetEquipoIndex()[equipo];
  return progZonaFromUbicacion((rec && rec.ubicacion) || ubicacionFallback || '');
}
/* Ubicación técnica puntual (más fina que la zona/edificio), para agrupar
   dentro de una misma zona a los equipos que además comparten el mismo
   sector físico y así minimizar los traslados de la guardia. */
function progUbicacionTecnicaEquipo(equipo, ubicacionFallback) {
  const rec = progGetEquipoIndex()[String(equipo).toUpperCase()];
  return String((rec && rec.ubicacion) || ubicacionFallback || '').trim().toUpperCase() || 'SIN UBICACIÓN';
}

/* ─── Persistencia ───────────────────────────────────────── */
function progLoad() {
  try {
    const raw = localStorage.getItem(PROG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.ots)) {
        if (!parsed.mangaGuardia) parsed.mangaGuardia = {};
        progState = parsed;
      }
    }
  } catch (e) { /* localStorage corrupto o no disponible: arrancamos vacío */ }
}
function progSave() {
  try { localStorage.setItem(PROG_STORAGE_KEY, JSON.stringify(progState)); }
  catch (e) { progToast('⚠ No se pudo guardar en este navegador.', 'error'); }
}

/* ─── Clasificación por Puesto de trabajo principal (Aire / Mecánicos) ──
   Viene del Excel de SAP: "Auxiliar Termomecánica (AUX_TER)" → Aire,
   "Auxiliar Mecánica (AUX_MEC)" → Mecánicos. OJO: "Termomecánica" contiene
   la subcadena "MEC" (TER-MO-MEC-ánica), así que hay que descartar Aire
   ANTES de buscar "MEC" o todo Aire cae mal clasificado como Mecánicos. */
function progClasificarPuesto(raw) {
  const v = String(raw || '').trim().toUpperCase();
  if (!v) return null;
  if (v.includes('AUX_TER') || v.includes('TERMOMEC')) return 'aire';
  if (v.includes('AUX_MEC') || v.includes('MEC')) return 'mecanico';
  return null;
}

/* ─── Clasificación por regla fija de turno ─────────────────────── */
function progClasificar(equipo, denominacionExcel, tipoExcel) {
  const eq  = String(equipo || '').trim().toUpperCase();
  const rec = progGetEquipoIndex()[eq];
  const denom = String(denominacionExcel || (rec && rec.denominacion) || '').toLowerCase();
  const tipo  = String(tipoExcel || (rec && rec.tipo) || '').toLowerCase();

  if (eq.startsWith('MEQ')) return { regla: 'MEQ', turno: 'noche' };
  if (eq.startsWith('AVO')) return { regla: 'AVO', turno: 'mañana' };

  const esRoofTop = tipo.includes('roof top') || denom.includes('roof top') || (rec && rec.tipo === 'Roof Top');
  if (esRoofTop) return { regla: 'Roof Top', turno: 'mañana' };

  return { regla: null, turno: null };
}

/* ─── Gremio (Aire / Mecánicos), para repartir cada uno por separado ────
   Se usa el Puesto de trabajo principal del Excel (AUX_TER/AUX_MEC) si
   está cargado; si no viene esa columna, se infiere por el equipo: los
   de Aire Acondicionado (AAC, incluidos los Roof Top) los atiende el
   gremio de Aire y el resto (MEQ, mangas, ascensores, escaleras, bombas,
   flota vehicular, etc.) el gremio de Mecánicos. */
function progGrupoEquipo(equipo, puesto, regla) {
  if (puesto === 'aire' || puesto === 'mecanico') return puesto;
  const eq = String(equipo || '').trim().toUpperCase();
  if (eq.startsWith('AAC') || regla === 'Roof Top') return 'aire';
  return 'mecanico';
}

/* ─── Asignación de guardia: equidad de altura + equidad de carga total,
   con cercanía física solo como desempate ──────────────────────────
   Primero se pareja la altura entre las guardias del turno; a igualdad
   de altura, se pareja la cantidad total de OTs (para que ninguna
   guardia quede sobrecargada de OTs de su mismo gremio); recién a
   igualdad de ambas cosas se usa la cercanía (zona/edificio y, dentro
   de la zona, la ubicación técnica puntual) para agrupar el mismo
   sector físico y minimizar los traslados de la guardia. */
function progCompararClaves(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}
function progAsignarPendientes(pendientes, yaAsignados) {
  const totalCount  = { 1: 0, 2: 0, 3: 0, 4: 0 };
  const alturaCount = { 1: 0, 2: 0, 3: 0, 4: 0 };
  const zonaCount   = { 1: {}, 2: {}, 3: {}, 4: {} };
  const ubicCount   = { 1: {}, 2: {}, 3: {}, 4: {} };

  function registrar(o) {
    totalCount[o.guardia]++;
    if (o.esAltura) alturaCount[o.guardia]++;
    zonaCount[o.guardia][o.zona] = (zonaCount[o.guardia][o.zona] || 0) + 1;
    ubicCount[o.guardia][o.ubicacionTecnica] = (ubicCount[o.guardia][o.ubicacionTecnica] || 0) + 1;
  }

  /* Guardia que ya venía atendiendo cada sector físico chico (lista
     curada), de meses anteriores. Si el sector nuevo coincide con uno ya
     asignado, el resto del grupo hereda esa guardia. */
  const guardiaPorGrupoSector = {};
  yaAsignados.forEach(o => {
    registrar(o);
    const grupoId = PROG_EQUIPO_A_GRUPO_SECTOR[o.equipo];
    if (grupoId != null && guardiaPorGrupoSector[grupoId] == null) {
      guardiaPorGrupoSector[grupoId] = o.guardia;
    }
  });

  function mejorGuardiaParaUnidad(items) {
    const pool = PROG_POOL_TURNO[items[0].turno] || PROG_POOL_TURNO.libre;
    const nTotal = items.length;
    let mejorGuardia = pool[0];
    let mejorClave = null;
    pool.forEach(g => {
      const cercaniaZona = zonaCount[g][items[0].zona] || 0;
      const cercaniaUbic = ubicCount[g][items[0].ubicacionTecnica] || 0;
      const clave = [alturaCount[g] + nTotal, totalCount[g] + nTotal, -cercaniaZona, -cercaniaUbic, g];
      if (mejorClave === null || progCompararClaves(clave, mejorClave) < 0) {
        mejorClave = clave;
        mejorGuardia = g;
      }
    });
    return mejorGuardia;
  }

  /* Reparte una lista de cintas YA ORDENADAS por número de secuencia
     física en tramos contiguos entre las guardias del pool, buscando el
     corte que deje la cantidad final de altura lo más pareja posible.
     Con un solo corte por guardia, cada una se lleva un tramo seguido de
     la fila en vez de cintas salteadas. */
  function progRepartirContiguo(itemsOrdenados) {
    const n = itemsOrdenados.length;
    if (!n) return;
    const pool = PROG_POOL_TURNO[itemsOrdenados[0].turno] || PROG_POOL_TURNO.libre;
    const baseline = pool.map(g => alturaCount[g]);
    const target = (baseline.reduce((a, b) => a + b, 0) + n) / pool.length;
    let idx = 0;
    pool.forEach((g, i) => {
      const esUltimo = i === pool.length - 1;
      let cantidad = esUltimo ? (n - idx) : Math.round(target - baseline[i]);
      cantidad = Math.max(0, Math.min(cantidad, n - idx));
      for (let j = 0; j < cantidad; j++) {
        itemsOrdenados[idx].guardia = g;
        registrar(itemsOrdenados[idx]);
        idx++;
      }
    });
  }

  /* Equipos de altura del mismo sector físico chico (lista curada, ver
     PROG_ALTURA_GRUPOS_SECTOR) se tratan como una sola unidad indivisible;
     las cintas de Patio de Valijas (MEQ) con número de secuencia física
     se reparten aparte, en tramos contiguos (progRepartirContiguo); el
     resto de los equipos de altura son unidades de tamaño 1. Los bloques
     de sector se resuelven de mayor a menor tamaño (heurística LPT) para
     que la equidad final entre guardias quede lo más pareja posible: si
     los bloques grandes se dejaran para el final, serían los más
     difíciles de acomodar y desbalancearían el resultado. */
  const gruposSector = {};
  const cintas = [];
  const alturaSueltos = [];
  const noAltura = [];
  pendientes.forEach(o => {
    if (!o.esAltura) { noAltura.push(o); return; }
    const grupoId = PROG_EQUIPO_A_GRUPO_SECTOR[o.equipo];
    if (grupoId != null) {
      (gruposSector[grupoId] = gruposSector[grupoId] || []).push(o);
      return;
    }
    const numSecuencia = String(o.equipo).toUpperCase().startsWith('MEQ')
      ? progNumeroSecuenciaCinta(o.denominacion)
      : null;
    if (numSecuencia != null) {
      o._numSecuencia = numSecuencia;
      cintas.push(o);
    } else {
      alturaSueltos.push(o);
    }
  });

  const bloquesSector = Object.values(gruposSector).sort((a, b) => b.length - a.length);
  bloquesSector.forEach(items => {
    const grupoId = PROG_EQUIPO_A_GRUPO_SECTOR[items[0].equipo];
    const guardia = guardiaPorGrupoSector[grupoId] != null
      ? guardiaPorGrupoSector[grupoId]
      : mejorGuardiaParaUnidad(items);
    items.forEach(o => { o.guardia = guardia; registrar(o); });
  });

  cintas.sort((a, b) => a._numSecuencia - b._numSecuencia);
  progRepartirContiguo(cintas);
  cintas.forEach(o => { delete o._numSecuencia; });

  alturaSueltos.forEach(o => {
    const guardia = mejorGuardiaParaUnidad([o]);
    o.guardia = guardia;
    registrar(o);
  });

  const ordenados = noAltura.sort((a, b) => {
    if (a.zona !== b.zona) return a.zona.localeCompare(b.zona);
    if (a.ubicacionTecnica !== b.ubicacionTecnica) return a.ubicacionTecnica.localeCompare(b.ubicacionTecnica);
    return 0;
  });

  ordenados.forEach(o => {
    const pool = PROG_POOL_TURNO[o.turno] || PROG_POOL_TURNO.libre;
    let mejorGuardia = pool[0];
    let mejorClave = null;
    pool.forEach(g => {
      const cercaniaZona  = zonaCount[g][o.zona] || 0;
      const cercaniaUbic  = ubicCount[g][o.ubicacionTecnica] || 0;
      const clave = [totalCount[g], -cercaniaZona, -cercaniaUbic, g];   // 1° equidad de carga total, 2° cercanía por zona, 3° cercanía por ubicación técnica
      if (mejorClave === null || progCompararClaves(clave, mejorClave) < 0) {
        mejorClave = clave;
        mejorGuardia = g;
      }
    });
    o.guardia = mejorGuardia;
    registrar(o);
  });

  return pendientes;
}

/* ─── Carga de Excel ─────────────────────────────────────── */
function progHandleFile(file) {
  if (typeof XLSX === 'undefined') {
    progToast('❌ La librería para leer Excel no está disponible (revisá tu conexión).', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const wb   = XLSX.read(e.target.result, { type: 'array' });
      const ws   = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

      if (!rows.length) {
        progToast('❌ El archivo está vacío o no tiene filas de datos.', 'error');
        return;
      }

      const ALIASES = {
        'equipo': 'equipo', 'código de equipo': 'equipo', 'codigo de equipo': 'equipo',
        'objeto técnico': 'objeto_tecnico', 'objeto tecnico': 'objeto_tecnico',
        'denominación': 'denominacion', 'denominacion': 'denominacion',
        'denominación de objeto técnico': 'denominacion', 'denominacion de objeto tecnico': 'denominacion',
        'descripción': 'denominacion', 'descripcion': 'denominacion',
        'texto breve de objeto': 'denominacion',
        'tipo': 'tipo', 'clase de equipo': 'tipo',
        'ubicación técnica': 'ubicacion_tecnica', 'ubicacion tecnica': 'ubicacion_tecnica',
        'orden': 'ot_num', 'ot': 'ot_num', 'n° de orden': 'ot_num', 'número de orden': 'ot_num',
        'puesto de trabajo principal': 'puesto_trabajo', 'puesto de trabajo': 'puesto_trabajo',
      };

      const parsedRows = rows.map(row => {
        const obj = {};
        Object.entries(row).forEach(([header, val]) => {
          const key = ALIASES[String(header).trim().toLowerCase()];
          if (key) obj[key] = (val === null || val === undefined) ? '' : String(val).trim();
        });
        /* "Objeto técnico" de SAP suele venir como "Denominación (CÓDIGO)".
           Es la fuente de equipo que pide este formato — tiene prioridad
           sobre una columna "Equipo" suelta si ambas están presentes. */
        if (obj.objeto_tecnico) {
          const codigo = (typeof extractEquipoCode === 'function')
            ? extractEquipoCode(obj.objeto_tecnico)
            : obj.objeto_tecnico.toUpperCase();
          if (codigo) obj.equipo = codigo;
          if (!obj.denominacion && typeof extractEquipoDesc === 'function') {
            const desc = extractEquipoDesc(obj.objeto_tecnico);
            if (desc) obj.denominacion = desc;
          }
        }
        return obj;
      }).filter(o => String(o.equipo || '').trim() !== '');

      if (!parsedRows.length) {
        const found = Object.keys(rows[0] || {}).join(', ');
        progToast(`❌ No encontré la columna "Objeto técnico" ni "Equipo" en el archivo.\nColumnas encontradas: ${found}`, 'error');
        return;
      }

      const idx = progGetEquipoIndex();
      const existingByKey = {};
      progState.ots.forEach(o => { existingByKey[o.equipo + '|' + (o.ot_num || '')] = o; });

      const merged = [];
      const pendientes = [];
      const yaAsignados = [];

      parsedRows.forEach((r, i) => {
        const equipo = String(r.equipo).trim().toUpperCase();
        const otNum = (typeof extractOTNum === 'function' && r.ot_num) ? extractOTNum(r.ot_num) : (r.ot_num || '');
        const key  = equipo + '|' + otNum;
        const prev = existingByKey[key];
        const rec  = idx[equipo];
        const denominacion = r.denominacion || (rec && rec.denominacion) || (prev && prev.denominacion) || '';
        const { regla, turno } = progClasificar(equipo, denominacion, r.tipo);
        const esAltura = (typeof ALTURA_EQUIPOS !== 'undefined') && ALTURA_EQUIPOS.has(equipo);
        const zona = progZonaEquipo(equipo, (rec && rec.ubicacion) || r.ubicacion_tecnica);
        const ubicacionTecnica = progUbicacionTecnicaEquipo(equipo, r.ubicacion_tecnica);
        const puesto = r.puesto_trabajo ? progClasificarPuesto(r.puesto_trabajo) : ((prev && prev.puesto) || null);
        const grupo = progGrupoEquipo(equipo, puesto, regla);

        if (prev) {
          const item = { ...prev, equipo, denominacion, ot_num: otNum, regla, turno, esAltura, zona, ubicacionTecnica, puesto, grupo };
          merged.push(item);
          yaAsignados.push(item);
        } else {
          const item = {
            id: equipo + '#' + i + '#' + Date.now(),
            equipo, denominacion, ot_num: otNum,
            regla, turno, esAltura, zona, ubicacionTecnica, puesto, grupo,
            guardia: null,
          };
          merged.push(item);
          pendientes.push(item);
        }
      });

      /* Se reparte cada gremio por separado: la equidad de altura y la
         cercanía por zona/ubicación técnica se calculan solo contra el
         resto de OTs del mismo gremio (Aire o Mecánicos), no mezcladas,
         para que cada guardia quede pareja dentro de su propia disciplina. */
      ['aire', 'mecanico'].forEach(g => {
        progAsignarPendientes(
          pendientes.filter(o => o.grupo === g),
          yaAsignados.filter(o => o.grupo === g)
        );
      });
      progSincronizarMangas(merged);

      progState.ots = merged;
      if (!progState.mes) progState.mes = document.getElementById('prog-mes-input').value || new Date().toISOString().slice(0, 7);
      progSave();
      renderProgramacion();
      progToast(`✓ ${merged.length} equipos cargados (${pendientes.length} nuevos distribuidos automáticamente).`, 'success');

    } catch (err) {
      progToast(`❌ Error al leer el archivo: ${err.message}`, 'error');
    }
  };
  reader.readAsArrayBuffer(file);
}

/* ─── Filtros ────────────────────────────────────────────── */
function progFiltered() {
  return progState.ots.filter(o => {
    if (progFiltroTurno && o.turno !== progFiltroTurno) return false;
    if (progFiltroRegla === '__sin_regla__' && o.regla) return false;
    if (progFiltroRegla && progFiltroRegla !== '__sin_regla__' && o.regla !== progFiltroRegla) return false;
    if (progFiltroZona && o.zona !== progFiltroZona) return false;
    if (progFiltroAltura && !o.esAltura) return false;
    if (progSearch) {
      const hay = (o.equipo + ' ' + o.denominacion).toLowerCase();
      if (!hay.includes(progSearch)) return false;
    }
    return true;
  });
}

/* ─── Render ─────────────────────────────────────────────── */
function renderProgramacion() {
  const hasData = progState.ots.length > 0;
  document.getElementById('prog-empty-state').classList.toggle('hidden', hasData);
  document.getElementById('prog-toolbar').style.display = hasData ? '' : 'none';
  document.getElementById('prog-stats').style.display = hasData ? '' : 'none';
  document.getElementById('prog-mangas-panel').style.display = hasData ? '' : 'none';

  renderProgFiltroZona();
  renderProgStats();
  renderProgMangasPanel();
  renderProgGuardias();
}

/* ─── Panel: guardia fija por Manga ─────────────────────────────────
   Independiente de si ese mes hay o no una OT de la Manga en sí: al
   elegir acá la guardia de una Manga, se aplica de inmediato a ella y
   a todos sus equipos de Aire asociados que estén cargados este mes. */
function renderProgMangasPanel() {
  const wrap = document.getElementById('prog-mangas-panel');
  if (!wrap) return;
  const mangas = Object.keys(PROG_MANGA_LABELS).sort((a, b) =>
    PROG_MANGA_LABELS[a].localeCompare(PROG_MANGA_LABELS[b], undefined, { numeric: true })
  );
  const opcionesGuardia = selected => [1, 2, 3, 4].map(n =>
    `<option value="${n}" ${n === selected ? 'selected' : ''}>Guardia ${n} (${PROG_GUARDIA_TURNO[n] === 'mañana' ? '☀️ Mañana' : '🌙 Noche'})</option>`
  ).join('');

  wrap.innerHTML = `
    <div class="prog-mangas-header">
      🛬 Guardia fija por Manga
      <span class="prog-mangas-hint">— sus equipos de Aire (Roof Top, Split, UTA) quedan siempre con la misma guardia</span>
    </div>
    <div class="prog-mangas-grid">
      ${mangas.map(man => `
        <div class="prog-manga-row">
          <span class="prog-manga-label">${PROG_MANGA_LABELS[man]}</span>
          <select class="filter-select prog-manga-select" data-man="${man}">
            <option value="">Sin asignar</option>
            ${opcionesGuardia(progState.mangaGuardia[man] || null)}
          </select>
        </div>
      `).join('')}
    </div>
  `;

  wrap.querySelectorAll('.prog-manga-select').forEach(sel => {
    sel.addEventListener('change', function () {
      const man = this.dataset.man;
      if (this.value) progState.mangaGuardia[man] = parseInt(this.value, 10);
      else delete progState.mangaGuardia[man];
      progSincronizarMangas(progState.ots);
      progSave();
      renderProgramacion();
    });
  });
}

function renderProgFiltroZona() {
  const sel = document.getElementById('prog-filter-zona');
  const zonas = [...new Set(progState.ots.map(o => o.zona))].sort();
  const current = sel.value;
  sel.innerHTML = '<option value="">Todas las zonas</option>' +
    zonas.map(z => `<option value="${z}">${z}</option>`).join('');
  if (zonas.includes(current)) sel.value = current;
  else progFiltroZona = '';
}

function renderProgStats() {
  const wrap = document.getElementById('prog-stats');
  if (!progState.ots.length) { wrap.innerHTML = ''; return; }

  const total          = progState.ots.length;
  const manana         = progState.ots.filter(o => o.turno === 'mañana').length;
  const noche          = progState.ots.filter(o => o.turno === 'noche').length;
  const altura         = progState.ots.filter(o => o.esAltura).length;
  const alturaAire      = progState.ots.filter(o => o.esAltura && o.puesto === 'aire').length;
  const alturaMecanico  = progState.ots.filter(o => o.esAltura && o.puesto === 'mecanico').length;

  const cards = [
    { label: 'Total equipos', value: total, icon: '🗓️', color: '#1a56a4' },
    { label: '☀️ Turno mañana', value: manana, icon: '☀️', color: '#d97706' },
    { label: '🌙 Turno noche', value: noche, icon: '🌙', color: '#4338ca' },
    { label: '⛰️ Pagan altura', value: altura, icon: '⛰️', color: '#92400e' },
    { label: '⛰️ Altura Aire', value: alturaAire, icon: '💨', color: '#0369a1' },
    { label: '⛰️ Altura Mecánicos', value: alturaMecanico, icon: '🔧', color: '#b45309' },
  ];

  wrap.innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join('');
}

function progGuardiaLabel(id) {
  return `Guardia ${id}`;
}

function renderProgGuardias() {
  const wrap = document.getElementById('prog-guardias-wrap');
  if (!progState.ots.length) { wrap.innerHTML = ''; return; }

  const filtradas = progFiltered();
  const hayFiltrosActivos = !!(progSearch || progFiltroTurno || progFiltroRegla || progFiltroZona || progFiltroAltura);

  wrap.innerHTML = [1, 2, 3, 4].map(gid => {
    const turno = PROG_GUARDIA_TURNO[gid];
    const items = filtradas.filter(o => o.guardia === gid);
    const aireEnGuardia = items.filter(o => o.grupo === 'aire').length;
    const mecEnGuardia  = items.filter(o => o.grupo === 'mecanico').length;
    const alturaEnGuardia = items.filter(o => o.esAltura).length;
    const alturaAireEnGuardia = items.filter(o => o.esAltura && o.grupo === 'aire').length;
    const alturaMecEnGuardia  = items.filter(o => o.esAltura && o.grupo === 'mecanico').length;

    const rows = items.length
      ? items.map(o => `
          <div class="prog-ot-row">
            <div class="prog-ot-info">
              <span class="prog-ot-equipo">${o.equipo}</span>
              <span class="prog-ot-denom" title="${o.denominacion}">${o.denominacion || '—'}</span>
              <span class="prog-ot-zona">📍 ${o.zona}</span>
            </div>
            ${o.esAltura ? `<span class="prog-altura-badge" title="Paga altura">⛰️</span>` : ''}
            ${o.regla ? `<span class="prog-regla-badge ${o.turno === 'noche' ? 'noche' : 'manana'}">${o.regla === 'MEQ' ? '🌙' : '☀️'} ${o.regla}</span>` : `<span class="prog-regla-badge libre">✏️ Sin regla</span>`}
            <select class="prog-ot-select" data-id="${o.id}">
              ${[1, 2, 3, 4].map(n => `<option value="${n}" ${n === o.guardia ? 'selected' : ''}>Guardia ${n} (${PROG_GUARDIA_TURNO[n] === 'mañana' ? '☀️ Mañana' : '🌙 Noche'})</option>`).join('')}
            </select>
          </div>
        `).join('')
      : `<p class="prog-guardia-empty">Sin equipos asignados${hayFiltrosActivos ? ' (con los filtros actuales)' : ''}.</p>`;

    return `
      <div class="prog-guardia-card">
        <div class="prog-guardia-header">
          <span class="prog-guardia-name">${progGuardiaLabel(gid)}</span>
          <span class="turno-badge ${turno === 'noche' ? 'noche' : 'manana'}">${turno === 'noche' ? '🌙 Noche' : '☀️ Mañana'}</span>
          <span class="prog-guardia-count">${items.length} OT${items.length === 1 ? '' : 's'} (💨 ${aireEnGuardia} aire · 🔧 ${mecEnGuardia} mec)${alturaEnGuardia ? ` · ⛰️ ${alturaEnGuardia} (💨 ${alturaAireEnGuardia} aire · 🔧 ${alturaMecEnGuardia} mec)` : ''}</span>
        </div>
        <div class="prog-guardia-list">${rows}</div>
      </div>
    `;
  }).join('');

  wrap.querySelectorAll('.prog-ot-select').forEach(sel => {
    sel.addEventListener('change', function () {
      const ot = progState.ots.find(o => o.id === this.dataset.id);
      if (ot) {
        ot.guardia = parseInt(this.value, 10);
        progSincronizarMangas(progState.ots);
        progSave();
        renderProgramacion();
      }
    });
  });
}

/* ─── Exportar Excel ─────────────────────────────────────── */
function progExportExcel() {
  if (!progState.ots.length) {
    progToast('No hay datos para exportar.', 'error');
    return;
  }
  if (typeof XLSX === 'undefined') {
    progToast('❌ La librería para exportar Excel no está disponible.', 'error');
    return;
  }
  const rows = [...progState.ots]
    .sort((a, b) => a.guardia - b.guardia || a.equipo.localeCompare(b.equipo))
    .map(o => ({
      'Guardia': progGuardiaLabel(o.guardia),
      'Turno': PROG_GUARDIA_TURNO[o.guardia] === 'noche' ? 'Noche' : 'Mañana',
      'OT': o.ot_num || '',
      'Equipo': o.equipo,
      'Denominación': o.denominacion || '',
      'Zona': o.zona,
      'Paga altura': o.esAltura ? 'Sí' : 'No',
      'Puesto de trabajo': o.puesto === 'aire' ? 'Aire' : (o.puesto === 'mecanico' ? 'Mecánicos' : ''),
      'Regla aplicada': o.regla || 'Sin regla fija',
    }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Programación');
  const mes = progState.mes || new Date().toISOString().slice(0, 7);
  XLSX.writeFile(wb, `Programacion_OTs_${mes}.xlsx`);
}

/* ─── Reset ──────────────────────────────────────────────── */
function progReset() {
  if (!progState.ots.length) return;
  const ok = window.confirm('¿Vaciar la programación actual? Esto borra todas las asignaciones cargadas (no afecta el Excel original).');
  if (!ok) return;
  progState = { mes: document.getElementById('prog-mes-input').value || '', ots: [], mangaGuardia: progState.mangaGuardia || {} };
  progSave();
  renderProgramacion();
}

/* ─── Toast ──────────────────────────────────────────────── */
function progToast(msg, type = 'success') {
  let toast = document.getElementById('admin-toast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'admin-toast'; toast.className = 'admin-toast'; document.body.appendChild(toast); }
  toast.textContent = msg;
  toast.className = `admin-toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ─── Init ───────────────────────────────────────────────── */
(function initProgramacion() {
  progLoad();

  const mesInput = document.getElementById('prog-mes-input');
  mesInput.value = progState.mes || new Date().toISOString().slice(0, 7);
  mesInput.addEventListener('change', function () {
    progState.mes = this.value;
    progSave();
  });

  document.getElementById('prog-upload-btn').addEventListener('click', () => {
    document.getElementById('prog-file-input').click();
  });
  document.getElementById('prog-file-input').addEventListener('change', function () {
    const file = this.files[0];
    this.value = '';
    if (file) progHandleFile(file);
  });

  document.getElementById('prog-export-btn').addEventListener('click', progExportExcel);
  document.getElementById('prog-reset-btn').addEventListener('click', progReset);

  document.getElementById('prog-search').addEventListener('input', function () {
    progSearch = this.value.trim().toLowerCase();
    document.getElementById('prog-clear-search').style.display = progSearch ? 'flex' : 'none';
    renderProgGuardias();
  });
  document.getElementById('prog-clear-search').addEventListener('click', function () {
    progSearch = '';
    document.getElementById('prog-search').value = '';
    this.style.display = 'none';
    renderProgGuardias();
  });
  document.getElementById('prog-filter-turno').addEventListener('change', function () {
    progFiltroTurno = this.value;
    renderProgGuardias();
  });
  document.getElementById('prog-filter-regla').addEventListener('change', function () {
    progFiltroRegla = this.value;
    renderProgGuardias();
  });
  document.getElementById('prog-filter-zona').addEventListener('change', function () {
    progFiltroZona = this.value;
    renderProgGuardias();
  });
  document.getElementById('prog-filter-altura').addEventListener('click', function () {
    progFiltroAltura = !progFiltroAltura;
    this.classList.toggle('active', progFiltroAltura);
    renderProgGuardias();
  });

  renderProgramacion();
})();
