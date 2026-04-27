// App.jsx
import { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";

export default function AuthApp() {
  const [view, setView] = useState("login");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        background:
          "linear-gradient(135deg, #F9E4E8 0%, #F4CDD8 20%, #FAE4EE 50%, #FDF6F0 80%, #FFF8F2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background radial blobs */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "12%",
          width: "280px",
          height: "280px",
          background:
            "radial-gradient(circle, rgba(232,160,176,0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: "220px",
          height: "220px",
          background:
            "radial-gradient(circle, rgba(224,123,138,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "15%",
          width: "160px",
          height: "160px",
          background:
            "radial-gradient(circle, rgba(253,246,240,0.5) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Auth card area */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {view === "login" ? (
          <Login onSwitch={() => setView("register")} />
        ) : (
          <Register onSwitch={() => setView("login")} />
        )}
      </div>
    </div>
  );
}
