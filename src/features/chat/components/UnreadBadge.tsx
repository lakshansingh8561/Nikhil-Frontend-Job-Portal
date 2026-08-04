import React from "react";

interface UnreadBadgeProps {
  count: number;
  className?: string;
}

export const UnreadBadge: React.FC<UnreadBadgeProps> = ({
  count,
  className = "",
}) => {
  if (!count || count <= 0) return null;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs ${className}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};
