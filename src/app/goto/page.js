"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import Map from "@/components/Map";

async function geocode(query) {
  // detect lat,lon
  const coords = query.split(",").map((s) => s.trim());
  if (coords.length >= 2) {
    const lat = parseFloat(coords[0]);
    const lon = parseFloat(coords[1]);
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) return { latitude: lat, longitude: lon };
  }

  // fallback to Nominatim
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.length === 0) return null;
    const item = data[0];
    return { latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) };
  } catch (err) {
    console.warn("Geocode error", err);
    return null;
  }
}

export default function GotoPage() {
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [chargersAlongRoute, setChargersAlongRoute] = useState([]);

  const location = useAppStore((s) => s.location);

  const sampleRoutePoints = (o, d, samples = 12) => {
    const points = [];
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const lat = o.latitude + (d.latitude - o.latitude) * t;
      const lon = o.longitude + (d.longitude - o.longitude) * t;
      points.push({ latitude: lat, longitude: lon });
    }
    return points;
  };

  const fetchChargersAt = async (lat, lon) => {
    try {
      const res = await fetch(`/api/chargers?latitude=${lat}&longitude=${lon}&distance=10&maxresults=50`);
      if (!res.ok) return [];
      const data = await res.json();
      return data || [];
    } catch (err) {
      return [];
    }
  };

  const handleFindRoute = async (e) => {
    e?.preventDefault?.();
    setMessage("");
    setChargersAlongRoute([]);
    setRouteGeoJSON(null);

    const originStr = originInput || (location ? `${location.latitude},${location.longitude}` : "");
    const destStr = destinationInput;
    if (!originStr || !destStr) {
      setMessage("Please provide both origin and destination.");
      return;
    }

    setLoading(true);
    const origin = await geocode(originStr);
    const dest = await geocode(destStr);
    if (!origin || !dest) {
      setMessage("Failed to geocode origin or destination.");
      setLoading(false);
      return;
    }

    // build route as straight-line samples
    const samples = sampleRoutePoints(origin, dest, 16);
    const lineCoords = samples.map((p) => [p.longitude, p.latitude]);
    setRouteGeoJSON({ type: "Feature", geometry: { type: "LineString", coordinates: lineCoords }, properties: {} });

    // query chargers at sample points
    const results = [];
    for (let i = 0; i < samples.length; i++) {
      // small delay to be polite
      /* eslint-disable no-await-in-loop */
      const point = samples[i];
      const found = await fetchChargersAt(point.latitude, point.longitude);
      results.push(...found);
      await new Promise((r) => setTimeout(r, 150));
    }

    // dedupe by ID
    const byId = new Map();
    results.forEach((c) => {
      if (c && c.ID) byId.set(c.ID, c);
    });

    const unique = Array.from(byId.values());
    setChargersAlongRoute(unique);
    setMessage(`Found ${unique.length} chargers along route (approx).`);
    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">Goto — find chargers on route</h1>
      <p className="mt-2 text-sm text-slate-600">Enter origin and destination. We will approximate the route and locate chargers near the route.</p>

      <form onSubmit={handleFindRoute} className="mt-6 grid gap-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            value={originInput}
            onChange={(e) => setOriginInput(e.target.value)}
            placeholder={location ? `${location.latitude}, ${location.longitude}` : "Enter origin address or coords"}
            className="w-full rounded-md border border-slate-200 px-4 py-2"
          />
          <input
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
            placeholder="Enter destination address or coords"
            className="w-full rounded-md border border-slate-200 px-4 py-2"
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? "Finding..." : "Find chargers on route"}
          </button>
          <button type="button" onClick={() => { setOriginInput(""); setDestinationInput(""); setChargersAlongRoute([]); setRouteGeoJSON(null); setMessage(""); }} className="rounded-full border px-4 py-2 text-sm">
            Clear
          </button>
          <button type="button" onClick={() => setOriginInput(location ? `${location.latitude}, ${location.longitude}` : "")} className="rounded-full border px-4 py-2 text-sm">
            Use my location as origin
          </button>
        </div>
      </form>

      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}

      <div className="mt-6 rounded-2xl overflow-hidden" style={{ height: 480 }}>
        <Map location={location} chargers={chargersAlongRoute} routeGeoJSON={routeGeoJSON} />
      </div>
    </main>
  );
}
