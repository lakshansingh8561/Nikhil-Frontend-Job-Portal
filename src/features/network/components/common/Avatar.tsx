import React from "react";
import { Link } from "react-router-dom";
import { colorForKey, initialsOf, mediaUrl } from "../../utils/format";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "hero";

const SIZES: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[9px]",
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-xs",
  lg: "h-12 w-12 text-sm",
  xl: "h-16 w-16 text-lg",
  hero: "h-[152px] w-[152px] text-4xl",
};

interface AvatarProps {
  src?: string;
  name?: string;
  email?: string;
  size?: AvatarSize;
  /** When provided the avatar becomes a link to that profile. */
  to?: string;
  className?: string;
  /** Renders a square-ish rounded avatar (used for company logos). */
  rounded?: "full" | "md";
  ring?: boolean;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  email,
  size = "md",
  to,
  className = "",
  rounded = "full",
  ring = false,
  onClick,
}) => {
  const [failed, setFailed] = React.useState(false);
  const resolved = mediaUrl(src);
  const showImage = Boolean(resolved) && !failed;
  const radius = rounded === "full" ? "rounded-full" : "rounded-lg";

  const body = showImage ? (
    <img
      src={resolved}
      alt={name || "Profile photo"}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${SIZES[size]} ${radius} object-cover bg-[#e9e5df] shrink-0 ${
        ring ? "ring-2 ring-white" : ""
      } ${className}`}
    />
  ) : (
    <span
      aria-hidden="true"
      style={{ backgroundColor: colorForKey(name || email) }}
      className={`${SIZES[size]} ${radius} shrink-0 inline-flex items-center justify-center font-semibold text-white select-none ${
        ring ? "ring-2 ring-white" : ""
      } ${className}`}
    >
      {initialsOf(name, email)}
    </span>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className="shrink-0" aria-label={name || "View profile"}>
        {body}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="shrink-0 cursor-pointer">
        {body}
      </button>
    );
  }

  return body;
};

export default Avatar;
