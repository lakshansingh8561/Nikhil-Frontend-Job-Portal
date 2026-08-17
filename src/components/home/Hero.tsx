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
    <section className="relative overflow-hidden w-full bg-[#F5F8FF] pt-6 sm:pt-8 lg:pt-10 pb-12">
      <style>{`
        @keyframes floatVertical {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatHorizontal {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(16px); }
        }
      `}</style>

      {/* Background Soft Blue Blob */}
      <div
        className="absolute pointer-events-none rounded-full hidden sm:block"
        style={{
          top: "-80px",
          right: "-40px",
          width: "550px",
          height: "550px",
          backgroundColor: "#E8F0FE",
          filter: "blur(60px)",
          opacity: 0.8,
        }}
      />

      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 relative z-10">
        <div className="grid items-start gap-6 lg:gap-8 lg:grid-cols-12">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col">
            <h1 className="font-extrabold text-[#05264E] text-4xl sm:text-5xl lg:text-6xl leading-[1.12] tracking-tight">
              The{" "}
              <span className="inline-block font-extrabold text-[#3C65F5] bg-[#D5E4FF] px-3.5 py-1 rounded-2xl my-1 whitespace-nowrap">
                Easiest Way
              </span>
              <br />
              to Get Your New
              <br />
              Job
            </h1>

            <p className="font-medium text-[#66789C] text-base sm:text-lg leading-relaxed mt-4 mb-6 max-w-xl">
              Each month, more than 3 million job seekers turn to website in their search for work, making over 140,000 applications every single day.
            </p>

            {/* Search Bar Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-[560px] bg-white rounded-2xl p-2 shadow-lg border border-[#EAEFF7]"
            >
              {/* Industry Select */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:flex-1 border-b sm:border-b-0 sm:border-r border-gray-100">
                <FiBriefcase className="text-gray-400 text-base shrink-0" />
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-[#05264E] outline-none cursor-pointer"
                >
                  <option value="">Industry</option>
                  <option value="Software">Software & Tech</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>

              {/* Location Input */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:flex-1 border-b sm:border-b-0 sm:border-r border-gray-100">
                <FiMapPin className="text-gray-400 text-base shrink-0" />
                <input
                  type="text"
                  placeholder="Location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-xs font-medium text-[#05264E] placeholder-gray-400 outline-none"
                />
              </div>

              {/* Keyword Input */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:flex-1">
                <FiGrid className="text-gray-400 text-base shrink-0" />
                <input
                  type="text"
                  placeholder="Your keyword..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-transparent text-xs font-medium text-[#05264E] placeholder-gray-400 outline-none"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full sm:w-auto h-11 px-6 text-xs font-semibold text-white bg-[#3C65F5] hover:bg-[#254BD6] rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <FiSearch className="text-base" />
                <span>Search</span>
              </button>
            </form>

            {/* Popular Searches */}
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-[#66789C]">
              <span className="font-bold text-[#05264E]">Popular Searches:</span>
              {popularSearches.map((item, idx) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handlePopularSearch(item)}
                  className="cursor-pointer font-medium text-[#66789C] hover:text-[#3C65F5] underline underline-offset-2 transition"
                >
                  {item}
                  {idx < popularSearches.length - 1 ? "," : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Banner Images Top-Aligned with Floating Animations */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-end space-y-6">
            {/* Top Banner Image Card (Up and Down floating animation) */}
            <div
              className="w-full max-w-[360px] rounded-[32px] overflow-hidden shadow-lg border-[4px] border-[#3C65F5] bg-[#3C65F5]"
              style={{ animation: "floatVertical 4s ease-in-out infinite" }}
            >
              <img
                src={Banner1}
                alt="JobBox Candidate Banner 1"
                className="w-full h-auto block object-cover"
              />
            </div>

            {/* Bottom Banner Image Card (Left and Right floating animation) */}
            <div
              className="w-full max-w-[320px] rounded-[28px] overflow-hidden shadow-lg border-[4px] border-[#3C65F5] bg-[#3C65F5] self-end"
              style={{ animation: "floatHorizontal 5s ease-in-out infinite" }}
            >
              <img
                src={Banner2}
                alt="JobBox Candidate Banner 2"
                className="w-full h-auto block object-cover"
              />
            </div>
          </div>
        </div>

        {/* Live Search Results */}
        {hasSearch && (
          <div className="mt-10 rounded-3xl border border-[#EAEFF7] bg-white p-6 shadow-xl text-[#05264E]">
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#EAEFF7]">
              <div>
                <h3 className="text-lg font-bold text-[#05264E]">
                  Search Results
                </h3>
                <p className="text-xs font-medium text-[#66789C] mt-0.5">
                  {isLoading
                    ? "Searching live jobs..."
                    : `Found ${jobsList.length} matching position${jobsList.length === 1 ? "" : "s"}`}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                <FiX /> Clear Search
              </button>
            </div>

            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#3C65F5] border-t-transparent" />
              </div>
            ) : jobsList.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {jobsList.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-[#EAEFF7]">
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