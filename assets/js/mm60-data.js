/* ─── MM60_RESUMEN / MM60_BOM — maestro de materiales (MM60) ───
   Fuente: EXPORT_20260909165504.xlsx. 23055 materiales distintos (centro AEP).
   MM60_BOM: index material->{abc,precio,um,grupoArt,tipo,texto} solo para los
   materiales que están en PANOL_REPUESTOS (BOM). El stock sale de PANOL_DATA
   (MB52). Regenerar con scratchpad/gen_mm60.py. */

const MM60_RESUMEN = {
 "fuente": "EXPORT_20260909165504.xlsx (MM60 · maestro de materiales, centro AEP)",
 "materiales": 23055,
 "porTipo": [
  {
   "k": "ZMAT",
   "n": 22335
  },
  {
   "k": "ZSER",
   "n": 707
  },
  {
   "k": "AERO",
   "n": 13
  }
 ],
 "porABC": [
  {
   "k": "(sin ABC)",
   "n": 19950
  },
  {
   "k": "A",
   "n": 903
  },
  {
   "k": "C",
   "n": 884
  },
  {
   "k": "X",
   "n": 677
  },
  {
   "k": "B",
   "n": 641
  }
 ],
 "sinABC": 19950,
 "precioCero": 1087,
 "topGrupoArt": [
  {
   "k": "61",
   "n": 5547
  },
  {
   "k": "55",
   "n": 2915
  },
  {
   "k": "17",
   "n": 2494
  },
  {
   "k": "306",
   "n": 1710
  },
  {
   "k": "20",
   "n": 1302
  },
  {
   "k": "16",
   "n": 890
  },
  {
   "k": "336",
   "n": 812
  },
  {
   "k": "41",
   "n": 574
  },
  {
   "k": "341",
   "n": 504
  },
  {
   "k": "26",
   "n": 478
  },
  {
   "k": "185",
   "n": 404
  },
  {
   "k": "19",
   "n": 388
  },
  {
   "k": "32",
   "n": 331
  },
  {
   "k": "337",
   "n": 299
  },
  {
   "k": "18",
   "n": 278
  }
 ],
 "panolEnMaestro": 22315,
 "panolFueraDelMaestro": [],
 "bomTotal": 237,
 "bomEnMaestro": 231,
 "bomSinCodigoReal": [
  "?CORREA B-36/37/38",
  "?FILTRO 600X420X50",
  "?FILTRO 620X500X50",
  "?MOTOR ALIMENTACIÓN 20HP",
  "?MOTOR ALIMENTACIÓN S/D",
  "?MOTOR RETORNO S/D"
 ],
 "bomSinABC": [
  "20002320",
  "20005647",
  "20006518",
  "20006519",
  "20006526",
  "20006527",
  "20006544",
  "20006546",
  "20006585",
  "20007235",
  "20012254",
  "20034265",
  "20037963",
  "20041154",
  "20041155",
  "20043980",
  "20045232",
  "20047395",
  "20054885",
  "20055854",
  "20055857",
  "20055858",
  "20055863",
  "20055865",
  "20055867",
  "20055868",
  "20055872",
  "20055876",
  "20055893",
  "20055896",
  "20055898",
  "20055915",
  "20055916",
  "20055934",
  "20055945",
  "20055951",
  "20055956",
  "20055959",
  "20055960",
  "20055965",
  "20055966",
  "20055967",
  "20055968",
  "20055971",
  "20055972",
  "20055990",
  "20055996",
  "20056000",
  "20056016",
  "20056059",
  "20056808",
  "20056874",
  "20060095",
  "20065064",
  "20065067",
  "20065069",
  "20065073",
  "20065079",
  "20065080",
  "20065221",
  "20066253",
  "20066685",
  "20066702",
  "20067335",
  "20067336",
  "20067338",
  "20067350",
  "20067802",
  "20067803",
  "20069055",
  "20069376",
  "20070757",
  "20077847",
  "20081410",
  "20082966",
  "20085102",
  "20085168",
  "20085169",
  "20085700",
  "20085918",
  "20085933",
  "20086058",
  "20087762",
  "20087819",
  "20087829",
  "20087854",
  "20087933",
  "20088183",
  "20088185",
  "20088186",
  "20088187",
  "20088188",
  "20088191",
  "20088192",
  "20088193",
  "20088712",
  "20089275",
  "20090467",
  "20206580"
 ]
};

const MM60_BOM = {"20055876": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "A9215692 JACK, HYDRAULIC, 4 TON, THY"}, "20088192": {"abc": "", "precio": 1.0, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "MOTOR -W22 12,5 HP BORN.SUP CARCAZA 132M"}, "20065073": {"abc": "", "precio": 20987.6, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA SPB 2000"}, "20201561": {"abc": "B", "precio": 27600.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO CABINA-SPRINTER-PROILTER"}, "20055951": {"abc": "", "precio": 1.0, "grupoArt": "25", "tipo": "ZMAT", "um": "C/U", "texto": "2556254 FUSE,600V,20A,CLASS CC THY"}, "20206491": {"abc": "A", "precio": 1.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "MOTOR DE ARRANQUE HILUX 2.5 D-4D (2KD)"}, "20055972": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "00009304760 ROLLER LEVER, ADJ. THY"}, "20078444": {"abc": "C", "precio": 132729.61, "grupoArt": "336", "tipo": "ZMAT", "um": "C/U", "texto": "COMPRESOR DAIKIN JT125G-P8Y1"}, "20001744": {"abc": "B", "precio": 6306.26, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA A42"}, "20088187": {"abc": "", "precio": 1.0, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "MOTOR -W22 7.5 HP BORN.SUP CARCAZA 132S"}, "20045232": {"abc": "", "precio": 1.0, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE PES PLIS 500X500X50 MERV8"}, "20206492": {"abc": "A", "precio": 1.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "SOLENOIDE ARRANQUE HILUX 2.4 D-4D (2GD)"}, "20201559": {"abc": "B", "precio": 90700.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO COMBUSTIBLE-SPRINTER-MAHEL"}, "20096478": {"abc": "B", "precio": 340000.0, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "EJE RETORNO SAE1040 1300MM Ø=1″ CHAV=8MM"}, "20055867": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "00006583320 M12 X 25, HEX HD GR. 8.8 THY"}, "20011522": {"abc": "A", "precio": 115052.94, "grupoArt": "315", "tipo": "ZMAT", "um": "C/U", "texto": "CONMUTADOR ROTATIVO TELEMECANI TEEZB4BGO"}, "20065222": {"abc": "A", "precio": 6965.01, "grupoArt": "61", "tipo": "ZMAT", "um": "C/U", "texto": "PULSADOR PLASTICO AZUL 22MM"}, "20206494": {"abc": "A", "precio": 1.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "PASTILLAS DE FRENO DEL HILUX (2017-2025)"}, "20006546": {"abc": "", "precio": 26.32, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE PES PLIS 500X400X50 MERV8"}, "20055864": {"abc": "A", "precio": 105.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "00006591440 M16 X 70, HEX HD GR 10.9 THY"}, "20206580": {"abc": "", "precio": 1.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "CABLE ESPIRAL CINTA AIRBAG TOYOTA HILUX"}, "20055894": {"abc": "A", "precio": 2150.91, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2510608 SW,LIM,LEVER ARM,2INCH THY"}, "20065144": {"abc": "A", "precio": 70720.01, "grupoArt": "341", "tipo": "ZMAT", "um": "C/U", "texto": "BORRADO*PORTA RODAMIENTO PME-50 N FA273"}, "20089275": {"abc": "", "precio": 1.0, "grupoArt": "330", "tipo": "ZMAT", "um": "C/U", "texto": "AMORTIGUADOR CAUCHO 40X50X34"}, "20065189": {"abc": "A", "precio": 28363.5, "grupoArt": "341", "tipo": "ZMAT", "um": "C/U", "texto": "RODAMIENTO Ø=40 INA GAY40-XL-NPP-B"}, "20078442": {"abc": "C", "precio": 805956.25, "grupoArt": "336", "tipo": "ZMAT", "um": "C/U", "texto": "COMPRESOR COOPELAND ZP16HSE-PFJ-600"}, "20065069": {"abc": "", "precio": 11032.68, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA B81"}, "20055966": {"abc": "", "precio": 41544.6, "grupoArt": "61", "tipo": "ZMAT", "um": "C/U", "texto": "RELÉ C/LED 6A 4NANC 24VCC RXM4AB2BD"}, "20040700": {"abc": "A", "precio": 243317.17, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "BANDA ASTER 15W1F ANCHO 500 LONG 3240"}, "20078448": {"abc": "C", "precio": 1.0, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "PLACA CONTROL MOD 54115401-50FE1015"}, "20065080": {"abc": "", "precio": 16980.0, "grupoArt": "27", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA SPZ 1687"}, "20034274": {"abc": "A", "precio": 12738.58, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "RUEDA GUIA ø90 C/RODAMIENTO VDL"}, "20206483": {"abc": "A", "precio": 1.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "POLEA TENSOR POLI V HILUX 2.4-2.8"}, "20070749": {"abc": "B", "precio": 13134.33, "grupoArt": "61", "tipo": "ZMAT", "um": "C/U", "texto": "CONTACTO AUXIL. SECCION. 3LD9200-5C"}, "20058373": {"abc": "A", "precio": 4815372.54, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "BANDA CURVA 90° ANCHO 1120mm"}, "20201566": {"abc": "B", "precio": 21800.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO ACEITE-WEGA H1 JFO-0505P"}, "20065166": {"abc": "A", "precio": 206215.17, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "PLACA DISPLAY LCD AIRPORT (visor balanz)"}, "20056031": {"abc": "A", "precio": 273463.8, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "A5228418 PUMP HOSE ASSEMBLY THY"}, "20005296": {"abc": "B", "precio": 102.63, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA A35"}, "20055863": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "00005143290 M12 X 40, SOC HD, GR 8.8 THY"}, "20034275": {"abc": "A", "precio": 559732.76, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "CONJ POLEA TENSORA Ø205MM L8343-00001VDL"}, "20043980": {"abc": "", "precio": 29232.24, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA 5VX710"}, "20006527": {"abc": "", "precio": 1.0, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE PLISADO 570X550X20MM"}, "20001016": {"abc": "A", "precio": 0.0, "grupoArt": "26", "tipo": "ZMAT", "um": "C/U", "texto": "BROCHE A°I° CINTA UX1SPS12 X300MM"}, "20088183": {"abc": "", "precio": 1.0, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "MOTOR -W22 10 HP BORN.SUP CARCAZA 132M"}, "20055916": {"abc": "", "precio": 1.0, "grupoArt": "61", "tipo": "ZMAT", "um": "C/U", "texto": "SELECTOR 2 POSICIONES CON LLAVE ZB4-BG6"}, "20034265": {"abc": "", "precio": 871204.69, "grupoArt": "26", "tipo": "ZMAT", "um": "C/U", "texto": "RUEDA LIBRE GFR-35-F1F2-L"}, "20005647": {"abc": "", "precio": 10049.0, "grupoArt": "61", "tipo": "ZMAT", "um": "C/U", "texto": "SELECTORA 3POS MILKA 10A220V"}, "20096746": {"abc": "X", "precio": 725000.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "CREMALLERA DIR HIDRAULICA HILUX 2005-15"}, "20065188": {"abc": "A", "precio": 301004.27, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "RODILLO CONICO TENSOR PARA BC DINAMIC"}, "20078443": {"abc": "C", "precio": 135938.05, "grupoArt": "336", "tipo": "ZMAT", "um": "C/U", "texto": "COMPRESOR DAIKIN JT170G-P8Y1"}, "20065142": {"abc": "B", "precio": 520.92, "grupoArt": "341", "tipo": "ZMAT", "um": "C/U", "texto": "BORRADO*RODAMIENTO PCJ-35 EN119"}, "20065064": {"abc": "", "precio": 7957.0, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA B62"}, "20065067": {"abc": "", "precio": 23457.66, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA SPZ 1087"}, "20086058": {"abc": "", "precio": 3980823.26, "grupoArt": "26", "tipo": "ZMAT", "um": "C/U", "texto": "MOTORR KA37 DRN80MK4/BE1HR 0,55KW-89"}, "20201562": {"abc": "B", "precio": 13100.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO ACEITE-PEUGEOT PARTNER"}, "20085168": {"abc": "", "precio": 3259720.0, "grupoArt": "336", "tipo": "ZMAT", "um": "C/U", "texto": "COMPRESOR ZP103KCE-TFD-250, 380V P/R410"}, "20055868": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2006311-01450805/8-11UNCx4 1/2 HEX HDTHY"}, "20056000": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "25724082 HORN,24VDC,INDOOR,78-101dB THY"}, "20085933": {"abc": "", "precio": 469887.57, "grupoArt": "336", "tipo": "ZMAT", "um": "C/U", "texto": "SENSOR TEMPERATURA LENNOX 93J5301"}, "20065187": {"abc": "A", "precio": 297248.6, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "RODILLO CONICO ACCIONADO EXT DINAMIC"}, "20201550": {"abc": "B", "precio": 14900.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO DE ACEITE-RENAULT KANGOO"}, "20067336": {"abc": "", "precio": 11275.63, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "EJE RUEDA DE CADENA 0P9754-00001 VDL"}, "20066761": {"abc": "A", "precio": 12109.5, "grupoArt": "341", "tipo": "ZMAT", "um": "C/U", "texto": "BORRADO*PORTARODAMIENTO SF35EC"}, "20067798": {"abc": "A", "precio": 106289.6, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "RODILLO RETORNO ?60 LONG.1200MM VDL"}, "20047395": {"abc": "", "precio": 5777.0, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA A-40"}, "20065062": {"abc": "B", "precio": 17206.13, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA 5VX 560"}, "20082966": {"abc": "", "precio": 80649.04, "grupoArt": "26", "tipo": "ZMAT", "um": "C/U", "texto": "MOTORR K57 DRN100L4/M6A-0 2,2KW-48"}, "20201552": {"abc": "B", "precio": 13800.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO HABITACULO-RENAULT KANGOO"}, "20055915": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2552216 CONT BLK, 1 N.O. 1 N.O. THY"}, "20034264": {"abc": "A", "precio": 445613.16, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "BORRADO*CORREA OPTIBELT 3492–PL–12"}, "20066690": {"abc": "B", "precio": 10102.49, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "MOTOR DE EJE DE RUEDAS THY 7,5 HP"}, "20085024": {"abc": "B", "precio": 4168.18, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "SOPORTE RODAMIENTO EXTERIOR CURVA VDL"}, "20206497": {"abc": "A", "precio": 1.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "BOMBA DE AGUA HILUX 2.5 D-4D (2KD)"}, "20055996": {"abc": "", "precio": 1.0, "grupoArt": "25", "tipo": "ZMAT", "um": "C/U", "texto": "25561294 FUSE,600V,30A,CLASS RK5 THY"}, "20055940": {"abc": "A", "precio": 496.96, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2556071 FUSE,250V,1A, FAST ACT THY"}, "20055877": {"abc": "A", "precio": 0.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "A3973506 EQUALIZING CABLE, LONG THY"}, "20064445": {"abc": "B", "precio": 15534.21, "grupoArt": "341", "tipo": "ZMAT", "um": "C/U", "texto": "RODAMIENTO RAE30NPPB"}, "20006520": {"abc": "B", "precio": 10289.04, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE PLIS 400X650X50 MERV13"}, "20066253": {"abc": "", "precio": 1.0, "grupoArt": "25", "tipo": "ZMAT", "um": "L", "texto": "LIQUIDO HIDRAULICO MOBIL AERO HFA o HF"}, "20001731": {"abc": "B", "precio": 269.32, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA 5V 750"}, "20055871": {"abc": "A", "precio": 507905.07, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "A4230293 PULLY RT THY"}, "20055969": {"abc": "A", "precio": 153.93, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2597079 RELAY,HOLD DOWN,MINI,PLUG IN THY"}, "20201560": {"abc": "B", "precio": 31100.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO CABINA-SPRINTER-UNIFIL"}, "20066260": {"abc": "B", "precio": 10830.13, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA B66"}, "20206484": {"abc": "A", "precio": 1.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "Alternador Hilux 2.5-3.0 SIN DEPRESOR"}, "20077847": {"abc": "", "precio": 58914.89, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "MOTORR KA37T DRN90S4/BE2 1,1KW-178"}, "20085020": {"abc": "A", "precio": 435144.63, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "RODILLO CONICO MOTOR EXT p/CURVA"}, "20085918": {"abc": "", "precio": 0.0, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "MOTORED KA37DRS71M4BE1HR/AND8 RPM1700/62"}, "20005298": {"abc": "X", "precio": 6.96, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA A47"}, "20056027": {"abc": "A", "precio": 79626.31, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "A5228414 LEVEL GAUGE THY"}, "20056809": {"abc": "A", "precio": 44124.14, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2610144 COUPLING TEST HYDRAULC (PURG)THY"}, "20065147": {"abc": "A", "precio": 256855.87, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "BRAZO GUIA CENTRAJE"}, "20090467": {"abc": "", "precio": 128503.19, "grupoArt": "61", "tipo": "ZMAT", "um": "C/U", "texto": "SENSOR OPTICO  ML100-55/103/115b"}, "20034278": {"abc": "A", "precio": 838.33, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "CONJUNTO RODILLO PRESION"}, "20056874": {"abc": "", "precio": 9282.6, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA B73"}, "20006544": {"abc": "", "precio": 384.39, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE PES PLIS 600X500X50 MERV8"}, "20206498": {"abc": "A", "precio": 1.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "BOMBA DE AGUA HILUX 2.4 D-4D (2GD)"}, "20201556": {"abc": "B", "precio": 23600.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE-WEGA H1 JFA-0579"}, "20055971": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "00009304420 END PLUNGER (CSA) THY"}, "20067334": {"abc": "A", "precio": 7768.73, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "CASQUILLO DISTANCIADOR 006881-04514 VDL"}, "20090711": {"abc": "B", "precio": 359179.5, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "ASSY DRUM VERTIBELT/082783-939-00001"}, "20055865": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "00006565070 M16 X 60, SOC HD GR 12.9 THY"}, "20056059": {"abc": "", "precio": 1.0, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "RESISTENCIA UTA TROX 790MM 2,1 A 2,4 KW"}, "20070779": {"abc": "A", "precio": 0.0, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "CASQUILLO BRONCE BP25C 22/29x18"}, "20041154": {"abc": "", "precio": 1.0, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE PLISADO 500 X 450 X 50 MM"}, "20055948": {"abc": "A", "precio": 1990.96, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2556132 FUSE,600V,60A,CLASS RK5 THY"}, "20055959": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2572304 ALARM,24V,SONLRT,SC628ANP THY"}, "20011092": {"abc": "A", "precio": 753.82, "grupoArt": "26", "tipo": "ZMAT", "um": "M", "texto": "PASADOR P/EMPALME MECAN NYS065-C FLEXCO"}, "20066760": {"abc": "B", "precio": 0.0, "grupoArt": "341", "tipo": "ZMAT", "um": "C/U", "texto": "RODAMIENTO 6003 2RS/C3"}, "20081008": {"abc": "B", "precio": 2062.09, "grupoArt": "341", "tipo": "ZMAT", "um": "C/U", "texto": "RETEN W AS45X75X8-NBR 0011524X"}, "20001793": {"abc": "B", "precio": 2088.66, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA B56"}, "20055872": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "A4230294 PULLY LT THY"}, "20069376": {"abc": "", "precio": 95.48, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA SPZ 1025"}, "20065221": {"abc": "", "precio": 16617.55, "grupoArt": "61", "tipo": "ZMAT", "um": "C/U", "texto": "SELECTOR TRES POSICIONES 22MM"}, "20087762": {"abc": "", "precio": 2880328.95, "grupoArt": "348", "tipo": "ZMAT", "um": "C/U", "texto": "BORRADO*BANDA CURVA 016690-071-04090"}, "20206495": {"abc": "A", "precio": 1.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "PASTILLAS DE FRENO DEL HILUX (2012-2016)"}, "20055934": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2552422 HMI,MEM,128MB CF CARD THY"}, "20055995": {"abc": "A", "precio": 1954.76, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "25561293 FUSE,600V,25A,CLASS RK5 THY"}, "20037963": {"abc": "", "precio": 4302.03, "grupoArt": "341", "tipo": "ZMAT", "um": "C/U", "texto": "RODAMIENTO 6205 2ZC3"}, "20055958": {"abc": "A", "precio": 189407.69, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2572199 BEACON, FLASH, AMB FEDERAL THY"}, "20065063": {"abc": "B", "precio": 407.82, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA 5V 950"}, "20018914": {"abc": "B", "precio": 11678.85, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA B58"}, "20067331": {"abc": "A", "precio": 26197.28, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "PLACA CARRUSEL LATERAL - GIRO HORARIO"}, "20067802": {"abc": "", "precio": 0.0, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "RODILLO MOTRIZ CURVA CB4-06-01-01 VDL"}, "20067803": {"abc": "", "precio": 1.0, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "RODILLO CONDUCIDO CURVA CB4-06-01-02 VDL"}, "20034272": {"abc": "A", "precio": 10156.41, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "CARRO PORTAPLACA TF 013117-103-00001 VDL"}, "20085700": {"abc": "", "precio": 4200.0, "grupoArt": "336", "tipo": "ZMAT", "um": "C/U", "texto": "PALA CONDENSADOR WESTRIC CX300-FSH1APD"}, "20085169": {"abc": "", "precio": 15435.0, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "VALV. RAMCO 4 VIAS, V10-418120-1XX"}, "20206496": {"abc": "A", "precio": 1.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "DISCO FRENO DELANTERO HILUX (2016-2020)"}, "20065071": {"abc": "B", "precio": 12140.23, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA 5V 800"}, "20206482": {"abc": "A", "precio": 1.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "PORTA CARBON D/ARRANQUE HILUX 2005-2015"}, "20056016": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "00500025080 BULB, FLUORESCENT, 20W THY"}, "20066702": {"abc": "", "precio": 69.18, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE PLISADO 500x750x50 mm"}, "20005469": {"abc": "B", "precio": 15819.88, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA BXS-69"}, "20007235": {"abc": "", "precio": 1.0, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE PLISADO 410X580X50MM"}, "20201557": {"abc": "C", "precio": 7800.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "TAPON TAPA BLOCK ROSCADO-SPRINTER"}, "20034273": {"abc": "C", "precio": 638987.11, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "CADENA 4 ESLABONES 2D L=1010 VDL"}, "20065348": {"abc": "A", "precio": 827.57, "grupoArt": "26", "tipo": "ZMAT", "um": "C/U", "texto": "BORRADO*BASE DE POT TESYS LUB12 3 POLOS"}, "20055965": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2596002 SENSOR, ARTIC FLOOR,1DEG THY"}, "20018813": {"abc": "B", "precio": 7133.54, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA A54"}, "20060095": {"abc": "", "precio": 1.0, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE PES PLIS 600X290X50 MERV8"}, "20074814": {"abc": "B", "precio": 5707.18, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE PLIS 500X400X20 MERV13"}, "20055956": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2568097 PHOTO CONT, INTERMATICK4121C THY"}, "20088193": {"abc": "", "precio": 1.0, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "MOTOR -W22 1 HP BORN.SUP CARCAZA 80"}, "20201558": {"abc": "B", "precio": 46900.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO ACEITE-SPRINTER-MAHEL"}, "20201421": {"abc": "B", "precio": 14900.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO HABITACULO-NISSAN FRONTIER-WEGA"}, "20065079": {"abc": "", "precio": 11251.55, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA SPZ 1587"}, "20002320": {"abc": "", "precio": 1.0, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE POLIESTER PLIS 350X500X50MM"}, "20055893": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2510607 SW,LIM,DPDT,10DGR TRIP THY"}, "20065497": {"abc": "B", "precio": 44262.65, "grupoArt": "348", "tipo": "ZMAT", "um": "M", "texto": "BANDA RUGOSA ASTER 15 QF 1000MM"}, "20006519": {"abc": "", "precio": 1.0, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE PLISADO 350X310X50"}, "20067335": {"abc": "", "precio": 0.0, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "SEGURO PASADOR BOW-120-12 EJE DE CADENA"}, "20054924": {"abc": "A", "precio": 4100.19, "grupoArt": "61", "tipo": "ZMAT", "um": "C/U", "texto": "REFLECTIVO E39-R42 OMRON"}, "20088191": {"abc": "", "precio": 1.0, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "MOTOR -W22 5,5 HP BORN.SUP CARCAZA 112M"}, "20088680": {"abc": "C", "precio": 18957.11, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "KIT ESCOBILLAS TOYOTA HILUX 2017-2022"}, "20088185": {"abc": "", "precio": 1.0, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "MOTOR -W22 4 HP BORN.SUP CARCAZA 100L"}, "20070757": {"abc": "", "precio": 249051.75, "grupoArt": "61", "tipo": "ZMAT", "um": "C/U", "texto": "INTERRUPTOR SECCIONADOR CARGA 16A"}, "20056808": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "A5228399 COUPLING SPIDER (FILTRO) THY"}, "20201422": {"abc": "B", "precio": 21500.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE-NISSAN FRONTIER-WEGA"}, "20096849": {"abc": "C", "precio": 470000.0, "grupoArt": "336", "tipo": "ZMAT", "um": "C/U", "texto": "PLACA CVTR 54-1154-0 WESTRIC"}, "20067350": {"abc": "", "precio": 1.0, "grupoArt": "341", "tipo": "ZMAT", "um": "C/U", "texto": "PORTA RODAMIENTO RND PME-60 N"}, "20055960": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2574091 LIGHT FIXTURE, RED, LED THY"}, "20055967": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2597077 RELAY,SOCKET,2/4P THY"}, "20088712": {"abc": "", "precio": 392220.0, "grupoArt": "336", "tipo": "ZMAT", "um": "C/U", "texto": "PLACA CONDENSADOR LG EAX64656602"}, "20070482": {"abc": "X", "precio": 51133.91, "grupoArt": "348", "tipo": "ZMAT", "um": "C/U", "texto": "BANDA CURVA VDL 1000-1100-105°"}, "20054885": {"abc": "", "precio": 39333.1, "grupoArt": "61", "tipo": "ZMAT", "um": "C/U", "texto": "FOTOCELULA M8 4POLOS 12-30VCC RANGO 4M"}, "20004042": {"abc": "X", "precio": 57.88, "grupoArt": "341", "tipo": "ZMAT", "um": "C/U", "texto": "RODAMIENTO UC 207"}, "20067338": {"abc": "", "precio": 1.0, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "CASQUILLO CONICO 004840-90035 VDL"}, "20067332": {"abc": "A", "precio": 222590.4, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "PORTA PLACA INCLINADO 25° de CARRUSEL"}, "20066685": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "FUSIBLE MODULAR LED 24V, WAGO 25541504"}, "20055900": {"abc": "A", "precio": 100706.71, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2515574SW,LIM, 2 NO, 2 NC, 2 STEP THY"}, "20056032": {"abc": "A", "precio": 528837.64, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "VALVULA COMPENSADA CONTROL FR101S375"}, "20090371": {"abc": "B", "precio": 359179.5, "grupoArt": "348", "tipo": "ZMAT", "um": "M", "texto": "BANDA E8/2 U0/V15/LG-SE BLACK W=1000"}, "20087933": {"abc": "", "precio": 1.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FUNDA DE ASIENTO P/TOYOTA HILUX DOBL CAB"}, "20001739": {"abc": "X", "precio": 38.91, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA A34"}, "20067330": {"abc": "A", "precio": 254689.3, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "PLACA CARRUSEL TT A=1200mm-GIRO HORARIO"}, "20066689": {"abc": "A", "precio": 2192017.98, "grupoArt": "339", "tipo": "ZMAT", "um": "C/U", "texto": "MOTOR DE BOMBA HIDRAULICA PE213T-7.5-4C"}, "20012254": {"abc": "", "precio": 6510.5, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA B49 DENTADA"}, "20206499": {"abc": "A", "precio": 1.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "TERMOSTATO HILUX 2.5 (2KD)"}, "20201420": {"abc": "B", "precio": 87900.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO GASOIL-NISSAN FRONTIER-WEGA"}, "20055854": {"abc": "", "precio": 0.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "SOPORTE P/RODAM NAP210 RASE50"}, "20055898": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2515451 CONT BLK, N.O. THY"}, "20055968": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2597078 RELAY,PROT. DIODE,6-250VDC THY"}, "20091886": {"abc": "C", "precio": 8680.63, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "RUEDA ENGOMADA 55MM 012607-289-00001"}, "20065066": {"abc": "C", "precio": 11830.23, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA SPZ 1520"}, "20201564": {"abc": "B", "precio": 12600.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO HABITACULO-PEUGEOT PARTNER 6479A1"}, "20201553": {"abc": "B", "precio": 16400.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO DE AIRE-RENAULT KANGOO"}, "20067333": {"abc": "A", "precio": 7541.57, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "CASQUILLO DE BLOQUEO EXCÉNTRICO"}, "20006526": {"abc": "", "precio": 85.38, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE PLISADO 400X620X20MM"}, "20055855": {"abc": "A", "precio": 44288.47, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "A22154332 BOLT FLG BRG, 1 1/4 THY"}, "20087819": {"abc": "", "precio": 1.0, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "RODILLO DE ALZADA 012634-242-01170 VDL"}, "20065499": {"abc": "B", "precio": 127869.49, "grupoArt": "348", "tipo": "ZMAT", "um": "M", "texto": "BANDA LISA BREDA 20 NF 1000MM"}, "20206490": {"abc": "A", "precio": 1.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "MOTOR DE ARRANQUE HILUX 2.4 D-4D (2GD)"}, "20087854": {"abc": "", "precio": 1.0, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "RODILLO 001093-000-00498 VDL"}, "20088186": {"abc": "", "precio": 1.0, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "MOTOR -W22 3 HP BORN.SUP CARCAZA 100L"}, "20006585": {"abc": "", "precio": 59.6, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE PES PLIS 600X600X50 MERV13"}, "20201565": {"abc": "B", "precio": 18600.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE-PEUGEOT PARTNER 1444TV"}, "20055859": {"abc": "A", "precio": 27199.37, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "00009106090 CAM ROLLER, 90MM DIAM THY"}, "20201419": {"abc": "B", "precio": 15800.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO ACEITE-NISSAN FRONTIER"}, "20055857": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2240016 CASTER, SWIVEL, 6 THY"}, "20096278": {"abc": "C", "precio": 445000.0, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "EJE TUBINA ROOF TOP LENNOX LGH360"}, "20065072": {"abc": "C", "precio": 11091.52, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA SPZ 1600"}, "20085102": {"abc": "", "precio": 53043.36, "grupoArt": "336", "tipo": "ZMAT", "um": "C/U", "texto": "VALV. EXPANSIÓN BBIZE-8GA"}, "20201551": {"abc": "B", "precio": 87900.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO DE GASOIL-RENAULT KANGOO-1.5"}, "20053920": {"abc": "A", "precio": 511763.15, "grupoArt": "315", "tipo": "ZMAT", "um": "C/U", "texto": "RUEDA MACIZA 40x16x30 PULG 80025593 TEAM"}, "20055990": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "25522161 CONT BLK, MTG BASE THY"}, "20067806": {"abc": "A", "precio": 425235.5, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "SOPORTE RODAMIEN RODILLO p/CURVA DINAMIC"}, "20055945": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2556076 FUSE,1000VDC,030A,CLASS 101 THY"}, "20055899": {"abc": "A", "precio": 26362.6, "grupoArt": "61", "tipo": "ZMAT", "um": "C/U", "texto": "FIN CARRERA NEMA E50 2P"}, "20065190": {"abc": "B", "precio": 95353.11, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "RODAMIENTO INTERIOR Ø30 VDL"}, "20206493": {"abc": "A", "precio": 1.0, "grupoArt": "32", "tipo": "ZMAT", "um": "C/U", "texto": "SOLENOIDE ARRANQUE HILUX 2.5 D-4D (2KD)"}, "20067800": {"abc": "A", "precio": 73399.27, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "HOLDERS CURVA CB4-02-00-00 VDL"}, "20041155": {"abc": "", "precio": 67.27, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE PLISADO 600 X 450 X 50 MM"}, "20055853": {"abc": "A", "precio": 205454.14, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "81931 DOOR CLOSER, STD SERVICE DOOR THY"}, "20034266": {"abc": "A", "precio": 265.44, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "SLAT O LAMA CARRUSEL TF W=1000 CW/CCW"}, "20083175": {"abc": "A", "precio": 300144.88, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "ENCODER PPI SENSOR ASSY 0L9196-00001 VDL"}, "20006518": {"abc": "", "precio": 60.97, "grupoArt": "338", "tipo": "ZMAT", "um": "C/U", "texto": "FILTRO AIRE PLISADO 400X580X50"}, "20055858": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "A25825001010 CAM ROLLER, 127mm DIAM THY"}, "20065351": {"abc": "A", "precio": 255522.04, "grupoArt": "61", "tipo": "ZMAT", "um": "C/U", "texto": "MODULO PROT TERMICA 1,25-5A LUCA05BL"}, "20040699": {"abc": "B", "precio": 2224.36, "grupoArt": "332", "tipo": "ZMAT", "um": "C/U", "texto": "BANDA BREDA 15NF A=500mm - L=2930mm"}, "20065304": {"abc": "A", "precio": 22723.71, "grupoArt": "61", "tipo": "ZMAT", "um": "C/U", "texto": "PULSADOR LUMINOSO RASANTE AZUL"}, "20055896": {"abc": "", "precio": 1.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "2515103SW,TAPESWITCH,TS-57, 102PU RED TH"}, "20081410": {"abc": "", "precio": 656637.28, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "MOTORR KA37 DRN80MK4/BE1 0,55KW-155"}, "20088188": {"abc": "", "precio": 1.0, "grupoArt": "20", "tipo": "ZMAT", "um": "C/U", "texto": "MOTOR -W22 15 HP BORN.SUP CARCAZA 160M"}, "20001806": {"abc": "X", "precio": 266.82, "grupoArt": "337", "tipo": "ZMAT", "um": "C/U", "texto": "CORREA B80"}, "20069055": {"abc": "", "precio": 63521.42, "grupoArt": "61", "tipo": "ZMAT", "um": "C/U", "texto": "FUENTE TRONIK SW1510TT SALIDA 14VCC-1A"}, "20087829": {"abc": "", "precio": 1.0, "grupoArt": "348", "tipo": "ZMAT", "um": "C/U", "texto": "CINTA TRANSP E8/2 U0/V5H MT-SE W=1000"}, "20055866": {"abc": "A", "precio": 105.0, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "00006544840 M12, WASHER FLAT GR8.8,Z THY"}, "20055870": {"abc": "B", "precio": 3559251.51, "grupoArt": "331", "tipo": "ZMAT", "um": "C/U", "texto": "A4230300 TUBE MOTOR THY"}, "20053852": {"abc": "A", "precio": 68792.3, "grupoArt": "26", "tipo": "ZMAT", "um": "M", "texto": "BANDA NHB10ESBV 1300MM"}};
