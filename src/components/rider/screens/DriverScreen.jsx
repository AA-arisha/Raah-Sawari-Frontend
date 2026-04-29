import { useState, useEffect, useRef, useCallback } from "react";
import MapView from "../components/Map";
import { Toggle, ProgressBar, Modal, FareStepper } from "../components/primitives";
const MOCK_DRIVER = {
  name:"Usman Raza", urduName:"عثمان رضا",
  rating:4.8, trips:1240,
  vehicle:"Suzuki Alto 2021", color:"White",
  plate:"KHI-5501", phone:"+92-300-1234567",
  avatar:"UR", eta:4,
};

export default function DriverScreen({ booking, onArrived, onCancel }) {
  const [progress, setProgress] = useState(8);
  const [cm, setCm]             = useState(false);
  const [eta, setEta]           = useState(MOCK_DRIVER.eta);

  useEffect(()=>{
    const id=setInterval(()=>{ setProgress(p=>{if(p>=96){clearInterval(id);return 96;}return p+1.8;}); setEta(e=>Math.max(0,e-.1)); },350);
    return()=>clearInterval(id);
  },[]);
  useEffect(()=>{ if(progress>=96){const t=setTimeout(onArrived,1200);return()=>clearTimeout(t);} },[progress]);

  const driver = { ...MOCK_DRIVER, eta: Math.ceil(eta) };

  return (
    <div style={{ background:"#fdf2f5", minHeight:"calc(100vh - 60px)", display:"flex", flexDirection:"column" }}>
      <div style={{ flex:1, position:"relative", minHeight:"52vh", padding:"24px 24px 0" }}>
        <MapView label="Driver approaching" animated showDriver showRoute />
        <div style={{ position:"absolute", top:38, left:"50%", transform:"translateX(-50%)", background:"rgba(253,242,245,0.95)", backdropFilter:"blur(10px)", border:"1.5px solid rgba(212,114,138,0.18)", borderRadius:20, padding:"8px 20px", boxShadow:"0 4px 20px rgba(157,90,108,0.1)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#D4728A", display:"inline-block" }} />
            <span style={{ fontSize:13, fontWeight:600, color:"#9D5A6C" }}>Driver En Route</span>
            <span style={{ color:"rgba(212,114,138,0.3)" }}>·</span>
            <span style={{ fontSize:13, color:"#7D5060" }}>{MOCK_DRIVER.vehicle}</span>
            <span style={{ color:"rgba(212,114,138,0.3)" }}>·</span>
            <span style={{ fontSize:13, fontWeight:700, color:"#3D1F2A", fontFamily:"monospace" }}>{MOCK_DRIVER.plate}</span>
          </div>
        </div>
      </div>

      <div style={{ background:"white", borderTop:"1.5px solid rgba(212,114,138,0.12)", padding:"20px 32px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr auto", gap:24 }}>
          {/* Driver info */}
          <div style={{ background:"rgba(212,114,138,0.04)", border:"1.5px solid rgba(212,114,138,0.14)", borderRadius:20, padding:20 }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:16 }}>
              <div style={{ width:54, height:54, background:"linear-gradient(135deg,#D4728A,#8C4A5C)", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:"white", boxShadow:"0 4px 16px rgba(157,90,108,0.22)", flexShrink:0 }}>{MOCK_DRIVER.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:700, color:"#3D1F2A" }}>{MOCK_DRIVER.name}</span>
                  <span style={{ fontSize:13, color:"#C0A0B0", fontStyle:"italic" }}>{MOCK_DRIVER.urduName}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:8 }}>
                  <span style={{ color:"#E07B8A" }}>★</span>
                  <span style={{ fontSize:13, fontWeight:600, color:"#3D1F2A" }}>{MOCK_DRIVER.rating}</span>
                  <span style={{ fontSize:11, color:"#C0A0B0", marginLeft:4 }}>{MOCK_DRIVER.trips.toLocaleString()} trips</span>
                </div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {[MOCK_DRIVER.vehicle, MOCK_DRIVER.plate, MOCK_DRIVER.color].map((v,i) => (
                    <span key={i} style={{ fontSize:11, background:"white", border:"1px solid rgba(212,114,138,0.16)", color:"#7D5060", padding:"3px 10px", borderRadius:20, fontFamily:i===1?"monospace":"inherit" }}>{v}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:"#D4728A" }}>{driver.eta} min</div>
                <div style={{ fontSize:11, color:"#A07080" }}>away</div>
              </div>
            </div>
            <div style={{ marginTop:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#A07080", marginBottom:6 }}><span>Driver en route</span><span>{driver.eta} min ETA</span></div>
              <ProgressBar progress={progress} />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:"flex", flexDirection:"column", gap:10, justifyContent:"center" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[["💬","Message"],["📞","Call"]].map(([ic,lb]) => (
                <button key={lb} style={{ padding:"13px 16px", background:"rgba(212,114,138,0.05)", border:"1.5px solid rgba(212,114,138,0.14)", borderRadius:14, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:5, transition:"all 0.2s", fontFamily:"'Jost',sans-serif" }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(212,114,138,0.1)";e.currentTarget.style.borderColor="#D4728A"}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(212,114,138,0.05)";e.currentTarget.style.borderColor="rgba(212,114,138,0.14)"}}
                ><span style={{fontSize:22}}>{ic}</span><span style={{fontSize:11,color:"#9D5A6C",fontWeight:500}}>{lb}</span></button>
              ))}
            </div>
            <button className="rs-btn-ghost" onClick={()=>setCm(true)}>Cancel Ride</button>
          </div>
        </div>
      </div>

      <Modal open={cm} onClose={()=>setCm(false)} title="Cancel Ride?">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <p style={{ fontSize:14, color:"#7D5060", lineHeight:1.65 }}>Your driver <strong style={{color:"#3D1F2A"}}>{MOCK_DRIVER.name}</strong> is {driver.eta} min away. Cancelling may incur a <span style={{color:"#C07840",fontWeight:600}}>Rs 30 fee</span>.</p>
          <div style={{ display:"flex", gap:10 }}>
            <button className="rs-btn-secondary" onClick={()=>setCm(false)}>Keep Ride</button>
            <button className="rs-btn-danger" onClick={()=>{setCm(false);onCancel();}}>Cancel Anyway</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
