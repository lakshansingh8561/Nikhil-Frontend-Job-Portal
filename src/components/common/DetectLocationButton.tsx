import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FiMapPin,
  FiNavigation,
  FiSearch,
  FiX,
  FiLoader,
  FiGlobe,
  FiCompass,
  FiCheckCircle,
} from "react-icons/fi";
import { useLocation } from "../../hooks/useLocation";
import type { SearchCityResult } from "../../services/locationService";

interface DetectLocationButtonProps {
  className?: string;
  variant?: "badge" | "button" | "input";
  onLocationSelect?: (city: string) => void;
}

const POPULAR_CITIES = [
  { city: "Chandigarh", state: "Punjab", country: "India", latitude: 30.7333, longitude: 76.7794, icon: "🏢" },
  { city: "Mohali", state: "Punjab", country: "India", latitude: 30.6799, longitude: 76.7221, icon: "📍" },
  { city: "Delhi NCR", state: "Delhi", country: "India", latitude: 28.6139, longitude: 77.2090, icon: "🏙️" },
  { city: "Bengaluru", state: "Karnataka", country: "India", latitude: 12.9716, longitude: 77.5946, icon: "🚀" },
  { city: "Mumbai", state: "Maharashtra", country: "India", latitude: 19.0760, longitude: 72.8777, icon: "🌆" },
  { city: "Hyderabad", state: "Telangana", country: "India", latitude: 17.3850, longitude: 78.4867, icon: "💼" },
  { city: "Pune", state: "Maharashtra", country: "India", latitude: 18.5204, longitude: 73.8567, icon: "⚡" },
];

export const DetectLocationButton: React.FC<DetectLocationButtonProps> = ({
  className = "",
  variant = "badge",
  onLocationSelect,
}) => {
  const {
    location,
    status,
    detectLocation,
    selectLocation,
    searchCities,
  } = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchCityResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Dynamic Map Coordinates state
  const [previewCoords, setPreviewCoords] = useState<{
    city: string;
    state?: string;
    latitude: number;
    longitude: number;
  } | null>(null);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLoading = status === "loading";

  // Sync preview coords when location updates or modal opens
  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      setPreviewCoords({
        city: location.city || "Chandigarh",
        state: location.state || "",
        latitude: location.latitude,
        longitude: location.longitude,
      });
    } else {
      setPreviewCoords({
        city: "Chandigarh",
        state: "Punjab",
        latitude: 30.7333,
        longitude: 76.7794,
      });
    }
  }, [location, isModalOpen]);

  // Handle live manual city search with debouncing
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchCities(searchQuery);
        setSearchResults(results);
        if (results.length > 0 && results[0].latitude && results[0].longitude) {
          setPreviewCoords({
            city: results[0].city,
            state: results[0].state,
            latitude: results[0].latitude,
            longitude: results[0].longitude,
          });
        }
      } catch (e) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery, searchCities]);

  const handleAutoDetect = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await detectLocation(true);
    if (location?.city && onLocationSelect) {
      onLocationSelect(location.city);
    }
    setIsModalOpen(false);
  };

  const handleSelectCity = async (res: SearchCityResult, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const locationData = {
      city: res.city,
      state: res.state,
      country: res.country,
      postalCode: res.postalCode,
      latitude: res.latitude || 30.7333,
      longitude: res.longitude || 76.7794,
    };

    setPreviewCoords({
      city: res.city,
      state: res.state,
      latitude: res.latitude || 30.7333,
      longitude: res.longitude || 76.7794,
    });

    await selectLocation(locationData);
    if (onLocationSelect) {
      onLocationSelect(res.city);
    }
    setIsModalOpen(false);
  };

  const handleSelectPopularCity = (item: (typeof POPULAR_CITIES)[0], e?: React.MouseEvent) => {
    handleSelectCity({
      displayName: `${item.city}, ${item.state}, ${item.country}`,
      city: item.city,
      state: item.state,
      country: item.country,
      postalCode: "",
      latitude: item.latitude,
      longitude: item.longitude,
    }, e);
  };

  const formattedLocationLabel = location?.city
    ? `${location.city}${location.state ? `, ${location.state}` : ""}`
    : "Detect Location";

  const mapLat = previewCoords?.latitude || location?.latitude || 30.7333;
  const mapLon = previewCoords?.longitude || location?.longitude || 76.7794;
  const mapCity = previewCoords?.city || location?.city || "Chandigarh";
  const mapState = previewCoords?.state || location?.state || "Punjab";

  return (
    <>
      {/* Trigger Button Variants */}
      {variant === "badge" ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className={`group flex items-center gap-2 rounded-full border border-[#EAEFF7] bg-[#F8FAFC] px-3.5 py-1.5 text-xs font-extrabold text-[#05264E] hover:border-[#3C65F5] hover:bg-blue-50 transition cursor-pointer ${className}`}
          title="Detect or Change Location"
        >
          {isLoading ? (
            <FiLoader className="animate-spin text-[#3C65F5] text-sm" />
          ) : (
            <FiMapPin className="text-[#3C65F5] text-sm group-hover:scale-110 transition-transform" />
          )}
          <span className="max-w-[140px] truncate">
            {isLoading ? "Locating..." : formattedLocationLabel}
          </span>
        </button>
      ) : variant === "button" ? (
        <button
          type="button"
          onClick={handleAutoDetect}
          disabled={isLoading}
          className={`inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#254BD6] transition disabled:opacity-50 cursor-pointer ${className}`}
        >
          {isLoading ? (
            <FiLoader className="animate-spin text-sm" />
          ) : (
            <FiNavigation className="text-sm" />
          )}
          <span>{isLoading ? "Detecting..." : "Detect My Location"}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className={`flex items-center gap-2 text-xs font-semibold text-[#3C65F5] hover:underline cursor-pointer ${className}`}
        >
          <FiMapPin /> <span>{formattedLocationLabel}</span>
        </button>
      )}

      {/* Ultra-Professional Location & Map Selection Modal via Portal */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-4xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-gray-100 flex flex-col md:flex-row gap-6 max-h-[90vh] my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-[10000]">
              
              {/* Left Column: Search & Quick Selection */}
              <div className="flex-1 flex flex-col min-w-0 max-h-[80vh] overflow-y-auto no-scrollbar pr-1">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E40AF] to-[#3C65F5] text-white shadow-md">
                      <FiCompass className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#05264E]">
                        Select Your Location
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        Find jobs and candidates matched near your city
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsModalOpen(false);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-700 cursor-pointer rounded-full hover:bg-gray-100 transition md:hidden"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>

                {/* Search Input */}
                <div className="mt-4 shrink-0">
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type city name (e.g. Mohali, Chandigarh, Delhi)..."
                      className="w-full rounded-2xl border border-gray-200 bg-[#F8FAFC] pl-11 pr-10 py-3 text-xs sm:text-sm font-semibold text-[#05264E] placeholder:text-gray-400 outline-none focus:border-[#3C65F5] focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                    />
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSearchQuery("");
                        }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer p-1"
                      >
                        <FiX className="text-sm" />
                      </button>
                    ) : isSearching ? (
                      <FiLoader className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3C65F5] animate-spin text-sm" />
                    ) : null}
                  </div>
                </div>

                {/* GPS Auto-Detect Banner Button */}
                <div className="mt-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleAutoDetect}
                    disabled={isLoading}
                    className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[#1D4ED8] via-[#3C65F5] to-[#254BD6] p-3.5 text-white shadow-md hover:shadow-lg transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs shadow-inner">
                        {isLoading ? (
                          <FiLoader className="animate-spin text-base" />
                        ) : (
                          <FiNavigation className="text-base animate-pulse" />
                        )}
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-black tracking-wide">
                          {isLoading ? "Locating exact coordinates..." : "Use Current GPS Location"}
                        </h4>
                        <p className="text-[10px] text-blue-100 font-medium">
                          Auto-detect city & location via browser GPS
                        </p>
                      </div>
                    </div>
                    <span className="rounded-xl bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                      Auto Detect
                    </span>
                  </button>
                </div>

                {/* Popular Job Hubs Grid */}
                <div className="mt-4 shrink-0">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#66789C] mb-2 flex items-center gap-1.5">
                    <FiGlobe className="text-[#3C65F5]" /> Popular Tech & Job Hubs
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_CITIES.map((cityObj) => {
                      const isSelected = mapCity.toLowerCase() === cityObj.city.toLowerCase();
                      return (
                        <button
                          key={cityObj.city}
                          type="button"
                          onClick={(e) => handleSelectPopularCity(cityObj, e)}
                          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition border cursor-pointer ${
                            isSelected
                              ? "bg-[#3C65F5] text-white border-[#3C65F5] shadow-xs"
                              : "bg-[#F8FAFC] text-[#05264E] border-gray-200 hover:bg-blue-50 hover:border-blue-200"
                          }`}
                        >
                          <span>{cityObj.icon}</span>
                          <span>{cityObj.city}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Search Suggestions & Results List */}
                <div className="mt-4 flex-1 overflow-y-auto divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-2 min-h-[160px]">
                  {searchQuery.trim().length >= 2 && (
                    <button
                      type="button"
                      onClick={(e) =>
                        handleSelectCity({
                          displayName: searchQuery.trim(),
                          city: searchQuery.trim(),
                          state: "",
                          country: "",
                          postalCode: "",
                          latitude: mapLat,
                          longitude: mapLon,
                        }, e)
                      }
                      className="flex w-full items-center justify-between p-3 text-left rounded-xl hover:bg-blue-100/60 bg-blue-50/50 transition cursor-pointer mb-1 border border-blue-100"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FiMapPin className="text-[#3C65F5] shrink-0" />
                        <span className="text-xs font-bold text-[#3C65F5] truncate">
                          Select "{searchQuery.trim()}"
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#3C65F5] bg-white px-2 py-0.5 rounded-md shadow-2xs">
                        Custom City
                      </span>
                    </button>
                  )}

                  {searchResults.length > 0 ? (
                    searchResults.map((res, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => handleSelectCity(res, e)}
                        className="flex w-full items-center justify-between p-3 text-left rounded-xl hover:bg-white transition cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <FiMapPin className="text-[#3C65F5] mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-[#05264E] truncate">
                              {res.city}
                            </h4>
                            <p className="text-[11px] text-gray-500 truncate">
                              {res.displayName}
                            </p>
                          </div>
                        </div>
                        {location?.city === res.city && (
                          <FiCheckCircle className="text-emerald-500 font-bold text-base shrink-0" />
                        )}
                      </button>
                    ))
                  ) : searchQuery.trim().length >= 2 && !isSearching ? (
                    <div className="p-4 text-center text-xs text-gray-500">
                      Click <span className="font-bold text-[#3C65F5]">Select "{searchQuery.trim()}"</span> to use this city.
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-1.5 py-6">
                      <FiMapPin className="text-xl text-gray-300" />
                      <span>Search any city above or pick from popular hubs</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Live Interactive Map Box */}
              <div className="w-full md:w-1/2 flex flex-col shrink-0 min-h-[280px] md:min-h-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 relative">
                {/* Close Button Desktop */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsModalOpen(false);
                  }}
                  className="hidden md:flex absolute top-3 right-3 z-30 h-8 w-8 items-center justify-center text-gray-600 bg-white/90 hover:bg-white rounded-full shadow-md backdrop-blur-xs transition cursor-pointer"
                  title="Close Modal"
                >
                  <FiX className="text-lg" />
                </button>

                {/* Map Overlay Header Card */}
                <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-md border border-gray-100 max-w-[220px]">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                      Live Map View
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-[#05264E] mt-0.5 truncate">
                    {mapCity}{mapState ? `, ${mapState}` : ""}
                  </h4>
                  <p className="text-[10px] font-semibold text-[#3C65F5] mt-0.5">
                    📍 Lat {mapLat.toFixed(3)}°, Lon {mapLon.toFixed(3)}°
                  </p>
                </div>

                {/* Interactive OpenStreetMap Embed */}
                <iframe
                  title="Location Interactive Map Preview"
                  width="100%"
                  height="100%"
                  className="w-full h-full min-h-[280px] border-0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    mapLon - 0.08
                  }%2C${mapLat - 0.08}%2C${mapLon + 0.08}%2C${
                    mapLat + 0.08
                  }&layer=mapnik&marker=${mapLat}%2C${mapLon}`}
                />

                {/* Bottom Map Confirmation Footer */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <FiMapPin className="text-[#3C65F5] shrink-0" />
                    <span className="text-xs font-bold text-[#05264E] truncate">
                      {mapCity} Selected
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      handleSelectCity({
                        displayName: `${mapCity}, ${mapState}`,
                        city: mapCity,
                        state: mapState,
                        country: "India",
                        postalCode: "",
                        latitude: mapLat,
                        longitude: mapLon,
                      }, e);
                    }}
                    className="rounded-xl bg-[#3C65F5] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#254BD6] transition cursor-pointer shrink-0"
                  >
                    Confirm City
                  </button>
                </div>
              </div>

            </div>
          </div>,
          document.body
        )}
    </>
  );
};
