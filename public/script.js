const t={
 wire_cut:2,
 bundling:1.3,
 splicing:3,
 stripping:6,
 braid:2,
 lacing:1,
 taping:0.25,
 heat:3,
 crimp:2,
 solder:3,
 conn:2,
 backshell:2,
 label:3.6,
 quality:20
};

function v(id){
 return +document.getElementById(id).value || 0;
}

function calculate(){

 let length=v("length");
 let qty=v("qty");
 let terminals=v("terminals");
 let splices=v("splices");
 let branches=v("branches");
 let wires=v("wires");
 let bundling=v("bundling");
 let labels=v("labels");
 let connectors=v("connectors");

 let manpower=v("manpower") || 1;
 let shift=v("shift") || 7;

 if(!qty){
  alert("Enter quantity");
  return;
 }

 /* ===== TOTAL TIME (MINUTES) ===== */

 let totalMin =
 (length * t.wire_cut) +
 (bundling * t.bundling) +
 (splices * t.splicing) +
 (wires * t.stripping) +
 (branches * t.braid) +
 (wires * t.lacing) +
 (wires * t.taping) +
 (terminals * t.heat) +
 (terminals * t.crimp) +
 (connectors * t.solder) +
 (connectors * t.conn) +
 (connectors * t.backshell) +
 (labels * t.label) +
 t.quality;

 /* ===== UNIT TIME ===== */
 let unitH = totalMin / 60;

 /* ===== TOTAL HOURS ===== */
 let totalH = (unitH * qty) / manpower;

 /* ===== DAYS ===== */
 let days = totalH / shift;

 /* ===== KPI UPDATE ===== */

 document.getElementById("k_unit")
 .textContent = unitH.toFixed(4)+" h";

 document.getElementById("k_hours")
 .textContent = totalH.toFixed(4)+" h";

 document.getElementById("k_days")
 .textContent = days.toFixed(2);

 /* ===== END DATE ===== */

 let startDate =
 document.getElementById("date").value;

 if(startDate){

  let d=new Date(startDate);

  d.setDate(
   d.getDate()+Math.ceil(days)
  );

  document.getElementById("k_end")
  .textContent=d.toLocaleDateString();
 }
}
async function uploadReference(){

 const file =
 document.getElementById("refFile").files[0];

 if(!file){
  alert("Select Excel File");
  return;
 }

 const formData=new FormData();
 formData.append("file",file);

 await fetch(
 "http://localhost:3000/uploadRef",
 {
  method:"POST",
  body:formData
 });

 alert("Uploaded Successfully");

 loadReferences();
}

/* ---------- Load Files ---------- */

async function loadReferences(){

 const res =
 await fetch(
 "http://localhost:3000/references"
 );

 const files=await res.json();

 const table=
 document.getElementById("referenceList");

 table.innerHTML="";

 if(!files.length){
  table.innerHTML=
  "<tr><td colspan='2'>No Files Uploaded</td></tr>";
  return;
 }

 files.forEach(f=>{

 table.innerHTML+=`
 <tr>
   <td>${f.fileName}</td>

   <td>
     <a href=
     "http://localhost:3000/uploads/${f.filePath}"
     target="_blank">
     View
     </a>
   </td>
 </tr>`;
 });
}

/* Auto Load */
window.onload=loadReferences;