/* ─── AAC_SISTEMAS — sistemas de aire: unidad exterior/condensadora + unidades interiores ───
   SAP no tiene el vínculo (equipoSup vacío): se deduce de la denominación, la ubicación técnica y la
   secuencia de códigos (los interiores siguen a su exterior). conf "alta" = misma ubicación técnica;
   "media" = solo por secuencia de códigos → revisar en Auditoría → Planes.
   Lo usa el Planificador para juntar en una sola OT los preventivos de la condensadora y de sus
   interiores. Regenerar: python scratchpad/gen_sistemas_aire.py */

const AAC_SISTEMAS = [
 {
  "id": "SIS-AAC2099",
  "nombre": "VRF Unidad Exterior UC 01",
  "cabeza": "AAC2099",
  "ubic": "AEP-ED5-NIVEL0-UBITEC233",
  "conf": "alta",
  "miembros": [
   "AAC2083",
   "AAC2084",
   "AAC2085",
   "AAC2086",
   "AAC2087",
   "AAC2088",
   "AAC2089",
   "AAC2090",
   "AAC2091",
   "AAC2092",
   "AAC2093",
   "AAC2094",
   "AAC2095",
   "AAC2096",
   "AAC2097",
   "AAC2098"
  ]
 },
 {
  "id": "SIS-AAC3908",
  "nombre": "VRF Unidad Exterior UC 01 CHEC IN SIST 1",
  "cabeza": "AAC3908",
  "ubic": "AEP-ED6-NIVEL7-UBITEC009",
  "conf": "media",
  "miembros": [
   "AAC3909",
   "AAC3910",
   "AAC3911",
   "AAC3912"
  ]
 },
 {
  "id": "SIS-AAC3913",
  "nombre": "VRF Unidad Exterior UC 02 SIST 2",
  "cabeza": "AAC3913",
  "ubic": "AEP-ED6-NIVEL7-UBITEC009",
  "conf": "media",
  "miembros": [
   "AAC3914",
   "AAC3915",
   "AAC3916",
   "AAC3917"
  ]
 },
 {
  "id": "SIS-AAC3918",
  "nombre": "VRF Unidad Exterior UC 03 S3",
  "cabeza": "AAC3918",
  "ubic": "AEP-ED6-NIVEL7-UBITEC009",
  "conf": "media",
  "miembros": [
   "AAC3919",
   "AAC3920",
   "AAC3921",
   "AAC3922"
  ]
 },
 {
  "id": "SIS-AAC3923",
  "nombre": "VRF Unidad Exterior UC 04 S4",
  "cabeza": "AAC3923",
  "ubic": "AEP-ED6-NIVEL7-UBITEC009",
  "conf": "media",
  "miembros": [
   "AAC3924",
   "AAC3925",
   "AAC3926",
   "AAC3927"
  ]
 },
 {
  "id": "SIS-AAC3955",
  "nombre": "VRF Ext UE-003 Arribos Inter Migra PB",
  "cabeza": "AAC3955",
  "ubic": "AEP-ED7-NIVEL7-UBITEC001",
  "conf": "media",
  "miembros": [
   "AAC3956",
   "AAC3957",
   "AAC3958",
   "AAC3959",
   "AAC3960",
   "AAC3961",
   "AAC3962",
   "AAC3963",
   "AAC3964"
  ]
 },
 {
  "id": "SIS-AAC3965",
  "nombre": "VRF Exterior UE-002 Aduana-Senasa PB",
  "cabeza": "AAC3965",
  "ubic": "AEP-ED7-NIVEL7-UBITEC001",
  "conf": "media",
  "miembros": [
   "AAC3966",
   "AAC3967",
   "AAC3968",
   "AAC3969",
   "AAC3970",
   "AAC3971",
   "AAC3972",
   "AAC3973",
   "AAC3974",
   "AAC3975",
   "AAC3976",
   "AAC3977"
  ]
 },
 {
  "id": "SIS-AAC3978",
  "nombre": "VRF Unidad Exterior UC-Inter Aduana PA",
  "cabeza": "AAC3978",
  "ubic": "AEP-ED7-NIVEL7-UBITEC001",
  "conf": "media",
  "miembros": [
   "AAC3979",
   "AAC3980",
   "AAC3981",
   "AAC3982",
   "AAC3983"
  ]
 },
 {
  "id": "SIS-AAC3984",
  "nombre": "VRF Ext UC-PSA-RXYMQ8 Inter PSA PA",
  "cabeza": "AAC3984",
  "ubic": "AEP-ED7-NIVEL7-UBITEC001",
  "conf": "media",
  "miembros": [
   "AAC3985",
   "AAC3986",
   "AAC3987",
   "AAC3988",
   "AAC3989",
   "AAC3990",
   "AAC3991"
  ]
 },
 {
  "id": "SIS-AAC3992",
  "nombre": "VRF Unidad Exterior Box Migra Out 1",
  "cabeza": "AAC3992",
  "ubic": "AEP-ED7-NIVEL7-UBITEC001",
  "conf": "media",
  "miembros": [
   "AAC3993"
  ]
 },
 {
  "id": "SIS-AAC3994",
  "nombre": "VRF Unidad Exterior Box Migra Out 2",
  "cabeza": "AAC3994",
  "ubic": "AEP-ED7-NIVEL7-UBITEC001",
  "conf": "media",
  "miembros": [
   "AAC3995"
  ]
 },
 {
  "id": "SIS-AAC4112",
  "nombre": "U.C Sist. 1 Multi Split Oficina AA",
  "cabeza": "AAC4112",
  "ubic": "AEP-ED4-NIVEL0-UBITEC033",
  "conf": "media",
  "miembros": [
   "AAC4113",
   "AAC4114",
   "AAC4115"
  ]
 },
 {
  "id": "SIS-AAC4118",
  "nombre": "U.C Sist. 1 Multi Split F/C Oficinas Mtt",
  "cabeza": "AAC4118",
  "ubic": "AEP-LAA-UBI225",
  "conf": "media",
  "miembros": [
   "AAC4119",
   "AAC4120",
   "AAC4121",
   "AAC4122"
  ]
 },
 {
  "id": "SIS-AAC4123",
  "nombre": "U.C Sist. 1 Multi V5 VRF OFICINAS MANTEN",
  "cabeza": "AAC4123",
  "ubic": "AEP-LAA-UBI225",
  "conf": "media",
  "miembros": [
   "AAC4124",
   "AAC4125",
   "AAC4126",
   "AAC4127",
   "AAC4128",
   "AAC4129",
   "AAC4130",
   "AAC4131"
  ]
 },
 {
  "id": "SIS-AAC9300",
  "nombre": "Unidad Exterior Condensadora UC-02 CUSTO",
  "cabeza": "AAC9300",
  "ubic": "AEP-ED5-NIVEL0-UBITEC049",
  "conf": "alta",
  "miembros": [
   "AAC9298",
   "AAC9299"
  ]
 },
 {
  "id": "SIS-AAC9401",
  "nombre": "VRF Unidad Condensadora UC 01 SALA VIP",
  "cabeza": "AAC9401",
  "ubic": "AEP-ED5-NIVEL0-UBITEC234",
  "conf": "media",
  "miembros": [
   "AAC9402",
   "AAC9403",
   "AAC9404",
   "AAC9405",
   "AAC9406",
   "AAC9407",
   "AAC9408",
   "AAC9409",
   "AAC9410",
   "AAC9411"
  ]
 },
 {
  "id": "SIS-AAC9412",
  "nombre": "VRF Unidad Exterior UC 02",
  "cabeza": "AAC9412",
  "ubic": "AEP-ED5-NIVEL0-UBITEC049",
  "conf": "media",
  "miembros": [
   "AAC9413",
   "AAC9414"
  ]
 }
];

/* Unidades interiores sin unidad exterior identificable (piso-techo aisladas) */
const AAC_SIN_EXTERIOR = [{"equipo": "AAC4107", "denom": "Unidad Piso Techo 1 Comedor Aeroparque"}, {"equipo": "AAC4108", "denom": "Unidad Piso Techo 2 Comedor Aeroparque"}, {"equipo": "AAC4109", "denom": "Unidad Piso Techo 3 Comedor Aeroparque"}, {"equipo": "AAC4110", "denom": "Unidad Piso Techo Taller Termomecanica"}, {"equipo": "AAC4111", "denom": "Unidad Piso Techo Taller Infraestructura"}, {"equipo": "AAC4116", "denom": "Unidad Piso Techo Comedor Mantenimiento"}, {"equipo": "AAC4117", "denom": "Unidad Piso Techo Comedor Mantenimiento"}, {"equipo": "AAC4132", "denom": "Unidad Piso Techo 4 Comedor Aeroparque"}];
