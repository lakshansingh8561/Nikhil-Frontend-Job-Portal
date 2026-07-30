import { Link } from "react-router-dom";
import { FiArrowRight, FiBriefcase, FiCompass, FiAward, FiCheckCircle } from "react-icons/fi";
import Hero from "../components/home/Hero";
import Container from "../components/common/Container";
import JobCard from "../components/jobs/JobCard";
import ScrollToTop from "../components/common/ScrollToTop";
import { useGetJobsQuery } from "../features/jobs/api/jobsApi";

const categories = [
  { name: "Software & Tech", jobsCount: "1,240 jobs", icon: FiBriefcase },
  { name: "Finance & Accounting", jobsCount: "850 jobs", icon: FiAward },
  { name: "Marketing & Sales", jobsCount: "620 jobs", icon: FiCompass },
  { name: "Design & Creative", jobsCount: "430 jobs", icon: FiCheckCircle },
];

const Home = () => {
  const { data, isLoading } = useGetJobsQuery({ limit: 6 });
  const jobsList = data?.jobs || [];

  return (
    <div className="min-h-screen bg-[#F5F7FC]">
      {/* Hero Banner */}
      <Hero />

      {/* Popular Categories */}
      <section className="py-16 bg-white border-y border-[#EAEFF7]">
        <Container>
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-[#05264E]">
              Browse By Category
            </h2>
            <p className="mt-2 text-sm text-[#66789C]">
              Find the job that's right for you among top categories
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to="/jobs"
                  className="group rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#3C65F5] hover:bg-white hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#EBF2FF] text-[#3C65F5] transition duration-300 group-hover:bg-[#3C65F5] group-hover:text-white">
                    <Icon className="text-2xl" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-[#05264E] group-hover:text-[#3C65F5]">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-[#66789C]">
                    {cat.jobsCount}
                  </p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-[#05264E]">
                Featured Jobs
              </h2>
              <p className="mt-1 text-sm text-[#66789C]">
                Know your worth and find the job that qualifies your life
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 font-semibold text-[#3C65F5] hover:underline shrink-0"
            >
              <span>View All Jobs</span>
              <FiArrowRight />
            </Link>
          </div>

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
              <h3 className="text-lg font-bold text-[#05264E]">No Featured Jobs Available</h3>
              <p className="text-xs text-[#66789C] mt-1">
                Check back soon for new job postings!
              </p>
            </div>
          )}
        </Container>
      </section>

      <ScrollToTop />
    </div>
  );
};

export default Home;