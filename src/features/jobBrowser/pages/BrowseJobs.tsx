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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderIndependentContent = (isPublicPage = false) => (
    <div className={`flex flex-col w-full min-h-0 overflow-hidden ${isPublicPage ? "h-[calc(100vh-100px)]" : "h-full"}`}>
      {/* Top Header & Search Control */}
      <div className="shrink-0 mb-4">
        <div className="flex items-center justify-between mb-3 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Explore Tech Positions
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Filter through verified engineering opportunities across modern software companies
            </p>
          </div>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden saas-btn-secondary h-8 text-xs px-3"
          >
            <FiFilter /> Filters
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
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" />
          <div
            className="absolute right-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-white overflow-y-auto p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <FiX className="text-lg" />
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

      {/* Main Grid Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-hidden">
        {/* Left Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-3 h-full overflow-y-auto overscroll-contain pr-1 custom-table-scrollbar">
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

        {/* Right Scrollable Job Grid */}
        <div className="lg:col-span-8 xl:col-span-9 h-full overflow-y-auto overscroll-contain pr-1 pb-8 custom-table-scrollbar">
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

  if (isDashboardMode) {
    return renderIndependentContent(false);
  }

  return (
    <div className="h-screen w-full bg-slate-50/50 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {renderIndependentContent(true)}
    </div>
  );
};

export default BrowseJobs;
