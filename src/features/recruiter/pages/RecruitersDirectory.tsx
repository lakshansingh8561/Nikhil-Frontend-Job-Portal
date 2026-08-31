import { useState } from "react";
import { FiMapPin, FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Container from "../../../components/common/Container";
import ScrollToTop from "../../../components/common/ScrollToTop";
import RecruiterFilterSidebar from "../components/RecruiterFilterSidebar";
import { useGetAllRecruitersQuery } from "../api/recruiterApi";
import type { RecruiterProfile } from "../types/recruiter.types";
import RecruiterJobsModal from "../components/RecruiterJobsModal";

import companyLogo1 from "../../../assets/images/company-logo1.png";
import companyLogo2 from "../../../assets/images/company-logo2.png";
import companyLogo3 from "../../../assets/images/company-logo3.png";
import companyLogo4 from "../../../assets/images/companyl-logo-4.png";
import companyLogo5 from "../../../assets/images/company-logo5.png";

const companyLogos = [
  companyLogo1,
  companyLogo2,
  companyLogo3,
  companyLogo4,
  companyLogo5,
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

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

const RecruitersDirectory = () => {
  const [selectedRecruiterForJobs, setSelectedRecruiterForJobs] = useState<RecruiterProfile | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [selectedLetter, setSelectedLetter] = useState("");
  const [location, setLocation] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedSalaryRange, setSelectedSalaryRange] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedWorkplace, setSelectedWorkplace] = useState("");
  const [selectedPostedDate, setSelectedPostedDate] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const setIndustryAndResetPage = (val: string) => {
    setSelectedIndustry(val);
    setPage(1);
  };
  const setSalaryRangeAndResetPage = (val: string) => {
    setSelectedSalaryRange(val);
    setPage(1);
  };
  const setKeywordAndResetPage = (val: string) => {
    setSelectedKeyword(val);
    setPage(1);
  };
  const setPositionAndResetPage = (val: string) => {
    setSelectedPosition(val);
    setPage(1);
  };
  const setExperienceAndResetPage = (val: string) => {
    setSelectedExperience(val);
    setPage(1);
  };
  const setWorkplaceAndResetPage = (val: string) => {
    setSelectedWorkplace(val);
    setPage(1);
  };
  const setPostedDateAndResetPage = (val: string) => {
    setSelectedPostedDate(val);
    setPage(1);
  };
  const setTypeAndResetPage = (val: string) => {
    setSelectedType(val);
    setPage(1);
  };
  const setLocationAndResetPage = (val: string) => {
    setLocation(val);
    setPage(1);
  };

  const { data, isLoading } = useGetAllRecruitersQuery({
    page,
    limit,
    search: selectedKeyword || undefined,
    letter: selectedLetter || undefined,
    location: location || undefined,
    industry: selectedIndustry || undefined,
    salaryRange: selectedSalaryRange || undefined,
    position: selectedPosition || undefined,
    experience: selectedExperience || undefined,
    workplace: selectedWorkplace || undefined,
    postedDate: selectedPostedDate || undefined,
    type: selectedType || undefined,
  });

  const recruiters = data?.recruiters || [];
  const pagination = data?.pagination || { page: 1, limit, total: recruiters.length, pages: 1 };

  const handleResetFilters = () => {
    setSelectedLetter("");
    setLocation("");
    setSelectedIndustry("");
    setSelectedSalaryRange("");
    setSelectedKeyword("");
    setSelectedPosition("");
    setSelectedExperience("");
    setSelectedWorkplace("");
    setSelectedPostedDate("");
    setSelectedType("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20">
      <Container>
        {/* Hero Header Banner — Compact & Balanced Height */}
        <div className="bg-[#F2F6FD] rounded-2xl pt-7 px-5 pb-8 mb-8 text-center border border-[#E0E6F6]/60">
          <h3 className="text-[28px] leading-[34px] font-bold text-[#05264E] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
            Browse Companies
          </h3>
          <div className="text-[14px] leading-[20px] text-[#66789C] font-['Plus_Jakarta_Sans',sans-serif] max-w-xl mx-auto mt-2 mb-5 font-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni,
            atque delectus molestias quis?
          </div>

          {/* Alphabet Letter Selector Bar — Single Line A-Z */}
          <div className="bg-white rounded-xl shadow-xs border border-[#E0E6F6] py-2 px-3 sm:px-6 mx-auto max-w-[850px] flex items-center justify-between overflow-x-auto gap-1 sm:gap-2 flex-nowrap select-none scrollbar-none">
            {alphabet.map((char) => {
              const isActive = selectedLetter === char;
              return (
                <button
                  key={char}
                  onClick={() => {
                    setSelectedLetter(isActive ? "" : char);
                    setPage(1);
                  }}
                  className={`text-[14px] font-semibold rounded-lg px-2 sm:px-2.5 py-1 transition-all cursor-pointer shrink-0 font-['Plus_Jakarta_Sans',sans-serif] ${
                    isActive
                      ? "bg-[#3C65F5] text-white shadow-xs font-bold"
                      : "text-[#66789C] hover:text-[#3C65F5] hover:bg-[#EFF3FC]"
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Section: Full Advance Filter Sidebar + Cards Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Full Advance Filter Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <RecruiterFilterSidebar
              location={location}
              setLocation={setLocationAndResetPage}
              selectedIndustry={selectedIndustry}
              setSelectedIndustry={setIndustryAndResetPage}
              selectedSalaryRange={selectedSalaryRange}
              setSelectedSalaryRange={setSalaryRangeAndResetPage}
              selectedKeyword={selectedKeyword}
              setSelectedKeyword={setKeywordAndResetPage}
              selectedPosition={selectedPosition}
              setSelectedPosition={setPositionAndResetPage}
              selectedExperience={selectedExperience}
              setSelectedExperience={setExperienceAndResetPage}
              selectedWorkplace={selectedWorkplace}
              setSelectedWorkplace={setWorkplaceAndResetPage}
              selectedPostedDate={selectedPostedDate}
              setSelectedPostedDate={setPostedDateAndResetPage}
              selectedType={selectedType}
              setSelectedType={setTypeAndResetPage}
              onReset={handleResetFilters}
            />
          </div>

          {/* Cards Area */}
          <div className="lg:col-span-8 xl:col-span-9">
            {/* Control Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#EAEFF7] bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-[#66789C]">
                Showing <span className="text-[#05264E]">1–{recruiters.length}</span> of{" "}
                <span className="text-[#05264E]">{pagination.total}</span> companies
              </p>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#66789C]">Show:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#05264E] outline-none cursor-pointer"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </div>
            </div>

            {/* Directory Cards Grid */}
            {isLoading ? (
              <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-[#EAEFF7]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent" />
              </div>
            ) : recruiters.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recruiters.map((rec, index) => {
                  const compObj = typeof rec.companyId === "object" && rec.companyId !== null ? (rec.companyId as any) : null;
                  const companyName =
                    compObj?.name ||
                    compObj?.companyName ||
                    rec.currentCompany ||
                    rec.companyName ||
                    (rec.firstName ? `${rec.firstName} ${rec.lastName}` : (rec.userId as any)?.email?.split("@")[0] || "Company");
                  const openCount = rec.openJobsCount || 0;
                  const fallbackLogo = companyLogos[index % companyLogos.length];
                  const logoSrc = compObj?.logo || getCompanyLogoSrc(rec.profilePicture, index);
                  const locationStr = compObj?.city || compObj?.country
                    ? `${compObj.city || ""}${compObj.city && compObj.country ? ", " : ""}${compObj.country || ""}`
                    : rec.currentLocation || "Location Not Specified";

                  return (
                    <div
                      key={rec._id}
                      onClick={() => setSelectedRecruiterForJobs(rec)}
                      className="group flex flex-col items-center justify-between rounded-3xl border border-[#EAEFF7] bg-white p-6 text-center shadow-xs hover:-translate-y-1.5 hover:shadow-xl hover:border-[#3C65F5]/30 transition-all duration-300 min-h-[310px] cursor-pointer"
                    >
                      <div className="flex flex-col items-center w-full">
                        {/* Company Logo Icon Container */}
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8FAFC] p-2.5 border border-[#EAEFF7] overflow-hidden mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                          <img
                            src={logoSrc}
                            alt={companyName}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = fallbackLogo;
                            }}
                          />
                        </div>

                        <h3 className="text-lg font-bold text-[#05264E] group-hover:text-[#3C65F5] transition-colors line-clamp-1">
                          {companyName}
                        </h3>

                        {/* 5-Star Rating */}
                        <div className="mt-1 flex items-center justify-center gap-0.5 text-amber-400 text-xs font-bold">
                          <FiStar className="fill-current" />
                          <FiStar className="fill-current" />
                          <FiStar className="fill-current" />
                          <FiStar className="fill-current" />
                          <FiStar className="fill-current" />
                          <span className="text-[#66789C] ml-1 font-semibold text-[11px]">(52)</span>
                        </div>

                        <p className="mt-2 text-xs font-medium text-[#66789C] flex items-center justify-center gap-1">
                          <FiMapPin className="text-gray-400" />
                          <span>{locationStr}</span>
                        </p>
                      </div>

                      {/* Open Jobs Pill Button */}
                      <div className="mt-6 w-full rounded-xl bg-[#EBF2FF] py-3 text-xs font-extrabold text-[#3C65F5] group-hover:bg-[#3C65F5] group-hover:text-white transition-all shadow-2xs">
                        {`${openCount} Jobs Open`}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-12 text-center border border-[#EAEFF7] shadow-sm">
                <h3 className="text-lg font-bold text-[#05264E]">No Companies Found</h3>
                <p className="text-xs text-[#66789C] mt-1">
                  Create a recruiter profile to show up in the Companies directory!
                </p>
              </div>
            )}

            {/* Pagination Navigation Bar */}
            {pagination.pages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EAEFF7] bg-white text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                >
                  <FiChevronLeft />
                </button>

                <span className="text-xs font-semibold text-[#05264E] px-3">
                  Page {pagination.page} of {pagination.pages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
                  disabled={page === pagination.pages}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EAEFF7] bg-white text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Recruiter Jobs Modal */}
      <RecruiterJobsModal
        isOpen={Boolean(selectedRecruiterForJobs)}
        onClose={() => setSelectedRecruiterForJobs(null)}
        recruiter={selectedRecruiterForJobs}
      />
      <ScrollToTop />
    </div>
  );
};

export default RecruitersDirectory;
