import React, { useState, useEffect, useRef } from "react";
import {
  FiMapPin,
  FiNavigation,
  FiSearch,
  FiX,
  FiLoader,
  FiCheck,
} from "react-icons/fi";
import { useLocation } from "../../hooks/useLocation";
import type { SearchCityResult } from "../../services/locationService";

interface DetectLocationButtonProps {
  className?: string;
  variant?: "badge" | "button" | "input";
  onLocationSelect?: (city: string) => void;
}

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
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLoading = status === "loading";

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

  const handleAutoDetect = async () => {
    await detectLocation(true);
    if (location?.city && onLocationSelect) {
      onLocationSelect(location.city);
    }
    setIsModalOpen(false);
  };

  const handleSelectCity = async (res: SearchCityResult) => {
    const locationData = {
      city: res.city,
      state: res.state,
      country: res.country,
      postalCode: res.postalCode,
      latitude: res.latitude,
      longitude: res.longitude,
    };

    await selectLocation(locationData);
    if (onLocationSelect) {
      onLocationSelect(res.city);
    }
    setIsModalOpen(false);
  };

  const formattedLocationLabel = location?.city
    ? `${location.city}${location.state ? `, ${location.state}` : ""}`
    : "Detect Location";

  return (
    <>
      {/* Trigger Button Variants */}
      {variant === "badge" ? (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
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
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 text-xs font-semibold text-[#3C65F5] hover:underline cursor-pointer ${className}`}
        >
          <FiMapPin /> <span>{formattedLocationLabel}</span>
        </button>
      )}

      {/* Swiggy-style Location Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#3C65F5]">
                  <FiMapPin className="text-lg" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#05264E]">
                    Your Location
                  </h3>
                  <p className="text-xs text-gray-500">
                    Find jobs near your current location or city
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 cursor-pointer rounded-full hover:bg-gray-100 transition"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Auto Detect Button Action */}
            <div className="mt-5">
              <button
                type="button"
                onClick={handleAutoDetect}
                disabled={isLoading}
                className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[#3C65F5] to-[#254BD6] p-4 text-white shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
                    {isLoading ? (
                      <FiLoader className="animate-spin text-lg" />
                    ) : (
                      <FiNavigation className="text-lg" />
                    )}
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-extrabold">
                      {isLoading ? "Detecting GPS Location..." : "Use Current Location"}
                    </h4>
                    <p className="text-[11px] text-blue-100">
                      Using HTML5 GPS & OpenStreetMap
                    </p>
                  </div>
                </div>
                <span className="rounded-xl bg-white/20 px-3 py-1 text-[11px] font-bold">
                  Auto Detect
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="w-full border-t border-gray-200" />
              <span className="absolute bg-white px-3 text-[11px] font-bold text-gray-400 uppercase">
                Or Search City Manually
              </span>
            </div>

            {/* Manual City Search Input */}
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type your city (e.g. Delhi, Mumbai, New York)..."
                className="w-full rounded-2xl border border-gray-200 bg-[#F8FAFC] pl-9 pr-4 py-3 text-xs font-semibold text-[#05264E] outline-none focus:border-[#3C65F5] focus:bg-white transition"
              />
              {isSearching && (
                <FiLoader className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3C65F5] animate-spin text-sm" />
              )}
            </div>

            {/* Search Results Dropdown List */}
            <div className="mt-3 flex-1 overflow-y-auto divide-y divide-gray-100 max-h-60 pr-1">
              {searchResults.length > 0 ? (
                searchResults.map((res, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectCity(res)}
                    className="flex w-full items-center justify-between p-3 text-left rounded-xl hover:bg-blue-50 transition cursor-pointer"
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
                      <FiCheck className="text-emerald-500 font-bold text-base shrink-0" />
                    )}
                  </button>
                ))
              ) : searchQuery.trim().length >= 2 && !isSearching ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  No matching cities found on OpenStreetMap.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
