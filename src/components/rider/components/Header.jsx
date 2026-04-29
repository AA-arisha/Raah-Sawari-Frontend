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

export default Header