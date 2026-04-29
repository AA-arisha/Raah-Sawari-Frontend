import api from "./axiosClient";

// helper
const post = async (url, body) => {
  const res = await api.post(url, body);
  return res.data;
};

// 🚗 Ride Estimate
export const getRideEstimate = (pickup, drop) =>
  post("/ride/estimate", { pickup, drop });

// ⏱ ETA
export const getETA = (pickup, drop) => {
  const body =
    typeof pickup === "string"
      ? { pickup_text: pickup, drop_text: drop }
      : { pickup, drop };

  return post("/eta", body);
};

// 💰 Fare
export const getFare = (pickup, drop, vehicleType, durationMin) =>
  post("/price", {
    pickup,
    drop,
    vehicle_type: vehicleType,
    duration_min: durationMin,
  });

// ⚠️ Driver Risk
export const getDriverRisk = (driverStats) =>
  post("/risk", driverStats);