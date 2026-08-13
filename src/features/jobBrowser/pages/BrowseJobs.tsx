import React, { useState, useEffect } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import { useLocation, useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import JobList from "../components/JobList";
import Pagination from "../components/Pagination";
import { useGetJobsQuery } from "../api/jobBrowserApi";

const BrowseJobs: React.FC = () => {
  const routerLocation = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isDashboardMode = routerLocation.pathname.startsWith("/job-seeker");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [industry, setIndustry] = useState(searchParams.get("industry") || "");
  const [employmentType, setEmploymentType] = useState(searchParams.get("employmentType") || "");
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get("experienceLevel") || "");
  const [salaryMin, setSalaryMin] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Query parameters state passed to RTK Query
  const [activeParams, setActiveParams] = useState({
    page: 1,
    limit: 12,
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    industry: searchParams.get("industry") || "",
    employmentType: searchParams.get("employmentType") || "",
    experienceLevel: searchParams.get("experienceLevel") || "",
    salaryMin: 0,
    skills: [] as string[],
  });

  // Sync state when URL query params change (e.g., navigating from Home page search bar)
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlLocation = searchParams.get("location") || "";
    const urlIndustry = searchParams.get("industry") || "";
    const urlEmpType = searchParams.get("employmentType") || "";
    const urlExpLevel = searchParams.get("experienceLevel") || "";

    setSearch(urlSearch);
    setLocation(urlLocation);
    setIndustry(urlIndustry);
    if (urlEmpType) setEmploymentType(urlEmpType);
    if (urlExpLevel) setExperienceLevel(urlExpLevel);

    setActiveParams((prev) => ({
      ...prev,
      page: 1,
      search: urlSearch,
      location: urlLocation,
      industry: urlIndustry,
      employmentType: urlEmpType || prev.employmentType,
      experienceLevel: urlExpLevel || prev.experienceLevel,
    }));
  }, [searchParams]);

  // Fetch jobs using RTK Query
  const { data, isLoading, isError, error, refetch } = useGetJobsQuery({
    page,
    limit,
    search: activeParams.search || undefined,
    location: activeParams.location || undefined,
    industry: activeParams.industry || undefined,
    employmentType: activeParams.employmentType || undefined,
    experienceLevel: activeParams.experienceLevel || undefined,
    salaryMin: activeParams.salaryMin > 0 ? activeParams.salaryMin : undefined,
    skills: activeParams.skills.length > 0 ? activeParams.skills : undefined,
  });

  const jobsList = data?.jobs || [];
  const pagination = data?.pagination || {
    page: 1,
    limit,
    total: jobsList.length,
    pages: 1,
  };

  const handleSearchSubmit = () => {
    setPage(1);
    setActiveParams({
      page: 1,
      limit,
      search,
      location,
      industry,
      employmentType,
      experienceLevel,
      salaryMin,
      skills: selectedSkills,
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    setLocation("");
    setIndustry("");
    setEmploymentType("");
    setExperienceLevel("");
    setSalaryMin(0);
    setSelectedSkills([]);
    setPage(1);
    setSearchParams({});
    setActiveParams({
      page: 1,
      limit,
      search: "",
      location: "",
      industry: "",
      employmentType: "",
      experienceLevel: "",
      salaryMin: 0,
      skills: [],
    });
  };

  // Sync pagination page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Shared inner content with independent column scrolling
  const renderIndependentContent = (isPublicPage = false) => (
    <div className={`flex flex-col w-full min-h-0 overflow-hidden ${isPublicPage ? "h-[calc(100vh-110px)]" : "h-full"}`}>
      {/* Fixed Top Header & Search Bar */}
      <div className="shrink-0 mb-3">
        <div className="flex items-start justify-between mb-2 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#05264E]">
              Browse Jobs
            </h1>
            <p className="text-xs font-medium text-[#66789C]">
              Explore live job opportunities from top tech companies
            </p>
          </div>
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-xl border border-[#EAEFF7] bg-white text-xs font-bold text-[#05264E] hover:border-[#3C65F5] hover:text-[#3C65F5] transition cursor-pointer"
          >
            <FiFilter className="text-sm" /> Filters
          </button>
        </div>

        <SearchBar
          search={search}
          setSearch={(val) => {
            setSearch(val);
            setPage(1);
            setActiveParams((prev) => ({ ...prev, search: val }));
          }}
          location={location}
          setLocation={(val) => {
            setLocation(val);
            setPage(1);
            setActiveParams((prev) => ({ ...prev, location: val }));
          }}
          employmentType={employmentType}
          setEmploymentType={(val) => {
            setEmploymentType(val);
            setPage(1);
            setActiveParams((prev) => ({ ...prev, employmentType: val }));
          }}
          experienceLevel={experienceLevel}
          setExperienceLevel={(val) => {
            setExperienceLevel(val);
            setPage(1);
            setActiveParams((prev) => ({ ...prev, experienceLevel: val }));
          }}
          onSearchSubmit={handleSearchSubmit}
        />
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-white overflow-y-auto p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#05264E]">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 rounded-xl border border-[#EAEFF7] text-[#05264E] hover:bg-red-50 hover:text-red-500 transition cursor-pointer"
              >
                <FiX className="text-base" />
              </button>
            </div>
            <FilterSidebar
              location={location}
              setLocation={(val) => {
                setLocation(val);
                setActiveParams((prev) => ({ ...prev, location: val }));
              }}
              industry={industry}
              setIndustry={(val) => {
                setIndustry(val);
                setActiveParams((prev) => ({ ...prev, industry: val }));
              }}
              employmentType={employmentType}
              setEmploymentType={(val) => {
                setEmploymentType(val);
                setActiveParams((prev) => ({ ...prev, employmentType: val }));
              }}
              experienceLevel={experienceLevel}
              setExperienceLevel={(val) => {
                setExperienceLevel(val);
                setActiveParams((prev) => ({ ...prev, experienceLevel: val }));
              }}
              salaryMin={salaryMin}
              setSalaryMin={(val) => {
                setSalaryMin(val);
                setActiveParams((prev) => ({ ...prev, salaryMin: val }));
              }}
              selectedSkills={selectedSkills}
              setSelectedSkills={(updater) => {
                setSelectedSkills((prevSkills) => {
                  const newSkills =
                    typeof updater === "function" ? updater(prevSkills) : updater;
                  setActiveParams((prev) => ({ ...prev, skills: newSkills }));
                  return newSkills;
                });
              }}
              onReset={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Independent Scrolling Columns Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-hidden">
        {/* Left Column: Desktop Scrollable Filter Jobs Sidebar (hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-3 h-full overflow-y-auto overscroll-contain pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <FilterSidebar
            location={location}
            setLocation={(val) => {
              setLocation(val);
              setActiveParams((prev) => ({ ...prev, location: val }));
            }}
            industry={industry}
            setIndustry={(val) => {
              setIndustry(val);
              setActiveParams((prev) => ({ ...prev, industry: val }));
            }}
            employmentType={employmentType}
            setEmploymentType={(val) => {
              setEmploymentType(val);
              setActiveParams((prev) => ({ ...prev, employmentType: val }));
            }}
            experienceLevel={experienceLevel}
            setExperienceLevel={(val) => {
              setExperienceLevel(val);
              setActiveParams((prev) => ({ ...prev, experienceLevel: val }));
            }}
            salaryMin={salaryMin}
            setSalaryMin={(val) => {
              setSalaryMin(val);
              setActiveParams((prev) => ({ ...prev, salaryMin: val }));
            }}
            selectedSkills={selectedSkills}
            setSelectedSkills={(updater) => {
              setSelectedSkills((prevSkills) => {
                const newSkills =
                  typeof updater === "function" ? updater(prevSkills) : updater;
                setActiveParams((prev) => ({ ...prev, skills: newSkills }));
                return newSkills;
              });
            }}
            onReset={handleResetFilters}
          />
        </div>

        {/* Right Column: Independent Scrollable Main Jobs List */}
        <div className="lg:col-span-8 xl:col-span-9 h-full overflow-y-auto overscroll-contain pr-1 pb-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <JobList
            jobs={jobsList}
            pagination={pagination}
            isLoading={isLoading}
            isError={isError}
            error={error}
            refetch={refetch}
            limit={limit}
            setLimit={(val) => {
              setLimit(val);
              setPage(1);
            }}
            layout={layout}
            setLayout={setLayout}
            onResetFilters={handleResetFilters}
          />

          {!isLoading && !isError && jobsList.length > 0 && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );

  // Dashboard Mode
  if (isDashboardMode) {
    return renderIndependentContent(false);
  }

  // Public Landing Page Mode (http://localhost:5173/jobs)
  return (
    <div className="h-screen w-full bg-[#F5F7FC] pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {renderIndependentContent(true)}
    </div>
  );
};

export default BrowseJobs;
