import { useState, useEffect, useCallback } from "react";
import { getRideEstimate } from "../../../api/ride.api";
import { VEHICLE_MAP } from "./vehicleMap";



export function useCountdown(initial) {
  const [count, setCount]     = useState(initial);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (!running || count <= 0) return;
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, running]);
  const reset = useCallback(() => { setCount(initial); setRunning(true); }, [initial]);
  const stop  = useCallback(() => setRunning(false), []);
  return { count, reset, stop, expired: count <= 0 };
}

// hooks.js (or wherever useFareStep lives)
export function useFareStep(initial, min, max, step) {
  const [fare, setFare] = useState(initial);

  const reset = useCallback((newBase) => {
    setFare(newBase ?? initial);
  }, [initial]);

  const inc = useCallback(() => setFare(f => Math.min(f + step, max)), [step, max]);
  const dec = useCallback(() => setFare(f => Math.max(f - step, min)), [step, min]);

  return {
    fare,
    inc,
    dec,
    reset,
    isMin: fare <= min,
    isMax: fare >= max,
  };
}

// import { useState, useEffect, useCallback } from "react";
// import { getRideEstimate } from "../api/raahsawariAPI";
// import { VEHICLE_MAP } from "../utils/vehicleMap";

export function useRideEstimate(route) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!route?.pickup || !route?.drop) return;

    let cancelled = false;

    async function fetchEstimate() {
      try {
        setLoading(true);
        setError(null);

        const res = await getRideEstimate(route.pickup, route.drop);

        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchEstimate();

    return () => { cancelled = true; };
  }, [route?.pickup?.lat, route?.pickup?.lng, route?.drop?.lat, route?.drop?.lng]);

  // helper
  const getVehicleData = useCallback((rideId) => {
    if (!data?.vehicles) return null;
    const backendKey = VEHICLE_MAP[rideId];
    return data.vehicles.find(v => v.vehicle === backendKey) ?? null;
  }, [data]);

  return {
    data,
    loading,
    error,
    getVehicleData,
  };
}

