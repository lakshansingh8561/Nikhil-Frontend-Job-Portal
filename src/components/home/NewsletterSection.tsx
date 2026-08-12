import React, { useState } from "react";
import { FiMail, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import Container from "../common/Container";

import newsletterLeft from "../../assets/images/newsletter-left.png";
import newsletterRight from "../../assets/images/newsletter-right.png";

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubscribed(true);
    toast.success("Thank you for subscribing to JobBox updates!");
    setEmail("");
  };

  return (
    <section className="py-14 bg-[#F5F7FC]">
      <Container>
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#3C65F5] via-[#3B82F6] to-[#2563EB] px-6 py-12 sm:px-12 sm:py-16 text-center shadow-2xl shadow-blue-500/20 border border-blue-400/30">
          {/* Subtle Background Glows */}
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          {/* Left Graphic Image */}
          <div className="absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 hidden md:block max-h-48 lg:max-h-56 xl:max-h-64 transition-transform hover:scale-105 duration-300 drop-shadow-xl pointer-events-none">
            <img
              src={newsletterLeft}
              alt="Newsletter Graphic Left"
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Right Graphic Image */}
          <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 hidden md:block max-h-48 lg:max-h-56 xl:max-h-64 transition-transform hover:scale-105 duration-300 drop-shadow-xl pointer-events-none">
            <img
              src={newsletterRight}
              alt="Newsletter Graphic Right"
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Content Area */}
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-8 text-shadow-sm">
              New Things Will Always <br className="hidden sm:inline" />
              Update Regularly
            </h2>

            {/* Newsletter Input Form */}
            {isSubscribed ? (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/20 backdrop-blur-md px-6 py-3.5 text-sm font-bold text-white border border-white/40 shadow-lg animate-fade-in">
                <FiCheckCircle className="text-emerald-300 text-lg" />
                <span>You're subscribed! Stay tuned for weekly career insights.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl bg-white p-2.5 shadow-2xl shadow-blue-950/20 border border-white/80 transition-all duration-300 focus-within:ring-4 focus-within:ring-white/30"
              >
                <div className="flex items-center flex-1 w-full px-2">
                  <FiMail className="text-[#66789C] text-xl ml-2 shrink-0 hidden sm:block" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email here"
                    className="w-full bg-transparent px-3 py-3 text-sm font-semibold text-[#05264E] placeholder-[#66789C] outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#3C65F5] hover:bg-[#254BD6] px-7 py-3.5 text-xs font-black text-white shadow-md transition-all duration-200 cursor-pointer hover:shadow-xl hover:scale-[1.02] shrink-0"
                >
                  <FiCheckCircle className="text-base" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default NewsletterSection;
