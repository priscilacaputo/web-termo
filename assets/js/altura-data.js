/* ─── Equipos que requieren Trabajo en Altura ─────────────── */
/* Fuente: Equipos ALTURA.xlsx (hoja "Unificado"), actualizado 2026-09-01.
   Esta es la lista COMPLETA de equipos que pagan altura: cualquier equipo
   que no figure acá NO paga altura.

   Excepción — Roof Top con hidrolavado (ver ALTURA_HIDROLAVADO): los Roof
   Top que NO pertenecen a una manga sólo pagan altura cuando efectivamente
   se hace el hidrolavado del equipo. En la pestaña "Programación de OTs"
   arrancan SIN contar como altura y sólo pasan a contar al activar el
   botón "Hidrolavados ON". El Roof Top de manga (AAC2116) siempre paga
   altura, así que queda fuera de ALTURA_HIDROLAVADO. */

const ALTURA_EQUIPOS = new Set([
  "AAC2116", "AAC2117", "AAC2118", "AAC3820", "AAC3821", "AAC3822",
  "AAC3823", "AAC2230", "AAC2231", "AAC2232", "AAC2233", "AAC3824",
  "AAC3825", "AAC3826", "AAC3827", "AAC3828", "AAC3829", "AAC2167",
  "AAC2168", "AAC2144", "AAC2169", "AAC2170", "AAC2145", "AAC2171",
  "AAC2172", "AAC2146", "AAC2173", "AAC2174", "AAC2147", "AAC3504",
  "MAN005", "MAN006", "MAN007", "MAN008", "MAN009", "MAN010",
  "MAN011", "MAN012", "MAN029", "MAN030", "AAC3928", "AAC3929",
  "AAC3930", "AAC3931", "AAC3932", "AAC3933", "AAC2064", "AAC3833",
  "AAC3942", "AAC3943", "AAC2065", "AAC2066", "AAC2067", "AAC2068",
  "AAC2069", "AAC2070", "AAC2071", "AAC2072", "AAC2073", "AAC2074",
  "AAC2075", "AAC2076", "AAC2077", "AAC2102", "AAC2103", "AAC2196",
  "AAC2197", "AAC2198", "AAC2261", "AAC2262", "AAC2263", "AAC2264",
  "AAC2265", "AAC2266", "AAC2267", "AAC2271", "AAC2272", "AAC2273",
  "AAC2274", "AAC2717", "AAC2718", "AAC2719", "AAC2720", "AAC2734",
  "AAC2735", "AAC3477", "AAC3478", "AAC3479", "AAC3480", "AAC3481",
  "AAC3482", "AAC3832", "AAC3834", "AAC3835", "AAC3836", "AAC3837",
  "AAC3838", "AAC9416", "AAC9417", "AAC4109", "AAC2114", "AAC2115",
  "AAC4132", "AAC4110", "AAC4111", "AAC2083", "AAC9313", "AAC9315",
  "MEQ1314", "MEQ1315", "MEQ1329", "MEQ1330", "MEQ1332", "MEQ1333",
  "MEQ1334", "MEQ1350", "MEQ1351", "MEQ1352", "MEQ1354", "MEQ1355",
  "MEQ1356", "MEQ1534", "MEQ1535", "MEQ1639", "MEQ1640", "MEQ1641",
  "MEQ1642", "MEQ1644", "MEQ1645", "MEQ1646", "MEQ1647", "MEQ1648",
  "MEQ1649", "MEQ1650", "MEQ1651", "MEQ1652", "MEQ1653", "MEQ1655",
  "MEQ1657", "MEQ1658", "MEQ1659", "MEQ1661", "MEQ1662", "MEQ1663",
  "MEQ1904", "MEQ1905", "MEQ1906", "MEQ1909", "MEQ1920", "MEQ1921",
  "MEQ1922", "MEQ1923", "MEQ1924", "MEQ1925", "MEQ1926", "MEQ1927",
  "MEQ1928", "MEQ1929", "MEQ1930", "MEQ1932", "MEQ1933", "MEQ1934",
  "MEQ1935", "MEQ1936", "MEQ1937", "MEQ1938", "MEQ1939", "MEQ1940",
  "MEQ1941", "MEQ1942", "MEQ1943", "MEQ1944", "MEQ1945", "MEQ1331",
  "MEQ1316", "MEQ1353", "AAC2236", "AAC4107", "AAC4108", "AAC9314",
  "AAC9316", "AAC9415", "MAN234", "MAN235", "MEQ1313", "MEQ1317",
  "MEQ1328", "MEQ1335", "MEQ1338", "MEQ1357", "MEQ1358", "MEQ1360",
  "MEQ1361", "MEQ1522", "MEQ1654", "MEQ1656", "MEQ1660", "MEQ1908",
  "MEQ1931",
]);

// Total: 199 equipos

/* ─── Roof Top (sin manga) que sólo pagan altura si se hace hidrolavado ──
   Subconjunto de ALTURA_EQUIPOS. En "Programación de OTs" NO cuentan como
   altura salvo que esté activado el botón "Hidrolavados ON". Son los Roof
   Top con Ubicación "Sólo hidrolavado" en el Excel, más AAC2064 y AAC3833
   (Roof Top de Núcleo 2, mismo criterio: sólo pagan altura al hidrolavar). */
const ALTURA_HIDROLAVADO = new Set([
  "AAC2064", "AAC3833", "AAC2065", "AAC2066", "AAC2067", "AAC2068",
  "AAC2069", "AAC2070", "AAC2071", "AAC2072", "AAC2073", "AAC2074",
  "AAC2075", "AAC2076", "AAC2077", "AAC2102", "AAC2103", "AAC2196",
  "AAC2197", "AAC2198", "AAC2261", "AAC2262", "AAC2263", "AAC2264",
  "AAC2265", "AAC2266", "AAC2267", "AAC2271", "AAC2272", "AAC2273",
  "AAC2274", "AAC2717", "AAC2718", "AAC2719", "AAC2720", "AAC2734",
  "AAC2735", "AAC3477", "AAC3478", "AAC3479", "AAC3480", "AAC3481",
  "AAC3482", "AAC3832", "AAC3834", "AAC3835", "AAC3836", "AAC3837",
  "AAC3838",
]);

// Total: 49 equipos
