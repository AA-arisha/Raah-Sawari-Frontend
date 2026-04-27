// ============================================================
// RAAH SAWRI — راہ سواری  |  Rose & Blush Edition
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const RIDE_OPTIONS = [
  { id:"moto",     name:"Moto",     urdu:"موٹو", icon:"🏍️", seats:1, eta:"3 min", basePrice:120, description:"Fast & affordable" },
  { id:"mini",     name:"Mini",     urdu:"منی",  icon:"🚗", seats:3, eta:"5 min", basePrice:220, description:"Comfortable AC ride" },
  { id:"rickshaw", name:"Rickshaw", urdu:"رکشہ", icon:"🛺", seats:2, eta:"4 min", basePrice:90,  description:"Classic Karachi style" },
];

const RECENT_LOCATIONS = [
  { id:1, name:"Dolmen Mall Clifton",  area:"Clifton, Karachi",         icon:"🛍️" },
  { id:2, name:"Agha Khan Hospital",   area:"Stadium Road, Karachi",    icon:"🏥" },
  { id:3, name:"Karachi University",   area:"University Road, Karachi", icon:"🎓" },
  { id:4, name:"Jinnah Airport T1",    area:"PAF Base Faisal, Karachi", icon:"✈️" },
];

const SUGGESTIONS = [
  "Dolmen Mall Clifton, Karachi",
  "Karachi University, University Road",
  "Jinnah Airport Terminal 1",
  "Agha Khan Hospital, Stadium Road",
  "Tariq Road, PECHS, Karachi",
  "Sea View, DHA Phase 8",
  "Centaurus Mall, Clifton",
  "Burns Road, Old City",
  "Bahadurabad, Karachi",
  "Gulshan-e-Iqbal, Block 13",
];

const FEATURES = [
  { icon:"💸", title:"You Set the Price",    desc:"Negotiate your fare directly — no surge pricing surprises." },
  { icon:"🌸", title:"Female Driver Option", desc:"Opt for a female driver anytime for extra peace of mind." },
  { icon:"⚡", title:"Rides in Minutes",     desc:"Connect with nearby drivers fast, day or night." },
  { icon:"🛡️", title:"Safe Every Trip",      desc:"Live tracking, SOS button & verified drivers on every ride." },
  { icon:"🛺", title:"All Ride Types",       desc:"Rickshaw, Moto, Mini, AC Car — your city, your choice." },
  { icon:"📍", title:"Karachi Born",         desc:"Built for the streets of Karachi — every block, every lane." },
];

const MOCK_DRIVER = {
  name:"Usman Raza", urduName:"عثمان رضا",
  rating:4.8, trips:1240,
  vehicle:"Suzuki Alto 2021", color:"White",
  plate:"KHI-5501", phone:"+92-300-1234567",
  avatar:"UR", eta:4,
};

// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Jost:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #fdf2f5; font-family: 'Jost', sans-serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #fdf2f5; }
  ::-webkit-scrollbar-thumb { background: #e8b4c0; border-radius: 4px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroZoom {
    from { transform: scale(1.08); }
    to   { transform: scale(1.0); }
  }
  @keyframes floatPetal {
    0%   { transform: translateY(0) rotate(0deg);   opacity: 0; }
    10%  { opacity: 0.6; }
    90%  { opacity: 0.3; }
    100% { transform: translateY(-700px) rotate(360deg); opacity: 0; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  @keyframes dotPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.7); }
  }

  .fade-up-1 { opacity:0; animation: fadeUp 0.6s 0.3s ease forwards; }
  .fade-up-2 { opacity:0; animation: fadeUp 0.6s 0.5s ease forwards; }
  .fade-up-3 { opacity:0; animation: fadeUp 0.6s 0.7s ease forwards; }
  .fade-up-4 { opacity:0; animation: fadeUp 0.6s 0.9s ease forwards; }
  .fade-up-5 { opacity:0; animation: fadeUp 0.6s 1.1s ease forwards; }

  .rs-root { min-height: 100vh; background: #fdf2f5; font-family: 'Jost', sans-serif; }

  .rs-panel {
    background: white;
    border: 1.5px solid rgba(212,114,138,0.14);
    border-radius: 22px;
  }

  .inner-sidebar {
    width: 420px;
    min-width: 420px;
    background: white;
    border-right: 1.5px solid rgba(212,114,138,0.12);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .rs-btn-primary {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #C8607A 0%, #8C4A5C 100%);
    border: none;
    border-radius: 50px;
    color: white;
    font-family: 'Jost', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.4px;
    box-shadow: 0 8px 24px rgba(157,90,108,0.35);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .rs-btn-primary:hover  { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(157,90,108,0.45); }
  .rs-btn-primary:active { transform: scale(0.98); }
  .rs-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .rs-btn-ghost {
    padding: 11px 18px;
    background: transparent;
    border: 1.5px solid rgba(212,114,138,0.2);
    border-radius: 14px;
    color: #A07080;
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    text-align: center;
  }
  .rs-btn-ghost:hover { background: rgba(212,114,138,0.06); color: #9D5A6C; }

  .rs-btn-secondary {
    flex: 1;
    padding: 12px 20px;
    background: rgba(212,114,138,0.07);
    border: 1.5px solid rgba(212,114,138,0.2);
    border-radius: 12px;
    color: #9D5A6C;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .rs-btn-secondary:hover { background: rgba(212,114,138,0.13); }

  .rs-btn-danger {
    flex: 1;
    padding: 12px 20px;
    background: rgba(239,68,68,0.07);
    border: 1.5px solid rgba(239,68,68,0.2);
    border-radius: 12px;
    color: #dc2626;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .rs-btn-danger:hover { background: rgba(239,68,68,0.13); }

  .map-wrap {
    width: 100%;
    height: 100%;
    border-radius: 20px;
    overflow: hidden;
    border: 1.5px solid rgba(212,114,138,0.12);
    min-height: 340px;
    position: relative;
    background: #fce8ef;
  }

  .rs-modal-overlay {
    position: fixed; inset: 0; z-index: 999;
    background: rgba(61,31,42,0.5);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .rs-modal-box {
    background: white;
    border: 1.5px solid rgba(212,114,138,0.18);
    border-radius: 24px;
    width: 100%; max-width: 440px;
    box-shadow: 0 40px 80px rgba(61,31,42,0.18);
    animation: slideUp 0.25s ease-out;
    overflow: hidden;
  }

  .fare-box {
    background: rgba(212,114,138,0.05);
    border: 1.5px solid rgba(212,114,138,0.15);
    border-radius: 16px;
    padding: 14px 16px;
  }

  .rs-progress-track {
    width: 100%;
    background: rgba(212,114,138,0.12);
    border-radius: 99px;
    height: 6px;
    overflow: hidden;
  }
  .rs-progress-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #D4728A, #F0A8BC);
    transition: width 0.7s ease-out;
  }

  .ride-opt {
    border: 1.5px solid rgba(212,114,138,0.14);
    border-radius: 18px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
  }
  .ride-opt:hover   { border-color: rgba(212,114,138,0.35); box-shadow: 0 4px 20px rgba(157,90,108,0.09); }
  .ride-opt.sel     { border-color: #D4728A; background: rgba(212,114,138,0.04); box-shadow: 0 4px 20px rgba(157,90,108,0.14); }

  .feature-tile {
    background: white;
    border: 1.5px solid rgba(212,114,138,0.12);
    border-radius: 20px;
    padding: 20px 18px;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: default;
    position: relative;
    overflow: hidden;
  }
  .feature-tile:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(157,90,108,0.11);
    border-color: rgba(212,114,138,0.3);
  }

  .recent-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 13px 14px;
    background: white;
    border: 1.5px solid rgba(212,114,138,0.1);
    border-radius: 16px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
    width: 100%;
    font-family: 'Jost', sans-serif;
  }
  .recent-btn:hover {
    border-color: rgba(212,114,138,0.32);
    box-shadow: 0 4px 16px rgba(157,90,108,0.08);
  }

  .rs-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,114,138,0.2), transparent);
    margin: 28px 32px;
  }

  .stat-item {
    flex: 1;
    text-align: center;
    padding: 4px 10px;
    border-right: 1px solid rgba(255,255,255,0.08);
  }
  .stat-item:last-child { border-right: none; }
`;

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────

function useCountdown(initial) {
  const [count, setCount]     = useState(initial);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (!running || count <= 0) return;
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, running]);
  const reset = useCallback(() => { setCount(initial); setRunning(true); }, [initial]);
  const stop  = useCallback(() => setRunning(false), []);
  return { count, reset, stop, expired: count <= 0 };
}

function useFareStep(base, min, max, step = 10) {
  const [fare, setFare] = useState(base);
  const inc   = () => setFare(f => Math.min(f + step, max));
  const dec   = () => setFare(f => Math.max(f - step, min));
  const reset = () => setFare(base);
  return { fare, inc, dec, reset, isMin: fare <= min, isMax: fare >= max };
}

// ─────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────

function Toggle({ checked, onChange, label, sublabel }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
      <div>
        <div style={{ fontSize:14, fontWeight:600, color:"#3D1F2A" }}>{label}</div>
        {sublabel && <div style={{ fontSize:11, color:"#A07080", marginTop:2 }}>{sublabel}</div>}
      </div>
      <button onClick={() => onChange(!checked)} style={{ width:46, height:25, borderRadius:99, border:"none", cursor:"pointer", position:"relative", background: checked ? "#D4728A" : "#e8d0d8", transition:"background 0.3s", flexShrink:0 }}>
        <span style={{ position:"absolute", top:3, left:3, width:19, height:19, background:"white", borderRadius:"50%", boxShadow:"0 1px 4px rgba(0,0,0,0.18)", transition:"transform 0.3s", transform: checked ? "translateX(21px)" : "translateX(0)" }} />
      </button>
    </div>
  );
}

function ProgressBar({ progress }) {
  return (
    <div className="rs-progress-track">
      <div className="rs-progress-fill" style={{ width:`${Math.min(100,Math.max(0,progress))}%` }} />
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const h = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  if (!open) return null;
  return (
    <div className="rs-modal-overlay" onClick={onClose}>
      <div className="rs-modal-box" onClick={e => e.stopPropagation()}>
        {title && (
          <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid rgba(212,114,138,0.12)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700, color:"#3D1F2A" }}>{title}</span>
            <button onClick={onClose} style={{ background:"rgba(212,114,138,0.08)", border:"none", borderRadius:10, width:32, height:32, cursor:"pointer", color:"#9D5A6C", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>
        )}
        <div style={{ padding:"20px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

function FareStepper({ fare, inc, dec, isMin, isMax, recommended, label = "Your Fare" }) {
  const btnStyle = (disabled) => ({
    width:38, height:38, borderRadius:12,
    border:"1.5px solid rgba(212,114,138,0.22)",
    background: disabled ? "transparent" : "white",
    color: disabled ? "#D0B0BC" : "#9D5A6C",
    fontSize:20, fontWeight:700,
    cursor: disabled ? "not-allowed" : "pointer",
    transition:"all 0.2s",
    display:"flex", alignItems:"center", justifyContent:"center",
  });
  return (
    <div className="fare-box">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", color:"#C0809A" }}>{label}</span>
        {recommended && <span style={{ fontSize:11, color:"#D4728A", background:"rgba(212,114,138,0.1)", padding:"2px 10px", borderRadius:20 }}>Rec: Rs {recommended}</span>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={dec} disabled={isMin} style={btnStyle(isMin)}>−</button>
        <div style={{ flex:1, textAlign:"center" }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:"#3D1F2A" }}>Rs {fare}</span>
        </div>
        <button onClick={inc} disabled={isMax} style={btnStyle(isMax)}>+</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAP
// ─────────────────────────────────────────────

function MapView({ label = "Map View", animated = false, showDriver = false, showRoute = false }) {
  const canvasRef = useRef(null);
  const frameRef  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#fce8ef"); bg.addColorStop(1, "#f8dde6");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(212,114,138,0.1)"; ctx.lineWidth = 1;
      for (let x=0; x<W; x+=38) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y=0; y<H; y+=38) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // Roads
      const roads = [[0,H*.3,W,H*.3],[0,H*.62,W,H*.62],[W*.28,0,W*.28,H],[W*.62,0,W*.62,H]];
      ctx.strokeStyle = "rgba(200,96,122,0.17)"; ctx.lineWidth = 10;
      roads.forEach(([x1,y1,x2,y2]) => { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); });
      ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1.5; ctx.setLineDash([10,10]);
      roads.forEach(([x1,y1,x2,y2]) => { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); });
      ctx.setLineDash([]);

      // Route
      if (showRoute || showDriver) {
        const g = ctx.createLinearGradient(W*.2,H*.7,W*.75,H*.3);
        g.addColorStop(0,"rgba(200,96,122,0.9)"); g.addColorStop(1,"rgba(240,168,188,0.35)");
        ctx.strokeStyle = g; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(W*.2,H*.72);
        ctx.bezierCurveTo(W*.28,H*.62,W*.62,H*.62,W*.62,H*.3);
        ctx.bezierCurveTo(W*.62,H*.22,W*.68,H*.26,W*.74,H*.28);
        ctx.stroke();
      }

      // Dest pin
      if (showRoute || showDriver) {
        const px = W*.74, py = H*.28;
        ctx.shadowColor="#C8607A"; ctx.shadowBlur=14;
        ctx.fillStyle="#C8607A"; ctx.beginPath(); ctx.arc(px,py,9,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0; ctx.fillStyle="white"; ctx.font="bold 10px Jost,sans-serif";
        ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("B",px,py);
      }

      // Animated driver
      if (showDriver) {
        frameRef.current += 0.007;
        const t = frameRef.current % 1;
        const [sx,sy,ex,ey] = [W*.2,H*.72,W*.74,H*.28];
        const [cx1,cy1,cx2,cy2] = [W*.28,H*.62,W*.62,H*.45];
        const x = Math.pow(1-t,3)*sx + 3*Math.pow(1-t,2)*t*cx1 + 3*(1-t)*t*t*cx2 + t*t*t*ex;
        const y = Math.pow(1-t,3)*sy + 3*Math.pow(1-t,2)*t*cy1 + 3*(1-t)*t*t*cy2 + t*t*t*ey;
        if (animated) {
          [0.3,0.6,0.9].forEach((_,i) => {
            const r = ((frameRef.current*1.5 + i*0.33)%1);
            ctx.strokeStyle=`rgba(200,96,122,${(1-r)*0.35})`; ctx.lineWidth=2;
            ctx.beginPath(); ctx.arc(x,y,10+r*22,0,Math.PI*2); ctx.stroke();
          });
        }
        ctx.shadowColor="rgba(200,96,122,0.45)"; ctx.shadowBlur=16;
        ctx.fillStyle="#C8607A"; ctx.beginPath(); ctx.arc(x,y,11,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0; ctx.font="13px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("🚗",x,y);
      }

      // Origin pin
      const [px,py] = [W*.2,H*.72];
      ctx.shadowColor="#9D5A6C"; ctx.shadowBlur=12;
      ctx.fillStyle="#9D5A6C"; ctx.beginPath(); ctx.arc(px,py,9,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0; ctx.fillStyle="white"; ctx.font="bold 10px Jost,sans-serif";
      ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("A",px,py);

      if (animated) raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [animated, showDriver, showRoute]);

  return (
    <div className="map-wrap">
      <canvas ref={canvasRef} width={900} height={520} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
      <div style={{ position:"absolute", top:14, left:14, background:"rgba(253,242,245,0.93)", backdropFilter:"blur(8px)", border:"1px solid rgba(212,114,138,0.2)", borderRadius:12, padding:"6px 14px", fontSize:12, color:"#9D5A6C", fontWeight:500 }}>
        📍 {label}
      </div>
      {animated && (
        <div style={{ position:"absolute", bottom:14, right:14, background:"rgba(253,242,245,0.93)", backdropFilter:"blur(8px)", border:"1px solid rgba(212,114,138,0.2)", borderRadius:12, padding:"5px 12px", display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"#D4728A", display:"inline-block", animation:"dotPulse 1.2s infinite" }} />
          <span style={{ fontSize:11, color:"#D4728A", fontWeight:600 }}>Live</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────

function Header({ screen, onHome }) {
  const labels = { home:null, route:"Plan Route", rides:"Select Ride", searching:"Searching…", driver:"Driver Assigned", inRide:"In Progress" };
  const label = labels[screen];
  return (
    <header style={{ background:"rgba(253,242,245,0.96)", backdropFilter:"blur(16px)", borderBottom:"1.5px solid rgba(212,114,138,0.12)", position:"sticky", top:0, zIndex:200 }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 32px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={onHome} style={{ display:"flex", alignItems:"center", gap:10, background:"none", border:"none", cursor:"pointer" }}>
          <div style={{ width:36, height:36, background:"linear-gradient(135deg,#D4728A,#8C4A5C)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 4px 12px rgba(157,90,108,0.28)" }}>🛺</div>
          <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700, color:"#3D1F2A" }}>Raah Sawri</span>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, color:"#C0809A", fontStyle:"italic" }}>راہ سواری</span>
          </div>
        </button>

        {label && (
          <div style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(212,114,138,0.08)", border:"1px solid rgba(212,114,138,0.18)", borderRadius:20, padding:"5px 14px" }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#D4728A", display:"inline-block", animation:"dotPulse 1.2s infinite" }} />
            <span style={{ fontSize:13, color:"#9D5A6C", fontWeight:500 }}>{label}</span>
          </div>
        )}

        <nav style={{ display:"flex", alignItems:"center", gap:4 }}>
          {screen === "home" ? (
            <>
              {["History","Support"].map(l => (
                <button key={l} style={{ padding:"6px 14px", fontSize:13, color:"#A07080", background:"none", border:"none", cursor:"pointer", borderRadius:10, fontFamily:"'Jost',sans-serif", fontWeight:500, transition:"all 0.15s" }}
                  onMouseEnter={e=>{e.target.style.background="rgba(212,114,138,0.08)";e.target.style.color="#9D5A6C"}}
                  onMouseLeave={e=>{e.target.style.background="none";e.target.style.color="#A07080"}}
                >{l}</button>
              ))}
              <div style={{ width:34, height:34, background:"linear-gradient(135deg,#F0A8BC,#D4728A)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"white", marginLeft:4 }}>AS</div>
            </>
          ) : (
            <button onClick={onHome} className="rs-btn-ghost" style={{ width:"auto", padding:"7px 16px", fontSize:13 }}>← Home</button>
          )}
        </nav>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────────

function HomeScreen({ onSearch }) {
  const [pickup,  setPickup]  = useState("");
  const [dropoff, setDropoff] = useState("");
  const [active,  setActive]  = useState(null);

  return (
    <div style={{ background:"#fdf2f5" }}>
      {/* HERO */}
      <section style={{ position:"relative", overflow:"hidden", height:590 }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"url('https://images.unsplash.com/photo-1619468129361-605ebea04b44?w=1200&q=80')", backgroundSize:"cover", backgroundPosition:"center 30%", animation:"heroZoom 8s ease-out forwards", filter:"brightness(0.72) saturate(1.1)" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(30,8,18,0.15) 0%, rgba(30,8,18,0.04) 30%, rgba(30,8,18,0.54) 65%, rgba(20,5,12,0.94) 100%)" }} />

        {["🌸","🌺","🌷","✿","❀","🌸"].map((p,i) => (
          <div key={i} style={{ position:"absolute", bottom:-20, left:`${10+i*16}%`, fontSize:`${12+(i%3)*4}px`, animation:`floatPetal ${6+i*1.4}s linear ${i*1.1}s infinite`, opacity:0, pointerEvents:"none" }}>{p}</div>
        ))}

        <div style={{ position:"absolute", bottom:0, left:0, right:0 }}>
          <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 32px 36px" }}>
            <div style={{ maxWidth:660 }}>
              {/* Badge */}
              <div className="fade-up-1" style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(212,114,138,0.22)", backdropFilter:"blur(8px)", border:"1px solid rgba(212,114,138,0.4)", borderRadius:20, padding:"5px 16px", fontSize:11, color:"#F0A8BC", fontWeight:600, letterSpacing:"1.2px", textTransform:"uppercase", marginBottom:16 }}>
                <span>🌸</span> Karachi's Premium Ride App
              </div>

              <h1 className="fade-up-2" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:74, fontWeight:700, color:"white", lineHeight:0.95, letterSpacing:"-2px", marginBottom:8 }}>
                Raah<br/>Sawri
              </h1>
              <p className="fade-up-3" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontStyle:"italic", color:"#F0A8BC", marginBottom:14, fontWeight:400 }}>
                راہ سواری — Your Journey, Your Way
              </p>
              <p className="fade-up-3" style={{ fontSize:14, color:"rgba(255,255,255,0.62)", fontWeight:300, marginBottom:28, letterSpacing:"0.3px" }}>
                Set your own fare · Safe rides · Always on time
              </p>

              

                <button className="rs-btn-primary" onClick={() => onSearch(dropoff||"Dolmen Mall Clifton")}>
                  Find My Ride <span>→</span>
                </button>
              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROUTE SCREEN
// ─────────────────────────────────────────────

function RouteScreen({ onConfirm, onBack }) {
  const [from, setFrom]       = useState("My Location — Saddar, Karachi");
  const [to,   setTo]         = useState("");
  const [sugs, setSugs]       = useState([]);
  const [focused, setFocused] = useState(false);

  const handleTo = v => { setTo(v); setSugs(v.length>1 ? SUGGESTIONS.filter(s=>s.toLowerCase().includes(v.toLowerCase())) : []); };

  return (
    <div style={{ display:"flex", minHeight:"calc(100vh - 60px)", background:"#fdf2f5" }}>
      <div className="inner-sidebar">
        <div style={{ padding:"24px 24px 20px", borderBottom:"1.5px solid rgba(212,114,138,0.1)", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={onBack} style={{ width:38, height:38, borderRadius:12, background:"rgba(212,114,138,0.08)", border:"1.5px solid rgba(212,114,138,0.14)", cursor:"pointer", color:"#9D5A6C", fontSize:17, display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700, color:"#3D1F2A" }}>Plan Your Route</div>
            <div style={{ fontSize:12, color:"#A07080", marginTop:1 }}>اپنا راستہ منتخب کریں</div>
          </div>
        </div>

        <div style={{ flex:1, padding:24, display:"flex", flexDirection:"column", gap:18 }}>
          {/* From */}
          <div>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#C0809A", display:"block", marginBottom:8 }}>From</label>
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"white", border:"1.5px solid rgba(212,114,138,0.14)", borderRadius:14, padding:"12px 14px" }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:"#9D5A6C", flexShrink:0 }} />
              <input value={from} onChange={e=>setFrom(e.target.value)} style={{ flex:1, border:"none", background:"transparent", fontFamily:"'Jost',sans-serif", fontSize:14, color:"#3D1F2A", outline:"none" }} />
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:8, paddingLeft:4 }}>
            <div style={{ width:1.5, height:22, background:"linear-gradient(to bottom,#9D5A6C,#E0A0B0)" }} />
            <button style={{ fontSize:12, color:"#C0A0B0", background:"none", border:"none", cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>⇅ Swap</button>
          </div>

          {/* To */}
          <div style={{ position:"relative" }}>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#C0809A", display:"block", marginBottom:8 }}>To</label>
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"white", border:`1.5px solid ${focused?"#D4728A":"rgba(212,114,138,0.14)"}`, borderRadius:14, padding:"12px 14px", boxShadow:focused?"0 0 0 3px rgba(212,114,138,0.12)":"none", transition:"all 0.2s" }}>
              <div style={{ width:10, height:10, borderRadius:2, background:"#E07B8A", border:"2px solid #F0A8BC", flexShrink:0 }} />
              <input value={to} onChange={e=>handleTo(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setTimeout(()=>setFocused(false),150)} placeholder="Where to?" autoFocus
                style={{ flex:1, border:"none", background:"transparent", fontFamily:"'Jost',sans-serif", fontSize:14, color:"#3D1F2A", outline:"none" }} />
            </div>
            {focused && sugs.length > 0 && (
              <div style={{ position:"absolute", top:"100%", left:0, right:0, marginTop:4, background:"white", border:"1.5px solid rgba(212,114,138,0.16)", borderRadius:16, overflow:"hidden", boxShadow:"0 8px 32px rgba(157,90,108,0.13)", zIndex:10 }}>
                {sugs.slice(0,5).map((s,i) => (
                  <button key={i} onMouseDown={()=>{setTo(s);setSugs([]);setFocused(false);}}
                    style={{ width:"100%", textAlign:"left", padding:"11px 16px", background:"none", border:"none", borderBottom:i<4?"1px solid rgba(212,114,138,0.07)":"none", fontSize:13, color:"#3D1F2A", cursor:"pointer", display:"flex", alignItems:"center", gap:10, fontFamily:"'Jost',sans-serif", transition:"background 0.12s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(212,114,138,0.06)"}
                    onMouseLeave={e=>e.currentTarget.style.background="none"}
                  ><span style={{color:"#C0809A"}}>📍</span>{s}</button>
                ))}
              </div>
            )}
          </div>

         
          <div>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:"1.5px", textTransform:"uppercase", color:"#C0A0B0", marginBottom:10 }}>Popular Near You</div>
            {SUGGESTIONS.slice(0,3).map((s,i) => (
              <button key={i} onClick={()=>setTo(s)} style={{ display:"block", width:"100%", textAlign:"left", padding:"9px 10px", borderRadius:10, background:"none", border:"none", fontSize:13, color:"#7D4A5C", cursor:"pointer", fontFamily:"'Jost',sans-serif", transition:"background 0.12s", marginBottom:2 }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(212,114,138,0.07)"}
                onMouseLeave={e=>e.currentTarget.style.background="none"}
              ><span style={{marginRight:8,color:"#D4A0B0"}}>🕐</span>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ padding:"18px 24px", borderTop:"1.5px solid rgba(212,114,138,0.1)" }}>
          <button className="rs-btn-primary" onClick={() => onConfirm({ from, to: to||"Dolmen Mall Clifton" })}>Confirm Route →</button>
        </div>
      </div>

      <div style={{ flex:1, padding:24 }}>
        <MapView label="Select on map" showRoute={!!to} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// RIDES SCREEN
// ─────────────────────────────────────────────

function RidesScreen({ route, onBook, onBack }) {
  const [sel, setSel]               = useState("mini");
  const [femalePref, setFemalePref] = useState(false);
  const selRide    = RIDE_OPTIONS.find(r => r.id === sel);
  const fareStep   = useFareStep(selRide?.basePrice||220, Math.round((selRide?.basePrice||220)*.8), Math.round((selRide?.basePrice||220)*1.5), 10);
  useEffect(() => { fareStep.reset(); }, [sel]);

  return (
    <div style={{ display:"flex", minHeight:"calc(100vh - 60px)", background:"#fdf2f5" }}>
      <div className="inner-sidebar">
        <div style={{ padding:"24px 24px 20px", borderBottom:"1.5px solid rgba(212,114,138,0.1)", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={onBack} style={{ width:38, height:38, borderRadius:12, background:"rgba(212,114,138,0.08)", border:"1.5px solid rgba(212,114,138,0.14)", cursor:"pointer", color:"#9D5A6C", fontSize:17, display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700, color:"#3D1F2A" }}>Choose a Ride</div>
            <div style={{ fontSize:12, color:"#A07080", marginTop:1 }}>سواری منتخب کریں</div>
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:24, display:"flex", flexDirection:"column", gap:16 }}>
          {/* Route summary */}
          <div style={{ background:"rgba(212,114,138,0.05)", border:"1.5px solid rgba(212,114,138,0.12)", borderRadius:16, padding:16 }}>
            <div style={{ display:"flex", gap:12 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, marginTop:3, flexShrink:0 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:"#9D5A6C" }} />
                <div style={{ width:1.5, height:22, background:"linear-gradient(to bottom,#9D5A6C,#E0A0B0)" }} />
                <div style={{ width:10, height:10, borderRadius:2, background:"#E07B8A", border:"2px solid #F0A8BC" }} />
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8, flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, color:"#3D1F2A", fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{route.from}</div>
                <div style={{ fontSize:13, color:"#3D1F2A", fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{route.to}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:20, marginTop:12, paddingTop:12, borderTop:"1px solid rgba(212,114,138,0.1)" }}>
              <div style={{ fontSize:12, color:"#A07080" }}><b style={{color:"#3D1F2A"}}>~8 km</b> route</div>
              <div style={{ fontSize:12, color:"#A07080" }}><b style={{color:"#3D1F2A"}}>22 min</b> estimated</div>
            </div>
          </div>

          {/* Ride options */}
          {RIDE_OPTIONS.map(ride => (
            <div key={ride.id} className={`ride-opt${sel===ride.id?" sel":""}`} onClick={()=>setSel(ride.id)} style={{ position:"relative" }}>
              {sel===ride.id && (
                <div style={{ position:"absolute", top:12, right:12, width:22, height:22, background:"linear-gradient(135deg,#D4728A,#9D5A6C)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"white", fontWeight:700 }}>✓</div>
              )}
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:48, height:48, borderRadius:14, background:sel===ride.id?"rgba(212,114,138,0.1)":"rgba(212,114,138,0.06)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{ride.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:"#3D1F2A" }}>{ride.name}</span>
                    <span style={{ fontSize:12, color:"#C0A0B0", fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic" }}>{ride.urdu}</span>
                    {femalePref && ride.id!=="moto" && <span style={{ fontSize:10, background:"rgba(212,114,138,0.1)", color:"#D4728A", border:"1px solid rgba(212,114,138,0.2)", padding:"1px 8px", borderRadius:20 }}>♀ Pref</span>}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    {[ride.eta, `${ride.seats} seat${ride.seats>1?"s":""}`, ride.description].map((v,i) => (
                      <span key={i} style={{ fontSize:11, color:"#A07080" }}>{i>0&&<span style={{color:"#DDB0BC",marginRight:7}}>·</span>}{v}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:"#3D1F2A" }}>Rs {sel===ride.id?fareStep.fare:ride.basePrice}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Female pref */}
          <div style={{ background:"rgba(212,114,138,0.04)", border:"1.5px solid rgba(212,114,138,0.12)", borderRadius:16, padding:16 }}>
            <Toggle checked={femalePref} onChange={setFemalePref} label="Female Rider Preference" sublabel="خواتین ڈرائیور" />
            {femalePref && (
              <div style={{ marginTop:12, padding:"10px 12px", background:"rgba(212,114,138,0.06)", border:"1px solid rgba(212,114,138,0.18)", borderRadius:10, fontSize:12, color:"#9D5A6C", lineHeight:1.5 }}>
                ℹ️ Preference set. Wait times may be slightly longer. Available for Mini & Rickshaw.
              </div>
            )}
          </div>

          <FareStepper fare={fareStep.fare} inc={fareStep.inc} dec={fareStep.dec} isMin={fareStep.isMin} isMax={fareStep.isMax} recommended={selRide?.basePrice} label="Offer Fare" />
        </div>

        <div style={{ padding:"18px 24px", borderTop:"1.5px solid rgba(212,114,138,0.1)" }}>
          <button className="rs-btn-primary" onClick={()=>onBook({ride:selRide,fare:fareStep.fare,femalePref})}>Find Offers — Rs {fareStep.fare} →</button>
          <p style={{ fontSize:11, color:"#C0A0B0", textAlign:"center", marginTop:10 }}>Drivers will see your fare offer</p>
        </div>
      </div>

      <div style={{ flex:1, padding:24 }}>
        <MapView label="Your route" showRoute />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SEARCHING SCREEN
// ─────────────────────────────────────────────

function SearchingScreen({ booking, onDriverFound, onCancel }) {
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

// ─────────────────────────────────────────────
// DRIVER SCREEN
// ─────────────────────────────────────────────

function DriverScreen({ booking, onArrived, onCancel }) {
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

// ─────────────────────────────────────────────
// IN-RIDE SCREEN
// ─────────────────────────────────────────────

function InRideScreen({ booking, route, onComplete }) {
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

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────

export default function RiderApp() {
  const [screen,  setScreen]  = useState("home");
  const [route,   setRoute]   = useState(null);
  const [booking, setBooking] = useState(null);
  const go = s => setScreen(s);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="rs-root">
        <Header screen={screen} onHome={() => go("home")} />
        {screen==="home"      && <HomeScreen onSearch={q=>{setRoute({from:"My Location",to:q});go("route");}} />}
        {screen==="route"     && <RouteScreen onConfirm={r=>{setRoute(r);go("rides");}} onBack={()=>go("home")} />}
        {screen==="rides"     && route   && <RidesScreen route={route} onBook={b=>{setBooking(b);go("searching");}} onBack={()=>go("route")} />}
        {screen==="searching" && booking && <SearchingScreen booking={booking} onDriverFound={()=>go("driver")} onCancel={()=>go("home")} />}
        {screen==="driver"    && booking && <DriverScreen booking={booking} onArrived={()=>go("inRide")} onCancel={()=>go("home")} />}
        {screen==="inRide"    && booking && route && <InRideScreen booking={booking} route={route} onComplete={()=>go("home")} />}
      </div>
    </>
  );
}