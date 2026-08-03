import React, { useState } from "react";
import Container from "../../../components/common/Container";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import JobList from "../components/JobList";
import Pagination from "../components/Pagination";
import ScrollToTop from "../../../components/common/ScrollToTop";
import { useGetJobsQuery } from "../api/jobBrowserApi";

const BrowseJobs: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [salaryMin, setSalaryMin] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  // Query parameters state passed to RTK Query
  const [activeParams, setActiveParams] = useState({
    page: 1,
    limit: 12,
    search: "",
    location: "",
    employmentType: "",
    experienceLevel: "",
    salaryMin: 0,
    skills: [] as string[],
  });

  // Fetch jobs using RTK Query
  const { data, isLoading, isError, error, refetch } = useGetJobsQuery({
    page,
    limit,
    search: activeParams.search || undefined,
    location: activeParams.location || undefined,
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
      employmentType,
      experienceLevel,
      salaryMin,
      skills: selectedSkills,
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    setLocation("");
    setEmploymentType("");
    setExperienceLevel("");
    setSalaryMin(0);
    setSelectedSkills([]);
    setPage(1);
    setActiveParams({
      page: 1,
      limit,
      search: "",
      location: "",
      employmentType: "",
      experienceLevel: "",
      salaryMin: 0,
      skills: [],
    });
  };

  // Sync pagination page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FC] pt-28 pb-16">
      <Container>
        {/* Page Title Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#05264E]">
            Browse Jobs
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-medium text-[#66789C]">
            Explore live job opportunities from top tech companies
          </p>
        </div>

        {/* Top Search Bar */}
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

        {/* Main Two Column Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Filter Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <FilterSidebar
              location={location}
              setLocation={(val) => {
                setLocation(val);
                setActiveParams((prev) => ({ ...prev, location: val }));
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

          {/* Right Column: Job Cards List & Pagination */}
          <div className="lg:col-span-8 xl:col-span-9">
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
      </Container>

      <ScrollToTop />
    </div>
  );
};

export default BrowseJobs;
