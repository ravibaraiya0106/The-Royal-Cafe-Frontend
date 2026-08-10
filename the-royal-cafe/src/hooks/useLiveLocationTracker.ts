import { useState, useEffect, useRef, useCallback } from "react";
import { getSocket } from "@/config/socket";
import { toastError } from "@/utils/toast";

type LocationData = {
  latitude: number;
  longitude: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  updatedAt: string;
};

type UseLiveTrackerProps = {
  isTrackingActive: boolean;
  deliveryId?: string;
  orderId?: string;
};

export const useLiveLocationTracker = ({
  isTrackingActive,
  deliveryId,
  orderId,
}: UseLiveTrackerProps) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isWatching, setIsWatching] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const lastSentAtRef = useRef<number>(0);
  const lastSentCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  // Inline haversine distance (km). Later we’ll reuse a shared util.
  const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      const err = "Geolocation is not supported by your browser";
      setErrorMsg(err);
      toastError(err);
      return;
    }

    // Prevent multiple concurrent watchPosition calls when order changes
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (!deliveryId || !orderId) {
      const err = "Missing deliveryId/orderId for live tracking.";
      setErrorMsg(err);
      toastError(err);
      return;
    }

    setErrorMsg(null);
    setIsWatching(true);

    const socket = getSocket();
    socket.emit("join_order", orderId);

    // High accuracy watchPosition as recommended
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, heading, speed } = position.coords;

        const data: LocationData = {
          latitude,
          longitude,
          accuracy,
          heading,
          speed,
          updatedAt: new Date().toISOString(),
        };

        setCurrentLocation(data);

        // Throttle: send if moved meaningfully OR enough time passed.
        const now = Date.now();
        const prev = lastSentCoordsRef.current;

        const movedKm =
          prev ? haversineKm(prev.lat, prev.lng, latitude, longitude) : Infinity;

        const movedMeaningfully = movedKm >= 0.02; // ~20m threshold
        const timeExceeded = now - lastSentAtRef.current >= 3000; // 3s heartbeat

        if (!prev || movedMeaningfully || timeExceeded) {
          lastSentAtRef.current = now;
          lastSentCoordsRef.current = { lat: latitude, lng: longitude };

          socket.emit("delivery:location:update", {
            orderId,
            latitude,
            longitude,
          });
        }
      },
      (error) => {
        let message = "Failed to watch live position";
        if (error.code === 1) {
          message = "Location permission denied for live tracking.";
        } else if (error.code === 2) {
          message = "Position unavailable. Please check device GPS.";
        } else if (error.code === 3) {
          message = "Location watch request timed out.";
        }
        setErrorMsg(message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );
  }, [deliveryId, orderId]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsWatching(false);

    if (orderId) {
      const socket = getSocket();
      socket.emit("leave_order", orderId);
    }
  }, [orderId]);

  useEffect(() => {
    if (isTrackingActive) {
      startWatching();
    } else {
      stopWatching();
    }

    return () => {
      stopWatching();
    };
  }, [isTrackingActive, startWatching, stopWatching]);

  return {
    currentLocation,
    isWatching,
    errorMsg,
    startWatching,
    stopWatching,
  };
};
