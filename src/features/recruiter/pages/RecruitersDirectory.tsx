import { useState } from "react";
import { FiMapPin, FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Container from "../../../components/common/Container";
import ScrollToTop from "../../../components/common/ScrollToTop";
import RecruiterFilterSidebar from "../components/RecruiterFilterSidebar";
import { useGetAllRecruitersQuery } from "../api/recruiterApi";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const RecruitersDirectory = () => {
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
    <div className="min-h-screen bg-[#F5F7FC] pt-28 pb-16">
      <Container>
        {/* Hero Header Banner */}
        <div className="mb-10 text-center max-w-3xl mx-auto rounded-3xl bg-white p-8 border border-[#EAEFF7] shadow-sm">
          <h1 className="text-3xl font-extrabold text-[#05264E] sm:text-4xl">
            Browse Companies
          </h1>
          <p className="mt-3 text-sm text-[#66789C]">
            Find top employers and hiring teams to take your career to the next level.
          </p>

          {/* Alphabet Letter Selector Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5 rounded-2xl bg-[#F8FAFC] p-3 border border-[#EAEFF7]">
            <button
              onClick={() => {
                setSelectedLetter("");
                setPage(1);
              }}
              className={`h-8 px-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                selectedLetter === ""
                  ? "bg-[#3C65F5] text-white"
                  : "text-[#05264E] hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {alphabet.map((char) => (
              <button
                key={char}
                onClick={() => {
                  setSelectedLetter(char);
                  setPage(1);
                }}
                className={`h-8 w-8 text-xs font-bold rounded-lg transition cursor-pointer ${
                  selectedLetter === char
                    ? "bg-[#3C65F5] text-white"
                    : "text-[#05264E] hover:bg-gray-200"
                }`}
              >
                {char}
              </button>
            ))}
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
                {recruiters.map((rec) => {
                  const companyName = rec.currentCompany || (rec.firstName ? `${rec.firstName} ${rec.lastName}` : "Top Company");
                  return (
                    <div
                      key={rec._id}
                      className="flex flex-col items-center justify-between rounded-2xl border border-[#EAEFF7] bg-white p-6 text-center shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 min-h-[300px]"
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3C65F5] font-extrabold text-white text-2xl shadow-md overflow-hidden mb-4">
                          {rec.profilePicture ? (
                            <img
                              src={rec.profilePicture}
                              alt={companyName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>{companyName.charAt(0)}</span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-[#05264E]">
                          {companyName}
                        </h3>

                        {/* Rating Stars */}
                        <div className="mt-1 flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <FiStar className="fill-current" />
                          <FiStar className="fill-current" />
                          <FiStar className="fill-current" />
                          <FiStar className="fill-current" />
                          <FiStar className="fill-current" />
                          <span className="text-[#66789C] ml-1 font-semibold">(66)</span>
                        </div>

                        <p className="mt-2 text-xs font-medium text-[#66789C] flex items-center gap-1">
                          <FiMapPin className="text-gray-400" />
                          <span>{rec.currentLocation || "New York, US"}</span>
                        </p>
                      </div>

                      {/* Open Jobs Pill */}
                      <div className="mt-6 w-full rounded-xl bg-[#EBF2FF] py-2.5 text-xs font-extrabold text-[#3C65F5]">
                        12 Jobs Open
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
      <ScrollToTop />
    </div>
  );
};

export default RecruitersDirectory;
