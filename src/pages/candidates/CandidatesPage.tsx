import { useState } from "react";
import { FiSearch, FiMapPin, FiBriefcase, FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-16">
      <Container>
        {/* Page Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">
            VERIFIED TALENT POOL
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Candidate Directory
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-500">
            Discover qualified engineering candidates and software professionals ready for hire
          </p>

          {/* Search bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5 rounded-2xl bg-white p-2.5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 px-3 py-1.5 w-full sm:flex-1">
              <FiSearch className="text-slate-400 text-base shrink-0" />
              <input
                type="text"
                placeholder="Search candidates by name, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 w-full sm:flex-1 border-t sm:border-t-0 sm:border-l border-slate-100">
              <FiMapPin className="text-slate-400 text-base shrink-0" />
              <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>
            <button
              onClick={() => setPage(1)}
              className="saas-btn-primary w-full sm:w-auto h-9 text-xs px-5 shrink-0"
            >
              Search
            </button>
          </div>
        </div>

        {/* Candidates Grid */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-slate-200">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
          </div>
        ) : candidates.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map((cand) => (
              <div
                key={cand._id}
                className="saas-card-interactive p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 font-black text-white text-lg shrink-0">
                      {cand.firstName ? cand.firstName.charAt(0).toUpperCase() : "C"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-900 truncate">
                        {cand.firstName} {cand.lastName}
                      </h3>
                      <p className="text-xs font-semibold text-indigo-600 truncate">
                        {cand.headline || "Engineering Candidate"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3.5 text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <FiMapPin className="text-slate-400 shrink-0" />
                    <span>{cand.currentLocation || "Remote / Unspecified"}</span>
                  </p>

                  {cand.bio && (
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">
                      {cand.bio}
                    </p>
                  )}

                  {/* Skills tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {cand.skills?.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="saas-badge saas-badge-neutral text-[10px]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3.5 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <FiBriefcase className="text-slate-400" />
                    {cand.yearsOfExperience || 0} Yrs Experience
                  </span>
                  <span className="saas-badge saas-badge-emerald text-[10px]">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="saas-card p-12 text-center">
            <h3 className="text-base font-bold text-slate-900">No Candidates Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms or location filter.
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="saas-btn-secondary h-8 w-8 p-0 justify-center disabled:opacity-40"
            >
              <FiChevronLeft />
            </button>

            <span className="text-xs font-semibold text-slate-700 px-3">
              Page {pagination.page} of {pagination.pages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
              disabled={page === pagination.pages}
              className="saas-btn-secondary h-8 w-8 p-0 justify-center disabled:opacity-40"
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
