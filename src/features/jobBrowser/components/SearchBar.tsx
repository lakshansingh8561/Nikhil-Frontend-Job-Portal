import React, { useEffect } from "react";
import { FiSearch, FiMapPin, FiBriefcase, FiAward, FiNavigation } from "react-icons/fi";
import { useLocation } from "../../../hooks/useLocation";

interface SearchBarProps {
  search: string;
  setSearch: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  employmentType: string;
  setEmploymentType: (val: string) => void;
  experienceLevel: string;
  setExperienceLevel: (val: string) => void;
  onSearchSubmit: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  setSearch,
  location,
  setLocation,
  employmentType,
  setEmploymentType,
  experienceLevel,
  setExperienceLevel,
  onSearchSubmit,
}) => {
  const { location: detectedLoc, detectLocation } = useLocation();

  // Auto prefill location field with detected city
  useEffect(() => {
    if (!location && detectedLoc?.city) {
      setLocation(detectedLoc.city);
    }
  }, [detectedLoc, location, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="sticky top-0 z-20 rounded-3xl border border-[#EAEFF7] bg-white/95 backdrop-blur-xs p-4 sm:p-5 shadow-sm mb-6 transition-all">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-12 items-center">
        {/* Search Input */}
        <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] px-4 py-3 border border-[#EAEFF7] lg:col-span-3">
          <FiSearch className="text-[#3C65F5] text-lg shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Job title, keyword..."
            className="w-full bg-transparent text-sm font-medium text-[#05264E] outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Location Dropdown / Input with Auto Detect Button */}
        <div className="relative flex items-center gap-2 rounded-2xl bg-[#F8FAFC] px-4 py-3 border border-[#EAEFF7] lg:col-span-3">
          <FiMapPin className="text-[#3C65F5] text-lg shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location, city..."
            className="w-full bg-transparent text-sm font-medium text-[#05264E] outline-none placeholder:text-gray-400 pr-6"
          />
          <button
            type="button"
            onClick={() => detectLocation(true)}
            title="Auto detect location"
            className="absolute right-3.5 p-1 text-gray-400 hover:text-[#3C65F5] transition cursor-pointer"
          >
            <FiNavigation className="text-xs" />
          </button>
        </div>

        {/* Employment Type Dropdown */}
        <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] px-4 py-3 border border-[#EAEFF7] lg:col-span-2">
          <FiBriefcase className="text-[#3C65F5] text-lg shrink-0" />
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-[#05264E] outline-none cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="REMOTE">Remote</option>
          </select>
        </div>

        {/* Experience Dropdown */}
        <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] px-4 py-3 border border-[#EAEFF7] lg:col-span-2">
          <FiAward className="text-[#3C65F5] text-lg shrink-0" />
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-[#05264E] outline-none cursor-pointer"
          >
            <option value="">All Levels</option>
            <option value="FRESHER">Fresher</option>
            <option value="ONE_TO_TWO">1-2 Years</option>
            <option value="THREE_TO_FIVE">3-5 Years</option>
            <option value="FIVE_PLUS">5+ Years</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-2">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3C65F5] py-3 px-6 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#254BD6] hover:shadow-lg active:scale-[0.98] cursor-pointer"
          >
            <FiSearch className="text-base" />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
