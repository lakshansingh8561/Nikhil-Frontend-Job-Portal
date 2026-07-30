import type { ReactNode } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

interface AuthLayoutProps {
  category?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

const AuthLayout = ({
  category = "Register",
  title,
  subtitle,
  children,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Top Main Navigation Header */}
      <Navbar />

      {/* Main Centered Auth Canvas */}
      <main className="flex-1 pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
        {/* Right Decorative UFO Vector Accent from JobBox Template */}
        <div className="hidden lg:block absolute right-12 top-1/3 opacity-80 pointer-events-none">
          <div className="relative h-44 w-44 flex items-center justify-center">
            <div className="absolute h-32 w-32 rounded-full bg-blue-100/60 blur-xl" />
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 opacity-70"
            >
              <ellipse cx="60" cy="50" rx="45" ry="18" fill="#3C65F5" fillOpacity="0.3" />
              <path d="M35 50C35 35 85 35 85 50Z" fill="#3C65F5" fillOpacity="0.5" />
              <circle cx="45" cy="50" r="3" fill="white" />
              <circle cx="60" cy="50" r="3" fill="white" />
              <circle cx="75" cy="50" r="3" fill="white" />
            </svg>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[480px] mx-auto z-10">
          {/* Header Typography */}
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#3C65F5] mb-1.5">
              {category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#05264E]">
              {title}
            </h1>
            <p className="mt-2 text-sm font-medium text-[#66789C]">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          <div>{children}</div>
        </div>
      </main>

      {/* Main Footer */}
      <Footer />
    </div>
  );
};

export default AuthLayout;