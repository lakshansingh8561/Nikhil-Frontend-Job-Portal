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

      {/* 2. WE ARE HIRING Banner Section */}
      <section className="py-12 bg-slate-50/50">
        <Container>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-1/3 flex justify-center shrink-0">
              <img
                src={hiringImage1}
                alt="We Are Hiring"
                className="max-h-44 object-contain"
              />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left flex-1">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 tracking-wider uppercase block mb-1">
                  CAREER MOBILITY
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  We are hiring
                </h2>
              </div>

              <div className="max-w-xs">
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  Join innovative engineering teams building the next era of enterprise SaaS.
                </p>
              </div>

              <div>
                <button
                  onClick={() => navigate("/jobs")}
                  className="saas-btn-primary"
                >
                  <FiCheckCircle /> View Open Positions
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/3 flex justify-center shrink-0 hidden lg:flex">
              <img
                src={hiringImage2}
                alt="Explore Opportunities"
                className="max-h-44 object-contain"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Featured Open Positions Section */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1 block">
                FEATURED OPPORTUNITIES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Jobs of the Day
              </h2>
              <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                Explore handpicked engineering, product, and leadership roles
              </p>
            </div>

            <Link
              to="/jobs"
              className="saas-btn-secondary h-9 text-xs"
            >
              <span>Explore All Jobs</span>
              <FiArrowRight />
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categoryTabs.map((tab) => {
              const isActive = activeCategoryTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveCategoryTab(tab)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer border ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 border-indigo-200 shadow-2xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Jobs Grid */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-slate-200">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
            </div>
          ) : jobsList.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobsList.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="saas-card p-12 text-center">
              <h3 className="text-base font-bold text-slate-900">No Jobs Posted Yet</h3>
              <p className="text-xs text-slate-500 mt-1">
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

      {/* 6. Newsletter Subscription Section */}
      <NewsletterSection />

      <ScrollToTop />
    </div>
  );
};

export default Home;