import React from "react";

interface ApplicationSkeletonProps {
  count?: number;
}

export const ApplicationSkeleton: React.FC<ApplicationSkeletonProps> = ({
  count = 4,
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className="h-14 w-14 rounded-2xl bg-gray-200 shrink-0" />

            <div className="flex-1 space-y-2">
              <div className="h-5 w-1/3 rounded bg-gray-200" />
              <div className="h-4 w-1/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200 mt-2" />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="h-8 w-24 rounded-xl bg-gray-200" />
            <div className="h-8 w-28 rounded-xl bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationSkeleton;
