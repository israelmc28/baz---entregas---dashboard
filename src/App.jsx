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
  { nombre:"LTI",     color:"#FF6B00", icon:"🚛", caps:[50,90,110] },
  { nombre:"Moro",    color:"#FFB347", icon:"🚚", caps:[70,80]     },
  { nombre:"Levstom", color:"#A78BFA", icon:"🚐", caps:[110]       },
  { nombre:"Aguilar", color:"#4A9EFF", icon:"🏗️", caps:[80]        },
];

const PLAN_INICIAL = [
  { id:"lti-50",     transportista:"LTI",     color:"#FF6B00", icon:"🚛", capacidad:50,  plan:14, cargadas:0, surtidas:0 },
  { id:"lti-90",     transportista:"LTI",     color:"#FF6B00", icon:"🚛", capacidad:90,  plan:3,  cargadas:0, surtidas:0 },
  { id:"lti-110",    transportista:"LTI",     color:"#FF6B00", icon:"🚛", capacidad:110, plan:4,  cargadas:0, surtidas:0 },
  { id:"moro-70",    transportista:"Moro",    color:"#FFB347", icon:"🚚", capacidad:70,  plan:1,  cargadas:0, surtidas:0 },
  { id:"moro-80",    transportista:"Moro",    color:"#FFB347", icon:"🚚", capacidad:80,  plan:2,  cargadas:0, surtidas:0 },
  { id:"levstom-110",transportista:"Levstom", color:"#A78BFA", icon:"🚐", capacidad:110, plan:0,  cargadas:0, surtidas:0 },
  { id:"aguilar-80", transportista:"Aguilar", color:"#4A9EFF", icon:"🏗️", capacidad:80,  plan:0,  cargadas:0, surtidas:0 },
];

function pct(a,b){ return b===0?0:Math.round((a/b)*100); }
function sem(v){ return v>=80?C.verde:v>=40?C.amarillo:v>0?C.rojo:C.sub; }
function hora(ts){ return new Date(ts).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}); }
function fechaCorta(ts){ return new Date(ts).toLocaleDateString("es-MX",{day:"2-digit",month:"short"}); }

/* ── LOGO ─────────────────────────── */
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

/* ── LOGIN ────────────────────────── */
function Login({ onLogin }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [err,setErr]=useState("");
  function go(){ const u=USUARIOS.find(u=>u.email===email&&u.pass===pass); u?onLogin(u):setErr("Datos incorrectos"); }
  return (
    <div style={{minHeight:"100vh",background:C.negro,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:24,
      fontFamily:"-appl
