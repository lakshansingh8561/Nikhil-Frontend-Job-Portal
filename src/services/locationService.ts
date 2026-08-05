import axios from "axios";

export interface LocationData {
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export interface CachedLocation {
  data: LocationData;
  timestamp: number;
}

export interface SearchCityResult {
  displayName: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

const LOCATION_CACHE_KEY = "jobbox_user_location";
const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 Hours in milliseconds

export class LocationService {
  /**
   * Get current latitude and longitude using HTML5 Geolocation API
   */
  static getCurrentCoordinates(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("Geolocation is not supported by your browser."));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = "Failed to retrieve location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied by user.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  /**
   * Reverse Geocode coordinates using BigDataCloud API with Nominatim fallback
   */
  static async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<LocationData> {
    // Primary: BigDataCloud Reverse Geocoding (high accuracy for city & state)
    try {
      const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
      const res = await axios.get(bdcUrl);

      if (res.data) {
        const city =
          res.data.city ||
          res.data.locality ||
          res.data.localityInfo?.administrative?.find(
            (a: any) => a.order === 3 || a.order === 4
          )?.name ||
          res.data.localityInfo?.informative?.find(
            (i: any) => i.description === "city" || i.description === "town"
          )?.name ||
          "Unknown City";

        const state = res.data.principalSubdivision || "";
        const country = res.data.countryName || "";
        const postalCode = res.data.postcode || "";

        if (city && city !== "Unknown City") {
          return {
            city,
            state,
            country,
            postalCode,
            latitude,
            longitude,
          };
        }
      }
    } catch (e) {
      console.warn("[LocationService] BigDataCloud geocode warning, trying Nominatim:", e);
    }

    // Fallback: OpenStreetMap Nominatim
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
      const response = await axios.get(url, {
        headers: { "User-Agent": "JobBoxPortal/1.0" },
      });

      if (response.data && response.data.address) {
        const addr = response.data.address;
        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.suburb ||
          addr.municipality ||
          addr.county ||
          addr.state_district ||
          "Unknown City";

        return {
          city,
          state: addr.state || "",
          country: addr.country || "",
          postalCode: addr.postcode || "",
          latitude,
          longitude,
        };
      }
    } catch (error: any) {
      console.error("[LocationService] Reverse Geocoding Error:", error);
    }

    return {
      city: "Detected Location",
      state: "",
      country: "",
      postalCode: "",
      latitude,
      longitude,
    };
  }

  /**
   * IP-based Location Fallback if GPS is unavailable/denied
   */
  static async getLocationByIP(): Promise<LocationData> {
    try {
      const res = await axios.get("https://ipapi.co/json/");
      if (res.data && res.data.city) {
        return {
          city: res.data.city,
          state: res.data.region || "",
          country: res.data.country_name || "",
          postalCode: res.data.postal || "",
          latitude: res.data.latitude || 0,
          longitude: res.data.longitude || 0,
        };
      }
    } catch (e) {
      console.warn("[LocationService] IP location fallback error:", e);
    }

    throw new Error("Could not detect location automatically.");
  }

  /**
   * Manual City Search via free OpenStreetMap Nominatim API
   */
  static async searchCities(query: string): Promise<SearchCityResult[]> {
    const trimmed = query ? query.trim() : "";
    if (!trimmed || trimmed.length < 2) return [];

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        trimmed
      )}&addressdetails=1&limit=8`;
      const response = await axios.get(url, {
        headers: { "User-Agent": "JobBoxPortal/1.0" },
      });

      if (!Array.isArray(response.data)) return [];

      const results: SearchCityResult[] = response.data.map((item: any) => {
        const addr = item.address || {};
        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.suburb ||
          addr.municipality ||
          addr.county ||
          addr.state_district ||
          item.display_name.split(",")[0].trim() ||
          trimmed;

        const state = addr.state || addr.region || "";
        const country = addr.country || "";
        const parts = [city, state, country].filter(Boolean);
        const displayName = parts.join(", ");

        return {
          displayName,
          city,
          state,
          country,
          postalCode: addr.postcode || "",
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
        };
      });

      // Remove duplicate city entries
      const uniqueMap = new Map<string, SearchCityResult>();
      results.forEach((item) => {
        const key = `${item.city.toLowerCase()}-${item.state.toLowerCase()}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        }
      });

      return Array.from(uniqueMap.values());
    } catch (error) {
      console.error("[LocationService] City Search Error:", error);
      return [];
    }
  }

  /**
   * Get valid cached location from localStorage (24hr expiry check)
   */
  static getCachedLocation(): LocationData | null {
    try {
      const cached = localStorage.getItem(LOCATION_CACHE_KEY);
      if (!cached) return null;

      const parsed: CachedLocation = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > CACHE_EXPIRATION_MS;

      if (isExpired) {
        localStorage.removeItem(LOCATION_CACHE_KEY);
        return null;
      }

      return parsed.data;
    } catch (e) {
      localStorage.removeItem(LOCATION_CACHE_KEY);
      return null;
    }
  }

  /**
   * Cache location in localStorage with current timestamp
   */
  static setCachedLocation(data: LocationData): void {
    try {
      const cacheObj: CachedLocation = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(cacheObj));
    } catch (e) {
      console.error("[LocationService] Failed to cache location:", e);
    }
  }

  /**
   * Clear cached location
   */
  static clearCachedLocation(): void {
    localStorage.removeItem(LOCATION_CACHE_KEY);
  }

  /**
   * Send location data to backend endpoint POST /api/v1/location/update
   */
  static async updateBackendLocation(
    locationData: LocationData,
    token?: string
  ): Promise<boolean> {
    try {
      const authToken = token || localStorage.getItem("token");
      if (!authToken) return false;

      const apiUrl = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/location/update`;
      await axios.post(apiUrl, locationData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return true;
    } catch (error) {
      console.error("[LocationService] Backend location update error:", error);
      return false;
    }
  }
}
