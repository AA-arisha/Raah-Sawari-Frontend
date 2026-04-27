import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const OFFERS = [
  { id: 1, passenger: "Ayesha Siddiqui", rating: 4.8, rides: 142, from: "N-5, Port Qasim Authority", to: "Gulshan-e-Kaneez Fatima Block 1", dist: "18 km", time: "48 min", fare: 969 },
  { id: 2, passenger: "Sara Malik", rating: 4.6, rides: 87, from: "Tariq Road, PECHS Block 2", to: "DHA Phase 6, Bukhari Commercial", dist: "12 km", time: "32 min", fare: 720 },
  { id: 3, passenger: "Nida Rehman", rating: 4.9, rides: 210, from: "Johar More, Gulistan-e-Johar", to: "Dolmen Mall Clifton", dist: "22 km", time: "58 min", fare: 1100 },
];

const EARNINGS = [3200, 4100, 2800, 5600, 3900, 4800, 4200];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const RATINGS_DATA = [
  { p: "Ayesha Siddiqui", stars: 5, comment: "Very punctual and safe driver!", time: "2h ago" },
  { p: "Sara Malik", stars: 4, comment: "Good ride, clean rickshaw.", time: "Yesterday" },
  { p: "Hina Baig", stars: 5, comment: "Felt very safe, will book again!", time: "2 days ago" },
  { p: "Noor Fatima", stars: 3, comment: "Slightly late but very polite.", time: "3 days ago" },
  { p: "Zara Ahmed", stars: 5, comment: "Best rickshaw in Karachi!", time: "4 days ago" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function Stars({ count, size = 11 }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= count ? "#e05c7a" : "#333", fontSize: size }}>★</span>
      ))}
    </span>
  );
}

function Avatar({ name, size = 44 }) {
  const initials = name.split(" ").map((x) => x[0]).join("");
  return (
    <div
      style={{ width: size, height: size, minWidth: size, borderRadius: "50%", background: "linear-gradient(135deg,#e05c7a,#9a3050)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.32, fontWeight: 700, color: "#fff" }}
    >
      {initials}
    </div>
  );
}

// ─── MAP ─────────────────────────────────────────────────────────────────────
function MapArea({ screen, activeOffer }) {
  const labels = {
    dashboard: "Karachi — Live Map",
    heading: "Heading to pickup",
    arrived: "At pickup location",
    inprogress: "En route to destination",
    complete: "Ride complete",
  };

  return (
    <div style={{ flex: 1, position: "relative", background: "#1a1a1a", overflow: "hidden" }}>
      {/* SVG grid map */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#1a1a1a" />
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#222" strokeWidth="0.8" />
          </pattern>
          <pattern id="gridBig" width="200" height="200" patternUnits="userSpaceOnUse">
            <rect width="200" height="200" fill="url(#grid)" />
            <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#282828" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="800" height="600" fill="url(#gridBig)" />
        <line x1="0" y1="250" x2="800" y2="250" stroke="#282828" strokeWidth="12" />
        <line x1="0" y1="250" x2="800" y2="250" stroke="#333" strokeWidth="1" strokeDasharray="20,14" />
        <line x1="260" y1="0" x2="260" y2="600" stroke="#252525" strokeWidth="10" />
        <line x1="560" y1="0" x2="560" y2="600" stroke="#222" strokeWidth="8" />
        <line x1="0" y1="420" x2="800" y2="420" stroke="#222" strokeWidth="6" />
        <line x1="0" y1="150" x2="800" y2="150" stroke="#202020" strokeWidth="5" />
        {[[40,40,120,80],[40,300,100,90],[310,30,160,90],[600,170,150,80],[380,300,130,80],[100,340,100,60],[610,40,120,90]].map(([x,y,w,h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="#1e1e1e" stroke="#262626" strokeWidth="0.5" />
        ))}
        {(screen === "heading" || screen === "inprogress") && (
          <line x1="38%" y1="58%" x2="65%" y2="32%" stroke="#e05c7a" strokeWidth="2" strokeDasharray="10,6" opacity=".4" />
        )}
      </svg>

      {/* Map label */}
      <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(26,26,26,.9)", border: "1px solid #2a2a2a", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 500, color: "#ccc", backdropFilter: "blur(8px)", zIndex: 10 }}>
        {labels[screen] || "Karachi — Live Map"}
      </div>

      {/* Pins */}
      {screen === "dashboard" && (
        <>
          <Pin label="You" emoji="📍" top="50%" left="42%" pulse />
          <div style={{ position: "absolute", top: "30%", left: "60%", width: 8, height: 8, borderRadius: "50%", background: "#e05c7a", opacity: 0.5 }} />
          <div style={{ position: "absolute", top: "65%", left: "30%", width: 7, height: 7, borderRadius: "50%", background: "#e05c7a", opacity: 0.4 }} />
        </>
      )}
      {screen === "heading" && activeOffer && (
        <>
          <Pin label="You" emoji="📍" top="58%" left="38%" />
          <Pin label={activeOffer.passenger.split(" ")[0]} emoji="📍" top="32%" left="65%" />
          <RickshawAnim top="48%" left="46%" />
        </>
      )}
      {screen === "arrived" && (
        <>
          <Pin label="Your location" emoji="📍" top="48%" left="50%" pulse />
          <RickshawAnim top="50%" left="48%" duration="4s" />
        </>
      )}
      {screen === "inprogress" && activeOffer && (
        <>
          <Pin label="Pickup" emoji="📍" top="65%" left="28%" />
          <Pin label="Destination" emoji="🏁" top="28%" left="70%" />
          <RickshawAnim top="50%" left="45%" />
        </>
      )}
      {screen === "complete" && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>🎉</div>
          <div style={{ background: "rgba(26,26,26,.9)", border: "1px solid #333", borderRadius: 12, padding: "10px 20px", marginTop: 8, fontSize: 14, fontWeight: 600, color: "#e05c7a" }}>Ride Complete!</div>
        </div>
      )}
    </div>
  );
}

function Pin({ label, emoji, top, left, pulse = false }) {
  return (
    <div style={{ position: "absolute", top, left, transform: "translate(-50%,-100%)", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "#fff", whiteSpace: "nowrap" }}>{label}</div>
      {pulse && <PulseRing />}
      <div style={{ fontSize: 20 }}>{emoji}</div>
    </div>
  );
}

function PulseRing() {
  return (
    <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(224,92,122,.5)", animation: "pulse 1.8s ease-out infinite" }} />
  );
}

function RickshawAnim({ top, left, duration = "3s" }) {
  return (
    <div style={{ position: "absolute", top, left, fontSize: 28, zIndex: 25, animation: `driveX ${duration} ease-in-out infinite alternate` }}>🛺</div>
  );
}

// ─── OFFER CARD ───────────────────────────────────────────────────────────────
function OfferCard({ offer, onAccept, onDecline }) {
  const [anim, setAnim] = useState(null);

  const handleDecline = () => {
    setAnim("slideLeft");
    setTimeout(() => onDecline(offer.id), 280);
  };
  const handleAccept = () => {
    setAnim("slideRight");
    setTimeout(() => onAccept(offer.id), 280);
  };

  return (
    <div style={{
      background: "#1a1a1a", border: "1px solid #252525", borderRadius: 12, padding: 12, cursor: "pointer",
      animation: anim === "slideLeft" ? "slideLeft .3s ease forwards" : anim === "slideRight" ? "slideRight .3s ease forwards" : "slideInOffer .3s ease both",
      transition: "border-color .2s"
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#e05c7a"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#252525"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{offer.passenger}</div>
          <div style={{ fontSize: 10, color: "#666", marginTop: 1 }}>
            <Stars count={Math.round(offer.rating)} size={10} /> {offer.rating} · {offer.rides} rides
          </div>
        </div>
        <div style={{ background: "rgba(224,92,122,.15)", color: "#e05c7a", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>PKR {offer.fare}</div>
      </div>
      <div style={{ fontSize: 11, color: "#666", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📍 {offer.from}</div>
      <div style={{ fontSize: 11, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🏁 {offer.to}</div>
      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <span style={{ color: "#666", fontSize: 11 }}>📏 {offer.dist}</span>
        <span style={{ color: "#666", fontSize: 11 }}>⏱ {offer.time}</span>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <button onClick={handleDecline} style={{ flex: 1, padding: 6, background: "rgba(255,59,48,.08)", border: "1px solid rgba(255,59,48,.2)", borderRadius: 8, color: "#ff3b30", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>✕ Decline</button>
        <button onClick={handleAccept} style={{ flex: 2, padding: 6, background: "#e05c7a", border: "none", borderRadius: 8, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>✓ Accept PKR {offer.fare}</button>
      </div>
    </div>
  );
}

// ─── SIDEBAR PANELS ──────────────────────────────────────────────────────────

function DashboardPanel({ online, setOnline }) {
  const weekTotal = EARNINGS.reduce((a, b) => a + b, 0);
  const maxE = Math.max(...EARNINGS);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16, scrollbarWidth: "none" }}>
      {/* Driver card */}
      <div style={{ background: "linear-gradient(135deg,#1e0e14,#2a1020)", border: "1px solid #3a1828", borderRadius: 16, padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Avatar name="Fatima Khan" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Fatima Khan</div>
            <div style={{ fontSize: 11, color: "#e05c7a", marginTop: 1 }}>★★★★★ 4.9 · 412 rides</div>
          </div>
          <Toggle on={online} onToggle={() => setOnline(!online)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 10 }}>
          {[["PKR 4,200", "Today"], [`PKR ${weekTotal.toLocaleString()}`, "This Week"], ["8", "Rides"]].map(([v, l]) => (
            <div key={l} style={{ background: "rgba(255,255,255,.04)", borderRadius: 10, padding: "10px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{v}</div>
              <div style={{ fontSize: 9, color: "#666", marginTop: 2, textTransform: "uppercase", letterSpacing: ".5px" }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "7px 10px", background: "rgba(255,255,255,.04)", borderRadius: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: online ? "#34c759" : "#555", flexShrink: 0, animation: online ? "glow 2s infinite" : "none" }} />
          <span style={{ fontSize: 11, color: online ? "#aaa" : "#555" }}>{online ? "Online — receiving offers" : "Tap toggle to go online"}</span>
        </div>
      </div>

      {/* Week chart */}
      <div style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 14, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>This week</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
          {EARNINGS.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", borderRadius: "4px 4px 0 0", background: i === 6 ? "#e05c7a" : "#2a2a2a", height: Math.round((v / maxE) * 52), transition: "height .4s" }} />
              <div style={{ fontSize: 9, color: "#555" }}>{DAYS[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {online && (
        <div style={{ background: "rgba(224,92,122,.08)", border: "1px solid rgba(224,92,122,.2)", borderRadius: 12, padding: 12, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e05c7a", flexShrink: 0, animation: "glow 1.5s infinite" }} />
          <div style={{ fontSize: 13, color: "#fff" }}>Offers will appear in top-right</div>
        </div>
      )}

      {/* Recent ratings */}
      <div style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 14, padding: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Recent ratings</div>
        {RATINGS_DATA.slice(0, 3).map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 0", borderBottom: i < 2 ? "1px solid #1e1e1e" : "none" }}>
            <Avatar name={r.p} size={30} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{r.p}</span>
                <Stars count={r.stars} size={10} />
                <span style={{ fontSize: 10, color: "#555", marginLeft: "auto" }}>{r.time}</span>
              </div>
              <div style={{ fontSize: 11, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.comment}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeadingPanel({ offer, onArrived, onCancel }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16, scrollbarWidth: "none" }}>
      <div style={{ background: "linear-gradient(135deg,#2a0e1a,#1e0010)", borderRadius: 14, padding: "14px 16px", marginBottom: 12, border: "1px solid #3a1020" }}>
        <div style={{ fontSize: 10, color: "#e05c7a", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Heading to passenger</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>~4 min away</div>
      </div>
      <div style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 14, padding: 14, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Avatar name={offer.passenger} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{offer.passenger}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}><Stars count={Math.round(offer.rating)} /> <span style={{ fontSize: 11, color: "#666" }}>{offer.rating}</span></div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#e05c7a" }}>PKR {offer.fare}</div>
        </div>
        <div style={{ background: "#111", borderRadius: 10, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 3 }}>📍 Pickup</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{offer.from}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            <span style={{ fontSize: 11, color: "#666" }}>📏 {offer.dist}</span>
            <span style={{ fontSize: 11, color: "#666" }}>⏱ {offer.time}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <ActionBtn>📞 Call</ActionBtn>
          <ActionBtn>💬 Message</ActionBtn>
        </div>
        <BigBtn onClick={onArrived} style={{ marginBottom: 8 }}>🏁 I Have Arrived</BigBtn>
        <BigBtn variant="danger" onClick={onCancel}>Cancel Ride</BigBtn>
      </div>
    </div>
  );
}

function ArrivedPanel({ offer, waitSecs, waitExtra, onStart }) {
  const secs = Math.max(0, waitSecs);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const pct = Math.max(0, Math.min(100, (secs / 300) * 100));
  const warn = secs < 60;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16, scrollbarWidth: "none" }}>
      <div style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 14, padding: 16, marginBottom: 10, textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Waiting for passenger</div>
        <div style={{ fontSize: 48, fontWeight: 700, color: warn ? "#ff9500" : "#fff" }}>{mm}:{ss}</div>
        <div style={{ height: 4, background: "#222", borderRadius: 2, marginTop: 12, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#e05c7a", borderRadius: 2, width: `${pct}%`, transition: "width 1s linear" }} />
        </div>
        {warn && <div style={{ fontSize: 11, color: "#ff9500", marginTop: 8 }}>⚠️ Free waiting time ending</div>}
        {waitExtra > 0 && (
          <div style={{ background: "rgba(255,149,0,.08)", border: "1px solid rgba(255,149,0,.2)", borderRadius: 10, padding: 10, marginTop: 8, fontSize: 12, color: "#ff9500" }}>
            ⏳ Extra waiting charge: PKR {waitExtra} (PKR 20/min after 5 min)
          </div>
        )}
      </div>
      <div style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 14, padding: 14, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Avatar name={offer.passenger} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{offer.passenger}</div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{offer.from}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <ActionBtn>📞 Call</ActionBtn>
          <ActionBtn>💬 Message</ActionBtn>
        </div>
      </div>
      <BigBtn onClick={onStart}>🚀 Start Ride</BigBtn>
    </div>
  );
}

function InProgressPanel({ offer, onEnd }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16, scrollbarWidth: "none" }}>
      <div style={{ background: "linear-gradient(135deg,#2a0e1a,#1e0010)", borderRadius: 14, padding: "14px 16px", marginBottom: 12, border: "1px solid #3a1020" }}>
        <div style={{ fontSize: 10, color: "#e05c7a", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Ride in progress</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginTop: 4 }}>→ {offer.to.length > 30 ? offer.to.substring(0, 30) + "…" : offer.to}</div>
        <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
          <span style={{ fontSize: 11, color: "#888" }}>📏 {offer.dist}</span>
          <span style={{ fontSize: 11, color: "#888" }}>⏱ {offer.time}</span>
          <span style={{ fontSize: 11, color: "#e05c7a" }}>💰 PKR {offer.fare}</span>
        </div>
      </div>
      <div style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 14, padding: 14, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={offer.passenger} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{offer.passenger}</div>
            <Stars count={Math.round(offer.rating)} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <ActionBtn style={{ width: 36, padding: 6, textAlign: "center" }}>📞</ActionBtn>
            <ActionBtn style={{ width: 36, padding: 6, textAlign: "center" }}>💬</ActionBtn>
          </div>
        </div>
      </div>
      <div style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 14, padding: 14, marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>📍 Picked up from</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 8 }}>{offer.from}</div>
        <div style={{ height: 1, background: "#1e1e1e", marginBottom: 8 }} />
        <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>🏁 Dropping to</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{offer.to}</div>
      </div>
      <BigBtn onClick={onEnd}>✅ End Ride</BigBtn>
    </div>
  );
}

function CompletePanel({ offer, waitExtra, onBack }) {
  const [stars, setStars] = useState(0);
  const total = offer.fare + waitExtra;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16, scrollbarWidth: "none" }}>
      <div style={{ background: "linear-gradient(135deg,#1e0e14,#2a1020)", borderRadius: 16, padding: 24, textAlign: "center", marginBottom: 12, border: "1px solid #3a1828" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{stars > 0 ? "🎉" : "✅"}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>Ride Complete!</div>
        <div style={{ fontSize: 34, fontWeight: 700, color: "#e05c7a", marginTop: 8 }}>PKR {total.toLocaleString()}</div>
        {waitExtra > 0 && <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>Includes PKR {waitExtra} waiting charge</div>}
        <div style={{ fontSize: 11, color: "#666", marginTop: 6 }}>After 20% platform fee: PKR {Math.round(total * 0.8).toLocaleString()}</div>
      </div>
      <div style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 14, padding: 14, marginBottom: 12, textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Rate your passenger</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} onClick={() => setStars(i)} style={{ fontSize: 26, cursor: "pointer", color: i <= stars ? "#e05c7a" : "#333", transition: "color .15s, transform .1s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >★</span>
          ))}
        </div>
        {stars > 0 && <div style={{ fontSize: 12, color: "#666" }}>{["", "Poor", "Fair", "Good", "Great", "Excellent!"][stars]}</div>}
      </div>
      <BigBtn onClick={onBack}>Back to Dashboard</BigBtn>
    </div>
  );
}

function EarningsPanel({ onBack }) {
  const gross = EARNINGS.reduce((a, b) => a + b, 0);
  const net = Math.round(gross * 0.8);
  const admin = Math.round(gross * 0.2);
  const maxE = Math.max(...EARNINGS);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16, scrollbarWidth: "none" }}>
      <div style={{ background: "linear-gradient(135deg,#1e0e14,#2a1020)", borderRadius: 14, padding: 18, marginBottom: 12, border: "1px solid #3a1828" }}>
        <div style={{ fontSize: 10, color: "#e05c7a", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Last 7 Days Earnings</div>
        <div style={{ fontSize: 34, fontWeight: 700, color: "#fff" }}>PKR {net.toLocaleString()}</div>
        <div style={{ fontSize: 11, color: "#e05c7a", marginTop: 2 }}>After 20% platform fee (PKR {admin.toLocaleString()} deducted)</div>
      </div>
      <div style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 14, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Daily breakdown</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 70, marginBottom: 4 }}>
          {EARNINGS.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 9, color: "#666", marginBottom: 2 }}>{Math.round(v * 0.8 / 1000).toFixed(1)}k</div>
              <div style={{ width: "100%", borderRadius: "4px 4px 0 0", background: i === 6 ? "#e05c7a" : "#2a2a2a", height: Math.round((v / maxE) * 50) }} />
              <div style={{ fontSize: 9, color: "#555" }}>{DAYS[i]}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>Pink = today. All values after 20% deduction.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[
          ["38", "Completed Rides", "↑ 4 vs last week", "#e05c7a"],
          ["3", "Cancelled Rides", "↓ 1 vs last week", "#ff3b30"],
          [`PKR ${Math.round(net / 38).toLocaleString()}`, "Avg per Ride", "After deduction", "#e05c7a"],
          [`PKR ${admin.toLocaleString()}`, "Platform Fee", "20% to RaahSawri", "#666"],
        ].map(([v, l, note, nc]) => (
          <div key={l} style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{v}</div>
            <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{l}</div>
            <div style={{ fontSize: 10, color: nc, marginTop: 3 }}>{note}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(255,149,0,.06)", border: "1px solid rgba(255,149,0,.2)", borderRadius: 12, padding: 12, fontSize: 12, color: "#ff9500", lineHeight: 1.5 }}>
        ⚠️ Gross: PKR {gross.toLocaleString()} — Platform keeps 20% (PKR {admin.toLocaleString()}). Your payout: PKR {net.toLocaleString()}.
      </div>
    </div>
  );
}

function RatingsPanel({ onBack }) {
  const avg = (RATINGS_DATA.reduce((s, r) => s + r.stars, 0) / RATINGS_DATA.length).toFixed(1);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16, scrollbarWidth: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: 8, background: "#1a1a1a", border: "1px solid #252525", color: "#aaa", fontSize: 14, cursor: "pointer" }}>←</button>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>All Ratings</div>
        <div style={{ marginLeft: "auto", fontSize: 22, fontWeight: 700, color: "#e05c7a" }}>{avg} ★</div>
      </div>
      {RATINGS_DATA.map((r, i) => (
        <div key={i} style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 12, padding: 12, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Avatar name={r.p} size={32} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{r.p}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 1 }}>
                <Stars count={r.stars} size={11} />
                <span style={{ fontSize: 10, color: "#555" }}>{r.time}</span>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#aaa", fontStyle: "italic", lineHeight: 1.4 }}>"{r.comment}"</div>
        </div>
      ))}
    </div>
  );
}

function ProfilePanel() {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16, scrollbarWidth: "none" }}>
      <div style={{ background: "linear-gradient(135deg,#1e0e14,#2a1020)", borderRadius: 16, padding: 20, marginBottom: 12, border: "1px solid #3a1828", textAlign: "center" }}>
        <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg,#e05c7a,#9a3050)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 auto 12px" }}>FK</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Fatima Khan</div>
        <div style={{ fontSize: 13, color: "#e05c7a", marginTop: 4 }}>★★★★★ 4.9 rating</div>
        <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>Member since Jan 2023</div>
      </div>
      {[
        ["Driver Information", [["Full Name","Fatima Khan"],["Phone","+92 300 1234567"],["CNIC","42101-1234567-8"],["License No.","SB-2020-12345"]]],
        ["Vehicle Details", [["Vehicle Type","Rickshaw (Auto)"],["Make / Model","Suzhou Eagle Bajaj"],["Vehicle No.","KHI-R 2021-456"],["Year","2021"],["Color","Yellow"]]],
        ["Stats", [["Total Rides","412"],["Completed","401"],["Cancelled","11"],["Acceptance Rate","94%"]]],
      ].map(([title, rows]) => (
        <div key={title} style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>{title}</div>
          {rows.map(([l, v], i) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < rows.length - 1 ? "1px solid #1e1e1e" : "none" }}>
              <span style={{ fontSize: 12, color: "#666" }}>{l}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{v}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} style={{ width: 48, height: 26, borderRadius: 13, background: on ? "#e05c7a" : "#333", cursor: "pointer", position: "relative", border: "none", transition: "background .3s", flexShrink: 0 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 25 : 3, transition: "left .3s", boxShadow: "0 1px 4px rgba(0,0,0,.3)" }} />
    </button>
  );
}

function BigBtn({ children, onClick, variant = "primary", style: extra = {} }) {
  const styles = {
    primary: { background: "#e05c7a", color: "#fff", boxShadow: "0 4px 20px rgba(224,92,122,.25)", border: "none" },
    danger: { background: "rgba(255,59,48,.1)", border: "1px solid rgba(255,59,48,.25)", color: "#ff3b30" },
    secondary: { background: "rgba(255,255,255,.05)", border: "1px solid #2a2a2a", color: "#aaa" },
  };
  return (
    <button onClick={onClick} style={{ width: "100%", padding: 14, borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", marginBottom: 8, ...styles[variant], ...extra }}>
      {children}
    </button>
  );
}

function ActionBtn({ children, style: extra = {} }) {
  return (
    <button style={{ flex: 1, padding: 10, background: "#111", border: "1px solid #252525", borderRadius: 10, color: "#aaa", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", ...extra }}>
      {children}
    </button>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function DriverApp() {
  const [page, setPage] = useState("dashboard");
  const [online, setOnlineState] = useState(false);
  const [screen, setScreen] = useState("dashboard");
  const [activeOffer, setActiveOffer] = useState(null);
  const [pendingOffers, setPendingOffers] = useState([]);
  const [waitSecs, setWaitSecs] = useState(300);
  const [waitExtra, setWaitExtra] = useState(0);

  const offerIdxRef = useRef(0);
  const dripRef = useRef(null);
  const waitRef = useRef(null);

  const setOnline = useCallback((v) => {
    setOnlineState(v);
    if (!v) {
      clearInterval(dripRef.current);
      setPendingOffers([]);
    } else {
      offerIdxRef.current = 0;
      const push = () => {
        if (offerIdxRef.current < OFFERS.length) {
          const o = OFFERS[offerIdxRef.current++];
          setPendingOffers(prev => prev.find(x => x.id === o.id) ? prev : [...prev, o]);
        }
      };
      push();
      dripRef.current = setInterval(push, 12000);
    }
  }, []);

  const acceptOffer = (id) => {
    const o = pendingOffers.find(x => x.id === id);
    if (!o) return;
    setActiveOffer(o);
    setPendingOffers([]);
    clearInterval(dripRef.current);
    setScreen("heading");
    setPage("dashboard");
  };

  const declineOffer = (id) => {
    setPendingOffers(prev => prev.filter(x => x.id !== id));
  };

  const arrived = () => {
    setScreen("arrived");
    setWaitSecs(300);
    setWaitExtra(0);
    clearInterval(waitRef.current);
    waitRef.current = setInterval(() => {
      setWaitSecs(prev => {
        if (prev <= 0) { setWaitExtra(e => e + 20); return prev; }
        return prev - 1;
      });
    }, 1000);
  };

  const startRide = () => {
    clearInterval(waitRef.current);
    setScreen("inprogress");
  };

  const endRide = () => setScreen("complete");

  const cancelRide = () => {
    clearInterval(waitRef.current);
    setScreen("dashboard");
    setActiveOffer(null);
    setWaitExtra(0);
    setOnline(true);
  };

  const backToDash = () => {
    setScreen("dashboard");
    setActiveOffer(null);
    setWaitExtra(0);
    offerIdxRef.current = 0;
    if (online) setOnline(true);
    setPage("dashboard");
  };

  useEffect(() => () => { clearInterval(dripRef.current); clearInterval(waitRef.current); }, []);

  const showOffers = online && screen === "dashboard" && pendingOffers.length > 0 && page === "dashboard";

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "earnings", label: "Earnings" },
    { id: "ratings", label: "Ratings" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <>
      <style>{`
        @keyframes glow { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes pulse { 0%{transform:translateX(-50%) scale(1);opacity:.7} 100%{transform:translateX(-50%) scale(3);opacity:0} }
        @keyframes driveX { from{transform:translateX(0) rotate(-3deg)} to{transform:translateX(18px) rotate(3deg)} }
        @keyframes slideInOffer { from{transform:translateX(60px);opacity:0} to{transform:none;opacity:1} }
        @keyframes slideLeft { to{transform:translateX(-100%);opacity:0} }
        @keyframes slideRight { to{transform:translateX(100%);opacity:0} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f0f0f; font-family: 'Inter', sans-serif; }
      `}</style>

      <div style={{ width: "100%", height: "100vh", minHeight: 600, display: "flex", flexDirection: "column", background: "#0f0f0f", fontFamily: "'Inter', sans-serif", overflow: "hidden" }}>

        {/* TOPBAR */}
        <div style={{ height: 52, background: "#1a1a1a", borderBottom: "1px solid #2a2a2a", display: "flex", alignItems: "center", padding: "0 20px", gap: 12, flexShrink: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>Raah<span style={{ color: "#e05c7a" }}>Sawri</span></div>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: 1 }}>DRIVER</div>
          <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
            {navItems.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
                padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "inherit", transition: "all .15s",
                background: page === n.id ? "rgba(224,92,122,.15)" : "transparent",
                color: page === n.id ? "#e05c7a" : "#888"
              }}>{n.label}</button>
            ))}
          </div>
          {/* Status pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500,
            background: online ? "rgba(52,199,89,.12)" : "rgba(255,255,255,.05)",
            color: online ? "#34c759" : "#666",
            border: online ? "1px solid rgba(52,199,89,.2)" : "1px solid #2a2a2a"
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: online ? "#34c759" : "#555", animation: online ? "glow 2s infinite" : "none" }} />
            {online ? "Online" : "Offline"}
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          {/* SIDEBAR */}
          <div style={{ width: 320, flexShrink: 0, background: "#111", borderRight: "1px solid #1e1e1e", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {page === "earnings" && <EarningsPanel onBack={() => setPage("dashboard")} />}
            {page === "ratings" && <RatingsPanel onBack={() => setPage("dashboard")} />}
            {page === "profile" && <ProfilePanel />}
            {page === "dashboard" && (
              <>
                {screen === "dashboard" && <DashboardPanel online={online} setOnline={setOnline} />}
                {screen === "heading" && activeOffer && <HeadingPanel offer={activeOffer} onArrived={arrived} onCancel={cancelRide} />}
                {screen === "arrived" && activeOffer && <ArrivedPanel offer={activeOffer} waitSecs={waitSecs} waitExtra={waitExtra} onStart={startRide} />}
                {screen === "inprogress" && activeOffer && <InProgressPanel offer={activeOffer} onEnd={endRide} />}
                {screen === "complete" && activeOffer && <CompletePanel offer={activeOffer} waitExtra={waitExtra} onBack={backToDash} />}
              </>
            )}
          </div>

          {/* MAP */}
          <MapArea screen={screen} activeOffer={activeOffer} />
        </div>

        {/* OFFER TRAY OVERLAY */}
        {showOffers && (
          <div style={{ position: "fixed", top: 52, right: 0, width: 340, padding: 12, display: "flex", flexDirection: "column", gap: 8, zIndex: 500, maxHeight: "calc(100vh - 52px)", overflowY: "auto" }}>
            {pendingOffers.map(o => (
              <OfferCard key={o.id} offer={o} onAccept={acceptOffer} onDecline={declineOffer} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
