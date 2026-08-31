import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiBriefcase,
  FiHeadphones,
  FiDollarSign,
  FiCode,
  FiUserCheck,
  FiShoppingBag,
  FiEdit3,
  FiBarChart2,
  FiTrendingUp,
} from "react-icons/fi";
import Hero from "../components/home/Hero";
import Container from "../components/common/Container";
import JobCard from "../components/jobs/JobCard";
import ScrollToTop from "../components/common/ScrollToTop";
import { useGetJobsQuery } from "../features/jobBrowser/api/jobBrowserApi";

import hiringImage1 from "../assets/images/hiring-image1.png";
import hiringImage2 from "../assets/images/hiring-image2.png";
import FindRightJobSection from "../components/home/FindRightJobSection";
import TopRecruitersSection from "../components/home/TopRecruitersSection";
import JobsByLocationSection from "../components/home/JobsByLocationSection";
import NewsAndBlogSection from "../components/home/NewsAndBlogSection";
import NewsletterSection from "../components/home/NewsletterSection";

const categories = [
  { name: "Software Development", jobsCount: "1,856 Active Jobs", icon: FiCode },
  { name: "Marketing & Sales", jobsCount: "1,526 Active Jobs", icon: FiBriefcase },
  { name: "Finance & Accounting", jobsCount: "368 Active Jobs", icon: FiDollarSign },
  { name: "Customer Experience", jobsCount: "285 Active Jobs", icon: FiHeadphones },
  { name: "Human Resources", jobsCount: "265 Active Jobs", icon: FiUserCheck },
  { name: "Product & E-Commerce", jobsCount: "540 Active Jobs", icon: FiShoppingBag },
  { name: "Content & Design", jobsCount: "430 Active Jobs", icon: FiEdit3 },
  { name: "Executive Leadership", jobsCount: "410 Active Jobs", icon: FiBarChart2 },
];

const categoryTabs = [
  "Management",
  "Marketing & Sale",
  "Finance",
  "Human Resource",
  "Retail & Products",
  "Content Writer",
];

const Home = () => {
  const navigate = useNavigate();
  const [activeCategoryTab, setActiveCategoryTab] = useState("Management");
  const [categoryStartIndex, setCategoryStartIndex] = useState(0);

  const { data, isLoading } = useGetJobsQuery({ limit: 6 });
  const jobsList = data?.jobs || [];

  const handlePrevCategory = () => {
    setCategoryStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextCategory = () => {
    setCategoryStartIndex((prev) =>
      Math.min(prev + 1, Math.max(0, categories.length - 4))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Banner */}
      <Hero />

      {/* 1. Browse by Category Section */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                <FiTrendingUp /> Explore Opportunities
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Explore by Category
              </h2>
              <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                Discover positions curated across core tech and business disciplines
              </p>
            </div>

            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevCategory}
                disabled={categoryStartIndex === 0}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer shadow-xs"
              >
                <FiChevronLeft className="text-base" />
              </button>
              <button
                onClick={handleNextCategory}
                disabled={categoryStartIndex >= categories.length - 4}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer shadow-xs"
              >
                <FiChevronRight className="text-base" />
              </button>
            </div>
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories
              .slice(categoryStartIndex, categoryStartIndex + 4)
              .map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                    className="saas-card-interactive group p-6 flex flex-col justify-between min-h-[160px]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition duration-150 group-hover:bg-indigo-600 group-hover:text-white mb-4">
                      <Icon className="text-lg" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {cat.jobsCount}
                      </p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </Container>
      </section>

      {/* 2. WE ARE HIRING Banner Section — Exact JobBox Template Structure */}
      <section className="py-8 bg-slate-50/50">
        <Container>
          <div className="relative bg-white border border-[#E0E6F6] rounded-2xl shadow-xs py-8 sm:py-10 px-6 sm:px-10 lg:pl-[190px] lg:pr-[250px] flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden">
            {/* Left Illustration (hiringImage1: 150px x 120px) */}
            <img
              src={hiringImage1}
              alt="We Are Hiring"
              className="hidden lg:block absolute bottom-0 left-0 w-[150px] h-[120px] object-contain object-left-bottom pointer-events-none select-none"
            />

            {/* text-1: WE ARE HIRING */}
            <div className="text-center lg:text-left shrink-0">
              <span className="text-[#66789C] text-xs sm:text-[14px] font-bold tracking-[2px] uppercase block mb-1">
                WE ARE
              </span>
              <span className="text-[#05264E] text-3xl sm:text-[46px] lg:text-[49px] font-extrabold sm:leading-[51px] tracking-[1px] uppercase block">
                HIRING
              </span>
            </div>

            {/* text-2: Description */}
            <div className="text-center lg:text-left text-[#66789C] text-sm sm:text-[18px] font-medium leading-[23px]">
              Let’s <span className="text-[#05264E] font-bold">Work</span> Together<br className="hidden sm:inline" />
              {" "}&amp; <span className="text-[#05264E] font-bold">Explore</span> Opportunities
            </div>

            {/* text-3: Apply now button */}
            <div className="shrink-0">
              <button
                onClick={() => navigate("/jobs")}
                className="rounded-xl bg-[#3C65F5] hover:bg-[#2C52E0] text-white font-extrabold text-sm px-7 py-3.5 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer inline-flex items-center gap-2"
              >
                <FiCheckCircle className="text-base" />
                <span>Apply now</span>
              </button>
            </div>

            {/* Right Illustration (hiringImage2: 250px x 120px) */}
            <img
              src={hiringImage2}
              alt="Explore Opportunities"
              className="hidden lg:block absolute bottom-0 right-0 w-[250px] h-[120px] object-contain object-right-bottom pointer-events-none select-none"
            />
          </div>
        </Container>
      </section>

      {/* 3. Featured Open Positions Section — Jobs of the Day */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#05264E] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
                Jobs of the day
              </h2>
              <p className="mt-1 text-sm font-medium text-[#66789C] font-['Plus_Jakarta_Sans',sans-serif]">
                Search and connect with the right candidates faster.
              </p>
            </div>

            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#E0E6F6] px-4 py-2 text-[14px] font-medium text-[#05264E] hover:text-[#3C65F5] hover:border-[#3C65F5]/40 hover:shadow-xs transition-all font-['Plus_Jakarta_Sans',sans-serif] shrink-0"
            >
              <span>Explore All Jobs</span>
              <FiArrowRight className="text-base" />
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5 mb-8">
            {categoryTabs.map((tab) => {
              const isActive = activeCategoryTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveCategoryTab(tab)}
                  className={`rounded-xl px-4 py-2 text-xs font-medium transition-all cursor-pointer border font-['Plus_Jakarta_Sans',sans-serif] ${
                    isActive
                      ? "bg-[#3C65F5] text-white border-[#3C65F5] shadow-xs font-bold"
                      : "bg-white text-[#05264E] border-[#E0E6F6] hover:border-[#3C65F5]/50 hover:text-[#3C65F5]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Jobs Grid — 4 Columns on XL matching 311.5px Card Width */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-slate-200">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#3C65F5] border-t-transparent" />
            </div>
          ) : jobsList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {jobsList.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E0E6F6] p-12 text-center">
              <h3 className="text-base font-bold text-[#05264E]">No Jobs Posted Yet</h3>
              <p className="text-xs font-medium text-[#66789C] mt-1">
                Check back soon for newly published career opportunities.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* 4. Millions Of Jobs Section */}
      <FindRightJobSection />

      {/* 5. Top Recruiters Section */}
      <TopRecruitersSection />

      {/* 6. Jobs by Location Section */}
      <JobsByLocationSection />

      {/* 7. News and Blog Section */}
      <NewsAndBlogSection />

      {/* 8. Newsletter Subscription Section */}
      <NewsletterSection />

      <ScrollToTop />
    </div>
  );
};

export default Home;