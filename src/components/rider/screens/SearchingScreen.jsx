import { useState, useEffect, useRef, useCallback } from "react";
import { useCountdown, useFareStep } from "../components/hooks";
import MapView from "../components/Map";
import { Toggle, ProgressBar, Modal, FareStepper } from "../components/primitives";
export default function SearchingScreen({ booking, onDriverFound, onCancel }) {
  const { count, reset, expired } = useCountdown(60);
  const [showTout, setShowTout]   = useState(false);
  const [autoAcc,  setAutoAcc]    = useState(false);
  const [dv,       setDv]         = useState(3);
  const fs = useFareStep(booking.fare, booking.ride.basePrice, booking.ride.basePrice*2, 10);

  useEffect(()=>{ if(expired) setShowTout(true); },[expired]);
  useEffect(()=>{ const id=setInterval(()=>setDv(v=>Math.max(0,v+(Math.random()>.4?1:-1))),2500); return()=>clearInterval(id); },[]);
  useEffect(()=>{ if(!autoAcc) return; const t=setTimeout(onDriverFound,4000); return()=>clearTimeout(t); },[autoAcc]);

  const retry = () => { fs.inc(); fs.inc(); setShowTout(false); reset(); };

  return (
    <div style={{ display:"flex", minHeight:"calc(100vh - 60px)", background:"#fdf2f5" }}>
      <div style={{ flex:1, padding:24 }}>
        <MapView label="Searching for drivers…" animated showRoute />
      </div>

      <div style={{ width:380, background:"white", borderLeft:"1.5px solid rgba(212,114,138,0.12)", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"24px 24px 18px", borderBottom:"1.5px solid rgba(212,114,138,0.1)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#D4728A", display:"inline-block", animation:"dotPulse 1.2s infinite" }} />
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700, color:"#3D1F2A" }}>Searching Drivers</span>
          </div>
          <div style={{ fontSize:12, color:"#A07080" }}>ڈرائیور تلاش کیا جا رہا ہے</div>
        </div>

        <div style={{ flex:1, padding:24, overflowY:"auto", display:"flex", flexDirection:"column", gap:18 }}>
          {/* Countdown */}
          <div style={{ textAlign:"center", padding:"10px 0" }}>
            <div style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center", width:120, height:120 }}>
              <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", transform:"rotate(-90deg)" }} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(212,114,138,0.12)" strokeWidth="8" />
                <circle cx="50" cy="50" r="44" fill="none"
                  stroke={count>20?"#D4728A":count>10?"#E07B5A":"#D45A5A"}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2*Math.PI*44}`}
                  strokeDashoffset={`${2*Math.PI*44*(1-count/60)}`}
                  style={{ transition:"all 1s" }}
                />
              </svg>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:700, color: count>20?"#3D1F2A":count>10?"#B07040":"#A04040", lineHeight:1 }}>{count}</div>
                <div style={{ fontSize:10, color:"#A07080", textTransform:"uppercase", letterSpacing:1 }}>seconds</div>
              </div>
            </div>
            <div style={{ fontSize:13, color:"#A07080", marginTop:10 }}>Request expires soon</div>
          </div>

          {/* Drivers viewing */}
          <div style={{ background:"rgba(212,114,138,0.05)", border:"1.5px solid rgba(212,114,138,0.12)", borderRadius:16, padding:16, display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ position:"relative" }}>
              <span style={{ fontSize:34 }}>👥</span>
              <div style={{ position:"absolute", top:-4, right:-4, width:20, height:20, background:"linear-gradient(135deg,#D4728A,#9D5A6C)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"white" }}>{dv}</div>
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:"#3D1F2A" }}>{dv} driver{dv!==1?"s":""} viewing</div>
              <div style={{ fontSize:12, color:"#A07080", marginTop:2 }}>your ride request</div>
            </div>
          </div>

          <FareStepper fare={fs.fare} inc={fs.inc} dec={fs.dec} isMin={fs.isMin} isMax={fs.isMax} recommended={booking.fare} label="Adjust Fare" />
          <Toggle checked={autoAcc} onChange={setAutoAcc} label="Auto-Accept Nearest Driver" sublabel="Automatically accept first available" />
          {autoAcc && <div style={{ padding:"10px 14px", background:"rgba(212,114,138,0.06)", border:"1px solid rgba(212,114,138,0.18)", borderRadius:12, fontSize:12, color:"#9D5A6C" }}>✓ Will auto-accept in ~30 seconds if driver is found</div>}
        </div>

        <div style={{ padding:"18px 24px", borderTop:"1.5px solid rgba(212,114,138,0.1)", display:"flex", flexDirection:"column", gap:10 }}>
          <button className="rs-btn-primary" onClick={onDriverFound}>Simulate: Driver Found</button>
          <button className="rs-btn-ghost" onClick={onCancel}>Cancel Request</button>
        </div>
      </div>

      <Modal open={showTout} onClose={()=>setShowTout(false)} title="⏱️ No Drivers Found">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <p style={{ fontSize:14, color:"#7D5060", lineHeight:1.65 }}>No drivers accepted at <strong style={{color:"#3D1F2A"}}>Rs {fs.fare}</strong>. Try increasing your fare to attract more drivers.</p>
          <div style={{ background:"rgba(212,114,138,0.06)", borderRadius:14, padding:16, border:"1.5px solid rgba(212,114,138,0.14)" }}>
            <div style={{ fontSize:10, color:"#C0A0B0", marginBottom:6, textTransform:"uppercase", letterSpacing:"1px" }}>Suggested</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:"#D4728A" }}>Rs {fs.fare+30}</span>
              <span style={{ fontSize:13, color:"#C0A0B0", textDecoration:"line-through" }}>Rs {fs.fare}</span>
              <span style={{ marginLeft:"auto", fontSize:11, background:"rgba(212,114,138,0.1)", color:"#D4728A", padding:"2px 10px", borderRadius:20 }}>+Rs 30</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button className="rs-btn-secondary" onClick={()=>{setShowTout(false);onCancel();}}>Cancel</button>
            <button className="rs-btn-primary" style={{ flex:1 }} onClick={retry}>Retry Higher →</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

