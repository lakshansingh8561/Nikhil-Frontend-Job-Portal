import { useState } from "react";
import { FiSearch, FiMapPin, FiBriefcase, FiDollarSign, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Container from "../../components/common/Container";
import ScrollToTop from "../../components/common/ScrollToTop";
import { useGetAllJobSeekersQuery } from "../../features/jobSeeker/api/jobSeekerApi";

const CandidatesPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const { data, isLoading } = useGetAllJobSeekersQuery({
    page,
    limit,
    search: search || undefined,
    location: location || undefined,
  });

  const candidates = data?.profiles || [];
  const pagination = data?.pagination || { page: 1, limit: 9, total: candidates.length, pages: 1 };

  return (
    <div className="min-h-screen bg-[#F5F7FC] pt-28 pb-16">
      <Container>
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-[#05264E] sm:text-4xl">
            Candidate Directory
          </h1>
          <p className="mt-2 text-sm text-[#66789C]">
            Explore talented Job Seekers and candidates powered by full-stack live API data.
          </p>

          {/* Search bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 rounded-2xl bg-white p-3 shadow-md border border-[#EAEFF7]">
            <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:flex-1">
              <FiSearch className="text-gray-400 text-lg shrink-0" />
              <input
                type="text"
                placeholder="Search candidates by name or headline..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none"
              />
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:flex-1 border-t sm:border-t-0 sm:border-l border-gray-100">
              <FiMapPin className="text-gray-400 text-lg shrink-0" />
              <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none"
              />
            </div>
            <button
              onClick={() => setPage(1)}
              className="w-full sm:w-auto rounded-xl bg-[#3C65F5] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#254BD6] shrink-0"
            >
              Search
            </button>
          </div>
        </div>

        {/* Candidates Grid */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-[#EAEFF7]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent" />
          </div>
        ) : candidates.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map((cand) => (
              <div
                key={cand._id}
                className="flex flex-col justify-between rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3C65F5] font-bold text-white text-xl shadow-md">
                      {cand.firstName ? cand.firstName.charAt(0) : "C"}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#05264E]">
                        {cand.firstName} {cand.lastName}
                      </h3>
                      <p className="text-xs font-semibold text-[#3C65F5]">
                        {cand.headline || "Job Seeker"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-[#66789C] flex items-center gap-1">
                    <FiMapPin className="text-gray-400" />
                    <span>{cand.currentLocation || "Location Not Specified"}</span>
                  </p>

                  {cand.bio && (
                    <p className="mt-3 text-xs leading-relaxed text-[#66789C] line-clamp-2">
                      {cand.bio}
                    </p>
                  )}

                  {/* Skills tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {cand.skills?.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-[#F0F4FC] px-2.5 py-1 text-[11px] font-semibold text-[#3C65F5]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-[#F0F4FC] pt-4 flex items-center justify-between text-xs text-[#66789C]">
                  <span className="flex items-center gap-1 font-medium">
                    <FiBriefcase className="text-gray-400" />
                    {cand.yearsOfExperience || 0} Yrs Exp
                  </span>
                  <span className="flex items-center gap-1 font-bold text-[#05264E]">
                    <FiDollarSign className="text-green-500" />
                    ₹{cand.expectedSalary?.toLocaleString() || "N/A"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-12 text-center border border-[#EAEFF7] shadow-sm">
            <h3 className="text-lg font-bold text-[#05264E]">No Candidates Found</h3>
            <p className="text-xs text-[#66789C] mt-1">
              Be the first candidate to create a profile!
            </p>
          </div>
        )}

        {/* Backend Pagination Bar */}
        {pagination.pages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EAEFF7] bg-white text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
            >
              <FiChevronLeft />
            </button>

            <span className="text-xs font-semibold text-[#05264E] px-3">
              Page {pagination.page} of {pagination.pages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
              disabled={page === pagination.pages}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EAEFF7] bg-white text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </Container>
      <ScrollToTop />
    </div>
  );
};

export default CandidatesPage;
