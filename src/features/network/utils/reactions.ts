import type { ReactionType, SocialProof } from "../types";

export interface ReactionMeta {
  key: ReactionType;
  label: string;
  /** Past-tense verb shown in notifications and the reactors modal tabs. */
  emoji: string;
  /** Colour of the label text once the viewer has picked this reaction. */
  color: string;
  /** Background of the circular badge in the social-proof row. */
  badgeBg: string;
}

export const REACTIONS: ReactionMeta[] = [
  { key: "LIKE", label: "Like", emoji: "👍", color: "#3C65F5", badgeBg: "#378fe9" },
  { key: "CELEBRATE", label: "Celebrate", emoji: "👏", color: "#44712e", badgeBg: "#6dae4f" },
  { key: "SUPPORT", label: "Support", emoji: "🤝", color: "#715e86", badgeBg: "#b39ac5" },
  { key: "LOVE", label: "Love", emoji: "❤️", color: "#b24020", badgeBg: "#df704d" },
  { key: "INSIGHTFUL", label: "Insightful", emoji: "💡", color: "#915907", badgeBg: "#f5bb54" },
  { key: "FUNNY", label: "Funny", emoji: "😂", color: "#1a707e", badgeBg: "#44bfd3" },
];

const REACTION_MAP: Record<string, ReactionMeta> = REACTIONS.reduce(
  (accumulator, reaction) => {
    accumulator[reaction.key] = reaction;
    return accumulator;
  },
  {} as Record<string, ReactionMeta>
);

export const reactionMeta = (type?: string | null): ReactionMeta | null =>
  type ? REACTION_MAP[String(type).toUpperCase()] || null : null;

/** Safe accessor — a legacy post may arrive without `socialProof`. */
export const safeSocialProof = (proof?: SocialProof | null, fallbackTotal = 0): SocialProof => {
  if (proof && Array.isArray(proof.breakdown)) {
    return {
      total: Number(proof.total) || 0,
      breakdown: proof.breakdown.filter((entry) => entry && REACTION_MAP[entry.type]),
      topTypes: Array.isArray(proof.topTypes)
        ? proof.topTypes.filter((type) => REACTION_MAP[type])
        : [],
    };
  }

  const total = Number(fallbackTotal) || 0;
  return {
    total,
    breakdown: total > 0 ? [{ type: "LIKE", count: total }] : [],
    topTypes: total > 0 ? ["LIKE"] : [],
  };
};

/**
 * "You and 12 others" / "Priya Sharma and 3 others" — the clickable text that
 * sits to the right of the overlapping reaction badges.
 */
export const socialProofLabel = (
  total: number,
  viewerReacted: boolean,
  topReactorName?: string
): string => {
  if (total <= 0) return "";
  if (viewerReacted) {
    if (total === 1) return "You";
    return total === 2 ? "You and 1 other" : `You and ${total - 1} others`;
  }
  if (topReactorName) {
    if (total === 1) return topReactorName;
    return total === 2 ? `${topReactorName} and 1 other` : `${topReactorName} and ${total - 1} others`;
  }
  return String(total);
};
