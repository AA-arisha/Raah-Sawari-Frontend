import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new L.Icon({
  iconUrl, shadowUrl,
  iconSize: [25, 41], iconAnchor: [12, 41]
});

function MapView({ showRoute = true, showDriver = true, destination }) {
  const [route, setRoute] = useState([]);
  const origin = [24.8607, 67.0011];

  // Only compute destination point if destination has valid coords
  const destPoint = destination?.lat && destination?.lng
    ? [parseFloat(destination.lat), parseFloat(destination.lng)]
    : null;

  useEffect(() => {
    if (!showRoute || !destPoint) return;
    setRoute([]); // clear old route

    const getRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${destPoint[1]},${destPoint[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes?.length) {
          setRoute(data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]));
        }
      } catch (err) {
        console.error("Route fetch error:", err);
      }
    };

    getRoute();
  }, [destination?.lat, destination?.lng, showRoute]);

  return (
    <div style={{ height: "520px", width: "100%", borderRadius: "16px", overflow: "hidden" }}>
      <MapContainer center={origin} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Origin marker */}
        <Marker position={origin} icon={defaultIcon} />

        {/* Destination marker — only when coords are valid */}
        {destPoint && (
          <Marker position={destPoint} icon={defaultIcon} />
        )}

        {/* Driver marker */}
        {showDriver && (
          <Marker position={[24.865, 67.015]} icon={defaultIcon} />
        )}

        {/* Route polyline */}
        {showRoute && route.length > 0 && (
          <Polyline positions={route} color="#C8607A" weight={4} />
        )}
      </MapContainer>
    </div>
  );
}

export default MapView;