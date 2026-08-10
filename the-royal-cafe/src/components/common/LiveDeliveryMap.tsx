import React, { useEffect, useRef, useState } from "react";
import { getSocket } from "@/config/socket";
import { calculateDistance } from "@/utils/haversine";
import { getOsrmRoute } from "@/services/osrmRoutingService";
import {
  FiNavigation,
  FiMapPin,
  FiTruck,
  FiClock,
  FiCompass,
} from "react-icons/fi";

type LatLng = {
  lat: number;
  lng: number;
};

type Props = {
  orderId?: string;
  destinationCoords?: LatLng;
  destinationAddress?: string;
  height?: string;
};

/**
 * Calculates Haversine distance in km and estimated travel time in minutes
 * between two GPS coordinates (lat, lng).
 */
const calculateHaversineMetrics = (
  pos1: LatLng | null,
  pos2: LatLng | null,
) => {
  if (!pos1 || !pos2 || !pos1.lat || !pos1.lng || !pos2.lat || !pos2.lng) {
    return null;
  }
  const R = 6371; // Earth radius in km
  const dLat = ((pos2.lat - pos1.lat) * Math.PI) / 180;
  const dLon = ((pos2.lng - pos1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pos1.lat * Math.PI) / 180) *
      Math.cos((pos2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  // Format distance
  const formattedDistance =
    distanceKm < 1
      ? `${Math.round(distanceKm * 1000)} m`
      : `${distanceKm.toFixed(2)} km`;

  // Estimate travel time: avg city speed 25 km/h -> 2.4 min/km + 2 min preparation/buffer
  const estimatedMinutes = Math.max(1, Math.round(distanceKm * 2.4 + 2));

  return {
    rawKm: distanceKm,
    formattedDistance,
    estimatedMinutes,
  };
};

export const LiveDeliveryMap: React.FC<Props> = ({
  orderId,
  destinationCoords,
  destinationAddress,
  height = "320px",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deliveryMarkerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const destMarkerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polylineRef = useRef<any>(null);

  const [deliveryPos, setDeliveryPos] = useState<LatLng | null>(
    null,
  );
  const [lastUpdate, setLastUpdate] = useState<string>("");

  /* ================= LISTEN TO LIVE SOCKET BROADCASTS ================= */
  useEffect(() => {
    const socket = getSocket();
    if (orderId) {
      socket.emit("join_order", orderId);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBroadcast = (data: any) => {
      if (!orderId || data.orderId !== orderId) return;
      if (!data.latitude || !data.longitude) return;

      const nextPos = { lat: data.latitude, lng: data.longitude };
      setDeliveryPos(nextPos);
      setLastUpdate(
        data.lastUpdatedAt
          ? new Date(data.lastUpdatedAt).toLocaleTimeString()
          : new Date().toLocaleTimeString(),
      );
    };

    socket.on("delivery:location:updated", handleBroadcast);
    // Backward compatibility for older event naming.
    socket.on("delivery:location_broadcast", handleBroadcast);

    return () => {
      socket.off("delivery:location:updated", handleBroadcast);
      socket.off("delivery:location_broadcast", handleBroadcast);
      if (orderId) {
        socket.emit("leave_order", orderId);
      }
    };
  }, [orderId]);

  /* ================= OSRM ROUTING (throttled) ================= */
  const [routeInfo, setRouteInfo] = useState<{
    distanceKm: number;
    durationMin: number;
    latLngs: Array<[number, number]>;
  } | null>(null);
  const [routeLoading, setRouteLoading] = useState<boolean>(false);

  const osrmLastReqAtRef = useRef<number>(0);
  const osrmLastOriginRef = useRef<LatLng | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!deliveryPos || !destinationCoords) return;
      const now = Date.now();

      const lastOrigin = osrmLastOriginRef.current;
      const movedKm = lastOrigin
        ? calculateDistance(lastOrigin.lat, lastOrigin.lng, deliveryPos.lat, deliveryPos.lng)
        : Infinity;

      const shouldRequest =
        !lastOrigin ||
        movedKm >= 0.05 || // ~50m
        now - osrmLastReqAtRef.current >= 15000; // at least every 15s

      if (!shouldRequest) return;

      osrmLastReqAtRef.current = now;
      osrmLastOriginRef.current = deliveryPos;
      setRouteLoading(true);
      setRouteInfo(null);

      try {
        const route = await getOsrmRoute({
          driverLat: deliveryPos.lat,
          driverLng: deliveryPos.lng,
          customerLat: destinationCoords.lat,
          customerLng: destinationCoords.lng,
        });

        setRouteInfo(route);
      } catch (e) {
        // Routing is optional UX; keep map working with straight-line fallback.
        setRouteInfo(null);
      } finally {
        setRouteLoading(false);
      }
    };

    run();
  }, [deliveryPos, destinationCoords]);

  /* ================= LEAFLET MAP INITIALIZATION & UPDATE ================= */
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!window.L) {
        await new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
      }

      if (!isMounted || !mapContainerRef.current || !window.L) return;
      const L = window.L;

      const defaultCenter = deliveryPos || destinationCoords || { lat: 0, lng: 0 };

      // Initialize Map
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current).setView(
          [defaultCenter.lat, defaultCenter.lng],
          15,
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Delivery Boy Motorbike Pin Icon
      const bikeIcon = L.divIcon({
        className: "delivery-bike-pin",
        html: `<div style="background-color: #5b0f0f; width: 38px; height: 38px; border-radius: 50%; border: 3px solid #f59e0b; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; animation: pulse 2s infinite;">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
               </div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
      });

      // Destination Pin Icon
      const destIcon = L.divIcon({
        className: "dest-pin",
        html: `<div style="background-color: #16a34a; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
                <svg stroke="currentColor" fill="currentColor" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z M12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5-2.5z"/></svg>
               </div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
      });

      // Update Delivery Boy Marker
      if (deliveryPos && deliveryPos.lat && deliveryPos.lng) {
        if (!deliveryMarkerRef.current) {
          deliveryMarkerRef.current = L.marker([deliveryPos.lat, deliveryPos.lng], {
            icon: bikeIcon,
          }).addTo(map).bindPopup("<b>Delivery Partner</b><br/>Current Live Position");
        } else {
          deliveryMarkerRef.current.setLatLng([deliveryPos.lat, deliveryPos.lng]);
        }
      }

      // Update Destination Marker
      if (destinationCoords && destinationCoords.lat && destinationCoords.lng) {
        if (!destMarkerRef.current) {
          destMarkerRef.current = L.marker(
            [destinationCoords.lat, destinationCoords.lng],
            { icon: destIcon },
          ).addTo(map).bindPopup(`<b>Delivery Destination</b><br/>${destinationAddress || ""}`);
        } else {
          destMarkerRef.current.setLatLng([
            destinationCoords.lat,
            destinationCoords.lng,
          ]);
        }
      }

      // Draw OSRM route (road geometry). If OSRM is unavailable, fall back to straight line.
      const fallbackLineCoords =
        deliveryPos && destinationCoords
          ? [
              [deliveryPos.lat, deliveryPos.lng] as [number, number],
              [destinationCoords.lat, destinationCoords.lng] as [number, number],
            ]
          : null;

      const routeCoords =
        routeInfo?.latLngs && routeInfo.latLngs.length > 1 ? routeInfo.latLngs : fallbackLineCoords;

      if (routeCoords) {
        if (!polylineRef.current) {
          polylineRef.current = L.polyline(routeCoords, {
            color: "#5b0f0f",
            weight: 4,
            dashArray: routeInfo ? undefined : "8, 8",
          }).addTo(map);
        } else {
          polylineRef.current.setLatLngs(routeCoords);
        }

        // Fit map bounds to show both pins / route.
        const bounds = L.latLngBounds(routeCoords);
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, [deliveryPos, destinationCoords, destinationAddress, routeInfo]);

  const directMetrics = calculateHaversineMetrics(deliveryPos, destinationCoords || null);

  return (
    <div className="space-y-3">
      {/* Header with Live Tracking Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-brand/5 border border-brand/20 p-3 rounded-[5px]">
        <div className="flex items-center gap-2 text-xs font-bold text-brand">
          <FiTruck className="w-4 h-4 animate-bounce shrink-0" />
          <span>Leaflet Live GPS & OSRM Routing</span>
          {lastUpdate && (
            <span className="text-[11px] text-gray-500 font-mono font-normal">
              • Updated {lastUpdate}
            </span>
          )}
        </div>
      </div>

      {/* Distance & Time Difference Metric Card */}
      {(directMetrics || routeInfo) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-900 text-white p-3 rounded-[5px] shadow-sm text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[5px] bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <FiCompass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                Distance
              </span>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {routeLoading && !routeInfo
                  ? "Routing..."
                  : routeInfo
                    ? routeInfo.distanceKm < 1
                      ? `${Math.round(routeInfo.distanceKm * 1000)} m`
                      : `${routeInfo.distanceKm.toFixed(2)} km`
                    : directMetrics?.formattedDistance}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[5px] bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <FiClock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                Est. Driving Time
              </span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {routeLoading && !routeInfo
                  ? "—"
                  : routeInfo
                    ? `${Math.round(routeInfo.durationMin)} min`
                    : `~${directMetrics?.estimatedMinutes ?? 0} mins`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Leaflet Canvas */}
      <div
        className="relative border border-gray-300 rounded-[5px] overflow-hidden shadow-sm"
        style={{ height }}
      >
        <div ref={mapContainerRef} className="w-full h-full bg-gray-100" />

        <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-[5px] border border-gray-200 shadow-sm text-[11px] font-semibold text-gray-700 flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-brand">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping inline-block" />
            Delivery Boy Pin {deliveryPos ? `(${deliveryPos.lat.toFixed(4)}, ${deliveryPos.lng.toFixed(4)})` : "(Locating...)"}
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1 text-green-700">
            <FiMapPin className="w-3 h-3" /> Customer Destination {destinationCoords ? `(${destinationCoords.lat.toFixed(4)}, ${destinationCoords.lng.toFixed(4)})` : ""}
          </span>
        </div>
      </div>

      {destinationAddress && (
        <div className="text-xs text-gray-600 flex items-start justify-between gap-2 pt-0.5">
          <div className="flex items-start gap-1.5">
            <FiNavigation className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
            <span className="font-medium">{destinationAddress}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveDeliveryMap;
