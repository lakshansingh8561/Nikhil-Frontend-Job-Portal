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
import iconBottomBanner from "../../assets/images/icon-bottom-banner.png";
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
    <section className="relative overflow-hidden w-full bg-[#F5F8FF] pt-8 sm:pt-10 lg:pt-[50px] pb-20 sm:pb-24 lg:pb-28">
      <style>{`
        @keyframes heroThumb1 {
          0% { transform: translateY(-16px) translateX(0px); }
          50% { transform: translateY(2px) translateX(4px); }
          100% { transform: translateY(-16px) translateX(0px); }
        }
        @keyframes heroThumb2 {
          0% { transform: translateY(2px) translateX(0px); }
          50% { transform: translateY(-16px) translateX(-4px); }
          100% { transform: translateY(2px) translateX(0px); }
        }
        @keyframes floatVertical {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatHorizontal {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(14px); }
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

      <div className="mx-auto w-full max-w-[1020px] px-6 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="w-full max-w-[490px] flex flex-col shrink-0">
            <h1 className="font-extrabold text-[#05264E] text-4xl sm:text-5xl lg:text-[48px] leading-[1.25] tracking-tight font-['Plus_Jakarta_Sans',sans-serif] max-w-[436.66px]">
              The{" "}
              <span className="relative inline-block font-extrabold text-[#3C65F5] whitespace-nowrap">
                <span className="relative z-10">Easiest Way</span>
                <span
                  className="absolute bottom-2 -left-1.5 -right-1.5 h-[45%] bg-[#D5E4FF] -z-0 rounded-[3px]"
                  aria-hidden="true"
                />
              </span>
              <br />
              to Get Your New
              <br />
              Job
            </h1>

            <div className="banner-description font-normal text-[#4F5E64] text-[18px] leading-[24px] mt-[20px] mb-[30px] max-w-[436.66px] font-['Plus_Jakarta_Sans',sans-serif]">
              Each month, more than 3 million job seekers turn to
              <br />
              website in their search for work, making over
              <br />
              140,000
              <br />
              applications every single day
            </div>

            {/* Search Bar Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-[500px] bg-white rounded-2xl p-2 shadow-lg border border-[#EAEFF7]"
            >
              {/* Industry Select */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:flex-1 border-b sm:border-b-0 sm:border-r border-gray-100">
                <FiBriefcase className="text-gray-400 text-base shrink-0" />
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-[#05264E] outline-none cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
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
                  className="w-full bg-transparent text-xs font-medium text-[#05264E] placeholder-gray-400 outline-none font-['Plus_Jakarta_Sans',sans-serif]"
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
                  className="w-full bg-transparent text-xs font-medium text-[#05264E] placeholder-gray-400 outline-none font-['Plus_Jakarta_Sans',sans-serif]"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full sm:w-auto h-11 px-6 text-xs font-semibold text-white bg-[#3C65F5] hover:bg-[#254BD6] rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
              >
                <FiSearch className="text-base" />
                <span>Search</span>
              </button>
            </form>

            {/* Popular Searches (mt-60 = 60px margin-top) */}
            <div className="list-tags-banner mt-[60px] font-['Plus_Jakarta_Sans',sans-serif]">
              <div className="text-[14px] leading-[18px] font-bold text-[#4F5E64]">
                Popular
              </div>
              <div className="flex flex-wrap items-center text-[14px] leading-[18px] text-[#4F5E64] mt-0.5">
                <strong className="font-bold text-[#4F5E64] mr-1">Searches:</strong>
                {popularSearches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handlePopularSearch(item)}
                    className="inline-block cursor-pointer font-normal text-[14px] leading-[18px] text-[#4F5E64] hover:text-[#3C65F5] underline underline-offset-2 transition ml-[2px] mr-[5px]"
                  >
                    {item},
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Banner Images Stacked from Exact Same Top Height Line */}
          <div className="hidden lg:flex flex-col relative w-full max-w-[400px] shrink-0">
            {/* Top-Right Dotted Pattern Icon */}
            <div
              className="absolute -top-3 right-0 z-0 pointer-events-none select-none"
              style={{ animation: "floatVertical 3.5s ease-in-out infinite" }}
            >
              <img
                src={iconBottomBanner}
                alt="Decorative Pattern"
                className="w-auto h-auto opacity-75"
              />
            </div>

            {/* Top Banner Image Card (Banner1: 378px x 329px with rounded alternating float) */}
            <div
              className="shape-1 w-[378px] max-w-[378px] self-start"
              style={{ animation: "heroThumb1 3.5s ease-in-out infinite" }}
            >
              <img
                src={Banner1}
                alt="JobBox Candidate Banner 1"
                className="w-full h-auto block"
                width={378}
                height={329}
              />
            </div>

            {/* Bottom Section Wrapper: Houses Dotted Pattern directly under Banner 1, and Banner 2 on the right */}
            <div className="relative mt-10 w-full flex items-center justify-between">
              {/* Dotted Pattern Icon directly under Banner 1 */}
              <div
                className="pointer-events-none select-none pl-2"
                style={{ animation: "floatVertical 3.5s ease-in-out infinite" }}
              >
                <img
                  src={iconBottomBanner}
                  alt="Decorative Pattern"
                  className="w-auto h-auto opacity-75"
                />
              </div>

              {/* Bottom Banner Image Card (Banner2: rounded alternating float counter to Banner 1) */}
              <div
                className="shape-2 w-[295px] max-w-[295px] self-end ml-auto -mr-4"
                style={{ animation: "heroThumb2 3.5s ease-in-out infinite" }}
              >
                <img
                  src={Banner2}
                  alt="JobBox Candidate Banner 2"
                  className="img-responsive w-full h-auto block max-w-full transition-all duration-300 ease-out"
                />
              </div>
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

      {/* Bottom Diagonal Angle Divider matching JobBox template */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden leading-none z-0">
        <svg
          className="relative block w-full h-[60px] sm:h-[80px] lg:h-[105px]"
          viewBox="0 0 1920 105"
          preserveAspectRatio="none"
        >
          <polygon points="0,105 1920,0 1920,105" fill="#FFFFFF" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;