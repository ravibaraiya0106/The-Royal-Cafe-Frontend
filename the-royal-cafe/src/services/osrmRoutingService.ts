export type OsrmRoute = {
  latLngs: Array<[number, number]>; // [lat,lng]
  distanceKm: number;
  durationMin: number;
};

const OSRM_BASE_URL =
  import.meta.env.VITE_OSRM_BASE_URL || "https://router.project-osrm.org";

export const getOsrmRoute = async (params: {
  driverLat: number;
  driverLng: number;
  customerLat: number;
  customerLng: number;
  signal?: AbortSignal;
}): Promise<OsrmRoute> => {
  const { driverLat, driverLng, customerLat, customerLng, signal } = params;

  const from = `${driverLng},${driverLat}`;
  const to = `${customerLng},${customerLat}`;

  const url = `${OSRM_BASE_URL}/route/v1/driving/${from};${to}?overview=full&geometries=geojson&alternatives=false&steps=false`;

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`OSRM routing failed (HTTP ${res.status})`);

  const json = await res.json();
  const route = json?.routes?.[0];
  if (!route?.geometry?.coordinates) {
    throw new Error("OSRM returned no route");
  }

  const coords = route.geometry.coordinates as Array<[number, number]>;
  const latLngs = coords.map((c) => [c[1], c[0]] as [number, number]);

  return {
    latLngs,
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
  };
};

