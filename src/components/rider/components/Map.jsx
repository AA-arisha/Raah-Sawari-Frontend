import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── Emoji marker factory ───────────────────────────────────────────────────
function makeEmojiIcon(emoji, size = 36) {
  return new L.DivIcon({
    html: `<div style="font-size:${size}px; line-height:1; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35));">${emoji}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

const originIcon      = makeEmojiIcon("📍", 36);
const destinationIcon = makeEmojiIcon("🏁", 36);
const driverIcon      = makeEmojiIcon("🚗", 38);




function makeGlassInfoMarker({ label, value, type }) {
  return new L.DivIcon({
    className: "",
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translateY(-8px);
        font-family: system-ui, -apple-system, sans-serif;
      ">
        
        <div style="
          background: linear-gradient(135deg, #FDF6F0, #F9E4E8);
          backdrop-filter: blur(12px);
          padding: 8px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.6);
          
          box-shadow:
            0 6px 18px rgba(157, 90, 108, 0.15),
            inset 0 1px 1px rgba(255,255,255,0.7);
          
          color: #3D1F2A;
          text-align: center;
          min-width: 90px;
        ">
          <div style="
            font-size: 10px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            opacity: 0.6;
            margin-bottom: 2px;
          ">
            ${label}
          </div>
          
          <div style="
            font-size: 14px;
            font-weight: 600;
          ">
            ${value}
          </div>
        </div>

        <!-- soft pointer -->
        <div style="
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid #F9E4E8;
          margin-top: -2px;
          opacity: 0.9;
        "></div>

      </div>
    `,
    iconSize: [110, 40],
    iconAnchor: [55, 40],
  });
}

// ── Component ──────────────────────────────────────────────────────────────
// Props:
//   showRoute   – bool (default true)
//   showDriver  – bool (default true)
//   destination – { lat, lng }
//   distance    – string e.g. "5.2 km"   (optional — shown only when passed)
//   eta         – string e.g. "12 mins"  (optional — shown only when passed)

function MapView({
  showRoute = true,
  showDriver ,
  destination,
  distance,
  eta,
}) {
  const [route, setRoute] = useState([]);
  const origin    = [24.8607, 67.0011];
  const driverPos = [24.865, 67.015];

  const destPoint =
    destination?.lat && destination?.lng
      ? [parseFloat(destination.lat), parseFloat(destination.lng)]
      : null;

  useEffect(() => {
    if (!showRoute || !destPoint) return;
    setRoute([]);

    const getRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${destPoint[1]},${destPoint[0]}?overview=full&geometries=geojson`;
        const res  = await fetch(url);
        const data = await res.json();
        if (data.routes?.length) {
          setRoute(data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]));
        }
      } catch (err) {
        console.error("Route fetch error:", err);
      }
    };

    getRoute();
  }, [destination?.lat, destination?.lng, showRoute]);

  const midPoint =
  route.length > 0
    ? route[Math.floor(route.length / 2)]
    : null;

  return (
    <div style={{ position: "relative", height: "480px", width: "100%", borderRadius: "16px", overflow: "hidden" }}>
      <MapContainer center={origin} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 📍 Origin */}
        <Marker position={origin} icon={originIcon} />

        {/* 🏁 Destination */}
        {destPoint && <Marker position={destPoint} icon={destinationIcon} />}

        {/* 🚗 Driver */}
        {showDriver && <Marker position={driverPos} icon={driverIcon} />}

        {/* Route */}
        {showRoute && route.length > 0 && (
          <Polyline positions={route} color="#C8607A" weight={4} />
        )}

        {/* ⏱ ETA near pickup */}
        {eta && (
          <Marker
            position={[origin[0] + 0.008, origin[1]]}
            icon={makeGlassInfoMarker({
              label: "ETA",
              value:  `${eta} min`,
            })}
          />
        )}

        {/* 📏 Distance at midpoint */}
        {distance && midPoint && (
          <Marker
            position={midPoint}
            icon={makeGlassInfoMarker({
              label: "Distance",
              value: `${distance} km`,
            })}
          />
        )}
      </MapContainer>

      
    </div>
  );
}

export default MapView;