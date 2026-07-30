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
          <div className="h-full w-full bg-gradient-to-r from-[#3C65F5] via-[#254BD6] to-[#05264E] opacity-95" />
        )}
      </div>

      {/* Info Section - Logo overlaps banner, text sits cleanly on white background */}
      <div className="p-6 sm:p-8 pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-12">
          {/* Logo Avatar + Company Info */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {/* Logo Avatar */}
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-xl ring-4 ring-white border border-[#EAEFF7] overflow-hidden">
              {logo ? (
                <img
                  src={logo}
                  alt={companyName || "Logo"}
                  className="h-full w-full object-contain rounded-xl"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#3C65F5] font-extrabold text-white text-3xl">
                  {companyName ? companyName.charAt(0) : "C"}
                </div>
              )}
            </div>

            {/* Text details sitting cleanly on white background */}
            <div className="sm:pt-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-[#05264E]">
                  {companyName || "Your Company Name"}
                </h2>
                {isVerified && (
                  <FiCheckCircle className="text-[#3C65F5] text-lg shrink-0" title="Verified Employer" />
                )}
              </div>

              <p className="text-sm font-semibold text-[#66789C] mt-0.5">
                {tagline || "Leading the future of technology & innovation"}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#66789C]">
                <span className="flex items-center gap-1.5 rounded-lg bg-[#F8FAFC] px-3 py-1.5 border border-[#EAEFF7]">
                  <FiUsers className="text-[#3C65F5]" />
                  {companySize || "50-100 Employees"}
                </span>

                <span className="flex items-center gap-1.5 rounded-lg bg-[#F8FAFC] px-3 py-1.5 border border-[#EAEFF7]">
                  <FiMapPin className="text-[#3C65F5]" />
                  {location || "New York, US"}
                </span>

                {website && (
                  <a
                    href={website.startsWith("http") ? website : `https://${website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-[#EBF2FF] px-3 py-1.5 text-[#3C65F5] hover:underline"
                  >
                    <FiGlobe />
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>

          <span className="self-start sm:self-auto rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-[#3C65F5] border border-blue-200">
            {industry || "Technology"}
          </span>
        </div>
      </div>
    </div>
  );
};
