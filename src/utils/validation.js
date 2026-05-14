// src/utils/validation.js
import { showError , showSuccess } from "./toast";
// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !email.trim()) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

// Name validation
export const validateName = (name) => {
  if (!name || !name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return null;
};

// Validate login form
export const validateLoginForm = (form) => {
  const errors = {};
  const emailError = validateEmail(form.email);
  if (emailError) errors.email = emailError;
  const passwordError = validatePassword(form.password);
  if (passwordError) errors.password = passwordError;
  return errors;
};

// Validate register form
// ✅ FIX #2: internal role state is lowercase "rider"/"driver" — consistent with RoleChip onClick
export const validateRegisterForm = (form) => {
  const errors = {};

  const nameError = validateName(form.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(form.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(form.password);
  if (passwordError) errors.password = passwordError;

  if (!form.role) errors.role = "Please select a role";

  // Driver-specific field validations (file URL validation is handled separately after upload)
  if (form.role === "driver") {
    if (!form.vehicleType) errors.vehicleType = "Vehicle type is required";
     }

  return errors;
};

// Show first validation error as toast
export const showValidationErrors = (errors) => {
  const firstError = Object.values(errors)[0];
  if (firstError) toast.error(firstError);
};


