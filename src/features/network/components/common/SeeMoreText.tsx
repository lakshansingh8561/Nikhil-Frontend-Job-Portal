import React from "react";
import { linkify } from "../../utils/linkify";

interface SeeMoreTextProps {
  text: string;
  /** Characters shown before the clamp kicks in. LinkedIn clamps around 3 lines. */
  limit?: number;
  className?: string;
  hashtagBasePath?: string;
}

/**
 * LinkedIn's collapsed post body: a character clamp with an inline "…see more"
 * that expands in place. Uses a character budget rather than `line-clamp` so
 * the toggle can be hidden entirely for short posts.
 */
export const SeeMoreText: React.FC<SeeMoreTextProps> = ({
  text,
  limit = 280,
  className = "",
  hashtagBasePath,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const value = typeof text === "string" ? text : "";
  const needsClamp = value.length > limit + 40;

  // Cut on a word boundary so the ellipsis doesn't land mid-word.
  const visible = React.useMemo(() => {
    if (!needsClamp || expanded) return value;
    const slice = value.slice(0, limit);
    const lastSpace = slice.lastIndexOf(" ");
    return slice.slice(0, lastSpace > limit * 0.6 ? lastSpace : limit);
  }, [value, limit, needsClamp, expanded]);

  if (!value.trim()) return null;

  return (
    <div
      className={`text-sm leading-[1.45] text-[rgba(0,0,0,0.9)] whitespace-pre-wrap break-words ${className}`}
    >
      {linkify(visible, { hashtagBasePath })}
      {needsClamp && !expanded && (
        <>
          <span className="text-[rgba(0,0,0,0.6)]">…</span>{" "}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setExpanded(true);
            }}
            className="text-[rgba(0,0,0,0.6)] hover:text-[#3C65F5] hover:underline font-normal cursor-pointer"
          >
            see more
          </button>
        </>
      )}
      {needsClamp && expanded && (
        <>
          {" "}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setExpanded(false);
            }}
            className="text-[rgba(0,0,0,0.6)] hover:text-[#3C65F5] hover:underline cursor-pointer"
          >
            see less
          </button>
        </>
      )}
    </div>
  );
};

export default SeeMoreText;
