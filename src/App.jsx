import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, PieChart, Pie, Legend, LineChart, Line,
} from "recharts";

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0a1628}::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:3px}
    @keyframes fadeIn {from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
    @keyframes pulse  {0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes blink  {0%,100%{opacity:1}50%{opacity:0}}
    .fi{animation:fadeIn .3s ease both}.si{animation:slideIn .3s ease both}
    .rh{transition:background .15s;cursor:pointer}.rh:hover{background:rgba(0,212,170,.05)!important}
    .chip{display:inline-flex;align-items:center;padding:2px 9px;border-radius:10px;font-size:11px;font-weight:600;letter-spacing:.04em}
    button{transition:all .18s;cursor:pointer}button:hover{filter:brightness(1.08)}
    .cursor::after{content:'▋';animation:blink 1s step-end infinite;margin-left:1px;color:#00d4aa}
  `}</style>
);

const C = {
  teal:'#00d4aa',amber:'#f59e0b',red:'#ef4444',blue:'#3b82f6',purple:'#a78bfa',
  bg0:'#06101f',bg1:'#0a1628',bg2:'#0d1f3c',border:'#1e3a5f',
  text:'#dde6f0',muted:'#475569',sub:'#94a3b8',
};

const TIPOS = [
  {key:'sinLicencia',  label:'Sin licencia turística',color:C.red   },
  {key:'precioAbusivo',label:'Precio abusivo',        color:C.amber },
  {key:'fraude',       label:'Fraude / datos falsos', color:C.purple},
  {key:'duplicados',   label:'Anuncios duplicados',   color:C.blue  },
];

const PLATS = [
  {
    id:'airbnb',name:'Airbnb',color:'#FF5A5F',logo:'🏠',
    anuncios:18420,anomalias:1243,tasa:6.75,sinLicencia:612,precioAbusivo:318,fraude:187,duplicados:126,
    tendencia:[{m:'Jul',v:820},{m:'Ago',v:950},{m:'Sep',v:1020},{m:'Oct',v:1090},{m:'Nov',v:1150},{m:'Dic',v:1243}],
    zonas:[{z:'Barcelona',sin:198,precio:112,fraude:67,dup:45},{z:'Madrid',sin:165,precio:88,fraude:51,dup:38},{z:'Valencia',sin:142,precio:71,fraude:42,dup:22},{z:'Sevilla',sin:62,precio:28,fraude:15,dup:12},{z:'Malaga',sin:45,precio:19,fraude:12,dup:9}],
    ejemplos:[
      {id:'ANB-4421',zona:'Barcelona',titulo:'Atico con vistas al mar',       precio:'340 euros/noche',tipo:'Sin licencia turistica',          riesgo:'alto'},
      {id:'ANB-3812',zona:'Valencia', titulo:'Piso reformado centro ciudad',   precio:'185 euros/noche',tipo:'Precio +180% sobre indice zonal', riesgo:'alto'},
      {id:'ANB-2290',zona:'Madrid',   titulo:'Estudio luminoso Malasana',      precio:'220 euros/noche',tipo:'Anfitrion con 4 anuncios sin VUT', riesgo:'alto'},
      {id:'ANB-1105',zona:'Sevilla',  titulo:'Casa con patio en Triana',       precio:'165 euros/noche',tipo:'Duplicado detectado en Booking',   riesgo:'medio'},
    ],
  },
  {
    id:'booking',name:'Booking.com',color:'#4A90D9',logo:'🌐',
    anuncios:11350,anomalias:734,tasa:6.47,sinLicencia:318,precioAbusivo:201,fraude:143,duplicados:72,
    tendencia:[{m:'Jul',v:470},{m:'Ago',v:540},{m:'Sep',v:590},{m:'Oct',v:640},{m:'Nov',v:690},{m:'Dic',v:734}],
    zonas:[{z:'Barcelona',sin:105,precio:71,fraude:52,dup:24},{z:'Madrid',sin:88,precio:55,fraude:38,dup:18},{z:'Valencia',sin:72,precio:42,fraude:31,dup:16},{z:'Sevilla',sin:33,precio:21,fraude:13,dup:9},{z:'Malaga',sin:20,precio:12,fraude:9,dup:5}],
    ejemplos:[
      {id:'BKG-9921',zona:'Barcelona',titulo:'Apart. moderno cerca Las Ramblas',precio:'295 euros/noche',tipo:'Sin numero de registro HUTB',      riesgo:'alto'},
      {id:'BKG-7743',zona:'Madrid',   titulo:'Loft en el barrio de Chueca',    precio:'198 euros/noche',tipo:'Descripcion falsea superficie real', riesgo:'medio'},
      {id:'BKG-5502',zona:'Valencia', titulo:'Duplex a 10 min de la playa',    precio:'220 euros/noche',tipo:'Precio +210% en festivos sin aviso', riesgo:'alto'},
      {id:'BKG-3318',zona:'Sevilla',  titulo:'Hostal familiar casco antiguo',  precio:'89 euros/noche', tipo:'Duplicado detectado en Airbnb',     riesgo:'medio'},
    ],
  },
  {
    id:'vrbo',name:'Vrbo',color:'#1ABCFE',logo:'🏡',
    anuncios:4820,anomalias:298,tasa:6.18,sinLicencia:142,precioAbusivo:88,fraude:41,duplicados:27,
    tendencia:[{m:'Jul',v:180},{m:'Ago',v:215},{m:'Sep',v:238},{m:'Oct',v:255},{m:'Nov',v:275},{m:'Dic',v:298}],
    zonas:[{z:'Barcelona',sin:48,precio:31,fraude:15,dup:9},{z:'Madrid',sin:38,precio:22,fraude:11,dup:7},{z:'Valencia',sin:32,precio:19,fraude:9,dup:6},{z:'Sevilla',sin:14,precio:9,fraude:4,dup:3},{z:'Malaga',sin:10,precio:7,fraude:2,dup:2}],
    ejemplos:[
      {id:'VBR-2241',zona:'Barcelona',titulo:'Villa con piscina privada',      precio:'580 euros/noche',tipo:'Sin licencia de actividades',         riesgo:'alto'},
      {id:'VBR-1882',zona:'Madrid',   titulo:'Casa completa 4 hab. Chamberi', precio:'320 euros/noche',tipo:'Direccion no verificable en catastro', riesgo:'medio'},
    ],
  },
  {
    id:'hometogo',name:'HomeToGo',color:'#FF6B35',logo:'🔑',
    anuncios:3210,anomalias:187,tasa:5.83,sinLicencia:89,precioAbusivo:55,fraude:28,duplicados:15,
    tendencia:[{m:'Jul',v:110},{m:'Ago',v:132},{m:'Sep',v:148},{m:'Oct',v:160},{m:'Nov',v:172},{m:'Dic',v:187}],
    zonas:[{z:'Barcelona',sin:30,precio:19,fraude:10,dup:5},{z:'Madrid',sin:25,precio:15,fraude:8,dup:4},{z:'Valencia',sin:20,precio:12,fraude:6,dup:3},{z:'Sevilla',sin:9,precio:5,fraude:2,dup:2},{z:'Malaga',sin:5,precio:4,fraude:2,dup:1}],
    ejemplos:[
      {id:'HTG-0912',zona:'Valencia',titulo:'Apartamento playa El Saler',     precio:'195 euros/noche',tipo:'Agregador: anuncio sin licencia origen',riesgo:'alto'},
      {id:'HTG-0445',zona:'Malaga',  titulo:'Bungalow urbanizacion Costa Sol',precio:'145 euros/noche',tipo:'Precio inflado +165% temporada alta',  riesgo:'medio'},
    ],
  },
];

const GPU_CPS = 220;
const CPU_CPS = 5;
const PROMPT = "Analiza este anuncio de alquiler vacacional e identifica posibles infracciones: piso en Barcelona, centro ciudad, 65m2, precio 340 euros/noche, sin numero de licencia turistica visible, publicado por anfitrion con 12 anuncios activos. Indica tipo de infraccion, normativa aplicable y accion inspectora recomendada.";
const FALLBACK = `ANALISIS DE ANUNCIO - ID: ANB-4421

INFRACCIONES DETECTADAS:

1. Ausencia de numero de licencia turistica (HUTB)
   Normativa: Decreto 75/2020 de la Generalitat de Catalunya y Ordenanza de Turismo del Ajuntament de Barcelona (2022). Todo anuncio de apartamento de uso turistico debe mostrar el numero HUTB de forma visible. Su omision constituye infraccion grave segun el art. 84 de la Llei de Turisme de Catalunya.

2. Volumen anomalo de anuncios por anfitrion
   El anfitrion gestiona 12 anuncios activos. Conforme al Reglamento PEUAT de Barcelona, el ejercicio de la actividad turistica con caracter empresarial sin licencia de actividades es infraccion muy grave. La acumulacion de anuncios sugiere gestion profesional no declarada.

3. Precio potencialmente abusivo
   340 euros/noche para 65 m2 = 5,23 euros/m2/noche, muy superior a la mediana zonal. En el contexto de emergencia habitacional de Barcelona pueden activarse mecanismos de supervision adicionales.

ACCION INSPECTORA RECOMENDADA:
- Requerimiento de aportacion del numero HUTB a la plataforma Airbnb (art. 16.2 LSSI).
- Comprobacion cruzada de los 12 anuncios del anfitrion en el registro municipal.
- Traslado al Departament de Turisme de la Generalitat para expediente sancionador si se confirma la ausencia de licencia.`;

const riskColor = (r) => r==='alto' ? C.red : r==='medio' ? C.amber : C.blue;

function StatCard({ icon, label, val, color, sub }) {
  return (
    <div style={{ flex:1, background:C.bg1, border:`1px solid ${C.border}`, borderRadius:10, padding:'13px 15px' }}>
      <div style={{ fontSize:10, color:C.muted, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:3 }}>{icon} {label}</div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:21, fontWeight:700, color:color||C.text }}>{val}</div>
      {sub && <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{sub}</div>}
    </div>
  );
}

function Chip({ label, color }) {
  return <span className="chip" style={{ background:`${color}22`, color }}>{label}</span>;
}

function VistaGlobal({ onSelect }) {
  const total     = PLATS.reduce((s,p) => s+p.anuncios, 0);
  const totalAnom = PLATS.reduce((s,p) => s+p.anomalias, 0);
  const totalSin  = PLATS.reduce((s,p) => s+p.sinLicencia, 0);
  const barData   = PLATS.map(p => ({ name:p.name.split(' ')[0], sinLicencia:p.sinLicencia, precioAbusivo:p.precioAbusivo, fraude:p.fraude, duplicados:p.duplicados }));
  const pieData   = TIPOS.map(t => ({ name:t.label, value:PLATS.reduce((s,p)=>s+p[t.key],0), color:t.color }));
  const tendData  = ['Jul','Ago','Sep','Oct','Nov','Dic'].map((m,i) => ({ m, ...Object.fromEntries(PLATS.map(p=>[p.id,p.tendencia[i].v])) }));
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18, padding:'22px 26px' }}>
      <div style={{ display:'flex', gap:12 }}>
        <StatCard icon="📋" label="Anuncios monitorizados"    val={total.toLocaleString()}     color={C.teal}  sub="4 plataformas"/>
        <StatCard icon="⚠️" label="Anomalias detectadas (30d)" val={totalAnom.toLocaleString()} color={C.amber} sub={`${((totalAnom/total)*100).toFixed(1)}% del total`}/>
        <StatCard icon="🚫" label="Sin licencia turistica"    val={totalSin.toLocaleString()}   color={C.red}   sub="Infraccion directa"/>
        <StatCard icon="🏙️" label="Zonas vigiladas"           val="5"                           color={C.blue}  sub="MAD BCN VLC SEV MLG"/>
        <StatCard icon="⏱"  label="Ultima extraccion"         val="hace 11 min"                 color={C.sub}/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {PLATS.map(p => (
          <div key={p.id} className="fi rh" onClick={() => onSelect(p)}
            style={{ background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:p.color, borderRadius:'12px 12px 0 0' }}/>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <span style={{ fontSize:20 }}>{p.logo}</span>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:C.text }}>{p.name}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[['Anuncios',p.anuncios.toLocaleString(),C.sub],['Anomalias',p.anomalias.toLocaleString(),C.amber],['Sin lic.',p.sinLicencia,C.red],['Tasa %',p.tasa+'%',p.tasa>6.5?C.red:C.amber]].map(([k,v,c]) => (
                <div key={k} style={{ background:'#060e1f', borderRadius:7, padding:'8px 10px' }}>
                  <div style={{ fontSize:10, color:C.muted, marginBottom:2 }}>{k}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, color:c, fontWeight:500 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:10, textAlign:'right' }}><span style={{ fontSize:11, color:p.color }}>Ver detalle →</span></div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:16 }}>
        <div style={{ flex:2, background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 20px' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:11, color:C.muted, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:14 }}>Anomalias por tipo y plataforma</div>
          <ResponsiveContainer width="100%" height={175}>
            <BarChart data={barData} margin={{ top:4, right:8, bottom:0, left:-10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false}/>
              <XAxis dataKey="name" tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:C.bg1, border:`1px solid ${C.border}`, borderRadius:8, fontFamily:'DM Sans', fontSize:12 }}/>
              <Legend wrapperStyle={{ fontSize:11, fontFamily:'DM Sans', paddingTop:8 }}/>
              {TIPOS.map(t => <Bar key={t.key} dataKey={t.key} name={t.label} stackId="a" fill={t.color} radius={t.key==='duplicados'?[4,4,0,0]:[0,0,0,0]}/>)}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex:1, background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 20px' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:11, color:C.muted, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:14 }}>Distribucion global</div>
          <ResponsiveContainer width="100%" height={175}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} dataKey="value" paddingAngle={3}>
                {pieData.map((d,i) => <Cell key={i} fill={d.color}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:C.bg1, border:`1px solid ${C.border}`, borderRadius:8, fontFamily:'DM Sans', fontSize:12 }}/>
              <Legend wrapperStyle={{ fontSize:10, fontFamily:'DM Sans' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex:2, background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 20px' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:11, color:C.muted, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:14 }}>Tendencia anomalias - 6 meses</div>
          <ResponsiveContainer width="100%" height={175}>
            <LineChart data={tendData} margin={{ top:4, right:8, bottom:0, left:-10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f"/>
              <XAxis dataKey="m" tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:C.bg1, border:`1px solid ${C.border}`, borderRadius:8, fontFamily:'DM Sans', fontSize:12 }}/>
              <Legend wrapperStyle={{ fontSize:11, fontFamily:'DM Sans', paddingTop:8 }}/>
              {PLATS.map(p => <Line key={p.id} type="monotone" dataKey={p.id} name={p.name.split(' ')[0]} stroke={p.color} strokeWidth={2} dot={false} activeDot={{ r:4 }}/>)}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function DetallePlataforma({ plat, onBack }) {
  const [zonaF, setZonaF] = useState('Todas');
  const [sel, setSel]     = useState(null);
  const zonas    = ['Todas', ...plat.zonas.map(z => z.z)];
  const ejemplos = zonaF === 'Todas' ? plat.ejemplos : plat.ejemplos.filter(e => e.zona === zonaF);
  const zBar = plat.zonas.map(z => ({ name:z.z, 'Sin licencia':z.sin, 'Precio abusivo':z.precio, 'Fraude':z.fraude, 'Duplicados':z.dup }));
  const pie  = TIPOS.map(t => ({ name:t.label, value:plat[t.key], color:t.color }));
  return (
    <div className="fi" style={{ display:'flex', flexDirection:'column', gap:18, padding:'22px 26px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <button onClick={onBack} style={{ background:'transparent', border:`1px solid ${C.border}`, color:C.sub, borderRadius:8, padding:'6px 14px', fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>← Volver</button>
        <span style={{ fontSize:22 }}>{plat.logo}</span>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:C.text }}>{plat.name}</div>
          <div style={{ fontSize:12, color:C.muted }}>{plat.anuncios.toLocaleString()} anuncios · tasa anomalia: <span style={{ color:plat.tasa>6.5?C.red:C.amber }}>{plat.tasa}%</span></div>
        </div>
      </div>
      <div style={{ display:'flex', gap:12 }}>
        <StatCard icon="🚫" label="Sin licencia"   val={plat.sinLicencia}   color={C.red}    sub={`${((plat.sinLicencia/plat.anomalias)*100).toFixed(0)}%`}/>
        <StatCard icon="💸" label="Precio abusivo" val={plat.precioAbusivo} color={C.amber}  sub={`${((plat.precioAbusivo/plat.anomalias)*100).toFixed(0)}%`}/>
        <StatCard icon="🎭" label="Fraude"          val={plat.fraude}        color={C.purple} sub={`${((plat.fraude/plat.anomalias)*100).toFixed(0)}%`}/>
        <StatCard icon="🔁" label="Duplicados"      val={plat.duplicados}    color={C.blue}   sub={`${((plat.duplicados/plat.anomalias)*100).toFixed(0)}%`}/>
      </div>
      <div style={{ display:'flex', gap:16 }}>
        <div style={{ flex:3, background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 20px' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:11, color:C.muted, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:14 }}>Anomalias por zona</div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={zBar} margin={{ top:4, right:8, bottom:0, left:-10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false}/>
              <XAxis dataKey="name" tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:C.bg1, border:`1px solid ${C.border}`, borderRadius:8, fontFamily:'DM Sans', fontSize:12 }}/>
              <Legend wrapperStyle={{ fontSize:11, fontFamily:'DM Sans', paddingTop:8 }}/>
              <Bar dataKey="Sin licencia"   stackId="a" fill={C.red}/>
              <Bar dataKey="Precio abusivo" stackId="a" fill={C.amber}/>
              <Bar dataKey="Fraude"         stackId="a" fill={C.purple}/>
              <Bar dataKey="Duplicados"     stackId="a" fill={C.blue} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex:1.5, background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 20px' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:11, color:C.muted, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:14 }}>Distribucion</div>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={pie} cx="50%" cy="45%" innerRadius={38} outerRadius={62} dataKey="value" paddingAngle={3}>
                {pie.map((d,i) => <Cell key={i} fill={d.color}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:C.bg1, border:`1px solid ${C.border}`, borderRadius:8, fontFamily:'DM Sans', fontSize:12 }}/>
              <Legend wrapperStyle={{ fontSize:10, fontFamily:'DM Sans' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex:2, background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 20px' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:11, color:C.muted, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:14 }}>Evolucion (6 meses)</div>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={plat.tendencia} margin={{ top:4, right:8, bottom:0, left:-10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f"/>
              <XAxis dataKey="m" tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:C.bg1, border:`1px solid ${C.border}`, borderRadius:8, fontFamily:'DM Sans', fontSize:12 }}/>
              <Line type="monotone" dataKey="v" name="Anomalias" stroke={plat.color} strokeWidth={2.5} dot={false} activeDot={{ r:5 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden' }}>
        <div style={{ padding:'12px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:11, color:C.sub, letterSpacing:'.07em', textTransform:'uppercase' }}>Anuncios anomalos</span>
          {zonas.map(z => (
            <button key={z} onClick={() => { setZonaF(z); setSel(null); }}
              style={{ background:zonaF===z?'rgba(0,212,170,.12)':'transparent', color:zonaF===z?C.teal:C.muted, border:`1px solid ${zonaF===z?'#00d4aa55':C.border}`, borderRadius:14, padding:'3px 12px', fontSize:11, fontFamily:"'DM Sans',sans-serif" }}>
              {z}
            </button>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'110px 100px 1fr 150px 65px 1fr', padding:'9px 18px', borderBottom:`1px solid ${C.border}`, fontSize:10, color:C.muted, letterSpacing:'.07em', textTransform:'uppercase' }}>
          <span>ID</span><span>Zona</span><span>Anuncio</span><span>Precio</span><span>Riesgo</span><span>Tipo deteccion</span>
        </div>
        {ejemplos.map(e => (
          <div key={e.id} className="rh" onClick={() => setSel(sel?.id===e.id ? null : e)}
            style={{ display:'grid', gridTemplateColumns:'110px 100px 1fr 150px 65px 1fr', padding:'11px 18px', borderBottom:'1px solid #0d1829', alignItems:'center', gap:8, background:sel?.id===e.id?'rgba(0,212,170,.06)':'transparent' }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:C.teal }}>{e.id}</span>
            <span style={{ fontSize:12, color:C.sub }}>{e.zona}</span>
            <span style={{ fontSize:13, color:C.text, fontWeight:500 }}>{e.titulo}</span>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:C.text }}>{e.precio}</span>
            <Chip label={e.riesgo.toUpperCase()} color={riskColor(e.riesgo)}/>
            <span style={{ fontSize:12, color:C.sub }}>{e.tipo}</span>
          </div>
        ))}
      </div>
      {sel && (
        <div className="si" style={{ background:C.bg1, border:`1px solid ${riskColor(sel.riesgo)}55`, borderRadius:12, padding:'18px 22px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text }}>{sel.id} · {sel.titulo}</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{plat.name} · {sel.zona}</div>
            </div>
            <Chip label={sel.riesgo.toUpperCase()} color={riskColor(sel.riesgo)}/>
          </div>
          <div style={{ background:'#060e1f', border:`1px solid ${C.border}`, borderRadius:8, padding:'12px 16px', fontSize:13, color:C.sub, lineHeight:1.6 }}>
            <span style={{ color:riskColor(sel.riesgo), fontWeight:600 }}>Motivo: </span>{sel.tipo}
          </div>
        </div>
      )}
    </div>
  );
}

function useTimer(running) {
  const [t, setT] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (running) { ref.current = setInterval(() => setT(x => +(x + 0.1).toFixed(1)), 100); }
    else { clearInterval(ref.current); }
    return () => clearInterval(ref.current);
  }, [running]);
  return [t, () => setT(0)];
}

function OutputPanel({ title, icon, color, text, status, timer, totalLen, isCpu }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [text]);
  const cps = isCpu ? CPU_CPS : GPU_CPS;
  const tps = status==='running' ? (cps/4).toFixed(1) : status==='done' ? ((text.length/4)/Math.max(timer,0.1)).toFixed(1) : '---';
  const pct = totalLen>0 ? Math.min(100, Math.round((text.length/totalLen)*100)) : 0;
  return (
    <div style={{ flex:1, background:C.bg1, border:`1px solid ${status!=='idle'?color:C.border}`, borderRadius:12, padding:'18px 20px', display:'flex', flexDirection:'column', gap:12, transition:'border-color .4s', minWidth:0 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:20 }}>{icon}</span>
          <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:C.text }}>{title}</span>
        </div>
        <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:`${status==='idle'?C.border:color}22`, color:status==='idle'?C.muted:color, letterSpacing:'.06em', textTransform:'uppercase', animation:status==='running'?'pulse 1.5s ease infinite':'none' }}>
          {status==='idle'?'EN ESPERA':status==='running'?'PROCESANDO':'COMPLETADO'}
        </span>
      </div>
      <div style={{ display:'flex', gap:14, borderTop:`1px solid ${C.border}`, paddingTop:10 }}>
        {[['Tiempo',timer.toFixed(1)+'s',status==='running'?color:C.muted],['Tokens/s',tps,color],['Caracteres',text.length,C.muted]].map(([l,v,c]) => (
          <div key={l} style={{ flex:1 }}>
            <div style={{ fontSize:10, color:C.muted, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:2 }}>{l}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:500, color:c }}>{v}</div>
          </div>
        ))}
      </div>
      {(status==='running'||status==='done') && totalLen>0 && (
        <div style={{ height:3, background:C.border, borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:2, transition:'width .15s linear' }}/>
        </div>
      )}
      <div ref={ref} style={{ flex:1, minHeight:200, maxHeight:260, overflowY:'auto', background:'#060e1f', borderRadius:8, padding:'12px 14px', fontFamily:"'JetBrains Mono',monospace", fontSize:12, lineHeight:1.7, color:'#b8cfe8', whiteSpace:'pre-wrap', wordBreak:'break-word', border:'1px solid #111e30' }}>
        {status==='idle' && <span style={{ color:'#2e4a6a', fontStyle:'italic' }}>Esperando inicio de demo...</span>}
        {status!=='idle' && <span className={status==='running' && isCpu ? 'cursor' : ''}>{text || <span style={{ color:'#2e4a6a' }}>Generando respuesta...</span>}</span>}
        {status==='done' && <div style={{ marginTop:10, paddingTop:8, borderTop:`1px solid ${C.border}`, color, fontSize:11 }}>Analisis completado en {timer.toFixed(1)} s</div>}
      </div>
    </div>
  );
}

function TabComputo() {
  const [state,   setState]   = useState('idle');
  const [gpuText, setGpuText] = useState('');
  const [cpuText, setCpuText] = useState('');
  const [full,    setFull]    = useState('');
  const [gpuDone, setGpuDone] = useState(false);
  const [cpuDone, setCpuDone] = useState(false);
  const [gpuTime, resetGpu]   = useTimer(state==='running' && !gpuDone);
  const [cpuTime, resetCpu]   = useTimer(state==='running' && !cpuDone);
  const gpuRef = useRef(null);
  const cpuRef = useRef(null);
  const stopped = useRef(false);

  const run = async () => {
    setState('loading'); stopped.current = false;
    setGpuText(''); setCpuText(''); setGpuDone(false); setCpuDone(false);
    resetGpu(); resetCpu();
    let resp = FALLBACK;
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:1000,
          system: 'Eres inspector de consumo especializado en plataformas de alquiler vacacional en Espana. Cita normativa concreta.',
          messages: [{ role:'user', content:PROMPT }] }),
      });
      const d = await r.json();
      if (d?.content?.[0]?.text) resp = d.content[0].text;
    } catch(_) {}
    setFull(resp); setState('running');
    let gi = 0;
    gpuRef.current = setInterval(() => {
      if (stopped.current) { clearInterval(gpuRef.current); return; }
      const n = Math.min(gi + Math.ceil(GPU_CPS/10), resp.length);
      setGpuText(resp.slice(0, n)); gi = n;
      if (gi >= resp.length) { clearInterval(gpuRef.current); setGpuDone(true); }
    }, 100);
    let ci = 0;
    cpuRef.current = setInterval(() => {
      if (stopped.current) { clearInterval(cpuRef.current); return; }
      const n = Math.min(ci + Math.ceil(CPU_CPS/10), resp.length);
      setCpuText(resp.slice(0, n)); ci = n;
      if (ci >= resp.length) { clearInterval(cpuRef.current); setCpuDone(true); }
    }, 100);
  };

  const stopCpu = () => { clearInterval(cpuRef.current); stopped.current = true; setCpuDone(true); };
  const reset   = () => {
    clearInterval(gpuRef.current); clearInterval(cpuRef.current); stopped.current = true;
    setState('idle'); setGpuText(''); setCpuText(''); setGpuDone(false); setCpuDone(false); setFull('');
  };

  const gpuStatus = state==='idle'?'idle':gpuDone?'done':state==='loading'?'idle':'running';
  const cpuStatus = state==='idle'?'idle':cpuDone?'done':state==='loading'?'idle':'running';
  const expSec    = full.length > 0 ? Math.round(full.length / CPU_CPS) : null;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, padding:'22px 26px' }}>
      <div style={{ background:`linear-gradient(135deg,${C.bg2},${C.bg1})`, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px 22px' }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:12, color:C.teal, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Tarea real · Anuncio ANB-4421 detectado en Airbnb Barcelona</div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:C.text, lineHeight:1.55, marginBottom:16, fontStyle:'italic', color:C.sub }}>"{PROMPT}"</div>
        <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
          {state==='idle' && (
            <button onClick={run} style={{ background:C.teal, color:'#060e1f', fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, padding:'10px 24px', borderRadius:8, border:'none', letterSpacing:'.04em' }}>
              Ejecutar demo
            </button>
          )}
          {state==='loading' && (
            <div style={{ display:'flex', alignItems:'center', gap:10, color:C.muted, fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>
              <span style={{ animation:'pulse 1s ease infinite', display:'inline-block' }}>⏳</span> Conectando con el modelo...
            </div>
          )}
          {state==='running' && gpuDone && !cpuDone && (
            <>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:C.teal, background:`${C.teal}11`, padding:'6px 14px', borderRadius:6, border:`1px solid ${C.teal}33` }}>
                GPU completo · CPU al {((cpuText.length/full.length)*100).toFixed(0)}%...
              </div>
              <button onClick={stopCpu} style={{ background:'transparent', color:C.amber, fontSize:13, padding:'7px 16px', borderRadius:8, border:`1px solid ${C.amber}`, fontFamily:"'DM Sans',sans-serif" }}>
                Detener CPU
              </button>
            </>
          )}
          {state==='running' && gpuDone && cpuDone && (
            <button onClick={reset} style={{ background:'transparent', color:C.muted, fontSize:13, padding:'7px 16px', borderRadius:8, border:`1px solid ${C.border}`, fontFamily:"'DM Sans',sans-serif" }}>
              Reiniciar
            </button>
          )}
        </div>
      </div>

      <div style={{ display:'flex', gap:16 }}>
        <OutputPanel title="Sin GPU - Inferencia CPU" icon="🐢" color={C.amber}
          text={cpuText} status={cpuStatus} timer={cpuTime} totalLen={full.length} isCpu={true}/>
        <OutputPanel title="Con GPU NubeSARA" icon="⚡" color={C.teal}
          text={gpuText} status={gpuStatus} timer={gpuTime} totalLen={full.length} isCpu={false}/>
      </div>

      {state !== 'idle' && (
        <div className="fi" style={{ background:C.bg2, borderLeft:`3px solid ${C.teal}`, borderRadius:8, padding:'14px 18px', fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.sub, lineHeight:1.7 }}>
          <span style={{ color:C.teal, fontWeight:600 }}>Argumento clave para la reunion: </span>
          La diferencia no es solo de velocidad. El analisis de anuncios puede incluir datos personales (nombres, direcciones, contactos de anfitriones). Bajo el{' '}
          <strong style={{ color:C.text }}>ENS categoria Alta</strong>, ese procesamiento{' '}
          <strong style={{ color:C.text }}>no puede salir de RedSARA</strong>. Sin GPU on-premise en NubeSARA el sistema es normativamente inviable, independientemente del tiempo de respuesta.
          {expSec && <span style={{ color:C.amber }}> Sin GPU este analisis tardaria ~{expSec}s. Con GPU: menos de 3s.</span>}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab,     setTab]     = useState('global');
  const [platSel, setPlatSel] = useState(null);
  const goPlat = (p) => { setPlatSel(p); setTab('detalle'); };
  const goBack  = ()  => { setPlatSel(null); setTab('global'); };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:C.bg0, minHeight:'100vh', color:C.text }}>
      <Fonts />
      <div style={{ background:'#060e1f', borderBottom:`1px solid ${C.border}`, padding:'0 22px', display:'flex', alignItems:'center', height:54, position:'sticky', top:0, zIndex:10 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:C.teal, letterSpacing:'.08em', marginRight:24, whiteSpace:'nowrap' }}>SVP · VIVIENDA VACACIONAL</div>
        <div style={{ fontSize:11, color:'#1e3a5f', marginRight:16 }}>|</div>
        <button onClick={goBack} style={{ background:tab==='global'?'rgba(0,212,170,.1)':'transparent', color:tab==='global'?C.teal:C.muted, fontFamily:"'DM Sans',sans-serif", fontWeight:tab==='global'?600:400, fontSize:12, padding:'0 14px', height:'100%', border:'none', borderBottom:tab==='global'?`2px solid ${C.teal}`:'2px solid transparent', marginBottom:'-1px' }}>
          Global
        </button>
        {PLATS.map(p => (
          <button key={p.id} onClick={() => goPlat(p)}
            style={{ background:platSel?.id===p.id&&tab==='detalle'?`${p.color}22`:'transparent', color:platSel?.id===p.id&&tab==='detalle'?p.color:C.muted, fontFamily:"'DM Sans',sans-serif", fontSize:12, padding:'0 12px', height:'100%', border:'none', borderBottom:platSel?.id===p.id&&tab==='detalle'?`2px solid ${p.color}`:'2px solid transparent', marginBottom:'-1px', whiteSpace:'nowrap' }}>
            {p.logo} {p.name.split(' ')[0]}
          </button>
        ))}
        <button onClick={() => { setTab('computo'); setPlatSel(null); }}
          style={{ background:tab==='computo'?'rgba(0,212,170,.1)':'transparent', color:tab==='computo'?C.teal:C.muted, fontFamily:"'DM Sans',sans-serif", fontWeight:tab==='computo'?600:400, fontSize:12, padding:'0 14px', height:'100%', border:'none', borderBottom:tab==='computo'?`2px solid ${C.teal}`:'2px solid transparent', marginBottom:'-1px', marginLeft:8 }}>
          ⚡ CPU vs GPU
        </button>
        <div style={{ flex:1 }} />
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:C.teal, display:'inline-block', animation:'pulse 2s ease infinite' }} />
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.muted }}>EN VIVO · RedSARA · ENS Alto</span>
        </div>
      </div>
      {tab === 'global'  && <VistaGlobal onSelect={goPlat} />}
      {tab === 'detalle' && platSel && <DetallePlataforma plat={platSel} onBack={goBack} />}
      {tab === 'computo' && <TabComputo />}
    </div>
  );
}
