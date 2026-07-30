export const LoadingSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2xl bg-gray-200" />
            <div className="h-6 w-16 rounded-full bg-gray-200" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-8 w-24 rounded-lg bg-gray-200" />
            <div className="h-4 w-32 rounded-md bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
};
