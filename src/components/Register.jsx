// Register.jsx
import { useState } from "react";
import { AuthCard, InputField, Button, FileUploadField } from "../ui/AuthUI";
import { registerUser } from "../api/auth.api";
import { validateRegisterForm, showValidationErrors, validateDriverFiles } from "../utils/validation";
import { uploadToCloudinary } from "../utils/cloudinary"; // ✅ FIX #4
import toast from "react-hot-toast"; // ✅ FIX #5

const colors = {
  mauve: "#9D5A6C",
  rose: "#E8A0B0",
  coral: "#E07B8A",
  dark: "#3D1F2A",
  border: "rgba(232,160,176,0.4)",
};

function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
      <div style={{ flex: 1, height: "1px", background: "rgba(232,160,176,0.35)" }} />
      <span style={{ fontSize: "12px", color: "rgba(61,31,42,0.4)", fontFamily: "DM Sans, sans-serif", fontWeight: "500" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "rgba(232,160,176,0.35)" }} />
    </div>
  );
}

function RoleChip({ label, selected, onClick, icon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, padding: "14px 12px",
        background: selected ? "rgba(157,90,108,0.12)" : "rgba(255,255,255,0.4)",
        border: `1.5px solid ${selected ? colors.mauve : colors.border}`,
        borderRadius: "12px", cursor: "pointer",
        transition: "all 0.2s ease", textAlign: "center",
        boxShadow: selected ? "0 0 0 4px rgba(157,90,108,0.1)" : "none",
        transform: hovered && !selected ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      <div style={{ fontSize: "20px", marginBottom: "4px" }}>{icon}</div>
      <div style={{
        fontSize: "13px", fontWeight: selected ? "600" : "500",
        color: selected ? colors.mauve : colors.dark,
        fontFamily: "DM Sans, sans-serif", letterSpacing: "0.01em",
      }}>
        {label}
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label style={{
        display: "block", fontSize: "11px", fontWeight: "600",
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: colors.mauve, marginBottom: "6px", fontFamily: "DM Sans, sans-serif",
      }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "12px 16px",
          background: focused ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.5)",
          border: `1.5px solid ${focused ? colors.rose : colors.border}`,
          borderRadius: "12px", fontSize: "15px",
          fontFamily: "DM Sans, sans-serif",
          color: value ? colors.dark : "rgba(61,31,42,0.45)",
          outline: "none", transition: "all 0.2s ease", cursor: "pointer",
          backdropFilter: "blur(8px)",
          boxShadow: focused ? "0 0 0 4px rgba(232,160,176,0.2)" : "none",
          appearance: "none", boxSizing: "border-box",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p style={{ fontSize: "12px", color: colors.coral, marginTop: "4px", fontFamily: "DM Sans, sans-serif" }}>{error}</p>}
    </div>
  );
}

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    vehicleType: "",
    vehicleModel: "",
    vehicleNumber: "",
    vehicleColor: "",
    cnicFront: null,   // File object until submission, then replaced with Cloudinary URL
    license: null,     // File object until submission, then replaced with Cloudinary URL
    // ✅ FIX #3: cnicBack removed entirely
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  // ✅ FIX #4: Track individual file upload states for UI feedback
  const [uploading, setUploading] = useState({ cnicFront: false, license: false });

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleRegister = async () => {
    // Step 1: Validate all text fields
    const validationErrors = validateRegisterForm(form);

    // Step 2: Validate driver file presence and format
    if (form.role === "driver") {
      const fileErrors = validateDriverFiles(form);
      Object.assign(validationErrors, fileErrors);
    }

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      showValidationErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      let cnicFrontUrl = null;
      let licenseUrl = null;

      // ✅ FIX #4: Upload files to Cloudinary before sending to backend
      if (form.role === "driver") {
        toast.loading("Uploading documents…", { id: "upload" });

        setUploading({ cnicFront: true, license: false });
        cnicFrontUrl = await uploadToCloudinary(form.cnicFront, "raah-sawri/cnic");

        setUploading({ cnicFront: false, license: true });
        licenseUrl = await uploadToCloudinary(form.license, "raah-sawri/license");

        setUploading({ cnicFront: false, license: false });
        toast.dismiss("upload");
      }

      // Step 3: Build payload with URL strings (not File objects)
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role.toUpperCase(), // ✅ FIX #2: send uppercase to match Joi enum + DB enum
        ...(form.role === "driver" && {
          vehicleType: form.vehicleType,
          vehicleModel: form.vehicleModel,
          vehicleNumber: form.vehicleNumber,
          vehicleColor: form.vehicleColor,
          cnicFront: cnicFrontUrl,   // ✅ FIX #4: Cloudinary URL string
          license: licenseUrl,       // ✅ FIX #4: Cloudinary URL string
        }),
      };

      await registerUser(payload);

      // ✅ FIX #6: Post-registration flow based on role
      if (form.role === "driver") {
        // Driver needs admin approval — show pending message, stay on auth screen
        toast.success(
          "Application submitted! Your account is pending admin approval. You'll be notified once verified.",
          { duration: 6000 }
        );
        // Reset form but stay on register (or you could switch to login)
        setForm({
          name: "", email: "", password: "", role: "",
          vehicleType: "", vehicleModel: "", vehicleNumber: "", vehicleColor: "",
          cnicFront: null, license: null,
        });
      } else {
        // Rider: isVerified=true, redirect to login to sign in
        toast.success("Account created! Please sign in.", { duration: 4000 });
        onSwitch(); // ✅ FIX #6: switch to login view
      }
    } catch (err) {
      setUploading({ cnicFront: false, license: false });
      toast.dismiss("upload");
      const message = err.response?.data?.message || err.response?.data?.error || err.message || "Registration failed";
      setErrors({ form: message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create Account">
      <InputField label="Full Name" value={form.name} onChange={set("name")} placeholder="Your full name" error={errors.name} />
      <InputField label="Email" value={form.email} onChange={set("email")} placeholder="hello@example.com" error={errors.email} />
      <InputField label="Password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" error={errors.password} />

      {/* Role selection */}
      <div style={{ marginBottom: "1.1rem" }}>
        <label style={{
          display: "block", fontSize: "11px", fontWeight: "600",
          letterSpacing: "0.08em", textTransform: "uppercase",
          color: colors.mauve, marginBottom: "8px", fontFamily: "DM Sans, sans-serif",
        }}>
          I am a
        </label>
        <div style={{ display: "flex", gap: "10px" }}>
          <RoleChip label="Rider" icon="🌸" selected={form.role === "rider"} onClick={() => set("role")("rider")} />
          <RoleChip label="Driver" icon="🚗" selected={form.role === "driver"} onClick={() => set("role")("driver")} />
        </div>
        {errors.role && (
          <p style={{ fontSize: "12px", color: colors.coral, marginTop: "5px", fontFamily: "DM Sans, sans-serif" }}>
            {errors.role}
          </p>
        )}
      </div>

      {/* Driver-only fields */}
      {form.role === "driver" && (
        <div style={{
          background: "rgba(249,228,232,0.3)",
          border: `1px dashed ${colors.rose}`,
          borderRadius: "12px", padding: "14px", marginBottom: "1.1rem",
        }}>
          <SelectField
            label="Vehicle Type"
            value={form.vehicleType}
            onChange={set("vehicleType")}
            error={errors.vehicleType}
            options={[
              { value: "", label: "Select vehicle type" },
              { value: "car", label: "Car" },
              { value: "bike", label: "Bike" },
            ]}
          />
          <InputField label="Vehicle Model" value={form.vehicleModel} onChange={set("vehicleModel")} error={errors.vehicleModel} placeholder="e.g. Toyota Corolla" />
          <InputField label="Vehicle Number Plate" value={form.vehicleNumber} onChange={set("vehicleNumber")} error={errors.vehicleNumber} placeholder="e.g. LEA-1234" />
          <InputField label="Vehicle Color" value={form.vehicleColor} onChange={set("vehicleColor")} error={errors.vehicleColor} placeholder="e.g. White" />

          {/* ✅ FIX #4: FileUploadField with uploading state + preview */}
          <FileUploadField
            label="CNIC Front Image"
            value={form.cnicFront}
            onChange={set("cnicFront")}
            error={errors.cnicFront}
            uploading={uploading.cnicFront}
          />
          {/* ✅ FIX #3: cnicBack removed entirely */}
          <FileUploadField
            label="Driving License"
            value={form.license}
            onChange={set("license")}
            error={errors.license}
            uploading={uploading.license}
          />
        </div>
      )}

      {errors.form && (
        <p style={{ fontSize: "13px", color: colors.coral, marginBottom: "12px", fontFamily: "DM Sans, sans-serif", textAlign: "center" }}>
          {errors.form}
        </p>
      )}

      <Button onClick={handleRegister} disabled={loading}>
        {loading ? (form.role === "driver" ? "Uploading & Registering…" : "Creating account…") : "Create Account"}
      </Button>

      <Divider label="or" />

      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: "13px", color: "rgba(61,31,42,0.55)", fontFamily: "DM Sans, sans-serif" }}>
          Already have an account?{" "}
        </span>
        <span
          onClick={onSwitch}
          style={{ fontSize: "13px", color: colors.mauve, fontWeight: "600", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
        >
          Sign in
        </span>
      </div>
    </AuthCard>
  );
}
