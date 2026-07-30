import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const AuthLayout = ({
  title,
  subtitle,
  children,
}: AuthLayoutProps) => {
  return (
    <section className="min-h-screen bg-[#F3F7FF]">
      <div className="mx-auto flex min-h-screen max-w-[1440px] items-center justify-center px-6 py-10 lg:px-10">
        <div className="grid w-full overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:grid-cols-2">

          {/* Left Side */}

          <div className="relative hidden overflow-hidden bg-[#EAF2FF] lg:flex lg:items-center lg:justify-center">

            {/* Background Circles */}

            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#3C65F5]/10"></div>

            <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-[#3C65F5]/10"></div>

            <div className="absolute top-20 right-20 grid grid-cols-6 gap-2 opacity-40">
              {Array.from({ length: 36 }).map((_, index) => (
                <div
                  key={index}
                  className="h-2 w-2 rounded-full bg-[#3C65F5]"
                />
              ))}
            </div>

            {/* Replace this later with your illustration */}

            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-8 h-[330px] w-[330px] rounded-full bg-white shadow-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-[#3C65F5]">
                  Illustration
                </span>
              </div>

              <h2 className="text-3xl font-bold text-[#05264E]">
                Find Your Dream Job
              </h2>

              <p className="mt-4 max-w-md text-center text-[#66789C]">
                Connect with thousands of companies and discover
                opportunities that match your skills.
              </p>
            </div>
          </div>

          {/* Right Side */}

          <div className="flex items-center justify-center px-8 py-14 lg:px-16">
            <div className="w-full max-w-[470px]">

              <Link to="/" className="inline-block">
                <img
                  src={Logo}
                  alt="Job Portal"
                  className="h-12"
                />
              </Link>

              <h1 className="mt-10 text-[42px] font-bold leading-tight text-[#05264E]">
                {title}
              </h1>

              <p className="mt-3 text-[17px] text-[#66789C]">
                {subtitle}
              </p>

              <div className="mt-10">
                {children}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AuthLayout;