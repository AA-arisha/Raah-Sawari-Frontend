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
    if (!form.vehicleModel?.trim()) errors.vehicleModel = "Vehicle model is required";
    if (!form.vehicleNumber?.trim()) errors.vehicleNumber = "Vehicle number plate is required";
    if (!form.vehicleColor?.trim()) errors.vehicleColor = "Vehicle color is required";
  }

  return errors;
};

// Show first validation error as toast
export const showValidationErrors = (errors) => {
  const firstError = Object.values(errors)[0];
  if (firstError) toast.error(firstError);
};

// File presence validation
export const validateFile = (file, label = "File") => {
  if (!file) return `${label} is required`;
  return null;
};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

// File format validation
export const validateFileFormat = (file, label = "File") => {
  if (!file) return null;
  const fileType = file.type?.toLowerCase();
  const ext = file.name?.toLowerCase().split(".").pop();
  const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  if (fileType && !ALLOWED_IMAGE_TYPES.includes(fileType))
    return `${label} must be a valid image format (JPG, PNG, GIF, or WebP)`;
  if (ext && !validExtensions.includes(ext))
    return `${label} must be a valid image format (JPG, PNG, GIF, or WebP)`;
  return null;
};

// ✅ FIX #3: cnicBack removed — only validate cnicFront and license
export const validateDriverFiles = (form) => {
  const errors = {};

  const cnicFrontError = validateFile(form.cnicFront, "CNIC Front image");
  if (cnicFrontError) errors.cnicFront = cnicFrontError;

  const licenseError = validateFile(form.license, "Driving License");
  if (licenseError) errors.license = licenseError;

  if (form.cnicFront) {
    const fmtErr = validateFileFormat(form.cnicFront, "CNIC Front image");
    if (fmtErr) errors.cnicFront = fmtErr;
  }

  if (form.license) {
    const fmtErr = validateFileFormat(form.license, "Driving License");
    if (fmtErr) errors.license = fmtErr;
  }

  return errors;
};
