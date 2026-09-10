/* ─── OTS_SAP_RESUMEN / OTS_SAP_POR_EQUIPO — IW38 2 años (TER/MEC) ───
   2026-09-10: se quitaron a mano AAC2102/2103/2196/2197/2198 (no están de alta en
   SAP IH08 — decisión usuaria). equiposConOT ajustado; total/cerradas/backlog
   siguen contando sus ~188 OT hasta regenerar desde un IW38 nuevo (gen_ots2.py).
   Fuente: EXPORT_20260909182747.xlsx. 18731 OTs YA02, 2024-06-26 a 2026-09-09, 1022 equipos.
   Cerrada = status usuario OTCE, o CTEC/CERR, o con fecha real de fin.
   OTS_SAP_POR_EQUIPO: equipo -> {n, ult, abiertas, cerradas, correctivas}.
   Regenerar con scratchpad/gen_ots2.py. */

const OTS_SAP_RESUMEN = {
 "fuente": "EXPORT_20260909182747.xlsx (IW38 · 2 años, YA02, TER/MEC)",
 "total": 18731,
 "periodo": [
  "2024-06-26",
  "2026-09-09"
 ],
 "abiertas": 1826,
 "cerradas": 16853,
 "notificadas": 3017,
 "correctivas": 71,
 "pctCerradas": 90,
 "pctNotificadas": 18,
 "equiposConOT": 1015,
 "backlogPorEdad": [
  {
   "k": "≤ 1 mes",
   "n": 361
  },
  {
   "k": "1–3 meses",
   "n": 864
  },
  {
   "k": "3–6 meses",
   "n": 410
  },
  {
   "k": "6–12 meses",
   "n": 165
  },
  {
   "k": "> 1 año",
   "n": 26
  }
 ],
 "backlogViejo": 191,
 "creadasPorTrimestre": [
  {
   "t": "2024T2",
   "n": 1076
  },
  {
   "t": "2024T3",
   "n": 2199
  },
  {
   "t": "2024T4",
   "n": 1275
  },
  {
   "t": "2025T1",
   "n": 3499
  },
  {
   "t": "2025T2",
   "n": 1950
  },
  {
   "t": "2025T3",
   "n": 1640
  },
  {
   "t": "2025T4",
   "n": 1416
  },
  {
   "t": "2026T1",
   "n": 2725
  },
  {
   "t": "2026T2",
   "n": 1551
  },
  {
   "t": "2026T3",
   "n": 1400
  }
 ],
 "equiposConOTfueraDelMaestro": [
  "AAC344",
  "AAC4119",
  "AAC9420",
  "AVO247",
  "AVO269",
  "EPO001",
  "MAS588",
  "MCD100",
  "MCD101",
  "MCD102",
  "MCD103",
  "MCD110",
  "MCD111",
  "MCD112",
  "MCD113",
  "MCD114",
  "MCD115",
  "MCD116",
  "MCD117",
  "MCD118",
  "MCD119",
  "MCD120",
  "MCD121",
  "MCD122",
  "MCD123",
  "MCD124",
  "MCD125",
  "MCD126",
  "MCD127",
  "MCD128",
  "MCD129",
  "MCD130",
  "MCD131",
  "MCD132",
  "MCD133",
  "MCD134",
  "MCD135",
  "MEQ1948",
  "MEQ1949",
  "MEQ1950",
  "MEQ1951",
  "MEQ1952",
  "MEQ1953",
  "MES119",
  "PLC008",
  "PLC009",
  "PPA686",
  "PPA687",
  "PPA688",
  "PPA689",
  "PPA702",
  "PPA705",
  "PPA708",
  "PPA709",
  "TNQ022",
  "TNQ023",
  "TNQ025",
  "TNQ026",
  "UTA086",
  "UTA205"
 ],
 "equiposConPlanSinOT": [],
 "topEquiposPorOT": [
  {
   "equipo": "CMA001",
   "n": 172
  },
  {
   "equipo": "MBO1146",
   "n": 156
  },
  {
   "equipo": "MBO1147",
   "n": 156
  },
  {
   "equipo": "MBO1427",
   "n": 74
  },
  {
   "equipo": "MBO1428",
   "n": 74
  },
  {
   "equipo": "MAN029",
   "n": 53
  },
  {
   "equipo": "MAN030",
   "n": 53
  },
  {
   "equipo": "MAN011",
   "n": 49
  },
  {
   "equipo": "MAN005",
   "n": 48
  },
  {
   "equipo": "MAN012",
   "n": 48
  },
  {
   "equipo": "AAC2718",
   "n": 43
  },
  {
   "equipo": "AAC2717",
   "n": 42
  },
  {
   "equipo": "AAC2720",
   "n": 41
  },
  {
   "equipo": "MAN009",
   "n": 41
  },
  {
   "equipo": "MAN010",
   "n": 41
  },
  {
   "equipo": "AAC2077",
   "n": 40
  },
  {
   "equipo": "AAC2122",
   "n": 40
  },
  {
   "equipo": "AAC2124",
   "n": 40
  },
  {
   "equipo": "AAC2137",
   "n": 40
  }
 ],
 "equiposConCorrectivas": [
  {
   "equipo": "UTA086",
   "n": 7
  },
  {
   "equipo": "UTA205",
   "n": 7
  },
  {
   "equipo": "AAC3824",
   "n": 2
  },
  {
   "equipo": "AAC2145",
   "n": 2
  },
  {
   "equipo": "AVO019",
   "n": 2
  },
  {
   "equipo": "EPO001",
   "n": 1
  },
  {
   "equipo": "AAC2122",
   "n": 1
  },
  {
   "equipo": "AAC2171",
   "n": 1
  },
  {
   "equipo": "MEQ1887",
   "n": 1
  },
  {
   "equipo": "PPA675",
   "n": 1
  },
  {
   "equipo": "AAC3993",
   "n": 1
  },
  {
   "equipo": "AAC3995",
   "n": 1
  },
  {
   "equipo": "AAC9409",
   "n": 1
  },
  {
   "equipo": "AAC9410",
   "n": 1
  },
  {
   "equipo": "AAC9411",
   "n": 1
  },
  {
   "equipo": "AAC2077",
   "n": 1
  },
  {
   "equipo": "AVO978",
   "n": 1
  },
  {
   "equipo": "AVO979",
   "n": 1
  },
  {
   "equipo": "PPA683",
   "n": 1
  },
  {
   "equipo": "AAC2124",
   "n": 1
  }
 ],
 "otSinEquipo": [
  {
   "orden": "400133381",
   "texto": "MP Mensual-Semestral Mangas TEAM",
   "clase": "Preventivo"
  },
  {
   "orden": "400224096",
   "texto": "MP Mensual-Semestral Mangas TEAM",
   "clase": "Preventivo"
  },
  {
   "orden": "400196588",
   "texto": "MP Mensual-Semestral Mangas TEAM",
   "clase": "Preventivo"
  },
  {
   "orden": "400513593",
   "texto": "PD Recorrida Nº1 Med. Vibrac. MEQ",
   "clase": "Preventivo"
  },
  {
   "orden": "400153997",
   "texto": "MP Mensual-Semestral Mangas TEAM",
   "clase": "Preventivo"
  },
  {
   "orden": "400176128",
   "texto": "MP Mensual-Semestral Mangas TEAM",
   "clase": "Preventivo"
  },
  {
   "orden": "400371444",
   "texto": "PD Anual Mangas Thyssen",
   "clase": "Preventivo"
  },
  {
   "orden": "400047184",
   "texto": "MP Autocontenido (Sala Técnica)",
   "clase": "Preventivo"
  },
  {
   "orden": "400047185",
   "texto": "MP Autocontenido (Sala Técnica)",
   "clase": "Preventivo"
  },
  {
   "orden": "400047186",
   "texto": "MP Autocontenido (Sala Técnica)",
   "clase": "Preventivo"
  },
  {
   "orden": "400047187",
   "texto": "MP Autocontenido (Sala Técnica)",
   "clase": "Preventivo"
  },
  {
   "orden": "400047197",
   "texto": "PD Anual Mangas Thyssen",
   "clase": "Preventivo"
  },
  {
   "orden": "400049855",
   "texto": "MP Mensual-Semestral Mangas TEAM",
   "clase": "Preventivo"
  },
  {
   "orden": "400320922",
   "texto": "MP Extractores 2M",
   "clase": "Preventivo"
  },
  {
   "orden": "400408934",
   "texto": "MP Extractores 2M",
   "clase": "Preventivo"
  },
  {
   "orden": "400455650",
   "texto": "MP Extractores 2M",
   "clase": "Preventivo"
  },
  {
   "orden": "400499663",
   "texto": "MP Extractores 2M",
   "clase": "Preventivo"
  },
  {
   "orden": "400105403",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400110266",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400113129",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400125066",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400127475",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400129981",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400132339",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400144336",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400147039",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400149697",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400152275",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400157288",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400168560",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400171165",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400173595",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400176759",
   "texto": "Recorrida de salas técnicas",
   "clase": "Preventivo"
  },
  {
   "orden": "400173590",
   "texto": "RECLAMOS DE TEMPERATURAS Y SALAS TECNICA",
   "clase": "Preventivo"
  },
  {
   "orden": "400225838",
   "texto": "PD Recorrida N°1 CHECK-IN Med. Vib. MEQ",
   "clase": "Preventivo"
  },
  {
   "orden": "400336135",
   "texto": "PD Recorrida N°1 CHECK-IN Med. Vib. MEQ",
   "clase": "Preventivo"
  },
  {
   "orden": "400370945",
   "texto": "PD Recorrida N°1 CHECK-IN Med. Vib. MEQ",
   "clase": "Preventivo"
  },
  {
   "orden": "400502339",
   "texto": "PD Recorrida Nº1 Med. Vibrac. MEQ",
   "clase": "Preventivo"
  },
  {
   "orden": "400049420",
   "texto": "PD Recorrida N°2 GATERA 1 Med. Vib. MEQ",
   "clase": "Preventivo"
  },
  {
   "orden": "400047494",
   "texto": "PD Recorrida N°3 GATERA 2 Med. Vib. MEQ",
   "clase": "Preventivo"
  }
 ],
 "otSinEquipoTotal": 155
};

const OTS_SAP_POR_EQUIPO = {"AAC1270": {"n": 4, "ult": "2026-07-14", "abiertas": 1, "cerradas": 3, "correctivas": 0}, "AAC1271": {"n": 2, "ult": "2026-08-02", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC130": {"n": 20, "ult": "2026-08-08", "abiertas": 1, "cerradas": 18, "correctivas": 0}, "AAC134": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC135": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC136": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC137": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC138": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC139": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC143": {"n": 20, "ult": "2026-08-08", "abiertas": 1, "cerradas": 19, "correctivas": 0}, "AAC146": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC147": {"n": 21, "ult": "2026-08-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC1985": {"n": 4, "ult": "2026-09-03", "abiertas": 4, "cerradas": 0, "correctivas": 0}, "AAC1986": {"n": 4, "ult": "2026-09-03", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC1987": {"n": 4, "ult": "2026-09-03", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC1988": {"n": 4, "ult": "2026-09-03", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC1989": {"n": 4, "ult": "2026-09-03", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC1990": {"n": 4, "ult": "2026-09-03", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC1991": {"n": 4, "ult": "2026-09-03", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC1992": {"n": 4, "ult": "2026-09-03", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC1993": {"n": 4, "ult": "2026-09-03", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC1994": {"n": 4, "ult": "2026-09-03", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC1995": {"n": 4, "ult": "2026-09-03", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC1996": {"n": 4, "ult": "2026-09-03", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC2064": {"n": 39, "ult": "2026-09-06", "abiertas": 2, "cerradas": 36, "correctivas": 0}, "AAC2065": {"n": 38, "ult": "2026-09-05", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2066": {"n": 38, "ult": "2026-09-07", "abiertas": 2, "cerradas": 34, "correctivas": 0}, "AAC2067": {"n": 38, "ult": "2026-09-07", "abiertas": 3, "cerradas": 34, "correctivas": 0}, "AAC2068": {"n": 38, "ult": "2026-09-07", "abiertas": 3, "cerradas": 34, "correctivas": 0}, "AAC2069": {"n": 38, "ult": "2026-09-07", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2070": {"n": 38, "ult": "2026-09-05", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2071": {"n": 38, "ult": "2026-09-05", "abiertas": 2, "cerradas": 35, "correctivas": 0}, "AAC2072": {"n": 39, "ult": "2026-09-06", "abiertas": 2, "cerradas": 37, "correctivas": 0}, "AAC2073": {"n": 39, "ult": "2026-09-06", "abiertas": 2, "cerradas": 37, "correctivas": 0}, "AAC2074": {"n": 38, "ult": "2026-09-05", "abiertas": 2, "cerradas": 36, "correctivas": 0}, "AAC2075": {"n": 39, "ult": "2026-09-06", "abiertas": 2, "cerradas": 37, "correctivas": 0}, "AAC2076": {"n": 39, "ult": "2026-09-05", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2077": {"n": 40, "ult": "2026-09-05", "abiertas": 3, "cerradas": 36, "correctivas": 1}, "AAC2078": {"n": 39, "ult": "2026-09-05", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2079": {"n": 39, "ult": "2026-09-05", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2081": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2082": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2083": {"n": 2, "ult": "2026-08-05", "abiertas": 1, "cerradas": 1, "correctivas": 0}, "AAC2084": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC2085": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC2086": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC2087": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC2088": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC2089": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC2090": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC2091": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC2092": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC2093": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC2094": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC2095": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC2096": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC2097": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC2098": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC2099": {"n": 34, "ult": "2026-09-01", "abiertas": 3, "cerradas": 31, "correctivas": 0}, "AAC2113": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2114": {"n": 39, "ult": "2026-09-05", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2115": {"n": 39, "ult": "2026-09-05", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2116": {"n": 38, "ult": "2026-09-09", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2117": {"n": 38, "ult": "2026-09-09", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2118": {"n": 39, "ult": "2026-09-08", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2119": {"n": 38, "ult": "2026-09-09", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2120": {"n": 38, "ult": "2026-09-08", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2121": {"n": 38, "ult": "2026-09-09", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2122": {"n": 40, "ult": "2026-09-08", "abiertas": 3, "cerradas": 37, "correctivas": 1}, "AAC2123": {"n": 39, "ult": "2026-09-08", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2124": {"n": 40, "ult": "2026-09-08", "abiertas": 3, "cerradas": 37, "correctivas": 1}, "AAC2125": {"n": 30, "ult": "2026-08-19", "abiertas": 2, "cerradas": 28, "correctivas": 0}, "AAC2126": {"n": 31, "ult": "2026-08-19", "abiertas": 2, "cerradas": 29, "correctivas": 0}, "AAC2127": {"n": 38, "ult": "2026-09-06", "abiertas": 2, "cerradas": 36, "correctivas": 0}, "AAC2128": {"n": 38, "ult": "2026-09-08", "abiertas": 2, "cerradas": 36, "correctivas": 0}, "AAC2129": {"n": 39, "ult": "2026-09-08", "abiertas": 2, "cerradas": 37, "correctivas": 0}, "AAC2130": {"n": 39, "ult": "2026-09-06", "abiertas": 2, "cerradas": 37, "correctivas": 0}, "AAC2131": {"n": 38, "ult": "2026-09-07", "abiertas": 2, "cerradas": 36, "correctivas": 0}, "AAC2132": {"n": 39, "ult": "2026-09-06", "abiertas": 2, "cerradas": 36, "correctivas": 0}, "AAC2133": {"n": 39, "ult": "2026-09-08", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2134": {"n": 39, "ult": "2026-09-08", "abiertas": 2, "cerradas": 37, "correctivas": 0}, "AAC2135": {"n": 39, "ult": "2026-09-08", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2136": {"n": 39, "ult": "2026-09-06", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2137": {"n": 40, "ult": "2026-09-06", "abiertas": 2, "cerradas": 37, "correctivas": 0}, "AAC2138": {"n": 40, "ult": "2026-09-07", "abiertas": 2, "cerradas": 37, "correctivas": 0}, "AAC2139": {"n": 39, "ult": "2026-09-06", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2140": {"n": 39, "ult": "2026-09-07", "abiertas": 2, "cerradas": 36, "correctivas": 0}, "AAC2141": {"n": 39, "ult": "2026-09-07", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2142": {"n": 39, "ult": "2026-09-06", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2143": {"n": 39, "ult": "2026-09-06", "abiertas": 2, "cerradas": 37, "correctivas": 0}, "AAC2144": {"n": 39, "ult": "2026-09-07", "abiertas": 3, "cerradas": 36, "correctivas": 1}, "AAC2145": {"n": 40, "ult": "2026-09-07", "abiertas": 2, "cerradas": 37, "correctivas": 2}, "AAC2146": {"n": 38, "ult": "2026-09-07", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2147": {"n": 38, "ult": "2026-09-05", "abiertas": 2, "cerradas": 35, "correctivas": 0}, "AAC2148": {"n": 30, "ult": "2026-08-19", "abiertas": 2, "cerradas": 28, "correctivas": 0}, "AAC2149": {"n": 30, "ult": "2026-08-19", "abiertas": 2, "cerradas": 28, "correctivas": 0}, "AAC2150": {"n": 30, "ult": "2026-08-19", "abiertas": 2, "cerradas": 28, "correctivas": 0}, "AAC2151": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2152": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2153": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2154": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2155": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2156": {"n": 20, "ult": "2026-08-08", "abiertas": 1, "cerradas": 19, "correctivas": 0}, "AAC2157": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2158": {"n": 21, "ult": "2026-08-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2159": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2163": {"n": 21, "ult": "2026-08-06", "abiertas": 1, "cerradas": 20, "correctivas": 0}, "AAC2164": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2165": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2166": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2167": {"n": 39, "ult": "2026-09-07", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2168": {"n": 39, "ult": "2026-09-08", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2169": {"n": 38, "ult": "2026-09-08", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2170": {"n": 38, "ult": "2026-09-08", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2171": {"n": 39, "ult": "2026-09-08", "abiertas": 3, "cerradas": 36, "correctivas": 1}, "AAC2172": {"n": 38, "ult": "2026-09-08", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2173": {"n": 39, "ult": "2026-09-07", "abiertas": 3, "cerradas": 36, "correctivas": 1}, "AAC2174": {"n": 39, "ult": "2026-09-06", "abiertas": 3, "cerradas": 36, "correctivas": 1}, "AAC2175": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2176": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2177": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2178": {"n": 20, "ult": "2026-08-08", "abiertas": 1, "cerradas": 19, "correctivas": 0}, "AAC2179": {"n": 20, "ult": "2026-08-08", "abiertas": 1, "cerradas": 19, "correctivas": 0}, "AAC2180": {"n": 21, "ult": "2026-08-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2181": {"n": 21, "ult": "2026-08-06", "abiertas": 1, "cerradas": 19, "correctivas": 0}, "AAC2182": {"n": 21, "ult": "2026-08-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2184": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2185": {"n": 39, "ult": "2026-09-05", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2186": {"n": 38, "ult": "2026-09-05", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2187": {"n": 38, "ult": "2026-09-07", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2188": {"n": 39, "ult": "2026-09-03", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2189": {"n": 38, "ult": "2026-09-05", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2190": {"n": 38, "ult": "2026-09-05", "abiertas": 2, "cerradas": 36, "correctivas": 0}, "AAC2191": {"n": 39, "ult": "2026-09-05", "abiertas": 2, "cerradas": 37, "correctivas": 0}, "AAC2192": {"n": 38, "ult": "2026-09-06", "abiertas": 2, "cerradas": 35, "correctivas": 0}, "AAC2193": {"n": 38, "ult": "2026-09-06", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2194": {"n": 38, "ult": "2026-09-06", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2230": {"n": 38, "ult": "2026-09-08", "abiertas": 2, "cerradas": 36, "correctivas": 0}, "AAC2231": {"n": 38, "ult": "2026-09-09", "abiertas": 2, "cerradas": 36, "correctivas": 1}, "AAC2232": {"n": 21, "ult": "2026-08-06", "abiertas": 1, "cerradas": 20, "correctivas": 0}, "AAC2233": {"n": 21, "ult": "2026-08-06", "abiertas": 1, "cerradas": 20, "correctivas": 0}, "AAC2236": {"n": 21, "ult": "2026-08-06", "abiertas": 1, "cerradas": 20, "correctivas": 0}, "AAC2238": {"n": 21, "ult": "2026-08-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2239": {"n": 21, "ult": "2026-08-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2240": {"n": 38, "ult": "2026-09-07", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2241": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2242": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2243": {"n": 21, "ult": "2026-08-06", "abiertas": 1, "cerradas": 19, "correctivas": 0}, "AAC2244": {"n": 21, "ult": "2026-08-06", "abiertas": 1, "cerradas": 20, "correctivas": 0}, "AAC2245": {"n": 21, "ult": "2026-08-06", "abiertas": 1, "cerradas": 20, "correctivas": 0}, "AAC2246": {"n": 21, "ult": "2026-08-06", "abiertas": 1, "cerradas": 20, "correctivas": 0}, "AAC2247": {"n": 20, "ult": "2026-08-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "AAC2248": {"n": 21, "ult": "2026-08-06", "abiertas": 1, "cerradas": 20, "correctivas": 0}, "AAC2249": {"n": 21, "ult": "2026-08-06", "abiertas": 1, "cerradas": 19, "correctivas": 0}, "AAC2250": {"n": 21, "ult": "2026-08-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2251": {"n": 21, "ult": "2026-08-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2252": {"n": 21, "ult": "2026-08-06", "abiertas": 1, "cerradas": 19, "correctivas": 0}, "AAC2253": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2254": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2255": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2256": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2257": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2258": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2259": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2260": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2261": {"n": 39, "ult": "2026-09-08", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2262": {"n": 37, "ult": "2026-09-09", "abiertas": 3, "cerradas": 34, "correctivas": 0}, "AAC2263": {"n": 39, "ult": "2026-09-08", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2264": {"n": 38, "ult": "2026-09-09", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2265": {"n": 39, "ult": "2026-09-08", "abiertas": 2, "cerradas": 37, "correctivas": 0}, "AAC2266": {"n": 40, "ult": "2026-09-08", "abiertas": 3, "cerradas": 37, "correctivas": 0}, "AAC2267": {"n": 39, "ult": "2026-09-09", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2271": {"n": 39, "ult": "2026-09-08", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC2272": {"n": 39, "ult": "2026-09-08", "abiertas": 4, "cerradas": 35, "correctivas": 0}, "AAC2273": {"n": 38, "ult": "2026-09-08", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC2274": {"n": 37, "ult": "2026-09-09", "abiertas": 3, "cerradas": 33, "correctivas": 0}, "AAC236": {"n": 39, "ult": "2026-09-06", "abiertas": 4, "cerradas": 35, "correctivas": 0}, "AAC244": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC245": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC246": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2717": {"n": 42, "ult": "2026-09-03", "abiertas": 2, "cerradas": 40, "correctivas": 0}, "AAC2718": {"n": 43, "ult": "2026-09-03", "abiertas": 3, "cerradas": 40, "correctivas": 0}, "AAC2719": {"n": 40, "ult": "2026-09-03", "abiertas": 3, "cerradas": 37, "correctivas": 0}, "AAC2720": {"n": 41, "ult": "2026-09-03", "abiertas": 2, "cerradas": 39, "correctivas": 0}, "AAC2730": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2731": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC2734": {"n": 38, "ult": "2026-09-08", "abiertas": 2, "cerradas": 36, "correctivas": 0}, "AAC2735": {"n": 38, "ult": "2026-09-08", "abiertas": 2, "cerradas": 36, "correctivas": 0}, "AAC344": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3455": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3456": {"n": 21, "ult": "2026-08-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3457": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3458": {"n": 21, "ult": "2026-08-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3463": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3466": {"n": 21, "ult": "2026-08-06", "abiertas": 3, "cerradas": 18, "correctivas": 0}, "AAC3473": {"n": 38, "ult": "2026-09-09", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC3474": {"n": 38, "ult": "2026-09-09", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC3475": {"n": 38, "ult": "2026-09-08", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC3476": {"n": 38, "ult": "2026-09-08", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC3477": {"n": 38, "ult": "2026-09-08", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC3478": {"n": 38, "ult": "2026-09-08", "abiertas": 3, "cerradas": 34, "correctivas": 0}, "AAC3479": {"n": 37, "ult": "2026-09-09", "abiertas": 3, "cerradas": 34, "correctivas": 0}, "AAC3480": {"n": 37, "ult": "2026-09-09", "abiertas": 3, "cerradas": 34, "correctivas": 0}, "AAC3481": {"n": 38, "ult": "2026-09-08", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC3482": {"n": 37, "ult": "2026-09-09", "abiertas": 3, "cerradas": 34, "correctivas": 0}, "AAC3498": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3500": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3502": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3503": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3504": {"n": 39, "ult": "2026-09-08", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC3518": {"n": 38, "ult": "2026-09-07", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC3519": {"n": 38, "ult": "2026-09-06", "abiertas": 2, "cerradas": 35, "correctivas": 0}, "AAC3815": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3816": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3817": {"n": 38, "ult": "2026-09-05", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC3820": {"n": 38, "ult": "2026-09-04", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC3821": {"n": 38, "ult": "2026-09-04", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC3822": {"n": 38, "ult": "2026-09-04", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC3823": {"n": 38, "ult": "2026-09-04", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC3824": {"n": 40, "ult": "2026-09-05", "abiertas": 2, "cerradas": 38, "correctivas": 2}, "AAC3825": {"n": 40, "ult": "2026-09-05", "abiertas": 2, "cerradas": 38, "correctivas": 1}, "AAC3826": {"n": 38, "ult": "2026-09-05", "abiertas": 2, "cerradas": 36, "correctivas": 0}, "AAC3827": {"n": 38, "ult": "2026-09-05", "abiertas": 2, "cerradas": 36, "correctivas": 0}, "AAC3828": {"n": 39, "ult": "2026-09-05", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC3829": {"n": 39, "ult": "2026-09-05", "abiertas": 3, "cerradas": 36, "correctivas": 0}, "AAC3832": {"n": 36, "ult": "2026-09-04", "abiertas": 3, "cerradas": 33, "correctivas": 0}, "AAC3833": {"n": 36, "ult": "2026-09-04", "abiertas": 3, "cerradas": 33, "correctivas": 0}, "AAC3834": {"n": 36, "ult": "2026-09-09", "abiertas": 3, "cerradas": 33, "correctivas": 0}, "AAC3835": {"n": 37, "ult": "2026-09-08", "abiertas": 3, "cerradas": 34, "correctivas": 0}, "AAC3836": {"n": 37, "ult": "2026-09-09", "abiertas": 3, "cerradas": 34, "correctivas": 0}, "AAC3837": {"n": 37, "ult": "2026-09-09", "abiertas": 3, "cerradas": 34, "correctivas": 0}, "AAC3838": {"n": 37, "ult": "2026-09-09", "abiertas": 3, "cerradas": 34, "correctivas": 0}, "AAC3907": {"n": 7, "ult": "2026-03-02", "abiertas": 1, "cerradas": 6, "correctivas": 0}, "AAC3908": {"n": 21, "ult": "2026-08-02", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3909": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3910": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3911": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3912": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3913": {"n": 21, "ult": "2026-08-02", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3914": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3915": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3916": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3917": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3918": {"n": 22, "ult": "2026-08-02", "abiertas": 2, "cerradas": 20, "correctivas": 0}, "AAC3919": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3920": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3921": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3922": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3923": {"n": 22, "ult": "2026-08-02", "abiertas": 2, "cerradas": 20, "correctivas": 0}, "AAC3924": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3925": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3926": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3927": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3928": {"n": 22, "ult": "2026-09-06", "abiertas": 2, "cerradas": 20, "correctivas": 1}, "AAC3929": {"n": 22, "ult": "2026-09-06", "abiertas": 2, "cerradas": 20, "correctivas": 1}, "AAC3930": {"n": 22, "ult": "2026-09-06", "abiertas": 2, "cerradas": 20, "correctivas": 1}, "AAC3931": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3932": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3933": {"n": 21, "ult": "2026-09-06", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3942": {"n": 38, "ult": "2026-09-06", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC3943": {"n": 38, "ult": "2026-09-05", "abiertas": 3, "cerradas": 35, "correctivas": 0}, "AAC3955": {"n": 21, "ult": "2026-08-02", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "AAC3956": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3957": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3958": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3959": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3960": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3961": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3962": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3963": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3964": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3965": {"n": 22, "ult": "2026-09-01", "abiertas": 2, "cerradas": 20, "correctivas": 0}, "AAC3966": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3967": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3968": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3969": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3970": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3971": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3972": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3973": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3974": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3975": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3976": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3977": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3978": {"n": 33, "ult": "2026-09-01", "abiertas": 3, "cerradas": 30, "correctivas": 0}, "AAC3979": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3980": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3981": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3982": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3983": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3984": {"n": 22, "ult": "2026-09-01", "abiertas": 2, "cerradas": 20, "correctivas": 0}, "AAC3985": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3986": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3987": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3988": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3989": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3990": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3991": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC3992": {"n": 22, "ult": "2026-09-01", "abiertas": 2, "cerradas": 20, "correctivas": 0}, "AAC3993": {"n": 3, "ult": "2026-08-05", "abiertas": 2, "cerradas": 1, "correctivas": 1}, "AAC3994": {"n": 22, "ult": "2026-09-01", "abiertas": 2, "cerradas": 20, "correctivas": 0}, "AAC3995": {"n": 3, "ult": "2026-08-05", "abiertas": 2, "cerradas": 1, "correctivas": 1}, "AAC4100": {"n": 13, "ult": "2026-08-02", "abiertas": 3, "cerradas": 10, "correctivas": 0}, "AAC4101": {"n": 13, "ult": "2026-08-02", "abiertas": 3, "cerradas": 9, "correctivas": 0}, "AAC4102": {"n": 13, "ult": "2026-08-02", "abiertas": 3, "cerradas": 10, "correctivas": 0}, "AAC4103": {"n": 10, "ult": "2026-09-01", "abiertas": 2, "cerradas": 8, "correctivas": 0}, "AAC4104": {"n": 9, "ult": "2026-09-01", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "AAC4105": {"n": 10, "ult": "2026-09-01", "abiertas": 2, "cerradas": 8, "correctivas": 0}, "AAC4106": {"n": 15, "ult": "2026-09-01", "abiertas": 3, "cerradas": 12, "correctivas": 0}, "AAC4107": {"n": 14, "ult": "2026-09-01", "abiertas": 3, "cerradas": 11, "correctivas": 0}, "AAC4108": {"n": 15, "ult": "2026-09-01", "abiertas": 3, "cerradas": 12, "correctivas": 0}, "AAC4109": {"n": 15, "ult": "2026-09-01", "abiertas": 3, "cerradas": 12, "correctivas": 0}, "AAC4110": {"n": 14, "ult": "2026-09-01", "abiertas": 3, "cerradas": 11, "correctivas": 0}, "AAC4111": {"n": 16, "ult": "2026-09-01", "abiertas": 3, "cerradas": 13, "correctivas": 0}, "AAC4112": {"n": 13, "ult": "2026-08-02", "abiertas": 2, "cerradas": 11, "correctivas": 0}, "AAC4113": {"n": 9, "ult": "2026-08-02", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "AAC4114": {"n": 9, "ult": "2026-08-02", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "AAC4115": {"n": 9, "ult": "2026-08-02", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "AAC4116": {"n": 10, "ult": "2026-09-01", "abiertas": 2, "cerradas": 8, "correctivas": 0}, "AAC4117": {"n": 9, "ult": "2026-09-01", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "AAC4118": {"n": 13, "ult": "2026-08-02", "abiertas": 2, "cerradas": 11, "correctivas": 0}, "AAC4119": {"n": 9, "ult": "2026-08-02", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "AAC4120": {"n": 9, "ult": "2026-08-02", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "AAC4121": {"n": 9, "ult": "2026-08-02", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "AAC4122": {"n": 9, "ult": "2026-08-02", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "AAC4123": {"n": 8, "ult": "2026-08-02", "abiertas": 2, "cerradas": 6, "correctivas": 0}, "AAC4124": {"n": 9, "ult": "2026-08-02", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "AAC4125": {"n": 9, "ult": "2026-08-02", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "AAC4126": {"n": 8, "ult": "2026-08-02", "abiertas": 2, "cerradas": 6, "correctivas": 0}, "AAC4127": {"n": 8, "ult": "2026-08-02", "abiertas": 2, "cerradas": 6, "correctivas": 0}, "AAC4128": {"n": 8, "ult": "2026-08-02", "abiertas": 2, "cerradas": 6, "correctivas": 0}, "AAC4129": {"n": 8, "ult": "2026-08-02", "abiertas": 2, "cerradas": 6, "correctivas": 0}, "AAC4130": {"n": 9, "ult": "2026-08-02", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "AAC4131": {"n": 9, "ult": "2026-08-02", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "AAC4132": {"n": 13, "ult": "2026-08-11", "abiertas": 2, "cerradas": 11, "correctivas": 0}, "AAC9298": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9299": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9300": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9301": {"n": 4, "ult": "2026-09-03", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC9302": {"n": 4, "ult": "2026-09-03", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC9313": {"n": 9, "ult": "2026-09-05", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "AAC9314": {"n": 9, "ult": "2026-09-05", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "AAC9315": {"n": 9, "ult": "2026-09-05", "abiertas": 3, "cerradas": 6, "correctivas": 0}, "AAC9316": {"n": 9, "ult": "2026-09-05", "abiertas": 3, "cerradas": 6, "correctivas": 0}, "AAC9392": {"n": 32, "ult": "2026-09-06", "abiertas": 3, "cerradas": 29, "correctivas": 0}, "AAC9400": {"n": 4, "ult": "2026-09-03", "abiertas": 2, "cerradas": 2, "correctivas": 0}, "AAC9401": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9402": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9403": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9404": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9405": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9406": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9407": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9408": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9409": {"n": 3, "ult": "2026-08-05", "abiertas": 2, "cerradas": 1, "correctivas": 1}, "AAC9410": {"n": 3, "ult": "2026-08-05", "abiertas": 2, "cerradas": 1, "correctivas": 1}, "AAC9411": {"n": 3, "ult": "2026-08-05", "abiertas": 2, "cerradas": 1, "correctivas": 1}, "AAC9412": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9413": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9414": {"n": 2, "ult": "2026-08-05", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9415": {"n": 13, "ult": "2026-09-05", "abiertas": 3, "cerradas": 10, "correctivas": 0}, "AAC9416": {"n": 13, "ult": "2026-09-05", "abiertas": 3, "cerradas": 10, "correctivas": 0}, "AAC9417": {"n": 13, "ult": "2026-09-05", "abiertas": 3, "cerradas": 10, "correctivas": 0}, "AAC9418": {"n": 6, "ult": "2026-08-06", "abiertas": 2, "cerradas": 4, "correctivas": 0}, "AAC9419": {"n": 12, "ult": "2026-09-05", "abiertas": 3, "cerradas": 9, "correctivas": 0}, "AAC9422": {"n": 5, "ult": "2026-09-01", "abiertas": 3, "cerradas": 2, "correctivas": 0}, "AAC9423": {"n": 5, "ult": "2026-09-01", "abiertas": 3, "cerradas": 2, "correctivas": 0}, "AAC9424": {"n": 4, "ult": "2026-09-01", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC9425": {"n": 4, "ult": "2026-09-01", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC9426": {"n": 4, "ult": "2026-09-01", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC9427": {"n": 4, "ult": "2026-09-01", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC9428": {"n": 4, "ult": "2026-09-01", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC9429": {"n": 4, "ult": "2026-09-01", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC9430": {"n": 4, "ult": "2026-09-01", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC9431": {"n": 4, "ult": "2026-09-01", "abiertas": 3, "cerradas": 1, "correctivas": 0}, "AAC9432": {"n": 2, "ult": "2026-09-07", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9433": {"n": 2, "ult": "2026-09-07", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9434": {"n": 1, "ult": "2026-09-07", "abiertas": 1, "cerradas": 0, "correctivas": 0}, "AAC9435": {"n": 2, "ult": "2026-09-07", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AAC9436": {"n": 1, "ult": "2026-09-07", "abiertas": 1, "cerradas": 0, "correctivas": 0}, "ACO001": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO014": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO021": {"n": 16, "ult": "2026-06-03", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "ACO022": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO023": {"n": 1, "ult": "2026-07-16", "abiertas": 1, "cerradas": 0, "correctivas": 0}, "ACO027": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO032": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO035": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO036": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO041": {"n": 16, "ult": "2026-06-03", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "ACO042": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO043": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO044": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO051": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO052": {"n": 16, "ult": "2026-06-03", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "ACO053": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO054": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO055": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO056": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO057": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO058": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO059": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO060": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO061": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO062": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO378": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO379": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO380": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO381": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO382": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO383": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "ACO467": {"n": 1, "ult": "2026-07-16", "abiertas": 1, "cerradas": 0, "correctivas": 0}, "ACO468": {"n": 1, "ult": "2026-07-16", "abiertas": 1, "cerradas": 0, "correctivas": 0}, "ACO469": {"n": 1, "ult": "2026-07-16", "abiertas": 1, "cerradas": 0, "correctivas": 0}, "ACO470": {"n": 1, "ult": "2026-07-16", "abiertas": 1, "cerradas": 0, "correctivas": 0}, "ACO471": {"n": 1, "ult": "2026-07-16", "abiertas": 1, "cerradas": 0, "correctivas": 0}, "AUT474": {"n": 3, "ult": "2026-09-05", "abiertas": 3, "cerradas": 0, "correctivas": 0}, "AVO017": {"n": 40, "ult": "2026-09-02", "abiertas": 2, "cerradas": 38, "correctivas": 1}, "AVO019": {"n": 40, "ult": "2026-09-02", "abiertas": 2, "cerradas": 38, "correctivas": 2}, "AVO020": {"n": 39, "ult": "2026-09-02", "abiertas": 2, "cerradas": 37, "correctivas": 1}, "AVO021": {"n": 39, "ult": "2026-09-02", "abiertas": 2, "cerradas": 37, "correctivas": 1}, "AVO022": {"n": 39, "ult": "2026-09-02", "abiertas": 2, "cerradas": 37, "correctivas": 1}, "AVO023": {"n": 39, "ult": "2026-09-02", "abiertas": 2, "cerradas": 37, "correctivas": 1}, "AVO024": {"n": 39, "ult": "2026-09-02", "abiertas": 2, "cerradas": 37, "correctivas": 1}, "AVO1001": {"n": 19, "ult": "2026-09-01", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "AVO1005": {"n": 3, "ult": "2026-09-01", "abiertas": 3, "cerradas": 0, "correctivas": 0}, "AVO1006": {"n": 3, "ult": "2026-09-01", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AVO1007": {"n": 3, "ult": "2026-09-01", "abiertas": 2, "cerradas": 0, "correctivas": 0}, "AVO304": {"n": 39, "ult": "2026-09-02", "abiertas": 3, "cerradas": 36, "correctivas": 1}, "AVO323": {"n": 21, "ult": "2026-09-01", "abiertas": 2, "cerradas": 19, "correctivas": 1}, "AVO356": {"n": 39, "ult": "2026-09-02", "abiertas": 3, "cerradas": 36, "correctivas": 1}, "AVO404": {"n": 39, "ult": "2026-09-02", "abiertas": 3, "cerradas": 36, "correctivas": 1}, "AVO472": {"n": 39, "ult": "2026-09-02", "abiertas": 3, "cerradas": 36, "correctivas": 1}, "AVO473": {"n": 39, "ult": "2026-09-02", "abiertas": 3, "cerradas": 36, "correctivas": 1}, "AVO474": {"n": 21, "ult": "2026-09-01", "abiertas": 2, "cerradas": 19, "correctivas": 1}, "AVO475": {"n": 21, "ult": "2026-09-01", "abiertas": 2, "cerradas": 19, "correctivas": 1}, "AVO479": {"n": 11, "ult": "2026-08-13", "abiertas": 2, "cerradas": 9, "correctivas": 0}, "AVO977": {"n": 39, "ult": "2026-09-02", "abiertas": 3, "cerradas": 36, "correctivas": 1}, "AVO978": {"n": 39, "ult": "2026-09-02", "abiertas": 3, "cerradas": 36, "correctivas": 1}, "AVO979": {"n": 39, "ult": "2026-09-02", "abiertas": 3, "cerradas": 36, "correctivas": 1}, "AVO999": {"n": 20, "ult": "2026-09-01", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "CMA001": {"n": 172, "ult": "2026-09-08", "abiertas": 10, "cerradas": 162, "correctivas": 0}, "CPN15": {"n": 10, "ult": "2026-09-01", "abiertas": 3, "cerradas": 7, "correctivas": 0}, "CPN16": {"n": 10, "ult": "2026-09-01", "abiertas": 3, "cerradas": 7, "correctivas": 0}, "CTA021": {"n": 4, "ult": "2026-04-10", "abiertas": 1, "cerradas": 3, "correctivas": 0}, "CTA022": {"n": 4, "ult": "2026-04-10", "abiertas": 1, "cerradas": 3, "correctivas": 0}, "EMO1317": {"n": 20, "ult": "2026-08-03", "abiertas": 1, "cerradas": 19, "correctivas": 0}, "EMO140": {"n": 20, "ult": "2026-08-03", "abiertas": 1, "cerradas": 19, "correctivas": 0}, "EMO141": {"n": 20, "ult": "2026-08-03", "abiertas": 1, "cerradas": 19, "correctivas": 0}, "EMO142": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "EMO143": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "EMO144": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "EMO145": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "EMO146": {"n": 19, "ult": "2026-08-03", "abiertas": 1, "cerradas": 17, "correctivas": 0}, "EMO147": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "EMO148": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "EMO149": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "EMO150": {"n": 19, "ult": "2026-08-03", "abiertas": 1, "cerradas": 17, "correctivas": 0}, "EMO151": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "EMO152": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "EMO153": {"n": 19, "ult": "2026-08-03", "abiertas": 1, "cerradas": 17, "correctivas": 0}, "EMO154": {"n": 6, "ult": "2026-08-06", "abiertas": 2, "cerradas": 4, "correctivas": 0}, "EMO1569": {"n": 6, "ult": "2026-08-06", "abiertas": 2, "cerradas": 4, "correctivas": 0}, "EMO1570": {"n": 6, "ult": "2026-08-06", "abiertas": 2, "cerradas": 4, "correctivas": 0}, "EMO1573": {"n": 17, "ult": "2026-08-03", "abiertas": 2, "cerradas": 15, "correctivas": 0}, "MAN005": {"n": 48, "ult": "2026-09-02", "abiertas": 4, "cerradas": 43, "correctivas": 0}, "MAN008": {"n": 21, "ult": "2026-09-05", "abiertas": 3, "cerradas": 18, "correctivas": 0}, "MAN009": {"n": 41, "ult": "2026-09-01", "abiertas": 4, "cerradas": 37, "correctivas": 0}, "MAN010": {"n": 41, "ult": "2026-09-01", "abiertas": 4, "cerradas": 37, "correctivas": 0}, "MAN011": {"n": 49, "ult": "2026-09-02", "abiertas": 3, "cerradas": 45, "correctivas": 0}, "MAN012": {"n": 48, "ult": "2026-09-02", "abiertas": 3, "cerradas": 44, "correctivas": 0}, "MAN029": {"n": 53, "ult": "2026-09-02", "abiertas": 4, "cerradas": 48, "correctivas": 0}, "MAN030": {"n": 53, "ult": "2026-09-02", "abiertas": 3, "cerradas": 49, "correctivas": 0}, "MAN234": {"n": 12, "ult": "2026-09-02", "abiertas": 3, "cerradas": 9, "correctivas": 0}, "MAN235": {"n": 14, "ult": "2026-09-02", "abiertas": 3, "cerradas": 11, "correctivas": 0}, "MAS210": {"n": 32, "ult": "2026-09-04", "abiertas": 3, "cerradas": 29, "correctivas": 0}, "MAS212": {"n": 31, "ult": "2026-08-17", "abiertas": 2, "cerradas": 29, "correctivas": 0}, "MAS213": {"n": 31, "ult": "2026-08-17", "abiertas": 2, "cerradas": 29, "correctivas": 0}, "MAS214": {"n": 31, "ult": "2026-08-17", "abiertas": 2, "cerradas": 29, "correctivas": 0}, "MAS215": {"n": 31, "ult": "2026-08-17", "abiertas": 2, "cerradas": 29, "correctivas": 0}, "MAS218": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS219": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS220": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS221": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS222": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS223": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS224": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS225": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS226": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS227": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS228": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS229": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS230": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS231": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS232": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS233": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS234": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS235": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS580": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS581": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS582": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS583": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MAS588": {"n": 4, "ult": "2026-07-16", "abiertas": 1, "cerradas": 3, "correctivas": 0}, "MBO1144": {"n": 22, "ult": "2026-08-03", "abiertas": 3, "cerradas": 19, "correctivas": 0}, "MBO1145": {"n": 22, "ult": "2026-08-03", "abiertas": 3, "cerradas": 19, "correctivas": 0}, "MBO1146": {"n": 156, "ult": "2026-09-07", "abiertas": 9, "cerradas": 143, "correctivas": 0}, "MBO1147": {"n": 156, "ult": "2026-09-07", "abiertas": 8, "cerradas": 143, "correctivas": 0}, "MBO1153": {"n": 9, "ult": "2026-03-06", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MBO1154": {"n": 9, "ult": "2026-04-04", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MBO1155": {"n": 9, "ult": "2026-03-09", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MBO1156": {"n": 9, "ult": "2026-03-09", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MBO1157": {"n": 9, "ult": "2026-04-08", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MBO1158": {"n": 9, "ult": "2026-04-08", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MBO1159": {"n": 9, "ult": "2026-04-08", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MBO1354": {"n": 9, "ult": "2026-02-07", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MBO1355": {"n": 9, "ult": "2026-02-07", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MBO1356": {"n": 9, "ult": "2026-02-03", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MBO1426": {"n": 10, "ult": "2026-08-02", "abiertas": 2, "cerradas": 7, "correctivas": 0}, "MBO1427": {"n": 74, "ult": "2026-09-08", "abiertas": 9, "cerradas": 64, "correctivas": 0}, "MBO1428": {"n": 74, "ult": "2026-09-08", "abiertas": 9, "cerradas": 65, "correctivas": 0}, "MCD100": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MCD101": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MCD102": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MCD103": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MCD110": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MCD111": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MCD112": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD113": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD114": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD115": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD116": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD117": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD118": {"n": 20, "ult": "2026-08-05", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "MCD119": {"n": 19, "ult": "2026-08-05", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD120": {"n": 19, "ult": "2026-08-05", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD121": {"n": 19, "ult": "2026-08-05", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD122": {"n": 19, "ult": "2026-08-05", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD123": {"n": 19, "ult": "2026-08-05", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD124": {"n": 19, "ult": "2026-08-05", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD125": {"n": 20, "ult": "2026-08-05", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "MCD126": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD127": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD128": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD129": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD130": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD131": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD132": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD133": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD134": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MCD135": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "MEQ1064": {"n": 21, "ult": "2026-09-08", "abiertas": 4, "cerradas": 17, "correctivas": 0}, "MEQ1065": {"n": 21, "ult": "2026-09-08", "abiertas": 4, "cerradas": 17, "correctivas": 0}, "MEQ1074": {"n": 21, "ult": "2026-09-05", "abiertas": 5, "cerradas": 16, "correctivas": 0}, "MEQ1075": {"n": 22, "ult": "2026-09-06", "abiertas": 5, "cerradas": 17, "correctivas": 0}, "MEQ1076": {"n": 21, "ult": "2026-08-10", "abiertas": 3, "cerradas": 18, "correctivas": 0}, "MEQ1240": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1241": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1242": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1243": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1244": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1245": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1246": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1247": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1248": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1249": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1250": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1251": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1252": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1253": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1254": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1255": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1256": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1257": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1258": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1259": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1260": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1261": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1262": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1263": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1264": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1265": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1266": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1276": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1277": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1278": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1279": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1280": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1281": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1282": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1283": {"n": 16, "ult": "2026-01-30", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1284": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1285": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1287": {"n": 17, "ult": "2026-01-30", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MEQ1289": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1290": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1291": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1292": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1293": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1295": {"n": 16, "ult": "2026-06-05", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1296": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1297": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1298": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1299": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1300": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1301": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1302": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1303": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1304": {"n": 16, "ult": "2026-06-05", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1305": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1306": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1307": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1309": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1310": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1311": {"n": 14, "ult": "2026-06-05", "abiertas": 1, "cerradas": 13, "correctivas": 0}, "MEQ1312": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1313": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1314": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1315": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1316": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1318": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1319": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1320": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1321": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1322": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1324": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1325": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1326": {"n": 14, "ult": "2026-06-05", "abiertas": 1, "cerradas": 13, "correctivas": 0}, "MEQ1327": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1328": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1329": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1330": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1331": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1332": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1333": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1334": {"n": 16, "ult": "2026-06-05", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1335": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1336": {"n": 16, "ult": "2026-06-05", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1337": {"n": 16, "ult": "2026-06-05", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1338": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1339": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1340": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1341": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1342": {"n": 15, "ult": "2026-06-03", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1343": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1344": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1346": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1347": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1348": {"n": 14, "ult": "2026-06-03", "abiertas": 1, "cerradas": 13, "correctivas": 0}, "MEQ1349": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1350": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1351": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1352": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1353": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1354": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1355": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1356": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1357": {"n": 16, "ult": "2026-06-05", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1358": {"n": 16, "ult": "2026-06-05", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1359": {"n": 16, "ult": "2026-06-05", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1360": {"n": 21, "ult": "2026-08-09", "abiertas": 3, "cerradas": 18, "correctivas": 0}, "MEQ1361": {"n": 20, "ult": "2026-08-09", "abiertas": 3, "cerradas": 17, "correctivas": 0}, "MEQ1480": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1481": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1482": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1483": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1484": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1485": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1486": {"n": 17, "ult": "2026-01-30", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MEQ1488": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1489": {"n": 17, "ult": "2026-01-30", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MEQ1490": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1491": {"n": 16, "ult": "2026-01-30", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1492": {"n": 16, "ult": "2026-01-30", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1493": {"n": 16, "ult": "2026-01-30", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1494": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1495": {"n": 16, "ult": "2026-01-30", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1496": {"n": 17, "ult": "2026-01-30", "abiertas": 2, "cerradas": 15, "correctivas": 0}, "MEQ1497": {"n": 16, "ult": "2026-01-30", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1498": {"n": 9, "ult": "2026-02-04", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1499": {"n": 9, "ult": "2026-02-04", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1500": {"n": 9, "ult": "2026-02-04", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1501": {"n": 9, "ult": "2026-02-04", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1502": {"n": 9, "ult": "2026-02-04", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1503": {"n": 10, "ult": "2026-02-04", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1506": {"n": 9, "ult": "2026-02-04", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1507": {"n": 9, "ult": "2026-02-04", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1508": {"n": 9, "ult": "2026-02-04", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1509": {"n": 9, "ult": "2026-02-04", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1510": {"n": 9, "ult": "2026-02-04", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1511": {"n": 9, "ult": "2026-02-04", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1514": {"n": 9, "ult": "2026-02-04", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1515": {"n": 9, "ult": "2026-02-04", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1516": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1517": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1518": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1519": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1520": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1521": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1522": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1523": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1524": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1525": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1526": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1527": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1528": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1529": {"n": 16, "ult": "2026-06-05", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1530": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1531": {"n": 14, "ult": "2026-06-03", "abiertas": 1, "cerradas": 13, "correctivas": 0}, "MEQ1532": {"n": 16, "ult": "2026-06-05", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1533": {"n": 15, "ult": "2026-06-03", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1534": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1535": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1543": {"n": 21, "ult": "2026-08-09", "abiertas": 3, "cerradas": 18, "correctivas": 0}, "MEQ1544": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1545": {"n": 15, "ult": "2026-06-03", "abiertas": 3, "cerradas": 12, "correctivas": 0}, "MEQ1546": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1547": {"n": 21, "ult": "2026-09-08", "abiertas": 4, "cerradas": 17, "correctivas": 0}, "MEQ1548": {"n": 21, "ult": "2026-09-08", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "MEQ1549": {"n": 21, "ult": "2026-09-08", "abiertas": 3, "cerradas": 18, "correctivas": 0}, "MEQ1550": {"n": 21, "ult": "2026-09-08", "abiertas": 4, "cerradas": 17, "correctivas": 0}, "MEQ1639": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1640": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1641": {"n": 16, "ult": "2026-06-05", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1642": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1644": {"n": 16, "ult": "2026-06-05", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1645": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1646": {"n": 36, "ult": "2026-09-02", "abiertas": 3, "cerradas": 33, "correctivas": 0}, "MEQ1647": {"n": 16, "ult": "2026-06-05", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1648": {"n": 16, "ult": "2026-06-05", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1649": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1650": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1651": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1653": {"n": 36, "ult": "2026-09-02", "abiertas": 3, "cerradas": 33, "correctivas": 0}, "MEQ1654": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1655": {"n": 36, "ult": "2026-09-02", "abiertas": 3, "cerradas": 33, "correctivas": 0}, "MEQ1656": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1657": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1658": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1659": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1660": {"n": 15, "ult": "2026-06-05", "abiertas": 3, "cerradas": 12, "correctivas": 0}, "MEQ1661": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1662": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1663": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1845": {"n": 22, "ult": "2026-08-06", "abiertas": 3, "cerradas": 19, "correctivas": 1}, "MEQ1846": {"n": 21, "ult": "2026-08-05", "abiertas": 3, "cerradas": 18, "correctivas": 0}, "MEQ1847": {"n": 22, "ult": "2026-09-05", "abiertas": 4, "cerradas": 18, "correctivas": 0}, "MEQ1848": {"n": 11, "ult": "2026-01-30", "abiertas": 1, "cerradas": 10, "correctivas": 0}, "MEQ1849": {"n": 11, "ult": "2026-01-30", "abiertas": 1, "cerradas": 10, "correctivas": 0}, "MEQ1850": {"n": 10, "ult": "2026-01-30", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1851": {"n": 10, "ult": "2026-01-30", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1852": {"n": 11, "ult": "2026-01-30", "abiertas": 1, "cerradas": 10, "correctivas": 0}, "MEQ1853": {"n": 11, "ult": "2026-01-30", "abiertas": 1, "cerradas": 10, "correctivas": 0}, "MEQ1854": {"n": 11, "ult": "2026-01-30", "abiertas": 1, "cerradas": 10, "correctivas": 0}, "MEQ1855": {"n": 11, "ult": "2026-01-30", "abiertas": 1, "cerradas": 10, "correctivas": 0}, "MEQ1856": {"n": 11, "ult": "2026-01-30", "abiertas": 1, "cerradas": 10, "correctivas": 0}, "MEQ1857": {"n": 11, "ult": "2026-01-30", "abiertas": 1, "cerradas": 10, "correctivas": 0}, "MEQ1858": {"n": 11, "ult": "2026-01-30", "abiertas": 1, "cerradas": 10, "correctivas": 0}, "MEQ1859": {"n": 11, "ult": "2026-01-30", "abiertas": 1, "cerradas": 10, "correctivas": 0}, "MEQ1860": {"n": 11, "ult": "2026-01-30", "abiertas": 1, "cerradas": 10, "correctivas": 0}, "MEQ1861": {"n": 11, "ult": "2026-01-30", "abiertas": 1, "cerradas": 10, "correctivas": 0}, "MEQ1862": {"n": 11, "ult": "2026-01-30", "abiertas": 1, "cerradas": 10, "correctivas": 0}, "MEQ1863": {"n": 11, "ult": "2026-01-30", "abiertas": 1, "cerradas": 10, "correctivas": 0}, "MEQ1864": {"n": 10, "ult": "2026-01-30", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1866": {"n": 10, "ult": "2026-01-30", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1868": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1869": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1870": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1871": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1872": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1873": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1874": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1875": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1876": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1877": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1878": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1879": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1880": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1881": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1882": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1883": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 0}, "MEQ1884": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1885": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1886": {"n": 9, "ult": "2026-04-05", "abiertas": 1, "cerradas": 8, "correctivas": 0}, "MEQ1887": {"n": 10, "ult": "2026-04-05", "abiertas": 1, "cerradas": 9, "correctivas": 1}, "MEQ1888": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1889": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1890": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1891": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1892": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1893": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1894": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1895": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1896": {"n": 16, "ult": "2026-06-05", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1897": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1898": {"n": 16, "ult": "2026-06-05", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1899": {"n": 16, "ult": "2026-06-05", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1900": {"n": 16, "ult": "2026-06-05", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1901": {"n": 14, "ult": "2026-06-03", "abiertas": 1, "cerradas": 13, "correctivas": 0}, "MEQ1902": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1903": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1904": {"n": 17, "ult": "2026-07-06", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MEQ1905": {"n": 15, "ult": "2026-06-05", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "MEQ1906": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1908": {"n": 15, "ult": "2026-06-05", "abiertas": 2, "cerradas": 13, "correctivas": 0}, "MEQ1910": {"n": 15, "ult": "2026-06-05", "abiertas": 3, "cerradas": 12, "correctivas": 0}, "MEQ1911": {"n": 15, "ult": "2026-06-05", "abiertas": 3, "cerradas": 12, "correctivas": 0}, "MEQ1912": {"n": 15, "ult": "2026-06-05", "abiertas": 3, "cerradas": 12, "correctivas": 0}, "MEQ1913": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1914": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1915": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1916": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1917": {"n": 14, "ult": "2026-06-03", "abiertas": 1, "cerradas": 13, "correctivas": 0}, "MEQ1918": {"n": 16, "ult": "2026-07-06", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1919": {"n": 16, "ult": "2026-07-06", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1920": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1921": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1922": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1923": {"n": 16, "ult": "2026-07-06", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1924": {"n": 17, "ult": "2026-07-06", "abiertas": 2, "cerradas": 15, "correctivas": 0}, "MEQ1925": {"n": 17, "ult": "2026-07-06", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MEQ1926": {"n": 16, "ult": "2026-07-06", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1927": {"n": 16, "ult": "2026-07-06", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1928": {"n": 36, "ult": "2026-09-02", "abiertas": 3, "cerradas": 33, "correctivas": 0}, "MEQ1929": {"n": 16, "ult": "2026-07-06", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1930": {"n": 16, "ult": "2026-07-06", "abiertas": 2, "cerradas": 14, "correctivas": 0}, "MEQ1931": {"n": 17, "ult": "2026-07-06", "abiertas": 2, "cerradas": 15, "correctivas": 0}, "MEQ1932": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1933": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1934": {"n": 17, "ult": "2026-07-06", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MEQ1935": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1936": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1937": {"n": 16, "ult": "2026-07-06", "abiertas": 1, "cerradas": 15, "correctivas": 0}, "MEQ1938": {"n": 17, "ult": "2026-07-06", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MEQ1939": {"n": 17, "ult": "2026-07-06", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MEQ1940": {"n": 17, "ult": "2026-07-06", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MEQ1941": {"n": 17, "ult": "2026-07-06", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MEQ1942": {"n": 17, "ult": "2026-07-06", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MEQ1943": {"n": 17, "ult": "2026-07-06", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MEQ1944": {"n": 17, "ult": "2026-07-06", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MEQ1945": {"n": 17, "ult": "2026-07-06", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MEQ1946": {"n": 22, "ult": "2026-08-06", "abiertas": 2, "cerradas": 20, "correctivas": 1}, "MEQ1947": {"n": 17, "ult": "2026-07-06", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MEQ1948": {"n": 17, "ult": "2026-07-06", "abiertas": 1, "cerradas": 16, "correctivas": 0}, "MES101": {"n": 31, "ult": "2026-08-17", "abiertas": 2, "cerradas": 29, "correctivas": 0}, "MES104": {"n": 31, "ult": "2026-08-17", "abiertas": 2, "cerradas": 29, "correctivas": 0}, "MES105": {"n": 31, "ult": "2026-08-17", "abiertas": 2, "cerradas": 29, "correctivas": 0}, "MES107": {"n": 31, "ult": "2026-08-17", "abiertas": 2, "cerradas": 29, "correctivas": 0}, "MES108": {"n": 31, "ult": "2026-08-17", "abiertas": 2, "cerradas": 29, "correctivas": 0}, "MES117": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MES118": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 26, "correctivas": 0}, "MES120": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "MES121": {"n": 29, "ult": "2026-08-19", "abiertas": 2, "cerradas": 27, "correctivas": 0}, "PPA1000": {"n": 3, "ult": "2026-08-02", "abiertas": 1, "cerradas": 2, "correctivas": 0}, "PPA1001": {"n": 3, "ult": "2026-08-02", "abiertas": 2, "cerradas": 1, "correctivas": 0}, "PPA1005": {"n": 3, "ult": "2026-08-02", "abiertas": 2, "cerradas": 1, "correctivas": 0}, "PPA1006": {"n": 3, "ult": "2026-08-02", "abiertas": 2, "cerradas": 1, "correctivas": 0}, "PPA652": {"n": 20, "ult": "2026-08-03", "abiertas": 1, "cerradas": 18, "correctivas": 0}, "PPA653": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA654": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA655": {"n": 20, "ult": "2026-08-03", "abiertas": 1, "cerradas": 18, "correctivas": 0}, "PPA656": {"n": 19, "ult": "2026-08-03", "abiertas": 1, "cerradas": 17, "correctivas": 0}, "PPA664": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA665": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA666": {"n": 21, "ult": "2026-08-03", "abiertas": 2, "cerradas": 19, "correctivas": 1}, "PPA667": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA668": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA669": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA670": {"n": 21, "ult": "2026-08-03", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "PPA671": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA672": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA673": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA674": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA675": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 1}, "PPA676": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA677": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA678": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA679": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA680": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA681": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA682": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA683": {"n": 21, "ult": "2026-08-03", "abiertas": 2, "cerradas": 19, "correctivas": 1}, "PPA684": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA685": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA690": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA691": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA692": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA693": {"n": 21, "ult": "2026-08-03", "abiertas": 2, "cerradas": 19, "correctivas": 1}, "PPA694": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA695": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA696": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA697": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA698": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA699": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA700": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA701": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA703": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA704": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA706": {"n": 21, "ult": "2026-08-03", "abiertas": 2, "cerradas": 19, "correctivas": 1}, "PPA707": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA868": {"n": 20, "ult": "2026-08-05", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA869": {"n": 20, "ult": "2026-08-05", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA870": {"n": 20, "ult": "2026-08-05", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA871": {"n": 20, "ult": "2026-08-05", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA872": {"n": 20, "ult": "2026-08-05", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA911": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA912": {"n": 19, "ult": "2026-08-03", "abiertas": 2, "cerradas": 17, "correctivas": 0}, "PPA913": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA914": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA915": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA916": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA919": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA920": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA921": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA922": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA947": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA948": {"n": 20, "ult": "2026-08-03", "abiertas": 2, "cerradas": 18, "correctivas": 0}, "PPA956": {"n": 17, "ult": "2026-08-03", "abiertas": 2, "cerradas": 15, "correctivas": 0}, "PPA957": {"n": 17, "ult": "2026-08-03", "abiertas": 2, "cerradas": 15, "correctivas": 0}, "PPA958": {"n": 17, "ult": "2026-08-03", "abiertas": 2, "cerradas": 15, "correctivas": 0}, "PPA986": {"n": 6, "ult": "2026-08-21", "abiertas": 2, "cerradas": 4, "correctivas": 0}, "PPA987": {"n": 6, "ult": "2026-08-06", "abiertas": 2, "cerradas": 4, "correctivas": 0}, "PPA990": {"n": 5, "ult": "2026-09-05", "abiertas": 2, "cerradas": 3, "correctivas": 0}, "PPA991": {"n": 5, "ult": "2026-09-05", "abiertas": 2, "cerradas": 3, "correctivas": 0}, "PPA992": {"n": 5, "ult": "2026-09-05", "abiertas": 2, "cerradas": 3, "correctivas": 0}, "PPA993": {"n": 5, "ult": "2026-09-05", "abiertas": 2, "cerradas": 3, "correctivas": 0}, "PPA994": {"n": 5, "ult": "2026-09-05", "abiertas": 2, "cerradas": 3, "correctivas": 0}, "PPA995": {"n": 5, "ult": "2026-09-05", "abiertas": 2, "cerradas": 3, "correctivas": 0}, "PPA996": {"n": 5, "ult": "2026-09-05", "abiertas": 2, "cerradas": 3, "correctivas": 0}, "PPA997": {"n": 6, "ult": "2026-09-05", "abiertas": 3, "cerradas": 3, "correctivas": 0}, "PPA998": {"n": 6, "ult": "2026-09-05", "abiertas": 3, "cerradas": 3, "correctivas": 0}, "PPA999": {"n": 3, "ult": "2026-08-02", "abiertas": 1, "cerradas": 1, "correctivas": 0}, "TNQ025": {"n": 5, "ult": "2026-01-30", "abiertas": 1, "cerradas": 4, "correctivas": 0}, "TNQ026": {"n": 5, "ult": "2026-01-30", "abiertas": 1, "cerradas": 4, "correctivas": 0}, "VAL255": {"n": 21, "ult": "2026-06-03", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "VAL256": {"n": 21, "ult": "2026-06-03", "abiertas": 1, "cerradas": 20, "correctivas": 0}, "VAL257": {"n": 21, "ult": "2026-06-03", "abiertas": 1, "cerradas": 20, "correctivas": 0}, "VAL258": {"n": 21, "ult": "2026-06-03", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "VAL259": {"n": 21, "ult": "2026-06-03", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "VAL260": {"n": 21, "ult": "2026-06-03", "abiertas": 1, "cerradas": 20, "correctivas": 0}, "VAL263": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "VAL264": {"n": 15, "ult": "2026-06-03", "abiertas": 1, "cerradas": 14, "correctivas": 0}, "VAL265": {"n": 21, "ult": "2026-06-03", "abiertas": 1, "cerradas": 20, "correctivas": 0}, "VAL266": {"n": 21, "ult": "2026-06-03", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "VAL267": {"n": 21, "ult": "2026-06-03", "abiertas": 2, "cerradas": 19, "correctivas": 0}, "VAL268": {"n": 21, "ult": "2026-06-03", "abiertas": 1, "cerradas": 20, "correctivas": 0}, "MEQ1487": {"n": 17, "ult": "2026-01-30", "abiertas": 0, "cerradas": 17, "correctivas": 0}, "MEQ1865": {"n": 10, "ult": "2026-01-30", "abiertas": 0, "cerradas": 10, "correctivas": 0}, "MEQ1867": {"n": 11, "ult": "2026-01-30", "abiertas": 0, "cerradas": 11, "correctivas": 0}, "AAC3486": {"n": 20, "ult": "2026-05-06", "abiertas": 0, "cerradas": 20, "correctivas": 0}, "AAC3487": {"n": 20, "ult": "2026-05-06", "abiertas": 0, "cerradas": 20, "correctivas": 0}, "AAC9420": {"n": 9, "ult": "2026-06-05", "abiertas": 0, "cerradas": 9, "correctivas": 0}, "AVO247": {"n": 14, "ult": "2026-01-30", "abiertas": 0, "cerradas": 14, "correctivas": 1}, "CPN1": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "CPN10": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "CPN11": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "CPN12": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "CPN13": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "CPN14": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "CPN17": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "CPN18": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "CPN2": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "CPN3": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "CPN4": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "CPN5": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "CPN6": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "CPN7": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "CPN8": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "CPN9": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "EPO001": {"n": 2, "ult": "2025-09-08", "abiertas": 0, "cerradas": 2, "correctivas": 1}, "MEQ1267": {"n": 17, "ult": "2026-01-30", "abiertas": 0, "cerradas": 17, "correctivas": 0}, "MEQ1268": {"n": 17, "ult": "2026-01-30", "abiertas": 0, "cerradas": 17, "correctivas": 0}, "MEQ1269": {"n": 17, "ult": "2026-01-30", "abiertas": 0, "cerradas": 17, "correctivas": 0}, "MEQ1270": {"n": 17, "ult": "2026-01-30", "abiertas": 0, "cerradas": 17, "correctivas": 0}, "MEQ1271": {"n": 17, "ult": "2026-01-30", "abiertas": 0, "cerradas": 17, "correctivas": 0}, "MEQ1272": {"n": 17, "ult": "2026-01-30", "abiertas": 0, "cerradas": 17, "correctivas": 0}, "MEQ1273": {"n": 17, "ult": "2026-01-30", "abiertas": 0, "cerradas": 17, "correctivas": 0}, "MEQ1274": {"n": 17, "ult": "2026-01-30", "abiertas": 0, "cerradas": 17, "correctivas": 0}, "MEQ1275": {"n": 18, "ult": "2026-01-30", "abiertas": 0, "cerradas": 18, "correctivas": 1}, "MEQ1286": {"n": 16, "ult": "2026-01-30", "abiertas": 0, "cerradas": 16, "correctivas": 0}, "MEQ1288": {"n": 16, "ult": "2026-01-30", "abiertas": 0, "cerradas": 16, "correctivas": 0}, "MEQ1294": {"n": 16, "ult": "2026-06-05", "abiertas": 0, "cerradas": 16, "correctivas": 0}, "MEQ1317": {"n": 15, "ult": "2026-06-05", "abiertas": 0, "cerradas": 15, "correctivas": 0}, "MEQ1504": {"n": 9, "ult": "2026-02-04", "abiertas": 0, "cerradas": 9, "correctivas": 0}, "MEQ1505": {"n": 9, "ult": "2026-02-04", "abiertas": 0, "cerradas": 9, "correctivas": 0}, "MEQ1512": {"n": 9, "ult": "2026-02-04", "abiertas": 0, "cerradas": 9, "correctivas": 0}, "MEQ1513": {"n": 9, "ult": "2026-02-04", "abiertas": 0, "cerradas": 9, "correctivas": 0}, "MES119": {"n": 27, "ult": "2026-06-20", "abiertas": 0, "cerradas": 27, "correctivas": 0}, "PPA1002": {"n": 2, "ult": "2026-06-01", "abiertas": 0, "cerradas": 2, "correctivas": 0}, "PPA1003": {"n": 2, "ult": "2026-06-01", "abiertas": 0, "cerradas": 2, "correctivas": 0}, "PPA1004": {"n": 2, "ult": "2026-06-01", "abiertas": 0, "cerradas": 2, "correctivas": 0}, "PPA686": {"n": 18, "ult": "2026-04-02", "abiertas": 0, "cerradas": 18, "correctivas": 0}, "PPA687": {"n": 18, "ult": "2026-04-02", "abiertas": 0, "cerradas": 18, "correctivas": 0}, "PPA688": {"n": 18, "ult": "2026-04-02", "abiertas": 0, "cerradas": 18, "correctivas": 0}, "PPA689": {"n": 18, "ult": "2026-04-02", "abiertas": 0, "cerradas": 18, "correctivas": 0}, "PPA702": {"n": 17, "ult": "2026-04-02", "abiertas": 0, "cerradas": 17, "correctivas": 0}, "PPA705": {"n": 18, "ult": "2026-04-02", "abiertas": 0, "cerradas": 18, "correctivas": 0}, "PPA708": {"n": 18, "ult": "2026-04-02", "abiertas": 0, "cerradas": 18, "correctivas": 0}, "PPA709": {"n": 18, "ult": "2026-04-02", "abiertas": 0, "cerradas": 18, "correctivas": 0}, "TNQ023": {"n": 2, "ult": "2024-07-03", "abiertas": 0, "cerradas": 2, "correctivas": 0}, "AVO269": {"n": 7, "ult": "2024-09-28", "abiertas": 0, "cerradas": 7, "correctivas": 0}, "PPA988": {"n": 2, "ult": "2026-03-12", "abiertas": 0, "cerradas": 2, "correctivas": 0}, "UTA086": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 7}, "UTA205": {"n": 7, "ult": "2026-06-03", "abiertas": 0, "cerradas": 7, "correctivas": 7}, "AVO1000": {"n": 1, "ult": "2025-06-13", "abiertas": 0, "cerradas": 1, "correctivas": 1}, "MEQ1949": {"n": 1, "ult": "2024-08-02", "abiertas": 0, "cerradas": 1, "correctivas": 0}, "MEQ1950": {"n": 1, "ult": "2024-08-02", "abiertas": 0, "cerradas": 1, "correctivas": 0}, "MEQ1951": {"n": 1, "ult": "2024-08-05", "abiertas": 0, "cerradas": 1, "correctivas": 0}, "MEQ1952": {"n": 1, "ult": "2024-08-05", "abiertas": 0, "cerradas": 1, "correctivas": 0}, "MEQ1953": {"n": 1, "ult": "2024-09-03", "abiertas": 0, "cerradas": 1, "correctivas": 0}, "MEQ1998": {"n": 1, "ult": "2024-09-03", "abiertas": 0, "cerradas": 1, "correctivas": 0}, "MEQ1999": {"n": 1, "ult": "2024-08-05", "abiertas": 0, "cerradas": 1, "correctivas": 0}, "PLC008": {"n": 1, "ult": "2025-03-04", "abiertas": 0, "cerradas": 1, "correctivas": 0}, "PLC009": {"n": 1, "ult": "2025-03-04", "abiertas": 0, "cerradas": 1, "correctivas": 0}, "PPA917": {"n": 2, "ult": "2024-07-03", "abiertas": 0, "cerradas": 2, "correctivas": 0}, "TNQ022": {"n": 1, "ult": "2024-06-28", "abiertas": 0, "cerradas": 1, "correctivas": 0}};
