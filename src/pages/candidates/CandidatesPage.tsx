import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiList,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import Container from "../../components/common/Container";
import ScrollToTop from "../../components/common/ScrollToTop";
import { useGetAllJobSeekersQuery } from "../../features/jobSeeker/api/jobSeekerApi";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const CandidatesPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [sortBy, setSortBy] = useState("Newest Post");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading } = useGetAllJobSeekersQuery({
    page,
    limit,
    search: selectedLetter || undefined,
  });

  const candidates = data?.profiles || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 12,
    total: candidates.length,
    pages: 1,
  };

  const handleLetterClick = (letter: string) => {
    if (selectedLetter === letter) {
      setSelectedLetter("");
    } else {
      setSelectedLetter(letter);
    }
    setPage(1);
  };

  const startIndex = Math.max(1, (pagination.page - 1) * pagination.limit + 1);
  const endIndex = Math.min(
    pagination.page * pagination.limit,
    pagination.total || candidates.length
  );
  const totalCount = pagination.total || candidates.length;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-20">
      <Container>
        {/* 1. Header Banner — Compact & Balanced Height */}
        <div className="bg-[#EFF3FC] rounded-2xl pt-7 px-5 pb-8 mb-8 text-center border border-[#E0E6F6]/60">
          <h3 className="text-[28px] leading-[34px] font-bold text-[#05264E] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
            Browse Candidates
          </h3>
          <div className="text-[14px] leading-[20px] text-[#66789C] font-['Plus_Jakarta_Sans',sans-serif] max-w-xl mx-auto mt-2 mb-5 font-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni,
            atque delectus molestias quis?
          </div>

          {/* Alphabet Filter Pill Container */}
          <div className="bg-white rounded-xl shadow-xs border border-[#E0E6F6] py-2 px-3 sm:px-6 mx-auto max-w-[850px] flex items-center justify-between overflow-x-auto gap-1 sm:gap-2 flex-nowrap select-none scrollbar-none">
            {ALPHABET.map((letter) => {
              const isActive = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  className={`text-xs sm:text-sm font-semibold rounded-lg px-2 sm:px-2.5 py-1 transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-[#3C65F5] text-white shadow-xs font-bold"
                      : "text-[#66789C] hover:text-[#3C65F5] hover:bg-[#EFF3FC]"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Controls & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs sm:text-sm text-[#66789C] font-medium">
              Showing{" "}
              <strong className="text-[#05264E] font-bold">
                {totalCount > 0 ? `${startIndex}–${endIndex}` : "0"}
              </strong>{" "}
              of <strong className="text-[#05264E] font-bold">{totalCount}</strong> candidates
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Show per page dropdown */}
            <div className="flex items-center gap-2 border border-[#E0E6F6] rounded-xl px-3.5 py-2 bg-white text-xs font-medium text-[#66789C]">
              <span>Show:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="font-bold text-[#05264E] bg-transparent outline-none cursor-pointer"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
              </select>
            </div>

            {/* Sort by dropdown */}
            <div className="flex items-center gap-2 border border-[#E0E6F6] rounded-xl px-3.5 py-2 bg-white text-xs font-medium text-[#66789C]">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-bold text-[#05264E] bg-transparent outline-none cursor-pointer"
              >
                <option value="Newest Post">Newest Post</option>
                <option value="Oldest Post">Oldest Post</option>
                <option value="Rating Post">Rating Post</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center gap-1 border border-[#E0E6F6] rounded-xl p-1 bg-white">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#3C65F5] text-white shadow-xs"
                    : "text-[#66789C] hover:text-[#05264E]"
                }`}
                title="List View"
              >
                <FiList className="text-base" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#3C65F5] text-white shadow-xs"
                    : "text-[#66789C] hover:text-[#05264E]"
                }`}
                title="Grid View"
              >
                <FiGrid className="text-base" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Candidates Grid */}
        {isLoading ? (
          <div className="flex h-72 items-center justify-center rounded-2xl bg-white border border-[#E0E6F6]">
            <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#3C65F5] border-t-transparent" />
          </div>
        ) : candidates.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "grid grid-cols-1 gap-4"
            }
          >
            {candidates.map((cand) => {
              const displayName =
                [cand.firstName, cand.lastName].filter(Boolean).join(" ") ||
                (cand as any).name ||
                cand.userId?.email?.split("@")[0] ||
                "Candidate";

              const headline = cand.headline || "UI/UX Designer";
              const bio =
                cand.bio ||
                "I build interfaces that feel fast. Currently focused on design systems and accessibility.";
              const skills =
                Array.isArray(cand.skills) && cand.skills.length > 0
                  ? cand.skills
                  : ["Figma", "Adobe XD", "PSD", "App", "Digital"];
              const location = cand.currentLocation || "Chicago, US";
              const rate = cand.expectedSalary
                ? `$${cand.expectedSalary} / hour`
                : "$45 / hour";
              const profileLink = `/job-seeker/network/profile/${
                cand.userId?._id || cand._id
              }`;

              return (
                <div
                  key={cand._id}
                  className="bg-white rounded-2xl border border-[#E0E6F6] hover:border-[#3C65F5]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group min-h-[433px]"
                >
                  {/* Top Profile Section — Exact DevTools specs: padding 30px 20px 15px 20px */}
                  <div className="pt-[30px] px-5 pb-[15px] flex items-center gap-3.5">
                    {/* Avatar Container: 80x80 round avatar with green online dot */}
                    <div className="relative shrink-0 w-[80px] h-[80px]">
                      {cand.profilePicture ? (
                        <img
                          src={cand.profilePicture}
                          alt={displayName}
                          className="w-full h-full rounded-full object-cover border-2 border-white shadow-xs bg-slate-100"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-[#3C65F5] text-white flex items-center justify-center font-bold text-2xl border-2 border-white shadow-xs select-none">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {/* Green Online Status Dot */}
                      <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>

                    {/* Right Profile Info: pt-10 (10px) */}
                    <div className="min-w-0 flex-1 pt-2.5">
                      <Link
                        to={profileLink}
                        className="text-lg font-bold text-[#05264E] group-hover:text-[#3C65F5] transition-colors truncate block"
                      >
                        {displayName}
                      </Link>
                      <span className="text-xs text-[#66789C] truncate block mt-0.5 font-medium">
                        {headline}
                      </span>
                      {/* 5 Stars Rating */}
                      <div className="flex items-center gap-1 mt-1.5">
                        <div className="flex text-amber-400 text-xs gap-0.5">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </div>
                        <span className="text-[11px] font-medium text-[#66789C] ml-1">
                          (65)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Info Section — Exact DevTools specs: padding 0px 20px 30px 20px */}
                  <div className="px-5 pb-[30px] pt-0 flex flex-col justify-between flex-1">
                    <div>
                      {/* Candidate Bio Paragraph with '| ' accent prefix */}
                      <p className="text-xs text-[#66789C] leading-[18px] line-clamp-3 min-h-[54px] font-normal border-l-2 border-[#E0E6F6] pl-2">
                        | {bio}
                      </p>

                      {/* Skills Tags: mt-30 (25px) */}
                      <div className="flex flex-wrap gap-1.5 mt-6">
                        {skills.slice(0, 5).map((skill: string) => (
                          <span
                            key={skill}
                            className="bg-[#EFF3FC] hover:bg-[#3C65F5] hover:text-white text-[#3C65F5] font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer select-none"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Row: mt-15 (15px), location & rate */}
                    <div className="mt-5 pt-3.5 border-t border-[#EAEFF7] flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-[#66789C] font-medium truncate max-w-[55%]">
                        <FiMapPin className="text-sm text-[#94A3B8] shrink-0" />
                        <span className="truncate">{location}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-[#05264E] font-bold shrink-0">
                        <FiClock className="text-sm text-[#94A3B8]" />
                        <span>{rate}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E0E6F6] p-12 text-center">
            <h3 className="text-base font-extrabold text-[#05264E]">No Candidates Found</h3>
            <p className="text-xs text-[#66789C] mt-1">
              {selectedLetter
                ? `No candidates matching the letter "${selectedLetter}".`
                : "Try adjusting your filters."}
            </p>
            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter("")}
                className="mt-4 rounded-xl bg-[#3C65F5] hover:bg-[#2C52E0] text-white text-xs font-bold px-5 py-2.5 transition-colors cursor-pointer"
              >
                Clear Letter Filter
              </button>
            )}
          </div>
        )}

        {/* 4. Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E0E6F6] bg-white text-[#66789C] hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <FiChevronLeft className="text-base" />
            </button>

            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  page === pageNum
                    ? "bg-[#3C65F5] text-white shadow-md"
                    : "border border-[#E0E6F6] bg-white text-[#66789C] hover:bg-slate-50"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
              disabled={page === pagination.pages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E0E6F6] bg-white text-[#66789C] hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <FiChevronRight className="text-base" />
            </button>
          </div>
        )}
      </Container>
      <ScrollToTop />
    </div>
  );
};

export default CandidatesPage;
