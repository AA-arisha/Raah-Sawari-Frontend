import api from "./axiosClient";
import { showSuccess, showError } from "../utils/toast";


// REGISTER
export const registerUser = async (data) => {
  try {
    const res = await api.post("/auth/register", data);
    showSuccess(res.data.message || "Registered successfully");
    return res.data;
  } catch (error) {
    showError(error.response?.data?.message || "Registration failed");
    throw error;
  }
};

// LOGIN
export const loginUser = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    showSuccess("Login successful");
    return res.data;
  } catch (error) {
    showError(error.response?.data?.message || "Login failed");
    throw error;
  }
};