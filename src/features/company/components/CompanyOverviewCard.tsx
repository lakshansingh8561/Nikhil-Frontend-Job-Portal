import { FiBriefcase, FiUsers, FiCalendar, FiMapPin, FiGlobe, FiMail, FiCheckCircle } from "react-icons/fi";
import type { Company } from "../types/company.types";

interface CompanyOverviewCardProps {
  company?: Company;
}

export const CompanyOverviewCard = ({ company }: CompanyOverviewCardProps) => {
  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#F0F4FC] pb-4 mb-4">
        <h3 className="text-base font-bold text-[#05264E]">Company Overview</h3>
        {company?.isVerified && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <FiCheckCircle /> Verified
          </span>
        )}
      </div>

      <div className="space-y-4 text-xs font-medium text-[#66789C]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-500">
            <FiBriefcase className="text-[#3C65F5]" /> Industry
          </span>
          <span className="font-bold text-[#05264E]">
            {company?.industry || "Software & IT"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-500">
            <FiUsers className="text-[#3C65F5]" /> Company Size
          </span>
          <span className="font-bold text-[#05264E]">
            {company?.companySize || "50-100 Employees"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-500">
            <FiCalendar className="text-[#3C65F5]" /> Founded Year
          </span>
          <span className="font-bold text-[#05264E]">
            {company?.foundedYear || "2018"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-500">
            <FiMapPin className="text-[#3C65F5]" /> Location
          </span>
          <span className="font-bold text-[#05264E]">
            {company?.city || company?.country ? `${company.city || ""}, ${company.country || ""}` : "New York, US"}
          </span>
        </div>

        {company?.website && (
          <div className="flex items-center justify-between pt-2 border-t border-[#F0F4FC]">
            <span className="flex items-center gap-2 text-gray-500">
              <FiGlobe className="text-[#3C65F5]" /> Website
            </span>
            <a
              href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-[#3C65F5] hover:underline max-w-[150px] truncate"
            >
              {company.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}

        {company?.email && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-500">
              <FiMail className="text-[#3C65F5]" /> Email
            </span>
            <span className="font-bold text-[#05264E] max-w-[150px] truncate">
              {company.email}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
