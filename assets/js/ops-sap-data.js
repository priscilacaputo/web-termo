/* ─── OPS_SAP_RESUMEN — lista de operaciones de OT (IW49, TER+MEC) ───
   Fuente: lista de operaciones.xlsx. 4604 operaciones de 2161 OTs.
   NO trae componentes/materiales ni ejecución real (todas PEND / ABIE).
   Aporta: texto de cada paso del plan y HH planificadas por puesto de trabajo.
   Regenerar con scratchpad/gen_ops.py. */

const OPS_SAP_RESUMEN = {
 "fuente": "lista de operaciones.xlsx (operaciones de OT, IW49 · TER + MEC)",
 "operaciones": 4604,
 "ordenes": 2161,
 "sinComponentes": true,
 "sinEjecucionReal": true,
 "hhPlanificadasTotal": 5274,
 "hhOverhead": 4,
 "nOverhead": 159,
 "porPuestoHH": [
  {
   "k": "AUX_TER",
   "h": 2205
  },
  {
   "k": "AUX_MEC",
   "h": 1918
  },
  {
   "k": "MOEX",
   "h": 737
  },
  {
   "k": "AUX_ELC",
   "h": 253
  },
  {
   "k": "AUE_MEC",
   "h": 150
  },
  {
   "k": "AUX_INF",
   "h": 12
  }
 ],
 "porPuestoOps": [
  {
   "k": "MOEX",
   "n": 1953
  },
  {
   "k": "AUX_MEC",
   "n": 1573
  },
  {
   "k": "AUX_TER",
   "n": 775
  },
  {
   "k": "AUX_ELC",
   "n": 233
  },
  {
   "k": "AUE_MEC",
   "n": 64
  },
  {
   "k": "AUX_INF",
   "n": 6
  }
 ],
 "opsPorOrden": {
  "una": 1984,
  "variasOps": 177,
  "max": 53
 },
 "topTextosOperacion": [
  {
   "t": "MP Trimestral Tramo Recto VDL",
   "n": 218
  },
  {
   "t": "MP Bimestral VRF",
   "n": 193
  },
  {
   "t": "MP Bimestral Split Sala Técnica",
   "n": 171
  },
  {
   "t": "MP Mensual Roof Top Cambio FIltro",
   "n": 141
  },
  {
   "t": "MP Bimestral Puertas autom. Deslizantes",
   "n": 139
  },
  {
   "t": "MP Semestral check in VanderLande",
   "n": 99
  },
  {
   "t": "MP Semestral VRF",
   "n": 93
  },
  {
   "t": "MP Anual VRF",
   "n": 91
  },
  {
   "t": "MP 3M Cinta Banda VanderLande",
   "n": 84
  },
  {
   "t": "MP Semestral Cinta Inyectora VDL",
   "n": 79
  },
  {
   "t": "Preventivo Mensual SplitsMP Bimestral",
   "n": 75
  },
  {
   "t": "MP Trimestral Cortinas de aire",
   "n": 72
  },
  {
   "t": "Verificar que la lectura en el tablero d",
   "n": 66
  },
  {
   "t": "MP Trimestral Roof Top R410 A",
   "n": 58
  },
  {
   "t": "Inspección Mensual Vehículos",
   "n": 57
  },
  {
   "t": "MP Mensual Ascensores Fujitec",
   "n": 55
  },
  {
   "t": "Preventivo Bimestral Splits",
   "n": 53
  },
  {
   "t": "Preventivo Bimestral Cortina Gatera 2M",
   "n": 48
  },
  {
   "t": "MP Bimestral cintas  Van Der Land",
   "n": 45
  },
  {
   "t": "Tomar temperatura de inyección y",
   "n": 44
  }
 ],
 "ordenesMasComplejas": [
  {
   "orden": "400411881",
   "ops": 53
  },
  {
   "orden": "400411890",
   "ops": 53
  },
  {
   "orden": "400411900",
   "ops": 53
  },
  {
   "orden": "400411919",
   "ops": 53
  },
  {
   "orden": "400411928",
   "ops": 53
  },
  {
   "orden": "400425790",
   "ops": 44
  },
  {
   "orden": "400428859",
   "ops": 44
  },
  {
   "orden": "400428861",
   "ops": 44
  },
  {
   "orden": "400431917",
   "ops": 44
  },
  {
   "orden": "400431920",
   "ops": 44
  },
  {
   "orden": "400521880",
   "ops": 44
  },
  {
   "orden": "400521885",
   "ops": 44
  }
 ]
};
