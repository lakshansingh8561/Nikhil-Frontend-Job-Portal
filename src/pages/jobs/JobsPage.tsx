import { useState } from "react";
import { FiGrid, FiList, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Container from "../../components/common/Container";
import JobHeroBanner from "../../components/jobs/JobHeroBanner";
import JobFilterSidebar from "../../components/jobs/JobFilterSidebar";
import JobCard from "../../components/jobs/JobCard";
import ScrollToTop from "../../components/common/ScrollToTop";
import { useGetJobsQuery } from "../../features/jobs/api/jobsApi";

const JobsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [keyword, setKeyword] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [salaryMax, setSalaryMax] = useState(200000);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch 100% pure live data from backend API
  const { data, isLoading } = useGetJobsQuery({
    page,
    limit,
    search: keyword || undefined,
    location: location || undefined,
    employmentType: employmentType || undefined,
  });

  const jobsList = data?.jobs || [];
  const pagination = data?.pagination || { page: 1, limit, total: jobsList.length, pages: 1 };

  const handleResetFilters = () => {
    setKeyword("");
    setIndustry("");
    setLocation("");
    setEmploymentType("");
    setExperienceLevel("");
    setSalaryMax(200000);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FC] pt-24 pb-16">
      <Container>
        {/* Top Hero Banner */}
        <JobHeroBanner
          totalJobs={pagination.total}
          industry={industry}
          setIndustry={setIndustry}
          location={location}
          setLocation={setLocation}
          keyword={keyword}
          setKeyword={setKeyword}
          onSearch={() => setPage(1)}
        />

        {/* Main Content Grid: Advance Filter Sidebar + Live Jobs Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <JobFilterSidebar
              selectedLocation={location}
              setSelectedLocation={setLocation}
              selectedIndustry={industry}
              setSelectedIndustry={setIndustry}
              selectedType={employmentType}
              setSelectedType={setEmploymentType}
              selectedExperience={experienceLevel}
              setSelectedExperience={setExperienceLevel}
              salaryMax={salaryMax}
              setSalaryMax={setSalaryMax}
              onReset={handleResetFilters}
            />
          </div>

          {/* Right Cards List */}
          <div className="lg:col-span-8 xl:col-span-9">
            {/* Header Control Row */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#EAEFF7] bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-[#66789C]">
                Showing <span className="text-[#05264E]">1–{jobsList.length}</span> of{" "}
                <span className="text-[#05264E]">{pagination.total}</span> jobs
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {/* Show Items Selector */}
                <div className="flex items-center gap-2">
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
                    <option value={48}>48</option>
                  </select>
                </div>

                {/* Sort By Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#66789C]">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#05264E] outline-none cursor-pointer"
                  >
                    <option value="newest">Newest Post</option>
                    <option value="oldest">Oldest Post</option>
                  </select>
                </div>

                {/* Grid / List Toggle */}
                <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      viewMode === "list"
                        ? "bg-[#3C65F5] text-white"
                        : "bg-[#F8FAFC] text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    <FiList className="text-base" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      viewMode === "grid"
                        ? "bg-[#3C65F5] text-white"
                        : "bg-[#F8FAFC] text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    <FiGrid className="text-base" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cards Container */}
            {isLoading ? (
              <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-[#EAEFF7]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent" />
              </div>
            ) : jobsList.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    : "space-y-4"
                }
              >
                {jobsList.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-12 text-center border border-[#EAEFF7] shadow-sm">
                <h3 className="text-lg font-bold text-[#05264E]">No Live Jobs Found</h3>
                <p className="text-xs text-[#66789C] mt-1">
                  There are currently no active jobs matching your filters in the database.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 rounded-xl bg-[#3C65F5] px-6 py-2.5 text-xs font-semibold text-white"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Backend Pagination Navigation Bar */}
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

      {/* Floating Action Scroll-to-Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default JobsPage;
