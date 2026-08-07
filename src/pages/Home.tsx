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
} from "react-icons/fi";
import Hero from "../components/home/Hero";
import Container from "../components/common/Container";
import JobCard from "../components/jobs/JobCard";
import ScrollToTop from "../components/common/ScrollToTop";
import { useGetJobsQuery } from "../features/jobBrowser/api/jobBrowserApi";

import hiringImage1 from "../assets/images/hiring-image1.png";
import hiringImage2 from "../assets/images/hiring-image2.png";
import FindRightJobSection from "../components/home/FindRightJobSection";

const categories = [
  { name: "Marketing & Sale", jobsCount: "1526 Jobs Available", icon: FiBriefcase },
  { name: "Customer Help", jobsCount: "185 Jobs Available", icon: FiHeadphones },
  { name: "Finance", jobsCount: "168 Jobs Available", icon: FiDollarSign },
  { name: "Software", jobsCount: "1856 Jobs Available", icon: FiCode },
  { name: "Human Resource", jobsCount: "165 Jobs Available", icon: FiUserCheck },
  { name: "Retail & Products", jobsCount: "540 Jobs Available", icon: FiShoppingBag },
  { name: "Content Writer", jobsCount: "230 Jobs Available", icon: FiEdit3 },
  { name: "Management", jobsCount: "410 Jobs Available", icon: FiBarChart2 },
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
    <div className="min-h-screen bg-[#F5F7FC]">
      {/* Hero Banner */}
      <Hero />

      {/* 1. Browse by category Section */}
      <section className="py-16 bg-white border-b border-[#EAEFF7]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#05264E]">
              Browse by category
            </h2>
            <p className="mt-2 text-sm font-medium text-[#66789C]">
              Find the job that's perfect for you. about 800+ new jobs everyday
            </p>
          </div>

          {/* Slider Controls + Category Cards */}
          <div className="relative flex items-center gap-4">
            {/* Left Arrow */}
            <button
              onClick={handlePrevCategory}
              disabled={categoryStartIndex === 0}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EBF2FF] text-[#3C65F5] transition hover:bg-[#3C65F5] hover:text-white disabled:opacity-30 cursor-pointer shadow-xs"
            >
              <FiChevronLeft className="text-xl" />
            </button>

            {/* Category Cards Grid / Slider */}
            <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {categories
                .slice(categoryStartIndex, categoryStartIndex + 4)
                .map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.name}
                      to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                      className="group flex flex-col justify-between rounded-2xl border border-[#EAEFF7] bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#3C65F5]/40 hover:shadow-xl cursor-pointer min-h-[170px]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EBF2FF] text-[#3C65F5] transition duration-300 group-hover:bg-[#3C65F5] group-hover:text-white mb-4">
                        <Icon className="text-xl" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#05264E] group-hover:text-[#3C65F5] transition-colors">
                          {cat.name}
                        </h3>
                        <p className="mt-1 text-xs font-semibold text-[#66789C]">
                          {cat.jobsCount}
                        </p>
                      </div>
                    </Link>
                  );
                })}
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNextCategory}
              disabled={categoryStartIndex >= categories.length - 4}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EBF2FF] text-[#3C65F5] transition hover:bg-[#3C65F5] hover:text-white disabled:opacity-30 cursor-pointer shadow-xs"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </div>
        </Container>
      </section>

      {/* 2. WE ARE HIRING Banner Section */}
      <section className="py-10 bg-[#F5F7FC]">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-[#EAEFF7] bg-white p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Graphic Image: hiring-image1 */}
            <div className="w-full md:w-1/3 flex justify-center shrink-0">
              <img
                src={hiringImage1}
                alt="We Are Hiring"
                className="max-h-48 sm:max-h-56 object-contain"
              />
            </div>

            {/* Middle Hiring Content */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left flex-1">
              <div>
                <span className="text-xs font-extrabold text-[#66789C] tracking-widest uppercase block mb-1">
                  WE ARE
                </span>
                <h2 className="text-4xl sm:text-5xl font-black text-[#05264E] tracking-tight">
                  HIRING
                </h2>
              </div>

              <div className="max-w-xs">
                <p className="text-base sm:text-lg font-bold text-[#05264E] leading-snug">
                  Let's <span className="text-[#3C65F5]">Work Together</span> & <span className="text-[#3C65F5]">Explore Opportunities</span>
                </p>
              </div>

              <div>
                <button
                  onClick={() => navigate("/jobs")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-6 py-3.5 text-xs font-extrabold text-white shadow-md hover:bg-[#254BD6] hover:shadow-lg transition cursor-pointer"
                >
                  <FiCheckCircle className="text-sm" /> Apply now
                </button>
              </div>
            </div>

            {/* Right Graphic Image: hiring-image2 */}
            <div className="w-full md:w-1/3 flex justify-center shrink-0 hidden lg:flex">
              <img
                src={hiringImage2}
                alt="Explore Opportunities"
                className="max-h-48 sm:max-h-56 object-contain"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Jobs of the day Section */}
      <section className="py-16 bg-white border-t border-[#EAEFF7]">
        <Container>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-3xl font-extrabold text-[#05264E]">
              Jobs of the day
            </h2>
            <p className="mt-2 text-sm font-medium text-[#66789C]">
              Search and connect with the right candidates faster.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {categoryTabs.map((tab) => {
              const isActive = activeCategoryTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveCategoryTab(tab)}
                  className={`rounded-xl px-5 py-2.5 text-xs font-bold transition cursor-pointer border ${
                    isActive
                      ? "bg-[#E8F0FE] text-[#3C65F5] border-[#3C65F5] shadow-2xs"
                      : "bg-white text-[#05264E] border-[#EAEFF7] hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Jobs Grid */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-[#EAEFF7]">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent" />
            </div>
          ) : jobsList.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobsList.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-12 text-center border border-[#EAEFF7] shadow-sm">
              <h3 className="text-lg font-bold text-[#05264E]">No Jobs Available</h3>
              <p className="text-xs text-[#66789C] mt-1">
                Check back soon for new job postings!
              </p>
            </div>
          )}

          {/* View All Jobs Link */}
          <div className="mt-10 text-center">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F8FAFC] px-6 py-3 text-xs font-bold text-[#3C65F5] border border-[#EAEFF7] hover:bg-[#E8F0FE] transition cursor-pointer"
            >
              <span>Explore All Jobs</span>
              <FiArrowRight />
            </Link>
          </div>
        </Container>
      </section>

      {/* 4. Millions Of Jobs / Find The One That's Right For You Section */}
      <FindRightJobSection />

      <ScrollToTop />
    </div>
  );
};

export default Home;