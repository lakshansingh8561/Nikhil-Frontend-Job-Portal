import { Link } from "react-router-dom";
import { FiPlusSquare, FiLayers, FiFileText, FiArrowRight } from "react-icons/fi";

const actions = [
  {
    title: "Post New Job",
    description: "Create and publish a new job opening for candidates.",
    path: "/recruiter/post-job",
    icon: FiPlusSquare,
    color: "bg-[#3C65F5] text-white",
  },
  {
    title: "Edit Company Profile",
    description: "Manage your employer branding, logo, and company info.",
    path: "/recruiter/company",
    icon: FiLayers,
    color: "bg-emerald-600 text-white",
  },
  {
    title: "View Applications",
    description: "Review, filter, and shortlist candidate job applications.",
    path: "/recruiter/applications",
    icon: FiFileText,
    color: "bg-amber-500 text-white",
  },
];

export const QuickActions = () => {
  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-xs">
      <h3 className="text-base font-bold text-[#05264E] mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              to={act.path}
              className="group flex flex-col justify-between rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#3C65F5] hover:bg-white hover:shadow-md"
            >
              <div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${act.color}`}>
                  <Icon className="text-lg" />
                </div>
                <h4 className="mt-3 text-sm font-bold text-[#05264E] group-hover:text-[#3C65F5]">
                  {act.title}
                </h4>
                <p className="mt-1 text-xs text-[#66789C] leading-relaxed">
                  {act.description}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#3C65F5]">
                <span>Get Started</span>
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
