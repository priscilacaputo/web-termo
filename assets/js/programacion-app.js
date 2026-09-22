/* ─── Programación de OTs — planificador inteligente mensual ───────────
   Reparte las OTs del mes entre las 4 guardias (mismo número que la sección
   Personal): 1 Avalos-Barberio · 2 Hasan-Gonzalez · 3 Ramirez-Perez-Lia ·
   4 Villardi-Ortiz.

   Turnos: cada mes 2 guardias están a la mañana y 2 a la noche. Las parejas
   rotan de turno todos los meses, salvo al pasar a noviembre y a diciembre
   (se mantienen como estaban). Ancla: septiembre 2026 → mañana Villardi-Ortiz
   y Ramirez-Perez-Lia, noche Hasan-Gonzalez y Avalos-Barberio. Se puede
   intercambiar a mano cualquier mes (progState.turnosOverride).

   Reglas fijas de turno (no negociables):
     - Equipos MEQ*        → siempre Turno Noche
     - Equipos de Sala VIP → siempre Turno Noche (lista PROG_EQUIPOS_VIP)
     - Equipos Roof Top    → siempre Turno Mañana
     - Equipos AVO*        → siempre Turno Mañana

   Cómo reparte (progAsignarPendientes), cada gremio (Aire / Mecánicos) por
   separado:
     1. Arma BLOQUES que van enteros a una misma guardia:
        · todas las OTs de un mismo equipo;
        · cada sistema de aire completo (condensadora + interiores);
        · cada Manga con sus equipos de Aire;
        · sectores físicos chicos curados (PROG_ALTURA_GRUPOS_SECTOR);
        · equipos del mismo tipo en la MISMA UBICACIÓN TÉCNICA y mismo turno
          (p. ej. los 14 Roof Top del Núcleo de Aire N°1). Si el grupo es muy
          grande para una sola guardia se corta en tramos contiguos por
          número de equipo / secuencia de cinta.
     2. Ubica los bloques de mayor a menor. Para cada uno elige, entre las
        guardias del turno que le corresponde:
        la que menos empeora el balance, combinando (costo ponderado):
          a) equidad de altura (pesa más);
          b) equidad de carga total de OTs;
          c) ROTACIÓN: penalidad si esa guardia ya tuvo esos equipos en los
             últimos meses (historial por mes en progState.historial; el mes
             anterior pesa más) → cada mes los equipos los ven guardias
             distintas y el mantenimiento no queda sesgado;
          d) un poco de cercanía (misma zona / ubicación que lo ya asignado).
   Una re-carga del Excel del MISMO mes conserva lo ya asignado; la guardia
   fija por Manga elegida a mano (panel de Mangas) siempre manda.

   Todo queda 100% editable por fila con el desplegable de guardia (mover un
   equipo de un sistema de aire mueve a todo el sistema). */

const PROG_STORAGE_KEY   = 'programacion_ots_v1';
const PROG_GUARDIAS = { 1: 'Avalos-Barberio', 2: 'Hasan-Gonzalez', 3: 'Ramirez-Perez-Lia', 4: 'Villardi-Ortiz' };
const PROG_TURNO_ANCLA = { mes: '2026-09', 'mañana': [4, 3], 'noche': [1, 2] };
const PROG_MESES_SIN_ROTACION = [11, 12];   // al entrar a estos meses las parejas NO cambian de turno
/* Se recalculan para el mes de programación (progAplicarTurnosMes). */
const PROG_GUARDIA_TURNO = {};
const PROG_POOL_TURNO    = { 'mañana': [], 'noche': [], 'libre': [1, 2, 3, 4] };

const progMesNum = mes => { const [y, m] = String(mes || PROG_TURNO_ANCLA.mes).split('-').map(Number); return y * 12 + (m - 1); };
const progMesStr = n => `${Math.floor(n / 12)}-${String((n % 12) + 1).padStart(2, '0')}`;
/* Turnos automáticos: desde el ancla, cada paso de mes intercambia las parejas,
   salvo el paso que entra a noviembre o a diciembre. */
function progTurnosCalculados(mes) {
  const a = progMesNum(PROG_TURNO_ANCLA.mes), b = progMesNum(mes);
  let cambios = 0;
  for (let n = Math.min(a, b); n < Math.max(a, b); n++) {
    const mesDestino = ((n + 1) % 12) + 1;   // mes (1-12) al que se entra en el paso n → n+1
    if (!PROG_MESES_SIN_ROTACION.includes(mesDestino)) cambios++;
  }
  const m = PROG_TURNO_ANCLA['mañana'], nn = PROG_TURNO_ANCLA['noche'];
  return cambios % 2 ? { 'mañana': nn.slice(), 'noche': m.slice() } : { 'mañana': m.slice(), 'noche': nn.slice() };
}
function progTurnosDelMes(mes, overrides) {
  const ov = overrides && overrides[mes];
  return ov ? { 'mañana': ov['mañana'].slice(), 'noche': ov['noche'].slice() } : progTurnosCalculados(mes);
}
function progAplicarTurnosMes(mes, overrides) {
  const t = progTurnosDelMes(mes, overrides);
  PROG_POOL_TURNO['mañana'] = t['mañana'];
  PROG_POOL_TURNO['noche'] = t['noche'];
  [1, 2, 3, 4].forEach(g => { PROG_GUARDIA_TURNO[g] = t['mañana'].includes(g) ? 'mañana' : 'noche'; });
}
progAplicarTurnosMes(new Date().toISOString().slice(0, 7), {});
/* Meses anteriores a `mes` (el más reciente primero). */
function progMesesAnteriores(mes, n) {
  const b = progMesNum(mes);
  return Array.from({ length: n }, (_, i) => progMesStr(b - 1 - i));
}
/* Guardias en orden de pantalla: primero las de la mañana. */
const progOrdenGuardias = () => [...PROG_POOL_TURNO['mañana'], ...PROG_POOL_TURNO['noche']];
const progOpcionGuardiaTxt = n => `${PROG_GUARDIAS[n]} (${PROG_GUARDIA_TURNO[n] === 'mañana' ? '☀️ Mañana' : '🌙 Noche'})`;

/* ─── Equipos con ubicación en la Sala VIP → siempre Turno Noche ─────
   Lista cerrada pasada por la usuaria (2026-09-22): todos son Splits de
   "Sala Vip (Recepcion)", ubicación técnica AEP-ED5-NIVEL0-UBITEC161.
   Se trabajan de noche para no molestar la operación de la sala. */
const PROG_EQUIPOS_VIP = new Set(['AAC1270', 'AAC1271', 'AAC3473', 'AAC3474', 'AAC3475', 'AAC3476']);

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

/* Todas las OTs de un mismo equipo físico van a la misma guardia.
   Caso típico: las balanzas de check-in traen una OT de la balanza
   ("MP Balanza VanderLande") y otra de la cinta ("MP Cintas balanzas
   VDL 6M") por separado, pero es un solo equipo (mismo código MEQ****)
   y lo atiende una sola guardia, así que no tiene sentido repartir cada
   OT por su lado. Manda, en este orden: la guardia que el equipo ya
   tenía de meses anteriores (guardiaPrev); si no, la guardia de una de
   sus OTs con regla fija de turno; si no, la de la primera OT asignada.
   Se saltean los equipos de Manga, que ya sincroniza
   progSincronizarMangas con su propia lógica, y los grupos que mezclan
   OTs de turnos distintos (no se pueden unir sin romper la regla de
   turno de alguna). */
function progSincronizarEquipos(items, guardiaPrev) {
  const prev = guardiaPrev || {};
  const porEquipo = {};
  items.forEach(o => {
    if (progMangaDeEquipo(o.equipo)) return;
    (porEquipo[o.equipo] = porEquipo[o.equipo] || []).push(o);
  });
  Object.entries(porEquipo).forEach(([equipo, grupo]) => {
    if (grupo.length < 2) return;
    const turnos = new Set(grupo.map(o => o.turno).filter(Boolean));
    if (turnos.size > 1) return;
    const asignadas = grupo.filter(o => o.guardia != null);
    if (!asignadas.length) return;
    let destino = prev[equipo];
    if (destino == null) destino = (asignadas.find(o => o.regla) || asignadas[0]).guardia;
    grupo.forEach(o => { o.guardia = destino; });
  });
}

/* ─── Sistemas de aire (condensadora + interiores) ──────────────────
   AAC_SISTEMAS (aac-sistemas-data.js) agrupa cada unidad exterior/
   condensadora VRF o multi split con sus unidades interiores, deducido
   de la denominación, la ubicación técnica y la secuencia de códigos
   (validado a mano por la usuaria). */
let _progSisIdx = null;
function progSistemaDeEquipo(equipo) {
  if (typeof AAC_SISTEMAS === 'undefined') return null;
  if (!_progSisIdx) {
    _progSisIdx = new Map();
    AAC_SISTEMAS.forEach(s => { _progSisIdx.set(s.cabeza, s); s.miembros.forEach(m => _progSisIdx.set(m, s)); });
  }
  return _progSisIdx.get(String(equipo || '').trim().toUpperCase()) || null;
}
/* Fuerza que todos los equipos de un mismo sistema (condensadora + sus
   interiores) compartan una sola guardia — es un solo paquete de trabajo,
   no OTs independientes. Manda, en este orden:
     1. Si se edita a mano una fila del grupo (forzarDesde = esa fila), esa
        guardia gana siempre — es la intención explícita de la persona.
     2. Si no, la guardia que el sistema ya tenía de meses anteriores
        (guardiaPrev).
     3. Si no, la guardia con más miembros ya asignados este mes (mayoría) —
        converge al resultado del reparto automático en vez de partirlo.
   Se salta si el grupo mezcla OTs de turnos distintos (no debería pasar:
   el aire sin regla fija no tiene turno). */
function progSincronizarSistemasAire(items, guardiaPrev, forzarDesde) {
  const prev = guardiaPrev || {};
  const porSistema = {};
  items.forEach(o => {
    const sis = progSistemaDeEquipo(o.equipo);
    if (sis) (porSistema[sis.id] = porSistema[sis.id] || []).push(o);
  });
  Object.entries(porSistema).forEach(([sisId, grupo]) => {
    if (grupo.length < 2) return;
    const turnos = new Set(grupo.map(o => o.turno).filter(Boolean));
    if (turnos.size > 1) return;
    let destino = (forzarDesde && grupo.includes(forzarDesde) && forzarDesde.guardia != null) ? forzarDesde.guardia : null;
    if (destino == null) destino = prev[sisId];
    if (destino == null) {
      const cuenta = {};
      grupo.forEach(o => { if (o.guardia != null) cuenta[o.guardia] = (cuenta[o.guardia] || 0) + 1; });
      const entradas = Object.entries(cuenta);
      if (!entradas.length) return;
      destino = +entradas.sort((a, b) => b[1] - a[1])[0][0];
    }
    grupo.forEach(o => { o.guardia = destino; });
  });
}

/* Reparte Aire y después Mecánicos. La Manga (MAN*, gremio Mecánicos) toma la guardia
   que le tocó a sus equipos de Aire: el bloque de Aire es el que tiene regla de turno
   (Roof Top → mañana), así que manda él. */
function progRepartirGremios(pendientes, yaAsignados) {
  progAsignarPendientes(pendientes.filter(o => o.grupo === 'aire'), yaAsignados.filter(o => o.grupo === 'aire'));
  const extra = {};
  [...yaAsignados, ...pendientes].forEach(o => {
    const man = progMangaDeEquipo(o.equipo);
    if (man && o.grupo === 'aire' && o.guardia != null && extra['man:' + man] == null) extra['man:' + man] = o.guardia;
  });
  progAsignarPendientes(pendientes.filter(o => o.grupo !== 'aire'), yaAsignados.filter(o => o.grupo !== 'aire'), extra);
}

/* Vuelve a repartir TODAS las OTs cargadas con el motor actual (turnos del mes,
   altura, ubicación técnica, sistemas completos y rotación). Se pierden los
   cambios hechos a mano; la guardia fija de las Mangas se respeta. */
function progReprogramar(sinPreguntar) {
  if (!progState.ots.length) { progToast('Primero cargá el Excel del mes.', 'error'); return; }
  if (!sinPreguntar && !confirm('¿Volver a repartir todas las OTs del mes? Se pierden los cambios hechos a mano (la guardia fija de las Mangas se respeta).')) return;
  progAplicarTurnosMes(progState.mes, progState.turnosOverride);
  progState.ots.forEach(o => { o.guardia = null; });
  progRepartirGremios(progState.ots, []);
  progSincronizarMangas(progState.ots);
  progSincronizarEquipos(progState.ots, {});
  progSincronizarSistemasAire(progState.ots, {});
  progState.otsMes = progState.mes;
  progSave();
  renderProgramacion();
  progToast('🔄 Mes reprogramado: altura pareja, por ubicación técnica, sistemas completos y rotando guardias.', 'success');
}

let progState  = { mes: '', otsMes: '', ots: [], mangaGuardia: {}, hidrolavado: false, historial: {}, turnosOverride: {} };
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
        if (typeof parsed.hidrolavado !== 'boolean') parsed.hidrolavado = false;
        if (!parsed.historial) parsed.historial = {};
        if (!parsed.turnosOverride) parsed.turnosOverride = {};
        if (!parsed.otsMes && parsed.ots.length) parsed.otsMes = parsed.mes || '';
        progAplicarTurnosMes(parsed.mes || new Date().toISOString().slice(0, 7), parsed.turnosOverride);
        progMigrarReglaVIP(parsed.ots);
        if (!parsed.opsOT) parsed.opsOT = {};
        progState = parsed;
      }
    }
  } catch (e) { /* localStorage corrupto o no disponible: arrancamos vacío */ }
}
/* Programaciones guardadas antes de la regla Sala VIP: se reclasifican y,
   si quedaron en una guardia de mañana, pasan a la guardia de noche con
   menos OTs de su gremio (todas las OTs de un mismo equipo juntas). */
function progMigrarReglaVIP(ots) {
  const destinoPorEquipo = {};
  ots.forEach(o => {
    if (!PROG_EQUIPOS_VIP.has(String(o.equipo || '').toUpperCase())) return;
    o.regla = 'Sala VIP'; o.turno = 'noche';
    if (o.guardia == null || PROG_POOL_TURNO.noche.includes(o.guardia)) return;
    let g = destinoPorEquipo[o.equipo];
    if (g == null) {
      const carga = n => ots.filter(x => x.guardia === n && x.grupo === o.grupo).length;
      g = PROG_POOL_TURNO.noche.reduce((a, b) => carga(b) < carga(a) ? b : a);
      destinoPorEquipo[o.equipo] = g;
    }
    o.guardia = g;
  });
}
/* Foto del reparto del mes en el historial (equipo → guardia): es lo que usa la
   rotación para no repetir la misma guardia en los meses siguientes. */
function progSnapshotHistorial(mes) {
  if (!mes || !progState.ots.length) return;
  const snap = {};
  progState.ots.forEach(o => { if (o.guardia != null) snap[o.equipo] = o.guardia; });
  (progState.historial = progState.historial || {})[mes] = snap;
}
function progSave() {
  progSnapshotHistorial(progState.otsMes);
  try { localStorage.setItem(PROG_STORAGE_KEY, JSON.stringify(progState)); }
  catch (e) { progToast('⚠ No se pudo guardar en este navegador.', 'error'); }
}

/* ─── ¿El equipo paga altura este mes? ─────────────────────────────
   Base: estar en ALTURA_EQUIPOS (lista completa del Excel de altura).
   Excepción: los Roof Top sin manga de ALTURA_HIDROLAVADO sólo pagan
   altura cuando está activado el botón "Hidrolavados ON"; con el botón
   apagado (default) NO cuentan como altura. */
function progEsAltura(equipo) {
  const eq = String(equipo || '').trim().toUpperCase();
  if (typeof ALTURA_EQUIPOS === 'undefined' || !ALTURA_EQUIPOS.has(eq)) return false;
  if (!progState.hidrolavado
      && typeof ALTURA_HIDROLAVADO !== 'undefined'
      && ALTURA_HIDROLAVADO.has(eq)) return false;
  return true;
}

/* Activa/desactiva el modo Hidrolavados y recalcula el flag de altura de
   todas las OTs ya cargadas (badges y stats). No re-reparte las guardias
   para no pisar los ajustes manuales: si querés redistribuir con el
   cambio, volvé a cargar el Excel del mes con el botón en el estado
   deseado. */
function progSetHidrolavado(on) {
  progState.hidrolavado = !!on;
  progState.ots.forEach(o => { o.esAltura = progEsAltura(o.equipo); });
  progSave();
  progRenderHidroToggle();
  renderProgramacion();
}
function progRenderHidroToggle() {
  const btn = document.getElementById('prog-hidro-toggle');
  if (!btn) return;
  const on = !!progState.hidrolavado;
  btn.classList.toggle('active', on);
  btn.textContent = on ? '💦 Hidrolavados ON' : '💦 Hidrolavados OFF';
  btn.title = on
    ? 'Los Roof Top sin manga cuentan como altura (se está hidrolavando)'
    : 'Los Roof Top sin manga NO cuentan como altura (activar si se hidrolava)';
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

  if (PROG_EQUIPOS_VIP.has(eq)) return { regla: 'Sala VIP', turno: 'noche' };
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
function progAsignarPendientes(pendientes, yaAsignados, fijasExtra) {
  if (!pendientes.length) return pendientes;
  const total = { 1: 0, 2: 0, 3: 0, 4: 0 };
  const altura = { 1: 0, 2: 0, 3: 0, 4: 0 };
  const zonaCount = { 1: {}, 2: {}, 3: {}, 4: {} };
  const ubicCount = { 1: {}, 2: {}, 3: {}, 4: {} };
  const sisEq = { 1: 0, 2: 0, 3: 0, 4: 0 };                 // equipos de sistemas de aire por guardia
  const sisIds = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set() };   // sistemas por guardia
  const registrar = o => {
    const sis = progSistemaDeEquipo(o.equipo);
    if (sis) { sisEq[o.guardia]++; sisIds[o.guardia].add(sis.id); }
    total[o.guardia]++;
    if (o.esAltura) altura[o.guardia]++;
    zonaCount[o.guardia][o.zona] = (zonaCount[o.guardia][o.zona] || 0) + 1;
    ubicCount[o.guardia][o.ubicacionTecnica] = (ubicCount[o.guardia][o.ubicacionTecnica] || 0) + 1;
  };
  const poolDe = o => PROG_POOL_TURNO[o.turno] || PROG_POOL_TURNO.libre;
  /* Vínculos que obligan a ir juntos: equipo, sistema de aire, Manga, sector curado. */
  const claves = o => {
    const k = ['eq:' + o.equipo];
    const sis = progSistemaDeEquipo(o.equipo); if (sis) k.push('sis:' + sis.id);
    const man = progMangaDeEquipo(o.equipo); if (man) k.push('man:' + man);
    const sec = PROG_EQUIPO_A_GRUPO_SECTOR[o.equipo]; if (sec != null) k.push('sec:' + sec);
    return k;
  };

  /* Continuidad dentro del mismo mes (re-carga) y guardia fija de Mangas. */
  const fija = {};
  yaAsignados.forEach(o => {
    if (o.guardia == null) return;
    registrar(o);
    claves(o).forEach(k => { if (fija[k] == null) fija[k] = o.guardia; });
  });
  Object.entries(progState.mangaGuardia || {}).forEach(([man, g]) => { fija['man:' + man] = g; });
  Object.entries(fijasExtra || {}).forEach(([k, g]) => { if (fija[k] == null) fija[k] = g; });

  /* ── 1) Bloques (union-find) ── */
  const parent = pendientes.map((_, i) => i);
  const find = i => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const unir = (a, b) => { a = find(a); b = find(b); if (a !== b) parent[b] = a; };
  const porClave = {};
  pendientes.forEach((o, i) => claves(o).forEach(k => {
    if (porClave[k] != null) unir(porClave[k], i); else porClave[k] = i;
  }));
  /* Misma ubicación técnica + mismo tipo + mismo turno → misma guardia (p. ej. los Roof
     Top del Núcleo N°1). Los grupos más grandes que lo que le toca a una guardia se
     cortan en tramos contiguos (número de equipo / secuencia de cinta). */
  const idx = progGetEquipoIndex();
  const tipoDe = o => (idx[o.equipo] && idx[o.equipo].tipo) || String(o.equipo).replace(/\d.*$/, '');
  const poolKey = o => poolDe(o).join('');
  const nPorPool = {};
  pendientes.forEach(o => { nPorPool[poolKey(o)] = (nPorPool[poolKey(o)] || 0) + 1; });
  const numDe = o => {
    const sq = String(o.equipo).startsWith('MEQ') ? progNumeroSecuenciaCinta(o.denominacion) : null;
    return sq != null ? sq : (parseInt(String(o.equipo).replace(/^\D+/, ''), 10) || 0);
  };
  const gruposUbic = {};
  pendientes.forEach((o, i) => {
    const u = o.ubicacionTecnica;
    if (!u || u === 'SIN UBICACIÓN' || !u.includes('-')) return;
    /* los de una Manga o un sistema de aire ya van con su Manga / sistema: si además se
       agruparan por ubicación, se encadenarían todas las mangas (comparten la ubicación
       de Plataforma) o varios sistemas en un solo bloque gigante */
    if (progMangaDeEquipo(o.equipo) || progSistemaDeEquipo(o.equipo)) return;
    const k = [o.turno || 'libre', tipoDe(o), u].join('|');
    (gruposUbic[k] = gruposUbic[k] || []).push(i);
  });
  Object.values(gruposUbic).forEach(ids => {
    if (ids.length < 2) return;
    const o0 = pendientes[ids[0]];
    /* tope: medio "cupo" de una guardia, entre 8 y 25 equipos (entra un núcleo de aire
       entero, pero un tramo de cintas del patio no se come el reparto de altura) */
    const cap = Math.max(8, Math.min(25, Math.ceil((nPorPool[poolKey(o0)] || 0) / (poolDe(o0).length * 2))));
    /* si el grupo paga altura, tramos más cortos para poder emparejar la altura */
    const capGrupo = ids.some(i => pendientes[i].esAltura) ? Math.min(cap, 16) : cap;   // 16: entra un núcleo de aire entero aunque pague altura (hidrolavado)
    ids.sort((a, b) => numDe(pendientes[a]) - numDe(pendientes[b]));
    const tramos = Math.ceil(ids.length / capGrupo);
    const tam = Math.ceil(ids.length / tramos);
    for (let t = 0; t < tramos; t++) {
      const tramo = ids.slice(t * tam, (t + 1) * tam);
      tramo.forEach(i => unir(tramo[0], i));
    }
  });
  const porRaiz = {};
  pendientes.forEach((o, i) => { (porRaiz[find(i)] = porRaiz[find(i)] || []).push(o); });
  const bloques = [];
  Object.values(porRaiz).forEach(items => {
    let pool = [1, 2, 3, 4];
    items.forEach(o => { const p = poolDe(o); pool = pool.filter(g => p.includes(g)); });
    if (pool.length) { bloques.push({ items, pool }); return; }
    /* el bloque mezcla turnos incompatibles: se separa por turno (la regla de turno manda) */
    const porT = {};
    items.forEach(o => { (porT[o.turno || 'libre'] = porT[o.turno || 'libre'] || []).push(o); });
    Object.values(porT).forEach(its => bloques.push({ items: its, pool: poolDe(its[0]) }));
  });

  /* ── 2) Rotación: cuántas veces tuvo cada guardia estos equipos en los últimos meses ── */
  const hist = progState.historial || {};
  const meses = progMesesAnteriores(progState.mes, 6);
  const PESO = [8, 4, 2, 1, 1, 1];
  const repeticion = (items, g) => {
    let p = 0;
    items.forEach(o => meses.forEach((m, k) => { if (hist[m] && hist[m][o.equipo] === g) p += PESO[k]; }));
    return p / items.length;
  };

  /* ── 3) Ubicar bloques de mayor a menor ── */
  bloques.forEach(b => {
    b.n = b.items.length;
    b.alt = b.items.filter(o => o.esAltura).length;
    b.sisIds = [...new Set(b.items.map(o => { const x = progSistemaDeEquipo(o.equipo); return x && x.id; }).filter(Boolean))];
    b.sisEq = b.items.filter(o => progSistemaDeEquipo(o.equipo)).length;
  });
  /* Primero los sistemas de aire (de mayor a menor): se reparten buscando la misma
     cantidad de sistemas y de equipos de sistema por guardia. Después el resto de los
     bloques, que emparejan la carga total y la altura alrededor de ellos. */
  bloques.sort((a, b) => (!!b.sisEq - !!a.sisEq) || (b.sisEq - a.sisEq) || (b.n - a.n) || (b.alt - a.alt));
  bloques.forEach(b => {
    let g = null;
    for (const o of b.items) {
      for (const k of claves(o)) if (fija[k] != null && b.pool.includes(fija[k])) { g = fija[k]; break; }
      if (g != null) break;
    }
    if (g == null) {
      /* Costo de poner el bloque en la guardia x = cuánto empeora el balance (carga ya
         asignada × tamaño del bloque, con la altura pesando más) + penalidad por repetir
         la guardia de meses anteriores − un poco de cercanía. Así un bloque grande no
         cae en una guardia ya cargada solo porque "le toca" por un único criterio. */
      const o0 = b.items[0];
      const costoSistema = x =>
        sisEq[x] * b.sisEq                     // equipos de sistema parejos
        + 4 * sisIds[x].size * b.sisIds.length // cantidad de sistemas pareja
        + 0.8 * repeticion(b.items, x) * b.sisEq;   // rotar respecto de meses anteriores
      const costo = b.sisEq ? costoSistema : x => {
        const prox = Math.min(10, (zonaCount[x][o0.zona] || 0) + 0.5 * (ubicCount[x][o0.ubicacionTecnica] || 0));
        return 6 * altura[x] * b.alt          // a) altura pareja
          + total[x] * b.n                     // b) carga pareja
          + repeticion(b.items, x) * b.n       // c) rotar respecto de meses anteriores
          - 0.2 * prox * b.n;                  // d) cercanía
      };
      g = b.pool.slice().sort((x, y) => (costo(x) - costo(y)) || (total[x] - total[y]) || (x - y))[0];
    }
    b.items.forEach(o => { o.guardia = g; registrar(o); claves(o).forEach(k => { if (fija[k] == null) fija[k] = g; }); });
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
        'descripción del objeto técnico': 'denominacion', 'descripcion del objeto tecnico': 'denominacion',
        'tipo': 'tipo', 'clase de equipo': 'tipo',
        'ubicación técnica': 'ubicacion_tecnica', 'ubicacion tecnica': 'ubicacion_tecnica',
        'orden': 'ot_num', 'ot': 'ot_num', 'n° de orden': 'ot_num', 'número de orden': 'ot_num',
        'texto breve': 'texto_ot', 'texto breve de la orden': 'texto_ot', 'texto breve orden': 'texto_ot',
        'hoja de ruta para mantenimiento': 'hoja_ruta', 'posición mantenim.': 'pos', 'posicion mantenim.': 'pos',
        'posición de mantenimiento': 'pos', 'fecha de inicio': 'fecha_inicio', 'inicio extremo': 'fecha_inicio',
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
        /* export de Fiori: la columna "Descripción" es un sí/no, no la denominación */
        if (/^(true|false|verdadero|falso)$/i.test(obj.denominacion || '')) delete obj.denominacion;
        if (!obj.denominacion && obj.objeto_tecnico && typeof extractEquipoDesc === 'function') obj.denominacion = extractEquipoDesc(obj.objeto_tecnico);
        /* export de Fiori: "Orden" viene como "Texto de la OT (número)" */
        if (!obj.texto_ot && /\(\d+\)\s*$/.test(obj.ot_num || '') && typeof extractOTName === 'function') obj.texto_ot = extractOTName(obj.ot_num);
        /* "Hoja de ruta para mantenimiento": "MP Roof Top ... (A/AACS5AEP/1)" → AACS5AEP/1 */
        const mHR = String(obj.hoja_ruta || '').match(/\((?:[A-Z]\/)?([A-Z0-9]+)\/(\w+)\)\s*$/i);
        obj.hr = mHR ? `${mHR[1].toUpperCase()}/${mHR[2]}` : '';
        const mPos = String(obj.pos || '').match(/(\d+)\)?\s*$/);
        obj.posNum = mPos ? mPos[1] : '';
        return obj;
      }).filter(o => String(o.equipo || '').trim() !== '');

      if (!parsedRows.length) {
        const found = Object.keys(rows[0] || {}).join(', ');
        progToast(`❌ No encontré la columna "Objeto técnico" ni "Equipo" en el archivo.\nColumnas encontradas: ${found}`, 'error');
        return;
      }

      const idx = progGetEquipoIndex();
      /* Mes a programar y sus turnos. Lo ya asignado sólo se reusa si es del MISMO
         mes (re-carga del Excel); si es de otro mes queda en el historial y se usa
         para rotar. */
      const mesPrevio = progState.otsMes || progState.mes;
      progState.mes = document.getElementById('prog-mes-input').value || progState.mes || new Date().toISOString().slice(0, 7);
      progAplicarTurnosMes(progState.mes, progState.turnosOverride);
      const mismoMes = !progState.ots.length || mesPrevio === progState.mes;
      if (!mismoMes) progSnapshotHistorial(mesPrevio);
      const existingByKey = {};
      if (mismoMes) progState.ots.forEach(o => { existingByKey[o.equipo + '|' + (o.ot_num || '')] = o; });

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
        const esAltura = progEsAltura(equipo);
        const zona = progZonaEquipo(equipo, (rec && rec.ubicacion) || r.ubicacion_tecnica);
        const ubicacionTecnica = progUbicacionTecnicaEquipo(equipo, r.ubicacion_tecnica);
        const puesto = r.puesto_trabajo ? progClasificarPuesto(r.puesto_trabajo) : ((prev && prev.puesto) || null);
        const grupo = progGrupoEquipo(equipo, puesto, regla);

        /* Si la guardia que traía ya no respeta su regla de turno (p. ej.
           una regla nueva como Sala VIP), se vuelve a repartir. */
        const guardiaValida = prev && (prev.guardia == null || !turno || PROG_POOL_TURNO[turno].includes(prev.guardia));
        if (prev && guardiaValida) {
          const item = { ...prev, equipo, denominacion, ot_num: otNum, textoOT: r.texto_ot || prev.textoOT || '', hr: r.hr || prev.hr || '', pos: r.posNum || prev.pos || '', fechaInicio: r.fecha_inicio || prev.fechaInicio || '', regla, turno, esAltura, zona, ubicacionTecnica, puesto, grupo };
          merged.push(item);
          yaAsignados.push(item);
        } else if (prev) {
          const item = { ...prev, equipo, denominacion, ot_num: otNum, textoOT: r.texto_ot || prev.textoOT || '', hr: r.hr || prev.hr || '', pos: r.posNum || prev.pos || '', fechaInicio: r.fecha_inicio || prev.fechaInicio || '', regla, turno, esAltura, zona, ubicacionTecnica, puesto, grupo, guardia: null };
          merged.push(item);
          pendientes.push(item);
        } else {
          const item = {
            id: equipo + '#' + i + '#' + Date.now(),
            equipo, denominacion, ot_num: otNum, textoOT: r.texto_ot || '', hr: r.hr || '', pos: r.posNum || '', fechaInicio: r.fecha_inicio || '',
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
      progRepartirGremios(pendientes, yaAsignados);
      progSincronizarMangas(merged);

      /* Une las OTs de un mismo equipo en una sola guardia (p. ej. la OT
         de la balanza y la de la cinta de una misma balanza de check-in).
         Prioriza la guardia que el equipo ya tenía cargada de antes. */
      const guardiaPrevPorEquipo = {};
      yaAsignados.forEach(o => {
        if (o.guardia != null && guardiaPrevPorEquipo[o.equipo] == null) {
          guardiaPrevPorEquipo[o.equipo] = o.guardia;
        }
      });
      progSincronizarEquipos(merged, guardiaPrevPorEquipo);

      /* Idem para los sistemas de aire (condensadora + interiores). */
      const guardiaPrevPorSistema = {};
      yaAsignados.forEach(o => {
        const sis = progSistemaDeEquipo(o.equipo);
        if (sis && o.guardia != null && guardiaPrevPorSistema[sis.id] == null) {
          guardiaPrevPorSistema[sis.id] = o.guardia;
        }
      });
      progSincronizarSistemasAire(merged, guardiaPrevPorSistema);

      progState.ots = merged;
      progState.otsMes = progState.mes;
      progCalcGamas();
      progSave();
      renderProgramacion();
      progToast(`✓ ${merged.length} equipos cargados (${pendientes.length} distribuidos automáticamente: altura pareja, por ubicación técnica, sistemas completos y rotando guardias respecto de meses anteriores).`, 'success');

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
/* Panel de turnos del mes: qué guardias están a la mañana / noche, con opción de
   intercambiarlas a mano para ese mes. */
const PROG_MES_NOMBRE = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const progMesLegible = mes => { const [y, m] = String(mes).split('-').map(Number); return `${PROG_MES_NOMBRE[m - 1]} ${y}`; };
function progIntercambiarTurnos() {
  const mes = progState.mes;
  const t = progTurnosDelMes(mes, progState.turnosOverride);
  const nuevo = { 'mañana': t['noche'], 'noche': t['mañana'] };
  const auto = progTurnosCalculados(mes);
  progState.turnosOverride = progState.turnosOverride || {};
  if (nuevo['mañana'].slice().sort().join() === auto['mañana'].slice().sort().join()) delete progState.turnosOverride[mes];
  else progState.turnosOverride[mes] = nuevo;
  progAplicarTurnosMes(mes, progState.turnosOverride);
  progSave();
  if (progState.ots.length && progState.otsMes === mes && confirm('¿Reprogramar las OTs del mes con los turnos nuevos? (las reglas fijas de turno cambian de guardia)')) progReprogramar(true);
  else renderProgramacion();
}
function renderProgTurnosPanel() {
  const wrap = document.getElementById('prog-turnos-panel');
  if (!wrap) return;
  const mes = progState.mes || new Date().toISOString().slice(0, 7);
  const manual = !!(progState.turnosOverride && progState.turnosOverride[mes]);
  const nombres = arr => arr.map(g => `<b>${PROG_GUARDIAS[g]}</b>`).join(' · ');
  const meses = Object.keys(progState.historial || {}).filter(m => m < mes).sort().slice(-3);
  const fueraDeTurno = progState.ots.filter(o => o.guardia != null && o.turno && !PROG_POOL_TURNO[o.turno].includes(o.guardia)).length;
  wrap.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;font-size:13px">
      <span style="font-weight:800">Turnos de ${progMesLegible(mes)}</span>
      <span class="turno-badge manana">☀️ Mañana</span><span>${nombres(PROG_POOL_TURNO['mañana'])}</span>
      <span class="turno-badge noche">🌙 Noche</span><span>${nombres(PROG_POOL_TURNO['noche'])}</span>
      ${manual ? '<span class="prog-regla-badge libre" title="Cambiado a mano para este mes">✏️ a mano</span>' : ''}
      <button class="prog-btn" style="margin-left:auto" onclick="progIntercambiarTurnos()">⇄ Intercambiar turnos este mes</button>
    </div>
    ${fueraDeTurno ? `<div style="margin-top:8px;padding:8px 10px;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;font-size:12.5px">
      ⚠ <b>${fueraDeTurno} OTs quedaron en una guardia que no respeta su regla de turno</b> (programación armada con los turnos anteriores o turnos cambiados).
      <button class="prog-btn" style="margin-left:8px" onclick="progReprogramar(false)">🔄 Reprogramar mes</button></div>` : ''}
    <div style="font-size:11.5px;color:var(--color-muted);margin-top:6px">
      Las parejas rotan de turno cada mes, salvo al pasar a noviembre y a diciembre (se mantienen).
      ${meses.length ? `🔄 Rotación: se evita repetir la guardia que tuvo cada equipo en ${meses.join(', ')}.` : '🔄 Rotación: todavía no hay meses anteriores guardados; desde el próximo mes cada equipo va rotando de guardia.'}
    </div>`;
}

function renderProgramacion() {
  if (progState.ots.some(o => o.gama === undefined || o.gamaDudosa === undefined)) progCalcGamas();
  renderProgTurnosPanel();
  const hasData = progState.ots.length > 0;
  document.getElementById('prog-empty-state').classList.toggle('hidden', hasData);
  document.getElementById('prog-toolbar').style.display = hasData ? '' : 'none';
  document.getElementById('prog-stats').style.display = hasData ? '' : 'none';
  document.getElementById('prog-mangas-panel').style.display = hasData ? '' : 'none';

  renderProgFiltroZona();
  renderProgStats();
  renderProgMangasPanel();
  renderProgGuardias();
  renderProgResumenSistemas();
  renderProgResumenAltura();
  renderProgResumenAdicionales();
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
  const opcionesGuardia = selected => progOrdenGuardias().map(n =>
    `<option value="${n}" ${n === selected ? 'selected' : ''}>${progOpcionGuardiaTxt(n)}</option>`
  ).join('');

  wrap.innerHTML = `
    <div class="prog-mangas-header">
      🛬 Guardia fija por Manga (opcional)
      <span class="prog-mangas-hint">— la Manga y sus equipos de Aire van siempre juntos. Si la dejás "Sin asignar", rota de guardia cada mes como el resto</span>
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
      progSincronizarSistemasAire(progState.ots);
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
  const alturaAire      = progState.ots.filter(o => o.esAltura && o.grupo === 'aire').length;
  const alturaMecanico  = progState.ots.filter(o => o.esAltura && o.grupo === 'mecanico').length;
  const sistemasEsteMes = new Set(
    progState.ots.map(o => { const s = progSistemaDeEquipo(o.equipo); return s && s.id; }).filter(Boolean)
  ).size;

  const cards = [
    { label: 'Total equipos', value: total, icon: '🗓️', color: '#1a56a4' },
    { label: '☀️ Turno mañana', value: manana, icon: '☀️', color: '#d97706' },
    { label: '🌙 Turno noche', value: noche, icon: '🌙', color: '#4338ca' },
    { label: '⛰️ Pagan altura', value: altura, icon: '⛰️', color: '#92400e' },
    { label: '⛰️ Altura Aire', value: alturaAire, icon: '💨', color: '#0369a1' },
    { label: '⛰️ Altura Mecánicos', value: alturaMecanico, icon: '🔧', color: '#b45309' },
    { label: '🔗 Sistemas de aire (paquete)', value: sistemasEsteMes, icon: '🔗', color: '#6366f1' },
    { label: `📅 Gama segura${progState.ots.some(o => o.gamaDudosa || !o.gama) ? ' · ' + progState.ots.filter(o => o.gamaDudosa || !o.gama).length + ' a confirmar' : ''}`, value: `${progState.ots.filter(o => o.gama && !o.gamaDudosa).length} / ${total}`, icon: '📅', color: '#8b5cf6' },
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
  return PROG_GUARDIAS[id] || `Guardia ${id}`;
}

function renderProgGuardias() {
  const wrap = document.getElementById('prog-guardias-wrap');
  if (!progState.ots.length) { wrap.innerHTML = ''; return; }

  const filtradas = progFiltered();
  /* Para el badge 🔗: cuántos equipos del mismo sistema hay cargados este
     mes (no solo en esta guardia), para avisar si alguno quedó fuera. */
  const sisMiembrosEsteMes = {};
  progState.ots.forEach(o => {
    const sis = progSistemaDeEquipo(o.equipo);
    if (sis) (sisMiembrosEsteMes[sis.id] = sisMiembrosEsteMes[sis.id] || new Set()).add(o.equipo);
  });
  const hayFiltrosActivos = !!(progSearch || progFiltroTurno || progFiltroRegla || progFiltroZona || progFiltroAltura);

  const mesOts = progState.otsMes || progState.mes;
  const mesAnt = progMesesAnteriores(mesOts, 1)[0];
  const histAnt = (mesOts === progState.mes && (progState.historial || {})[mesAnt]) || {};
  wrap.innerHTML = progOrdenGuardias().map(gid => {
    const turno = PROG_GUARDIA_TURNO[gid];
    /* rotación: equipos que esta guardia ya tuvo el mes anterior */
    const repiten = filtradas.filter(o => o.guardia === gid && histAnt[o.equipo] === gid).length;
    const items = filtradas.filter(o => o.guardia === gid);
    const aireEnGuardia = items.filter(o => o.grupo === 'aire').length;
    const mecEnGuardia  = items.filter(o => o.grupo === 'mecanico').length;
    const alturaEnGuardia = items.filter(o => o.esAltura).length;
    const alturaAireEnGuardia = items.filter(o => o.esAltura && o.grupo === 'aire').length;
    const alturaMecEnGuardia  = items.filter(o => o.esAltura && o.grupo === 'mecanico').length;
    const sisEnGuardia = new Set(items.map(o => { const s = progSistemaDeEquipo(o.equipo); return s && s.id; }).filter(Boolean));
    const eqSisEnGuardia = items.filter(o => progSistemaDeEquipo(o.equipo)).length;

    const rows = items.length
      ? items.map(o => `
          <div class="prog-ot-row">
            <div class="prog-ot-info">
              <span class="prog-ot-equipo">${o.equipo}</span>
              <span class="prog-ot-denom" title="${o.denominacion}">${o.denominacion || '—'}</span>
              <span class="prog-ot-zona">📍 ${o.zona}</span>
            </div>
            ${progGamaBadge(o)}
            ${o.esAltura ? `<span class="prog-altura-badge" title="Paga altura">⛰️</span>` : ''}
            ${(() => {
              const sis = progSistemaDeEquipo(o.equipo);
              if (!sis) return '';
              const cargados = sisMiembrosEsteMes[sis.id] ? sisMiembrosEsteMes[sis.id].size : 1;
              const faltan = sis.miembros.length + 1 - cargados;   // +1 por la condensadora
              const tit = `Sistema ${sis.cabeza} (${sis.nombre}) — va siempre junto a los otros ${cargados - 1} equipo${cargados - 1 === 1 ? '' : 's'} de este sistema cargados este mes` + (faltan > 0 ? `. Ojo: ${faltan} equipo${faltan === 1 ? '' : 's'} del sistema no está en el Excel de este mes.` : '.');
              return `<span class="prog-regla-badge ${faltan > 0 ? 'libre' : 'manana'}" title="${tit}">🔗 ${faltan > 0 ? 'Sistema incompleto' : 'Sistema'}</span>`;
            })()}
            ${o.regla ? `<span class="prog-regla-badge ${o.turno === 'noche' ? 'noche' : 'manana'}">${o.turno === 'noche' ? '🌙' : '☀️'} ${o.regla}</span>` : `<span class="prog-regla-badge libre">✏️ Sin regla</span>`}
            <select class="prog-ot-select" data-id="${o.id}">
              ${progOrdenGuardias().map(n => `<option value="${n}" ${n === o.guardia ? 'selected' : ''}>${progOpcionGuardiaTxt(n)}</option>`).join('')}
            </select>
          </div>
        `).join('')
      : `<p class="prog-guardia-empty">Sin equipos asignados${hayFiltrosActivos ? ' (con los filtros actuales)' : ''}.</p>`;

    return `
      <div class="prog-guardia-card">
        <div class="prog-guardia-header">
          <span class="prog-guardia-name">${progGuardiaLabel(gid)}</span>
          <span class="turno-badge ${turno === 'noche' ? 'noche' : 'manana'}">${turno === 'noche' ? '🌙 Noche' : '☀️ Mañana'}</span>
          <span class="prog-guardia-count"><b>${items.length} OT${items.length === 1 ? '' : 's'}</b>: 💨 ${aireEnGuardia} aire · 🔧 ${mecEnGuardia} mec${alturaEnGuardia ? ` &nbsp;|&nbsp; ⛰️ <b>${alturaEnGuardia}</b> altura: 💨 ${alturaAireEnGuardia} · 🔧 ${alturaMecEnGuardia}` : ''}${sisEnGuardia.size ? ` &nbsp;|&nbsp; 🔗 ${sisEnGuardia.size} sistema${sisEnGuardia.size === 1 ? '' : 's'} (${eqSisEnGuardia} eq.)` : ''}${Object.keys(histAnt).length ? ` &nbsp;|&nbsp; <span title="Equipos que esta guardia ya tuvo en ${progMesLegible(mesAnt)}">🔄 ${repiten} repiten de ${progMesLegible(mesAnt)}</span>` : ''}</span>
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
        progSincronizarSistemasAire(progState.ots, null, ot);
        progSave();
        renderProgramacion();
      }
    });
  });
}

/* ─── Gama de tareas de cada OT (mensual / trimestral / semestral / anual…) ───
   SAP arma cada OT preventiva con las operaciones del paquete que vence en esa
   toma, y el texto de cada operación dice la frecuencia ("MP Trimestral Roof
   Top…"). El texto de la OT en cambio es el del plan ("MP 1M-3M-1A Roof Top"),
   que no dice cuál toca. Por eso, en orden de confianza:
     1. Operaciones de la OT: primero lo que se haya cargado a mano este mes
        (progState.opsOT, botón "Actualizar operaciones"); si no, el maestro
        OPS_SAP_POR_ORDEN (ops-por-orden-data.js) — la MISMA "lista de
        operaciones" (IW49) que ya usa Auditoría SAP para OPS_SAP_RESUMEN.
        SAP crea las OTs preventivas con antelación, así que la mayoría de
        las OTs de los próximos meses YA están ahí con su Nº de orden real:
        no hace falta pedirle el archivo de nuevo a la usuaria (2026-09-22).
        La mayor frecuencia de sus operaciones es la gama; las menores van
        en "incluye".
     2. Hoja de ruta de la OT (columna "Hoja de ruta para mantenimiento" del
        export de órdenes): si todas sus operaciones son de UN paquete, esa es
        la gama (GAMA_HR, gama-ciclos-data.js).
     3. Hoja de ruta de varios paquetes: punto del ciclo del plan deducido del
        historial (GAMA_POS) + fecha de la OT → paquete que vence en esa toma.
     4. Texto de la OT, si nombra una sola frecuencia.
     5. Periodicidad real del plan del equipo (PLANES_SAP), si es una sola.
   Medido sobre 2.162 OTs del IW49: 86% una sola frecuencia, 9% varias, 5% sin
   frecuencia en el texto. Medido con un export real de octubre-2026 (495 OTs):
   382 (77%) resueltas por match directo de Nº de orden en OPS_SAP_POR_ORDEN,
   467 (94%) sumando la hoja de ruta — sin cargar nada aparte. */
const PROG_FRECUENCIAS = [
  ['Semanal', /semanal|\b7\s*d(ias|ías)?\b/],
  ['Quincenal', /quincenal|\b15\s*d(ias|ías)?\b/],
  ['Mensual', /mensual|(^|[^0-9])1\s*m\b/],
  ['Bimestral', /bimestral|(^|[^0-9])2\s*m\b/],
  ['Trimestral', /trimestral|(^|[^0-9])3\s*m\b/],
  ['Cuatrimestral', /cuatrimestral|(^|[^0-9])4\s*m\b/],
  ['Semestral', /semestral|(^|[^0-9])6\s*m\b/],
  ['Anual', /anual|(^|[^0-9])1\s*a\b|(^|[^0-9])12\s*m\b/],
  ['Bianual', /bianual|(^|[^0-9])2\s*a\b/],
];
const PROG_FREC_COLOR = { Semanal: '#0ea5e9', Quincenal: '#06b6d4', Mensual: '#10b981', Bimestral: '#84cc16', Trimestral: '#f59e0b', Cuatrimestral: '#f97316', Semestral: '#ef4444', Anual: '#8b5cf6', Bianual: '#6d28d9' };
function progFrecuenciasDeTexto(t) {
  const x = String(t || '').toLowerCase();
  const out = PROG_FRECUENCIAS.filter(([, rx]) => rx.test(x)).map(([k]) => k);
  /* "bianual" también matchea "anual": si está bianual, sacar anual */
  return out.includes('Bianual') ? out.filter(k => k !== 'Anual') : out;
}
const progNormOT = v => String(v == null ? '' : v).replace(/\D/g, '').replace(/^0+/, '');
const PROG_CICLO_NOMBRE = { 1: 'Diaria', 7: 'Semanal', 14: 'Quincenal', 15: 'Quincenal', 30: 'Mensual', 60: 'Bimestral', 90: 'Trimestral', 120: 'Cuatrimestral', 180: 'Semestral', 360: 'Anual', 720: 'Bianual', 1080: 'Cada 3 años', 1440: 'Cada 4 años', 1800: 'Cada 5 años' };
const progCicloNombre = d => PROG_CICLO_NOMBRE[d] || `Cada ${d} días`;
/* Fecha de la OT desde el Excel: serial de Excel, ISO o dd/mm/aaaa. */
function progParseFecha(v) {
  const t = String(v == null ? '' : v).trim();
  if (!t) return null;
  if (/^\d+(\.\d+)?$/.test(t) && +t > 30000) return new Date(Math.round((+t - 25569) * 86400000));
  let m = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  m = t.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})/);
  if (m) return new Date(+m[3] < 100 ? 2000 + +m[3] : +m[3], +m[2] - 1, +m[1]);
  const d = new Date(t);
  return isNaN(d) ? null : d;
}
/* Gama por hoja de ruta: segura si la hoja de ruta tiene un solo paquete; si tiene varios,
   se deduce con el punto del ciclo del plan (historial) y la fecha de la OT. */
function progGamaPorHojaDeRuta(o) {
  if (typeof GAMA_HR === 'undefined' || !o.hr) return null;
  const cyc = GAMA_HR[o.hr];
  if (!cyc || !cyc.length) return null;
  if (cyc.length === 1) return { gama: progCicloNombre(cyc[0]), incluye: [], fuente: `hoja de ruta ${o.hr} (un solo paquete)` };
  const mixto = cyc.map(progCicloNombre).join('-');
  const P = (typeof GAMA_POS !== 'undefined' && o.pos) ? GAMA_POS[o.pos] : null;
  const f = progParseFecha(o.fechaInicio);
  if (P && P[4] === o.hr && f && cyc.every(c => c % 30 === 0)) {
    const [offs, base, nRef, fRef] = P;
    const r = progParseFecha(fRef);
    const meses = (f.getFullYear() - r.getFullYear()) * 12 + (f.getMonth() - r.getMonth()) + (f.getDate() - r.getDate()) / 30;
    const n = nRef + Math.round(meses / base);
    /* con cada punto del ciclo que el historial deja posible, qué paquete vence en la toma n */
    const mayores = new Set([].concat(offs).map(off => {
      const vence = cyc.map(c => c / 30).filter(c => (base * n + off) % c === 0);
      return vence.length ? Math.max(...vence) : 0;
    }));
    if (mayores.size === 1 && !mayores.has(0)) {
      return { gama: progCicloNombre([...mayores][0] * 30), incluye: [], fuente: `ciclo del plan (hoja de ruta ${mixto}, toma ${n}, deducido del historial)` };
    }
  }
  return { gama: null, incluye: [], mixto, fuente: `hoja de ruta de varios paquetes (${mixto}) y SAP todavía no le asignó operaciones: revisar en SAP o cargar un export de operaciones más nuevo` };
}
function progGamaDe(o) {
  const orden = PROG_FRECUENCIAS.map(([k]) => k);
  const armar = (fs, fuente) => {
    const lista = [...new Set(fs)].sort((a, b) => orden.indexOf(a) - orden.indexOf(b));
    return { gama: lista[lista.length - 1], incluye: lista.slice(0, -1), fuente };
  };
  /* Operaciones reales de esta OT: primero lo que se haya cargado a mano este mes (más fresco),
     si no, el maestro OPS_SAP_POR_ORDEN — la misma "lista de operaciones" (IW49) que ya carga
     Auditoría SAP. SAP crea las OTs preventivas con antelación, así que la mayoría de las OTs de
     los próximos meses ya están ahí: no hace falta volver a pedirle el archivo a la usuaria. */
  const key = progNormOT(o.ot_num);
  const ops = (progState.opsOT || {})[key] || (typeof OPS_SAP_POR_ORDEN !== 'undefined' ? OPS_SAP_POR_ORDEN[key] : null);
  if (ops && ops.length) {
    const fs = ops.flatMap(progFrecuenciasDeTexto);
    if (fs.length) return armar(fs, 'operaciones de la OT (SAP · IW49)');
  }
  const porHR = progGamaPorHojaDeRuta(o);
  if (porHR && porHR.gama) return porHR;
  const ft = [...new Set(progFrecuenciasDeTexto(o.textoOT))];
  if (ft.length === 1 && !porHR) return armar(ft, 'texto de la OT');
  const pl = (typeof PLANES_SAP !== 'undefined' ? PLANES_SAP : []).filter(p => p.equipo === o.equipo && p.realBucket && orden.includes(p.realBucket));
  const bs = [...new Set(pl.map(p => p.realBucket))];
  if (bs.length === 1) return { gama: bs[0], incluye: [], dudosa: ft.length > 1, fuente: 'periodicidad real del plan (IP24)' + (ft.length > 1 ? ` · el plan combina ${ft.join('-')}: esta OT puede ser de un paquete mayor, confirmá con las operaciones` : '') };
  if (porHR) return porHR;
  if (ft.length > 1) return { gama: null, incluye: [], fuente: `plan mixto (${ft.join('-')}) y SAP todavía no le asignó operaciones: revisar en SAP o cargar un export de operaciones más nuevo` };
  return { gama: null, incluye: [], fuente: 'sin dato: ni el texto de la OT ni el plan dicen la frecuencia; SAP todavía no le asignó operaciones' };
}
function progCalcGamas() {
  progState.ots.forEach(o => { const g = progGamaDe(o); o.gama = g.gama; o.gamaIncluye = g.incluye; o.gamaFuente = g.fuente; o.gamaDudosa = !!g.dudosa; });
}
function progGamaBadge(o) {
  if (!o.gama) return `<span class="prog-regla-badge libre" title="${String(o.gamaFuente || '').replace(/"/g, '&quot;')}">📅 ¿gama?</span>`;
  const c = PROG_FREC_COLOR[o.gama] || '#64748b';
  const tit = `Gama ${o.gama}${o.gamaIncluye && o.gamaIncluye.length ? ' (incluye ' + o.gamaIncluye.join(', ') + ')' : ''} — según ${o.gamaFuente}`;
  return `<span class="prog-regla-badge" style="background:${c}1f;color:${c};border:1px ${o.gamaDudosa ? 'dashed' : 'solid'} ${c}${o.gamaDudosa ? '' : '55'}" title="${tit.replace(/"/g, '&quot;')}">📅 ${o.gama}${o.gamaIncluye && o.gamaIncluye.length ? ' +' : ''}${o.gamaDudosa ? '?' : ''}</span>`;
}
/* Botón "Actualizar operaciones" (opcional): normalmente no hace falta — OPS_SAP_POR_ORDEN
   (gama-ciclos-data.js / ops-por-orden-data.js) ya trae las operaciones de casi todas las OTs,
   porque SAP las crea con antelación. Sirve solo si una OT es tan nueva que SAP recién le asignó
   la orden y todavía no está en ese maestro: acá se pega un export fresco de "lista de
   operaciones" (IW49 / IW37N, columnas Orden + Texto breve operación) y se prioriza sobre el
   maestro para las OTs de este mes. */
function progHandleOps(file) {
  if (typeof XLSX === 'undefined') { progToast('❌ La librería para leer Excel no está disponible.', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const wb = XLSX.read(e.target.result, { type: 'array' });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
      const hs = Object.keys(rows[0] || {});
      const norm = h => String(h).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const cOrden = hs.find(h => norm(h) === 'orden');
      const cTexto = hs.find(h => /texto breve operacion|descripcion operacion|texto breve op/.test(norm(h))) || hs.find(h => norm(h) === 'texto breve');
      if (!cOrden || !cTexto) { progToast('❌ No encontré las columnas "Orden" y "Texto breve operación".\nColumnas: ' + hs.join(', '), 'error'); return; }
      const cargadas = new Set(progState.ots.map(o => progNormOT(o.ot_num)).filter(Boolean));
      const mapa = {};
      rows.forEach(r => {
        const k = progNormOT(r[cOrden]);
        if (!k || (cargadas.size && !cargadas.has(k))) return;
        (mapa[k] = mapa[k] || []).push(String(r[cTexto] || '').trim());
      });
      progState.opsOT = Object.assign({}, progState.opsOT || {}, mapa);
      progCalcGamas();
      progSave();
      renderProgramacion();
      const con = progState.ots.filter(o => o.gama && !o.gamaDudosa).length;
      progToast(`✓ Operaciones de ${Object.keys(mapa).length} OTs leídas. Gama segura en ${con} de ${progState.ots.length} OTs.`, 'success');
    } catch (err) {
      progToast('❌ Error al leer el archivo: ' + err.message, 'error');
    }
  };
  reader.readAsArrayBuffer(file);
}

/* Mantenimiento básico de una OT = el paquete de MENOR frecuencia de su hoja de ruta (o del
   texto del plan). Si la gama de la OT es mayor, esa toma agrega tareas adicionales. */
function progBasicoDe(o) {
  if (typeof GAMA_HR !== 'undefined' && o.hr && GAMA_HR[o.hr] && GAMA_HR[o.hr].length) return progCicloNombre(Math.min(...GAMA_HR[o.hr]));
  const orden = PROG_FRECUENCIAS.map(([k]) => k);
  const fs = [...new Set(progFrecuenciasDeTexto(o.textoOT))].sort((a, b) => orden.indexOf(a) - orden.indexOf(b));
  return fs[0] || null;
}
/* '' si es el básico o no se sabe; si no, "Trimestral (además del Mensual)". */
function progAdicionalDe(o) {
  const b = progBasicoDe(o);
  if (!o.gama || !b || o.gama === b) return '';
  return `${o.gama} (además del ${b})`;
}
/* Texto corto de periodicidad para listas: "Trimestral ➕ sobre Mensual", "Mensual", "a confirmar". */
function progPeriodicidadTxt(o) {
  if (!o.gama) return 'periodicidad a confirmar';
  const b = progBasicoDe(o);
  const extra = b && o.gama !== b ? ` ➕ se agregan las tareas ${o.gama.toLowerCase()}${progPluralTareas(o.gama)} además del mantenimiento ${b.toLowerCase()}` : '';
  return `${o.gama}${o.gamaDudosa ? ' (a confirmar)' : ''}${extra}`;
}
function progPeriodicidadCorta(o) {
  return o.gama ? o.gama + (o.gamaDudosa ? ' (a confirmar)' : '') : 'periodicidad a confirmar';
}
function progPluralTareas(g) {
  /* "tareas trimestrales", "tareas anuales", "tareas semestrales" … */
  const x = String(g || '').toLowerCase();
  return /l$/.test(x) ? 'es' : 's';
}

/* ─── Resumen de sistemas de aire por guardia (para mandar por mail) ───
   Al final de la página: qué sistemas (condensadora + interiores) le tocaron
   a cada guardia este mes. Botón para copiar el texto y otro que abre el
   programa de correo con el resumen cargado (el envío lo hace la persona). */
function progResumenSistemas() {
  const idx = progGetEquipoIndex();
  const porGuardia = {};
  const vistos = {};
  progState.ots.forEach(o => {
    const sis = progSistemaDeEquipo(o.equipo);
    if (!sis || o.guardia == null) return;
    const k = o.guardia + '|' + sis.id;
    if (!vistos[k]) {
      vistos[k] = { sis, equipos: new Set(), ots: [] };
      (porGuardia[o.guardia] = porGuardia[o.guardia] || []).push(vistos[k]);
    }
    vistos[k].equipos.add(o.equipo);
    vistos[k].ots.push(o);
  });
  return progOrdenGuardias().map(g => ({
    g,
    turno: PROG_GUARDIA_TURNO[g],
    sistemas: (porGuardia[g] || []).map(x => {
      const rec = idx[x.sis.cabeza] || {};
      return {
        cabeza: x.sis.cabeza, nombre: x.sis.nombre, sector: rec.sector || '',
        cargados: x.equipos.size, total: x.sis.miembros.length + 1,
        interiores: x.sis.miembros.filter(m => x.equipos.has(m)),
        periodicidad: progPeriodicidadSistema(x.ots),
      };
    }).sort((a, b) => a.sector.localeCompare(b.sector) || a.cabeza.localeCompare(b.cabeza, 'es', { numeric: true })),
  }));
}
/* Periodicidad de un sistema: gama(s) de sus OTs y, si alguna es más que el básico, en qué
   equipos se agregan tareas adicionales. → { txt, extras:[{gama, basico, equipos}] } */
function progPeriodicidadSistema(ots) {
  const porGama = {};
  const extras = {};
  ots.forEach(o => {
    const g = o.gama ? o.gama + (o.gamaDudosa ? ' (a confirmar)' : '') : 'a confirmar';
    porGama[g] = (porGama[g] || 0) + 1;
    const b = progBasicoDe(o);
    if (o.gama && b && o.gama !== b) {
      const k = o.gama + '|' + b;
      (extras[k] = extras[k] || { gama: o.gama, basico: b, equipos: [] }).equipos.push(o.equipo);
    }
  });
  const partes = Object.entries(porGama).map(([g, n]) => Object.keys(porGama).length > 1 ? `${g} (${n})` : g);
  return { txt: partes.join(' · '), extras: Object.values(extras) };
}
function progExtraTxt(e) {
  return `➕ se agregan las tareas ${e.gama.toLowerCase()}${progPluralTareas(e.gama)} además del mantenimiento ${e.basico.toLowerCase()} en ${e.equipos.join(', ')}`;
}
function progResumenTexto() {
  const mes = progMesLegible(progState.otsMes || progState.mes);
  const lineas = [`Programación de OTs — ${mes}`, 'Sistemas de aire (condensadora + interiores) asignados por guardia:', ''];
  progResumenSistemas().forEach(r => {
    lineas.push(`${PROG_GUARDIAS[r.g].toUpperCase()} — Turno ${r.turno === 'mañana' ? 'Mañana' : 'Noche'} (${r.sistemas.length} sistema${r.sistemas.length === 1 ? '' : 's'})`);
    if (!r.sistemas.length) lineas.push('  · Sin sistemas de aire este mes');
    r.sistemas.forEach(x => {
      lineas.push(`  · ${x.cabeza} ${x.nombre}${x.sector ? ' — ' + x.sector : ''} — ${x.cargados} equipo${x.cargados === 1 ? '' : 's'}${x.cargados < x.total ? ` (de ${x.total}; el resto no tiene OT este mes)` : ''}`);
      lineas.push(`      Periodicidad: ${x.periodicidad.txt}`);
      x.periodicidad.extras.forEach(e => lineas.push(`      ${progExtraTxt(e)}`));
      if (x.interiores.length) lineas.push(`      Interiores: ${x.interiores.join(', ')}`);
    });
    lineas.push('');
  });
  lineas.push('Cada sistema se mantiene completo (condensadora e interiores) por la misma guardia.');
  return lineas.join('\n');
}
function progCopiarFallback(txt, ok) {
  const ta = document.createElement('textarea');
  ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); ok(); } catch (e) { progToast('No se pudo copiar: seleccioná el texto a mano.', 'error'); }
  ta.remove();
}
function progCopiarResumen() { progCopiarTexto(progResumenTexto(), '📋 Resumen copiado: pegalo en el mail.'); }
function progMailResumen() {
  const mes = progMesLegible(progState.otsMes || progState.mes);
  const asunto = encodeURIComponent(`Sistemas de aire por guardia — ${mes}`);
  let cuerpo = progResumenTexto();
  /* los programas de correo cortan los links muy largos: si no entra, se copia y se abre el mail para pegarlo */
  if (encodeURIComponent(cuerpo).length > 1800) {
    progCopiarResumen();
    cuerpo = 'Pegá acá el resumen (ya está copiado al portapapeles).';
  }
  window.location.href = `mailto:?subject=${asunto}&body=${encodeURIComponent(cuerpo)}`;
}
function renderProgResumenSistemas() {
  const wrap = document.getElementById('prog-resumen-sistemas');
  if (!wrap) return;
  const res = progState.ots.length ? progResumenSistemas() : [];
  const nSis = res.reduce((t, r) => t + r.sistemas.length, 0);
  if (!nSis) { wrap.innerHTML = ''; return; }
  const esc = t => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  wrap.innerHTML = `
    <div class="table-card" style="margin-top:20px">
      <div style="padding:14px 16px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;border-bottom:1px solid var(--color-border)">
        <div style="flex:1;min-width:240px">
          <div style="font-weight:800;font-size:14px">❄️ Resumen: sistemas de aire por guardia · ${esc(progMesLegible(progState.otsMes || progState.mes))}</div>
          <div style="font-size:12px;color:var(--color-muted)">Qué sistemas (condensadora + interiores) le toca mantener a cada guardia este mes. Listo para mandar por mail.</div>
        </div>
        <button class="prog-btn" onclick="progCopiarResumen()">📋 Copiar resumen</button>
        <button class="prog-btn prog-btn-primary" onclick="progMailResumen()">✉ Abrir en el mail</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;padding:14px 16px">
        ${res.map(r => `
          <div style="border:1px solid var(--color-border);border-radius:10px;padding:10px 12px">
            <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:6px">
              <b style="font-size:13.5px;color:var(--color-primary);white-space:nowrap">${esc(PROG_GUARDIAS[r.g])}</b>
              <span class="turno-badge ${r.turno === 'noche' ? 'noche' : 'manana'}">${r.turno === 'noche' ? '🌙 Noche' : '☀️ Mañana'}</span>
              <span style="margin-left:auto;font-size:12px;color:var(--color-muted);font-weight:700">${r.sistemas.length} sistema${r.sistemas.length === 1 ? '' : 's'}</span>
            </div>
            ${r.sistemas.length ? r.sistemas.map(x => `
              <div style="font-size:12.5px;padding:5px 0;border-top:1px solid var(--color-surface)">
                <span class="equipo-tag" style="background:#6366f1">${esc(x.cabeza)}</span> <b>${esc(x.nombre)}</b>
                <div style="color:var(--color-muted);font-size:11.5px;margin-top:2px">${x.sector ? '📍 ' + esc(x.sector) + ' · ' : ''}${x.cargados} equipo${x.cargados === 1 ? '' : 's'}${x.cargados < x.total ? ` de ${x.total} (el resto no tiene OT este mes)` : ''}</div>
                <div style="font-size:11.5px;margin-top:2px">📅 <b>${esc(x.periodicidad.txt)}</b></div>
                ${x.periodicidad.extras.map(e => `<div style="font-size:11.5px;color:#b45309;margin-top:1px">${esc(progExtraTxt(e))}</div>`).join('')}
              </div>`).join('') : '<div style="font-size:12px;color:var(--color-muted)">Sin sistemas de aire este mes.</div>'}
          </div>`).join('')}
      </div>
    </div>`;
}

/* ─── OTs de altura por guardia (para copiar y pegar) ─── */
function progAlturaPorGuardia() {
  const idx = progGetEquipoIndex();
  return progOrdenGuardias().map(g => {
    const ots = progState.ots.filter(o => o.guardia === g && o.esAltura)
      .sort((a, b) => (a.grupo || '').localeCompare(b.grupo || '') || String(a.ubicacionTecnica).localeCompare(String(b.ubicacionTecnica)) || a.equipo.localeCompare(b.equipo, 'es', { numeric: true }));
    return {
      g, turno: PROG_GUARDIA_TURNO[g],
      aire: ots.filter(o => o.grupo === 'aire'),
      mec: ots.filter(o => o.grupo !== 'aire'),
      lugar: o => (idx[o.equipo] && idx[o.equipo].sector) || o.zona || '',
    };
  });
}
function progAlturaLinea(o, lugar) {
  return `${o.ot_num ? 'OT ' + o.ot_num + ' · ' : ''}${o.equipo} ${o.denominacion || ''}${lugar ? ' — ' + lugar : ''} — ${progPeriodicidadCorta(o)}`;
}
function progAlturaTexto() {
  const mes = progMesLegible(progState.otsMes || progState.mes);
  const L = [`OTs de altura por guardia — ${mes}`, ''];
  progAlturaPorGuardia().forEach(r => {
    L.push(`${PROG_GUARDIAS[r.g].toUpperCase()} — Turno ${r.turno === 'mañana' ? 'Mañana' : 'Noche'} (${r.aire.length + r.mec.length} OTs de altura)`);
    if (!r.aire.length && !r.mec.length) L.push('  · Sin OTs de altura este mes');
    if (r.aire.length) { L.push(`  Aire (${r.aire.length}):`); r.aire.forEach(o => L.push('    · ' + progAlturaLinea(o, r.lugar(o)))); }
    if (r.mec.length) { L.push(`  Mecánicos (${r.mec.length}):`); r.mec.forEach(o => L.push('    · ' + progAlturaLinea(o, r.lugar(o)))); }
    L.push('');
  });
  return L.join('\n');
}
function progCopiarTexto(txt, okMsg) {
  const ok = () => progToast(okMsg, 'success');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, () => progCopiarFallback(txt, ok));
  else progCopiarFallback(txt, ok);
}
function progCopiarAltura() { progCopiarTexto(progAlturaTexto(), '📋 OTs de altura copiadas: pegalas en el mail.'); }
function renderProgResumenAltura() {
  const wrap = document.getElementById('prog-resumen-altura');
  if (!wrap) return;
  if (!progState.ots.some(o => o.esAltura)) { wrap.innerHTML = ''; return; }
  const esc = t => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const lista = (titulo, ots, r) => ots.length ? `
    <div style="font-size:11.5px;font-weight:800;color:var(--color-muted);text-transform:uppercase;letter-spacing:.05em;margin:8px 0 2px">${titulo} · ${ots.length}</div>
    ${ots.map(o => `<div style="font-size:12px;padding:3px 0;border-top:1px solid var(--color-surface)">
        ${o.ot_num ? `<span style="color:var(--color-muted)">OT ${esc(o.ot_num)}</span> · ` : ''}<b>${esc(o.equipo)}</b> ${esc(o.denominacion || '')}
        <div style="font-size:11px;color:var(--color-muted)">${r.lugar(o) ? '📍 ' + esc(r.lugar(o)) + ' · ' : ''}📅 ${esc(progPeriodicidadCorta(o))}</div></div>`).join('')}` : '';
  wrap.innerHTML = `
    <div class="table-card" style="margin-top:20px">
      <div style="padding:14px 16px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;border-bottom:1px solid var(--color-border)">
        <div style="flex:1;min-width:240px">
          <div style="font-weight:800;font-size:14px">⛰️ OTs de altura por guardia · ${esc(progMesLegible(progState.otsMes || progState.mes))}</div>
          <div style="font-size:12px;color:var(--color-muted)">Las OTs que pagan altura de cada guardia (aire y mecánicos), con su periodicidad. Para copiar y pegar en el mail.</div>
        </div>
        <button class="prog-btn prog-btn-primary" onclick="progCopiarAltura()">📋 Copiar OTs de altura</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;padding:14px 16px">
        ${progAlturaPorGuardia().map(r => `
          <div style="border:1px solid var(--color-border);border-radius:10px;padding:10px 12px">
            <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px">
              <b style="font-size:13.5px;color:var(--color-primary);white-space:nowrap">${esc(PROG_GUARDIAS[r.g])}</b>
              <span class="turno-badge ${r.turno === 'noche' ? 'noche' : 'manana'}">${r.turno === 'noche' ? '🌙 Noche' : '☀️ Mañana'}</span>
              <span style="margin-left:auto;font-size:12px;color:var(--color-muted);font-weight:700">⛰️ ${r.aire.length + r.mec.length} OTs</span>
            </div>
            ${lista('💨 Aire', r.aire, r)}${lista('🔧 Mecánicos', r.mec, r)}
            ${!r.aire.length && !r.mec.length ? '<div style="font-size:12px;color:var(--color-muted);margin-top:6px">Sin OTs de altura este mes.</div>' : ''}
          </div>`).join('')}
      </div>
    </div>`;
}

/* ─── OTs con tareas adicionales al mantenimiento básico ───
   OTs cuya toma de este mes es de un paquete mayor que el básico de su hoja de ruta
   (p. ej. plan 1M-3M-1A y esta OT es la trimestral): qué se agrega, por guardia. Si se
   cargó la lista de operaciones (IW49), también el texto de las operaciones adicionales. */
function progAdicionalesPorGuardia() {
  const idx = progGetEquipoIndex();
  const orden = PROG_FRECUENCIAS.map(([k]) => k);
  return progOrdenGuardias().map(g => ({
    g, turno: PROG_GUARDIA_TURNO[g],
    ots: progState.ots.filter(o => o.guardia === g && progAdicionalDe(o))
      .sort((a, b) => orden.indexOf(b.gama) - orden.indexOf(a.gama) || a.equipo.localeCompare(b.equipo, 'es', { numeric: true })),
    lugar: o => (idx[o.equipo] && idx[o.equipo].sector) || o.zona || '',
  }));
}
/* Texto de las operaciones de la OT que son del paquete adicional (no del básico). */
function progOpsDe(o) {
  const key = progNormOT(o.ot_num);
  return (progState.opsOT || {})[key] || (typeof OPS_SAP_POR_ORDEN !== 'undefined' ? OPS_SAP_POR_ORDEN[key] : null) || [];
}
function progOpsAdicionales(o) {
  const ops = progOpsDe(o);
  const b = progBasicoDe(o);
  return ops.filter(t => { const fs = progFrecuenciasDeTexto(t); return fs.length && !fs.includes(b); });
}
function progAdicionalQue(o) {
  return `además del mantenimiento ${progBasicoDe(o).toLowerCase()} se agregan las tareas ${o.gama.toLowerCase()}${progPluralTareas(o.gama)}${o.gamaDudosa ? ' (a confirmar)' : ''}`;
}
function progAdicionalesTexto() {
  const mes = progMesLegible(progState.otsMes || progState.mes);
  const L = [`OTs con tareas adicionales al mantenimiento básico — ${mes}`, ''];
  progAdicionalesPorGuardia().forEach(r => {
    L.push(`${PROG_GUARDIAS[r.g].toUpperCase()} — Turno ${r.turno === 'mañana' ? 'Mañana' : 'Noche'} (${r.ots.length} OT${r.ots.length === 1 ? '' : 's'})`);
    if (!r.ots.length) L.push('  · Todas sus OTs de este mes son el mantenimiento básico');
    r.ots.forEach(o => {
      L.push(`  · ${o.ot_num ? 'OT ' + o.ot_num + ' · ' : ''}${o.equipo} ${o.denominacion || ''}${r.lugar(o) ? ' — ' + r.lugar(o) : ''}${o.esAltura ? ' — ⛰️ altura' : ''}`);
      L.push(`      ${o.gama.toUpperCase()}: ${progAdicionalQue(o)}${o.textoOT ? ` (plan: ${o.textoOT})` : ''}`);
      progOpsAdicionales(o).forEach(t => L.push(`      Operación: ${t}`));
    });
    L.push('');
  });
  return L.join('\n');
}
function progCopiarAdicionales() { progCopiarTexto(progAdicionalesTexto(), '📋 OTs con tareas adicionales copiadas: pegalas en el mail.'); }
function renderProgResumenAdicionales() {
  const wrap = document.getElementById('prog-resumen-adicionales');
  if (!wrap) return;
  const res = progState.ots.length ? progAdicionalesPorGuardia() : [];
  if (!res.some(r => r.ots.length)) { wrap.innerHTML = ''; return; }
  const esc = t => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  wrap.innerHTML = `
    <div class="table-card" style="margin-top:20px">
      <div style="padding:14px 16px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;border-bottom:1px solid var(--color-border)">
        <div style="flex:1;min-width:240px">
          <div style="font-weight:800;font-size:14px">➕ OTs con tareas adicionales al mantenimiento básico · ${esc(progMesLegible(progState.otsMes || progState.mes))}</div>
          <div style="font-size:12px;color:var(--color-muted)">OTs que este mes no son solo el mantenimiento básico: qué tareas se agregan (trimestral, semestral, anual…). Para copiar y pegar en el mail.</div>
        </div>
        <button class="prog-btn prog-btn-primary" onclick="progCopiarAdicionales()">📋 Copiar OTs con tareas adicionales</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;padding:14px 16px">
        ${res.map(r => `
          <div style="border:1px solid var(--color-border);border-radius:10px;padding:10px 12px">
            <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:4px">
              <b style="font-size:13.5px;color:var(--color-primary);white-space:nowrap">${esc(PROG_GUARDIAS[r.g])}</b>
              <span class="turno-badge ${r.turno === 'noche' ? 'noche' : 'manana'}">${r.turno === 'noche' ? '🌙 Noche' : '☀️ Mañana'}</span>
              <span style="margin-left:auto;font-size:12px;color:var(--color-muted);font-weight:700">➕ ${r.ots.length} OT${r.ots.length === 1 ? '' : 's'}</span>
            </div>
            ${r.ots.length ? r.ots.map(o => `
              <div style="font-size:12px;padding:5px 0;border-top:1px solid var(--color-surface)">
                ${o.ot_num ? `<span style="color:var(--color-muted)">OT ${esc(o.ot_num)}</span> · ` : ''}<b>${esc(o.equipo)}</b> ${esc(o.denominacion || '')}${o.esAltura ? ' <span title="Paga altura">⛰️</span>' : ''}
                <div style="font-size:11.5px;margin-top:2px"><span style="font-weight:800;color:${PROG_FREC_COLOR[o.gama] || '#b45309'}">${esc(o.gama)}</span>: ${esc(progAdicionalQue(o))}</div>
                <div style="font-size:11px;color:var(--color-muted)">${r.lugar(o) ? '📍 ' + esc(r.lugar(o)) + ' · ' : ''}${o.textoOT ? 'plan: ' + esc(o.textoOT) : ''}</div>
                ${progOpsAdicionales(o).map(t => `<div style="font-size:11px">🔧 ${esc(t)}</div>`).join('')}
              </div>`).join('') : '<div style="font-size:12px;color:var(--color-muted)">Todas sus OTs de este mes son el mantenimiento básico.</div>'}
          </div>`).join('')}
      </div>
    </div>`;
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
    .sort((a, b) => progOrdenGuardias().indexOf(a.guardia) - progOrdenGuardias().indexOf(b.guardia) || a.equipo.localeCompare(b.equipo))
    .map(o => ({
      'Guardia': progGuardiaLabel(o.guardia),
      'Turno': PROG_GUARDIA_TURNO[o.guardia] === 'noche' ? 'Noche' : 'Mañana',
      'OT': o.ot_num || '',
      'Equipo': o.equipo,
      'Denominación': o.denominacion || '',
      'Gama de tareas': o.gama ? o.gama + (o.gamaDudosa ? ' (a confirmar)' : '') : '',
      'Incluye': (o.gamaIncluye || []).join(', '),
      'Tareas adicionales al básico': progAdicionalDe(o),
      'Gama según': o.gamaFuente || '',
      'Hoja de ruta': o.hr || '',
      'Zona': o.zona,
      'Ubicación técnica': o.ubicacionTecnica || '',
      'Sistema de aire': (progSistemaDeEquipo(o.equipo) || {}).nombre || '',
      'Gremio': o.grupo === 'aire' ? 'Aire' : 'Mecánicos',
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
  progState = { mes: document.getElementById('prog-mes-input').value || '', otsMes: '', ots: [], mangaGuardia: progState.mangaGuardia || {},
    hidrolavado: progState.hidrolavado, historial: progState.historial || {}, turnosOverride: progState.turnosOverride || {} };
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
  progAplicarTurnosMes(progState.mes || mesInput.value, progState.turnosOverride);
  mesInput.addEventListener('change', function () {
    progState.mes = this.value;
    progAplicarTurnosMes(progState.mes, progState.turnosOverride);
    progSave();
    renderProgramacion();
    if (progState.ots.length && progState.otsMes && progState.otsMes !== progState.mes) {
      progToast(`Las OTs cargadas son de ${progState.otsMes}. Cargá el Excel de ${progState.mes} para programarlo (rota respecto de ${progState.otsMes}).`, 'success');
    }
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
  const opsBtn = document.getElementById('prog-ops-btn');
  if (opsBtn) {
    opsBtn.addEventListener('click', () => {
      if (!progState.ots.length) { progToast('Primero cargá el Excel del mes.', 'error'); return; }
      document.getElementById('prog-ops-input').click();
    });
    document.getElementById('prog-ops-input').addEventListener('change', function () {
      const file = this.files[0]; this.value = '';
      if (file) progHandleOps(file);
    });
  }
  document.getElementById('prog-reset-btn').addEventListener('click', progReset);
  const reBtn = document.getElementById('prog-reprogramar-btn');
  if (reBtn) reBtn.addEventListener('click', () => progReprogramar(false));

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
  const hidroBtn = document.getElementById('prog-hidro-toggle');
  if (hidroBtn) hidroBtn.addEventListener('click', () => progSetHidrolavado(!progState.hidrolavado));

  progRenderHidroToggle();
  renderProgramacion();
})();
