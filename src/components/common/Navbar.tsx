import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import Container from "./Container";
import Logo from "../../assets/logo.svg";

const links = [
  {
    name: "Home",
    path: "/",
    dropdownItems: ["Home 1", "Home 2", "Home 3", "Home 4", "Home 5", "Home 6"],
  },
  {
    name: "Find a Job",
    path: "/jobs",
    dropdownItems: ["Jobs Grid", "Jobs List", "Job Details", "Job Categories"],
  },
  {
    name: "Recruiters",
    path: "/recruiters",
    dropdownItems: ["Recruiters List", "Recruiter Details"],
  },
  {
    name: "Candidates",
    path: "/candidates",
    dropdownItems: ["Candidates List", "Candidate Details"],
  },
  {
    name: "Pages",
    path: "/pages",
    dropdownItems: ["About Us", "Pricing", "FAQ", "Terms & Conditions"],
  },
  {
    name: "Blog",
    path: "/blog",
    dropdownItems: ["Blog Grid", "Blog Single"],
  },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 w-full"
      style={{
        backgroundColor: "rgba(245, 247, 252, 0.95)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid #EAEFF7",
      }}
    >
      <Container>
        <div className="flex h-[85px] items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={Logo} alt="JobBox" className="h-9 w-auto" />
          </Link>

          {/* Nav Links with Hover Dropdowns */}
          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((item) => (
              <div
                key={item.name}
                className="relative group py-6"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 text-[15px] font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "text-[#3C65F5]"
                        : "text-[#05264E] hover:text-[#3C65F5]"
                    }`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? "#3C65F5" : "#05264E",
                  })}
                >
                  {item.name}
                  {item.dropdownItems && (
                    <FiChevronDown className="text-gray-500 text-xs shrink-0 transition-transform duration-200 group-hover:rotate-180" />
                  )}
                </NavLink>

                {/* Dropdown Menu */}
                {item.dropdownItems && (
                  <div
                    className={`absolute top-full left-0 w-48 rounded-2xl border py-3 transition-all duration-200 ${
                      activeDropdown === item.name
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible translate-y-2 pointer-events-none"
                    }`}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "16px",
                      boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
                      borderColor: "#EAEFF7",
                    }}
                  >
                    <ul className="flex flex-col">
                      {item.dropdownItems.map((subItem) => (
                        <li key={subItem}>
                          <Link
                            to="#"
                            className="block px-5 py-2 text-[14px] font-medium text-gray-600 hover:text-[#3C65F5] hover:bg-blue-50/70 transition-colors"
                          >
                            • {subItem}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-6 shrink-0">
            <Link
              to="/register"
              className="text-[15px] font-medium hover:text-[#3C65F5] underline underline-offset-4 whitespace-nowrap transition-colors"
              style={{ color: "#05264E" }}
            >
              Register
            </Link>

            <Link
              to="/login"
              className="font-semibold text-white whitespace-nowrap transition hover:bg-[#254BD6]"
              style={{
                backgroundColor: "#3C65F5",
                color: "#ffffff",
                padding: "10px 24px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(60, 101, 245, 0.2)",
              }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;