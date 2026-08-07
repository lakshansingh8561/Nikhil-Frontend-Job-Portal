import { FiCheckCircle, FiGlobe, FiMapPin, FiUsers } from "react-icons/fi";

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

export const CompanyHeader = ({
  companyName,
  tagline,
  industry,
  location,
  companySize,
  logo,
  coverImage,
  website,
  isVerified = true,
}: CompanyHeaderProps) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm border border-[#EAEFF7]">
      {/* Cover Image Banner */}
      <div className="h-44 w-full bg-[#1E293B] relative overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt="Company Cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-[#05264E] via-[#1D4ED8] to-[#1E40AF] opacity-95 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          </div>
        )}
      </div>

      {/* Info Section - Logo overlaps banner, text sits cleanly on white background */}
      <div className="p-6 sm:p-8 pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          {/* Logo Avatar + Company Info */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {/* Logo Avatar with isolated negative top margin */}
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-xl ring-4 ring-white border border-[#EAEFF7] overflow-hidden -mt-12">
              {logo ? (
                <img
                  src={logo}
                  alt={companyName || "Logo"}
                  className="h-full w-full object-contain rounded-xl"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#1D4ED8] font-extrabold text-white text-3xl shadow-inner">
                  {companyName ? companyName.charAt(0).toUpperCase() : "C"}
                </div>
              )}
            </div>

            {/* Text details sitting cleanly with top spacing below banner */}
            <div className="pt-3 sm:pt-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-[#05264E]">
                  {companyName || "Your Company Name"}
                </h2>
                {isVerified && (
                  <FiCheckCircle className="text-[#1D4ED8] text-lg shrink-0" title="Verified Employer" />
                )}
              </div>

              <p className="text-sm font-semibold text-[#66789C] mt-0.5">
                {tagline || "Leading the future of technology & innovation"}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#66789C]">
                <span className="flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] px-3 py-1.5 border border-[#EAEFF7]">
                  <FiUsers className="text-[#1D4ED8]" />
                  {companySize || "1-10 Employees"}
                </span>

                <span className="flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] px-3 py-1.5 border border-[#EAEFF7]">
                  <FiMapPin className="text-[#1D4ED8]" />
                  {location || "New York, US"}
                </span>

                {website && (
                  <a
                    href={website.startsWith("http") ? website : `https://${website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-[#EBF2FF] px-3 py-1.5 text-[#1D4ED8] hover:underline"
                  >
                    <FiGlobe />
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>

          <span className="self-start sm:self-auto rounded-full bg-blue-50 px-4 py-1.5 text-xs font-extrabold text-[#1D4ED8] border border-blue-200">
            {industry || "Information Technology"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;
