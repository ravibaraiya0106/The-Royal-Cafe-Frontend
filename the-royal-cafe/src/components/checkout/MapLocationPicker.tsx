import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FiMapPin,
  FiNavigation,
  FiEdit3,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
// toast is optional; we keep this component focused on map + coordinates.

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
  }
}

type LatLng = {
  lat: number;
  lng: number;
};

type Props = {
  selectedAddress: string;
  onConfirmLocation: (address: string, coords?: LatLng) => void;
  error?: string;
};

// Fallback city center (Bhavnagar, Gujarat)
const DEFAULT_CENTER: LatLng = { lat: 21.7645, lng: 72.1519 };

export const MapLocationPicker: React.FC<Props> = ({
  selectedAddress,
  onConfirmLocation,
  error,
}) => {
  const [coords, setCoords] = useState<LatLng>(DEFAULT_CENTER);
  const [fullAddress, setFullAddress] = useState<string>(selectedAddress || "");
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);

  const debounceTimerRef = useRef<number | null>(null);

  /* ================= REVERSE GEOCODING ================= */
  const reverseGeocode = useCallback(
    async (location: LatLng, customPrefix?: string) => {
      try {
        setLoadingAddress(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=1`,
        );
        const data = await res.json();
        let formatted = "";
        if (data && typeof data === "object" && "error" in data) {
          throw new Error(String((data as { error?: string }).error || "Unable to geocode"));
        }
        if (data && data.address) {
          const a = data.address;
          const specific =
            customPrefix || a.house_number || a.building || a.amenity || a.office || a.shop || "";
          const street = a.road || a.street || a.pedestrian || a.footway || a.path || "";
          const area =
            a.residential || a.suburb || a.neighbourhood || a.quarter || a.subdistrict || a.hamlet || "";
          const city = a.city || a.town || a.village || a.municipality || a.district || a.county || "";
          const state = a.state || "";
          const postcode = a.postcode || "";
          const country = a.country || "";
          const parts = [specific, street, area, city, state, postcode, country].filter(Boolean);
          const uniqueParts = parts.filter((item, idx) => parts.indexOf(item) === idx);
          formatted = uniqueParts.length > 0 ? uniqueParts.join(", ") : data.display_name || "";
        } else if (data && data.display_name) {
          formatted = data.display_name;
        } else {
          formatted = customPrefix || `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`;
        }
        setFullAddress(formatted);
        setIsConfirmed(false);
      } catch {
        const fallback = customPrefix || `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`;
        setFullAddress(fallback);
        setIsConfirmed(false);
      } finally {
        setLoadingAddress(false);
      }
    },
    [],
  );

  const debounceReverseGeocode = useCallback(
    (location: LatLng, customPrefix?: string) => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
      setIsConfirmed(false);
      debounceTimerRef.current = window.setTimeout(() => {
        reverseGeocode(location, customPrefix);
      }, 600);
    },
    [reverseGeocode],
  );

  /* ================= MAP INITIALIZATION ================= */
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
      const map = L.map(mapContainerRef.current).setView([coords.lat, coords.lng], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      const marker = L.marker([coords.lat, coords.lng], { draggable: true, icon: customIcon }).addTo(map);

      marker.on("dragend", () => {
        const newPos = marker.getLatLng();
        const nextCoords = { lat: newPos.lat, lng: newPos.lng };
        setCoords(nextCoords);
        debounceReverseGeocode(nextCoords);
      });

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        const nextCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
        marker.setLatLng([e.latlng.lat, e.latlng.lng]);
        setCoords(nextCoords);
        debounceReverseGeocode(nextCoords);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    };
    initMap();
    return () => {
      isMounted = false;
    };
  }, []);

  // If a pre‑selected address is provided, attempt to reverse‑geocode it on mount
  useEffect(() => {
    setFullAddress(selectedAddress || "");
    setIsConfirmed(Boolean(selectedAddress));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup debounce timers on unmount.
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      return;
    }

    setIsConfirmed(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nextCoords: LatLng = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setCoords(nextCoords);

        if (markerRef.current) {
          markerRef.current.setLatLng([nextCoords.lat, nextCoords.lng]);
        }

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([nextCoords.lat, nextCoords.lng], 15);
        }

        debounceReverseGeocode(nextCoords);
      },
      () => {
        setIsConfirmed(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, [debounceReverseGeocode]);

  const handleConfirm = useCallback(() => {
    const addr = fullAddress.trim();
    if (!addr) return;
    if (!Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) return;

    setIsConfirmed(true);
    onConfirmLocation(addr, coords);
  }, [coords, fullAddress, onConfirmLocation]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 font-serif">
            <FiMapPin className="text-brand w-4 h-4" />
            <span>Select Delivery Location on Map</span>
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Click or drag the pin to set your delivery location.
          </p>
        </div>
      </div>

      {/* Interactive Map View */}
      <div className="relative rounded-[5px] border border-gray-300 overflow-hidden shadow-sm">
        <div ref={mapContainerRef} className="w-full h-64 sm:h-72 bg-gray-100 z-10" />
        <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-[5px] border border-gray-200 shadow-sm text-[11px] font-semibold text-gray-700 flex items-center gap-1.5">
          <FiNavigation className="text-brand w-3.5 h-3.5" />
          <span>Tap anywhere on map or drag pin to relocate</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={useCurrentLocation}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-brand text-white text-[11px] font-bold rounded-[5px] hover:bg-brand/90 transition-all shadow-xs"
        >
          Use Current Location
        </button>

        <span
          className={`text-[11px] font-semibold ${
            isConfirmed ? "text-green-700" : "text-gray-500"
          }`}
        >
          {isConfirmed ? "Location confirmed" : "Confirm to save delivery location"}
        </span>
      </div>

      {/* Address Input */}
      <div className={`p-4 rounded-[5px] border transition-all ${
        error ? "bg-red-50 border-red-300" : fullAddress ? "bg-green-50/50 border-green-200" : "bg-white border-gray-200"
      }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-[5px] bg-brand text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <FiCheckCircle className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-1">
                <FiEdit3 className="w-3.5 h-3.5" />
                <span>Full Delivery Address (Auto-filled & Editable)</span>
              </label>
              <span className="text-[10px] font-mono text-gray-500">
                Lat:{" "}{coords.lat !== 0 ? coords.lat.toFixed(6) : "--"}, Lng:{" "}{coords.lng !== 0 ? coords.lng.toFixed(6) : "--"}
              </span>
            </div>
            {loadingAddress ? (
              <p className="text-xs text-gray-500 animate-pulse py-1">
                Fetching address from map pin...
              </p>
            ) : (
              <textarea
                rows={3}
                value={fullAddress}
                onChange={(e) => {
                  setIsConfirmed(false);
                  setFullAddress(e.target.value);
                }}
                placeholder="Type or edit your complete delivery address, house no, society, street..."
                className="w-full p-2.5 text-xs sm:text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-[5px] focus:outline-hidden focus:border-brand shadow-xs leading-relaxed"
              />
            )}
            <p className="text-[11px] text-gray-500 italic">
              * This address is automatically detected from your map pin & GPS. You can also edit or type your exact house/sheri details directly above.
            </p>
          </div>
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loadingAddress || !fullAddress.trim() || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2 bg-amber-500 text-white text-xs font-bold rounded-[5px] hover:bg-amber-500/90 transition-all shadow-xs disabled:opacity-50"
          >
            Confirm Location
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
          <FiAlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default MapLocationPicker;
