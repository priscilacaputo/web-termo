const fs=require("fs");const P="panol-repuestos-data.js";
const D=new Function(fs.readFileSync("puertas-data.js","utf8")+";return PUERTAS_DATA")();
let s=fs.readFileSync(P,"utf8");
const gen=[["20058363","Correa HTD 5M-14 Manusa (por metro)"],["20006555","Rueda excéntrica Manusa"],["20003498","Patín puerta automática Manusa"],["20023922","Perfil de rodadura Manusa"],["20094021","Selector Optima",["20010471"]],["20010470","Radar de detección"],["20085434","Emisor fotocélula"],["20085435","Receptor fotocélula"],["20018047","Batería 12V antipánico Manusa"]];
const n=f=>`Set genérico Manusa; fabricante ${f||"sin identificar"} — puede no aplicar, confirmar`;
let out="",c=0;
D.forEach(d=>{if(d.fabricante==="Manusa"||s.includes(`equipo: "${d.equipo}"`))return;c++;
out+=`  { equipo: "${d.equipo}", materiales: [\n`+gen.map(([cod,t,op])=>`    { cod: "${cod}", ${op?`opciones: ${JSON.stringify(op)}, `:""}nota: "${t} — ${n(d.fabricante)}" },`).join("\n")+`\n  ] },\n`;});
s=s.replace(/\];\s*$/,out+"];\n");fs.writeFileSync(P,s);console.log(c);
