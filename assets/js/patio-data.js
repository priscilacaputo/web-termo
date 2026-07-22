/* ─── PATIO DE VALIJAS — Datos BHS ─────────────────────────
   Fuente: MASTER BHS Aeroparque.xlsx — hoja MASTER_MANTENIMIENTO
   Sector: Patio de valijas (Ed VI · AEP-ED6-NIVEL0-UBITEC497)
   ─────────────────────────────────────────────────────────── */

const PATIO_DATA = [

  /* -- Cintas planas BF --- */
  { equipo:"MEQ1078", denominacion:"Cinta Equipaje - BF-1216", clase:"BF", kw:"0.55", ubicacion:"AEP-ED5-NIVEL0-UBITEC293", sector:"Patio de Valijas Ed V" },
  { equipo:"MEQ1304", denominacion:"Cinta Equipaje - BF-201", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1305", denominacion:"Cinta Equipaje - BF-202", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1306", denominacion:"Cinta Equipaje - BF-203", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1307", denominacion:"Cinta Equipaje - BF-204", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1309", denominacion:"Cinta Equipaje - BF-206", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1312", denominacion:"Cinta Equipaje Ascendente - BF-210", clase:"BF", kw:"1.5", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1314", denominacion:"Cinta Equipaje Elevada - BF-212", clase:"BF", kw:"1.5", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1316", denominacion:"Cinta Equipaje descendente - BF-214", clase:"BF", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1317", denominacion:"Cinta Equipaje - BF-215", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1318", denominacion:"Cinta Equipaje desc. 1 carru 1-BF-216", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1319", denominacion:"Cinta Equipaje - BF-301", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1320", denominacion:"Cinta Equipaje - BF-302", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1321", denominacion:"Cinta Equipaje - BF-303", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1322", denominacion:"Cinta Equipaje - BF-304", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1324", denominacion:"Cinta Equipaje - BF-306", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1327", denominacion:"Cinta Equipaje Ascendente - BF-310", clase:"BF", kw:"1.5", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1329", denominacion:"Cinta Equipaje Elevada - BF-312", clase:"BF", kw:"1.5", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1331", denominacion:"Cinta Equipaje descendente - BF-314", clase:"BF", kw:"1.5", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1333", denominacion:"Cinta Equipaje - BF-316", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1335", denominacion:"Cinta Equipaje descendente - BF-318", clase:"BF", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1336", denominacion:"Cinta Equipaje - BF-319", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1337", denominacion:"Cinta Equipaje desc. 2 carru 1-BF-320", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1338", denominacion:"Cinta Equipaje descendente - BF-321", clase:"BF", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1339", denominacion:"Cinta Equipaje - BF-322", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1340", denominacion:"Cinta Equipaje desc. 2 carru 2-BF-323", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1341", denominacion:"Cinta Equipaje - BF-401", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1342", denominacion:"Cinta Equipaje - BF-402", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1343", denominacion:"Cinta Equipaje - BF-403", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1344", denominacion:"Cinta Equipaje - BF-404", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1346", denominacion:"Cinta Equipaje - BF-406", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1349", denominacion:"Cinta Equipaje Ascendente - BF-410", clase:"BF", kw:"1.5", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1351", denominacion:"Cinta Equipaje Elevada - BF-412", clase:"BF", kw:"1.5", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1353", denominacion:"Cinta Equipaje descendente - BF-414", clase:"BF", kw:"1.5", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1355", denominacion:"Cinta Equipaje - BF-416", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1357", denominacion:"Cinta Equipaje descendente - BF-418", clase:"BF", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1358", denominacion:"Cinta Equipaje - BF-419", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1359", denominacion:"Cinta Equipaje desc. 1 carru 2-BF-420", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1522", denominacion:"Cinta Equipaje descendente - BF-422", clase:"BF", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1523", denominacion:"Cinta Equipaje - BF-423", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1524", denominacion:"Cinta Equipaje desc. 2 carru 3-BF-424", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1525", denominacion:"Cinta Equipaje - BF-501", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1526", denominacion:"Cinta Equipaje - BF-502", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1527", denominacion:"Cinta Equipaje - BF-503", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1528", denominacion:"Cinta Equipaje - BF-504", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1529", denominacion:"Cinta Equipaje - BF-506", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1532", denominacion:"Cinta Equipaje - BF-509", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1533", denominacion:"Cinta Equipaje Ascendente - BF-510", clase:"BF", kw:"1.5", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1535", denominacion:"Cinta Equipaje Elevada - BF-512", clase:"BF", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1544", denominacion:"Cinta Equipaje - BF-209", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1545", denominacion:"Cinta Equipaje - BF-309", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1546", denominacion:"Cinta Equipaje - BF-409", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1639", denominacion:"Cinta Equipaje Elevada - BF-601", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1640", denominacion:"Cinta Equipaje Elevada Arco - BF-602", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1641", denominacion:"Cinta Equipaje Elevada Arco - BF-603", clase:"BF", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1642", denominacion:"Cinta Equipaje Elevada - BF-604", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1644", denominacion:"Cinta Equipaje Elevada - BF-606", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1645", denominacion:"Cinta Equipaje Elevada - BF-607", clase:"BF", kw:"2.2", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1647", denominacion:"Cinta Equipaje Elevada Relectura- BF-609", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1648", denominacion:"Cinta Equipaje Elevada Relectura- BF-610", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1649", denominacion:"Cinta Equipaje Elevada Relectura- BF-611", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1650", denominacion:"Cinta Equipaje Elevada Relectura- BF-612", clase:"BF", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1651", denominacion:"Cinta Equipaje Elevada Relectura- BF-613", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1652", denominacion:"Cinta Equipaje Elevada Relectura- BF-614", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1654", denominacion:"Cinta Equipaje Bajada carru 3-BF-616", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1656", denominacion:"Cinta Equipaje Bajada carru 2-BF-618", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1657", denominacion:"Cinta Equipaje Elevada - BF-619", clase:"BF", kw:"2.2", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1658", denominacion:"Cinta Equipaje Elevada - BF-620", clase:"BF", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1660", denominacion:"Cinta Equipaje Bajada carru 1-BF-622", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1662", denominacion:"Cinta Equipaje Elevada Retorno - BF-624", clase:"BF", kw:"2.2", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1663", denominacion:"Cinta Equipaje Elevada Retorno - BF-625", clase:"BF", kw:"2.2", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1895", denominacion:"Cinta Equipaje - BF-1201", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1896", denominacion:"Cinta Equipaje - BF-1202", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1897", denominacion:"Cinta Equipaje - BF-1203", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1898", denominacion:"Cinta Equipaje - BF-1204", clase:"BF", kw:"0.37", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1899", denominacion:"Cinta Equipaje - BF-1206", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1902", denominacion:"Cinta Equipaje - BF-1209", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1903", denominacion:"Cinta Equipaje Ascendente - BF-1210", clase:"BF", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1905", denominacion:"Cinta Equipaje - BF-1212", clase:"BF", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1908", denominacion:"Cinta Equipaje Descendente - BF-1214", clase:"BF", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1910", denominacion:"Cinta Equipaje - BF-1301", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1911", denominacion:"Cinta Equipaje - BF-1302", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1912", denominacion:"Cinta Equipaje - BF-1303", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1913", denominacion:"Cinta Equipaje - BF-1304", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1914", denominacion:"Cinta Equipaje - BF-1305", clase:"BF", kw:"0.37", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1915", denominacion:"Cinta Equipaje - BF-1307", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1918", denominacion:"Cinta Equipaje - BF-1310", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1919", denominacion:"Cinta Equipaje Ascendente - BF-1311", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1921", denominacion:"Cinta Equipaje - BF-1313", clase:"BF", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1922", denominacion:"Cinta Equipaje - BF-1314", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1923", denominacion:"Cinta Equipaje - BF-1315", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1924", denominacion:"Cinta Equipaje - BF-1316", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1926", denominacion:"Cinta Equipaje - BF-1318", clase:"BF", kw:"1.1", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1927", denominacion:"Cinta Equipaje - BF-1319", clase:"BF", kw:"1.1", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1929", denominacion:"Cinta Equipaje - BF-1321", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1930", denominacion:"Cinta Equipaje - BF-1322", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1931", denominacion:"Cinta Equipaje Descendente - BF-1323", clase:"BF", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1932", denominacion:"Cinta Equipaje - BF-1324", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1933", denominacion:"Cinta Equipaje - BF-1325", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1934", denominacion:"Cinta Equipaje - BF-1326", clase:"BF", kw:"1.1", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1935", denominacion:"Cinta Equipaje - BF-1327", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1936", denominacion:"Cinta Equipaje - BF-1328", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1937", denominacion:"Cinta Equipaje - BF-1329", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1938", denominacion:"Cinta Equipaje - BF-1401", clase:"BF", kw:"1.1", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1939", denominacion:"Cinta Equipaje - BF-1402", clase:"BF", kw:"1.1", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1940", denominacion:"Cinta Equipaje - BF-1403", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1942", denominacion:"Cinta Equipaje - BF-1405", clase:"BF", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1944", denominacion:"Cinta Equipaje - BF-1407", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1945", denominacion:"Cinta Equipaje - BF-1408", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1947", denominacion:"Cinta Equipaje - BF-1215", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1948", denominacion:"Cinta Equipaje Descendente BF-1216 Car 4", clase:"BF", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },

  /* -- Cintas retorno BFR --- */
  { equipo:"MEQ1310", denominacion:"Cinta Equipaje - BFR-207", clase:"BFR", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1325", denominacion:"Cinta Equipaje - BFR-307", clase:"BFR", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1334", denominacion:"Cinta Equipaje - BFR-317", clase:"BFR", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1347", denominacion:"Cinta Equipaje - BFR-407", clase:"BFR", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1356", denominacion:"Cinta Equipaje - BFR-417", clase:"BFR", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1530", denominacion:"Cinta Equipaje - BFR-507", clase:"BFR", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1659", denominacion:"Cinta Equipaje Elevada - BFR-621", clase:"BFR", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1900", denominacion:"Cinta Equipaje - BFR-1207", clase:"BFR", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1916", denominacion:"Cinta Equipaje - BFR-1308", clase:"BFR", kw:"0.55", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },

  /* -- Cintas curvas BC --- */
  { equipo:"MEQ1313", denominacion:"Cinta Curva 1 elevada - BC-211", clase:"BC", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1315", denominacion:"Cinta Curva 2  elevada - BC-213", clase:"BC", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1328", denominacion:"Cinta Curva 3 elevada - BC-311", clase:"BC", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1330", denominacion:"Cinta Curva 4 elevada - BC-313", clase:"BC", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1332", denominacion:"Cinta Curva 5  elevada - BC-315", clase:"BC", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1350", denominacion:"Cinta Curva 6  elevada - BC-411", clase:"BC", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1352", denominacion:"Cinta Curva 7 elevada - BC-413", clase:"BC", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1354", denominacion:"Cinta Curva 8  elevada - BC-415", clase:"BC", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1534", denominacion:"Cinta Curva 9 elevada - BC-511", clase:"BC", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1661", denominacion:"Cinta Curva Elevada Retorno - BC-623", clase:"BC", kw:"1.1", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1904", denominacion:"Cinta Curva 1 Elevada - BC-1211", clase:"BC", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1906", denominacion:"Cinta Curva 2 Elevada - BC-1213", clase:"BC", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1920", denominacion:"Cinta Curva 1 Elevada - BC-1312", clase:"BC", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1925", denominacion:"Cinta Curva 2 Elevada - BC-1317", clase:"BC", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1941", denominacion:"Cinta Curva 1 Elevada - BC-1404", clase:"BC", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1943", denominacion:"Cinta Curva 1 Elevada - BC-1406", clase:"BC", kw:"0.75", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },

  /* -- Brazos desviadores VB --- */
  { equipo:"MEQ1646", denominacion:"Cinta Brazo Desviador- VB-608", clase:"VB", kw:"0.37", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1653", denominacion:"Cinta Brazo Desviador - VB-615", clase:"VB", kw:"0.37", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1655", denominacion:"Cinta Brazo Desviador - VB-617", clase:"VB", kw:"0.37", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1928", denominacion:"Cinta Brazo Desviador - VB-1320", clase:"VB", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },

  /* -- Camas de rodillos GR --- */
  { equipo:"MEQ1311", denominacion:"Cama de Rodillos - CR-208", clase:"GR", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1326", denominacion:"Cama de Rodillos - CR-308", clase:"GR", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1348", denominacion:"Cama de Rodillos - CR-408", clase:"GR", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1531", denominacion:"Cama de Rodillos - CR-508", clase:"GR", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1901", denominacion:"Cama de Rodillos - CR-1208", clase:"GR", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1917", denominacion:"Cama de Rodillos - CR-1309", clase:"GR", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },

  /* -- Scanners --- */
  { equipo:"MEQ1949", denominacion:"Scanner RX-205 Gatera N°1", clase:"SCAN", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1950", denominacion:"Scanner RX-305 Gatera N°2", clase:"SCAN", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1951", denominacion:"Scanner RX-405 Gatera N°3", clase:"SCAN", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1952", denominacion:"Scanner RX-505 Gatera N°4", clase:"SCAN", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1953", denominacion:"Scanner RX-1205 Gatera N°5", clase:"SCAN", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1954", denominacion:"Scanner ExRX-1306 ExGatera N°6 (manga 5)", clase:"SCAN", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1998", denominacion:"Scanner RX-1306 Gatera N°6 (Nuevo)", clase:"SCAN", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1999", denominacion:"Scanner Oversize", clase:"SCAN", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },

  /* -- Carruseles TT --- */
  { equipo:"MEQ1360", denominacion:"Carrusel Partidas N°1 Incli. TT-217", clase:"TT", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1361", denominacion:"Carrusel Partidas N°2 Incli- TT-421", clase:"TT", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1543", denominacion:"Carrusel Partidas N°3 Incli. TT-520", clase:"TT", kw:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
  { equipo:"MEQ1946", denominacion:"Carrusel Partidas N°4 Incli. TT-2000", clase:"TT", kw:"2.2", ubicacion:"AEP-ED6-NIVEL0-UBITEC497", sector:"Patio de Valijas Ed VI" },
];

/* ─── Helpers de clasificación ──────────────────────────── */
function patioClaseLabel(clase) {
  return {
    BF:   "Cinta BF",
    BFR:  "Cinta Retorno",
    BC:   "Cinta Curva",
    VB:   "Brazo Desviador",
    GR:   "Cama Rodillos",
    SCAN: "Scanner",
    TT:   "Carrusel TT",
  }[clase] || clase;
}

function patioSubsistema(denominacion) {
  const m = denominacion.match(/[-]\s*(\d+)/);
  if (!m) return "General";
  const n = parseInt(m[1]);
  if (n >= 200  && n < 300)  return "Sistema 200";
  if (n >= 300  && n < 400)  return "Sistema 300";
  if (n >= 400  && n < 500)  return "Sistema 400";
  if (n >= 500  && n < 600)  return "Sistema 500";
  if (n >= 600  && n < 700)  return "HBS Elevado";
  if (n >= 1200 && n < 1300) return "HBS 1200";
  if (n >= 1300 && n < 1400) return "HBS 1300";
  if (n >= 1400 && n < 1500) return "HBS 1400";
  return "General";
}

const PATIO_CLASE_COLORS = {
  BF:   "#1a56a4",
  BFR:  "#7c3aed",
  BC:   "#0891b2",
  VB:   "#d97706",
  GR:   "#059669",
  SCAN: "#dc2626",
  TT:   "#92400e",
};

const PATIO_SUBSISTEMA_COLORS = {
  "Sistema 200": "#1a56a4",
  "Sistema 300": "#0e7490",
  "Sistema 400": "#7c3aed",
  "Sistema 500": "#059669",
  "HBS Elevado": "#d97706",
  "HBS 1200":    "#1a56a4",
  "HBS 1300":    "#0e7490",
  "HBS 1400":    "#7c3aed",
  "General":     "#6b7280",
};

/* ─── Planes preventivos BHS ────────────────────────────── */
const PATIO_PLANES = [

  /* ── 1. Cintas Tramos Rectos BF / BFR ─── */
  {
    id: "bf-bfr",
    denominacion: "Cintas Tramos Rectos BF / BFR — Patio de Valijas",
    clases: ["BF","BFR"],
    frecuencias: [
      {
        id: "trimestral", label: "TRIMESTRAL", sublabel: "MOEX — BHS", color: "#f59e0b",
        grupos: [
          { nombre: "Registros operativos", tareas: [
            "Verificar y registrar Horas de Funcionamiento",
            "Verificar y registrar Cantidad de Maniobras",
          ]},
          { nombre: "Consumo eléctrico", tareas: [
            "Medir y registrar el consumo de corriente del Motorreductor — Fase L1",
            "Medir y registrar el consumo de corriente del Motorreductor — Fase L2",
            "Medir y registrar el consumo de corriente del Motorreductor — Fase L3",
          ]},
          { nombre: "Inspección mecánica", tareas: [
            "Inspección y limpieza de motorreductor, bastidores, carenados, elementos fijos y móviles",
            "Verificar posibles pérdidas o transpiración de aceite. Control de nivel (cuando sea posible)",
            "Verificar ausencia de ruidos o vibraciones",
            "Verificar estado y funcionamiento de interruptor local de motorreductor",
            "Verificar estado y funcionamiento de parada de emergencia local (si posee)",
            "Verificar estado y funcionamiento de pulsador de rearme e indicaciones lumínicas (si posee)",
            "Control de funcionamiento de guiadores de banda. Desarmar y limpiar en caso necesario (si posee)",
            "Verificar estado y funcionamiento de pulsadores locales de comando (si posee)",
          ]},
          { nombre: "Banda", tareas: [
            "Verificar centrado, tensado y vulcanizado de la banda",
          ]},
          { nombre: "Control y detección", tareas: [
            "Verificar funcionamiento y ajuste de los elementos de detección",
            "Chequear existencia y estado de etiqueta de codificado",
            "Verificación/ajuste de elementos de fijación",
            "Limpieza total del equipo y sector",
          ]},
        ]
      },
      {
        id: "semestral-pred", label: "SEMESTRAL", sublabel: "MOEX — Predictivo (vibraciones)", color: "#1a56a4",
        grupos: [
          { nombre: "Análisis de vibraciones — Analizador MA-2070-C", tareas: [
            "Realizar mediciones de vibraciones en 4 puntos del conjunto motor-reductor (valor máximo de velocidad mm/seg y aceleración g)",
            "Medir y registrar la velocidad (mm/seg) en el Motor Lado Libre",
            "Medir y registrar la aceleración (g) en el Motor Lado Libre",
            "Medir y registrar la velocidad (mm/seg) en el Motor Lado Acople",
            "Medir y registrar la aceleración (g) en el Motor Lado Acople",
            "Medir y registrar la velocidad (mm/seg) en el Reductor Lado Libre",
            "Medir y registrar la aceleración (g) en el Reductor Lado Libre",
            "Medir y registrar la velocidad (mm/seg) en el Reductor Lado Acople",
            "Medir y registrar la aceleración (g) en el Reductor Lado Acople",
          ]},
        ]
      },
    ]
  },

  /* ── 2. Cintas Tramos Curvos BC ─── */
  {
    id: "bc",
    denominacion: "Cintas Tramos Curvos BC",
    clases: ["BC"],
    frecuencias: [
      {
        id: "trimestral", label: "TRIMESTRAL", sublabel: "MOEX — BHS", color: "#f59e0b",
        grupos: [
          { nombre: "Registros operativos", tareas: [
            "Verificar y registrar Horas de Funcionamiento",
            "Verificar y registrar Cantidad de Maniobras",
          ]},
          { nombre: "Consumo eléctrico", tareas: [
            "Medir y registrar el consumo de corriente del Motorreductor — Fase L1",
            "Medir y registrar el consumo de corriente del Motorreductor — Fase L2",
            "Medir y registrar el consumo de corriente del Motorreductor — Fase L3",
          ]},
          { nombre: "Inspección mecánica", tareas: [
            "Inspección y limpieza de motorreductor, bastidores, carenados, elementos fijos y móviles",
            "Verificar posibles pérdidas o transpiración de aceite. Control de nivel (cuando sea posible)",
            "Verificar ausencia de ruidos o vibraciones",
            "Verificar estado y funcionamiento de interruptor local de motorreductor",
            "Verificar estado y funcionamiento de parada de emergencia local (si posee)",
            "Verificar estado y funcionamiento de pulsador de rearme e indicaciones lumínicas (si posee)",
          ]},
          { nombre: "Banda y elementos curvos", tareas: [
            "Verificar centrado, tensado y vulcanizado de la banda",
            "Verificación de estado de guía siliconada",
            "Verificación de correcta posición y estado de holders",
            "Limpieza de rodamientos guía siliconada (retirar chapa)",
            "Verificación de correcta posición de elevadores de banda (posición \"UP\")",
          ]},
          { nombre: "Control y detección", tareas: [
            "Verificar funcionamiento y ajuste de los elementos de detección",
            "Verificación/ajuste de elementos de fijación",
            "Chequear existencia y estado de etiqueta de codificado",
            "Limpieza total del equipo y sector",
          ]},
        ]
      },
      {
        id: "semestral-pred", label: "SEMESTRAL", sublabel: "MOEX — Predictivo (vibraciones)", color: "#1a56a4",
        grupos: [
          { nombre: "Análisis de vibraciones — Analizador MA-2070-C", tareas: [
            "Realizar mediciones de vibraciones en 4 puntos del conjunto motor-reductor (valor máximo de velocidad mm/seg y aceleración g)",
            "Medir y registrar la velocidad (mm/seg) en el Motor Lado Libre",
            "Medir y registrar la aceleración (g) en el Motor Lado Libre",
            "Medir y registrar la velocidad (mm/seg) en el Motor Lado Acople",
            "Medir y registrar la aceleración (g) en el Motor Lado Acople",
            "Medir y registrar la velocidad (mm/seg) en el Reductor Lado Libre",
            "Medir y registrar la aceleración (g) en el Reductor Lado Libre",
            "Medir y registrar la velocidad (mm/seg) en el Reductor Lado Acople",
            "Medir y registrar la aceleración (g) en el Reductor Lado Acople",
          ]},
        ]
      },
    ]
  },

  /* ── 3. Brazos Desviadores VB ─── */
  {
    id: "vb",
    denominacion: "Brazos Desviadores VB",
    clases: ["VB"],
    frecuencias: [
      {
        id: "semanal", label: "SEMANAL", sublabel: "MOEX — BHS", color: "#dc2626",
        grupos: [
          { nombre: "Inspección visual rápida", tareas: [
            "Verificar presencia de polvo y suciedad en motorreductor, bastidores, carenados, elementos fijos, móviles, fotocélulas y reflectores; limpiar con trapos si es necesario",
            "Verificar daños y ruidos inusuales",
            "Verificar el desgaste de la banda",
            "Comprobar la tensión de la correa",
            "Verificar el motorreductor en busca de pérdidas de aceite",
            "Verificar el motorreductor en busca de ruidos extraños",
          ]},
        ]
      },
      {
        id: "trimestral", label: "TRIMESTRAL", sublabel: "MOEX — BHS", color: "#f59e0b",
        grupos: [
          { nombre: "Registros operativos", tareas: [
            "Verificar y registrar Horas de Funcionamiento",
            "Verificar y registrar Cantidad de Maniobras",
          ]},
          { nombre: "Consumo eléctrico", tareas: [
            "Medir y registrar el consumo de corriente del Motorreductor — Fase L1",
            "Medir y registrar el consumo de corriente del Motorreductor — Fase L2",
            "Medir y registrar el consumo de corriente del Motorreductor — Fase L3",
          ]},
          { nombre: "Inspección mecánica y eléctrica", tareas: [
            "Comprobar la tensión de la banda",
            "Revisar fijación y funcionamiento de las fotocélulas",
            "Inspección del desgaste de los rodamientos",
            "Verificar las piezas móviles en busca de daños",
            "Comprobar los tapones de ventilación de los motorreductores y/o fijación",
            "Verificar correcta puesta a tierra del equipo",
            "Verificar estado y funcionamiento de paradas de emergencia",
            "Chequear existencia y estado de etiqueta de codificado",
          ]},
        ]
      },
    ]
  },

  /* ── 4. Camas de Rodillos GR ─── */
  {
    id: "gr",
    denominacion: "Camas de Rodillos GR",
    clases: ["GR"],
    frecuencias: [
      {
        id: "trimestral", label: "TRIMESTRAL", sublabel: "MOEX — BHS", color: "#f59e0b",
        grupos: [
          { nombre: "Inspección y limpieza", tareas: [
            "Inspección de elementos faltantes o deteriorados",
            "Verificar libre giro y estado de los rodamientos de los rodillos",
            "Verificar estado, funcionamiento y ajuste de elementos de detección",
            "Chequear existencia y estado de etiqueta de codificado",
            "Verificación/ajuste de elementos de fijación",
            "Limpieza total del equipo y sector",
          ]},
        ]
      },
    ]
  },

  /* ── 5. Carruseles TT ─── */
  {
    id: "tt",
    denominacion: "Carruseles de Partidas TT",
    clases: ["TT"],
    frecuencias: [
      {
        id: "bimestral", label: "BIMESTRAL", sublabel: "MOEX — BHS", color: "#7c3aed",
        grupos: [
          { nombre: "Registros operativos", tareas: [
            "Verificar y registrar Horas de Funcionamiento",
            "Verificar y registrar Cantidad de Maniobras",
          ]},
          { nombre: "Consumo eléctrico — Motorreductor N°1", tareas: [
            "Medir y registrar el consumo de corriente del Motorreductor N°1 — Fase L1",
            "Medir y registrar el consumo de corriente del Motorreductor N°1 — Fase L2",
            "Medir y registrar el consumo de corriente del Motorreductor N°1 — Fase L3",
          ]},
          { nombre: "Consumo eléctrico — Motorreductor N°2", tareas: [
            "Medir y registrar el consumo de corriente del Motorreductor N°2 — Fase L1",
            "Medir y registrar el consumo de corriente del Motorreductor N°2 — Fase L2",
            "Medir y registrar el consumo de corriente del Motorreductor N°2 — Fase L3",
          ]},
          { nombre: "Inspección de placas y estructura", tareas: [
            "Verificar estado de placas de goma y protecciones metálicas",
            "Retirar las placas que sean necesarias para efectuar las tareas de inspección",
            "Verificar ausencia de pérdidas de aceite en reductor y correcto ajuste de base",
          ]},
          { nombre: "Seguridad y accionamiento", tareas: [
            "Ensayo del control de parada de emergencia",
            "Ensayo de parada automática desde el sensor",
            "Verificar estado y tensión de banda de fricción",
            "Verificar estado de componentes (ruedas, resortes) de unidad de presión y unidad de fricción",
            "Verificar altura de cepillos limpiadores de guías (si posee)",
          ]},
          { nombre: "Cadena y carros", tareas: [
            "Control de cadena de placas y ruedas de centrado y rodadura. De ser necesario, tensar y eliminar juego",
            "Verificar ajuste de carros portaplacas a cadena de tracción",
            "Permutar funcionamiento grupo motor",
          ]},
          { nombre: "Sensores y control", tareas: [
            "Verificar estado y funcionamiento de sensores de hueco",
            "Verificar estado y funcionamiento de pulsadores de arranque y parada",
            "Verificar estado y funcionamiento de señales visuales y sonoras",
            "Control de funcionamiento y estado de cortinas y puertas de gateras. Reparar de ser necesario (solo Carruseles de Arribos)",
            "Medición de corriente eléctrica del motor; comparar con valor nominal",
            "Control de ajuste de protecciones eléctricas (5% I nominal)",
            "Ajuste de borneras en tablero y motor",
            "Notificar novedades en la presente OT",
          ]},
        ]
      },
      {
        id: "semestral-pred", label: "SEMESTRAL", sublabel: "MOEX — Predictivo (vibraciones)", color: "#1a56a4",
        grupos: [
          { nombre: "Análisis de vibraciones — Motor N°1 (Analizador MA-2070-C)", tareas: [
            "Medir y registrar la velocidad (mm/seg) en el Motor N°1 Lado Libre",
            "Medir y registrar la aceleración (g) en el Motor N°1 Lado Libre",
            "Medir y registrar la velocidad (mm/seg) en el Motor N°1 Lado Acople",
            "Medir y registrar la aceleración (g) en el Motor N°1 Lado Acople",
            "Medir y registrar la velocidad (mm/seg) en el Reductor N°1 Lado Libre",
            "Medir y registrar la aceleración (g) en el Reductor N°1 Lado Libre",
            "Medir y registrar la velocidad (mm/seg) en el Reductor N°1 Lado Acople",
            "Medir y registrar la aceleración (g) en el Reductor N°1 Lado Acople",
          ]},
          { nombre: "Análisis de vibraciones — Motor N°2 (Analizador MA-2070-C)", tareas: [
            "Medir y registrar la velocidad (mm/seg) en el Motor N°2 Lado Libre",
            "Medir y registrar la aceleración (g) en el Motor N°2 Lado Libre",
            "Medir y registrar la velocidad (mm/seg) en el Motor N°2 Lado Acople",
            "Medir y registrar la aceleración (g) en el Motor N°2 Lado Acople",
            "Medir y registrar la velocidad (mm/seg) en el Reductor N°2 Lado Libre",
            "Medir y registrar la aceleración (g) en el Reductor N°2 Lado Libre",
            "Medir y registrar la velocidad (mm/seg) en el Reductor N°2 Lado Acople",
            "Medir y registrar la aceleración (g) en el Reductor N°2 Lado Acople",
          ]},
        ]
      },
      {
        id: "anual", label: "ANUAL", sublabel: "MOEX — BHS", color: "#10b981",
        grupos: [
          { nombre: "Mediciones de desgaste", tareas: [
            "Medir y registrar el Diámetro de las ruedas de apoyo de placas (Promedio entre 6 ruedas)",
            "Medir y registrar el Diámetro del excéntrico sup. parte cilíndrica de un eslabón de la cadena de traslación",
            "Medir y registrar el Diámetro del excéntrico sup. parte excéntrica de un eslabón de la cadena de traslación",
            "Medir y registrar el Diámetro del excéntrico inf. parte cilíndrica de un eslabón de la cadena de traslación",
            "Medir y registrar el Diámetro del excéntrico inf. parte excéntrica de un eslabón de la cadena de traslación",
            "Verificar estado de ruedas",
            "Verificar estado de carros portaplacas",
          ]},
          { nombre: "Limpieza general", tareas: [
            "Limpieza de espacio ocupado y de tránsito",
            "Limpieza exterior de motorreductores",
            "Limpieza de unidades de presión",
            "Limpieza de elementos de la cadena",
            "Limpieza de correas de transmisión",
            "Limpieza de rodamientos de bolas",
            "Limpieza de placas TT-TF",
            "Limpieza de poleas",
          ]},
          { nombre: "Ajustes y reparaciones", tareas: [
            "Ajustar tornillería",
            "Ajustar elementos de protección de seguridad",
            "Ajustar elementos de accionamiento",
            "Ajustar elementos de prevención",
            "Ajustar elementos de cadena (pasadores, pernos, etc.)",
            "Ajustar unidades de presión",
            "Ajustar correas de transmisión",
            "Ajustar poleas de accionamiento",
            "Reparar daños en bastidores, carenados, suspensiones y elementos fijos (óxidos, golpes, etc.)",
            "Reparar desperfectos en plataformas, escaleras, barandillas, etc.",
            "Eliminar ruidos en elementos móviles y de accionamiento",
            "Eliminar rozamientos de elementos móviles con elementos fijos",
            "Eliminar pérdida de lubricante en elementos de accionamiento",
          ]},
          { nombre: "Lubricación", tareas: [
            "Engrasar rodamientos de bolas",
            "Completar (de ser necesario) depósitos y reductores de aceites o lubricantes (nivel óptimo)",
            "Engrasar guías y elementos móviles",
            "Engrasar tensores",
          ]},
          { nombre: "Verificación eléctrica y de control", tareas: [
            "Verificar acuse de alarmas en Pantalla Táctil",
            "Verificar funcionamiento de elementos y mecanismos",
            "Verificar estado de cajas de conexiones",
            "Verificar acuse de alarmas en pantallas Simatic",
            "Ajustar elementos de detección (inductivos, micros, fotocélulas, etc.)",
            "Ajustar conexionado de elementos (bornes, clavijas, conectores, etc.)",
            "Notificar novedades en la presente OT",
          ]},
        ]
      },
      {
        id: "trienal", label: "TRIENAL", sublabel: "MOEX — BHS", color: "#6b7280",
        grupos: [
          { nombre: "Lubricación mayor", tareas: [
            "Reemplazar aceite de los motorreductores",
          ]},
        ]
      },
    ]
  },

  /* ── 6. Scanners BHS ─── */
  {
    id: "scan",
    denominacion: "Scanners RX — Sistema BHS",
    clases: ["SCAN"],
    frecuencias: [
      {
        id: "mensual", label: "MENSUAL", sublabel: "MOEX — BHS / Fabricante", color: "#dc2626",
        grupos: [
          { nombre: "Inspección General", tareas: [
            "Verificar estado general del equipo: estructura, pantallas y zona de trabajo",
            "Verificar que el sistema de detección responde correctamente ante objetos de prueba",
            "Verificar ausencia de alarmas activas en el panel de control del scanner",
            "Verificar estado y limpieza de las fotocélulas o barreras ópticas del scanner",
            "Verificar estado del dispositivo de señalización (alarma sonora / visual)",
          ]},
          { nombre: "Sistema Eléctrico y Control", tareas: [
            "Verificar ajuste de bornes en tablero local",
            "Verificar comunicación del scanner con el PLC/SCADA BHS",
            "Probar ciclo completo de detección y señalización desde sala de control",
            "Verificar estado del cableado: sin roces ni tensión",
          ]},
        ]
      },
      {
        id: "semestral", label: "SEMESTRAL", sublabel: "MOEX — BHS / Fabricante", color: "#1a56a4",
        grupos: [
          { nombre: "Calibración y Verificación", tareas: [
            "Verificar calibración del sistema de detección según procedimiento del fabricante",
            "Limpiar sensores ópticos con paño seco antiestático",
            "Verificar alineación de los elementos detectores",
            "Registrar y archivar resultado de la verificación de calibración en MOEX",
          ]},
        ]
      },
    ]
  },

];

/* ─── Lookup: equipo → plan id ──────────────────── */
const PATIO_A_PLAN = {};
PATIO_PLANES.forEach(p => {
  PATIO_DATA.forEach(eq => {
    if (p.clases.includes(eq.clase)) PATIO_A_PLAN[eq.equipo] = p.id;
  });
});
