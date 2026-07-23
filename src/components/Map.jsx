import { useEffect, useState, useRef, useReducer } from "react";
import ReactDOM from "react-dom/client";
import EVChargerIcon from "./EVChargerIcon";

import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";

maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

const initialState = {
  zoom: 3,
  markers: [],
  center: { lng: 77.6969, lat: 24.1197 }, // Default center for India
};

const reducer = (state, action) => ({
  ...state,
  ...action,
});

// Basic HTML-escaping so charger data can't inject markup into the popup
const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));

export default function Map({ location, chargers = [], routeGeoJSON = null }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { center, zoom } = state;

  const getVehicleTypeLabel = (charger) => {
    const keywords = charger.Connections?.flatMap((connection) => {
      const values = [];
      if (connection.ConnectionType?.Title) values.push(connection.ConnectionType.Title);
      if (connection.ConnectionTypeTitle) values.push(connection.ConnectionTypeTitle);
      if (connection.Title) values.push(connection.Title);
      return values;
    }) || [];

    const combined = keywords.map((value) => String(value).toLowerCase()).join(" ");
    const isBike = /motorcycle|motorbike|bike|scooter|two wheeler|two-wheeler/.test(combined);
    const isCar = /car|auto|sedan|suv|tesla|ccs|chademo|type 2|j1772|type-2|type-1/.test(combined);
    if (isBike && isCar) return "Bike / Car";
    if (isBike) return "Bike";
    if (isCar) return "Car";
    return "Car";
  };

  // Initialize the map exactly once, and tear it down on unmount.
  useEffect(() => {
    if (map.current) return; // stops map from initializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: "streets-v4",
      center: [initialState.center.lng, initialState.center.lat],
      zoom: initialState.zoom,
      geolocate: true,
    });

    const handleBoxZoom = (e) => {
      const bounds = e.boxZoomBounds;
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const newCenter = { lng: (sw.lng + ne.lng) / 2, lat: (sw.lat + ne.lat) / 2 };
      const newZoom = map.current.getZoom();
      dispatch({ center: newCenter, zoom: newZoom });
    };

    map.current.on("boxzoomend", handleBoxZoom);

    return () => {
      map.current?.off("boxzoomend", handleBoxZoom);
      map.current?.remove();
      map.current = null;
    };
    // Runs once on mount/unmount only — center/zoom here are just the
    // initial values, not a dependency to re-init the map on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!location || !map.current) return;
    dispatch({ zoom: 13, center: { lng: location.longitude, lat: location.latitude } });
    map.current.flyTo({ center: [location.longitude, location.latitude], zoom: 13 });
  }, [location]);

  useEffect(() => {
    if (!map.current) return;

    const cleanupMarkers = (markers) => {
      markers?.forEach((m) => {
        try {
          m.marker?.remove?.();
        } catch (e) {}
        try {
          m.popup?.remove?.();
        } catch (e) {}
        try {
          m.root?.unmount?.();
        } catch (e) {}
      });
    };

    // remove existing markers, popups, and unmount any rendered React roots
    cleanupMarkers(state.markers);

    const markerObjects = (chargers || [])
      .filter((charger) => charger.AddressInfo?.Latitude && charger.AddressInfo?.Longitude)
      .map((charger) => {
        const el = document.createElement("div");
        // mount EVChargerIcon into this element
        try {
          const root = ReactDOM.createRoot(el);
          root.render(<EVChargerIcon size={60} color="#10B981" />);

          const popup = new maptilersdk.Popup({ offset: 16, closeButton: true, closeOnClick: false });
          const info = charger.AddressInfo || {};
          const title = escapeHtml(info.Title || "EV charger");
          const address = escapeHtml(
            [info.AddressLine1, info.Town, info.StateOrProvince].filter(Boolean).join(", ")
          );
          const vehicleLabel = escapeHtml(getVehicleTypeLabel(charger));
          const navigateUrl = `https://www.google.com/maps/dir/?api=1&destination=${info.Latitude},${info.Longitude}`;
          const popupHtml = `
            <div style="max-width:220px;font-family:Arial,sans-serif;color:#111">
              <div style="font-weight:700;margin-bottom:6px;">${title}</div>
              <div style="font-size:13px;color:#444;margin-bottom:6px;">${address}</div>
              <div style="font-size:12px;color:#475569;margin-bottom:6px;">${vehicleLabel}</div>
              <div style="font-size:13px;color:#0f766e;font-weight:600;margin-bottom:8px;">${charger.Connections?.length || 1} connector(s)</div>
              <a href="${navigateUrl}" target="_blank" rel="noreferrer" style="color:#0f766e;text-decoration:none;font-size:13px;">Navigate</a>
            </div>
          `;
          popup.setHTML(popupHtml);

          const marker = new maptilersdk.Marker({ element: el })
            .setLngLat([charger.AddressInfo.Longitude, charger.AddressInfo.Latitude])
            .addTo(map.current);

          const handleClick = () => {
            popup.setLngLat([charger.AddressInfo.Longitude, charger.AddressInfo.Latitude]);
            popup.addTo(map.current);
          };
          marker.getElement().addEventListener("click", handleClick);

          return { marker, root, popup, handleClick, el };
        } catch (err) {
          // fallback to default marker
          const marker = new maptilersdk.Marker()
            .setLngLat([charger.AddressInfo.Longitude, charger.AddressInfo.Latitude])
            .addTo(map.current);
          return { marker, root: null, popup: null };
        }
      });

    dispatch({ markers: markerObjects });

    // Clean up this batch of markers if chargers change again or on unmount
    return () => cleanupMarkers(markerObjects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chargers]);

  useEffect(() => {
    if (!map.current) return;

    try {
      // remove existing route layer/source if present
      if (map.current.getLayer && map.current.getLayer("route-line")) {
        map.current.removeLayer("route-line");
      }
      if (map.current.getSource && map.current.getSource("route")) {
        map.current.removeSource("route");
      }

      if (routeGeoJSON) {
        map.current.addSource("route", { type: "geojson", data: routeGeoJSON });
        map.current.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#10B981", "line-width": 4 },
        });

        // fit to route bounds
        const coords = routeGeoJSON.geometry?.coordinates;
        if (Array.isArray(coords) && coords.length > 0) {
          const lons = coords.map((c) => c[0]);
          const lats = coords.map((c) => c[1]);
          const sw = [Math.min(...lons), Math.min(...lats)];
          const ne = [Math.max(...lons), Math.max(...lats)];
          if (map.current.fitBounds) {
            map.current.fitBounds([sw, ne], { padding: 60 });
          }
        }
      }
    } catch (err) {
      console.warn("Map route render error", err);
    }
  }, [routeGeoJSON]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}