import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiMapPin, FiStar } from "react-icons/fi";
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
  const { data, isLoading } = useGetAllRecruitersQuery({ page: 1, limit: 100 });
  const recruiters: RecruiterProfile[] = data?.recruiters || [];

  const [startIndex, setStartIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const visibleCount = 20; // 4 rows of 5 columns max per slide page

  // Automatic Sliding every 4 seconds (pauses on hover)
  React.useEffect(() => {
    if (recruiters.length <= visibleCount || isHovered) return;

    const timer = setInterval(() => {
      setStartIndex((prev) => {
        if (prev + visibleCount >= recruiters.length) {
          return 0;
        }
        return prev + visibleCount;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [recruiters.length, visibleCount, isHovered]);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - visibleCount, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + visibleCount, Math.max(0, recruiters.length - visibleCount))
    );
  };

  const totalPages = Math.ceil(recruiters.length / visibleCount);
  const currentPage = Math.floor(startIndex / visibleCount);

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="py-16 bg-[#F5F7FC] border-b border-[#EAEFF7]"
    >
      <Container>
        {/* Section Header */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 mb-10 text-center md:text-left">
          <div className="mx-auto md:mx-0">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#05264E] tracking-tight">
              Top Recruiters
            </h2>
            <p className="mt-2 text-sm font-semibold text-[#66789C]">
              Discover your next career move, freelance gig, or internship
            </p>
          </div>

          {/* Carousel Navigation Controls */}
          {recruiters.length > visibleCount && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                aria-label="Previous Top Recruiters"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EBF2FF] text-[#3C65F5] transition hover:bg-[#3C65F5] hover:text-white disabled:opacity-30 disabled:hover:bg-[#EBF2FF] disabled:hover:text-[#3C65F5] cursor-pointer shadow-xs"
              >
                <FiChevronLeft className="text-xl" />
              </button>
              <button
                onClick={handleNext}
                disabled={startIndex + visibleCount >= recruiters.length}
                aria-label="Next Top Recruiters"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EBF2FF] text-[#3C65F5] transition hover:bg-[#3C65F5] hover:text-white disabled:opacity-30 disabled:hover:bg-[#EBF2FF] disabled:hover:text-[#3C65F5] cursor-pointer shadow-xs"
              >
                <FiChevronRight className="text-xl" />
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].slice(0, 10).map((n) => (
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
        ) : recruiters.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center border border-[#EAEFF7] shadow-2xs">
            <h3 className="text-lg font-bold text-[#05264E]">No Recruiters Found</h3>
            <p className="text-xs font-semibold text-[#66789C] mt-1">
              Registered hiring companies and recruiters will appear here!
            </p>
          </div>
        ) : (
          <>
            {/* Cards Grid: 4 lines/rows maximum per slide */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 transition-all duration-500">
              {recruiters.slice(startIndex, startIndex + visibleCount).map((rec, index) => {
                const compObj = typeof rec.companyId === "object" && rec.companyId !== null ? (rec.companyId as any) : null;
                const companyName =
                  compObj?.name ||
                  compObj?.companyName ||
                  rec.currentCompany ||
                  rec.companyName ||
                  (rec.firstName ? `${rec.firstName} ${rec.lastName}` : (rec.userId as any)?.email?.split("@")[0] || "Company");
                const openCount = (rec as any).openJobsCount || 0;
                const logoSrc = compObj?.logo || getCompanyLogoSrc(rec.profilePicture, index);
                const fallbackLogo = companyLogos[index % companyLogos.length];

                return (
                  <Link
                    key={rec._id}
                    to={`/recruiters`}
                    className="group flex flex-col justify-between rounded-2xl border border-[#EAEFF7] bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#3C65F5]/30 hover:shadow-xl cursor-pointer min-h-[160px]"
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
                          <h3 className="text-base font-extrabold text-[#05264E] group-hover:text-[#3C65F5] transition-colors truncate">
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

                    {/* Bottom Content: Location & Open Jobs */}
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-[#F0F4FC]">
                      <div className="flex items-center gap-1 text-[#66789C] font-semibold truncate max-w-[55%]">
                        <FiMapPin className="text-xs shrink-0 text-[#66789C]" />
                        <span className="truncate">{rec.currentLocation || "New York, US"}</span>
                      </div>
                      <span className="font-extrabold text-[#66789C] group-hover:text-[#3C65F5] transition-colors">
                        {openCount} Open Jobs
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Auto Carousel Indicator Dots */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStartIndex(idx * visibleCount)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentPage === idx
                        ? "w-8 bg-[#3C65F5]"
                        : "w-2.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide page ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
};

export default TopRecruitersSection;
