import React, { useState } from "react";
import { FiMail, FiCheck } from "react-icons/fi";

export const BlogNewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 4000);
    }
  };

  return (
    <div className="w-full relative bg-[#3C65F5] rounded-[28px] sm:rounded-[36px] py-14 sm:py-20 px-6 sm:px-12 overflow-hidden shadow-xl text-center font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Decorative Waves / Circles */}
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      {/* Floating Left Side Photos (Hidden on tiny screens, visible on lg screens) */}
      <div className="hidden lg:block">
        {/* Top-Left Image */}
        <div className="absolute top-8 left-8 w-24 h-28 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg transform -rotate-3 hover:scale-105 transition duration-300">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80"
            alt="Office Team"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Middle-Left Image */}
        <div className="absolute top-32 left-36 w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg transform rotate-6 hover:scale-105 transition duration-300">
          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&auto=format&fit=crop&q=80"
            alt="Colleagues Meeting"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom-Left Image */}
        <div className="absolute bottom-8 left-10 w-28 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg transform -rotate-6 hover:scale-105 transition duration-300">
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&auto=format&fit=crop&q=80"
            alt="Brainstorming"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Floating Right Side Photos */}
      <div className="hidden lg:block">
        {/* Top-Right Image */}
        <div className="absolute top-10 right-14 w-32 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg transform rotate-3 hover:scale-105 transition duration-300">
          <img
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&auto=format&fit=crop&q=80"
            alt="Business Discussion"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom-Right Image */}
        <div className="absolute bottom-12 right-12 w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg transform -rotate-3 hover:scale-105 transition duration-300">
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&auto=format&fit=crop&q=80"
            alt="Office Success"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-snug sm:leading-tight">
          New Things Will Always <br className="hidden sm:inline" />
          Update Regularly
        </h2>

        {/* Newsletter Subscription Bar */}
        <form onSubmit={handleSubscribe} className="max-w-xl mx-auto bg-white p-2.5 rounded-[20px] shadow-2xl flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-3 flex-1 w-full pl-3 pr-2 py-1">
            <FiMail className="text-slate-400 text-xl shrink-0" />
            <input
              type="email"
              placeholder="Enter your email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm font-medium text-[#05264E] placeholder:text-slate-400 focus:outline-none bg-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3.5 bg-[#3C65F5] hover:bg-[#254BD6] text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md shrink-0"
          >
            {subscribed ? (
              <>
                <FiCheck className="text-base" /> Subscribed!
              </>
            ) : (
              <>
                <FiCheck className="text-base" /> Subscribe
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogNewsletterSection;
