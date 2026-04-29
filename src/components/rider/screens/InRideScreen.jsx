import { useState, useEffect, useRef, useCallback } from "react";
import MapView from "../components/Map";
import { Toggle, ProgressBar, Modal, FareStepper } from "../components/primitives";

export default function InRideScreen({ booking, route, onComplete }) {
  const [elapsed, setElapsed]           = useState(0);
  const [em, setEm]                     = useState(false);
  const [shared, setShared]             = useState(false);
  const total = 22 * 60;
  useEffect(()=>{ const id=setInterval(()=>setElapsed(e=>Math.min(e+1,total)),1000); return()=>clearInterval(id); },[]);
  const remMin  = Math.ceil((total-elapsed)/60);
  const progress = Math.round(elapsed/total*100);
  const fmt = s => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;

  return (
    <div style={{ minHeight:"calc(100vh - 60px)", background:"#fdf2f5", display:"flex", flexDirection:"column" }}>
      <div style={{ flex:1, padding:"24px 24px 0", minHeight:"56vh" }}>
        <MapView label="Ride in progress" animated showDriver showRoute />
      </div>

      <div style={{ height:4, background:"rgba(212,114,138,0.1)" }}>
        <div style={{ height:"100%", background:"linear-gradient(90deg,#D4728A,#F0A8BC)", transition:"width 1s", width:`${progress}%` }} />
      </div>

      <div style={{ background:"white", borderTop:"1.5px solid rgba(212,114,138,0.12)", padding:"18px 32px 22px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:32, alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#C0809A", marginBottom:4 }}>Destination</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700, color:"#3D1F2A", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{route.to}</div>
            <div style={{ fontSize:12, color:"#A07080", marginTop:3 }}>{route.from} → {route.to}</div>
          </div>

          <div style={{ display:"flex", alignItems:"center" }}>
            {[["Remaining",`${remMin} min`,"#3D1F2A"],["Elapsed",fmt(elapsed),"#3D1F2A"],["Fare",`Rs ${booking.fare}`,"#D4728A"]].map(([lbl,val,col],i) => (
              <div key={lbl} style={{ display:"flex" }}>
                {i>0 && <div style={{ width:1, background:"rgba(212,114,138,0.15)", margin:"0 20px", alignSelf:"stretch" }} />}
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:10, fontWeight:600, letterSpacing:"1px", textTransform:"uppercase", color:"#C0A0B0", marginBottom:4 }}>{lbl}</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:700, color:col }}>{val}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <button onClick={()=>{setShared(true);setTimeout(()=>setShared(false),3000);}}
              style={{ padding:"10px 18px", borderRadius:12, border:`1.5px solid ${shared?"#D4728A":"rgba(212,114,138,0.2)"}`, background:shared?"rgba(212,114,138,0.07)":"none", color:shared?"#D4728A":"#A07080", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"'Jost',sans-serif", transition:"all 0.2s" }}>
              {shared?"✓ Shared!":"🔗 Share Trip"}
            </button>
            <button onClick={()=>setEm(true)} style={{ padding:"10px 18px", borderRadius:12, border:"1.5px solid rgba(220,38,38,0.22)", background:"rgba(220,38,38,0.05)", color:"#dc2626", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Jost',sans-serif", transition:"all 0.2s" }}>
              🚨 SOS
            </button>
            <button className="rs-btn-primary" style={{ width:"auto", padding:"10px 22px" }} onClick={onComplete}>Complete ✓</button>
          </div>
        </div>
      </div>

      <Modal open={em} onClose={()=>setEm(false)} title="🚨 Emergency Alert">
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ padding:"12px 14px", background:"rgba(220,38,38,0.05)", border:"1px solid rgba(220,38,38,0.16)", borderRadius:12 }}>
            <p style={{ fontSize:13, color:"#9B2020", lineHeight:1.65 }}>This will immediately alert Raah Sawri's safety team and share your live location with emergency contacts.</p>
          </div>
          {[["🚔","Alert Police (15)","#dc2626","rgba(220,38,38,0.07)"],["📱","Notify Emergency Contact","#3D1F2A","rgba(212,114,138,0.05)"],["📞","Call Raah Sawri Support","#3D1F2A","rgba(212,114,138,0.05)"]].map(([ic,lb,c,bg])=>(
            <button key={lb} onClick={()=>setEm(false)} style={{ width:"100%", padding:"13px 16px", background:bg, border:`1.5px solid ${c==="#dc2626"?"rgba(220,38,38,0.2)":"rgba(212,114,138,0.12)"}`, borderRadius:12, fontSize:14, fontWeight:600, color:c, cursor:"pointer", fontFamily:"'Jost',sans-serif", display:"flex", alignItems:"center", gap:10, transition:"all 0.15s" }}>
              <span>{ic}</span>{lb}
            </button>
          ))}
          <button className="rs-btn-ghost" onClick={()=>setEm(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
