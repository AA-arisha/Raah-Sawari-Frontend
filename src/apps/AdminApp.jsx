import { useState } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer, AreaChart, Area
} from "recharts";

const P  = "#E91E63";
const PL = "#F8BBD0";
const PM = "#F48FB1";
const PD = "#880E4F";
const PP = "#FCE4EC";

const RADIAN = Math.PI / 180;
const pctLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  return (
    <text x={cx + r * Math.cos(-midAngle * RADIAN)} y={cy + r * Math.sin(-midAngle * RADIAN)}
      fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"white", border:`1px solid ${PL}`, borderRadius:8, padding:"8px 14px", fontSize:13, boxShadow:"0 4px 20px rgba(233,30,99,.15)" }}>
      {label && <p style={{ color:"#888", marginBottom:4, fontWeight:500 }}>{label}</p>}
      {payload.map((p,i) => <p key={i} style={{ color:P, fontWeight:600, margin:"2px 0" }}>{p.name}: {p.value?.toLocaleString()}</p>)}
    </div>
  );
};

const Card = ({ title, children, style={} }) => (
  <div style={{ background:"white", borderRadius:16, padding:"20px 22px", boxShadow:"0 2px 16px rgba(233,30,99,.07)", border:`1px solid ${PP}`, ...style }}>
    {title && <h3 style={{ margin:"0 0 14px", fontSize:13, fontWeight:700, color:"#555", textTransform:"uppercase", letterSpacing:".05em", borderLeft:`3px solid ${P}`, paddingLeft:9 }}>{title}</h3>}
    {children}
  </div>
);

const PieLegend = ({ data }) => (
  <div style={{ display:"flex", flexWrap:"wrap", gap:"6px 14px", marginTop:10, justifyContent:"center" }}>
    {data.map(d => (
      <span key={d.name} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#666" }}>
        <span style={{ width:9, height:9, borderRadius:2, background:d.color, display:"inline-block" }} />
        {d.name} ({d.value.toLocaleString()})
      </span>
    ))}
  </div>
);

const Badge = ({ val, color, bg }) => (
  <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:bg, color }}>{val}</span>
);

const statusStyle = s => ({
  Active:    { bg:"#E8F5E9", color:"#2E7D32" },
  Inactive:  { bg:"#FFF8E1", color:"#F57F17" },
  Suspended: { bg:"#FFEBEE", color:"#C62828" },
  Approved:  { bg:"#E8F5E9", color:"#2E7D32" },
  Pending:   { bg:PP,        color:P },
  Rejected:  { bg:"#FFEBEE", color:"#C62828" },
}[s] || { bg:"#eee", color:"#555" });

const riskStyle = r => ({
  Low:    { bg:"#E8F5E9", color:"#2E7D32" },
  Medium: { bg:"#FFF8E1", color:"#F57F17" },
  High:   { bg:"#FFEBEE", color:"#C62828" },
}[r] || {});

// ── Data ──────────────────────────────────────────────────────────────────────
const drivers = [
  { id:1, name:"Ahmed Ali",     phone:"+92 300 1234567", city:"Karachi",    vehicle:"Car",      rating:4.8, rides:842,  earnings:"₨ 1,24,500", status:"Active",    joined:"Jan 2025" },
  { id:2, name:"Fatima Malik",  phone:"+92 321 9876543", city:"Lahore",     vehicle:"Bike",     rating:4.5, rides:512,  earnings:"₨ 68,200",  status:"Active",    joined:"Mar 2025" },
  { id:3, name:"Usman Raza",    phone:"+92 333 5678901", city:"Islamabad",  vehicle:"Rickshaw", rating:4.2, rides:310,  earnings:"₨ 44,800",  status:"Inactive",  joined:"Jun 2025" },
  { id:4, name:"Sana Qureshi",  phone:"+92 345 3456789", city:"Karachi",    vehicle:"Car",      rating:4.9, rides:1204, earnings:"₨ 1,89,300", status:"Active",    joined:"Nov 2024" },
  { id:5, name:"Bilal Khan",    phone:"+92 312 7654321", city:"Faisalabad", vehicle:"Bike",     rating:3.8, rides:188,  earnings:"₨ 22,400",  status:"Suspended", joined:"Aug 2025" },
  { id:6, name:"Nadia Hussain", phone:"+92 301 1122334", city:"Karachi",    vehicle:"Car",      rating:4.7, rides:670,  earnings:"₨ 98,100",  status:"Active",    joined:"Feb 2025" },
  { id:7, name:"Tariq Mehmood", phone:"+92 311 9988776", city:"Multan",     vehicle:"Rickshaw", rating:4.1, rides:290,  earnings:"₨ 38,600",  status:"Active",    joined:"Apr 2025" },
  { id:8, name:"Zara Shah",     phone:"+92 322 4455667", city:"Lahore",     vehicle:"Car",      rating:4.6, rides:531,  earnings:"₨ 81,700",  status:"Inactive",  joined:"Jul 2025" },
];

const riders = [
  { id:1, name:"Mariam Iqbal",  phone:"+92 300 2233445", city:"Karachi",    rides:94,  spent:"₨ 18,400", status:"Active",    joined:"Dec 2024", lastRide:"Apr 23" },
  { id:2, name:"Hamza Nawaz",   phone:"+92 321 6677889", city:"Lahore",     rides:212, spent:"₨ 42,100", status:"Active",    joined:"Oct 2024", lastRide:"Apr 22" },
  { id:3, name:"Kiran Ansari",  phone:"+92 333 1010101", city:"Islamabad",  rides:37,  spent:"₨ 7,200",  status:"Inactive",  joined:"Feb 2025", lastRide:"Mar 10" },
  { id:4, name:"Faisal Baig",   phone:"+92 345 5544332", city:"Rawalpindi", rides:158, spent:"₨ 31,000", status:"Active",    joined:"Jan 2025", lastRide:"Apr 24" },
  { id:5, name:"Sara Ahmed",    phone:"+92 312 8877665", city:"Karachi",    rides:321, spent:"₨ 60,800", status:"Active",    joined:"Sep 2024", lastRide:"Apr 24" },
  { id:6, name:"Omar Sheikh",   phone:"+92 301 3322110", city:"Faisalabad", rides:55,  spent:"₨ 10,500", status:"Active",    joined:"Mar 2025", lastRide:"Apr 20" },
  { id:7, name:"Hina Farooq",   phone:"+92 311 6655443", city:"Lahore",     rides:74,  spent:"₨ 14,200", status:"Suspended", joined:"Nov 2024", lastRide:"Apr 15" },
  { id:8, name:"Asad Javed",    phone:"+92 322 9988001", city:"Karachi",    rides:183, spent:"₨ 35,700", status:"Active",    joined:"Aug 2024", lastRide:"Apr 23" },
];

const initialVerif = [
  { id:1, name:"Fatima Malik",    cnic:"35202-1234567-8", vehicle:"Bike",     city:"Lahore",     submitted:"Apr 22", docs:3, risk:"Low",    status:"Pending"  },
  { id:2, name:"Usman Raza",      cnic:"42101-9876543-2", vehicle:"Rickshaw", city:"Islamabad",  submitted:"Apr 21", docs:2, risk:"Medium", status:"Pending"  },
  { id:3, name:"Sana Qureshi",    cnic:"35201-5678901-4", vehicle:"Car",      city:"Karachi",    submitted:"Apr 20", docs:4, risk:"Low",    status:"Approved" },
  { id:4, name:"Bilal Khan",      cnic:"42301-3456789-6", vehicle:"Bike",     city:"Faisalabad", submitted:"Apr 19", docs:2, risk:"High",   status:"Rejected" },
  { id:5, name:"Ayesha Siddiqui", cnic:"35202-7654321-0", vehicle:"Car",      city:"Karachi",    submitted:"Apr 18", docs:4, risk:"Low",    status:"Pending"  },
  { id:6, name:"Raza Mahmood",    cnic:"42101-1122334-5", vehicle:"Rickshaw", city:"Multan",     submitted:"Apr 17", docs:3, risk:"Medium", status:"Pending"  },
  { id:7, name:"Nadia Hussain",   cnic:"35201-9988776-3", vehicle:"Car",      city:"Lahore",     submitted:"Apr 16", docs:4, risk:"Low",    status:"Approved" },
];

const monthlyRev   = [{m:"Oct",rev:195000,rides:1820},{m:"Nov",rev:213000,rides:2010},{m:"Dec",rev:247000,rides:2380},{m:"Jan",rev:228000,rides:2190},{m:"Feb",rev:261000,rides:2500},{m:"Mar",rev:284750,rides:2740}];
const rideStatus   = [{name:"Completed",value:6420,color:P},{name:"Cancelled",value:1180,color:PM},{name:"Pending",value:440,color:PL}];
const vehicleRev   = [{type:"Bike",revenue:82000},{type:"Car",revenue:154000},{type:"Rickshaw",revenue:49000}];
const genderD      = [{name:"Male",value:2840,color:PD},{name:"Female",value:1002,color:PM}];
const ratingD      = [{rating:"1★",count:48},{rating:"2★",count:112},{rating:"3★",count:380},{rating:"4★",count:1240},{rating:"5★",count:2062}];
const etaD         = [{type:"Bike",eta:4.2},{type:"Car",eta:6.8},{type:"Rickshaw",eta:5.5}];
const peakH        = [{h:"6am",r:120},{h:"8am",r:380},{h:"10am",r:260},{h:"12pm",r:310},{h:"2pm",r:275},{h:"4pm",r:290},{h:"6pm",r:510},{h:"8pm",r:440},{h:"10pm",r:290},{h:"12am",r:140}];
const cityD        = [{city:"Karachi",rev:148000},{city:"Lahore",rev:82000},{city:"Islamabad",rev:43000},{city:"Faisalabad",rev:25000},{city:"Multan",rev:16000}];
const verifStatus  = [{name:"Approved",value:2940,color:P},{name:"Pending",value:126,color:PL},{name:"Rejected",value:776,color:PD}];
const riskD        = [{name:"Low Risk",value:2310,color:P},{name:"Medium Risk",value:980,color:PM},{name:"High Risk",value:552,color:PD}];

// ── KPI Row ───────────────────────────────────────────────────────────────────
function KpiRow({ items }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))", gap:14, marginBottom:24 }}>
      {items.map(k => (
        <div key={k.title} style={{ background:"white", borderRadius:14, padding:"18px 20px", boxShadow:"0 2px 14px rgba(233,30,99,.07)", border:`1px solid ${PP}`, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-12, right:-12, width:64, height:64, borderRadius:"50%", background:PP }} />
          <div style={{ fontSize:22, marginBottom:8 }}>{k.icon}</div>
          <div style={{ fontSize:11, color:"#aaa", fontWeight:600, textTransform:"uppercase", letterSpacing:".05em", marginBottom:4 }}>{k.title}</div>
          <div style={{ fontSize:22, fontWeight:800, color:PD, marginBottom:4 }}>{k.value}</div>
          <div style={{ fontSize:11, color:k.up?"#2E7D32":"#C62828", fontWeight:700 }}>{k.up?"▲":"▼"} {k.change}</div>
        </div>
      ))}
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
const Av = ({ name }) => (
  <div style={{ width:30, height:30, borderRadius:"50%", background:PP, display:"flex", alignItems:"center", justifyContent:"center", color:P, fontWeight:800, fontSize:11, flexShrink:0 }}>
    {name.split(" ").map(n=>n[0]).join("").slice(0,2)}
  </div>
);

// ── Dashboard Page ────────────────────────────────────────────────────────────
function DashboardPage({ verifReqs, onVerifAction }) {
  return (
    <>
      <KpiRow items={[
        { title:"Total Revenue",  value:"₨ 28,47,500", change:"+12.4% this month", up:true,  icon:"💰" },
        { title:"Total Drivers",  value:"3,842",        change:"+8.1% this month",  up:true,  icon:"🚘" },
        { title:"Total Riders",   value:"19,210",       change:"+15.3% this month", up:true,  icon:"🧍" },
        { title:"Pending Verif.", value:"126",          change:"-3.2% this month",  up:false, icon:"⏳" },
      ]} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))", gap:18, marginBottom:22 }}>
        <Card title="Ride Status Summary">
          <ResponsiveContainer width="100%" height={195}><PieChart><Pie data={rideStatus} cx="50%" cy="50%" outerRadius={75} dataKey="value" labelLine={false} label={pctLabel}>{rideStatus.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip content={<Tip/>}/></PieChart></ResponsiveContainer>
          <PieLegend data={rideStatus}/>
        </Card>
        <Card title="Revenue by Vehicle Type">
          <ResponsiveContainer width="100%" height={210}><BarChart data={vehicleRev} margin={{top:4,right:8,left:0,bottom:4}}><CartesianGrid strokeDasharray="3 3" stroke={PP}/><XAxis dataKey="type" tick={{fontSize:12,fill:"#888"}}/><YAxis tickFormatter={v=>`₨${(v/1000).toFixed(0)}k`} tick={{fontSize:11,fill:"#888"}}/><Tooltip content={<Tip/>}/><Bar dataKey="revenue" name="Revenue" fill={P} radius={[6,6,0,0]}/></BarChart></ResponsiveContainer>
        </Card>
        <Card title="Revenue Trend — 6 Months">
          <ResponsiveContainer width="100%" height={210}><AreaChart data={monthlyRev} margin={{top:4,right:8,left:0,bottom:4}}><defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={P} stopOpacity={.18}/><stop offset="95%" stopColor={P} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={PP}/><XAxis dataKey="m" tick={{fontSize:12,fill:"#888"}}/><YAxis tickFormatter={v=>`₨${(v/1000).toFixed(0)}k`} tick={{fontSize:11,fill:"#888"}}/><Tooltip content={<Tip/>}/><Area type="monotone" dataKey="rev" name="Revenue" stroke={P} strokeWidth={2.5} fill="url(#rg)" dot={{fill:P,r:4,stroke:"white",strokeWidth:2}}/></AreaChart></ResponsiveContainer>
        </Card>
        <Card title="AI Risk Analysis">
          <ResponsiveContainer width="100%" height={195}><PieChart><Pie data={riskD} cx="50%" cy="50%" outerRadius={75} dataKey="value" labelLine={false} label={pctLabel}>{riskD.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip content={<Tip/>}/></PieChart></ResponsiveContainer>
          <PieLegend data={riskD}/>
        </Card>
        <Card title="Female vs Male Drivers">
          <ResponsiveContainer width="100%" height={195}><PieChart><Pie data={genderD} cx="50%" cy="50%" innerRadius={48} outerRadius={75} dataKey="value" labelLine={false} label={pctLabel}>{genderD.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip content={<Tip/>}/></PieChart></ResponsiveContainer>
          <PieLegend data={genderD}/>
        </Card>
        <Card title="Driver Ratings Distribution">
          <ResponsiveContainer width="100%" height={210}><BarChart data={ratingD} margin={{top:4,right:8,left:0,bottom:4}}><CartesianGrid strokeDasharray="3 3" stroke={PP}/><XAxis dataKey="rating" tick={{fontSize:12,fill:"#888"}}/><YAxis tick={{fontSize:11,fill:"#888"}}/><Tooltip content={<Tip/>}/><Bar dataKey="count" name="Drivers" fill={PM} radius={[6,6,0,0]}/></BarChart></ResponsiveContainer>
        </Card>
      </div>
      <Card title="Recent Verification Requests">
        <VerifTable reqs={verifReqs.slice(0,4)} onAction={onVerifAction} compact/>
      </Card>
    </>
  );
}

// ── Drivers Page ──────────────────────────────────────────────────────────────
function DriversPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filtered = drivers.filter(d =>
    (filter==="All" || d.status===filter) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <KpiRow items={[
        { title:"Total Drivers",   value:"3,842", change:"+8.1%",  up:true,  icon:"🚘" },
        { title:"Active Today",    value:"1,204", change:"+5.3%",  up:true,  icon:"🟢" },
        { title:"Avg Rating",      value:"4.52",  change:"+0.04",  up:true,  icon:"⭐" },
        { title:"Suspended",       value:"43",    change:"+2 new", up:false, icon:"🚫" },
      ]} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))", gap:18, marginBottom:22 }}>
        <Card title="Drivers by Vehicle Type">
          <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={[{name:"Car",value:1820,color:P},{name:"Bike",value:1380,color:PM},{name:"Rickshaw",value:642,color:PL}]} cx="50%" cy="50%" outerRadius={75} dataKey="value" labelLine={false} label={pctLabel}>{[P,PM,PL].map((c,i)=><Cell key={i} fill={c}/>)}</Pie><Tooltip content={<Tip/>}/></PieChart></ResponsiveContainer>
          <PieLegend data={[{name:"Car",value:1820,color:P},{name:"Bike",value:1380,color:PM},{name:"Rickshaw",value:642,color:PL}]}/>
        </Card>
        <Card title="Ratings Distribution">
          <ResponsiveContainer width="100%" height={210}><BarChart data={ratingD} margin={{top:4,right:8,left:0,bottom:4}}><CartesianGrid strokeDasharray="3 3" stroke={PP}/><XAxis dataKey="rating" tick={{fontSize:12,fill:"#888"}}/><YAxis tick={{fontSize:11,fill:"#888"}}/><Tooltip content={<Tip/>}/><Bar dataKey="count" name="Drivers" fill={P} radius={[6,6,0,0]}/></BarChart></ResponsiveContainer>
        </Card>
        <Card title="Gender Split">
          <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={genderD} cx="50%" cy="50%" innerRadius={48} outerRadius={75} dataKey="value" labelLine={false} label={pctLabel}>{genderD.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip content={<Tip/>}/></PieChart></ResponsiveContainer>
          <PieLegend data={genderD}/>
        </Card>
      </div>
      <Card title="All Drivers">
        <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search driver…" style={{ flex:1,minWidth:180,padding:"8px 14px",borderRadius:10,border:`1.5px solid ${PL}`,fontSize:13,outline:"none" }}/>
          {["All","Active","Inactive","Suspended"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ padding:"8px 14px",borderRadius:10,border:`1.5px solid ${filter===f?P:PL}`,background:filter===f?P:"white",color:filter===f?"white":"#666",fontSize:12,fontWeight:600,cursor:"pointer" }}>{f}</button>
          ))}
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
            <thead><tr style={{ background:PP }}>
              {["#","Driver","Phone","City","Vehicle","Rating","Rides","Earnings","Status","Joined"].map(h=>(
                <th key={h} style={{ padding:"10px 12px",textAlign:"left",color:PD,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".04em",whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((d,i)=>{
                const st = statusStyle(d.status);
                return (
                  <tr key={d.id} style={{ borderBottom:`1px solid ${PP}` }} onMouseEnter={e=>e.currentTarget.style.background="#FFF5F8"} onMouseLeave={e=>e.currentTarget.style.background="white"}>
                    <td style={{ padding:"11px 12px",color:"#ccc" }}>{i+1}</td>
                    <td style={{ padding:"11px 12px" }}><div style={{ display:"flex",alignItems:"center",gap:9 }}><Av name={d.name}/><span style={{ fontWeight:600,color:"#333" }}>{d.name}</span></div></td>
                    <td style={{ padding:"11px 12px",color:"#666" }}>{d.phone}</td>
                    <td style={{ padding:"11px 12px",color:"#666" }}>{d.city}</td>
                    <td style={{ padding:"11px 12px",color:"#666" }}>{d.vehicle}</td>
                    <td style={{ padding:"11px 12px" }}><span style={{ color:P,fontWeight:700 }}>★ {d.rating}</span></td>
                    <td style={{ padding:"11px 12px",fontWeight:600,color:"#555" }}>{d.rides.toLocaleString()}</td>
                    <td style={{ padding:"11px 12px",fontWeight:600,color:"#555" }}>{d.earnings}</td>
                    <td style={{ padding:"11px 12px" }}><Badge val={d.status} {...st}/></td>
                    <td style={{ padding:"11px 12px",color:"#888" }}>{d.joined}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

// ── Riders Page ───────────────────────────────────────────────────────────────
function RidersPage() {
  const [search, setSearch] = useState("");
  const filtered = riders.filter(r=>r.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <KpiRow items={[
        { title:"Total Riders",     value:"19,210", change:"+15.3%", up:true,  icon:"🧍" },
        { title:"Active This Week", value:"8,440",  change:"+6.8%",  up:true,  icon:"🟢" },
        { title:"New This Month",   value:"1,284",  change:"+21.2%", up:true,  icon:"✨" },
        { title:"Suspended",        value:"112",    change:"+4 new", up:false, icon:"🚫" },
      ]} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))", gap:18, marginBottom:22 }}>
        <Card title="Riders by City">
          <ResponsiveContainer width="100%" height={210}><BarChart data={cityD} layout="vertical" margin={{top:4,right:8,left:52,bottom:4}}><CartesianGrid strokeDasharray="3 3" stroke={PP}/><XAxis type="number" tickFormatter={v=>`₨${(v/1000).toFixed(0)}k`} tick={{fontSize:11,fill:"#888"}}/><YAxis dataKey="city" type="category" tick={{fontSize:12,fill:"#555"}}/><Tooltip content={<Tip/>}/><Bar dataKey="rev" name="Revenue" fill={P} radius={[0,6,6,0]}/></BarChart></ResponsiveContainer>
        </Card>
        <Card title="Rider Status">
          <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={[{name:"Active",value:14820,color:P},{name:"Inactive",value:3278,color:PM},{name:"Suspended",value:1112,color:PD}]} cx="50%" cy="50%" outerRadius={75} dataKey="value" labelLine={false} label={pctLabel}>{[P,PM,PD].map((c,i)=><Cell key={i} fill={c}/>)}</Pie><Tooltip content={<Tip/>}/></PieChart></ResponsiveContainer>
          <PieLegend data={[{name:"Active",value:14820,color:P},{name:"Inactive",value:3278,color:PM},{name:"Suspended",value:1112,color:PD}]}/>
        </Card>
        <Card title="Rides per Rider (bucket)">
          <ResponsiveContainer width="100%" height={210}><BarChart data={[{bucket:"1–10",riders:4820},{bucket:"11–50",riders:7340},{bucket:"51–100",riders:4210},{bucket:"100+",riders:2840}]} margin={{top:4,right:8,left:0,bottom:4}}><CartesianGrid strokeDasharray="3 3" stroke={PP}/><XAxis dataKey="bucket" tick={{fontSize:12,fill:"#888"}}/><YAxis tick={{fontSize:11,fill:"#888"}}/><Tooltip content={<Tip/>}/><Bar dataKey="riders" name="Riders" fill={PM} radius={[6,6,0,0]}/></BarChart></ResponsiveContainer>
        </Card>
      </div>
      <Card title="All Riders">
        <div style={{ display:"flex", gap:10, marginBottom:14 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search rider…" style={{ flex:1,padding:"8px 14px",borderRadius:10,border:`1.5px solid ${PL}`,fontSize:13,outline:"none" }}/>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
            <thead><tr style={{ background:PP }}>
              {["#","Rider","Phone","City","Total Rides","Total Spent","Status","Last Ride","Joined"].map(h=>(
                <th key={h} style={{ padding:"10px 12px",textAlign:"left",color:PD,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".04em",whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((r,i)=>{
                const st = statusStyle(r.status);
                return (
                  <tr key={r.id} style={{ borderBottom:`1px solid ${PP}` }} onMouseEnter={e=>e.currentTarget.style.background="#FFF5F8"} onMouseLeave={e=>e.currentTarget.style.background="white"}>
                    <td style={{ padding:"11px 12px",color:"#ccc" }}>{i+1}</td>
                    <td style={{ padding:"11px 12px" }}><div style={{ display:"flex",alignItems:"center",gap:9 }}><Av name={r.name}/><span style={{ fontWeight:600,color:"#333" }}>{r.name}</span></div></td>
                    <td style={{ padding:"11px 12px",color:"#666" }}>{r.phone}</td>
                    <td style={{ padding:"11px 12px",color:"#666" }}>{r.city}</td>
                    <td style={{ padding:"11px 12px",fontWeight:600,color:"#555" }}>{r.rides}</td>
                    <td style={{ padding:"11px 12px",fontWeight:600,color:"#555" }}>{r.spent}</td>
                    <td style={{ padding:"11px 12px" }}><Badge val={r.status} {...st}/></td>
                    <td style={{ padding:"11px 12px",color:"#888" }}>{r.lastRide}</td>
                    <td style={{ padding:"11px 12px",color:"#888" }}>{r.joined}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

// ── Analytics Page ────────────────────────────────────────────────────────────
function AnalyticsPage() {
  return (
    <>
      <KpiRow items={[
        { title:"Total Revenue",   value:"₨ 28,47,500", change:"+12.4%", up:true, icon:"💰" },
        { title:"Total Rides",     value:"8,040",        change:"+9.8%",  up:true, icon:"🛣️" },
        { title:"Avg Fare",        value:"₨ 354",        change:"+2.1%",  up:true, icon:"💳" },
        { title:"Completion Rate", value:"84.5%",        change:"+1.3%",  up:true, icon:"✅" },
      ]} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))", gap:18, marginBottom:22 }}>
        <Card title="Monthly Revenue vs Rides" style={{ gridColumn:"span 2" }}>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={monthlyRev} margin={{top:4,right:8,left:0,bottom:4}}>
              <defs>
                <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={P} stopOpacity={.18}/><stop offset="95%" stopColor={P} stopOpacity={0}/></linearGradient>
                <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={PM} stopOpacity={.18}/><stop offset="95%" stopColor={PM} stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={PP}/>
              <XAxis dataKey="m" tick={{fontSize:12,fill:"#888"}}/>
              <YAxis yAxisId="l" tickFormatter={v=>`₨${(v/1000).toFixed(0)}k`} tick={{fontSize:11,fill:"#888"}}/>
              <YAxis yAxisId="r" orientation="right" tick={{fontSize:11,fill:"#888"}}/>
              <Tooltip content={<Tip/>}/>
              <Area yAxisId="l" type="monotone" dataKey="rev" name="Revenue" stroke={P} strokeWidth={2.5} fill="url(#ag1)" dot={{fill:P,r:4,stroke:"white",strokeWidth:2}}/>
              <Area yAxisId="r" type="monotone" dataKey="rides" name="Rides" stroke={PM} strokeWidth={2} fill="url(#ag2)" dot={{fill:PM,r:3,stroke:"white",strokeWidth:2}}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Peak Hours (Rides)">
          <ResponsiveContainer width="100%" height={230}><BarChart data={peakH} margin={{top:4,right:8,left:0,bottom:4}}><CartesianGrid strokeDasharray="3 3" stroke={PP}/><XAxis dataKey="h" tick={{fontSize:11,fill:"#888"}}/><YAxis tick={{fontSize:11,fill:"#888"}}/><Tooltip content={<Tip/>}/><Bar dataKey="r" name="Rides" fill={P} radius={[4,4,0,0]}/></BarChart></ResponsiveContainer>
        </Card>
        <Card title="Revenue by City">
          <ResponsiveContainer width="100%" height={220}><BarChart data={cityD} layout="vertical" margin={{top:4,right:8,left:52,bottom:4}}><CartesianGrid strokeDasharray="3 3" stroke={PP}/><XAxis type="number" tickFormatter={v=>`₨${(v/1000).toFixed(0)}k`} tick={{fontSize:11,fill:"#888"}}/><YAxis dataKey="city" type="category" tick={{fontSize:12,fill:"#555"}}/><Tooltip content={<Tip/>}/><Bar dataKey="rev" name="Revenue" fill={P} radius={[0,6,6,0]}/></BarChart></ResponsiveContainer>
        </Card>
        <Card title="Average ETA by Vehicle (min)">
          <ResponsiveContainer width="100%" height={210}><BarChart data={etaD} margin={{top:4,right:8,left:0,bottom:4}}><CartesianGrid strokeDasharray="3 3" stroke={PP}/><XAxis dataKey="type" tick={{fontSize:12,fill:"#888"}}/><YAxis domain={[0,10]} tick={{fontSize:11,fill:"#888"}}/><Tooltip content={<Tip/>}/><Bar dataKey="eta" name="ETA (min)" fill={PD} radius={[6,6,0,0]}/></BarChart></ResponsiveContainer>
        </Card>
        <Card title="Ride Status Breakdown">
          <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={rideStatus} cx="50%" cy="50%" outerRadius={75} dataKey="value" labelLine={false} label={pctLabel}>{rideStatus.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip content={<Tip/>}/></PieChart></ResponsiveContainer>
          <PieLegend data={rideStatus}/>
        </Card>
        <Card title="Driver Verification Status">
          <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={verifStatus} cx="50%" cy="50%" outerRadius={75} dataKey="value" labelLine={false} label={pctLabel}>{verifStatus.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip content={<Tip/>}/></PieChart></ResponsiveContainer>
          <PieLegend data={verifStatus}/>
        </Card>
      </div>
    </>
  );
}

// ── Verification Table ────────────────────────────────────────────────────────
function VerifTable({ reqs, onAction, compact }) {
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
        <thead><tr style={{ background:PP }}>
          {(compact
            ? ["Driver","Vehicle","Submitted","Risk","Status","Action"]
            : ["#","Driver","CNIC","Vehicle","City","Submitted","Docs","AI Risk","Status","Actions"]
          ).map(h=>(
            <th key={h} style={{ padding:"10px 12px",textAlign:"left",color:PD,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".04em",whiteSpace:"nowrap" }}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {reqs.map((r,i)=>{
            const st = statusStyle(r.status);
            const rs = riskStyle(r.risk);
            return (
              <tr key={r.id} style={{ borderBottom:`1px solid ${PP}` }} onMouseEnter={e=>e.currentTarget.style.background="#FFF5F8"} onMouseLeave={e=>e.currentTarget.style.background="white"}>
                {!compact && <td style={{ padding:"11px 12px",color:"#ccc" }}>{i+1}</td>}
                <td style={{ padding:"11px 12px" }}><div style={{ display:"flex",alignItems:"center",gap:9 }}><Av name={r.name}/><span style={{ fontWeight:600,color:"#333" }}>{r.name}</span></div></td>
                {!compact && <td style={{ padding:"11px 12px",color:"#666",fontFamily:"monospace",fontSize:12 }}>{r.cnic}</td>}
                <td style={{ padding:"11px 12px",color:"#666" }}>{r.vehicle}</td>
                {!compact && <td style={{ padding:"11px 12px",color:"#666" }}>{r.city}</td>}
                <td style={{ padding:"11px 12px",color:"#888" }}>{r.submitted}</td>
                {!compact && <td style={{ padding:"11px 12px" }}><span style={{ background:PP,color:P,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700 }}>{r.docs} docs</span></td>}
                <td style={{ padding:"11px 12px" }}><Badge val={r.risk} bg={rs.bg} color={rs.color}/></td>
                <td style={{ padding:"11px 12px" }}><Badge val={r.status} {...st}/></td>
                <td style={{ padding:"11px 12px" }}>
                  {r.status==="Pending"
                    ? <div style={{ display:"flex",gap:6 }}>
                        <button onClick={()=>onAction(r.id,"Approved")} style={{ padding:"5px 11px",background:"#E8F5E9",color:"#2E7D32",border:"none",borderRadius:7,fontSize:12,cursor:"pointer",fontWeight:700 }}>✓ Approve</button>
                        <button onClick={()=>onAction(r.id,"Rejected")} style={{ padding:"5px 11px",background:"#FFEBEE",color:"#C62828",border:"none",borderRadius:7,fontSize:12,cursor:"pointer",fontWeight:700 }}>✗ Reject</button>
                      </div>
                    : <span style={{ color:"#ccc",fontSize:12 }}>— Done</span>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Verification Page ─────────────────────────────────────────────────────────
function VerificationPage({ reqs, onAction }) {
  const pending  = reqs.filter(r=>r.status==="Pending").length;
  const approved = reqs.filter(r=>r.status==="Approved").length;
  const rejected = reqs.filter(r=>r.status==="Rejected").length;
  return (
    <>
      <KpiRow items={[
        { title:"Total Submitted", value:reqs.length.toString(), change:"All requests", up:true,  icon:"📋" },
        { title:"Pending Review",  value:pending.toString(),     change:"Needs action", up:false, icon:"⏳" },
        { title:"Approved",        value:approved.toString(),    change:"Verified OK",  up:true,  icon:"✅" },
        { title:"Rejected",        value:rejected.toString(),    change:"Declined",     up:false, icon:"❌" },
      ]} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:18, marginBottom:22 }}>
        <Card title="Verification Status">
          <ResponsiveContainer width="100%" height={195}><PieChart><Pie data={verifStatus} cx="50%" cy="50%" outerRadius={75} dataKey="value" labelLine={false} label={pctLabel}>{verifStatus.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip content={<Tip/>}/></PieChart></ResponsiveContainer>
          <PieLegend data={verifStatus}/>
        </Card>
        <Card title="AI Risk Distribution">
          <ResponsiveContainer width="100%" height={195}><PieChart><Pie data={riskD} cx="50%" cy="50%" outerRadius={75} dataKey="value" labelLine={false} label={pctLabel}>{riskD.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip content={<Tip/>}/></PieChart></ResponsiveContainer>
          <PieLegend data={riskD}/>
        </Card>
        <Card title="Document Completeness">
          <ResponsiveContainer width="100%" height={195}><BarChart data={[{docs:"1 doc",n:42},{docs:"2 docs",n:98},{docs:"3 docs",n:312},{docs:"4 docs",n:470}]} margin={{top:4,right:8,left:0,bottom:4}}><CartesianGrid strokeDasharray="3 3" stroke={PP}/><XAxis dataKey="docs" tick={{fontSize:12,fill:"#888"}}/><YAxis tick={{fontSize:11,fill:"#888"}}/><Tooltip content={<Tip/>}/><Bar dataKey="n" name="Drivers" fill={PM} radius={[6,6,0,0]}/></BarChart></ResponsiveContainer>
        </Card>
      </div>
      <Card title="Driver Verification Requests">
        <VerifTable reqs={reqs} onAction={onAction}/>
      </Card>
    </>
  );
}

// ── Settings Page ─────────────────────────────────────────────────────────────
function SettingsPage() {
  const [notif, setNotif] = useState({ email:true, sms:false, push:true });
  const [fare,  setFare]  = useState({ bike:25, car:45, rickshaw:30 });
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))", gap:18 }}>
      <Card title="Fare Configuration">
        {["bike","car","rickshaw"].map(v=>(
          <div key={v} style={{ marginBottom:18 }}>
            <label style={{ display:"block",fontSize:12,color:"#888",fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",marginBottom:6 }}>{v} — base fare / km (₨)</label>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              <input type="range" min={10} max={100} value={fare[v]} onChange={e=>setFare(p=>({...p,[v]:+e.target.value}))} style={{ flex:1,accentColor:P }}/>
              <span style={{ minWidth:38,fontWeight:800,color:P,fontSize:15 }}>₨{fare[v]}</span>
            </div>
          </div>
        ))}
        <button style={{ padding:"9px 20px",background:P,color:"white",border:"none",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer" }}>Save Fares</button>
      </Card>
      <Card title="Notification Preferences">
        {[["email","Email Alerts","📧"],["sms","SMS Alerts","📱"],["push","Push Notifications","🔔"]].map(([k,label,icon])=>(
          <div key={k} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0",borderBottom:`1px solid ${PP}` }}>
            <div>
              <div style={{ fontWeight:600,fontSize:14,color:"#333" }}>{icon} {label}</div>
              <div style={{ fontSize:12,color:"#aaa",marginTop:2 }}>Receive notifications for key events</div>
            </div>
            <div onClick={()=>setNotif(p=>({...p,[k]:!p[k]}))} style={{ width:42,height:22,borderRadius:11,background:notif[k]?P:PL,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0 }}>
              <div style={{ position:"absolute",top:3,left:notif[k]?22:3,width:16,height:16,borderRadius:"50%",background:"white",transition:"left .2s" }}/>
            </div>
          </div>
        ))}
      </Card>
      <Card title="Admin Profile">
        <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:18 }}>
          <div style={{ width:52,height:52,borderRadius:"50%",background:PP,display:"flex",alignItems:"center",justifyContent:"center",color:P,fontWeight:800,fontSize:20 }}>SA</div>
          <div><div style={{ fontWeight:700,fontSize:16,color:"#333" }}>Sara Admin</div><div style={{ fontSize:12,color:"#aaa" }}>Super Administrator</div></div>
        </div>
        {[["Full Name","Sara Admin"],["Email","sara@rideadmin.pk"],["Phone","+92 300 0000000"],["Role","Super Admin"]].map(([l,v])=>(
          <div key={l} style={{ marginBottom:12 }}>
            <label style={{ display:"block",fontSize:11,color:"#aaa",fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",marginBottom:4 }}>{l}</label>
            <input defaultValue={v} style={{ width:"100%",padding:"8px 12px",borderRadius:9,border:`1.5px solid ${PL}`,fontSize:13,color:"#333",outline:"none",boxSizing:"border-box" }}/>
          </div>
        ))}
        <button style={{ marginTop:4,padding:"9px 20px",background:P,color:"white",border:"none",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer" }}>Update Profile</button>
      </Card>
      <Card title="App Configuration">
        {[["Max Drivers per Zone","50"],["Ride Cancellation Window","3 min"],["Auto-approve Low Risk","Enabled"],["AI Risk Threshold","Medium"],["Platform Commission","12%"],["Support Contact","support@rideadmin.pk"]].map(([label,val])=>(
          <div key={label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${PP}` }}>
            <span style={{ fontSize:13,color:"#555",fontWeight:500 }}>{label}</span>
            <span style={{ fontSize:13,fontWeight:700,color:P }}>{val}</span>
          </div>
        ))}
        <button style={{ marginTop:14,padding:"9px 20px",background:P,color:"white",border:"none",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer" }}>Save Config</button>
      </Card>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
const PAGE_META = {
  Dashboard:    { title:"Dashboard Overview",       sub:"Platform activity at a glance" },
  Drivers:      { title:"Driver Management",        sub:"Browse, filter and manage all drivers" },
  Riders:       { title:"Rider Management",         sub:"Browse, filter and manage all riders" },
  Analytics:    { title:"Analytics & Insights",     sub:"Charts, trends and performance metrics" },
  Verification: { title:"Driver Verification",      sub:"Review and action driver applications" },
  Settings:     { title:"Settings",                 sub:"Configure platform preferences" },
};

export default function AdminApp() {
  const [page, setPage] = useState("Dashboard");
  const [open, setOpen] = useState(true);
  const [verifReqs, setVerifReqs] = useState(initialVerif);
  const handleVerifAction = (id, action) => setVerifReqs(prev=>prev.map(r=>r.id===id?{...r,status:action}:r));

  const nav = [
    { icon:"⊞", label:"Dashboard" },
    { icon:"🚘", label:"Drivers" },
    { icon:"🧍", label:"Riders" },
    { icon:"📊", label:"Analytics" },
    { icon:"✅", label:"Verification" },
    { icon:"⚙",  label:"Settings" },
  ];

  const renderPage = () => {
    if (page==="Dashboard")    return <DashboardPage verifReqs={verifReqs} onVerifAction={handleVerifAction}/>;
    if (page==="Drivers")      return <DriversPage/>;
    if (page==="Riders")       return <RidersPage/>;
    if (page==="Analytics")    return <AnalyticsPage/>;
    if (page==="Verification") return <VerificationPage reqs={verifReqs} onAction={handleVerifAction}/>;
    if (page==="Settings")     return <SettingsPage/>;
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#FFF5F8", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width:open?216:60, minHeight:"100vh", background:`linear-gradient(155deg,${PD} 0%,${P} 100%)`, boxShadow:"4px 0 28px rgba(233,30,99,.2)", display:"flex", flexDirection:"column", transition:"width .22s ease", overflow:"hidden", flexShrink:0, zIndex:10 }}>
        <div onClick={()=>setOpen(!open)} style={{ padding:open?"24px 16px 16px":"24px 10px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid rgba(255,255,255,.15)", cursor:"pointer" }}>
          <div style={{ width:36,height:36,background:"white",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>🚀</div>
          {open && <div><div style={{ color:"white",fontWeight:800,fontSize:15,lineHeight:1.1 }}>RideAdmin</div><div style={{ color:"rgba(255,255,255,.6)",fontSize:11 }}>Control Panel</div></div>}
        </div>
        <nav style={{ padding:"12px 7px", flex:1 }}>
          {nav.map(item=>(
            <button key={item.label} onClick={()=>setPage(item.label)} style={{ display:"flex",alignItems:"center",gap:10,width:"100%",padding:open?"10px 11px":"10px 0",justifyContent:open?"flex-start":"center",background:page===item.label?"rgba(255,255,255,.18)":"transparent",border:page===item.label?"1px solid rgba(255,255,255,.28)":"1px solid transparent",borderRadius:10,cursor:"pointer",color:"white",fontSize:14,fontWeight:page===item.label?700:400,marginBottom:3,transition:"all .14s" }}>
              <span style={{ fontSize:15,flexShrink:0 }}>{item.icon}</span>
              {open && item.label}
              {page===item.label && open && <span style={{ marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"white" }}/>}
            </button>
          ))}
        </nav>
        <div style={{ padding:open?"13px 16px":"13px 10px", borderTop:"1px solid rgba(255,255,255,.15)", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32,height:32,borderRadius:"50%",background:"white",display:"flex",alignItems:"center",justifyContent:"center",color:P,fontWeight:800,fontSize:12,flexShrink:0 }}>SA</div>
          {open && <div><div style={{ color:"white",fontSize:13,fontWeight:700 }}>Sara Admin</div><div style={{ color:"rgba(255,255,255,.6)",fontSize:11 }}>Super Admin</div></div>}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, padding:"24px 20px", overflow:"auto", minWidth:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, flexWrap:"wrap", gap:10 }}>
          <div>
            <h1 style={{ margin:0, fontSize:23, fontWeight:800, color:PD }}>{PAGE_META[page].title}</h1>
            <p style={{ margin:"3px 0 0", color:"#aaa", fontSize:13 }}>{PAGE_META[page].sub} · Fri, Apr 24, 2026</p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button style={{ padding:"8px 14px",background:"white",border:`1.5px solid ${PL}`,borderRadius:10,fontSize:13,color:"#666",cursor:"pointer" }}>📅 Last 30 Days</button>
            <button style={{ padding:"8px 14px",background:P,border:"none",borderRadius:10,fontSize:13,color:"white",cursor:"pointer",fontWeight:700 }}>+ Export</button>
          </div>
        </div>
        {renderPage()}
        <div style={{ textAlign:"center",marginTop:26,color:"#ddd",fontSize:11 }}>RideAdmin v2.1 · © 2026</div>
      </div>
    </div>
  );
}