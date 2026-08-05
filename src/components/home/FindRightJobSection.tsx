import React from "react";
import { useNavigate } from "react-router-dom";
import { FiShield, FiArrowRight } from "react-icons/fi";
import Container from "../common/Container";

import familyImage from "../../assets/images/family-image1.png";

const FindRightJobSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[#F5F7FC] overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-16">
          {/* Left Column: Overlapping Card Illustration */}
          <div className="lg:col-span-6 relative flex justify-center items-center py-6">
            <div className="relative w-full max-w-[520px]">
              {/* Top Left Floating Card */}
              <div className="absolute -top-6 -left-4 sm:-left-8 z-0 bg-white rounded-3xl p-5 border border-[#EAEFF7] shadow-xl w-56 sm:w-64 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="inline-flex items-center gap-1.5 bg-[#EBF2FF] text-[#3C65F5] text-[11px] font-bold px-3 py-1 rounded-full mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3C65F5] animate-pulse" />
                  Market Static
                </div>
                <h4 className="text-xs font-extrabold text-[#05264E] mb-2">
                  Course overview
                </h4>
                {/* SVG Curve Line Graph */}
                <div className="h-16 w-full flex flex-col justify-end">
                  <svg className="w-full h-12 overflow-visible" viewBox="0 0 100 40">
                    <path
                      d="M0 35 Q 25 10, 50 25 T 100 10"
                      fill="none"
                      stroke="#05264E"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="flex justify-between text-[9px] font-bold text-gray-400 mt-1">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                  </div>
                </div>
              </div>

              {/* Central Main Family Image Card */}
              <div className="relative z-10 mx-auto w-[85%] sm:w-[90%] rounded-[32px] overflow-hidden bg-white shadow-2xl border-4 border-white transition-transform duration-300 hover:scale-[1.01]">
                <img
                  src={familyImage}
                  alt="Find the right job for you"
                  className="w-full h-[320px] sm:h-[400px] object-cover object-center"
                />
              </div>

              {/* Bottom Right Floating Card */}
              <div className="absolute -bottom-6 -right-2 sm:-right-6 z-20 bg-white rounded-3xl p-5 border border-[#EAEFF7] shadow-xl w-52 sm:w-60 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#3C65F5]">
                    <FiShield className="text-sm" />
                  </div>
                  <span className="text-xs font-extrabold text-[#05264E]">Security</span>
                </div>
                <button
                  onClick={() => navigate("/jobs")}
                  className="w-full bg-[#05264E] hover:bg-[#0A366F] text-white text-xs font-extrabold py-3 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Small Heading */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#94A3B8] tracking-tight mb-1">
              Millions Of Jobs.
            </h3>

            {/* Large Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#05264E] leading-[1.12] tracking-tight mt-1 mb-6">
              Find The One<br />
              That’s <span className="text-[#3C65F5]">Right</span> For<br />
              You
            </h2>

            {/* Description */}
            <p className="text-[#66789C] text-sm sm:text-base leading-relaxed max-w-[480px] mb-8 font-medium">
              Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over 600,000 companies worldwide. The right job is out there.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-6 flex-wrap">
              <button
                onClick={() => navigate("/jobs")}
                className="rounded-xl bg-[#3C65F5] px-8 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-md transition-all duration-300 hover:bg-[#254BD6] hover:shadow-xl cursor-pointer"
              >
                Search Jobs
              </button>

              <button
                onClick={() => navigate("/about")}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#05264E] transition-colors hover:text-[#3C65F5] hover:underline cursor-pointer"
              >
                <span>Learn More</span>
                <FiArrowRight className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FindRightJobSection;
