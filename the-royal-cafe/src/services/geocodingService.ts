export type ReverseGeocodeResult = {
  address: string;
  raw?: unknown;
};

const NOMINATIM_BASE_URL =
  import.meta.env.VITE_NOMINATIM_BASE_URL ||
  "https://nominatim.openstreetmap.org";

const getContactQuery = () => {
  // Nominatim policy recommends a valid email. If you don't set it, requests still work,
  // but you may be rate-limited.
  const email = import.meta.env.VITE_NOMINATIM_EMAIL;
  return email ? `&email=${encodeURIComponent(String(email))}` : "";
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number,
) => {
  const url = `${NOMINATIM_BASE_URL}/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1${getContactQuery()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Reverse geocode failed (HTTP ${res.status})`);

  const data = await res.json();

  if (data && typeof data === "object" && "error" in data) {
    throw new Error(String((data as { error?: string }).error || "Reverse geocode failed"));
  }

  const a = data?.address;
  if (!a) {
    return { address: data?.display_name || `${latitude}, ${longitude}`, raw: data };
  }

  const specific =
    a.house_number || a.building || a.amenity || a.office || a.shop || "";
  const street = a.road || a.street || a.pedestrian || a.footway || a.path || "";
  const area =
    a.residential || a.suburb || a.neighbourhood || a.quarter || a.subdistrict || a.hamlet || "";
  const city =
    a.city || a.town || a.village || a.municipality || a.district || a.county || "";
  const state = a.state || "";
  const postcode = a.postcode || "";
  const country = a.country || "";

  const parts = [specific, street, area, city, state, postcode, country].filter(Boolean);
  const uniqueParts = parts.filter((item: string, idx: number) => parts.indexOf(item) === idx);
  const formatted =
    uniqueParts.length > 0 ? uniqueParts.join(", ") : data?.display_name || `${latitude}, ${longitude}`;

  return { address: formatted, raw: data };
};

export const geocodeAddress = async (address: string) => {
  const q = encodeURIComponent(address);
  const url = `${NOMINATIM_BASE_URL}/search?format=jsonv2&q=${q}&limit=1${getContactQuery()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocode failed (HTTP ${res.status})`);

  const data = await res.json();
  const first = Array.isArray(data) ? data[0] : data?.[0];

  const lat = Number(first?.lat);
  const lon = Number(first?.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error("Geocode failed: no coordinates returned");
  }

  return { latitude: lat, longitude: lon, raw: data };
};

