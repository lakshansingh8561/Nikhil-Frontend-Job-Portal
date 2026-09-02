import React from "react";

export const FeaturedSkeleton: React.FC = () => (
  <div className="w-full h-[518px] rounded-[16px] sm:rounded-[20px] bg-slate-200 animate-pulse" />
);

export const BlogCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-[24px] border border-slate-100 p-4 sm:p-5 animate-pulse flex flex-col justify-between h-[420px]">
    <div>
      <div className="w-full h-[210px] rounded-[18px] bg-slate-200 mb-5" />
      <div className="w-20 h-5 bg-slate-200 rounded-md mb-3" />
      <div className="w-full h-6 bg-slate-200 rounded-md mb-2" />
      <div className="w-3/4 h-6 bg-slate-200 rounded-md mb-4" />
      <div className="w-full h-4 bg-slate-100 rounded-md mb-1" />
      <div className="w-5/6 h-4 bg-slate-100 rounded-md" />
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-200" />
        <div className="w-24 h-4 bg-slate-200 rounded-md" />
      </div>
      <div className="w-16 h-4 bg-slate-200 rounded-md" />
    </div>
  </div>
);

export const TrendingSkeleton: React.FC = () => (
  <div className="flex items-center gap-3.5 p-2 animate-pulse">
    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-slate-200" />
    <div className="flex-1 space-y-2">
      <div className="w-full h-4 bg-slate-200 rounded-md" />
      <div className="w-3/4 h-4 bg-slate-200 rounded-md" />
      <div className="w-1/2 h-3 bg-slate-100 rounded-md" />
    </div>
  </div>
);
