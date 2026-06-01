import { useState, useEffect, useCallback, useRef } from "react";

const C = {
  naranja:"#FF6B00", naranjaL:"#FF8C2A", naranjaD:"#CC5500",
  negro:"#0D0D0D", g1:"#1A1A1A", g2:"#222", g3:"#2E2E2E", g4:"#3A3A3A",
  txt:"#F2F2F2", sub:"#888", verde:"#3CB371", rojo:"#E05252",
  amarillo:"#F0B429", azul:"#4A9EFF", morado:"#A78BFA"
};

const USUARIOS = [
  { email:"admin@bazentregas.com", pass:"baz2026", nombre:"Administrador", rol:"admin" },
  { email:"op1@bazentregas.com",   pass:"op1234",  nombre:"Operador 1",    rol:"operador" },
  { email:"op2@bazentregas.com",   pass:"op1234",  nombre:"Operador 2",    rol:"operador" },
  { email:"op3@bazentregas.com",   pass:"op1234",  nombre:"Operador 3",    rol:"operador" },
  { email:"op4@bazentregas.com",   pass:"op1234",  nombre:"Operador 4",    rol:"operador" },
];

const DESTINOS = ["HUB VERACRUZ","HUB TAMPICO","HUB OAXACA","HUB PACHUCA","RETAIL"];

const TRANSPORTISTAS_CFG = [
  { nombre:"LTI",     color:"#FF6B00", icon:"🚛", caps:[18,50,70,90,110] },
  { nombre:"Moro",    color:"#FFB347", icon:"🚚", caps:[70,80]     },
  { nombre:"Levstom", color:"#A78BFA", icon:"🚐", caps:[110]       },
  { nombre:"Aguilar", color:"#4A9EFF", icon:"🏗️", caps:[80]        },
];

const PLAN_INICIAL = [
  { id:"lti-18",     transportista:"LTI",     color:"#FF6B00", icon:"🚛", capacidad:18,  plan:0,  cargadas:0, surtidas:0 },
  { id:"lti-50",     transportista:"LTI",     color:"#FF6B00", icon:"🚛", capacidad:50,  plan:14, cargadas:0, surtidas:0 },
  { id:"lti-70",     transportista:"LTI",     color:"#FF6B00", icon:"🚛", capacidad:70,  plan:0,  cargadas:0, surtidas:0 },
  { id:"lti-90",     transportista:"LTI",     color:"#FF6B00", icon:"🚛", capacidad:90,  plan:3,  cargadas:0, surtidas:0 },
  { id:"lti-110",    transportista:"LTI",     color:"#FF6B00", icon:"🚛", capacidad:110, plan:4,  cargadas:0, surtidas:0 },
  { id:"moro-70",    transportista:"Moro",    color:"#FFB347", icon:"🚚", capacidad:70,  plan:1,  cargadas:0, surtidas:0 },
  { id:"moro-80",    transportista:"Moro",    color:"#FFB347", icon:"🚚", capacidad:80,  plan:2,  cargadas:0, surtidas:0 },
  { id:"levstom-110",transportista:"Levstom", color:"#A78BFA", icon:"🚐", capacidad:110, plan:0,  cargadas:0, surtidas:0 },
  { id:"aguilar-80", transportista:"Aguilar", color:"#4A9EFF", icon:"🏗️", capacidad:80,  plan:0,  cargadas:0, surtidas:0 },
];

const FECHA_INICIAL = "30 de mayo de 2026";

function pct(a,b){ return b===0?0:Math.round((a/b)*100); }
function sem(v){ return v>=80?C.verde:v>=40?C.amarillo:v>0?C.rojo:C.sub; }
function hora(ts){ return new Date(ts).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}); }
function fechaCorta(ts){ return new Date(ts).toLocaleDateString("es-MX",{day:"2-digit",month:"short"}); }

function Logo({ width=130 }) {
  return (
    <svg width={width} viewBox="0 0 230 62" fill="none">
      <rect x="2" y="10" width="36" height="30" rx="4" fill={C.naranja}/>
      <rect x="2" y="10" width="36" height="11" rx="4" fill={C.naranjaD}/>
      <rect x="15" y="10" width="10" height="30" fill={C.naranjaD} opacity=".35"/>
      <rect x="7" y="13" width="7" height="5" rx="1.5" fill="white" opacity=".9"/>
      <path d="M42 25L55 25M51 20L56 25L51 30" stroke={C.naranja} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="60" y="35" fontFamily="Arial Black,Arial,sans-serif" fontWeight="900" fontSize="27" fill={C.txt} letterSpacing="1">BAZ</text>
      <text x="60" y="48" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="11.5" fill={C.naranja} letterSpacing="3.5">ENTREGAS</text>
      <text x="60" y="59" fontFamily="Arial,sans-serif" fontSize="8" fill={C.sub} letterSpacing="2">GRUPO SALINAS</text>
    </svg>
  );
}

function Login({ onLogin }) {
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  function go(){
    const u=USUARIOS.find(u=>u.email===email&&u.pass===pass);
    u?onLogin(u):setErr("Datos incorrectos");
  }
  return (
    <div style={{minHeight:"100vh",background:C.negro,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:24,
      fontFamily:"Arial,sans-serif"}}>
      <Logo width={150}/>
      <div style={{marginTop:28,width:"100%",maxWidth:380,background:C.g2,borderRadius:16,padding:24}}>
        <p style={{textAlign:"center",fontSize:13,color:C.sub,marginBottom:20}}>Inicia sesion para continuar</p>
        <select value={email} onChange={e=>setEmail(e.target.value)}
          style={{width:"100%",background:C.g3,border:"1px solid "+C.g4,borderRadius:10,
            padding:"12px 14px",color:email?C.txt:C.sub,fontSize:14,marginBottom:10,outline:"none"}}>
          <option value="">Selecciona usuario</option>
          {USUARIOS.map(u=><option key={u.email} value={u.email}>{u.nombre} ({u.rol})</option>)}
        </select>
        <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Contrasena"
          onKeyDown={e=>e.key==="Enter"&&go()}
          style={{width:"100%",background:C.g3,border:"1px solid "+C.g4,borderRadius:10,
            padding:"12px 14px",color:C.txt,fontSize:14,marginBottom:14,outline:"none"}}/>
        {err&&<p style={{color:C.rojo,fontSize:12,textAlign:"center",marginBottom:10}}>{err}</p>}
        <button onClick={go} style={{width:"100%",padding:13,borderRadius:10,border:"none",
          background:"linear-gradient(90deg,"+C.naranjaD+","+C.naranja+")",
          color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer"}}>ENTRAR</button>
        <div style={{marginTop:14,background:C.g3,borderRadius:10,padding:"10px 14px"}}>
          <p style={{fontSize:10,color:C.sub,marginBottom:5}}>ACCESOS</p>
          <p style={{fontSize:11,color:C.txt}}>Admin: admin@bazentregas.com / baz2026</p>
          <p style={{fontSize:11,color:C.txt,marginTop:3}}>Ops: op1 a op4@bazentregas.com / op1234</p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ plan, cargas, fechaPlan, isDesktop }) {
  const totalPlan = plan.reduce((a,r)=>a+r.plan,0);
  const totalCarg = plan.reduce((a,r)=>a+r.cargadas,0);
  const totalCol  = cargas.filter(c=>c.economico&&c.economico.trim()!=="").length;
  const totalSurt = plan.reduce((a,r)=>a+r.surtidas,0);
  const pCarg=pct(totalCarg,totalPlan);
  const pCol=pct(totalCol,totalPlan);
  const pSurt=pct(totalSurt,totalPlan);
  const now=new Date().toLocaleString("es-MX",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
  const destiColor={"HUB VERACRUZ":C.verde,"HUB TAMPICO":C.azul,"HUB OAXACA":C.amarillo,"HUB PACHUCA":C.morado,"RETAIL":C.naranja};
  const porDestino=DESTINOS.map(d=>({
    destino:d,
    total:cargas.filter(c=>c.destino===d).length,
    colocadas:cargas.filter(c=>c.destino===d&&c.economico&&c.economico.trim()!=="").length,
    surtidas:cargas.filter(c=>c.destino===d&&c.estado==="surtida").length,
  })).filter(d=>d.total>0);

  return (
    <div style={{padding: isDesktop?"24px 32px 40px":"12px 12px 24px"}}>
      {/* En escritorio: 2 columnas; en móvil: 1 columna */}
      <div style={{display:"grid",
        gridTemplateColumns: isDesktop?"1fr 1fr":"1fr",
        gap: isDesktop?24:0, alignItems:"start"}}>

        {/* COLUMNA IZQUIERDA: panel captureable */}
        <div style={{background:"linear-gradient(160deg,#111,"+C.g1+")",
          border:"1.5px solid #FF6B0044",borderRadius:16,padding:isDesktop?20:16,
          marginBottom: isDesktop?0:14}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
            marginBottom:14,paddingBottom:12,borderBottom:"1px solid "+C.g3}}>
            <Logo width={isDesktop?130:100}/>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:isDesktop?13:11,color:C.naranja,fontWeight:700}}>{fechaPlan}</div>
              <div style={{fontSize:9,color:C.g4,marginTop:1}}>{now}</div>
            </div>
          </div>
          {/* Avance global */}
          <div style={{background:C.g2,borderRadius:12,padding:"12px 14px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:isDesktop?13:11,color:C.sub,letterSpacing:1,textTransform:"uppercase"}}>Avance Global del Plan</span>
              <span style={{fontSize:isDesktop?38:32,fontWeight:900,color:sem(pCarg),lineHeight:1}}>
                {pCarg}<span style={{fontSize:isDesktop?20:16,fontWeight:400}}>%</span>
              </span>
            </div>
            <div style={{height:10,background:C.g4,borderRadius:5,overflow:"hidden"}}>
              <div style={{height:"100%",width:pCarg+"%",borderRadius:5,
                background:"linear-gradient(90deg,"+C.naranjaD+","+C.naranja+","+C.naranjaL+")"}}/>
            </div>
          </div>
          {/* 4 KPIs */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {[
              {label:"Plan Total",val:totalPlan,p:null,color:C.naranja,icon:"📋"},
              {label:"Cargadas",val:totalCarg,p:pCarg,color:C.verde,icon:"✅"},
              {label:"Colocadas",val:totalCol,p:pCol,color:C.azul,icon:"🅿️"},
              {label:"Surtidas",val:totalSurt,p:pSurt,color:C.amarillo,icon:"🚀"},
            ].map(k=>(
              <div key={k.label} style={{background:C.g2,borderRadius:12,padding:isDesktop?"16px 18px":"12px 14px",borderLeft:"3px solid "+k.color}}>
                <div style={{fontSize:isDesktop?16:13,marginBottom:3}}>{k.icon}</div>
                <div style={{fontSize:isDesktop?34:28,fontWeight:900,color:k.color,lineHeight:1}}>{k.val}</div>
                {k.p!==null&&<div style={{fontSize:isDesktop?15:13,color:k.p>0?sem(k.p):C.sub,fontWeight:700,marginTop:2}}>{k.p}%</div>}
                <div style={{fontSize:isDesktop?11:10,color:C.sub,marginTop:4}}>{k.label}</div>
              </div>
            ))}
          </div>
          {/* Por destino (solo si hay cargas) */}
          {porDestino.length>0&&(
            <div style={{background:C.g2,borderRadius:12,padding:"12px 14px",marginBottom:12}}>
              <p style={{fontSize:9,letterSpacing:3,color:C.sub,textTransform:"uppercase",marginBottom:10}}>Por Destino</p>
              {porDestino.map(d=>(
                <div key={d.destino} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{width:8,height:8,borderRadius:2,background:destiColor[d.destino]||C.sub,flexShrink:0}}/>
                  <span style={{fontSize:isDesktop?13:12,color:destiColor[d.destino]||C.txt,fontWeight:700,flex:1}}>{d.destino}</span>
                  <span style={{fontSize:11,color:C.sub}}>{d.total} cargas</span>
                  <span style={{fontSize:11,color:C.azul}}>Col {d.colocadas}</span>
                  <span style={{fontSize:11,color:C.amarillo}}>Sur {d.surtidas}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{textAlign:"center",fontSize:8,color:C.g4,letterSpacing:2}}>
            BAZ ENTREGAS - GRUPO SALINAS - OPERACION LOGISTICA
          </div>
        </div>

        {/* COLUMNA DERECHA: detalle por transportista */}
        <div>
          <div style={{background:C.g2,borderRadius:12,padding:isDesktop?20:16,marginBottom:12}}>
            <p style={{fontSize:9,letterSpacing:3,color:C.sub,textTransform:"uppercase",marginBottom:12}}>Por Linea Transportista</p>
            {TRANSPORTISTAS_CFG.map(cfg=>{
              const rows=plan.filter(r=>r.transportista===cfg.nombre);
              const tp=rows.reduce((a,r)=>a+r.plan,0);
              if(tp===0) return null;
              const tc=rows.reduce((a,r)=>a+r.cargadas,0);
              const ts=rows.reduce((a,r)=>a+r.surtidas,0);
              const tCol=cargas.filter(c=>c.transportista===cfg.nombre&&c.economico&&c.economico.trim()!=="").length;
              const p=pct(tc,tp);
              return (
                <div key={cfg.nombre} style={{marginBottom:16,paddingBottom:16,borderBottom:"1px solid "+C.g3}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:isDesktop?16:15,fontWeight:900,color:cfg.color}}>{cfg.icon} {cfg.nombre}</span>
                    <span style={{fontSize:isDesktop?16:15,fontWeight:800,color:sem(p)}}>{tc}/{tp} · {p}%</span>
                  </div>
                  <div style={{height:5,background:C.g4,borderRadius:3,overflow:"hidden",marginBottom:8}}>
                    <div style={{height:"100%",width:p+"%",background:cfg.color,borderRadius:3}}/>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:8}}>
                    {rows.map(r=>{
                      const rp=pct(r.cargadas,r.plan);
                      const rCol=cargas.filter(c=>c.transportista===r.transportista&&c.capacidad===r.capacidad&&c.economico&&c.economico.trim()!=="").length;
                      return (
                        <div key={r.id} style={{background:C.g3,borderRadius:8,padding:"7px 10px"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                            <span style={{fontSize:isDesktop?13:12,color:cfg.color,fontWeight:700}}>{r.capacidad} m3</span>
                            <div style={{display:"flex",gap:isDesktop?16:10}}>
                              <span style={{fontSize:isDesktop?12:10,color:C.verde}}>Carg {r.cargadas}/{r.plan}</span>
                              <span style={{fontSize:isDesktop?12:10,color:C.azul}}>Col {rCol}</span>
                              <span style={{fontSize:isDesktop?12:10,color:C.amarillo}}>Sur {r.surtidas}</span>
                            </div>
                          </div>
                          <div style={{height:4,background:C.g4,borderRadius:2,overflow:"hidden"}}>
                            <div style={{height:"100%",width:rp+"%",background:cfg.color,borderRadius:2}}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <div style={{flex:1,background:C.g3,borderRadius:7,padding:"5px 8px",textAlign:"center"}}>
                      <div style={{fontSize:isDesktop?16:14,fontWeight:900,color:C.azul}}>{tCol}</div>
                      <div style={{fontSize:8,color:C.sub}}>Colocadas</div>
                    </div>
                    <div style={{flex:1,background:C.g3,borderRadius:7,padding:"5px 8px",textAlign:"center"}}>
                      <div style={{fontSize:isDesktop?16:14,fontWeight:900,color:C.amarillo}}>{ts}</div>
                      <div style={{fontSize:8,color:C.sub}}>Surtidas</div>
                    </div>
                    <div style={{flex:1,background:C.g3,borderRadius:7,padding:"5px 8px",textAlign:"center"}}>
                      <div style={{fontSize:isDesktop?16:14,fontWeight:900,color:C.rojo}}>{tp-tc}</div>
                      <div style={{fontSize:8,color:C.sub}}>Pendientes</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!isDesktop&&(
            <div style={{background:"#4A9EFF11",border:"1px solid #4A9EFF33",borderRadius:10,
              padding:"10px 14px",display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:18}}>📸</span>
              <p style={{fontSize:11,color:C.sub,lineHeight:1.5}}>
                Captura el panel de arriba para compartirlo con gerencia.
              </p>
            </div>
          )}
          {isDesktop&&(
            <div style={{background:"#4A9EFF11",border:"1px solid #4A9EFF33",borderRadius:10,
              padding:"12px 16px",display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontSize:20}}>💻</span>
              <p style={{fontSize:12,color:C.sub,lineHeight:1.5}}>
                En escritorio puedes usar <strong style={{color:C.txt}}>Ctrl + P</strong> para imprimir o guardar como PDF, o tomar captura con <strong style={{color:C.txt}}>Windows + Shift + S</strong>.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function PanelCargas({ cargas, setCargas, plan, setPlan, hist, setHist, user, guardar }) {
  const [vista,setVista]=useState("lista");
  const [cargaId,setCargaId]=useState(null);
  const [busqueda,setBusqueda]=useState("");
  const [filtroDestino,setFiltroDestino]=useState("TODOS");
  const [filtroEstado,setFiltroEstado]=useState("TODOS");
  const [folio,setFolio]=useState("");
  const [complemento,setCompl]=useState("");
  const [trans,setTrans]=useState("LTI");
  const [cap,setCap]=useState(50);
  const [destino,setDestino]=useState(DESTINOS[0]);
  const fileRef=useRef(null);
  const capsPorTrans={LTI:[18,50,70,90,110],Moro:[70,80],Levstom:[110],Aguilar:[80]};
  const coloresTrans={LTI:"#FF6B00",Moro:"#FFB347",Levstom:"#A78BFA",Aguilar:"#4A9EFF"};
  const destiColor={"HUB VERACRUZ":C.verde,"HUB TAMPICO":C.azul,"HUB OAXACA":C.amarillo,"HUB PACHUCA":C.morado,"RETAIL":C.naranja};
  const estadoColor={pendiente:C.amarillo,cargada:C.verde,surtida:C.azul};
  const estadoIcon={pendiente:"⏳",cargada:"✅",surtida:"🚀"};
  const cargaAct=cargas.find(c=>c.id===cargaId);

  function agregarCarga(){
    if(!folio.trim()) return;
    const nueva={id:Date.now().toString(),folio:folio.trim().toUpperCase(),
      complemento:complemento.trim().toUpperCase(),transportista:trans,
      capacidad:parseInt(cap),destino,economico:"",estado:"pendiente",
      fotos:[],ts:Date.now(),usuario:user.nombre};
    const nc=[nueva,...cargas];
    const nh=[{accion:"nueva_carga",transportista:trans,capacidad:parseInt(cap),
      cantidad:1,usuario:user.nombre,ts:Date.now(),folio:nueva.folio,destino},...hist];
    setCargas(nc);setHist(nh);
    guardar(nc,plan,nh);
    setFolio("");setCompl("");setVista("lista");
  }

  function actualizarCarga(id,cambios){
    const prev=cargas.find(c=>c.id===id);
    const nc=cargas.map(c=>c.id===id?{...c,...cambios}:c);
    let np=plan;
    if(cambios.estado&&cambios.estado!==prev.estado){
      np=plan.map(r=>{
        if(r.transportista!==prev.transportista||r.capacidad!==prev.capacidad) return r;
        let d={};
        if(cambios.estado==="cargada") d={cargadas:Math.min(r.plan,r.cargadas+1)};
        if(cambios.estado==="surtida") d={surtidas:Math.min(r.plan,r.surtidas+1)};
        if(cambios.estado==="pendiente"&&prev.estado==="cargada") d={cargadas:Math.max(0,r.cargadas-1)};
        if(cambios.estado==="pendiente"&&prev.estado==="surtida") d={surtidas:Math.max(0,r.surtidas-1)};
        return {...r,...d};
      });
      setPlan(np);
    }
    const nh=[{accion:"estado_"+(cambios.estado||"actualizada"),
      transportista:prev.transportista,capacidad:prev.capacidad,
      cantidad:1,usuario:user.nombre,ts:Date.now(),folio:prev.folio},...hist];
    setCargas(nc);setHist(nh);
    guardar(nc,np,nh);
  }

  function agregarFoto(id,dataUrl){
    const carga=cargas.find(c=>c.id===id);
    if(!carga||carga.fotos.length>=3) return;
    actualizarCarga(id,{fotos:[...carga.fotos,{url:dataUrl,ts:Date.now(),usuario:user.nombre}]});
  }

  const filtradas=cargas.filter(c=>{
    const matchB=c.folio.includes(busqueda.toUpperCase())||
      c.complemento.includes(busqueda.toUpperCase())||
      (c.economico||"").includes(busqueda.toUpperCase());
    const matchD=filtroDestino==="TODOS"||c.destino===filtroDestino;
    const matchE=filtroEstado==="TODOS"||c.estado===filtroEstado;
    return matchB&&matchD&&matchE;
  });

  if(vista==="detalle"&&cargaAct){
    const c=cargaAct;
    return (
      <div style={{padding:"12px 12px 32px"}}>
        <button onClick={()=>{setVista("lista");setCargaId(null);}}
          style={{background:"none",border:"none",color:C.naranja,fontSize:14,cursor:"pointer",marginBottom:12,padding:0}}>
          Volver
        </button>
        <div style={{background:C.g2,borderRadius:14,padding:16,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{fontSize:19,fontWeight:900,color:coloresTrans[c.transportista]||C.naranja}}>{c.folio}</div>
              {c.complemento&&<div style={{fontSize:12,color:C.sub,marginTop:1}}>Comp: {c.complemento}</div>}
              <div style={{fontSize:11,color:C.sub,marginTop:2}}>{c.transportista} - {c.capacidad} m3</div>
              <div style={{display:"inline-block",marginTop:5,background:(destiColor[c.destino]||C.sub)+"22",
                border:"1px solid "+(destiColor[c.destino]||C.sub)+"55",borderRadius:7,
                padding:"3px 10px",fontSize:11,fontWeight:700,color:destiColor[c.destino]||C.sub}}>
                {c.destino}
              </div>
            </div>
            <div style={{background:estadoColor[c.estado]+"22",border:"1px solid "+estadoColor[c.estado]+"55",
              borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700,color:estadoColor[c.estado]}}>
              {estadoIcon[c.estado]} {c.estado.charAt(0).toUpperCase()+c.estado.slice(1)}
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <p style={{fontSize:10,color:C.sub,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>
              Numero Economico {c.economico?"✅":"- sin asignar"}
            </p>
            <input value={c.economico||""} placeholder="Ej. ECO-1234"
              onChange={e=>actualizarCarga(c.id,{economico:e.target.value.toUpperCase()})}
              readOnly={user.rol!=="admin"}
              style={{width:"100%",background:C.g3,border:"1px solid "+(c.economico?C.azul:C.g4),
                borderRadius:9,padding:"11px 12px",color:C.txt,fontSize:15,fontWeight:700,
                outline:"none",opacity:user.rol!=="admin"?0.6:1}}/>
            {!c.economico&&<p style={{fontSize:10,color:C.rojo,marginTop:4}}>
              Sin economico: unidad no cuenta como colocada
            </p>}
          </div>
          {user.rol==="admin"&&(
            <div style={{marginBottom:14}}>
              <p style={{fontSize:10,color:C.sub,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Destino</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {DESTINOS.map(d=>(
                  <button key={d} onClick={()=>actualizarCarga(c.id,{destino:d})}
                    style={{padding:"6px 12px",borderRadius:8,
                      border:"2px solid "+(c.destino===d?(destiColor[d]||C.naranja):C.g4),
                      background:c.destino===d?(destiColor[d]||C.naranja)+"22":C.g3,
                      color:c.destino===d?(destiColor[d]||C.naranja):C.sub,
                      fontSize:11,fontWeight:700,cursor:"pointer"}}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
          {user.rol==="admin"&&(
            <div style={{marginBottom:14}}>
              <p style={{fontSize:10,color:C.sub,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Estado</p>
              <div style={{display:"flex",gap:8}}>
                {["pendiente","cargada","surtida"].map(est=>(
                  <button key={est} onClick={()=>actualizarCarga(c.id,{estado:est})}
                    style={{flex:1,padding:"9px 4px",borderRadius:9,
                      border:"2px solid "+(c.estado===est?estadoColor[est]:C.g4),
                      background:c.estado===est?estadoColor[est]+"22":C.g3,
                      color:c.estado===est?estadoColor[est]:C.sub,
                      fontSize:11,fontWeight:700,cursor:"pointer"}}>
                    {estadoIcon[est]} {est.charAt(0).toUpperCase()+est.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <p style={{fontSize:10,color:C.sub,letterSpacing:2,textTransform:"uppercase"}}>
                Fotos ({c.fotos.length}/3)
              </p>
              {user.rol==="admin"&&c.fotos.length<3&&(
                <>
                  <button onClick={()=>fileRef.current.click()}
                    style={{padding:"6px 12px",borderRadius:8,border:"1px solid "+C.naranja+"55",
                      background:C.naranja+"11",color:C.naranja,fontSize:11,fontWeight:700,cursor:"pointer"}}>
                    Agregar foto
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" capture="environment"
                    style={{display:"none"}}
                    onChange={e=>{
                      const f=e.target.files[0];if(!f) return;
                      const rd=new FileReader();
                      rd.onload=ev=>agregarFoto(c.id,ev.target.result);
                      rd.readAsDataURL(f);e.target.value="";
                    }}/>
                </>
              )}
            </div>
            {c.fotos.length===0?(
              <div style={{background:C.g3,borderRadius:10,padding:20,textAlign:"center"}}>
                <p style={{fontSize:13,color:C.sub}}>Sin fotos registradas</p>
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                {c.fotos.map((f,i)=>(
                  <div key={i} style={{borderRadius:10,overflow:"hidden",position:"relative",aspectRatio:"1"}}>
                    <img src={f.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,
                      background:"rgba(0,0,0,0.65)",padding:"3px 5px",fontSize:9,color:"#fff"}}>
                      {["Frontal","Lateral","Sello"][i]} - {hora(f.ts)}
                    </div>
                    {user.rol==="admin"&&(
                      <button onClick={()=>actualizarCarga(c.id,{fotos:c.fotos.filter((_,j)=>j!==i)})}
                        style={{position:"absolute",top:4,right:4,width:22,height:22,borderRadius:11,
                          background:"rgba(220,50,50,0.9)",border:"none",color:"#fff",
                          fontSize:13,cursor:"pointer"}}>x</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{marginTop:12,fontSize:10,color:C.g4,borderTop:"1px solid "+C.g3,paddingTop:8}}>
            {fechaCorta(c.ts)} {hora(c.ts)} - {c.usuario}
          </div>
        </div>
      </div>
    );
  }

  if(vista==="nueva"){
    return (
      <div style={{padding:"12px 12px 32px"}}>
        <button onClick={()=>setVista("lista")}
          style={{background:"none",border:"none",color:C.naranja,fontSize:14,cursor:"pointer",marginBottom:12,padding:0}}>
          Cancelar
        </button>
        <div style={{background:C.g2,borderRadius:14,padding:16}}>
          <p style={{fontSize:14,fontWeight:700,color:C.txt,marginBottom:16}}>Nueva Carga</p>
          <label style={{fontSize:10,color:C.sub,letterSpacing:2,textTransform:"uppercase"}}>Folio de carga</label>
          <input value={folio} onChange={e=>setFolio(e.target.value)} placeholder="Ej. CS03286750"
            style={{width:"100%",background:C.g3,border:"1px solid "+C.g4,borderRadius:9,
              padding:"11px 12px",color:C.txt,fontSize:15,fontWeight:700,outline:"none",marginBottom:12,marginTop:4}}/>
          <label style={{fontSize:10,color:C.sub,letterSpacing:2,textTransform:"uppercase"}}>Complemento</label>
          <input value={complemento} onChange={e=>setCompl(e.target.value)} placeholder="Ej. CS00315678"
            style={{width:"100%",background:C.g3,border:"1px solid "+C.g4,borderRadius:9,
              padding:"11px 12px",color:C.txt,fontSize:14,outline:"none",marginBottom:12,marginTop:4}}/>
          <label style={{fontSize:10,color:C.sub,letterSpacing:2,textTransform:"uppercase"}}>Destino</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:6,marginBottom:12}}>
            {DESTINOS.map(d=>(
              <button key={d} onClick={()=>setDestino(d)}
                style={{padding:"7px 12px",borderRadius:9,
                  border:"2px solid "+(destino===d?({"HUB VERACRUZ":C.verde,"HUB TAMPICO":C.azul,"HUB OAXACA":C.amarillo,"HUB PACHUCA":C.morado,"RETAIL":C.naranja}[d]||C.naranja):C.g4),
                  background:destino===d?({"HUB VERACRUZ":C.verde,"HUB TAMPICO":C.azul,"HUB OAXACA":C.amarillo,"HUB PACHUCA":C.morado,"RETAIL":C.naranja}[d]||C.naranja)+"22":C.g3,
                  color:destino===d?({"HUB VERACRUZ":C.verde,"HUB TAMPICO":C.azul,"HUB OAXACA":C.amarillo,"HUB PACHUCA":C.morado,"RETAIL":C.naranja}[d]||C.naranja):C.sub,
                  fontSize:12,fontWeight:700,cursor:"pointer"}}>
                {d}
              </button>
            ))}
          </div>
          <label style={{fontSize:10,color:C.sub,letterSpacing:2,textTransform:"uppercase"}}>Transportista</label>
          <select value={trans} onChange={e=>{setTrans(e.target.value);setCap(capsPorTrans[e.target.value][0]);}}
            style={{width:"100%",background:C.g3,border:"1px solid "+C.g4,borderRadius:9,
              padding:"11px 12px",color:C.txt,fontSize:14,outline:"none",marginBottom:12,marginTop:4}}>
            {TRANSPORTISTAS_CFG.map(t=><option key={t.nombre} value={t.nombre}>{t.nombre}</option>)}
          </select>
          <label style={{fontSize:10,color:C.sub,letterSpacing:2,textTransform:"uppercase"}}>Capacidad (m3)</label>
          <select value={cap} onChange={e=>setCap(e.target.value)}
            style={{width:"100%",background:C.g3,border:"1px solid "+C.g4,borderRadius:9,
              padding:"11px 12px",color:C.txt,fontSize:14,outline:"none",marginBottom:20,marginTop:4}}>
            {(capsPorTrans[trans]||[]).map(c=><option key={c} value={c}>{c} m3</option>)}
          </select>
          <button onClick={agregarCarga} disabled={!folio.trim()}
            style={{width:"100%",padding:13,borderRadius:10,border:"none",
              background:folio.trim()?"linear-gradient(90deg,"+C.naranjaD+","+C.naranja+")":C.g4,
              color:"#fff",fontSize:15,fontWeight:800,cursor:folio.trim()?"pointer":"not-allowed"}}>
            Registrar Carga
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{padding:"12px 12px 32px"}}>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <input value={busqueda} onChange={e=>setBusqueda(e.target.value)}
          placeholder="Buscar folio, complemento, economico..."
          style={{flex:1,background:C.g2,border:"1px solid "+C.g4,borderRadius:10,
            padding:"10px 12px",color:C.txt,fontSize:13,outline:"none"}}/>
        {user.rol==="admin"&&(
          <button onClick={()=>setVista("nueva")}
            style={{padding:"10px 14px",borderRadius:10,border:"none",
              background:"linear-gradient(90deg,"+C.naranjaD+","+C.naranja+")",
              color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}>
            + Nueva
          </button>
        )}
      </div>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:10}}>
        {["TODOS",...DESTINOS].map(d=>{
          const dc={"HUB VERACRUZ":C.verde,"HUB TAMPICO":C.azul,"HUB OAXACA":C.amarillo,"HUB PACHUCA":C.morado,"RETAIL":C.naranja};
          return (
            <button key={d} onClick={()=>setFiltroDestino(d)}
              style={{padding:"5px 11px",borderRadius:20,
                border:"1.5px solid "+(filtroDestino===d?(dc[d]||C.naranja):C.g4),
                background:filtroDestino===d?(dc[d]||C.naranja)+"22":C.g2,
                color:filtroDestino===d?(dc[d]||C.naranja):C.sub,
                fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
              {d==="TODOS"?"Todos":d}
            </button>
          );
        })}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {["TODOS","pendiente","cargada","surtida"].map(e=>(
          <button key={e} onClick={()=>setFiltroEstado(e)}
            style={{padding:"5px 11px",borderRadius:20,
              border:"1.5px solid "+(filtroEstado===e?({pendiente:C.amarillo,cargada:C.verde,surtida:C.azul}[e]||C.naranja):C.g4),
              background:filtroEstado===e?({pendiente:C.amarillo,cargada:C.verde,surtida:C.azul}[e]||C.naranja)+"22":C.g2,
              color:filtroEstado===e?({pendiente:C.amarillo,cargada:C.verde,surtida:C.azul}[e]||C.naranja):C.sub,
              fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
            {e==="TODOS"?"Todos":e.charAt(0).toUpperCase()+e.slice(1)}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:12}}>
        {[
          {l:"Total",v:cargas.length,col:C.naranja},
          {l:"Pendientes",v:cargas.filter(c=>c.estado==="pendiente").length,col:C.amarillo},
          {l:"Cargadas",v:cargas.filter(c=>c.estado==="cargada").length,col:C.verde},
          {l:"Surtidas",v:cargas.filter(c=>c.estado==="surtida").length,col:C.azul},
        ].map(k=>(
          <div key={k.l} style={{background:C.g2,borderRadius:9,padding:"7px 4px",textAlign:"center",borderTop:"2px solid "+k.col}}>
            <div style={{fontSize:18,fontWeight:900,color:k.col}}>{k.v}</div>
            <div style={{fontSize:8,color:C.sub,marginTop:1}}>{k.l}</div>
          </div>
        ))}
      </div>
      {filtradas.length===0&&(
        <p style={{textAlign:"center",padding:"40px 0",color:C.sub,fontSize:13}}>
          {cargas.length===0?"Sin cargas registradas":"Sin resultados"}
        </p>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtradas.map(c=>{
          const dc={"HUB VERACRUZ":C.verde,"HUB TAMPICO":C.azul,"HUB OAXACA":C.amarillo,"HUB PACHUCA":C.morado,"RETAIL":C.naranja};
          const ec={pendiente:C.amarillo,cargada:C.verde,surtida:C.azul};
          const ei={pendiente:"⏳",cargada:"✅",surtida:"🚀"};
          return (
            <div key={c.id} onClick={()=>{setCargaId(c.id);setVista("detalle");}}
              style={{background:C.g2,borderRadius:12,padding:"11px 14px",cursor:"pointer",
                borderLeft:"3px solid "+(ec[c.estado]||C.sub)}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span style={{fontSize:15,fontWeight:900,color:coloresTrans[c.transportista]||C.naranja}}>{c.folio}</span>
                    {c.fotos.length>0&&<span style={{fontSize:11}}>📷{c.fotos.length}</span>}
                    {!c.economico&&<span style={{fontSize:10,color:C.rojo}}>sin eco.</span>}
                  </div>
                  {c.complemento&&<div style={{fontSize:11,color:C.sub,marginTop:1}}>Comp: {c.complemento}</div>}
                  <div style={{fontSize:11,color:C.sub,marginTop:1}}>
                    {c.transportista} {c.capacidad}m3
                    {c.economico&&<span style={{color:C.azul,marginLeft:8}}>{c.economico}</span>}
                  </div>
                  <div style={{marginTop:4,fontSize:10,fontWeight:700,color:dc[c.destino]||C.sub}}>{c.destino}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,marginLeft:8}}>
                  <div style={{background:(ec[c.estado]||C.sub)+"22",borderRadius:7,padding:"3px 9px",
                    fontSize:11,fontWeight:700,color:ec[c.estado]||C.sub}}>
                    {ei[c.estado]} {c.estado.charAt(0).toUpperCase()+c.estado.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Historial({ hist }) {
  const iconA={carga:"✅",descarga:"↩️",ajuste_plan:"✏️",nueva_carga:"📦",
    estado_cargada:"✅",estado_surtida:"🚀",estado_pendiente:"⏳",estado_actualizada:"🔄"};
  const colA={carga:C.verde,descarga:C.rojo,ajuste_plan:C.amarillo,nueva_carga:C.naranja,
    estado_cargada:C.verde,estado_surtida:C.azul,estado_pendiente:C.amarillo,estado_actualizada:C.sub};
  const labelA={carga:"Carga registrada",descarga:"Revertida",ajuste_plan:"Ajuste plan",
    nueva_carga:"Nueva carga",estado_cargada:"Marcada cargada",estado_surtida:"Marcada surtida",
    estado_pendiente:"Revertida pendiente",estado_actualizada:"Actualizada"};
  if(!hist.length) return (
    <p style={{textAlign:"center",padding:"40px 0",color:C.sub,fontSize:13}}>Sin movimientos</p>
  );
  return (
    <div style={{padding:"12px 12px 32px"}}>
      <p style={{fontSize:9,letterSpacing:3,color:C.naranja,textTransform:"uppercase",marginBottom:10}}>
        Historial del dia
      </p>
      {hist.map((r,i)=>(
        <div key={i} style={{background:C.g2,borderRadius:11,padding:"10px 14px",marginBottom:7,
          borderLeft:"3px solid "+(colA[r.accion]||C.sub)}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <span style={{fontSize:12}}>{iconA[r.accion]||"📌"} </span>
              <span style={{fontSize:13,fontWeight:700,color:colA[r.accion]||C.sub}}>
                {labelA[r.accion]||r.accion}
              </span>
            </div>
            <span style={{fontSize:10,color:C.sub,whiteSpace:"nowrap",marginLeft:8}}>{hora(r.ts)}</span>
          </div>
          <div style={{fontSize:11,color:C.sub,marginTop:3}}>
            {r.folio&&<span style={{color:C.txt,marginRight:6}}>{r.folio}</span>}
            {r.destino&&<span style={{color:C.sub,marginRight:6}}>{r.destino}</span>}
            {r.transportista} {r.capacidad}m3 - {r.usuario}
          </div>
        </div>
      ))}
    </div>
  );
}

function PanelConfig({ plan, fechaPlan, onGuardarFecha, onGuardarPlan }) {
  const [fecha,setFecha]=useState(fechaPlan);
  const [planEdit,setPlanEdit]=useState(plan.map(r=>({...r})));
  const [guardado,setGuardado]=useState(false);

  function cambiarPlan(id,val){
    const n=Math.max(0,parseInt(val)||0);
    setPlanEdit(prev=>prev.map(r=>r.id===id?{...r,plan:n}:r));
  }

  function guardarTodo(){
    onGuardarFecha(fecha);
    // resetear cargadas/surtidas solo si el plan cambia, mantener avance
    const nuevo=planEdit.map(r=>({
      ...r,
      cargadas:Math.min(r.cargadas,r.plan),
      surtidas:Math.min(r.surtidas,r.plan),
    }));
    onGuardarPlan(nuevo);
    setGuardado(true);
    setTimeout(()=>setGuardado(false),2500);
  }

  const grupos=[...new Set(planEdit.map(r=>r.transportista))];

  return (
    <div style={{padding:"12px 12px 40px"}}>
      <p style={{fontSize:9,letterSpacing:3,color:C.naranja,textTransform:"uppercase",marginBottom:14}}>
        Configuracion del Plan
      </p>

      {/* Fecha */}
      <div style={{background:C.g2,borderRadius:12,padding:16,marginBottom:14}}>
        <p style={{fontSize:11,color:C.sub,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>
          Fecha del Plan
        </p>
        <input value={fecha} onChange={e=>setFecha(e.target.value)}
          placeholder="Ej. 31 de mayo de 2026"
          style={{width:"100%",background:C.g3,border:"1px solid "+C.naranja+"55",borderRadius:9,
            padding:"11px 12px",color:C.txt,fontSize:14,fontWeight:700,outline:"none"}}/>
        <p style={{fontSize:10,color:C.sub,marginTop:6}}>
          Escribe la fecha como quieres que aparezca en el dashboard
        </p>
      </div>

      {/* Plan por transportista */}
      <div style={{background:C.g2,borderRadius:12,padding:16,marginBottom:16}}>
        <p style={{fontSize:11,color:C.sub,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>
          Unidades del Plan por Linea
        </p>
        {grupos.map(nom=>{
          const rows=planEdit.filter(r=>r.transportista===nom);
          const cfg=TRANSPORTISTAS_CFG.find(t=>t.nombre===nom);
          const color=cfg?cfg.color:C.naranja;
          const icon=cfg?cfg.icon:"🚛";
          return (
            <div key={nom} style={{marginBottom:16,paddingBottom:16,borderBottom:"1px solid "+C.g3}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:14}}>{icon}</span>
                <span style={{fontSize:15,fontWeight:900,color}}>{nom}</span>
              </div>
              {rows.map(r=>(
                <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{flex:1,background:C.g3,borderRadius:8,padding:"8px 12px"}}>
                    <span style={{fontSize:13,color,fontWeight:700}}>{r.capacidad} m3</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <button onClick={()=>cambiarPlan(r.id,r.plan-1)}
                      style={{width:32,height:32,borderRadius:8,border:"none",cursor:"pointer",
                        background:r.plan<=0?C.g4:C.rojo+"33",color:r.plan<=0?C.g4:C.rojo,
                        fontSize:18,fontWeight:700}}>-</button>
                    <input type="number" value={r.plan} onChange={e=>cambiarPlan(r.id,e.target.value)}
                      style={{width:52,textAlign:"center",background:C.g3,
                        border:"1px solid "+color+"55",borderRadius:8,padding:"6px 4px",
                        color:C.txt,fontSize:16,fontWeight:900,outline:"none"}}/>
                    <button onClick={()=>cambiarPlan(r.id,r.plan+1)}
                      style={{width:32,height:32,borderRadius:8,border:"none",cursor:"pointer",
                        background:C.verde+"33",color:C.verde,fontSize:18,fontWeight:700}}>+</button>
                  </div>
                  <span style={{fontSize:10,color:C.sub,minWidth:30}}>uds</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Boton guardar */}
      <button onClick={guardarTodo}
        style={{width:"100%",padding:14,borderRadius:12,border:"none",cursor:"pointer",
          background:guardado?"linear-gradient(90deg,#2d7a4f,"+C.verde+")":"linear-gradient(90deg,"+C.naranjaD+","+C.naranja+")",
          color:"#fff",fontSize:15,fontWeight:900,transition:"background .3s"}}>
        {guardado?"✅ Guardado correctamente":"💾 Guardar cambios del plan"}
      </button>
      <p style={{fontSize:10,color:C.sub,textAlign:"center",marginTop:10,lineHeight:1.5}}>
        Al guardar, la fecha y las cantidades se actualizan para todos los usuarios en tiempo real.
      </p>
    </div>
  );
}

export default function App() {
  const [user,setUser]=useState(null);
  const [plan,setPlan]=useState(PLAN_INICIAL);
  const [cargas,setCargas]=useState([]);
  const [hist,setHist]=useState([]);
  const [tab,setTab]=useState("dashboard");
  const [saving,setSaving]=useState(false);
  const [lastSync,setLastSync]=useState(null);
  const [fechaPlan,setFechaPlan]=useState(FECHA_INICIAL);
  const SK={plan:"baz-plan-v4",cargas:"baz-cargas-v4",hist:"baz-hist-v4",fecha:"baz-fecha-v4"};

  const cargarDatos=useCallback(async()=>{
    try{
      const rp=await window.storage.get(SK.plan,true);   if(rp) setPlan(JSON.parse(rp.value));
      const rc=await window.storage.get(SK.cargas,true); if(rc) setCargas(JSON.parse(rc.value));
      const rh=await window.storage.get(SK.hist,true);   if(rh) setHist(JSON.parse(rh.value));
      const rf=await window.storage.get(SK.fecha,true);  if(rf) setFechaPlan(rf.value);
      setLastSync(new Date());
    }catch(_){}
  },[]);

  useEffect(()=>{
    cargarDatos();
    const t=setInterval(cargarDatos,8000);
    return()=>clearInterval(t);
  },[cargarDatos]);

  async function guardar(nc,np,nh){
    setSaving(true);
    try{
      if(nc!==undefined) await window.storage.set(SK.cargas,JSON.stringify(nc),true);
      if(np!==undefined) await window.storage.set(SK.plan,JSON.stringify(np),true);
      if(nh!==undefined) await window.storage.set(SK.hist,JSON.stringify(nh),true);
    }catch(_){}
    setSaving(false);
    setLastSync(new Date());
  }

  async function guardarFecha(f){
    setFechaPlan(f);
    try{ await window.storage.set(SK.fecha,f,true); }catch(_){}
  }

  async function guardarPlan(np){
    setPlan(np);
    try{ await window.storage.set(SK.plan,JSON.stringify(np),true); }catch(_){}
  }

  if(!user) return <Login onLogin={u=>{setUser(u);cargarDatos();}}/>;

  const totalP=plan.reduce((a,r)=>a+r.plan,0);
  const totalC=plan.reduce((a,r)=>a+r.cargadas,0);
  const avance=pct(totalC,totalP);

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

  return (
    <div style={{background:C.negro,minHeight:"100vh",fontFamily:"Arial,sans-serif",color:C.txt,
      ...(isDesktop ? {} : {maxWidth:430,margin:"0 auto"})}}>
      <div style={{background:"linear-gradient(160deg,#111,"+C.g1+")",
        borderBottom:"2.5px solid "+C.naranja,padding:"14px 16px 12px",
        position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <Logo width={115}/>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:user.rol==="admin"?C.naranja:C.sub,fontWeight:700}}>
              {user.rol==="admin"?"Admin":"Op"}: {user.nombre}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,justifyContent:"flex-end",marginTop:3}}>
              {saving&&<span style={{fontSize:9,color:C.naranja}}>guardando...</span>}
              {lastSync&&!saving&&<span style={{fontSize:9,color:C.verde}}>sync {hora(lastSync)}</span>}
              <button onClick={()=>setUser(null)}
                style={{fontSize:10,color:C.naranja,background:"none",
                  border:"1px solid "+C.naranja+"44",borderRadius:6,padding:"3px 8px",cursor:"pointer"}}>
                Salir
              </button>
            </div>
          </div>
        </div>
        <div style={{background:C.g2,borderRadius:10,padding:"9px 13px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <span style={{fontSize:10,color:C.sub,letterSpacing:1,textTransform:"uppercase"}}>Avance {fechaPlan}</span>
            <span style={{fontSize:24,fontWeight:900,color:avance>0?sem(avance):C.sub,lineHeight:1}}>
              {avance}<span style={{fontSize:13,fontWeight:400}}>%</span>
            </span>
          </div>
          <div style={{height:6,background:C.g4,borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",width:avance+"%",borderRadius:3,
              background:"linear-gradient(90deg,"+C.naranjaD+","+C.naranja+","+C.naranjaL+")"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
            <span style={{fontSize:10,color:C.verde}}>{totalC} cargadas</span>
            <span style={{fontSize:10,color:C.sub}}>{totalP} plan - {cargas.length} cargas</span>
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:6,padding:"10px 12px 8px",
        position:"sticky",top:142,background:C.negro,zIndex:50,
        borderBottom:"1px solid "+C.g2}}>
        {[
          {id:"dashboard",label:"Dashboard",icon:"📊"},
          {id:"cargas",label:"Cargas",icon:"📦"},
          {id:"historial",label:"Historial",icon:"📋"},
          ...(user.rol==="admin"?[{id:"config",label:"Config",icon:"⚙️"}]:[])
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1,padding:"9px 4px",borderRadius:10,border:"none",cursor:"pointer",
            fontWeight:700,fontSize:11,
            background:tab===t.id?C.naranja:C.g2,
            color:tab===t.id?"#fff":C.sub,
            boxShadow:tab===t.id?"0 4px 14px "+C.naranja+"44":"none"}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      {tab==="dashboard"&&<Dashboard plan={plan} cargas={cargas} fechaPlan={fechaPlan} isDesktop={isDesktop}/>}
      {tab==="cargas"&&(
        <PanelCargas cargas={cargas} setCargas={setCargas}
          plan={plan} setPlan={setPlan}
          hist={hist} setHist={setHist}
          user={user} guardar={guardar} isDesktop={isDesktop}/>
      )}
      {tab==="historial"&&<Historial hist={hist} isDesktop={isDesktop}/>}
      {tab==="config"&&user.rol==="admin"&&(
        <PanelConfig plan={plan} fechaPlan={fechaPlan}
          onGuardarFecha={guardarFecha}
          onGuardarPlan={guardarPlan} isDesktop={isDesktop}/>
      )}
      <div style={{textAlign:"center",padding:"0 0 28px",fontSize:8,color:C.g4,letterSpacing:2}}>
        BAZ ENTREGAS - GRUPO SALINAS - OPERACION LOGISTICA
      </div>
    </div>
  );
}
