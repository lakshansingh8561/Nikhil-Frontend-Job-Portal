import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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

      {/* Professional Location Selection Modal rendered at document.body level via React Portal */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[80vh] my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-[10000]">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#3C65F5]">
                    <FiMapPin className="text-lg" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#05264E]">
                      Select Your Location
                    </h3>
                    <p className="text-xs text-gray-500">
                      Find jobs and candidates near your city
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

              {/* Search Input - Sticky at top */}
              <div className="mt-4 shrink-0">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type your city (e.g. Mohali, Delhi, Mumbai)..."
                    className="w-full rounded-2xl border border-gray-200 bg-[#F8FAFC] pl-11 pr-10 py-3 text-xs sm:text-sm font-semibold text-[#05264E] placeholder:text-gray-400 outline-none focus:border-[#3C65F5] focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer p-1"
                    >
                      <FiX className="text-sm" />
                    </button>
                  ) : isSearching ? (
                    <FiLoader className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3C65F5] animate-spin text-sm" />
                  ) : null}
                </div>
              </div>

              {/* Auto Detect Location Action */}
              <div className="mt-3 shrink-0">
                <button
                  type="button"
                  onClick={handleAutoDetect}
                  disabled={isLoading}
                  className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[#3C65F5] to-[#254BD6] px-4 py-3 text-white shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
                      {isLoading ? (
                        <FiLoader className="animate-spin text-sm" />
                      ) : (
                        <FiNavigation className="text-sm" />
                      )}
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-extrabold">
                        {isLoading ? "Detecting Exact Location..." : "Use Current Location (GPS)"}
                      </h4>
                      <p className="text-[10px] text-blue-100">
                        Auto-detect city via GPS / IP
                      </p>
                    </div>
                  </div>
                  <span className="rounded-xl bg-white/20 px-2.5 py-1 text-[10px] font-bold">
                    Auto Detect
                  </span>
                </button>
              </div>

              {/* Search Results / Suggestions List */}
              <div className="mt-3 flex-1 overflow-y-auto divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-2 max-h-60">
                {/* Option to use custom typed query as city */}
                {searchQuery.trim().length >= 2 && (
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectCity({
                        displayName: searchQuery.trim(),
                        city: searchQuery.trim(),
                        state: "",
                        country: "",
                        postalCode: "",
                        latitude: 0,
                        longitude: 0,
                      })
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
                      onClick={() => handleSelectCity(res)}
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
                        <FiCheck className="text-emerald-500 font-bold text-base shrink-0" />
                      )}
                    </button>
                  ))
                ) : searchQuery.trim().length >= 2 && !isSearching ? (
                  <div className="p-4 text-center text-xs text-gray-500">
                    Click <span className="font-bold text-[#3C65F5]">Select "{searchQuery.trim()}"</span> above to use this location.
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-gray-400">
                    Type any city name above to search locations
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
