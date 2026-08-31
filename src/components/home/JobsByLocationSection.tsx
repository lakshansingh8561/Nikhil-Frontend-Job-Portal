import React from "react";
import { Link } from "react-router-dom";
import Container from "../common/Container";

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
  },
  {
    id: 4,
    image: location4,
    city: "Amsterdam",
    country: "Holland",
    vacancy: "16 Vacancy",
    companies: "86 companies",
    query: "Amsterdam",
  },
  {
    id: 5,
    image: location5,
    city: "Copenhagen",
    country: "Denmark",
    vacancy: "39 Vacancy",
    companies: "186 companies",
    query: "Copenhagen",
  },
  {
    id: 6,
    image: location6,
    city: "Berlin",
    country: "Germany",
    vacancy: "15 Vacancy",
    companies: "632 companies",
    query: "Berlin",
  },
];

export const JobsByLocationSection: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-[#EAEFF7]">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#05264E] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
            Jobs by Location
          </h2>
          <p className="mt-2 text-sm sm:text-base font-normal text-[#66789C] font-['Plus_Jakarta_Sans',sans-serif]">
            Find your favourite jobs and get the benefits of yourself
          </p>
        </div>

        {/* Location Cards Grid: 6 cards in 2 rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {locationsData.map((item) => (
            <Link
              key={item.id}
              to={`/jobs?location=${encodeURIComponent(item.query)}`}
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
              className="group bg-white rounded-2xl border border-[#E0E6F6] p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#3C65F5]/30 flex flex-col cursor-pointer overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]"
            >
              {/* Image Box */}
              <div className="relative w-full h-[220px] sm:h-[240px] rounded-xl overflow-hidden mb-[15px] bg-[#B4C0E0]/30">
                <img
                  src={item.image}
                  alt={`${item.city}, ${item.country}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hot / Trending Badge */}
                {item.badge && (
                  <span
                    className={`absolute top-3.5 left-3.5 px-3 py-1 rounded-lg text-xs font-bold tracking-wide backdrop-blur-md shadow-xs ${
                      item.badge === "Hot"
                        ? "bg-[#EBF2FF]/90 text-[#3C65F5]"
                        : "bg-[#EBF2FF]/90 text-[#3C65F5]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Info Block */}
              <div className="px-1 pb-1">
                <h5 className="text-[20px] leading-[26px] font-bold text-[#05264E] group-hover:text-[#3C65F5] transition-colors mb-[5px]">
                  {item.city}, {item.country}
                </h5>

                <div className="flex items-center justify-between text-[14px] text-[#66789C] font-normal mt-1">
                  <span>{item.vacancy}</span>
                  <span>{item.companies}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default JobsByLocationSection;
