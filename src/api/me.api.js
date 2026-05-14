import api from "./axiosClient";

export const getMe = async () => {
  const response = await api.get("/me");

  return response.data;
};