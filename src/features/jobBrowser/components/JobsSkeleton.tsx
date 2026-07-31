import React from "react";

interface JobsSkeletonProps {
  count?: number;
  layout?: "grid" | "list";
}

export const JobsSkeleton: React.FC<JobsSkeletonProps> = ({
  count = 6,
  layout = "grid",
}) => {
  return (
    <div
      className={
        layout === "grid"
          ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          : "space-y-4"
      }
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-3xl border border-[#EAEFF7] bg-white p-6 shadow-sm min-h-[340px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="h-13 w-13 rounded-2xl bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="h-3 w-20 rounded bg-gray-200" />
              </div>
            </div>

            <div className="mt-4 h-6 w-3/4 rounded bg-gray-200" />
            <div className="mt-3 flex gap-2">
              <div className="h-6 w-20 rounded bg-gray-200" />
              <div className="h-6 w-20 rounded bg-gray-200" />
            </div>

            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-4/5 rounded bg-gray-200" />
            </div>

            <div className="mt-4 flex gap-2">
              <div className="h-5 w-14 rounded bg-gray-200" />
              <div className="h-5 w-14 rounded bg-gray-200" />
              <div className="h-5 w-14 rounded bg-gray-200" />
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between">
            <div className="h-6 w-28 rounded bg-gray-200" />
            <div className="h-9 w-24 rounded-xl bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-8 rounded-3xl border border-[#EAEFF7] bg-white p-8 shadow-sm">
      <div className="flex items-start gap-6 border-b border-gray-100 pb-8">
        <div className="h-20 w-20 rounded-2xl bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="h-7 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-1/4 rounded bg-gray-200" />
          <div className="flex gap-4 pt-2">
            <div className="h-6 w-24 rounded bg-gray-200" />
            <div className="h-6 w-24 rounded bg-gray-200" />
            <div className="h-6 w-24 rounded bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-5 w-40 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
        <div className="h-4 w-4/6 rounded bg-gray-200" />
      </div>

      <div className="space-y-4">
        <div className="h-5 w-32 rounded bg-gray-200" />
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded-xl bg-gray-200" />
          <div className="h-8 w-20 rounded-xl bg-gray-200" />
          <div className="h-8 w-20 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default JobsSkeleton;
