// ============================================================
// RAAH SAWRI — راہ سواری  |  Rose & Blush Edition
// ============================================================
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "../components/rider/components/Header";
import MapView from "../components/rider/components/MapView";
import { useCountdown, useFareStep } from "../components/rider/components/hooks";
import HomeScreen from "../components/rider/screens/HomeScreen";
import RouteScreen from "../components/rider/screens/RouteScreen";
import RidesScreen from "../components/rider/screens/RidesScreen";
import SearchingScreen from "../components/rider/screens/SearchingScreen";
import DriverScreen from "../components/rider/screens/DriverScreen";
import InRideScreen from "../components/rider/screens/InRideScreen";
import { GLOBAL_CSS } from "../components/rider/components/styles";
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



export default function RiderApp() {
 const navigate = useNavigate();
const location = useLocation();
  const [route, setRoute] = useState(null);
  const [booking, setBooking] = useState(null);


const screenMap = {
  ".": "home", "route": "route", "rides": "rides",
  "searching": "searching", "driver": "driver", "inRide": "inRide"
};

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="rs-root">
      <Header screen={screenMap[location.pathname]} onHome={() => navigate(".")} />

      <Routes>
        <Route
          path="/"
          element={
            <HomeScreen
              onSearch={(q) => {
                setRoute({ from: "My Location", to: q });
                navigate("/rider/route");
              }}
            />
          }
        />

        <Route
          path="route"
          element={
            <RouteScreen
              onConfirm={(r) => {
                setRoute(r);
                navigate("/rider/rides");
              }}
              onBack={() => navigate(".")}
            />
          }
        />

        <Route
          path="rides"
          element={
           
              <RidesScreen
                route={route}
                onBook={(b) => {
                  setBooking(b);
                  navigate("/rider/searching");
                }}
                onBack={() => navigate("/rider/route")}
              />
            
          }
        />

        <Route
          path="searching"
          element={
            booking ? (
              <SearchingScreen
                booking={booking}
                onDriverFound={() => navigate("/rider/driver")}
                onCancel={() => navigate("/rider")}
              />
            ) : (
              <p>No booking</p>
            )
          }
        />

        <Route
          path="driver"
          element={
            booking ? (
              <DriverScreen
                booking={booking}
                onArrived={() => navigate("/rider/inRide")}
                onCancel={() => navigate("/rider")}
              />
            ) : (
              <p>No driver</p>
            )
          }
        />

        <Route
          path="inRide"
          element={
            booking && route ? (
              <InRideScreen
                booking={booking}
                route={route}
                onComplete={() => navigate("/rider")}
              />
            ) : (
              <p>Missing data</p>
            )
          }
        />
      </Routes>
    </div>
    </>
  );
}

