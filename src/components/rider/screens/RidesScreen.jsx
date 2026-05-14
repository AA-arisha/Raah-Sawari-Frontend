import { useState, useEffect, useRef, useCallback } from "react";
import { useFareStep } from "../components/hooks";
import { Toggle, ProgressBar, Modal, FareStepper } from "../components/primitives";
import MapView from "../components/Map";
import { getRideEstimate } from "../../../api/ride.api";

// Vehicle id mapping between frontend names and backend vehicle names
const VEHICLE_MAP = { moto: "bike", mini: "car", rickshaw: "rickshaw" };

const RIDE_OPTIONS = [
  { id:"moto",     name:"Moto",     urdu:"موٹو", icon:"🏍️", seats:1, description:"Fast & affordable" },
  { id:"mini",     name:"Mini",     urdu:"منی",  icon:"🚗", seats:3, description:"Comfortable AC ride" },
  { id:"rickshaw", name:"Rickshaw", urdu:"رکشہ", icon:"🛺", seats:2, description:"Classic Karachi style" },
];

export default function RidesScreen({ route, onBook, onBack }) {
  const [sel, setSel]               = useState("mini");
  const [femalePref, setFemalePref] = useState(false);

  // API state
  const [apiData,   setApiData]   = useState(null);   // full response from /api/ride/estimate
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError,  setApiError]  = useState(null);
  
  // Fetch estimate from backend once on mount (or when route coords change)
  useEffect(() => {
    if (!route?.pickup || !route?.drop) return;

    let cancelled = false;
    setApiLoading(true);
    setApiError(null);

    getRideEstimate(route.pickup, route.drop)
      .then(data => { if (!cancelled) { setApiData(data); setApiLoading(false); } })
      .catch(err  => { if (!cancelled) { setApiError(err.message); setApiLoading(false); } });

    return () => { cancelled = true; };
  }, [route?.pickup?.lat, route?.pickup?.lng, route?.drop?.lat, route?.drop?.lng]);

  // Helper: get backend vehicle data for the currently selected ride
  const getVehicleData = useCallback((rideId) => {
    if (!apiData?.vehicles) return null;

    const backendKey = VEHICLE_MAP[rideId];
    return apiData.vehicles.find(v => v.vehicle === backendKey) ?? null;
  }, [apiData]);

  const selRide      = RIDE_OPTIONS.find(r => r.id === sel);
  const selVehicle   = getVehicleData(sel);

  // Derive base/min/max from backend data (fallback to static values while loading)
  const basePrice    = selVehicle?.recommended_fare ?? (sel === "moto" ? 120 : sel === "mini" ? 220 : 90);
  const minPrice     = selVehicle?.min_fare         ?? Math.round(basePrice * 0.8);
  const maxPrice     = selVehicle?.max_fare         ?? Math.round(basePrice * 1.5);

  const fareStep = useFareStep(basePrice, minPrice, maxPrice, 10);
  
  // Reset fare stepper whenever selected vehicle or API data changes
  useEffect(() => {
    fareStep.reset(basePrice);          // ← pass basePrice so reset isn't stale
  }, [sel, apiData]);  

  // Distance & ETA — from API or fallback
  const distanceKm  = apiData?.distance_km ?? null;
  const selEtaMin   = selVehicle?.eta_min  ?? null;

  const distanceLabel = distanceKm != null ? `~${distanceKm.toFixed(1)} km` : "~8 km";
  const etaLabel      = selEtaMin   != null ? `${selEtaMin} min`            : "-- min";

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
              {apiLoading ? (
                <div style={{ fontSize:12, color:"#C0A0B0" }}>Fetching estimate…</div>
              ) : apiError ? (
                <div style={{ fontSize:12, color:"#E07B8A" }}>⚠ {apiError}</div>
              ) : (
                <>
                  <div style={{ fontSize:12, color:"#A07080" }}><b style={{ color:"#3D1F2A" }}>{distanceLabel}</b> route</div>
                  <div style={{ fontSize:12, color:"#A07080" }}><b style={{ color:"#3D1F2A" }}>{etaLabel}</b> estimated</div>
                </>
              )}
            </div>
          </div>

          {/* Ride options */}
          {RIDE_OPTIONS.map(ride => {
            const vData    = getVehicleData(ride.id);
            const rideEta  = vData?.eta_min           ?? null;
            const rideFare = vData?.recommended_fare  ?? null;
            const displayFare = sel === ride.id ? fareStep.fare : (rideFare ?? "");
            const displayEta  = rideEta != null ? `${rideEta} min` : (ride.id === "moto" ? "3 min" : ride.id === "mini" ? "5 min" : "4 min");

            return (
              <div key={ride.id} className={`ride-opt${sel===ride.id?" sel":""}`} onClick={() => setSel(ride.id)} style={{ position:"relative", opacity: apiLoading ? 0.7 : 1, transition:"opacity 0.3s" }}>
                {sel === ride.id && (
                  <div style={{ position:"absolute", top:12, right:12, width:22, height:22, background:"linear-gradient(135deg,#D4728A,#9D5A6C)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"white", fontWeight:700 }}>✓</div>
                )}
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:sel===ride.id?"rgba(212,114,138,0.1)":"rgba(212,114,138,0.06)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{ride.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                      <span style={{ fontSize:14, fontWeight:700, color:"#3D1F2A" }}>{ride.name}</span>
                      <span style={{ fontSize:12, color:"#C0A0B0", fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic" }}>{ride.urdu}</span>
                      {femalePref && ride.id !== "moto" && <span style={{ fontSize:10, background:"rgba(212,114,138,0.1)", color:"#D4728A", border:"1px solid rgba(212,114,138,0.2)", padding:"1px 8px", borderRadius:20 }}>♀ Pref</span>}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      {[displayEta, `${ride.seats} seat${ride.seats>1?"s":""}`, ride.description].map((v, i) => (
                        <span key={i} style={{ fontSize:11, color:"#A07080" }}>{i>0&&<span style={{ color:"#DDB0BC", marginRight:7 }}>·</span>}{v}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:"#3D1F2A" }}>
                      {apiLoading ? "…" : `Rs ${rideFare}`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        <div style={{ padding:"18px 24px", borderTop:"1.5px solid rgba(212,114,138,0.1)" }}>
          <button
            className="rs-btn-primary"
            onClick={() => onBook({ ride: selRide, fare: fareStep.fare, femalePref, vehicleData: selVehicle })}
            disabled={apiLoading}
          >
            {apiLoading ? "Getting fares…" : `Find Offers — Rs ${fareStep.fare} →`}
          </button>
          <p style={{ fontSize:11, color:"#C0A0B0", textAlign:"center", marginTop:10 }}>Drivers will see your fare offer</p>
        </div>
      </div>

      <div style={{ flex:1, padding:24 }}>
        <MapView label="Your route" showRoute={!!route.drop} destination={route.drop} distance={distanceKm} eta={selEtaMin} />
      </div>
    </div>
  );
}
