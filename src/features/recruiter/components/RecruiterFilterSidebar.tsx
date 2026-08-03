import { FiMapPin, FiRotateCcw } from "react-icons/fi";

interface RecruiterFilterSidebarProps {
  location: string;
  setLocation: (val: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (val: string) => void;
  selectedSalaryRange: string;
  setSelectedSalaryRange: (val: string) => void;
  selectedKeyword: string;
  setSelectedKeyword: (val: string) => void;
  selectedPosition: string;
  setSelectedPosition: (val: string) => void;
  selectedExperience: string;
  setSelectedExperience: (val: string) => void;
  selectedWorkplace: string;
  setSelectedWorkplace: (val: string) => void;
  selectedPostedDate: string;
  setSelectedPostedDate: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
  onReset: () => void;
}

const industries = [
  { name: "All", count: 180, val: "" },
  { name: "Software", count: 12, val: "Software" },
  { name: "Finance", count: 23, val: "Finance" },
  { name: "Recruiting", count: 43, val: "Recruiting" },
  { name: "Management", count: 65, val: "Management" },
  { name: "Advertising", count: 76, val: "Advertising" },
];

const salaryRanges = [
  { name: "All", count: 145, val: "" },
  { name: "$0k - $20k", count: 56, val: "0-20k" },
  { name: "$20k - $40k", count: 37, val: "20k-40k" },
  { name: "$40k - $60k", count: 75, val: "40k-60k" },
  { name: "$60k - $80k", count: 98, val: "60k-80k" },
  { name: "$80k - $100k", count: 14, val: "80k-100k" },
  { name: "$100k - $200k", count: 25, val: "100k-200k" },
];

const popularKeywords = [
  { name: "Software", count: 24, val: "Software" },
  { name: "Developer", count: 45, val: "Developer" },
  { name: "Web", count: 57, val: "Web" },
  { name: "Design", count: 38, val: "Design" },
  { name: "Marketing", count: 29, val: "Marketing" },
];

const positions = [
  { name: "Senior", count: 12, val: "Senior" },
  { name: "Junior", count: 35, val: "Junior" },
  { name: "Fresher", count: 56, val: "Fresher" },
  { name: "Lead", count: 19, val: "Lead" },
  { name: "Executive", count: 8, val: "Executive" },
];

const experienceLevels = [
  { name: "Internship", count: 56, val: "INTERNSHIP" },
  { name: "Entry Level", count: 87, val: "ENTRY" },
  { name: "Associate", count: 24, val: "MID" },
  { name: "Mid Level", count: 45, val: "SENIOR" },
  { name: "Executive", count: 89, val: "EXECUTIVE" },
];

const workplaces = [
  { name: "On-site", count: 142, val: "ONSITE" },
  { name: "Remote", count: 88, val: "REMOTE" },
  { name: "Hybrid", count: 64, val: "HYBRID" },
];

const postedDates = [
  { name: "All", count: 250, val: "" },
  { name: "Last 24 Hours", count: 42, val: "24h" },
  { name: "Last 7 Days", count: 110, val: "7d" },
  { name: "Last 30 Days", count: 198, val: "30d" },
];

const employmentTypes = [
  { name: "Full Time", count: 120, val: "FULL_TIME" },
  { name: "Part Time", count: 45, val: "PART_TIME" },
  { name: "Contract", count: 32, val: "CONTRACT" },
  { name: "Remote", count: 68, val: "REMOTE" },
];

const RecruiterFilterSidebar = ({
  location,
  setLocation,
  selectedIndustry,
  setSelectedIndustry,
  selectedSalaryRange,
  setSelectedSalaryRange,
  selectedKeyword,
  setSelectedKeyword,
  selectedPosition,
  setSelectedPosition,
  selectedExperience,
  setSelectedExperience,
  selectedWorkplace,
  setSelectedWorkplace,
  selectedPostedDate,
  setSelectedPostedDate,
  selectedType,
  setSelectedType,
  onReset,
}: RecruiterFilterSidebarProps) => {
  return (
    <aside className="w-full rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm sticky top-28 max-h-[calc(100vh-130px)] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      {/* Header */}
      <div className="sticky top-0 z-10 -mx-6 -mt-6 bg-white p-6 pb-4 border-b border-[#F0F4FC] flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#05264E]">Advance Filter</h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-[#66789C] transition hover:text-[#3C65F5] cursor-pointer"
        >
          <FiRotateCcw className="text-xs" />
          Reset
        </button>
      </div>

      {/* Location Input Box */}
      <div className="mt-6">
        <div className="relative flex items-center">
          <FiMapPin className="absolute left-4 text-gray-400 text-base pointer-events-none" />
          <input
            type="text"
            placeholder="New York, US"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3.5 pl-11 pr-4 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
          />
        </div>
      </div>

      {/* Industry Section */}
      <div className="mt-8 border-t border-[#F0F4FC] pt-6">
        <h4 className="text-[16px] font-bold text-[#05264E] mb-4">Industry</h4>
        <div className="space-y-3">
          {industries.map((ind) => {
            const isChecked = selectedIndustry === ind.val;
            return (
              <label
                key={ind.name}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setSelectedIndustry(isChecked ? "" : ind.val)}
                    className="h-4.5 w-4.5 rounded border-gray-300 accent-[#3C65F5] cursor-pointer"
                  />
                  <span
                    className={`text-sm transition ${
                      isChecked
                        ? "font-bold text-[#3C65F5]"
                        : "font-medium text-[#66789C] group-hover:text-[#05264E]"
                    }`}
                  >
                    {ind.name}
                  </span>
                </div>
                <span className="rounded-md bg-[#EBF2FF] px-2 py-0.5 text-[11px] font-bold text-[#3C65F5]">
                  {ind.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Salary Range Section */}
      <div className="mt-8 border-t border-[#F0F4FC] pt-6">
        <h4 className="text-[16px] font-bold text-[#05264E] mb-4">Salary Range</h4>
        <div className="space-y-3">
          {salaryRanges.map((sal) => {
            const isChecked = selectedSalaryRange === sal.val;
            return (
              <label
                key={sal.name}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setSelectedSalaryRange(isChecked ? "" : sal.val)}
                    className="h-4.5 w-4.5 rounded border-gray-300 accent-[#3C65F5] cursor-pointer"
                  />
                  <span
                    className={`text-sm transition ${
                      isChecked
                        ? "font-bold text-[#3C65F5]"
                        : "font-medium text-[#66789C] group-hover:text-[#05264E]"
                    }`}
                  >
                    {sal.name}
                  </span>
                </div>
                <span className="rounded-md bg-[#EBF2FF] px-2 py-0.5 text-[11px] font-bold text-[#3C65F5]">
                  {sal.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Popular Keyword Section */}
      <div className="mt-8 border-t border-[#F0F4FC] pt-6">
        <h4 className="text-[16px] font-bold text-[#05264E] mb-4">Popular Keyword</h4>
        <div className="space-y-3">
          {popularKeywords.map((kw) => {
            const isChecked = selectedKeyword === kw.val;
            return (
              <label
                key={kw.name}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setSelectedKeyword(isChecked ? "" : kw.val)}
                    className="h-4.5 w-4.5 rounded border-gray-300 accent-[#3C65F5] cursor-pointer"
                  />
                  <span
                    className={`text-sm transition ${
                      isChecked
                        ? "font-bold text-[#3C65F5]"
                        : "font-medium text-[#66789C] group-hover:text-[#05264E]"
                    }`}
                  >
                    {kw.name}
                  </span>
                </div>
                <span className="rounded-md bg-[#EBF2FF] px-2 py-0.5 text-[11px] font-bold text-[#3C65F5]">
                  {kw.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Position Section */}
      <div className="mt-8 border-t border-[#F0F4FC] pt-6">
        <h4 className="text-[16px] font-bold text-[#05264E] mb-4">Position</h4>
        <div className="space-y-3">
          {positions.map((pos) => {
            const isChecked = selectedPosition === pos.val;
            return (
              <label
                key={pos.name}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setSelectedPosition(isChecked ? "" : pos.val)}
                    className="h-4.5 w-4.5 rounded border-gray-300 accent-[#3C65F5] cursor-pointer"
                  />
                  <span
                    className={`text-sm transition ${
                      isChecked
                        ? "font-bold text-[#3C65F5]"
                        : "font-medium text-[#66789C] group-hover:text-[#05264E]"
                    }`}
                  >
                    {pos.name}
                  </span>
                </div>
                <span className="rounded-md bg-[#EBF2FF] px-2 py-0.5 text-[11px] font-bold text-[#3C65F5]">
                  {pos.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Experience Level Section */}
      <div className="mt-8 border-t border-[#F0F4FC] pt-6">
        <h4 className="text-[16px] font-bold text-[#05264E] mb-4">Experience Level</h4>
        <div className="space-y-3">
          {experienceLevels.map((exp) => {
            const isChecked = selectedExperience === exp.val;
            return (
              <label
                key={exp.name}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setSelectedExperience(isChecked ? "" : exp.val)}
                    className="h-4.5 w-4.5 rounded border-gray-300 accent-[#3C65F5] cursor-pointer"
                  />
                  <span
                    className={`text-sm transition ${
                      isChecked
                        ? "font-bold text-[#3C65F5]"
                        : "font-medium text-[#66789C] group-hover:text-[#05264E]"
                    }`}
                  >
                    {exp.name}
                  </span>
                </div>
                <span className="rounded-md bg-[#EBF2FF] px-2 py-0.5 text-[11px] font-bold text-[#3C65F5]">
                  {exp.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Onsite / Remote Section */}
      <div className="mt-8 border-t border-[#F0F4FC] pt-6">
        <h4 className="text-[16px] font-bold text-[#05264E] mb-4">Workplace Mode</h4>
        <div className="space-y-3">
          {workplaces.map((wp) => {
            const isChecked = selectedWorkplace === wp.val;
            return (
              <label
                key={wp.name}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setSelectedWorkplace(isChecked ? "" : wp.val)}
                    className="h-4.5 w-4.5 rounded border-gray-300 accent-[#3C65F5] cursor-pointer"
                  />
                  <span
                    className={`text-sm transition ${
                      isChecked
                        ? "font-bold text-[#3C65F5]"
                        : "font-medium text-[#66789C] group-hover:text-[#05264E]"
                    }`}
                  >
                    {wp.name}
                  </span>
                </div>
                <span className="rounded-md bg-[#EBF2FF] px-2 py-0.5 text-[11px] font-bold text-[#3C65F5]">
                  {wp.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Job Posted Section */}
      <div className="mt-8 border-t border-[#F0F4FC] pt-6">
        <h4 className="text-[16px] font-bold text-[#05264E] mb-4">Job Posted</h4>
        <div className="space-y-3">
          {postedDates.map((pd) => {
            const isChecked = selectedPostedDate === pd.val;
            return (
              <label
                key={pd.name}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setSelectedPostedDate(isChecked ? "" : pd.val)}
                    className="h-4.5 w-4.5 rounded border-gray-300 accent-[#3C65F5] cursor-pointer"
                  />
                  <span
                    className={`text-sm transition ${
                      isChecked
                        ? "font-bold text-[#3C65F5]"
                        : "font-medium text-[#66789C] group-hover:text-[#05264E]"
                    }`}
                  >
                    {pd.name}
                  </span>
                </div>
                <span className="rounded-md bg-[#EBF2FF] px-2 py-0.5 text-[11px] font-bold text-[#3C65F5]">
                  {pd.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Job Type Section */}
      <div className="mt-8 border-t border-[#F0F4FC] pt-6 pb-2">
        <h4 className="text-[16px] font-bold text-[#05264E] mb-4">Job Type</h4>
        <div className="space-y-3">
          {employmentTypes.map((type) => {
            const isChecked = selectedType === type.val;
            return (
              <label
                key={type.name}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setSelectedType(isChecked ? "" : type.val)}
                    className="h-4.5 w-4.5 rounded border-gray-300 accent-[#3C65F5] cursor-pointer"
                  />
                  <span
                    className={`text-sm transition ${
                      isChecked
                        ? "font-bold text-[#3C65F5]"
                        : "font-medium text-[#66789C] group-hover:text-[#05264E]"
                    }`}
                  >
                    {type.name}
                  </span>
                </div>
                <span className="rounded-md bg-[#EBF2FF] px-2 py-0.5 text-[11px] font-bold text-[#3C65F5]">
                  {type.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default RecruiterFilterSidebar;
