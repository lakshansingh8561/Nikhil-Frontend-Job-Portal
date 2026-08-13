import React, { createContext, useState, useEffect, useCallback } from "react";
import { LocationService } from "../services/locationService";
import type { LocationData, SearchCityResult } from "../services/locationService";
import { useAppSelector } from "../hooks/useAppSelector";

export type LocationStatus =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "denied";

export interface LocationContextType {
  location: LocationData | null;
  status: LocationStatus;
  error: string | null;
  isDenied: boolean;
  detectLocation: (force?: boolean) => Promise<void>;
  selectLocation: (data: LocationData) => Promise<void>;
  searchCities: (query: string) => Promise<SearchCityResult[]>;
  dismissDeniedBanner: () => void;
  clearLocation: () => void;
}

export const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isDenied, setIsDenied] = useState<boolean>(false);

  const { accessToken, isAuthenticated } = useAppSelector((state) => state.auth);

  /**
   * Primary Detect Location Workflow (Auto-cache, HTML5 Geolocation, Reverse Geocode & Backend Sync)
   */
  const detectLocation = useCallback(
    async (force = false) => {
      setStatus("loading");
      setError(null);

      // Check 24hr localStorage cache first if not forced
      if (!force) {
        const cached = LocationService.getCachedLocation();
        if (cached) {
          setLocation(cached);
          setStatus("success");
          setIsDenied(false);

          if (isAuthenticated && accessToken) {
            LocationService.updateBackendLocation(cached, accessToken).catch(() => null);
          }
          return;
        }
      }

      try {
        // Step 1: Attempt HTML5 Geolocation API
        let locationData: LocationData | null = null;
        try {
          const coords = await LocationService.getCurrentCoordinates();
          locationData = await LocationService.reverseGeocode(
            coords.latitude,
            coords.longitude
          );
        } catch (gpsErr: any) {
          console.warn("[LocationContext] GPS Geolocation failed, trying IP fallback:", gpsErr?.message);
          // Fallback to IP geolocation
          locationData = await LocationService.getLocationByIP();
        }

        if (locationData) {
          setLocation(locationData);
          setStatus("success");
          setIsDenied(false);
          LocationService.setCachedLocation(locationData);

          if (isAuthenticated && accessToken) {
            await LocationService.updateBackendLocation(locationData, accessToken);
          }
        }
      } catch (err: any) {
        console.warn("[LocationContext] All location detection failed:", err.message);
        setStatus("error");
        setError("Unable to auto-detect location. Please search your city manually.");
      }
    },
    [isAuthenticated, accessToken]
  );

  /**
   * Manual Selection of Location (from Search/Autocomplete)
   */
  const selectLocation = useCallback(
    async (data: LocationData) => {
      setLocation(data);
      setStatus("success");
      setIsDenied(false);
      setError(null);
      LocationService.setCachedLocation(data);

      if (isAuthenticated && accessToken) {
        await LocationService.updateBackendLocation(data, accessToken);
      }
    },
    [isAuthenticated, accessToken]
  );

  /**
   * Search city API helper
   */
  const searchCities = useCallback(async (query: string) => {
    return LocationService.searchCities(query);
  }, []);

  const dismissDeniedBanner = useCallback(() => {
    setIsDenied(false);
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setStatus("idle");
    LocationService.clearCachedLocation();
  }, []);

  // On mount or auth change: Check cached location or attempt initial detection ONLY when user is logged in
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation(null);
      setStatus("idle");
      return;
    }

    const cached = LocationService.getCachedLocation();
    if (cached) {
      setLocation(cached);
      setStatus("success");
    } else {
      // Auto-detect on initial visit if geolocation permissions were already granted
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions
          .query({ name: "geolocation" as PermissionName })
          .then((result) => {
            if (result.state === "granted") {
              detectLocation(false);
            }
          })
          .catch(() => null);
      }
    }
  }, [isAuthenticated, detectLocation]);

  // Sync to backend whenever user logs in
  useEffect(() => {
    if (isAuthenticated && accessToken && location) {
      LocationService.updateBackendLocation(location, accessToken).catch(() => null);
    }
  }, [isAuthenticated, accessToken, location]);

  return (
    <LocationContext.Provider
      value={{
        location,
        status,
        error,
        isDenied,
        detectLocation,
        selectLocation,
        searchCities,
        dismissDeniedBanner,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
