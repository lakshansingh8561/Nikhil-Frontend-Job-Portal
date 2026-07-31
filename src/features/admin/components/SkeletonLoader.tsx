import React from "react";

interface SkeletonLoaderProps {
  rows?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ rows = 5 }) => {
  return (
    <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 shadow-xs animate-pulse">
      <div className="flex items-center justify-between border-b border-[#F0F4FC] pb-4 mb-6">
        <div className="h-6 w-48 bg-gray-200 rounded-lg" />
        <div className="h-9 w-64 bg-gray-200 rounded-xl" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center gap-3.5 w-1/3">
              <div className="h-10 w-10 bg-gray-200 rounded-xl shrink-0" />
              <div className="space-y-1.5 w-full">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-4 w-24 bg-gray-200 rounded hidden sm:block" />
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
            <div className="h-8 w-24 bg-gray-200 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
