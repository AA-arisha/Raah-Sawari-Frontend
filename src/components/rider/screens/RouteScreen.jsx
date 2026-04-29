import { useState, useEffect, useRef, useCallback } from "react";
import MapView from "../components/Map";

const SUGGESTIONS = [
  { name: "Dolmen Mall Clifton, Karachi",         lat: 24.8121, lng: 67.0294 },
  { name: "Karachi University, University Road",  lat: 24.9425, lng: 67.1128 },
  { name: "Jinnah Airport Terminal 1",            lat: 24.9008, lng: 67.1681 },
  { name: "Agha Khan Hospital, Stadium Road",     lat: 24.8933, lng: 67.0800 },
  { name: "Tariq Road, PECHS, Karachi",           lat: 24.8700, lng: 67.0600 },
];

// Default pickup (Saddar, Karachi)
const DEFAULT_PICKUP = { lat: 24.8607, lng: 67.0104, name: "My Location — Saddar, Karachi" };

export default function RouteScreen({ onConfirm, onBack }) {
  const [from,         setFrom]        = useState(DEFAULT_PICKUP.name);
  const [to,           setTo]          = useState("");
  const [sugs,         setSugs]        = useState([]);
  const [focused,      setFocused]     = useState(false);
  const [loading,      setLoading]     = useState(false);
  const [selectedDest, setSelectedDest] = useState(null);
  // Store resolved coords for pickup (from GPS / geocoded)
  const [pickupCoords, setPickupCoords] = useState({ lat: DEFAULT_PICKUP.lat, lng: DEFAULT_PICKUP.lng });

  // Debounced destination search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (to.length >= 2) handleSearch(to);
      else setSugs([]);
    }, 500);
    return () => clearTimeout(delay);
  }, [to]);

  const handleSearch = async (value) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}, Karachi&limit=6&addressdetails=1&countrycodes=pk&viewbox=66.6,24.6,67.6,25.2&bounded=1`
      );
      const data = await res.json();
      setSugs(data.map((item) => ({
        name: item.display_name,
        lat:  parseFloat(item.lat),
        lng:  parseFloat(item.lon),
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    const destination = selectedDest || SUGGESTIONS[0];
    // Pass both human-readable strings AND lat/lng coords
    onConfirm({
      from:       from,
      to:         destination.name || to || SUGGESTIONS[0].name,
      pickup:     pickupCoords,                            // { lat, lng }
      drop:       { lat: destination.lat, lng: destination.lng }  // { lat, lng }
    });
  };

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

        <div style={{ flex:1, padding:24, display:"flex", flexDirection:"column", gap:15 }}>
          {/* From */}
          <div>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#C0809A", display:"block", marginBottom:8 }}>From</label>
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"white", border:"1.5px solid rgba(212,114,138,0.14)", borderRadius:14, padding:"12px 14px" }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:"#9D5A6C", flexShrink:0 }} />
              <input value={from} onChange={e=>setFrom(e.target.value)} style={{ flex:1, border:"none", background:"transparent", fontFamily:"'Jost',sans-serif", fontSize:14, color:"#3D1F2A", outline:"none" }} />
            </div>
          </div>

          {/* To */}
          <div style={{ position:"relative" }}>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#C0809A", display:"block", marginBottom:8 }}>To</label>
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"white", border:`1.5px solid ${focused?"#D4728A":"rgba(212,114,138,0.14)"}`, borderRadius:14, padding:"12px 14px", boxShadow:focused?"0 0 0 3px rgba(212,114,138,0.12)":"none", transition:"all 0.2s" }}>
              <div style={{ width:10, height:10, borderRadius:2, background:"#E07B8A", border:"2px solid #F0A8BC", flexShrink:0 }} />
              <input
                value={to}
                onChange={e => { setTo(e.target.value); setSelectedDest(null); }}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder="Where to?"
                autoFocus
                style={{ flex:1, border:"none", background:"transparent", fontFamily:"'Jost',sans-serif", fontSize:14, color:"#3D1F2A", outline:"none" }}
              />
              {loading && <span style={{ fontSize:11, color:"#C0A0B0" }}>…</span>}
            </div>
            {focused && sugs.length > 0 && (
              <div style={{ position:"absolute", top:"100%", left:0, right:0, marginTop:4, background:"white", border:"1.5px solid rgba(212,114,138,0.16)", borderRadius:16, overflow:"hidden", boxShadow:"0 8px 32px rgba(157,90,108,0.13)", zIndex:10 }}>
                {sugs.map((s, i) => (
                  <button key={i} onMouseDown={() => {
                    setTo(s.name);
                    setSugs([]);
                    setFocused(false);
                    setSelectedDest({ lat: s.lat, lng: s.lng, name: s.name });
                  }} style={{ width:"100%", textAlign:"left", padding:"11px 16px", background:"none", border:"none", fontSize:13, cursor:"pointer" }}>
                    📍 {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:"1.5px", textTransform:"uppercase", color:"#C0A0B0", marginBottom:10 }}>Popular Near You</div>
            {SUGGESTIONS.slice(0, 3).map((s, i) => (
              <button key={i} onClick={() => { setTo(s.name); setSelectedDest({ lat: s.lat, lng: s.lng, name: s.name }); }}
                style={{ display:"block", width:"100%", textAlign:"left", padding:"9px 10px", borderRadius:10, background:"none", border:"none", fontSize:13, color:"#7D4A5C", cursor:"pointer", fontFamily:"'Jost',sans-serif", transition:"background 0.12s", marginBottom:2 }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(212,114,138,0.07)"}
                onMouseLeave={e => e.currentTarget.style.background="none"}
              ><span style={{ marginRight:8, color:"#D4A0B0" }}>🕐</span>{s.name}</button>
            ))}
          </div>

          <div style={{ padding:"10px 24px", borderTop:"1.5px solid rgba(212,114,138,0.1)" }}>
            <button className="rs-btn-primary" onClick={handleConfirm}>Confirm Route →</button>
          </div>
        </div>
      </div>

      <div style={{ flex:1, padding:20 }}>
        <MapView label="Select on map" showRoute={!!selectedDest} destination={selectedDest} />
      </div>
    </div>
  );
}