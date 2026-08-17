import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Container from "./Container";
import logo from "../../assets/logo.svg";

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleAppDownload = (appName: string) => {
    toast.success(`Redirecting to JobBox ${appName} app page!`);
  };

  const handleNavClick = (path: string, label: string) => {
    if (path.startsWith("/")) {
      navigate(path);
    } else {
      toast(`Opening ${label}...`);
    }
  };

  return (
    <footer className="bg-white border-t border-[#EAEFF7] pt-16 pb-8 text-[#05264E]">
      <Container>
        {/* Main Footer Columns Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 mb-12">
          {/* Column 1: Brand Info & Socials (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <Link to="/" className="inline-block mb-4 group">
              <img
                src={logo}
                alt="JobBox"
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            <p className="text-xs font-semibold text-[#66789C] leading-relaxed mb-6 max-w-xs">
              JobBox is the heart of the design community and the best resource to
              discover and connect with designers and jobs worldwide.
            </p>

            {/* Social Media Circular Buttons */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3C65F5] text-white shadow-xs transition hover:bg-[#254BD6] hover:scale-110 cursor-pointer"
              >
                <FaFacebookF className="text-sm" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3C65F5] text-white shadow-xs transition hover:bg-[#254BD6] hover:scale-110 cursor-pointer"
              >
                <FaTwitter className="text-sm" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3C65F5] text-white shadow-xs transition hover:bg-[#254BD6] hover:scale-110 cursor-pointer"
              >
                <FaLinkedinIn className="text-sm" />
              </a>
            </div>
          </div>

          {/* Column 2: Resources (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-extrabold text-[#05264E] mb-4 tracking-tight">
              Resources
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold text-[#66789C]">
              <li>
                <button
                  onClick={() => handleNavClick("/about", "About us")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  About us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/team", "Our Team")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  Our Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/jobs", "Products")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/contact", "Contact")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Community (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-extrabold text-[#05264E] mb-4 tracking-tight">
              Community
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold text-[#66789C]">
              <li>
                <button
                  onClick={() => handleNavClick("/features", "Feature")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  Feature
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/pricing", "Pricing")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/credit", "Credit")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  Credit
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/faq", "FAQ")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick links (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-extrabold text-[#05264E] mb-4 tracking-tight">
              Quick links
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold text-[#66789C]">
              <li>
                <button
                  onClick={() => handleAppDownload("iOS App Store")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  iOS
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAppDownload("Android Google Play")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  Android
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAppDownload("Microsoft Store")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  Microsoft
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAppDownload("Desktop App")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  Desktop
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: More (lg:col-span-1) */}
          <div className="lg:col-span-1">
            <h3 className="text-base font-extrabold text-[#05264E] mb-4 tracking-tight">
              More
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold text-[#66789C]">
              <li>
                <button
                  onClick={() => handleNavClick("/privacy", "Privacy")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/help", "Help")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  Help
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/terms", "Terms")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  Terms
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("/faq", "FAQ")}
                  className="hover:text-[#3C65F5] transition cursor-pointer"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 6: Download App (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-extrabold text-[#05264E] mb-2 tracking-tight">
              Download App
            </h3>
            <p className="text-xs font-semibold text-[#66789C] leading-relaxed mb-4 max-w-xs">
              Download our Apps and get extra 15% Discount on your first Order...!
            </p>

            {/* App Store Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleAppDownload("App Store")}
                className="w-full flex items-center gap-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] px-4 py-2.5 text-white transition shadow-sm cursor-pointer hover:shadow-md"
              >
                <FaApple className="text-2xl shrink-0" />
                <div className="text-left">
                  <span className="block text-[9px] uppercase tracking-wider font-extrabold text-blue-100">
                    Download on the
                  </span>
                  <span className="block text-xs font-black leading-none">
                    App Store
                  </span>
                </div>
              </button>

              <button
                onClick={() => handleAppDownload("Google Play")}
                className="w-full flex items-center gap-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] px-4 py-2.5 text-white transition shadow-sm cursor-pointer hover:shadow-md"
              >
                <FaGooglePlay className="text-xl shrink-0 text-cyan-200" />
                <div className="text-left">
                  <span className="block text-[9px] uppercase tracking-wider font-extrabold text-blue-100">
                    GET IT ON
                  </span>
                  <span className="block text-xs font-black leading-none">
                    Google Play
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Footer Copyright & Bottom Links */}
        <div className="border-t border-[#F0F4FC] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-semibold text-[#66789C]">
            Copyright © {new Date().getFullYear()}. <span className="text-[#05264E] font-bold">JobBox</span> all right reserved
          </p>

          <div className="flex items-center gap-6 text-xs font-semibold text-[#66789C]">
            <button
              onClick={() => handleNavClick("/privacy", "Privacy Policy")}
              className="hover:text-[#3C65F5] transition cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNavClick("/terms", "Terms & Conditions")}
              className="hover:text-[#3C65F5] transition cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <button
              onClick={() => handleNavClick("/security", "Security")}
              className="hover:text-[#3C65F5] transition cursor-pointer"
            >
              Security
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
