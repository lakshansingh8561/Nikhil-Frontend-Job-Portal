import React from "react";
import { REACTIONS, reactionMeta } from "../../utils/reactions";
import type { ReactionType } from "../../types";

interface ReactionPickerProps {
  open: boolean;
  onPick: (type: ReactionType) => void;
  onRequestClose: () => void;
  /** Keeps the picker open while the cursor is over it. */
  onHoverChange?: (hovering: boolean) => void;
}

/** The floating row of six reactions that appears above the Like button. */
export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  open,
  onPick,
  onRequestClose,
  onHoverChange,
}) => {
  if (!open) return null;

  return (
    <div
      role="menu"
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      className="absolute bottom-[calc(100%+6px)] left-0 z-30 flex animate-[fadeIn_120ms_ease-out] items-center gap-1 rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-2 py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
    >
      {REACTIONS.map((reaction) => (
        <button
          key={reaction.key}
          type="button"
          title={reaction.label}
          aria-label={reaction.label}
          onClick={(event) => {
            event.stopPropagation();
            onPick(reaction.key);
            onRequestClose();
          }}
          className="group relative grid h-9 w-9 place-items-center rounded-full text-2xl leading-none transition-transform duration-150 hover:-translate-y-1.5 hover:scale-[1.35] cursor-pointer"
        >
          <span aria-hidden="true">{reaction.emoji}</span>
          <span
            className="pointer-events-none absolute -top-7 hidden whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-bold text-white group-hover:block"
            style={{ backgroundColor: reaction.color }}
          >
            {reaction.label}
          </span>
        </button>
      ))}
    </div>
  );
};

/** Overlapping badge stack used in the social-proof row. */
export const ReactionBadges: React.FC<{ types: string[]; size?: "sm" | "xs" }> = ({
  types,
  size = "sm",
}) => {
  const metas = types.map(reactionMeta).filter(Boolean).slice(0, 3);
  if (metas.length === 0) return null;

  const box = size === "sm" ? "h-[18px] w-[18px] text-[10px]" : "h-4 w-4 text-[9px]";

  return (
    <span className="flex items-center">
      {metas.map((meta, index) => (
        <span
          key={meta!.key}
          style={{ backgroundColor: meta!.badgeBg, zIndex: metas.length - index }}
          className={`${box} -ml-1 grid place-items-center rounded-full ring-1 ring-white first:ml-0`}
        >
          <span aria-hidden="true" className="scale-[0.8]">
            {meta!.emoji}
          </span>
        </span>
      ))}
    </span>
  );
};

export default ReactionPicker;
