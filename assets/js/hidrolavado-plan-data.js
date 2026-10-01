/* ─── HIDRO_PLAN — cambios manuales al Calendario de Hidrolavados ───
   Cada equipo se hidrolava cada 6 meses en un par fijo de meses (par 1 = Ene/Jul,
   2 = Feb/Ago … 6 = Jun/Dic). El par sale solo (mes SAP o reparto por carga);
   acá quedan solo los equipos que un admin movió a mano: { equipo, par }.
   Lo guarda el panel admin vía /api/update-equipment (sección "hidrolavado"). */

const HIDRO_PLAN = [];
