import { NavLink } from "react-router-dom";
import { FiUser, FiBriefcase, FiPlusSquare, FiGrid, FiSettings, FiLayers } from "react-icons/fi";

const sidebarNav = [
  { name: "My Profile", path: "/recruiter/profile", icon: FiUser },
  { name: "Company Profile", path: "/recruiter/company", icon: FiLayers },
  { name: "Post a Job", path: "/recruiter/post-job", icon: FiPlusSquare },
  { name: "My Jobs", path: "/recruiter/my-jobs", icon: FiBriefcase },
  { name: "Browse Companies", path: "/recruiters", icon: FiGrid },
  { name: "Settings", path: "/recruiter/settings", icon: FiSettings },
];

const DashboardSidebar = () => {
  return (
    <aside className="w-full rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#66789C] mb-4">
        Recruiter Dashboard
      </h3>

      <nav className="space-y-1.5">
        {sidebarNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#EBF2FF] text-[#3C65F5]"
                    : "text-[#66789C] hover:bg-[#F8FAFC] hover:text-[#05264E]"
                }`
              }
            >
              <Icon className="text-lg" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
