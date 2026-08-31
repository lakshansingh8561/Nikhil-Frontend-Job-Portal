import React from "react";
import {
  FiCheckCircle,
  FiGlobe,
  FiMapPin,
  FiUsers,
  FiAward,
  FiBriefcase,
  FiLayers,
  FiShield,
} from "react-icons/fi";

interface CompanyHeaderProps {
  companyName?: string;
  tagline?: string;
  industry?: string;
  location?: string;
  companySize?: string;
  logo?: string;
  coverImage?: string;
  website?: string;
  isVerified?: boolean;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  companyName,
  tagline,
  industry,
  location,
  companySize,
  logo,
  coverImage,
  website,
  isVerified = true,
}) => {
  const displayTitle = companyName || "Create Your Company Profile";
  const displayTagline =
    tagline || "Fill out the form below to set up your corporate branding and start posting jobs.";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-md border border-[#EAEFF7]">
      {/* Cover Image & Rich Gradient Banner Container */}
      <div className="h-56 w-full relative overflow-hidden bg-gradient-to-r from-[#05264E] via-[#1E40AF] to-[#1D4ED8]">
        {coverImage ? (
          <div className="relative h-full w-full">
            <img
              src={coverImage}
              alt="Company Cover"
              className="h-full w-full object-cover"
            />
            {/* Dark gradient overlay for text readability over image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>
        ) : (
          <div className="relative h-full w-full p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            {/* Ambient Decorative Spotlight & Radial Pattern */}
            <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

            {/* Top Row: Floating Glassmorphism Badges */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-blue-100 backdrop-blur-md border border-white/15 shadow-sm">
                <FiAward className="text-yellow-400" /> Employer Branding & Corporate Hub
              </span>

              <div className="hidden sm:flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-200 backdrop-blur-md border border-emerald-400/30">
                  <FiShield /> Verified Employer
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-blue-200 backdrop-blur-md border border-white/15">
                  <FiLayers /> Active Hiring Portal
                </span>
              </div>
            </div>

            {/* Banner Center Text Content */}
            <div className="relative z-10 max-w-2xl mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                {displayTitle}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm font-medium text-blue-100/90 line-clamp-2 leading-relaxed max-w-xl">
                {displayTagline}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Section Below Cover - Avatar Logo Overlaps Banner edge cleanly */}
      <div className="p-6 sm:p-8 pt-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Logo Avatar + Main Title & Tags */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {/* Logo Avatar with negative top margin overlapping banner */}
            <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-2xl bg-white p-2.5 shadow-xl ring-4 ring-white border border-[#EAEFF7] overflow-hidden -mt-12 sm:-mt-14 transition-transform hover:scale-105">
              {logo ? (
                <img
                  src={logo}
                  alt={displayTitle}
                  className="h-full w-full object-contain rounded-xl"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#3C65F5] font-black text-white text-3xl sm:text-4xl shadow-inner">
                  {displayTitle.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Text details sitting cleanly below banner */}
            <div className="pt-2 sm:pt-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black text-[#05264E] tracking-tight">
                  {displayTitle}
                </h2>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#3C65F5]/10 px-2.5 py-1 text-xs font-bold text-[#3C65F5] border border-[#3C65F5]/20">
                    <FiCheckCircle className="text-sm" /> Verified Company
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm font-semibold text-[#66789C] mt-1 max-w-2xl">
                {displayTagline}
              </p>

              {/* Quick Info Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs font-bold text-[#05264E]">
                <span className="flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] px-3.5 py-2 border border-[#EAEFF7] shadow-2xs">
                  <FiBriefcase className="text-[#3C65F5]" />
                  {industry || "Not Specified"}
                </span>

                <span className="flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] px-3.5 py-2 border border-[#EAEFF7] shadow-2xs">
                  <FiUsers className="text-[#3C65F5]" />
                  {companySize || "Not Specified"}
                </span>

                <span className="flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] px-3.5 py-2 border border-[#EAEFF7] shadow-2xs">
                  <FiMapPin className="text-[#3C65F5]" />
                  {location || "Not Specified"}
                </span>

                {website && (
                  <a
                    href={website.startsWith("http") ? website : `https://${website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-[#EBF2FF] px-4 py-2 text-xs font-bold text-[#3C65F5] hover:bg-blue-100 transition border border-blue-200/60 shadow-2xs"
                  >
                    <FiGlobe className="text-sm" />
                    <span>Visit Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Industry Category Pill */}
          <div className="self-start md:self-auto shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-2.5 text-xs font-black text-[#3C65F5] border border-blue-200/80 shadow-2xs">
              <FiBriefcase /> {industry || "Not Specified"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;
