import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Container from "../common/Container";

import imgChart from "../../assets/images/img-chart.png";
import controlCard from "../../assets/images/controlcard.png";
import familyImage from "../../assets/images/family-image1.png";

const FindRightJobSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[#F5F7FC] overflow-x-clip">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-16">
          {/* Left Column: Overlapping Card Illustration - Exact JobBox Template Structure */}
          <div className="hidden lg:flex lg:col-span-6 relative justify-center items-center py-6">
            <div className="relative w-full max-w-[580px] text-center">
              {/* Top Left Floating Chart Card — Exact JobBox specs */}
              <img
                src={imgChart}
                alt="Course overview"
                className="absolute z-0 pointer-events-none select-none drop-shadow-md"
                style={{
                  top: '-45px',
                  left: '-40px',
                  width: '270px',
                  maxWidth: 'none',
                }}
              />

              {/* Central Main Family Image — Exact JobBox specs: max-width: 80%, width: ~520px, height: ~470px (1.108 aspect ratio) */}
              <div className="relative z-10 mx-auto rounded-[32px] overflow-hidden shadow-2xl border-4 border-white transition-transform duration-300 hover:scale-[1.01] max-w-[80%] aspect-[520.78/470.05]">
                <img
                  src={familyImage}
                  alt="Find the right job for you"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Bottom Right Floating Control Card — Shifted right and down so 'urity' and 'Learn More' button are clearly visible */}
              <img
                src={controlCard}
                alt="Security"
                className="absolute z-0 pointer-events-none drop-shadow-xl select-none"
                style={{
                  width: '351px',
                  height: '384px',
                  right: '-95px',
                  bottom: '-165px',
                }}
              />
            </div>
          </div>

          {/* Right Column: Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Small Heading */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#94A3B8] tracking-tight mb-1">
              Millions Of Jobs.
            </h3>

            {/* Large Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-[#05264E] leading-[1.12] tracking-tight mt-1 mb-5">
              Find The One<br />
              That's <span className="text-[#3C65F5]">Right</span> For<br />
              You
            </h2>

            {/* Description */}
            <p className="text-[#66789C] text-sm sm:text-base leading-relaxed max-w-[480px] mb-8 font-medium">
              Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over 600,000 companies worldwide. The right job is out there.
            </p>

            {/* Mobile Image (only on mobile — no floating cards to avoid overflow) */}
            <div className="lg:hidden rounded-2xl overflow-hidden shadow-xl border-4 border-white mb-8 w-full">
              <img
                src={familyImage}
                alt="Find the right job for you"
                className="w-full h-[220px] sm:h-[280px] object-cover object-center"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <button
                onClick={() => navigate("/jobs")}
                className="rounded-xl bg-[#3C65F5] px-6 sm:px-8 py-3.5 text-sm font-extrabold text-white shadow-md transition-all duration-300 hover:bg-[#254BD6] hover:shadow-xl cursor-pointer"
              >
                Search Jobs
              </button>

              <button
                onClick={() => navigate("/about")}
                className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#05264E] transition-colors hover:text-[#3C65F5] hover:underline cursor-pointer"
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
