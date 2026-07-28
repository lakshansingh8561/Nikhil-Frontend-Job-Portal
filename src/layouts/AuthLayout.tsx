import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import AuthImage from "../assets/images/images.jpg";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const AuthLayout = ({
  title,
  subtitle,
  children,
}: Props) => {
  return (
    <section className="min-h-screen bg-white pt-[110px]">
      <div className="mx-auto grid min-h-[calc(100vh-110px)] max-w-[1280px] grid-cols-1 lg:grid-cols-2">

        {/* LEFT */}

        <div className="flex items-center justify-center px-8 py-14">

          <div className="w-full max-w-[460px]">

            <Link
              to="/"
              className="mb-8 inline-block"
            >
              <img
                src={Logo}
                alt="logo"
                className="h-12"
              />
            </Link>

            <h1 className="text-4xl font-bold text-[#05264E]">
              {title}
            </h1>

            <p className="mt-3 text-gray-500">
              {subtitle}
            </p>

            <div className="mt-10">
              {children}
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="hidden items-center justify-center bg-[#F6F9FF] lg:flex">

          <img
            src={AuthImage}
            alt=""
            className="w-[85%] max-w-[520px]"
          />

        </div>

      </div>
    </section>
  );
};

export default AuthLayout;