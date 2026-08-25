import { FiMapPin, FiRotateCcw } from "react-icons/fi";

interface JobFilterSidebarProps {
  selectedLocation: string;
  setSelectedLocation: (val: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
  selectedExperience: string;
  setSelectedExperience: (val: string) => void;
  salaryMax: number;
  setSalaryMax: (val: number) => void;
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

const employmentTypes = [
  { name: "Full Time", count: 120, val: "FULL_TIME" },
  { name: "Part Time", count: 45, val: "PART_TIME" },
  { name: "Contract", count: 32, val: "CONTRACT" },
  { name: "Remote", count: 68, val: "REMOTE" },
];

const experienceLevels = [
  { name: "Internship", count: 56, val: "INTERNSHIP" },
  { name: "Entry Level", count: 87, val: "ENTRY" },
  { name: "Associate", count: 24, val: "MID" },
  { name: "Mid Level", count: 45, val: "SENIOR" },
  { name: "Executive", count: 89, val: "EXECUTIVE" },
];

const JobFilterSidebar = ({
  selectedLocation,
  setSelectedLocation,
  selectedIndustry,
  setSelectedIndustry,
  selectedType,
  setSelectedType,
  selectedExperience,
  setSelectedExperience,
  salaryMax,
  setSalaryMax,
  onReset,
}: JobFilterSidebarProps) => {
  return (
    <aside className="w-full rounded-2xl border border-[#EAEFF7] bg-white shadow-sm sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto custom-filter-scrollbar overscroll-contain p-6 pt-0">
      {/* Header */}
      <div className="sticky top-0 z-20 -mx-6 bg-white/95 backdrop-blur-xs p-6 pb-4 border-b border-[#F0F4FC] flex items-center justify-between shadow-2xs">
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
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3.5 pl-11 pr-4 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
          />
        </div>
      </div>

      {/* Industry Filter Section */}
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
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[16px] font-bold text-[#05264E]">Salary Range</h4>
          <span className="text-xs font-extrabold text-[#3C65F5]">
            Up to ${salaryMax}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          step="50"
          value={salaryMax}
          onChange={(e) => setSalaryMax(Number(e.target.value))}
          className="w-full accent-[#3C65F5] cursor-pointer h-2 bg-gray-200 rounded-lg"
        />
        <div className="flex justify-between text-xs font-semibold text-[#66789C] mt-2">
          <span>$0</span>
          <span>$2,000/hr</span>
        </div>
      </div>

      {/* Job Type Section */}
      <div className="mt-8 border-t border-[#F0F4FC] pt-6">
        <h4 className="text-[16px] font-bold text-[#05264E] mb-4">Job Type</h4>
        <div className="space-y-3">
          {employmentTypes.map((type) => {
            const isChecked = selectedType === type.val;
            return (
              <label
                key={type.val}
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

      {/* Experience Level Section */}
      <div className="mt-8 border-t border-[#F0F4FC] pt-6 pb-2">
        <h4 className="text-[16px] font-bold text-[#05264E] mb-4">Experience Level</h4>
        <div className="space-y-3">
          {experienceLevels.map((exp) => {
            const isChecked = selectedExperience === exp.val;
            return (
              <label
                key={exp.val}
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
    </aside>
  );
};

export default JobFilterSidebar;
