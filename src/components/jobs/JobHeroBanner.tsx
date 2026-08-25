import { FiBriefcase, FiMapPin, FiGrid, FiSearch } from "react-icons/fi";
import hiringImage1 from "../../assets/images/hiring-image1.png";
import hiringImage2 from "../../assets/images/hiring-image2.png";

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl bg-[#EBF2FF] px-6 py-7 text-center md:px-10 md:py-9 shadow-xs border border-blue-100/50">
      {/* Decorative Assets: Hiring Image 1 (Left) */}
      <div className="pointer-events-none absolute left-3 sm:left-6 bottom-0 hidden lg:block w-36 xl:w-44 select-none">
        <img
          src={hiringImage1}
          alt="Hiring Vector Left"
          className="w-full h-auto max-h-36 xl:max-h-40 object-contain"
        />
      </div>

      {/* Decorative Assets: Hiring Image 2 (Right) */}
      <div className="pointer-events-none absolute right-3 sm:right-6 bottom-0 hidden lg:block w-36 xl:w-44 select-none">
        <img
          src={hiringImage2}
          alt="Hiring Vector Right"
          className="w-full h-auto max-h-36 xl:max-h-40 object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-2xl">
        <h1 className="text-2xl font-black text-[#05264E] sm:text-3xl md:text-4xl tracking-tight">
          <span className="text-[#3C65F5]">{totalJobs > 0 ? totalJobs : 22} Jobs</span> Available Now
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#66789C] leading-relaxed max-w-lg mx-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?
        </p>

        {/* Floating Search Bar Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col md:flex-row items-center rounded-2xl bg-white p-2 shadow-[0_10px_30px_rgba(50,75,130,0.06)] border border-[#EAEFF7] gap-1.5 text-left"
        >
          {/* Industry Select */}
          <div className="flex items-center gap-2 px-3 py-2 w-full md:w-auto md:flex-1 border-b md:border-b-0 md:border-r border-gray-100">
            <FiBriefcase className="text-gray-400 text-sm shrink-0" />
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#05264E] outline-none cursor-pointer"
            >
              <option value="">Industry</option>
              <option value="Software">Software & Tech</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
              <option value="Engineering">Engineering</option>
              <option value="Recruiting">Recruiting</option>
            </select>
          </div>

          {/* Location Input */}
          <div className="flex items-center gap-2 px-3 py-2 w-full md:w-auto md:flex-1 border-b md:border-b-0 md:border-r border-gray-100">
            <FiMapPin className="text-gray-400 text-sm shrink-0" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#05264E] placeholder:text-gray-400 outline-none"
            />
          </div>

          {/* Keyword Input */}
          <div className="flex items-center gap-2 px-3 py-2 w-full md:w-auto md:flex-1">
            <FiGrid className="text-gray-400 text-sm shrink-0" />
            <input
              type="text"
              placeholder="Your keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-normal text-[#05264E] placeholder:text-gray-400 outline-none"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#3C65F5] px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-[#254BD6] shrink-0 cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <FiSearch className="text-sm" />
            <span>Search</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobHeroBanner;
