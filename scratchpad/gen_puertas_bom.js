const fs=require("fs");
const P="panol-repuestos-data.js";
const D=new Function(fs.readFileSync("puertas-data.js","utf8")+";return PUERTAS_DATA")();
const N="Puerta Manusa — asignado por modelo (catálogo Pañol), confirmar con el manual";
const visio=[
 ["20074722","Correa HTD Visio",["20085431","20058363"]],["20074718","Amarre de correa Visio"],
 ["20073238","Electrónica Visio 230V",["20096709"]],["20073239","Brazo de arrastre Visio"],
 ["20096708","Kit movimiento Visio",["20087780","20088265"]],["20087779","Kit transmisión Visio"],
 ["20085432","Encoder Visio"],["20085434","Emisor fotocélula"],["20085435","Receptor fotocélula"],
 ["20094020","Cerrojo automático Visio 125"],["20089763","Kit batería Visio"],
 ["20074717","Conjunto carros Visio"],["20074720","Rueda guía Visio"],["20074719","Rueda carga Visio"],
 ["20023922","Perfil de rodadura Manusa"],["20010470","Radar de detección"],["20083830","Tapa radar"],
 ["20089563","Burlete paso libre Visio"]];
const gen=[
 ["20058363","Correa HTD 5M-14 Manusa (por metro)"],["20006555","Rueda excéntrica Manusa"],
 ["20003498","Patín puerta automática Manusa"],["20023922","Perfil de rodadura Manusa"],
 ["20094021","Selector Optima",["20010471"]],["20010470","Radar de detección"],
 ["20085434","Emisor fotocélula"],["20085435","Receptor fotocélula"],["20018047","Batería 12V antipánico Manusa"]];
const mk=(l,n)=>l.map(([cod,t,op])=>`    { cod: "${cod}", ${op?`opciones: ${JSON.stringify(op)}, `:""}nota: "${t} — ${n}" },`).join("\n");
let out="",sk=[];
D.forEach(d=>{
 if(d.fabricante!=="Manusa"){sk.push(d.equipo);return;}
 const v=/visio/i.test(d.modelo);
 out+=`  { equipo: "${d.equipo}", materiales: [\n${mk(v?visio:gen,v?N:N+"; modelo sin identificar → solo repuestos genéricos")}\n  ] },\n`;
});
let s=fs.readFileSync(P,"utf8");
s=s.replace(/\];\s*$/,"  /* 2026-10-15: puertas automáticas Manusa (PPA), por modelo — ver scratchpad/gen_puertas_bom.js */\n"+out+"];\n");
fs.writeFileSync(P,s);
console.log("omitidas",sk.length,sk.join(","));
