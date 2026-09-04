/* ─── Repuestos de Pañol por equipo ──────────────────────────
   Relación equipo ↔ materiales de pañol (código SAP). El Excel de
   almacén NO trae esta información: se carga a mano desde el modo
   administrador, en la pestaña "Repuestos por equipo" de la página
   Pañol / Repuestos, y se versiona en GitHub vía /api/update-equipment
   (igual que ESTADO_OVERRIDES).

   Forma de cada entrada:
     { equipo: "AAC2115",
       materiales: [ { cod: "20089275", nota: "filtro rodete (opcional)" } ] }

   `cod` referencia PANOL_DATA[].cod — la descripción y el stock se
   resuelven en vivo al renderizar. */

const PANOL_REPUESTOS = [];
