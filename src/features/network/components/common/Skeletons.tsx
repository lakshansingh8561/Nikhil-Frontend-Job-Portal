import React from "react";
import { CARD_CLASS } from "./Card";

const Shimmer: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse rounded bg-[#e9e5df] ${className}`} />
);

export const PostSkeleton: React.FC = () => (
  <article className={`${CARD_CLASS} p-4`}>
    <div className="flex items-center gap-3">
      <Shimmer className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-3 w-40" />
        <Shimmer className="h-2.5 w-56" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <Shimmer className="h-3 w-full" />
      <Shimmer className="h-3 w-[85%]" />
      <Shimmer className="h-3 w-[60%]" />
    </div>
    <Shimmer className="mt-4 h-64 w-full rounded-md" />
    <div className="mt-4 flex gap-3">
      {[0, 1, 2, 3].map((index) => (
        <Shimmer key={index} className="h-8 flex-1 rounded-md" />
      ))}
    </div>
  </article>
);

export const FeedSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, index) => (
      <PostSkeleton key={index} />
    ))}
  </div>
);

export const PersonRowSkeleton: React.FC = () => (
  <div className="flex items-center gap-3 py-3">
    <Shimmer className="h-12 w-12 rounded-full" />
    <div className="flex-1 space-y-2">
      <Shimmer className="h-3 w-32" />
      <Shimmer className="h-2.5 w-48" />
    </div>
    <Shimmer className="h-8 w-24 rounded-full" />
  </div>
);

export const RailSkeleton: React.FC = () => (
  <div className={`${CARD_CLASS} p-4 space-y-3`}>
    <Shimmer className="h-3 w-28" />
    {[0, 1, 2].map((index) => (
      <div key={index} className="flex items-center gap-3">
        <Shimmer className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-2.5 w-24" />
          <Shimmer className="h-2 w-32" />
        </div>
      </div>
    ))}
  </div>
);

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = "h-40" }) => (
  <div className={`${CARD_CLASS} ${className} animate-pulse`} />
);

export default FeedSkeleton;
