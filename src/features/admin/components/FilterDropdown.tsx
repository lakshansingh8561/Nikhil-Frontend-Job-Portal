import React from "react";
import { FiFilter } from "react-icons/fi";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  label?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  value,
  onChange,
  options,
  label,
}) => {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-xs font-bold text-[#05264E] hidden sm:inline-block">
          {label}:
        </span>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-2xl border border-[#EAEFF7] bg-white px-4 py-2.5 text-xs font-bold text-[#05264E] shadow-xs outline-none focus:border-[#3C65F5] cursor-pointer appearance-none pr-8"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FiFilter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
      </div>
    </div>
  );
};

export default FilterDropdown;
