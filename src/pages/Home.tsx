import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
} from "react-icons/fi";
import Hero from "../components/home/Hero";
import Container from "../components/common/Container";
import JobCard from "../components/jobs/JobCard";
import ScrollToTop from "../components/common/ScrollToTop";
import { useGetJobsQuery } from "../features/jobBrowser/api/jobBrowserApi";

import hiringImage1 from "../assets/images/hiring-image1.png";
import hiringImage2 from "../assets/images/hiring-image2.png";
import BrowseByCategorySection from "../components/home/BrowseByCategorySection";
import FindRightJobSection from "../components/home/FindRightJobSection";
import TopRecruitersSection from "../components/home/TopRecruitersSection";
import JobsByLocationSection from "../components/home/JobsByLocationSection";
import NewsAndBlogSection from "../components/home/NewsAndBlogSection";
import NewsletterSection from "../components/home/NewsletterSection";

import managementSvg from "../assets/images/management.svg";
import marketingSvg from "../assets/images/marketing.svg";
import financeSvg from "../assets/images/finance.svg";
import humanSvg from "../assets/images/human.svg";
import retailSvg from "../assets/images/retail.svg";
import contentSvg from "../assets/images/content.svg";

const categoryTabs = [
  { name: "Management", icon: managementSvg },
  { name: "Marketing & Sale", icon: marketingSvg },
  { name: "Finance", icon: financeSvg },
  { name: "Human Resource", icon: humanSvg },
  { name: "Retail & Products", icon: retailSvg },
  { name: "Content Writer", icon: contentSvg },
];

const Home = () => {
  const navigate = useNavigate();
  const [activeCategoryTab, setActiveCategoryTab] = useState("Management");

  const { data, isLoading } = useGetJobsQuery({ limit: 6 });
  const jobsList = data?.jobs || [];

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Banner */}
      <Hero />

      {/* 1. Browse by Category Section */}
      <BrowseByCategorySection />

      {/* 2. WE ARE HIRING Banner Section — Exact JobBox Template Structure */}
      <section className="py-10 bg-white font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-full px-4 sm:px-6">
          <div
            className="box-we-hiring relative bg-white border border-[#E0E6F7] rounded-[4px] py-[40px] px-6 sm:px-12 lg:pt-[40px] lg:pb-[40px] lg:pl-[190px] lg:pr-[250px] flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 overflow-hidden mx-auto"
            style={{
              maxWidth: "948px",
              width: "100%",
              boxShadow: "0 10px 20px -5px rgba(10, 42, 105, 0.06)",
            }}
          >
            {/* Left Illustration (hiringImage1) */}
            <img
              src={hiringImage1}
              alt="We Are Hiring"
              className="hidden lg:block absolute bottom-0 left-0 w-[160px] h-[130px] object-contain object-left-bottom pointer-events-none select-none z-0"
            />

            {/* text-1: WE ARE HIRING */}
            <div className="text-1 text-center lg:text-left shrink-0">
              <span
                className="text-we-are uppercase block"
                style={{
                  color: "#A0ABB8",
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  lineHeight: "20px",
                  marginBottom: "4px",
                }}
              >
                WE ARE
              </span>
              <span
                className="text-hiring uppercase block"
                style={{
                  fontSize: "49px",
                  lineHeight: "51px",
                  color: "#05264E",
                  fontWeight: 800,
                  letterSpacing: "1px",
                }}
              >
                HIRING
              </span>
            </div>

            {/* text-2: Description starting from hiring level with padding 29px 20px 0 */}
            <div
              className="text-2 text-center lg:text-left shrink-0"
              style={{
                fontSize: "18px",
                lineHeight: "23px",
                color: "#66789C",
                fontWeight: 500,
                padding: "29px 20px 0",
              }}
            >
              Let’s <span style={{ color: "#05264E", fontWeight: 700 }}>Work</span>
              <br />
              Together
              <br />
              &amp; <span style={{ color: "#05264E", fontWeight: 700 }}>Explore</span>
              <br />
              Opportunities
            </div>

            {/* text-3: Apply now button with exact padding & styling */}
            <div className="relative z-20 shrink-0 lg:pt-[29px]">
              <button
                onClick={() => navigate("/jobs")}
                className="btn btn-apply inline-flex items-center gap-2 transition-all duration-200 cursor-pointer hover:opacity-95"
                style={{
                  backgroundColor: "#3C65F5",
                  color: "#FFFFFF",
                  padding: "12px 20px",
                  borderRadius: "4px",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  lineHeight: 1,
                  boxShadow: "0 4px 10px rgba(60, 101, 245, 0.2)",
                }}
              >
                <FiCheckCircle className="text-base" />
                <span>Apply now</span>
              </button>
            </div>

            {/* Right Illustration (hiringImage2) */}
            <img
              src={hiringImage2}
              alt="Explore Opportunities"
              className="hidden lg:block absolute bottom-0 right-0 w-[250px] h-[130px] object-contain object-right-bottom pointer-events-none select-none z-0"
            />
          </div>
        </div>
      </section>

      {/* 3. Featured Open Positions Section — Jobs of the Day */}
      <section className="py-16 bg-white border-t border-slate-200/80 font-['Plus_Jakarta_Sans',sans-serif]">
        <Container>
          {/* Centered Heading with exact CSS */}
          <div className="text-center max-w-[750px] mx-auto">
            <h2
              className="text-center"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "36px",
                lineHeight: "45px",
                fontWeight: 700,
                color: "#05264E",
                marginBottom: "10px",
              }}
            >
              Jobs of the day
            </h2>
            <p
              className="text-center"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "18px",
                lineHeight: "24px",
                fontWeight: 400,
                color: "#66789C",
                marginBottom: "30px",
              }}
            >
              Search and connect with the right candidates faster.
            </p>
          </div>

          {/* Centered Category Filter Buttons with SVGs matching exact span.active CSS */}
          <div className="flex flex-wrap items-center justify-center mb-10">
            {categoryTabs.map((tab) => {
              const isActive = activeCategoryTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveCategoryTab(tab.name)}
                  className={`inline-flex items-center gap-2 cursor-pointer transition-all duration-200 hover:border-[#3C65F5]/60 hover:text-[#3C65F5] ${
                    isActive ? "active" : ""
                  }`}
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "13px 17px",
                    margin: "0px 5px 10px",
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                    color: isActive ? "#3C65F5" : "#05264E",
                    border: isActive ? "1px solid #3C65F5" : "1px solid #E0E6F6",
                    boxShadow: isActive ? "0 4px 10px rgba(60, 101, 245, 0.08)" : "none",
                  }}
                >
                  <img src={tab.icon} alt={tab.name} className="w-4 h-4 object-contain shrink-0" />
                  <span>{tab.name}</span>
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