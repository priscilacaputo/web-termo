/* ─── Válvulas — Sistema de Incendio · AEP ──────────────── */
/* Fuente: export SAP IH08 (val.xlsx). Familia VAL, centro AEP.
   37 válvulas del sistema de incendio: sala de bombas (esclusa, retención,
   alivio, mariposa) + red de hidrantes por edificio/piso + 1 en la sala de
   motobombas de PK Río. Todas MONT (operativas). */

const VALVULAS_DATA = [
  { equipo:"VAL255", denominacion:"Válvula Esclusa N°1 - Sist. Incendio", tipo:"Esclusa", medida:"10\"", fabricante:"", material:"ASTM A 216 GR B", fecha:"2024-02-15", status:"MONT", ubicacion:"AEP-ED2-NIVEL0-UBITEC089", local:"Sala de Bombas" },
  { equipo:"VAL256", denominacion:"Válvula Esclusa N°2 - Sist. Incendio", tipo:"Esclusa", medida:"10\"", fabricante:"", material:"ASTM A 216 GR B", fecha:"2024-02-15", status:"MONT", ubicacion:"AEP-ED2-NIVEL0-UBITEC089", local:"Sala de Bombas" },
  { equipo:"VAL257", denominacion:"Válvula Esclusa N°3 - Sist. Incendio", tipo:"Esclusa", medida:"10\"", fabricante:"", material:"ASTM A 216 GR B", fecha:"2024-02-15", status:"MONT", ubicacion:"AEP-ED2-NIVEL0-UBITEC089", local:"Sala de Bombas" },
  { equipo:"VAL258", denominacion:"Válvula Esclusa N°4 - Sist. Incendio", tipo:"Esclusa", medida:"10\"", fabricante:"", material:"ASTM A 216 GR B", fecha:"2024-02-15", status:"MONT", ubicacion:"AEP-ED2-NIVEL0-UBITEC089", local:"Sala de Bombas" },
  { equipo:"VAL259", denominacion:"Válvula Esclusa N°5 - Sist. Incendio", tipo:"Esclusa", medida:"10\"", fabricante:"", material:"ASTM A 216 GR B", fecha:"2024-02-15", status:"MONT", ubicacion:"AEP-ED2-NIVEL0-UBITEC089", local:"Sala de Bombas" },
  { equipo:"VAL260", denominacion:"Válvula Esclusa N°6 - Sist. Incendio", tipo:"Esclusa", medida:"8\"", fabricante:"", material:"ASTM A 216 GR B", fecha:"2024-02-15", status:"MONT", ubicacion:"AEP-ED2-NIVEL0-UBITEC089", local:"Sala de Bombas" },
  { equipo:"VAL261", denominacion:"Válvula Retención N°1 - Sist. Incendio", tipo:"Retención", medida:"10\"", fabricante:"", material:"Duo-Check", fecha:"2024-02-15", status:"MONT", ubicacion:"AEP-ED2-NIVEL0-UBITEC089", local:"Sala de Bombas" },
  { equipo:"VAL262", denominacion:"Válvula Retención N°2 - Sist. Incendio", tipo:"Retención", medida:"10\"", fabricante:"", material:"Duo-Check", fecha:"2024-02-15", status:"MONT", ubicacion:"AEP-ED2-NIVEL0-UBITEC089", local:"Sala de Bombas" },
  { equipo:"VAL263", denominacion:"Válvula Alivio N°1 - Sist. Incendio", tipo:"Alivio", medida:"6\" / 250 PSI MAX", fabricante:"CLA-VAL", material:"", fecha:"2024-02-15", status:"MONT", ubicacion:"AEP-ED2-NIVEL0-UBITEC089", local:"Sala de Bombas" },
  { equipo:"VAL264", denominacion:"Válvula Alivio N°2 - Sist. Incendio", tipo:"Alivio", medida:"6\" / 250 PSI MAX", fabricante:"CLA-VAL", material:"", fecha:"2024-02-15", status:"MONT", ubicacion:"AEP-ED2-NIVEL0-UBITEC089", local:"Sala de Bombas" },
  { equipo:"VAL265", denominacion:"Válvula Mariposa N°1 - Sist. Incendio", tipo:"Mariposa", medida:"10\"", fabricante:"", material:"", fecha:"2024-02-15", status:"MONT", ubicacion:"AEP-ED2-NIVEL0-UBITEC089", local:"Sala de Bombas" },
  { equipo:"VAL266", denominacion:"Válvula Mariposa N°2 - Sist. Incendio", tipo:"Mariposa", medida:"10\"", fabricante:"", material:"", fecha:"2024-02-15", status:"MONT", ubicacion:"AEP-ED2-NIVEL0-UBITEC089", local:"Sala de Bombas" },
  { equipo:"VAL267", denominacion:"Válvula Mariposa N°3 - Sist. Incendio", tipo:"Mariposa", medida:"8\"", fabricante:"", material:"", fecha:"2024-02-15", status:"MONT", ubicacion:"AEP-ED2-NIVEL0-UBITEC089", local:"Sala de Bombas" },
  { equipo:"VAL268", denominacion:"Válvula Mariposa N°4 - Sist. Incendio", tipo:"Mariposa", medida:"8\"", fabricante:"", material:"", fecha:"2024-02-15", status:"MONT", ubicacion:"AEP-ED2-NIVEL0-UBITEC089", local:"Sala de Bombas" },
  { equipo:"VAL269", denominacion:"Válv Marip N°1 Hidrante Sist Inc Checkin", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2024-02-16", status:"MONT", ubicacion:"AEP-ED5-NIVEL0-UBITEC293", local:"Patio de valijas Edificio 5" },
  { equipo:"VAL270", denominacion:"Válv Marip N°2 Hidrante Sist Inc Pree In", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2024-02-16", status:"MONT", ubicacion:"AEP-ED5-NIVEL0-UBITEC293", local:"Patio de valijas Edificio 5" },
  { equipo:"VAL271", denominacion:"Válv Marip N°3 - Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2024-02-16", status:"MONT", ubicacion:"AEP-ED5-NIVEL0-UBITEC293", local:"Patio de valijas Edificio 5" },
  { equipo:"VAL272", denominacion:"Válv Marip N°4 - Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2024-02-16", status:"MONT", ubicacion:"AEP-ED5-NIVEL0-UBITEC293", local:"Patio de valijas Edificio 5" },
  { equipo:"VAL273", denominacion:"Válv Marip N°5 Hidrantes Sist Inc NORTE", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2024-02-16", status:"MONT", ubicacion:"AEP-ED4-NIVEL0-UBITEC177", local:"Hall asc. AA2000-ORSNA Norte" },
  { equipo:"VAL274", denominacion:"Válv Marip N°6 Hidrantes Sist Inc SUR", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2024-02-16", status:"MONT", ubicacion:"AEP-ED4-NIVEL0-UBITEC121", local:"Hall asc. ARSA-ORSNA Sur" },
  { equipo:"VAL275", denominacion:"Válv Marip N°7 Hidrantes Sist Inc NORTE", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2024-02-16", status:"MONT", ubicacion:"AEP-ED4-NIVEL2-UBITEC025", local:"Oficinas Corp ALA NORTE Recepcion" },
  { equipo:"VAL276", denominacion:"Válv Marip N°8 Hidrantes Sist Inc SUR", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2024-02-16", status:"MONT", ubicacion:"AEP-ED4-NIVEL2-UBITEC017", local:"Oficinas Corp ALA SUR Recepcion" },
  { equipo:"VAL277", denominacion:"Válv Marip N°9 - Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2023-08-17", status:"MONT", ubicacion:"AEP-ED2-NIVEL0", local:"Planta Baja Edificio 2" },
  { equipo:"VAL278", denominacion:"Válv Marip N°10 -Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2023-08-17", status:"MONT", ubicacion:"AEP-ED2-NIVEL1", local:"Primer Piso Edificio 2" },
  { equipo:"VAL279", denominacion:"Válv Marip N°11 -Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2023-08-17", status:"MONT", ubicacion:"AEP-ED2-NIVEL2", local:"Segundo Piso Edificio 2" },
  { equipo:"VAL280", denominacion:"Válv Marip N°12 -Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2023-08-17", status:"MONT", ubicacion:"AEP-ED2-NIVEL3", local:"Tercer Piso Edificio 2" },
  { equipo:"VAL281", denominacion:"Válv Marip N°13 -Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2023-08-17", status:"MONT", ubicacion:"AEP-ED2-NIVEL4", local:"Cuarto Piso Edificio 2" },
  { equipo:"VAL282", denominacion:"Válv Marip N°14 -Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2023-08-17", status:"MONT", ubicacion:"AEP-ED2-NIVEL5", local:"Quinto Piso Edificio 2" },
  { equipo:"VAL283", denominacion:"Válv Marip N°15 -Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2023-08-17", status:"MONT", ubicacion:"AEP-ED2-NIVEL6", local:"Sexto Piso Edificio 2" },
  { equipo:"VAL284", denominacion:"Válv Marip N°16 -Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2023-08-17", status:"MONT", ubicacion:"AEP-ED1-NIVEL0", local:"Planta Baja Edificio 1" },
  { equipo:"VAL285", denominacion:"Válv Marip N°17 -Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2023-08-17", status:"MONT", ubicacion:"AEP-ED1-NIVEL1", local:"Primer Piso Edificio 1" },
  { equipo:"VAL286", denominacion:"Válv Marip N°18 -Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2023-08-17", status:"MONT", ubicacion:"AEP-ED1-NIVEL2", local:"Segundo Piso Edificio 1" },
  { equipo:"VAL287", denominacion:"Válv Marip N°19 -Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2023-08-17", status:"MONT", ubicacion:"AEP-ED1-NIVEL3", local:"Tercer Piso Edificio 1" },
  { equipo:"VAL288", denominacion:"Válv Marip N°20 -Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2023-08-17", status:"MONT", ubicacion:"AEP-ED1-NIVEL4", local:"Cuarto Piso Edificio 1" },
  { equipo:"VAL289", denominacion:"Válv Marip N°21 -Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2023-08-17", status:"MONT", ubicacion:"AEP-ED1-NIVEL5", local:"Quinto Piso Edificio 1" },
  { equipo:"VAL290", denominacion:"Válv Marip N°22 -Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"2023-08-17", status:"MONT", ubicacion:"AEP-ED1-NIVEL6", local:"Sexto Piso Edificio 1" },
  { equipo:"VAL387", denominacion:"Válv Marip N°1 -Hidrantes Sist Incendio", tipo:"Mariposa", medida:"", fabricante:"", material:"", fecha:"", status:"MONT", ubicacion:"AEP-ESR-UBITE7-UBITEC001", local:"Sala Motobombas -PK RIO SS2" },
];

const VALVULAS_TIPO_COLORS = {
  "Esclusa":    "#1a56a4",
  "Retención":  "#0891b2",
  "Alivio":     "#d97706",
  "Mariposa":   "#7c3aed",
  "Otra":       "#6b7280",
};
