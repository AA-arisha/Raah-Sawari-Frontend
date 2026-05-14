import { useState } from "react";

export default function HomeScreen({ onSearch }) {
  const [pickup,  setPickup]  = useState("");
  const [dropoff, setDropoff] = useState("");
  const [active,  setActive]  = useState(null);

  return (
    <div style={{ background:"#fdf2f5" }}>
      {/* HERO */}
      <section style={{ position:"relative", overflow:"hidden", height:532 }}>
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
