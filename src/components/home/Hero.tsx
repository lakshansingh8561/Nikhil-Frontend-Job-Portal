import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiMapPin,
  FiSearch,
  FiGrid,
  FiX,
} from "react-icons/fi";
import Banner1 from "../../assets/images/banner1.png";
import Banner2 from "../../assets/images/banner2.png";
import JobCard from "../jobs/JobCard";
import { useGetJobsQuery } from "../../features/jobs/api/jobsApi";

const popularSearches = [
  "Designer",
  "Developer",
  "Web",
  "IOS",
  "PHP",
  "Senior",
  "Engineer",
];

const Hero = () => {
  const navigate = useNavigate();
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");

  const hasSearch = Boolean(industry.trim() || location.trim() || keyword.trim());

  const searchQuery = keyword.trim() ? keyword.trim() : undefined;
  const locationQuery = location.trim() ? location.trim() : undefined;
  const industryQuery = industry.trim() ? industry.trim() : undefined;

  const { data, isLoading } = useGetJobsQuery(
    hasSearch
      ? {
          search: searchQuery,
          location: locationQuery,
          industry: industryQuery,
          limit: 12,
        }
      : undefined,
    { skip: !hasSearch }
  );

  const jobsList = data?.jobs || [];

  const handleClear = () => {
    setIndustry("");
    setLocation("");
    setKeyword("");
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("search", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    if (industry.trim()) params.set("industry", industry.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handlePopularSearch = (term: string) => {
    navigate(`/jobs?search=${encodeURIComponent(term)}`);
  };

  return (
    <section
      className="relative overflow-hidden w-full bg-[#F5F8FF]"
      style={{
        paddingTop: "100px",
        paddingBottom: hasSearch ? "60px" : "80px",
      }}
    >
      <style>{`
        @keyframes floatVertical {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatHorizontal {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(16px); }
        }
        @media (min-width: 640px) {
          .hero-section-pad { padding-top: 120px; }
        }
        @media (min-width: 1024px) {
          .hero-section-pad { padding-top: 145px; }
        }
      `}</style>

      {/* Background blob */}
      <div
        className="absolute pointer-events-none rounded-full hidden sm:block"
        style={{
          top: "-100px",
          right: "-60px",
          width: "580px",
          height: "580px",
          backgroundColor: "#E8F0FE",
          filter: "blur(70px)",
          opacity: 0.75,
        }}
      />

      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-5">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* Left Column */}
          <div className="lg:col-span-6 xl:col-span-7 z-10 flex flex-col justify-center pt-6 sm:pt-8 lg:pt-0">
            <h1 className="font-bold text-[#05264E] text-[36px] xs:text-[42px] sm:text-[52px] lg:text-[64px] leading-[1.1] tracking-tight">
              The{" "}
              <span className="inline-block font-bold text-[#3B5BDB] bg-[#D5E4FF] px-3 sm:px-4 py-1 rounded-[14px] my-1 whitespace-nowrap">
                Easiest Way
              </span>
              <br />
              to Get Your New
              <br />
              Job
            </h1>

            <p className="font-medium text-[#66789C] text-[15px] sm:text-[18px] lg:text-[22px] leading-[1.6] mt-5 mb-7 sm:mb-9 max-w-[500px]">
              Each month, more than 3 million job seekers turn to website in
              their search for work, making over 140,000 applications every
              single day
            </p>

            {/* Search Bar Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-[560px]"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                padding: "8px 10px",
                boxShadow: "0 15px 40px rgba(50, 75, 130, 0.08)",
                border: "1px solid #EAEFF7",
              }}
            >
              {/* Industry Select */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:flex-1 border-b sm:border-b-0 border-gray-100">
                <FiBriefcase className="text-gray-400 text-lg shrink-0" />
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-gray-500 focus:text-slate-800 outline-none cursor-pointer"
                >
                  <option value="">Industry</option>
                  <option value="Software">Software & Tech</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>

              <div className="hidden sm:block h-8 w-[1px] bg-gray-200 shrink-0" />

              {/* Location Input */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:flex-1 border-b sm:border-b-0 border-gray-100">
                <FiMapPin className="text-gray-400 text-lg shrink-0" />
                <input
                  type="text"
                  placeholder="Location (e.g. NY)..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-sm font-normal text-slate-800 placeholder-gray-400 outline-none"
                />
              </div>

              <div className="hidden sm:block h-8 w-[1px] bg-gray-200 shrink-0" />

              {/* Keyword Input */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:flex-1">
                <FiGrid className="text-gray-400 text-lg shrink-0" />
                <input
                  type="text"
                  placeholder="Your keyword..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-transparent text-sm font-normal text-slate-800 placeholder-gray-400 outline-none"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full sm:w-auto h-[48px] sm:h-[52px] px-5 sm:px-7 font-semibold flex items-center justify-center gap-2.5 transition duration-200 whitespace-nowrap shrink-0 cursor-pointer text-white bg-[#3B5BDB] hover:bg-[#2B47C5] rounded-[12px] shadow-md shadow-blue-500/20 text-sm"
              >
                <FiSearch className="text-lg shrink-0" />
                <span>Search</span>
              </button>
            </form>

            {/* Popular Searches */}
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs lg:text-sm text-[#66789C]">
              <span className="font-semibold text-[#05264E] whitespace-nowrap">
                Popular Searches :
              </span>
              {popularSearches.map((item, idx) => {
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handlePopularSearch(item)}
                    className="cursor-pointer transition-colors whitespace-nowrap hover:text-[#3B5BDB] underline underline-offset-2"
                  >
                    {item}
                    {idx < popularSearches.length - 1 ? "," : ""}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Hero Banner Images - hidden on mobile for cleaner layout */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-5 relative z-10 flex-col items-center lg:items-end justify-center">
            <div className="relative max-w-[420px] w-full flex flex-col items-end">
              {/* Dotted Grid Pattern */}
              <div className="absolute -top-6 -right-6 z-0 pointer-events-none">
                <svg width="110" height="90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="dotGridHeroTop" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                    <circle cx="2.5" cy="2.5" r="2.5" fill="#3B5BDB" fillOpacity="0.35" />
                  </pattern>
                  <rect width="110" height="90" fill="url(#dotGridHeroTop)" />
                </svg>
              </div>

              {/* Top Banner Image */}
              <div
                className="relative z-10 max-w-[380px] w-full rounded-[32px] overflow-hidden shadow-xl border-[4px] border-[#3B5BDB] bg-[#3B5BDB] flex leading-none"
                style={{ animation: "floatVertical 4s ease-in-out infinite" }}
              >
                <img
                  src={Banner1}
                  alt="JobBox Hero Banner 1"
                  className="w-full h-full block object-cover shrink-0"
                />
              </div>

              {/* Bottom Banner Area */}
              <div className="relative w-full flex items-center justify-end mt-6 sm:mt-8">
                <div className="absolute left-2 bottom-2 z-0 pointer-events-none">
                  <svg width="100" height="70" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="dotGridHeroBot" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                      <circle cx="2.5" cy="2.5" r="2.5" fill="#3B5BDB" fillOpacity="0.35" />
                    </pattern>
                    <rect width="100" height="70" fill="url(#dotGridHeroBot)" />
                  </svg>
                </div>

                {/* Bottom Banner Image */}
                <div
                  className="relative z-10 max-w-[320px] w-[82%] rounded-[28px] overflow-hidden shadow-xl border-[4px] border-[#3B5BDB] bg-[#3B5BDB] flex leading-none"
                  style={{ animation: "floatHorizontal 5s ease-in-out infinite" }}
                >
                  <img
                    src={Banner2}
                    alt="JobBox Hero Banner 2"
                    className="w-full h-full block object-cover shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Search Results */}
        {hasSearch && (
          <div className="mt-8 sm:mt-10 rounded-3xl border border-[#EAEFF7] bg-white p-4 sm:p-6 lg:p-8 shadow-xl relative z-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#EAEFF7]">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#05264E]">
                  Search Results
                </h3>
                <p className="text-xs font-medium text-[#66789C] mt-0.5">
                  {isLoading
                    ? "Searching live jobs..."
                    : `Found ${jobsList.length} matching job${jobsList.length === 1 ? "" : "s"}`}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition cursor-pointer self-start sm:self-auto"
              >
                <FiX />
                <span>Close Search</span>
              </button>
            </div>

            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3B5BDB] border-t-transparent" />
              </div>
            ) : jobsList.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {jobsList.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="p-6 sm:p-8 text-center bg-[#F8FAFC] rounded-2xl border border-[#EAEFF7]">
                <p className="text-sm font-bold text-[#05264E]">No jobs found matching your search criteria</p>
                <p className="text-xs text-[#66789C] mt-1">
                  Try searching for a different keyword or location.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;