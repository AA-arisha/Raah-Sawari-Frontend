import { useState, useEffect } from "react";
import { tokens } from "../components/rider/components/styles";
import {getMe} from "../api/me.api.js"
import api from "../api/axiosClient.js"

const MOCK_RIDE = {
  rider: "Isabelle Chen",
  pickup: "1 Harbour Grand Kowloon, 20 Tak Fung St",
  dropoff: "Hong Kong International Airport, T1",
  fare: "HK$248",
  status: "In Progress",
};

export default function DriverDashboard() {
  const [user, setUser] = useState(null);
 const [available, setAvailable] = useState(
    user?.driver?.isAvailable || false
  );
  const [ride, setRide] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const data = await getMe();

      setUser(data);

      // sync backend availability
      if (data.driver) {
        setAvailable(data.driver.isAvailable);
      }

    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  fetchUser();
}, []);


  const driverStatus = ride ? "on-ride" : available ? "online" : "offline";

  const statusLabel = {
    "online": "Available",
    "offline": "Offline",
    "on-ride": "On Ride",
  }[driverStatus];

 const handleToggle = async () => {
  if (ride) return;

  const next = !available;

  try {
    await api.patch("/driver/availability", {
      isAvailable: next,
    });

    setAvailable(next);

    if (next) {
      showToast("You're now available for rides");

      setTimeout(() => {
        setRide(MOCK_RIDE);
        showToast("New ride assigned!");
      }, 2800);

    } else {
      showToast("You're now offline");
    }

  } catch (error) {
    console.error(error);

    showToast("Failed to update availability");
  }
};

  const handleComplete = () => {
    if (completing) return;
    setCompleting(true);
    setTimeout(() => {
      setRide(null);
      setCompleting(false);
      showToast("Ride completed — great work ✦");
    }, 700);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setToast(true);
    setTimeout(() => setToast(false), 2800);
  };

   if (!user) {
    return <h2>Loading...</h2>;
  }
  console.log(user);
  return (
    <>
      <style>{tokens}</style>
      <div className="app-bg">
        <div className="dashboard">
          {/* Profile Card */}
          <div className="glass-card profile-card anim-in" style={{ animationDelay: "0s" }}>
            <div className="avatar-ring">
              <div className="avatar">
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>
            <div className="profile-info">
              <div className="driver-name">{user.name}</div>
              <div className="vehicle-label">
                {user.driver?.vehicleType
                  ?.toLowerCase()
                  .replace("_", " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </div>
              <div className={`status-badge status-${driverStatus}`}>
                <span className="status-dot" />
                {statusLabel}
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="glass-card anim-in" style={{ animationDelay: "0.08s" }}>
            <div className="section-label">Availability</div>
            <div className="toggle-row">
              <div className="toggle-copy">
                <h3>{available || ride ? "Available" : "Not Available"}</h3>
                <p>{ride ? "You're on an active ride" : available ? "You're ready to receive rides" : "Toggle on to start receiving requests"}</p>
              </div>
              <div
                className={`toggle-switch${available || ride ? " active" : ""}`}
                onClick={handleToggle}
                role="switch"
                aria-checked={available}
                tabIndex={0}
                onKeyDown={(e) => e.key === " " && handleToggle()}
              >
                <div className="toggle-track" />
                <div className="toggle-thumb" />
              </div>
            </div>
          </div>

          {/* Active Ride Panel */}
          {ride && (
            <div className="glass-card ride-card anim-in" style={{ animationDelay: "0s" }}>
              <div className="ride-header">
                <div>
                  <div className="section-label">Active Ride</div>
                  <div className="ride-title">Current Trip</div>
                </div>
                <div className="fare-badge">
                  <span className="fare-amount">{ride.fare}</span>
                  <span className="fare-label">Est. Fare</span>
                </div>
              </div>

              <div className="route-line">
                <div className="route-stop">
                  <div className="route-icon-col">
                    <div className="route-dot route-dot-pickup" />
                    <div className="route-connector" />
                  </div>
                  <div>
                    <div className="route-text-label">Pickup</div>
                    <div className="route-address">{ride.pickup}</div>
                  </div>
                </div>
                <div className="route-stop">
                  <div className="route-icon-col">
                    <div className="route-dot route-dot-dropoff" />
                  </div>
                  <div>
                    <div className="route-text-label">Drop-off</div>
                    <div className="route-address" style={{ paddingBottom: 0 }}>{ride.dropoff}</div>
                  </div>
                </div>
              </div>

              <div className="rider-row">
                <div className="rider-avatar">
                  {ride.rider.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="rider-name">{ride.rider}</div>
                  <div className="rider-sub">Rider · 4.98 ★</div>
                </div>
                <div className="ride-status-pill">{ride.status}</div>
              </div>
            </div>
          )}

          {/* Ride Completed CTA */}
          {ride && (
            <div className="anim-in" style={{ animationDelay: "0.06s" }}>
              <button
                className={`btn-complete${completing ? " completing" : ""}`}
                onClick={handleComplete}
                disabled={completing}
              >
                {completing ? "Completing Ride…" : "✦  Mark Ride as Completed"}
              </button>
            </div>
          )}

          {/* Idle State */}
          {!ride && !available && (
            <div className="glass-card anim-in" style={{ animationDelay: "0.16s" }}>
              <div className="idle-state">
                <div className="idle-illustration">◎</div>
                <div className="idle-title">Ready when you are</div>
                <div className="idle-sub">Toggle availability above to start<br />receiving ride requests.</div>
              </div>
            </div>
          )}

          {/* Waiting for ride */}
          {!ride && available && (
            <div className="glass-card anim-in" style={{ animationDelay: "0.1s" }}>
              <div className="idle-state">
                <div className="idle-illustration" style={{ animation: "pulse-dot 2s infinite" }}>◈</div>
                <div className="idle-title">Looking for rides nearby…</div>
                <div className="idle-sub">You'll be notified when a rider<br />matches your location.</div>
              </div>
            </div>
          )}

        </div>

        <div className={`toast${toast ? " show" : ""}`}>{toastMsg}</div>
      </div>
    </>
  );
}