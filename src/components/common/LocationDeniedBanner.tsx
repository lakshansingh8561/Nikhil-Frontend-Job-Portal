import React, { useState } from "react";
import { FiAlertCircle, FiX, FiNavigation, FiSearch } from "react-icons/fi";
import { useLocation } from "../../hooks/useLocation";

export const LocationDeniedBanner: React.FC = () => {
  const {
    isDenied,
    error,
    dismissDeniedBanner,
    detectLocation,
    selectLocation,
    searchCities,
  } = useLocation();

  const [manualQuery, setManualQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isDenied) return null;

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;

    setIsSubmitting(true);
    try {
      const results = await searchCities(manualQuery.trim());
      if (results.length > 0) {
        const topResult = results[0];
        await selectLocation({
          city: topResult.city,
          state: topResult.state,
          country: topResult.country,
          postalCode: topResult.postalCode,
          latitude: topResult.latitude,
          longitude: topResult.longitude,
        });
      } else {
        await selectLocation({
          city: manualQuery.trim(),
          state: "",
          country: "",
          postalCode: "",
          latitude: 0,
          longitude: 0,
        });
      }
      setManualQuery("");
    } catch (err) {
      console.error("Manual city search failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-3 text-amber-900 shadow-xs animate-in slide-in-from-top-2">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium">
        {/* Error Info Message */}
        <div className="flex items-center gap-2">
          <FiAlertCircle className="text-amber-600 text-base shrink-0" />
          <span>
            {error || "Location permission denied. You can still search jobs manually."}
          </span>
        </div>

        {/* Action Controls: Manual Input + Detect Location Button */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="flex items-center gap-1 flex-1 sm:flex-none">
            <div className="relative flex-1 sm:w-44">
              <input
                type="text"
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                placeholder="📍 Enter your city..."
                className="w-full rounded-lg border border-amber-300 bg-white px-3 py-1 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-amber-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-amber-700 transition cursor-pointer"
            >
              {isSubmitting ? "Saving..." : <FiSearch />}
            </button>
          </form>

          {/* Detect Location Retry Button */}
          <button
            type="button"
            onClick={() => detectLocation(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-800 px-3 py-1 text-xs font-bold text-white hover:bg-amber-900 transition cursor-pointer"
          >
            <FiNavigation className="text-xs" />
            <span>Detect My Location</span>
          </button>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={dismissDeniedBanner}
            className="p-1 text-amber-700 hover:text-amber-950 transition cursor-pointer rounded-md"
            title="Dismiss notification"
          >
            <FiX className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
};
