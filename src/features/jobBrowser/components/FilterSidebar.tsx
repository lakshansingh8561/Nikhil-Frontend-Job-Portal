import React from "react";
import { FiFilter, FiRotateCcw, FiDollarSign, FiCode, FiMapPin, FiBriefcase, FiAward } from "react-icons/fi";

interface FilterSidebarProps {
  location: string;
  setLocation: (val: string) => void;
  employmentType: string;
  setEmploymentType: (val: string) => void;
  experienceLevel: string;
  setExperienceLevel: (val: string) => void;
  salaryMin: number;
  setSalaryMin: (val: number) => void;
  selectedSkills: string[];
  setSelectedSkills: React.Dispatch<React.SetStateAction<string[]>>;
  onReset: () => void;
}

const popularSkillsList = [
  "React",
  "NodeJS",
  "TypeScript",
  "JavaScript",
  "Python",
  "MongoDB",
  "Express",
  "Tailwind",
  "Docker",
  "AWS",
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  location,
  setLocation,
  employmentType,
  setEmploymentType,
  experienceLevel,
  setExperienceLevel,
  salaryMin,
  setSalaryMin,
  selectedSkills,
  setSelectedSkills,
  onReset,
}) => {
  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EAEFF7] pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#3C65F5]">
            <FiFilter className="text-sm" />
          </div>
          <h3 className="text-base font-bold text-[#05264E]">Filter Jobs</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#66789C] transition hover:text-[#3C65F5] cursor-pointer"
        >
          <FiRotateCcw />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Location Filter */}
        <div>
          <label className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#05264E]">
            <FiMapPin className="text-[#3C65F5]" /> Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. New York, Remote"
            className="w-full rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] px-4 py-2.5 text-xs font-semibold text-[#05264E] outline-none focus:border-[#3C65F5] transition"
          />
        </div>

        {/* Employment Type */}
        <div>
          <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#05264E]">
            <FiBriefcase className="text-[#3C65F5]" /> Employment Type
          </label>
          <div className="space-y-2">
            {[
              { id: "", label: "All Types" },
              { id: "FULL_TIME", label: "Full Time" },
              { id: "PART_TIME", label: "Part Time" },
              { id: "CONTRACT", label: "Contract" },
              { id: "INTERNSHIP", label: "Internship" },
              { id: "REMOTE", label: "Remote" },
            ].map((type) => (
              <label
                key={type.id}
                className="flex items-center justify-between rounded-xl p-2 transition hover:bg-[#F8FAFC] cursor-pointer"
              >
                <span className="text-xs font-medium text-[#05264E]">{type.label}</span>
                <input
                  type="radio"
                  name="employmentType"
                  checked={employmentType === type.id}
                  onChange={() => setEmploymentType(type.id)}
                  className="h-4 w-4 accent-[#3C65F5] cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#05264E]">
            <FiAward className="text-[#3C65F5]" /> Experience Level
          </label>
          <div className="space-y-2">
            {[
              { id: "", label: "Any Experience" },
              { id: "FRESHER", label: "Fresher / Entry Level" },
              { id: "ONE_TO_TWO", label: "1 - 2 Years" },
              { id: "THREE_TO_FIVE", label: "3 - 5 Years" },
              { id: "FIVE_PLUS", label: "5+ Years" },
            ].map((lvl) => (
              <label
                key={lvl.id}
                className="flex items-center justify-between rounded-xl p-2 transition hover:bg-[#F8FAFC] cursor-pointer"
              >
                <span className="text-xs font-medium text-[#05264E]">{lvl.label}</span>
                <input
                  type="radio"
                  name="experienceLevel"
                  checked={experienceLevel === lvl.id}
                  onChange={() => setExperienceLevel(lvl.id)}
                  className="h-4 w-4 accent-[#3C65F5] cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#05264E]">
              <FiDollarSign className="text-[#3C65F5]" /> Minimum Salary
            </label>
            <span className="text-xs font-bold text-[#3C65F5]">
              ${salaryMin.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={200000}
            step={5000}
            value={salaryMin}
            onChange={(e) => setSalaryMin(Number(e.target.value))}
            className="w-full accent-[#3C65F5] cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-[11px] font-medium text-gray-400">
            <span>$0</span>
            <span>$100k</span>
            <span>$200k+</span>
          </div>
        </div>

        {/* Skills Filter */}
        <div>
          <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#05264E]">
            <FiCode className="text-[#3C65F5]" /> Skills
          </label>
          <div className="flex flex-wrap gap-1.5">
            {popularSkillsList.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#3C65F5] text-white shadow-sm"
                      : "bg-[#F8FAFC] text-[#66789C] hover:bg-[#E8F0FE] hover:text-[#3C65F5]"
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
