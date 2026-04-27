// Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ FIX #6: role-based navigation
import { AuthCard, InputField, Button } from "../ui/AuthUI";
import { loginUser } from "../api/auth.api";
import { validateLoginForm, showValidationErrors } from "../utils/validation";
import { showError , showSuccess } from "../utils/toast";

const colors = { mauve: "#9D5A6C", rose: "#E8A0B0", dark: "#3D1F2A" };

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

// ✅ FIX #6: Maps role (uppercase from backend) to route path
const ROLE_ROUTES = {
  RIDER: "/rider",
  DRIVER: "/driver",
  ADMIN: "/admin",
};

export default function Login({ onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ FIX #6

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleLogin = async () => {
    const validationErrors = validateLoginForm(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      showValidationErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const result = await loginUser(form);
      console.log(result)
      const { token, user } = result.data;
      console.log(token , user);
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      
      

      showSuccess(`Welcome back, ${user.name}!`);

      // ✅ FIX #6: Route to role-specific app
      const route = ROLE_ROUTES[user.role] || "/";
      navigate(route);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || "Login failed";
      setErrors({ form: message });
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back">
      <InputField
        label="Email"
        type="text"
        value={form.email}
        onChange={set("email")}
        placeholder="hello@example.com"
        error={errors.email}
      />
      <InputField
        label="Password"
        type="password"
        value={form.password}
        onChange={set("password")}
        placeholder="••••••••"
        error={errors.password}
      />

      {errors.form && (
        <p style={{ fontSize: "13px", color: "#E07B8A", marginBottom: "12px", fontFamily: "DM Sans, sans-serif", textAlign: "center" }}>
          {errors.form}
        </p>
      )}

      <div style={{ textAlign: "right", marginBottom: "20px", marginTop: "-4px" }}>
        <span style={{ fontSize: "12px", color: colors.mauve, cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: "500" }}>
          Forgot password?
        </span>
      </div>

      <Button onClick={handleLogin} disabled={loading}>
        {loading ? "Signing in…" : "Sign In"}
      </Button>

      <Divider label="or" />

      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: "13px", color: "rgba(61,31,42,0.55)", fontFamily: "DM Sans, sans-serif" }}>
          Don't have an account?{" "}
        </span>
        <span
          onClick={onSwitch}
          style={{ fontSize: "13px", color: colors.mauve, fontWeight: "600", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
        >
          Create one
        </span>
      </div>
    </AuthCard>
  );
}
