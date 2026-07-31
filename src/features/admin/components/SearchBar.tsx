import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "w-full sm:w-72",
}) => {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-2xl bg-white px-4 py-2.5 border border-[#EAEFF7] shadow-xs focus-within:border-[#3C65F5] transition ${className}`}
    >
      <FiSearch className="text-gray-400 text-sm shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-xs font-medium text-[#05264E] outline-none placeholder:text-gray-400"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
          title="Clear search"
        >
          <FiX className="text-xs" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
