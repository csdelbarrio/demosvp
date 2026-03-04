import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, PieChart, Pie, Legend, LineChart, Line,
} from "recharts";

/* ─── VARIABLES (réplica exacta de variables.css) ─────────────────────── */
const V = {
  primary:      '#043263',
  primaryLight: '#0563bb',
  primaryDark:  '#032347',
  accent:       '#ffdb00',
  accentHover:  '#e6c500',
  success:      '#28a745',
  warning:      '#ffc107',
  error:        '#dc3545',
  info:         '#17a2b8',
  white:        '#ffffff',
  gray100:      '#f8f9fa',
  gray200:      '#e9ecef',
  gray300:      '#dee2e6',
  gray400:      '#ced4da',
  gray500:      '#adb5bd',
  gray600:      '#6c757d',
  gray700:      '#495057',
  gray800:      '#343a40',
  text:         '#333333',
  textMuted:    '#666666',
  textLight:    '#999999',
  bg:           '#f4f4f4',
  bgWhite:      '#ffffff',
  bgLight:      '#f8f9fa',
  border:       '#dddddd',
  borderLight:  '#e9ecef',
};

/* ─── TIPOGRAFÍA Y RESET ──────────────────────────────────────────────── */
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Open Sans','Segoe UI',Tahoma,Geneva,Verdana,sans-serif; background:${V.bg}; color:${V.text}; line-height:1.6; }
    ::-webkit-scrollbar { width:5px; }
    ::-webkit-scrollbar-track { background:${V.gray200}; }
    ::-webkit-scrollbar-thumb { background:${V.gray400}; border-radius:4px; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
    .fi { animation:fadeUp .22s ease both; }
    .si { animation:fadeIn .18s ease both; }
    .row-hover { transition:background .12s; cursor:pointer; }
    .row-hover:hover { background:${V.gray100} !important; }
    .chip { display:inline-flex; align-items:center; padding:2px 10px; border-radius:4px; font-size:11px; font-weight:600; letter-spacing:.04em; }
    button { font-family:inherit; cursor:pointer; transition:all .15s; }
    a { color:${V.primaryLight}; text-decoration:none; }
    a:hover { text-decoration:underline; }
  `}</style>
);

/* ─── TIPOS DE ANOMALÍA ───────────────────────────────────────────────── */
const TIPOS = [
  { key:'sinLicencia',  label:'Sin licencia turística', color:V.error   },
  { key:'precioAbusivo',label:'Precio abusivo',         color:'#e65100' },
  { key:'multiAnuncio', label:'Gestión profesional',    color:'#6a1b9a' },
  { key:'duplicados',   label:'Anuncios duplicados',    color:V.info    },
];

/* ─── DATOS PLATAFORMAS ───────────────────────────────────────────────── */
const PLATS_BASE = [
  {
    id:'airbnb', name:'Airbnb', color:'#e53935', logo:'🏠',
    anuncios:18190, anomalias:16216, tasa:89.15, sinLicencia:10911, precioAbusivo:3096, multiAnuncio:12046, duplicados:322,
    fuente:'datos reales · Inside Airbnb Madrid jun-2023',
    tendencia:[{m:'Ene',v:13200},{m:'Feb',v:13800},{m:'Mar',v:14500},{m:'Abr',v:15100},{m:'May',v:15700},{m:'Jun',v:16216}],
    zonas:[], ejemplos:[],
  },
  {
    id:'booking', name:'Booking.com', color:V.primaryLight, logo:'🌐',
    anuncios:11350, anomalias:734, tasa:6.47, sinLicencia:318, precioAbusivo:201, multiAnuncio:143, duplicados:72,
    fuente:'datos de ejemplo',
    tendencia:[{m:'Ene',v:470},{m:'Feb',v:540},{m:'Mar',v:590},{m:'Abr',v:640},{m:'May',v:690},{m:'Jun',v:734}],
    zonas:[{z:'Madrid',sin:88,precio:55,multi:38,dup:18},{z:'Barcelona',sin:105,precio:71,multi:52,dup:24},{z:'Valencia',sin:72,precio:42,multi:31,dup:16},{z:'Sevilla',sin:33,precio:21,multi:13,dup:9},{z:'Malaga',sin:20,precio:12,multi:9,dup:5}],
    ejemplos:[
      {id:'BKG-9921',zona:'Madrid',   titulo:'Apartamento moderno Gran Vía',   precio:'295 €/noche',tipo:'Sin número de registro VUT',       riesgo:'alto'},
      {id:'BKG-7743',zona:'Madrid',   titulo:'Loft en Chueca',                 precio:'198 €/noche',tipo:'Descripción falsea superficie real',riesgo:'medio'},
      {id:'BKG-5502',zona:'Barcelona',titulo:'Dúplex cerca de la playa',       precio:'220 €/noche',tipo:'Precio +210% en festivos sin aviso',riesgo:'alto'},
      {id:'BKG-3318',zona:'Sevilla',  titulo:'Hostal familiar casco antiguo',  precio:'89 €/noche', tipo:'Duplicado detectado en Airbnb',    riesgo:'medio'},
    ],
  },
  {
    id:'vrbo', name:'Vrbo', color:'#00838f', logo:'🏡',
    anuncios:4820, anomalias:298, tasa:6.18, sinLicencia:142, precioAbusivo:88, multiAnuncio:41, duplicados:27,
    fuente:'datos de ejemplo',
    tendencia:[{m:'Ene',v:180},{m:'Feb',v:215},{m:'Mar',v:238},{m:'Abr',v:255},{m:'May',v:275},{m:'Jun',v:298}],
    zonas:[{z:'Madrid',sin:38,precio:22,multi:11,dup:7},{z:'Barcelona',sin:48,precio:31,multi:15,dup:9},{z:'Valencia',sin:32,precio:19,multi:9,dup:6},{z:'Sevilla',sin:14,precio:9,multi:4,dup:3},{z:'Malaga',sin:10,precio:7,multi:2,dup:2}],
    ejemplos:[
      {id:'VBR-2241',zona:'Madrid',titulo:'Villa con piscina Pozuelo',        precio:'580 €/noche',tipo:'Sin licencia de actividades',         riesgo:'alto'},
      {id:'VBR-1882',zona:'Madrid',titulo:'Casa completa 4 hab. Chamberí',   precio:'320 €/noche',tipo:'Dirección no verificable en catastro', riesgo:'medio'},
    ],
  },
  {
    id:'hometogo', name:'HomeToGo', color:'#e65100', logo:'🔑',
    anuncios:3210, anomalias:187, tasa:5.83, sinLicencia:89, precioAbusivo:55, multiAnuncio:28, duplicados:15,
    fuente:'datos de ejemplo',
    tendencia:[{m:'Ene',v:110},{m:'Feb',v:132},{m:'Mar',v:148},{m:'Abr',v:160},{m:'May',v:172},{m:'Jun',v:187}],
    zonas:[{z:'Madrid',sin:25,precio:15,multi:8,dup:4},{z:'Barcelona',sin:30,precio:19,multi:10,dup:5},{z:'Valencia',sin:20,precio:12,multi:6,dup:3},{z:'Sevilla',sin:9,precio:5,multi:2,dup:2},{z:'Malaga',sin:5,precio:4,multi:2,dup:1}],
    ejemplos:[
      {id:'HTG-0912',zona:'Madrid', titulo:'Apartamento Retiro vistas parque', precio:'195 €/noche',tipo:'Agregador: anuncio sin licencia origen',riesgo:'alto'},
      {id:'HTG-0445',zona:'Málaga', titulo:'Bungalow urbanización Costa Sol',  precio:'145 €/noche',tipo:'Precio inflado +165% temporada alta',   riesgo:'medio'},
    ],
  },
];

/* ─── GPU/CPU ─────────────────────────────────────────────────────────── */
const GPU_CPS = 220;
const CPU_CPS = 5;
const PROMPT  = "Analiza este anuncio de alquiler vacacional e identifica posibles infracciones: piso en Madrid, barrio Embajadores, 65m2, precio 340 euros/noche, sin número de licencia VUT visible, publicado por anfitrión con 12 anuncios activos. Indica tipo de infracción, normativa aplicable y acción inspectora recomendada.";
const FALLBACK = `ANÁLISIS DE ANUNCIO — AIR-48221

INFRACCIONES DETECTADAS:

1. AUSENCIA DE NÚMERO DE LICENCIA VUT
   El anuncio no muestra número de Vivienda de Uso Turístico. Normativa: Decreto 79/2014 de la Comunidad de Madrid. La omisión del número de registro constituye infracción grave conforme al art. 26 del Decreto.

2. GESTIÓN PROFESIONAL NO DECLARADA
   El anfitrión gestiona 12 anuncios activos. El art. 3 del Decreto 79/2014 exige inscripción como empresa de gestión turística para la gestión habitual con fines lucrativos. La acumulación sugiere actividad empresarial no declarada.

3. PRECIO ELEVADO — POSIBLE SUPERVISIÓN
   340 €/noche para 65 m² supera en un 215% la mediana del barrio Embajadores (≈107 €/noche). Objeto de supervisión en el marco del RDL 7/2019 de medidas urgentes en materia de vivienda.

ACCIÓN INSPECTORA RECOMENDADA:
• Requerimiento a la plataforma de aportación del número VUT (art. 16.2 LSSI).
• Comprobación cruzada de los 12 anuncios del anfitrión en el Registro de Empresas Turísticas de la CAM.
• Traslado a la Dirección General de Turismo de la CAM para expediente sancionador si se confirma ausencia de registro.`;

/* ─── HELPERS ─────────────────────────────────────────────────────────── */
const riskColor = r => r==='alto' ? V.error : r==='medio' ? '#e65100' : V.success;
const riskLabel = r => r==='alto' ? 'ALTO'  : r==='medio' ? 'MEDIO'  : 'BAJO';

const tooltip = {
  background:V.bgWhite, border:`1px solid ${V.border}`,
  borderRadius:'4px', fontFamily:"'Open Sans',sans-serif",
  fontSize:12, boxShadow:'0 2px 8px rgba(0,0,0,.08)',
};

/* ─── COMPONENTES ÁTOMICOS ────────────────────────────────────────────── */
function PageHeader({ children }) {
  return (
    <div style={{ background:V.bgWhite, borderBottom:`1px solid ${V.border}`, padding:'14px 28px', marginBottom:0 }}>
      <div style={{ fontSize:11, color:V.textMuted, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:2 }}>
        Inicio › Vigilancia de plataformas
      </div>
      <h1 style={{ fontSize:20, fontWeight:700, color:V.primary }}>{children}</h1>
    </div>
  );
}

function StatCard({ label, val, color, sub, delta }) {
  return (
    <div style={{ flex:1, background:V.bgWhite, border:`1px solid ${V.border}`, borderRadius:8,
      padding:'16px 20px', borderTop:`3px solid ${color||V.primary}`,
      boxShadow:'0 1px 3px rgba(0,0,0,.06)' }}>
      <div style={{ fontSize:11, color:V.textMuted, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:6 }}>
        {label}
      </div>
      <div style={{ fontSize:24, fontWeight:700, color:color||V.text, lineHeight:1 }}>{val}</div>
      {sub && <div style={{ fontSize:12, color:V.textMuted, marginTop:4 }}>{sub}</div>}
    </div>
  );
}

function Chip({ label, color }) {
  return <span className="chip" style={{ background:`${color}18`, color, border:`1px solid ${color}44` }}>{label}</span>;
}

function SectionHeading({ children }) {
  return (
    <div style={{ fontSize:12, fontWeight:700, color:V.primary, letterSpacing:'.06em',
      textTransform:'uppercase', marginBottom:12, paddingBottom:8,
      borderBottom:`2px solid ${V.accent}`, display:'inline-block' }}>
      {children}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background:V.bgWhite, border:`1px solid ${V.border}`, borderRadius:8,
      padding:'18px 20px', boxShadow:'0 1px 3px rgba(0,0,0,.05)', ...style }}>
      {children}
    </div>
  );
}

/* ─── VISTA GLOBAL ────────────────────────────────────────────────────── */
function VistaGlobal({ plats, onSelect }) {
  const total     = plats.reduce((s,p)=>s+p.anuncios,0);
  const totalAnom = plats.reduce((s,p)=>s+p.anomalias,0);
  const totalSin  = plats.reduce((s,p)=>s+p.sinLicencia,0);
  const barData   = plats.map(p=>({ name:p.name.split('.')[0], 'Sin licencia':p.sinLicencia, 'Precio abusivo':p.precioAbusivo, 'Gestión prof.':p.multiAnuncio||0, 'Duplicados':p.duplicados }));
  const pieData   = TIPOS.map(t=>({ name:t.label, value:plats.reduce((s,p)=>s+(p[t.key]||0),0), color:t.color }));
  const tendData  = ['Ene','Feb','Mar','Abr','May','Jun'].map((m,i)=>({ m, ...Object.fromEntries(plats.map(p=>[p.id,p.tendencia[i].v])) }));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, padding:'24px 28px' }}>
      <PageHeader>Sistema de Vigilancia de Plataformas (SVP)</PageHeader>

      {/* KPIs */}
      <div style={{ display:'flex', gap:14 }}>
        <StatCard label="Anuncios monitorizados"  val={total.toLocaleString('es')}     color={V.primary}     sub="4 plataformas · Madrid"/>
        <StatCard label="Anomalías detectadas"     val={totalAnom.toLocaleString('es')} color={V.error}       sub={`${((totalAnom/total)*100).toFixed(1)}% del total`}/>
        <StatCard label="Sin licencia turística"   val={totalSin.toLocaleString('es')}  color={V.error}       sub="Infracción directa"/>
        <StatCard label="Zonas vigiladas"          val="5 distritos"                    color={V.primaryLight} sub="Municipio de Madrid"/>
        <StatCard label="Última extracción"        val="hace 11 min"                    color={V.gray600}/>
      </div>

      {/* Cards plataformas */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
        {plats.map(p => (
          <div key={p.id} className="row-hover fi" onClick={()=>onSelect(p)}
            style={{ background:V.bgWhite, border:`1px solid ${V.border}`, borderRadius:8,
              padding:'16px 18px', cursor:'pointer', boxShadow:'0 1px 3px rgba(0,0,0,.06)',
              borderLeft:`4px solid ${p.color}` }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:20 }}>{p.logo}</span>
                <span style={{ fontSize:14, fontWeight:700, color:V.text }}>{p.name}</span>
              </div>
              {p.fuente?.includes('reales') && (
                <span style={{ fontSize:10, background:'#e8f4e8', color:V.success,
                  padding:'2px 7px', borderRadius:4, fontWeight:700, border:`1px solid ${V.success}44` }}>
                  REAL
                </span>
              )}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[['Anuncios',p.anuncios.toLocaleString('es'),V.gray700],
                ['Anomalías',p.anomalias.toLocaleString('es'),V.error],
                ['Sin lic.',p.sinLicencia.toLocaleString('es'),V.error],
                ['Tasa',p.tasa+'%',p.tasa>20?V.error:'#e65100']].map(([k,v,c]) => (
                <div key={k} style={{ background:V.gray100, borderRadius:4, padding:'8px 10px', border:`1px solid ${V.borderLight}` }}>
                  <div style={{ fontSize:10, color:V.textLight, marginBottom:2, textTransform:'uppercase', letterSpacing:'.05em' }}>{k}</div>
                  <div style={{ fontSize:15, fontWeight:700, color:c }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:10, textAlign:'right' }}>
              <span style={{ fontSize:12, color:p.color, fontWeight:600 }}>Ver detalle →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div style={{ display:'flex', gap:14 }}>
        <Card style={{ flex:2 }}>
          <SectionHeading>Anomalías por tipo y plataforma</SectionHeading>
          <ResponsiveContainer width="100%" height={175}>
            <BarChart data={barData} margin={{ top:4, right:4, bottom:0, left:-10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={V.borderLight} vertical={false}/>
              <XAxis dataKey="name" tick={{ fill:V.textMuted, fontSize:11, fontFamily:'Open Sans' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:V.textMuted, fontSize:11, fontFamily:'Open Sans' }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tooltip}/>
              <Legend wrapperStyle={{ fontSize:11, fontFamily:'Open Sans', paddingTop:8 }}/>
              {TIPOS.map(t=><Bar key={t.key} dataKey={t.key==='sinLicencia'?'Sin licencia':t.key==='precioAbusivo'?'Precio abusivo':t.key==='multiAnuncio'?'Gestión prof.':'Duplicados'} stackId="a" fill={t.color} radius={t.key==='duplicados'?[3,3,0,0]:[0,0,0,0]}/>)}
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ flex:1 }}>
          <SectionHeading>Distribución global</SectionHeading>
          <ResponsiveContainer width="100%" height={175}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="46%" innerRadius={36} outerRadius={58} dataKey="value" paddingAngle={2}>
                {pieData.map((d,i)=><Cell key={i} fill={d.color}/>)}
              </Pie>
              <Tooltip contentStyle={tooltip}/>
              <Legend wrapperStyle={{ fontSize:10, fontFamily:'Open Sans' }}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ flex:2 }}>
          <SectionHeading>Tendencia de anomalías — 6 meses</SectionHeading>
          <ResponsiveContainer width="100%" height={175}>
            <LineChart data={tendData} margin={{ top:4, right:4, bottom:0, left:-10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={V.borderLight}/>
              <XAxis dataKey="m" tick={{ fill:V.textMuted, fontSize:11, fontFamily:'Open Sans' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:V.textMuted, fontSize:11, fontFamily:'Open Sans' }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tooltip}/>
              <Legend wrapperStyle={{ fontSize:11, fontFamily:'Open Sans', paddingTop:8 }}/>
              {plats.map(p=><Line key={p.id} type="monotone" dataKey={p.id} name={p.name.split('.')[0]} stroke={p.color} strokeWidth={2} dot={false} activeDot={{ r:4 }}/>)}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ─── DETALLE PLATAFORMA ──────────────────────────────────────────────── */
function DetallePlataforma({ plat, onBack }) {
  const [zonaF, setZonaF] = useState('Todas');
  const [sel,   setSel]   = useState(null);
  const zonas    = ['Todas', ...plat.zonas.map(z=>z.z)];
  const ejemplos = zonaF==='Todas' ? plat.ejemplos : plat.ejemplos.filter(e=>e.zona===zonaF);
  const zBar     = plat.zonas.map(z=>({ name:z.z, 'Sin licencia':z.sin, 'Precio abusivo':z.precio, 'Gestión prof.':z.multi||0, 'Duplicados':z.dup }));
  const pie      = TIPOS.map(t=>({ name:t.label, value:plat[t.key]||0, color:t.color }));

  return (
    <div className="fi" style={{ display:'flex', flexDirection:'column', gap:20, padding:'24px 28px' }}>
      <div style={{ background:V.bgWhite, borderBottom:`1px solid ${V.border}`, padding:'14px 0', marginBottom:0 }}>
        <button onClick={onBack} style={{ background:'none', border:`1px solid ${V.border}`,
          color:V.textMuted, borderRadius:4, padding:'6px 14px', fontSize:13, marginBottom:12 }}>
          ← Volver al resumen
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:4, height:36, background:plat.color, borderRadius:2 }}/>
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, color:V.primary }}>{plat.logo} {plat.name}</h2>
            <div style={{ fontSize:12, color:V.textMuted }}>
              {plat.anuncios.toLocaleString('es')} anuncios · tasa anomalía:{' '}
              <strong style={{ color:plat.tasa>20?V.error:'#e65100' }}>{plat.tasa}%</strong>
              {plat.fuente && (
                <span style={{ background:'#e8f4e8', color:V.success, padding:'1px 8px',
                  borderRadius:4, fontSize:10, fontWeight:700, marginLeft:10,
                  border:`1px solid ${V.success}44` }}>{plat.fuente}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:'flex', gap:14 }}>
        {[['Sin licencia',plat.sinLicencia,V.error],['Precio abusivo',plat.precioAbusivo,'#e65100'],
          ['Gestión prof.',plat.multiAnuncio||0,'#6a1b9a'],['Duplicados',plat.duplicados,V.info]]
          .map(([l,v,c])=>(
          <StatCard key={l} label={l} val={(v||0).toLocaleString('es')} color={c}
            sub={`${plat.anomalias>0?((v/plat.anomalias)*100).toFixed(0):0}% de anomalías`}/>
        ))}
      </div>

      {/* Gráficos */}
      <div style={{ display:'flex', gap:14 }}>
        <Card style={{ flex:3 }}>
          <SectionHeading>Anomalías por zona / barrio</SectionHeading>
          <ResponsiveContainer width="100%" height={165}>
            <BarChart data={zBar} margin={{ top:4, right:4, bottom:0, left:-10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={V.borderLight} vertical={false}/>
              <XAxis dataKey="name" tick={{ fill:V.textMuted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:V.textMuted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tooltip}/>
              <Legend wrapperStyle={{ fontSize:11, paddingTop:8 }}/>
              <Bar dataKey="Sin licencia"   stackId="a" fill={V.error}/>
              <Bar dataKey="Precio abusivo" stackId="a" fill="#e65100"/>
              <Bar dataKey="Gestión prof."  stackId="a" fill="#6a1b9a"/>
              <Bar dataKey="Duplicados"     stackId="a" fill={V.info} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ flex:1.2 }}>
          <SectionHeading>Distribución</SectionHeading>
          <ResponsiveContainer width="100%" height={165}>
            <PieChart>
              <Pie data={pie} cx="50%" cy="44%" innerRadius={30} outerRadius={52} dataKey="value" paddingAngle={2}>
                {pie.map((d,i)=><Cell key={i} fill={d.color}/>)}
              </Pie>
              <Tooltip contentStyle={tooltip}/>
              <Legend wrapperStyle={{ fontSize:10 }}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ flex:2 }}>
          <SectionHeading>Evolución mensual</SectionHeading>
          <ResponsiveContainer width="100%" height={165}>
            <LineChart data={plat.tendencia} margin={{ top:4, right:4, bottom:0, left:-10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={V.borderLight}/>
              <XAxis dataKey="m" tick={{ fill:V.textMuted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:V.textMuted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tooltip}/>
              <Line type="monotone" dataKey="v" name="Anomalías" stroke={plat.color} strokeWidth={2.5} dot={false} activeDot={{ r:4 }}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tabla */}
      <Card style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'12px 18px', background:V.gray100, borderBottom:`1px solid ${V.border}`,
          display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <span style={{ fontSize:12, fontWeight:700, color:V.primary, textTransform:'uppercase',
            letterSpacing:'.07em', marginRight:6 }}>Anuncios anómalos</span>
          {zonas.map(z=>(
            <button key={z} onClick={()=>{setZonaF(z);setSel(null);}}
              style={{ background:zonaF===z?V.primary:'transparent',
                color:zonaF===z?V.white:V.textMuted,
                border:`1px solid ${zonaF===z?V.primary:V.border}`,
                borderRadius:4, padding:'3px 12px', fontSize:12 }}>
              {z}
            </button>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'100px 90px 1fr 120px 70px 1fr',
          padding:'8px 18px', background:V.gray100, borderBottom:`1px solid ${V.border}`,
          fontSize:10, color:V.textMuted, letterSpacing:'.07em', textTransform:'uppercase', fontWeight:600 }}>
          <span>ID</span><span>Zona</span><span>Anuncio</span><span>Precio</span><span>Riesgo</span><span>Tipo detección</span>
        </div>
        {ejemplos.length===0 && (
          <div style={{ padding:'20px 18px', fontSize:13, color:V.textMuted, textAlign:'center' }}>
            No hay anuncios en esta zona
          </div>
        )}
        {ejemplos.map(e=>(
          <div key={e.id} className="row-hover" onClick={()=>setSel(sel?.id===e.id?null:e)}
            style={{ display:'grid', gridTemplateColumns:'100px 90px 1fr 120px 70px 1fr',
              padding:'10px 18px', borderBottom:`1px solid ${V.borderLight}`,
              alignItems:'center', background:sel?.id===e.id?'#f0f4ff':V.bgWhite }}>
            <span style={{ fontFamily:'monospace', fontSize:12, color:V.primaryLight, fontWeight:600 }}>{e.id}</span>
            <span style={{ fontSize:12, color:V.textMuted }}>{e.zona}</span>
            <span style={{ fontSize:13, color:V.text, fontWeight:500 }}>{e.titulo}</span>
            <span style={{ fontSize:12, color:V.text }}>{e.precio}</span>
            <Chip label={riskLabel(e.riesgo)} color={riskColor(e.riesgo)}/>
            <span style={{ fontSize:12, color:V.textMuted }}>{e.tipo}</span>
          </div>
        ))}
      </Card>

      {sel && (
        <div className="si" style={{ background:V.bgWhite, border:`1px solid ${V.border}`,
          borderRadius:8, padding:'16px 20px', borderLeft:`4px solid ${riskColor(sel.riesgo)}`,
          boxShadow:'0 2px 6px rgba(0,0,0,.06)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, alignItems:'flex-start' }}>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:V.text }}>{sel.id} · {sel.titulo}</div>
              <div style={{ fontSize:12, color:V.textMuted, marginTop:2 }}>{plat.name} · {sel.zona} · {sel.precio}</div>
            </div>
            <Chip label={riskLabel(sel.riesgo)} color={riskColor(sel.riesgo)}/>
          </div>
          <div style={{ background:V.gray100, borderRadius:4, padding:'10px 14px',
            fontSize:13, color:V.textMuted, lineHeight:1.7, border:`1px solid ${V.border}` }}>
            <strong style={{ color:riskColor(sel.riesgo) }}>Motivo: </strong>{sel.tipo}
            {sel.url && <span style={{ marginLeft:12 }}>
              <a href={sel.url} target="_blank" rel="noopener noreferrer" style={{ color:V.primaryLight, fontSize:11 }}>Ver anuncio original →</a>
            </span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── TAB CPU vs GPU ──────────────────────────────────────────────────── */
function useTimer(running) {
  const [t, setT] = useState(0);
  const ref = useRef(null);
  useEffect(()=>{
    if (running) { ref.current = setInterval(()=>setT(x=>+(x+0.1).toFixed(1)), 100); }
    else { clearInterval(ref.current); }
    return ()=>clearInterval(ref.current);
  }, [running]);
  return [t, ()=>setT(0)];
}

function OutputPanel({ title, icon, color, borderColor, text, status, timer, totalLen, isCpu }) {
  const ref = useRef(null);
  useEffect(()=>{ if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [text]);
  const cps = isCpu ? CPU_CPS : GPU_CPS;
  const tps = status==='running' ? (cps/4).toFixed(1) : status==='done' ? ((text.length/4)/Math.max(timer,0.1)).toFixed(1) : '—';
  const pct = totalLen>0 ? Math.min(100, Math.round((text.length/totalLen)*100)) : 0;
  const statusLabel = status==='idle'?'En espera':status==='running'?'Procesando…':'Completado';
  const statusColor = status==='idle'?V.gray500:status==='running'?color:V.success;

  return (
    <div style={{ flex:1, background:V.bgWhite, border:`1px solid ${V.border}`, borderRadius:8,
      padding:'18px 20px', display:'flex', flexDirection:'column', gap:14, minWidth:0,
      boxShadow:'0 1px 4px rgba(0,0,0,.06)', borderTop:`3px solid ${borderColor||color}` }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:20 }}>{icon}</span>
          <span style={{ fontSize:14, fontWeight:700, color:V.text }}>{title}</span>
        </div>
        <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:4,
          background:`${statusColor}18`, color:statusColor, letterSpacing:'.05em',
          border:`1px solid ${statusColor}44`,
          animation:status==='running'?'pulse 1.5s ease infinite':'none' }}>
          {statusLabel.toUpperCase()}
        </span>
      </div>

      <div style={{ display:'flex', gap:16, paddingTop:10, borderTop:`1px solid ${V.border}` }}>
        {[['Tiempo',timer.toFixed(1)+' s',status==='running'?color:V.textMuted],
          ['Tokens/s',tps,color],
          ['Caracteres',text.length,V.gray600]].map(([l,v,c])=>(
          <div key={l}>
            <div style={{ fontSize:10, color:V.textMuted, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:3 }}>{l}</div>
            <div style={{ fontSize:20, fontWeight:700, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {(status==='running'||status==='done') && totalLen>0 && (
        <div style={{ height:4, background:V.gray200, borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:2, transition:'width .12s linear' }}/>
        </div>
      )}

      <div ref={ref} style={{ flex:1, minHeight:200, maxHeight:260, overflowY:'auto',
        background:V.gray100, borderRadius:4, padding:'12px 14px',
        fontFamily:'monospace', fontSize:12, lineHeight:1.7, color:V.gray800,
        whiteSpace:'pre-wrap', wordBreak:'break-word', border:`1px solid ${V.border}` }}>
        {status==='idle' && <span style={{ color:V.textLight, fontStyle:'italic' }}>Esperando inicio de análisis…</span>}
        {status!=='idle' && <span style={{ caretColor:color }}>{text||<span style={{ color:V.textLight }}>Generando análisis…</span>}</span>}
        {status==='done' && <div style={{ marginTop:10, paddingTop:8, borderTop:`1px solid ${V.border}`,
          color:V.success, fontSize:11, fontFamily:"'Open Sans',sans-serif" }}>
          ✓ Análisis completado en {timer.toFixed(1)} s
        </div>}
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
  const gpuRef = useRef(null); const cpuRef = useRef(null); const stopped = useRef(false);

  const run = async () => {
    setState('loading'); stopped.current = false;
    setGpuText(''); setCpuText(''); setGpuDone(false); setCpuDone(false);
    resetGpu(); resetCpu();
    let resp = FALLBACK;
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:1000,
          system:'Eres inspector de consumo especializado en plataformas de alquiler vacacional en España. Cita normativa concreta de la Comunidad de Madrid.',
          messages:[{role:'user',content:PROMPT}] }),
      });
      const d = await r.json();
      if (d?.content?.[0]?.text) resp = d.content[0].text;
    } catch(_) {}
    setFull(resp); setState('running');
    let gi=0;
    gpuRef.current = setInterval(()=>{
      if (stopped.current){ clearInterval(gpuRef.current); return; }
      const n=Math.min(gi+Math.ceil(GPU_CPS/10),resp.length); setGpuText(resp.slice(0,n)); gi=n;
      if (gi>=resp.length){ clearInterval(gpuRef.current); setGpuDone(true); }
    },100);
    let ci=0;
    cpuRef.current = setInterval(()=>{
      if (stopped.current){ clearInterval(cpuRef.current); return; }
      const n=Math.min(ci+Math.ceil(CPU_CPS/10),resp.length); setCpuText(resp.slice(0,n)); ci=n;
      if (ci>=resp.length){ clearInterval(cpuRef.current); setCpuDone(true); }
    },100);
  };

  const reset = ()=>{
    clearInterval(gpuRef.current); clearInterval(cpuRef.current); stopped.current=true;
    setState('idle'); setGpuText(''); setCpuText(''); setGpuDone(false); setCpuDone(false); setFull('');
  };

  const gpuStatus = state==='idle'?'idle':gpuDone?'done':state==='loading'?'idle':'running';
  const cpuStatus = state==='idle'?'idle':cpuDone?'done':state==='loading'?'idle':'running';
  const expSec    = full.length>0 ? Math.round(full.length/CPU_CPS) : null;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, padding:'24px 28px' }}>
      <PageHeader>Demostración de cómputo — CPU vs. GPU (ENS Alto)</PageHeader>

      <Card style={{ borderLeft:`4px solid ${V.primary}` }}>
        <div style={{ fontSize:12, fontWeight:700, color:V.primary, textTransform:'uppercase',
          letterSpacing:'.07em', marginBottom:10 }}>
          Anuncio analizado · AIR-48221 detectado en Madrid (Embajadores)
        </div>
        <div style={{ fontSize:13, color:V.textMuted, lineHeight:1.6, fontStyle:'italic',
          background:V.gray100, padding:'10px 14px', borderRadius:4, border:`1px solid ${V.border}`, marginBottom:16 }}>
          "{PROMPT}"
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
          {state==='idle' && (
            <button onClick={run} style={{ background:V.primary, color:V.white, fontWeight:700,
              fontSize:14, padding:'10px 28px', borderRadius:4, border:'none', letterSpacing:'.02em' }}>
              ▶ Ejecutar análisis
            </button>
          )}
          {state==='loading' && (
            <span style={{ fontSize:13, color:V.textMuted, animation:'pulse 1s ease infinite', display:'flex', gap:8, alignItems:'center' }}>
              ⏳ Conectando con el modelo…
            </span>
          )}
          {state==='running' && gpuDone && !cpuDone && (
            <>
              <span style={{ fontSize:12, color:V.primaryLight, background:'#e8f0fb',
                padding:'6px 14px', borderRadius:4, border:`1px solid ${V.primaryLight}44` }}>
                GPU completó en {gpuTime.toFixed(1)} s · CPU al {((cpuText.length/full.length)*100).toFixed(0)}%…
              </span>
              <button onClick={()=>{ clearInterval(cpuRef.current); stopped.current=true; setCpuDone(true); }}
                style={{ background:'none', color:'#e65100', fontSize:13, padding:'6px 14px',
                  borderRadius:4, border:`1px solid #e65100` }}>
                ⏹ Detener CPU
              </button>
            </>
          )}
          {state==='running' && gpuDone && cpuDone && (
            <button onClick={reset} style={{ background:V.gray100, color:V.textMuted, fontSize:13,
              padding:'7px 16px', borderRadius:4, border:`1px solid ${V.border}` }}>
              ↺ Reiniciar demostración
            </button>
          )}
        </div>
      </Card>

      <div style={{ display:'flex', gap:16 }}>
        <OutputPanel title="Sin GPU — Inferencia en CPU" icon="🐢" color="#e65100" borderColor="#e65100"
          text={cpuText} status={cpuStatus} timer={cpuTime} totalLen={full.length} isCpu={true}/>
        <OutputPanel title="Con GPU on-premise (NubeSARA)" icon="⚡" color={V.primary} borderColor={V.accent}
          text={gpuText} status={gpuStatus} timer={gpuTime} totalLen={full.length} isCpu={false}/>
      </div>

      {state!=='idle' && (
        <Card style={{ borderLeft:`4px solid ${V.primary}`, background:'#f0f4ff' }}>
          <div style={{ fontSize:13, color:V.gray700, lineHeight:1.8 }}>
            <strong style={{ color:V.primary }}>Argumento normativo clave:</strong>{' '}
            El análisis de anuncios puede incluir datos personales (nombres de anfitriones, direcciones).
            Bajo el <strong style={{ color:V.text }}>ENS categoría Alta</strong>, ese procesamiento{' '}
            <strong style={{ color:V.text }}>no puede salir de RedSARA</strong>.
            Sin GPU on-premise en NubeSARA el sistema es normativamente inviable, independientemente del tiempo de respuesta.
            {expSec && <span style={{ color:V.error, fontWeight:700 }}> Sin GPU este análisis tardaría ~{expSec} s. Con GPU: menos de 3 s.</span>}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ─── APP ROOT ────────────────────────────────────────────────────────── */
export default function App() {
  const [tab,     setTab]     = useState('global');
  const [platSel, setPlatSel] = useState(null);
  const [plats,   setPlats]   = useState(PLATS_BASE);

  useEffect(()=>{
    fetch('./data_madrid.json').then(r=>r.json()).then(data=>{
      const zonas   = (data.barrios||[]).map(b=>({ z:b.neighbourhood, sin:b.sin_licencia, precio:b.precio_abusivo, multi:b.multi_anuncio, dup:b.duplicado }));
      const ejemplos= (data.ejemplos||[]).slice(0,30).map(e=>({ id:e.id, zona:e.zona, titulo:e.titulo, precio:e.precio, tipo:e.tipo, riesgo:e.riesgo, url:e.url }));
      setPlats(prev=>prev.map(p=>p.id==='airbnb'?{...p,
        anuncios:data.total_anuncios, anomalias:data.total_anomalias, tasa:data.tasa_anomalia,
        sinLicencia:data.sin_licencia, precioAbusivo:data.precio_abusivo,
        multiAnuncio:data.multi_anuncio, duplicados:data.duplicados,
        zonas, ejemplos, fuente:data.fuente }:p));
    }).catch(()=>{});
  },[]);

  const goPlat = p=>{ setPlatSel(p); setTab('detalle'); };
  const goBack  = ()=>{ setPlatSel(null); setTab('global'); };

  const TAB = (id, label, action, active) => (
    <button key={id} onClick={action} style={{ background:'transparent',
      color:active?V.primary:V.textMuted, fontSize:13, fontWeight:active?700:400,
      padding:'0 16px', height:'100%', border:'none',
      borderBottom:active?`3px solid ${V.primary}`:'3px solid transparent',
      marginBottom:'-1px', whiteSpace:'nowrap', letterSpacing:'.01em' }}>
      {label}
    </button>
  );

  return (
    <div style={{ fontFamily:"'Open Sans','Segoe UI',sans-serif", background:V.bg, minHeight:'100vh', color:V.text }}>
      <Fonts/>

      {/* Franja gov */}
      <div style={{ background:V.primaryDark, padding:'5px 28px', display:'flex', alignItems:'center', gap:12 }}>
        <span style={{ fontSize:11, color:'rgba(255,255,255,.8)', letterSpacing:'.04em' }}>
          🏛️ Gobierno de España
        </span>
        <span style={{ color:'rgba(255,255,255,.3)', fontSize:11 }}>|</span>
        <span style={{ fontSize:11, color:'rgba(255,255,255,.8)' }}>
          Ministerio de Derechos Sociales, Consumo y Agenda 2030
        </span>
      </div>

      {/* Header */}
      <div style={{ background:V.primary, padding:'12px 28px 0', display:'flex', alignItems:'flex-end', gap:20, minHeight:64 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, paddingBottom:14 }}>
          <div style={{ width:4, height:36, background:V.accent, borderRadius:1 }}/>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:V.white, lineHeight:1.1 }}>SVP · Vigilancia de Plataformas</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,.65)', letterSpacing:'.08em', textTransform:'uppercase' }}>
              Área de Inteligencia Económica · SGCJ
            </div>
          </div>
        </div>
        <div style={{ flex:1 }}/>
        <div style={{ display:'flex', alignItems:'center', gap:6, paddingBottom:14 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#4caf50',
            display:'inline-block', animation:'pulse 2.5s ease infinite' }}/>
          <span style={{ fontSize:11, color:'rgba(255,255,255,.7)' }}>EN VIVO · RedSARA · ENS Alto</span>
        </div>
      </div>

      {/* Navegación */}
      <div style={{ background:V.bgWhite, borderBottom:`1px solid ${V.border}`,
        padding:'0 28px', display:'flex', alignItems:'center', height:44,
        position:'sticky', top:0, zIndex:10, boxShadow:'0 1px 4px rgba(0,0,0,.07)' }}>
        {TAB('global', 'Vista global', goBack, tab==='global')}
        {plats.map(p=>TAB(p.id, `${p.logo} ${p.name.split('.')[0]}`, ()=>goPlat(p), platSel?.id===p.id && tab==='detalle'))}
        {TAB('computo', '⚡ CPU vs GPU', ()=>{ setTab('computo'); setPlatSel(null); }, tab==='computo')}
      </div>

      {/* Contenido */}
      {tab==='global'  && <VistaGlobal plats={plats} onSelect={goPlat}/>}
      {tab==='detalle' && platSel && <DetallePlataforma plat={platSel} onBack={goBack}/>}
      {tab==='computo' && <TabComputo/>}
    </div>
  );
}
