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
  category = "Account",
  title,
  subtitle,
  children,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-[440px] saas-card p-6 sm:p-8 shadow-lg">
          <div className="text-center mb-6">
            <span className="saas-badge saas-badge-indigo uppercase tracking-wider text-[10px] mb-2">
              {category}
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-1 text-xs font-medium text-slate-500">
              {subtitle}
            </p>
          </div>

          <div>{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthLayout;