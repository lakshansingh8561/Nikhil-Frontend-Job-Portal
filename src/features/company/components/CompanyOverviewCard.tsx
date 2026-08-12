import { FiBriefcase, FiUsers, FiCalendar, FiMapPin, FiGlobe, FiMail, FiCheckCircle } from "react-icons/fi";
import type { Company } from "../types/company.types";

interface CompanyOverviewCardProps {
  company?: Company;
}

export const CompanyOverviewCard = ({ company }: CompanyOverviewCardProps) => {
  return (
    <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#F0F4FC] pb-4 mb-5">
        <h3 className="text-base font-extrabold text-[#05264E]">Company Overview</h3>
        {company?.isVerified !== false && (
          <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
            <FiCheckCircle className="text-xs" /> Verified
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Industry */}
        <div className="rounded-2xl bg-[#F8FAFC] p-3.5 border border-[#EAEFF7] transition hover:border-[#3C65F5]/30 shadow-2xs">
          <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#66789C] uppercase tracking-wider mb-1">
            <FiBriefcase className="text-[#3C65F5]" /> Industry
          </span>
          <p className="text-xs font-black text-[#05264E] leading-snug">
            {company?.industry || "Not Specified"}
          </p>
        </div>

        {/* Company Size */}
        <div className="rounded-2xl bg-[#F8FAFC] p-3.5 border border-[#EAEFF7] transition hover:border-[#3C65F5]/30 shadow-2xs">
          <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#66789C] uppercase tracking-wider mb-1">
            <FiUsers className="text-[#3C65F5]" /> Company Size
          </span>
          <p className="text-xs font-black text-[#05264E] leading-snug">
            {company?.companySize || "Not Specified"}
          </p>
        </div>

        {/* Founded Year */}
        <div className="rounded-2xl bg-[#F8FAFC] p-3.5 border border-[#EAEFF7] transition hover:border-[#3C65F5]/30 shadow-2xs">
          <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#66789C] uppercase tracking-wider mb-1">
            <FiCalendar className="text-[#3C65F5]" /> Founded Year
          </span>
          <p className="text-xs font-black text-[#05264E] leading-snug">
            {company?.foundedYear || "Not Specified"}
          </p>
        </div>

        {/* Location */}
        <div className="rounded-2xl bg-[#F8FAFC] p-3.5 border border-[#EAEFF7] transition hover:border-[#3C65F5]/30 shadow-2xs">
          <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#66789C] uppercase tracking-wider mb-1">
            <FiMapPin className="text-[#3C65F5]" /> Location
          </span>
          <p className="text-xs font-black text-[#05264E] leading-snug">
            {company?.city || company?.country
              ? `${company.city || ""}${company.city && company.country ? ", " : ""}${company.country || ""}`
              : "Not Specified"}
          </p>
        </div>

        {/* Website */}
        {company?.website && (
          <div className="rounded-2xl bg-[#F8FAFC] p-3.5 border border-[#EAEFF7] transition hover:border-[#3C65F5]/30 shadow-2xs">
            <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#66789C] uppercase tracking-wider mb-1">
              <FiGlobe className="text-[#3C65F5]" /> Website
            </span>
            <a
              href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#3C65F5] hover:underline truncate block"
            >
              {company.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}

        {/* Email */}
        {company?.email && (
          <div className="rounded-2xl bg-[#F8FAFC] p-3.5 border border-[#EAEFF7] transition hover:border-[#3C65F5]/30 shadow-2xs">
            <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#66789C] uppercase tracking-wider mb-1">
              <FiMail className="text-[#3C65F5]" /> Contact Email
            </span>
            <p className="text-xs font-black text-[#05264E] truncate">
              {company.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyOverviewCard;
