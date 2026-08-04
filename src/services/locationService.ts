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
   * Reverse Geocode coordinates via free OpenStreetMap Nominatim API
   */
  static async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<LocationData> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "JobBoxPortal/1.0",
        },
      });

      if (!response.data || !response.data.address) {
        throw new Error("Invalid address response from OpenStreetMap.");
      }

      const addr = response.data.address;

      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.suburb ||
        addr.county ||
        addr.state_district ||
        "Unknown City";

      const state = addr.state || "";
      const country = addr.country || "";
      const postalCode = addr.postcode || "";

      return {
        city,
        state,
        country,
        postalCode,
        latitude,
        longitude,
      };
    } catch (error: any) {
      console.error("[LocationService] Reverse Geocoding Error:", error);
      throw new Error(
        error.message || "Failed to fetch city details from OpenStreetMap."
      );
    }
  }

  /**
   * Manual City Search via free OpenStreetMap Nominatim API
   */
  static async searchCities(query: string): Promise<SearchCityResult[]> {
    if (!query || query.trim().length < 2) return [];

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query.trim()
      )}&addressdetails=1&limit=5`;
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "JobBoxPortal/1.0",
        },
      });

      if (!Array.isArray(response.data)) return [];

      return response.data.map((item: any) => {
        const addr = item.address || {};
        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.suburb ||
          addr.county ||
          addr.state_district ||
          item.display_name.split(",")[0] ||
          query;

        return {
          displayName: item.display_name,
          city,
          state: addr.state || "",
          country: addr.country || "",
          postalCode: addr.postcode || "",
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
        };
      });
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
