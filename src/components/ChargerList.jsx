"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import ChargerCard from "@/components/ChargerCard";

export default function ChargerList({ onFilteredChargersChange }) {
  const location = useAppStore((state) => state.location);
  const referenceData = useAppStore((state) => state.referenceData);
  const setReferenceData = useAppStore((state) => state.setReferenceData);
  const [chargers, setChargers] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [connectionTypeFilter, setConnectionTypeFilter] = useState("");

  const connectionTypes = referenceData?.ConnectionTypes || [];

  const getConnectionTypeName = (connectionTypeId) => {
    if (!connectionTypes.length) return "Unknown";
    const connType = connectionTypes.find((ct) => ct.ID === connectionTypeId);
    return connType?.Title || "Unknown";
  };

  const getOperatorName = (operatorId) => {
    if (!referenceData?.Operators) return null;
    const operator = referenceData.Operators.find((op) => op.ID === operatorId);
    return operator?.Title;
  };

  const filteredChargers = chargers.filter((charger) => {
    const address = charger.AddressInfo || {};
    const search = searchTerm.trim().toLowerCase();
    const text = [
      address.Title,
      address.AddressLine1,
      address.Town,
      address.StateOrProvince,
      address.Postcode,
      charger.UsageType?.Title,
      charger.OperatorID ? getOperatorName(charger.OperatorID) : "",
      charger.Connections?.map((connection) => getConnectionTypeName(connection.ConnectionTypeID)).join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !search || text.includes(search);
    const matchesConnectionType =
      !connectionTypeFilter ||
      charger.Connections?.some((connection) => String(connection.ConnectionTypeID) === connectionTypeFilter);

    return matchesSearch && matchesConnectionType;
  });

  useEffect(() => {
    if (typeof onFilteredChargersChange === "function") {
      onFilteredChargersChange(filteredChargers);
    }
  }, [filteredChargers, onFilteredChargersChange]);

  useEffect(() => {
    const fetchReferenceData = async () => {
      if (referenceData) return;

      try {
        const response = await fetch("/api/referencedata");
        if (response.ok) {
          const data = await response.json();
          setReferenceData(data);
        }
      } catch (err) {
        console.warn("Failed to fetch reference data:", err);
      }
    };

    fetchReferenceData();
  }, [referenceData, setReferenceData]);

  useEffect(() => {
    const fetchChargers = async () => {
      setStatus("loading");
      setError(null);

      try {
        const query = location?.latitude && location?.longitude
          ? `?latitude=${location.latitude}&longitude=${location.longitude}`
          : "";
        const response = await fetch(`/api/chargers${query}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chargers");
        }
        const data = await response.json();
        setChargers(data);
        setStatus("loaded");
      } catch (err) {
        setError(err.message || "Unable to load chargers");
        setStatus("error");
      }
    };

    fetchChargers();
  }, [location?.latitude, location?.longitude]);

  return (
    <section className="flex h-full min-h-0 flex-col rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
      <div className="mb-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Nearby chargers</h2>
          <p className="mt-1 text-sm text-slate-500">{location ? "Using your location" : "Showing default location results"}</p>
        </div>
      </div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-col sm:items-end sm:justify-between">
        <div className="flex min-w-full flex-1 flex-row gap-3 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="charger-search">
            Search chargers
          </label>
          <input
            id="charger-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search chargers"
            className="min-w-0 w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
        {connectionTypes.length > 0 && (
          <div className="min-w-0 w-full sm:w-auto">
            <label className="sr-only" htmlFor="connection-type-filter">
              Filter by connection type
            </label>
            <select
              id="connection-type-filter"
              value={connectionTypeFilter}
              onChange={(event) => setConnectionTypeFilter(event.target.value)}
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="">All connector types</option>
              {connectionTypes.map((type) => (
                <option key={type.ID} value={String(type.ID)}>
                  {type.Title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
        {status === "loading" && <p className="text-sm text-slate-600">Loading charger locations...</p>}
        {status === "error" && <p className="text-sm text-red-600">{error}</p>}
        {status === "loaded" && chargers.length === 0 && (
          <p className="text-sm text-slate-600">No chargers found in the selected area.</p>
        )}
        {status === "loaded" && chargers.length > 0 && filteredChargers.length === 0 && (
          <p className="text-sm text-slate-600">No chargers match your filter. Try a different search or connector type.</p>
        )}

        <div className="grid gap-4">
          {filteredChargers.map((charger) => (
            <ChargerCard key={charger.ID} charger={charger} referenceData={referenceData} />
          ))}
        </div>
      </div>
    </section>
  );
}
