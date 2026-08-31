import React from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiMapPin, FiStar } from "react-icons/fi";
import Container from "../common/Container";
import { useGetAllRecruitersQuery } from "../../features/recruiter/api/recruiterApi";
import type { RecruiterProfile } from "../../features/recruiter/types/recruiter.types";

import companyLogo1 from "../../assets/images/company-logo1.png";
import companyLogo2 from "../../assets/images/company-logo2.png";
import companyLogo3 from "../../assets/images/company-logo3.png";
import companyLogo4 from "../../assets/images/companyl-logo-4.png";
import companyLogo5 from "../../assets/images/company-logo5.png";

const companyLogos = [
  companyLogo1,
  companyLogo2,
  companyLogo3,
  companyLogo4,
  companyLogo5,
];

const getCompanyLogoSrc = (pictureUrl?: string, index: number = 0) => {
  if (
    pictureUrl &&
    typeof pictureUrl === "string" &&
    pictureUrl.trim().length > 5 &&
    (pictureUrl.startsWith("http://") ||
      pictureUrl.startsWith("https://") ||
      pictureUrl.startsWith("data:image/") ||
      pictureUrl.startsWith("/"))
  ) {
    return pictureUrl;
  }
  return companyLogos[index % companyLogos.length];
};

export const TopRecruitersSection: React.FC = () => {
  const { data, isLoading } = useGetAllRecruitersQuery({ page: 1, limit: 5 });
  const recruiters: RecruiterProfile[] = data?.recruiters || [];
  const topRecruiters = recruiters.slice(0, 5);

  return (
    <section className="py-14 bg-[#F5F7FC] border-b border-[#EAEFF7]">
      <Container>
        {/* Section Header with All Recruiters button on top right */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#05264E] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
              Top Recruiters
            </h2>
            <p className="mt-1.5 text-sm font-medium text-[#66789C] font-['Plus_Jakarta_Sans',sans-serif]">
              Discover your next career move, freelance gig, or internship
            </p>
          </div>

          {/* Top-Right 'All Recruiters' Action Button */}
          <Link
            to="/recruiters"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#E0E6F6] px-4 py-2 text-[14px] font-medium text-[#05264E] hover:text-[#3C65F5] hover:border-[#3C65F5]/40 hover:shadow-xs transition-all font-['Plus_Jakarta_Sans',sans-serif] shrink-0"
          >
            <span>All Recruiters</span>
            <FiChevronRight className="text-base" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="h-40 rounded-2xl bg-white border border-[#EAEFF7] p-5 animate-pulse flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gray-200" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                    <div className="h-3 bg-gray-200 rounded-md w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded-md w-full mt-4" />
              </div>
            ))}
          </div>
        ) : topRecruiters.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center border border-[#EAEFF7] shadow-xs">
            <h3 className="text-base font-bold text-[#05264E]">No Recruiters Found</h3>
            <p className="text-xs font-medium text-[#66789C] mt-1">
              Registered hiring companies and recruiters will appear here!
            </p>
          </div>
        ) : (
          /* Cards Grid: 5 Top Recruiters in 1 Row */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {topRecruiters.map((rec, index) => {
              const compObj =
                typeof rec.companyId === "object" && rec.companyId !== null
                  ? (rec.companyId as any)
                  : null;

              const companyName =
                compObj?.name ||
                compObj?.companyName ||
                rec.currentCompany ||
                rec.companyName ||
                (rec.firstName
                  ? `${rec.firstName} ${rec.lastName || ""}`.trim()
                  : (rec.userId as any)?.email?.split("@")[0] || "Company");

              const openCount = (rec as any).openJobsCount ?? 0;
              const logoSrc = compObj?.logo || getCompanyLogoSrc(rec.profilePicture, index);
              const fallbackLogo = companyLogos[index % companyLogos.length];

              // Real location from recruiter profile, company headquarters/location, or user profile
              const location =
                rec.currentLocation ||
                (compObj?.location?.city
                  ? `${compObj.location.city}${
                      compObj.location.country ? `, ${compObj.location.country}` : ""
                    }`
                  : typeof compObj?.location === "string" && compObj.location.trim()
                  ? compObj.location.trim()
                  : compObj?.headquarters ||
                    (rec as any).location ||
                    "Global / Verified");

              return (
                <Link
                  key={rec._id}
                  to={`/recruiters`}
                  className="group flex flex-col justify-between rounded-2xl border border-[#EAEFF7] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#3C65F5]/30 hover:shadow-lg cursor-pointer min-h-[160px]"
                >
                  {/* Top Content: Logo + Info */}
                  <div>
                    <div className="flex items-center gap-3.5 mb-3">
                      {/* Logo / Badge */}
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F8FAFC] border border-[#EAEFF7] p-2 overflow-hidden group-hover:scale-105 transition-transform shadow-2xs">
                        <img
                          src={logoSrc}
                          alt={companyName}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = fallbackLogo;
                          }}
                        />
                      </div>

                      {/* Name & Stars */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-[#05264E] group-hover:text-[#3C65F5] transition-colors truncate font-['Plus_Jakarta_Sans',sans-serif]">
                          {companyName}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="flex items-center text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <FiStar key={i} className="text-[11px] fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-[#66789C]">
                            (68)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Content: Real Location & Real Open Jobs Count */}
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-[#F0F4FC]">
                    <div className="flex items-center gap-1 text-[#66789C] font-medium truncate max-w-[55%]">
                      <FiMapPin className="text-xs shrink-0 text-[#66789C]" />
                      <span className="truncate">{location}</span>
                    </div>
                    <span className="font-bold text-[#66789C] group-hover:text-[#3C65F5] transition-colors shrink-0">
                      {openCount} Open Jobs
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
};

export default TopRecruitersSection;
