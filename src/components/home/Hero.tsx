import { useState } from "react";
import {
  FiBriefcase,
  FiMapPin,
  FiSearch,
  FiGrid,
} from "react-icons/fi";
import Container from "../common/Container";
import Banner1 from "../../assets/images/banner1.png";

const popularSearches = [
  "Designer",
  "Developer",
  "Web",
  "IOS",
  "PHP",
  "Senior",
  "Engineer",
];

const Hero = () => {
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");

  return (
    <section
      className="relative overflow-hidden w-full"
      style={{
        backgroundColor: "#F5F7FC",
        paddingTop: "140px",
        paddingBottom: "100px",
      }}
    >
      {/* Decorative ambient background blobs */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: "-120px",
          right: "-80px",
          width: "560px",
          height: "560px",
          backgroundColor: "#EAF1FF",
          filter: "blur(60px)",
          opacity: 0.7,
        }}
      ></div>

      <Container>
        <div className="grid items-center gap-10 lg:gap-12 lg:grid-cols-12">
          {/* Left Column: Heading, Subtitle, Search box, Popular searches */}
          <div className="lg:col-span-6 xl:col-span-7 z-10">
            <h1
              className="font-extrabold text-[#05264E] leading-tight tracking-tight"
              style={{
                fontSize: "clamp(32px, 4.5vw, 54px)",
                lineHeight: "1.18",
                color: "#05264E",
              }}
            >
              The{" "}
              <span
                className="inline-block font-extrabold"
                style={{
                  backgroundColor: "#D5E4FF",
                  color: "#3C65F5",
                  padding: "4px 16px",
                  borderRadius: "12px",
                  margin: "4px 0",
                  whiteSpace: "nowrap",
                }}
              >
                Easiest Way
              </span>
              <br />
              to Get Your New
              <br />
              Job
            </h1>

            <p
              className="font-normal"
              style={{
                color: "#66789C",
                fontSize: "17px",
                lineHeight: "1.7",
                marginTop: "24px",
                marginBottom: "44px",
                maxWidth: "480px",
              }}
            >
              Each month, more than 3 million job seekers turn to website in
              their search for work, making over 140,000 applications every
              single day
            </p>

            {/* Floating Search Bar */}
            <div
              className="flex flex-col md:flex-row items-center gap-3 w-full max-w-2xl"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "12px",
                boxShadow: "0 15px 40px rgba(50, 75, 130, 0.08)",
                border: "1px solid #EAEFF7",
              }}
            >
              {/* Industry Select */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full md:w-auto md:flex-1 border-b md:border-b-0 border-gray-100">
                <FiBriefcase className="text-gray-400 text-lg shrink-0" />
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-transparent text-sm lg:text-base font-medium text-gray-500 focus:text-slate-800 outline-none cursor-pointer"
                >
                  <option value="">Industry</option>
                  <option value="software">Software & Tech</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                  <option value="design">Design</option>
                </select>
              </div>

              <div
                className="hidden md:block shrink-0"
                style={{ width: "1px", height: "32px", backgroundColor: "#E5E7EB" }}
              ></div>

              {/* Location Select */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full md:w-auto md:flex-1 border-b md:border-b-0 border-gray-100">
                <FiMapPin className="text-gray-400 text-lg shrink-0" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-sm lg:text-base font-medium text-gray-500 focus:text-slate-800 outline-none cursor-pointer"
                >
                  <option value="">Location</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="remote">Remote</option>
                  <option value="canada">Canada</option>
                </select>
              </div>

              <div
                className="hidden md:block shrink-0"
                style={{ width: "1px", height: "32px", backgroundColor: "#E5E7EB" }}
              ></div>

              {/* Keyword Input */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full md:w-auto md:flex-1">
                <FiGrid className="text-gray-400 text-lg shrink-0" />
                <input
                  type="text"
                  placeholder="Your keyword..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-transparent text-sm lg:text-base font-normal text-slate-800 placeholder-gray-400 outline-none"
                />
              </div>

              {/* Search Button */}
              <button
                type="button"
                className="w-full md:w-auto font-semibold flex items-center justify-center gap-2.5 transition duration-200 whitespace-nowrap shrink-0 cursor-pointer"
                style={{
                  backgroundColor: "#3C65F5",
                  color: "#ffffff",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  boxShadow: "0 8px 20px rgba(60, 101, 245, 0.25)",
                }}
              >
                <FiSearch className="text-lg shrink-0" />
                <span>Search</span>
              </button>
            </div>

            {/* Popular Searches */}
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs lg:text-sm text-[#66789C]">
              <span className="font-semibold text-[#05264E] whitespace-nowrap">
                Popular Searches :
              </span>
              {popularSearches.map((item, idx) => (
                <span
                  key={item}
                  className="hover:text-[#3C65F5] underline underline-offset-2 cursor-pointer transition-colors whitespace-nowrap"
                >
                  {item}
                  {idx < popularSearches.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Banner Image with Floating Animation */}
          <div className="lg:col-span-6 xl:col-span-5 relative z-10 flex justify-center lg:justify-end mt-6 lg:mt-0">
            <div className="relative max-w-[460px] w-full">
              {/* Dot matrix pattern overlay top-right */}
              <div className="absolute -top-6 -right-6 z-20 hidden sm:block pointer-events-none">
                <svg
                  width="100"
                  height="100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <pattern
                    id="dotGrid"
                    x="0"
                    y="0"
                    width="14"
                    height="14"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="2" cy="2" r="2" fill="#3C65F5" fillOpacity="0.4" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#dotGrid)" />
                </svg>
              </div>

              {/* Main Banner Image with Up and Down Floating Animation */}
              <img
                src={Banner1}
                alt="JobBox Hero Banner"
                className="w-full h-auto relative z-10 object-contain drop-shadow-xl animate-float"
                style={{
                  animation: "floatAnimation 4s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;