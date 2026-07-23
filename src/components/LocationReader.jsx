"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function LocationReader() {
  const [status, setStatus] = useState("idle");
  const setLocation = useAppStore((state) => state.setLocation);
  const setSelectedState = useAppStore((state) => state.setSelectedState);
  const setSelectedCity = useAppStore((state) => state.setSelectedCity);

  const reverseGeocodeLocation = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      const state = data.address?.state || data.address?.region || "";
      const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || "";
      return { state, city };
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        const result = await reverseGeocodeLocation(location.latitude, location.longitude);
        if (result) {
          location.state = result.state;
          location.city = result.city;
          setSelectedState(result.state);
          setSelectedCity(result.city);
        }

        setLocation(location);
        setStatus("saved");
      },
      () => {
        setStatus("denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [setLocation, setSelectedCity, setSelectedState]);

  return null;
}
