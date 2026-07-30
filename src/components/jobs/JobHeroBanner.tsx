import { FiBriefcase, FiMapPin, FiGrid, FiSearch } from "react-icons/fi";

interface JobHeroBannerProps {
  totalJobs: number;
  industry: string;
  setIndustry: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  keyword: string;
  setKeyword: (val: string) => void;
  onSearch: () => void;
}

const JobHeroBanner = ({
  totalJobs,
  industry,
  setIndustry,
  location,
  setLocation,
  keyword,
  setKeyword,
  onSearch,
}: JobHeroBannerProps) => {
  return (
    <div className="relative mb-12 overflow-hidden rounded-3xl bg-[#EBF2FF] px-6 py-12 text-center md:px-12 md:py-16">
      {/* Decorative Vector Illustrations */}
      <div className="pointer-events-none absolute left-6 bottom-0 hidden lg:block w-48 opacity-90">
        <svg viewBox="0 0 200 200" className="w-full h-auto">
          <circle cx="100" cy="100" r="80" fill="#D5E4FF" />
          <path d="M70 140 H130 V160 H70 Z" fill="#3C65F5" />
          <circle cx="100" cy="90" r="30" fill="#05264E" />
        </svg>
      </div>

      <div className="pointer-events-none absolute right-6 bottom-0 hidden lg:block w-52 opacity-90">
        <svg viewBox="0 0 200 200" className="w-full h-auto">
          <circle cx="100" cy="100" r="80" fill="#D5E4FF" />
          <rect x="60" y="110" width="80" height="50" rx="10" fill="#3C65F5" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold text-[#05264E] sm:text-4xl md:text-5xl">
          <span className="text-[#3C65F5]">{totalJobs > 0 ? totalJobs : 22} Jobs</span> Available Now
        </h1>
        <p className="mt-4 text-sm md:text-base text-[#66789C] leading-relaxed max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?
        </p>

        {/* Floating Search Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center rounded-2xl bg-white p-2.5 shadow-[0_15px_40px_rgba(50,75,130,0.1)] border border-[#EAEFF7] gap-2">
          {/* Industry Select */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 w-full md:w-auto md:flex-1 border-b md:border-b-0 border-gray-100">
            <FiBriefcase className="text-gray-400 text-lg shrink-0" />
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-[#05264E] outline-none cursor-pointer"
            >
              <option value="">Industry</option>
              <option value="Software">Software & Tech</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
            </select>
          </div>

          <div className="hidden md:block h-8 w-[1px] bg-gray-200 shrink-0" />

          {/* Location Select */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 w-full md:w-auto md:flex-1 border-b md:border-b-0 border-gray-100">
            <FiMapPin className="text-gray-400 text-lg shrink-0" />
            <input
              type="text"
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none"
            />
          </div>

          <div className="hidden md:block h-8 w-[1px] bg-gray-200 shrink-0" />

          {/* Keyword Input */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 w-full md:w-auto md:flex-1">
            <FiGrid className="text-gray-400 text-lg shrink-0" />
            <input
              type="text"
              placeholder="Your keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-transparent text-sm font-normal text-[#05264E] placeholder-gray-400 outline-none"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={onSearch}
            className="w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#3C65F5] px-7 py-3.5 font-semibold text-white transition hover:bg-[#254BD6] shrink-0 cursor-pointer shadow-md"
          >
            <FiSearch className="text-lg" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobHeroBanner;
