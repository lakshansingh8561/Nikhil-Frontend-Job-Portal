/**
 * Small formatting helpers shared across the network feature.
 * All of them are defensive: the feed must never white-screen because a field
 * arrived as an object, a null, or a shape we didn't expect.
 */

/** Renders anything the API might hand us as a display string. */
export const asText = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
};

/** Renders anything the API might hand us as a display number. */
export const asNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

/** LinkedIn-style compact relative time: "now", "12m", "5h", "3d", "2w", "8mo", "1y". */
export const timeAgo = (input?: string | number | Date | null): string => {
  if (!input) return "";
  const then = new Date(input).getTime();
  if (!Number.isFinite(then)) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));

  if (seconds < 45) return "now";
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)}m`;
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)}h`;
  if (seconds < WEEK) return `${Math.floor(seconds / DAY)}d`;
  if (seconds < DAY * 30) return `${Math.floor(seconds / WEEK)}w`;
  if (seconds < DAY * 365) return `${Math.floor(seconds / (DAY * 30))}mo`;
  return `${Math.floor(seconds / (DAY * 365))}y`;
};

/** "Aug 2024" — used on experience/education timelines. */
export const monthYear = (input?: string | Date | null): string => {
  if (!input) return "";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
};

/** "Jan 2020 - Present · 4 yrs 6 mos" */
export const dateRangeLabel = (
  start?: string | null,
  end?: string | null,
  current?: boolean
): string => {
  const from = monthYear(start);
  if (!from) return "";
  const to = current || !end ? "Present" : monthYear(end);

  const startMs = new Date(start as string).getTime();
  const endMs = current || !end ? Date.now() : new Date(end).getTime();

  let duration = "";
  if (Number.isFinite(startMs) && Number.isFinite(endMs) && endMs >= startMs) {
    const months = Math.max(
      0,
      Math.round((endMs - startMs) / (1000 * 60 * 60 * 24 * 30.44))
    );
    const years = Math.floor(months / 12);
    const rest = months % 12;
    const parts: string[] = [];
    if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
    if (rest > 0) parts.push(`${rest} mo${rest > 1 ? "s" : ""}`);
    duration = parts.join(" ");
  }

  return duration ? `${from} - ${to} · ${duration}` : `${from} - ${to}`;
};

/** 1200 -> "1,200"; 15400 -> "15K"; 2400000 -> "2.4M" */
export const formatCount = (value: unknown): string => {
  const count = asNumber(value);
  if (count < 1000) return String(count);
  if (count < 10_000) return count.toLocaleString();
  if (count < 1_000_000) return `${Math.floor(count / 1000)}K`;
  return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
};

export const formatBytes = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

/** Two-letter monogram used by the avatar fallback. */
export const initialsOf = (name?: string, email?: string): string => {
  const source = asText(name).trim() || asText(email).split("@")[0] || "";
  if (!source) return "?";
  const words = source.split(/[\s._-]+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

/**
 * Media may come back as a Cloudinary https URL or as an absolute
 * `http://localhost:5000/uploads/...` path from the local-disk fallback.
 * Relative paths get the API origin prepended so both render identically.
 */
export const mediaUrl = (url?: string): string => {
  const value = asText(url).trim();
  if (!value) return "";
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }
  const origin = (import.meta.env.VITE_BASE_URL as string) || "";
  return `${origin.replace(/\/$/, "")}/${value.replace(/^\//, "")}`;
};

/** Deterministic pastel background for avatar monograms. */
const AVATAR_COLORS = [
  "#0a66c2",
  "#7a3e9d",
  "#b24020",
  "#0e7c66",
  "#8a6d1f",
  "#1f4d8f",
  "#a02c5a",
  "#3c6e2a",
];

export const colorForKey = (key?: string): string => {
  const source = asText(key) || "?";
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) % 100_000;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

export const roleLabel = (role?: string): string => {
  switch (asText(role).toUpperCase()) {
    case "JOB_SEEKER":
      return "Job Seeker";
    case "RECRUITER":
      return "Recruiter";
    case "ADMIN":
      return "Admin";
    default:
      return "";
  }
};

/** Joins the parts of a location object, skipping blanks. */
export const locationLabel = (location: unknown): string => {
  if (!location) return "";
  if (typeof location === "string") return location;
  if (typeof location !== "object") return "";
  const { city, state, country } = location as Record<string, unknown>;
  return [asText(city), asText(state), asText(country)].filter(Boolean).join(", ");
};

export const pluralize = (count: number, singular: string, plural?: string): string =>
  `${count} ${count === 1 ? singular : plural || `${singular}s`}`;
