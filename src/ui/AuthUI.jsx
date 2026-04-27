// AuthUI.jsx
import { useState } from "react";

const colors = {
  mauve: "#9D5A6C",
  coral: "#E07B8A",
  rose: "#E8A0B0",
  dark: "#3D1F2A",
  cream: "#FFF8F5",       // ✅ FIX #6: added missing cream color for Button text
  border: "rgba(232,160,176,0.4)",
};

export function Button({ children, onClick, variant = "primary", fullWidth = true, disabled = false }) {
  const [hovered, setHovered] = useState(false);
  const isPrimary = variant === "primary";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: "13px 24px",
        background: isPrimary
          ? disabled ? "rgba(157,90,108,0.5)" : hovered ? "#8A4D5F" : colors.mauve
          : "transparent",
        border: `1.5px solid ${isPrimary ? "transparent" : colors.mauve}`,
        borderRadius: "12px",
        fontSize: "15px",
        fontWeight: "600",
        fontFamily: "DM Sans, sans-serif",
        letterSpacing: "0.02em",
        color: isPrimary ? colors.cream : colors.mauve, // ✅ FIX #6: cream is now defined
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        boxShadow:
          isPrimary && hovered && !disabled
            ? "0 8px 24px rgba(157,90,108,0.3)"
            : isPrimary
            ? "0 4px 16px rgba(157,90,108,0.2)"
            : "none",
        transform: hovered && !disabled ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      {children}
    </button>
  );
}

export function InputField({ label, type = "text", value, onChange, placeholder, error }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label
        style={{
          display: "block",
          fontSize: "11px",
          fontWeight: "600",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: colors.mauve,
          marginBottom: "6px",
          fontFamily: "DM Sans, sans-serif",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: focused ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.5)",
          border: `1.5px solid ${focused ? colors.rose : colors.border}`,
          borderRadius: "12px",
          fontSize: "15px",
          fontFamily: "DM Sans, sans-serif",
          color: colors.dark,
          outline: "none",
          transition: "all 0.2s ease",
          backdropFilter: "blur(8px)",
          boxShadow: focused ? "0 0 0 4px rgba(232,160,176,0.2)" : "none",
          boxSizing: "border-box",
        }}
      />
      {error && (
        <p style={{ fontSize: "12px", color: colors.coral, marginTop: "4px", fontFamily: "DM Sans, sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function AuthCard({ children, title }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "24px",
        border: "1px solid rgba(232,160,176,0.35)",
        boxShadow: "0 8px 40px rgba(157,90,108,0.12), 0 2px 12px rgba(232,160,176,0.15)",
        padding: "36px 32px",
        width: "100%",
        maxWidth: "400px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative radial accents */}
      <div
        style={{
          position: "absolute", top: "-30px", right: "-30px",
          width: "120px", height: "120px",
          background: "radial-gradient(circle, rgba(232,160,176,0.18) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute", bottom: "-20px", left: "-20px",
          width: "80px", height: "80px",
          background: "radial-gradient(circle, rgba(249,228,232,0.3) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "28px", position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: "6px" }}>
          <div
            style={{
              width: "36px", height: "36px",
              background: "linear-gradient(135deg,#D4728A,#8C4A5C)",
              borderRadius: "12px", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "18px",
              boxShadow: "0 4px 12px rgba(157,90,108,0.28)",
            }}
          >
            🛺
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.2 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#3D1F2A" }}>
              Raah Sawri
            </span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: "#C0809A", fontStyle: "italic" }}>
              راہ سواری
            </span>
          </div>
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "22px", fontWeight: "700",
            color: colors.dark, marginBottom: "4px", letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
      </div>

      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}

// ✅ FIX #4: FileUploadField now shows upload progress and image preview
// The file is stored as a File object in parent state until form submission,
// where it gets uploaded to Cloudinary. Preview is shown via URL.createObjectURL.
export function FileUploadField({ label, value, onChange, error, accept = "image/*", uploading = false }) {
  const previewUrl = value instanceof File ? URL.createObjectURL(value) : value;

  return (
    <div style={{ marginBottom: "12px" }}>
      <label
        style={{
          display: "block", marginBottom: "6px",
          fontSize: "11px", fontWeight: "600",
          letterSpacing: "0.08em", textTransform: "uppercase",
          color: colors.mauve, fontFamily: "DM Sans, sans-serif",
        }}
      >
        {label}
      </label>

      <div
        style={{
          border: `1px solid ${error ? colors.coral : colors.border}`,
          borderRadius: "10px", padding: "10px",
          background: "rgba(255,255,255,0.6)",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", cursor: "pointer",
          transition: "border-color 0.2s",
        }}
        onClick={() => document.getElementById(`file-${label}`)?.click()}
      >
        <input
          id={`file-${label}`}
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => onChange(e.target.files[0] || null)}
        />

        <span style={{ fontSize: "13px", color: "#7A4A5A", fontFamily: "DM Sans, sans-serif" }}>
          {uploading ? "Uploading…" : value ? (value instanceof File ? value.name : "Uploaded ✓") : "Choose file"}
        </span>

        <span
          style={{
            fontSize: "12px",
            background: uploading ? "rgba(157,90,108,0.15)" : "#F3C6D2",
            padding: "4px 10px", borderRadius: "6px", color: "#5A2E3A",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          {uploading ? "…" : "Browse"}
        </span>
      </div>

      {/* Image preview — shown when a file is selected */}
      {previewUrl && !uploading && (
        <div style={{ marginTop: "8px" }}>
          <img
            src={previewUrl}
            alt={label}
            style={{
              width: "100%", maxHeight: "120px",
              objectFit: "cover", borderRadius: "8px",
              border: `1px solid ${colors.border}`,
            }}
          />
        </div>
      )}

      {error && (
        <p style={{ fontSize: "12px", color: colors.coral, marginTop: "4px", fontFamily: "DM Sans, sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}
