import { useState, useEffect, useRef, useCallback } from "react";

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

export { Toggle, ProgressBar, Modal, FareStepper };
