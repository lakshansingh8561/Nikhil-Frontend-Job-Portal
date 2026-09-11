import React from "react";
import { Link } from "react-router-dom";

import location1 from "../../assets/images/location1.png";
import location2 from "../../assets/images/location2.png";
import location3 from "../../assets/images/location3.png";
import location4 from "../../assets/images/location4.png";
import location5 from "../../assets/images/location5.png";
import location6 from "../../assets/images/location6.png";

interface LocationItem {
  id: number;
  image: string;
  badge?: "Hot" | "Trending";
  city: string;
  country: string;
  vacancy: string;
  companies: string;
  query: string;
  colClass: string;
}

const locationsData: LocationItem[] = [
  {
    id: 1,
    image: location1,
    badge: "Hot",
    city: "Paris",
    country: "France",
    vacancy: "5 Vacancy",
    companies: "120 companies",
    query: "Paris",
    colClass: "w-full sm:w-full md:w-5/12 lg:w-3/12 px-[12px] mb-[24px]",
  },
  {
    id: 2,
    image: location2,
    badge: "Trending",
    city: "London",
    country: "England",
    vacancy: "7 Vacancy",
    companies: "68 companies",
    query: "London",
    colClass: "w-full sm:w-full md:w-7/12 lg:w-4/12 px-[12px] mb-[24px]",
  },
  {
    id: 3,
    image: location3,
    badge: "Hot",
    city: "New York",
    country: "USA",
    vacancy: "9 Vacancy",
    companies: "80 companies",
    query: "New York",
    colClass: "w-full sm:w-full md:w-full lg:w-5/12 px-[12px] mb-[24px]",
  },
  {
    id: 4,
    image: location4,
    city: "Amsterdam",
    country: "Holland",
    vacancy: "16 Vacancy",
    companies: "86 companies",
    query: "Amsterdam",
    colClass: "w-full sm:w-full md:w-5/12 lg:w-4/12 px-[12px] mb-[24px]",
  },
  {
    id: 5,
    image: location5,
    city: "Copenhagen",
    country: "Denmark",
    vacancy: "39 Vacancy",
    companies: "186 companies",
    query: "Copenhagen",
    colClass: "w-full sm:w-full md:w-7/12 lg:w-5/12 px-[12px] mb-[24px]",
  },
  {
    id: 6,
    image: location6,
    city: "Berlin",
    country: "Germany",
    vacancy: "15 Vacancy",
    companies: "632 companies",
    query: "Berlin",
    colClass: "w-full sm:w-full md:w-full lg:w-3/12 px-[12px] mb-[24px]",
  },
];

export const JobsByLocationSection: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-[#EAEFF7]">
      {/* 1140px Bootstrap Container */}
      <div className="w-full max-w-[1140px] mx-auto px-[12px]">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-[45px]">
          <h2 className="text-[32px] sm:text-[36px] font-bold text-[#05264E] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight leading-[42px]">
            Jobs by Location
          </h2>
          <p className="mt-[10px] text-[15px] font-normal text-[#66789C] font-['Plus_Jakarta_Sans',sans-serif]">
            Find your favourite jobs and get the benefits of yourself
          </p>
        </div>

        {/* Location Cards Grid: 12-column staggered grid (3 cols, 4 cols, 5 cols in row 1; 4 cols, 5 cols, 3 cols in row 2) */}
        <div className="flex flex-wrap -mx-[12px]">
          {locationsData.map((item) => (
            <div key={item.id} className={item.colClass}>
              <div className="card-image-top hover-up bg-white rounded-[16px] border border-[#E0E6F6] p-[12px] h-full flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_32px_0_rgba(0,0,0,0.08)] hover:border-[#3C65F5]/30 cursor-pointer overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
                <Link
                  to={`/jobs?location=${encodeURIComponent(item.query)}`}
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
                  className="block group"
                >
                  {/* Image Box matching DevTools computed specs: 261px height, #B4C0E0 bg, 15px mb, cover */}
                  <div
                    className="image relative w-full rounded-[16px] overflow-hidden"
                    style={{
                      backgroundImage: `url(${item.image})`,
                      backgroundColor: "#B4C0E0",
                      backgroundPosition: "0px 0px",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      height: "261px",
                      margin: "0px 0px 15px",
                      borderRadius: "16px",
                    }}
                  >
                    {/* Hot / Trending Badge */}
                    {item.badge && (
                      <span className="absolute top-[14px] left-[14px] px-[10px] py-[3px] rounded-[6px] text-[12px] font-semibold tracking-wide bg-[#EBF2FF] text-[#3C65F5]">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Info Block */}
                  <div className="informations px-[2px] pb-[4px]">
                    <h5 className="text-[18px] sm:text-[20px] font-bold text-[#05264E] group-hover:text-[#3C65F5] transition-colors leading-[26px] mb-[6px]">
                      {item.city}, {item.country}
                    </h5>

                    <div className="flex items-center justify-between text-[14px] text-[#66789C] font-normal">
                      <span>{item.vacancy}</span>
                      <span>{item.companies}</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobsByLocationSection;
