import React from "react";
import { FiAlertCircle, FiFileText, FiPlay, FiRefreshCw, FiX } from "react-icons/fi";
import { formatBytes } from "../../utils/format";
import type { PendingMedia } from "../../hooks/useMediaUpload";

interface MediaPreviewGridProps {
  items: PendingMedia[];
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

/**
 * Thumbnails inside the composer. Previews come from local object URLs so they
 * appear the instant a file is picked — the old composer only showed a filename
 * chip, which made a failed upload indistinguishable from a successful one.
 */
export const MediaPreviewGrid: React.FC<MediaPreviewGridProps> = ({
  items,
  onRemove,
  onRetry,
}) => {
  if (items.length === 0) return null;

  const documents = items.filter((item) => item.type === "DOCUMENT");
  const visuals = items.filter((item) => item.type !== "DOCUMENT");

  return (
    <div className="space-y-2">
      {visuals.length > 0 && (
        <div
          className={`grid gap-2 ${
            visuals.length === 1 ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"
          }`}
        >
          {visuals.map((item) => (
            <figure
              key={item.id}
              className={`group relative overflow-hidden rounded-lg border border-[rgba(0,0,0,0.15)] bg-[#f4f2ee] ${
                visuals.length === 1 ? "max-h-[420px]" : "aspect-square"
              }`}
            >
              {item.type === "VIDEO" ? (
                <>
                  <video
                    src={item.previewUrl}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                  <span className="pointer-events-none absolute inset-0 grid place-items-center">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white">
                      <FiPlay />
                    </span>
                  </span>
                </>
              ) : (
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className={
                    visuals.length === 1
                      ? "max-h-[420px] w-full object-contain"
                      : "h-full w-full object-cover"
                  }
                />
              )}

              <ProgressVeil item={item} onRetry={onRetry} />

              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.file.name}`}
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-[rgba(0,0,0,0.7)] text-white transition hover:bg-black cursor-pointer"
              >
                <FiX className="text-sm" />
              </button>
            </figure>
          ))}
        </div>
      )}

      {documents.map((item) => (
        <div
          key={item.id}
          className="relative flex items-center gap-3 rounded-lg border border-[rgba(0,0,0,0.15)] bg-[#f4f2ee] px-3 py-2.5"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded bg-[#e06847]/10 text-[#e06847]">
            <FiFileText className="text-xl" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[rgba(0,0,0,0.9)]">
              {item.file.name}
            </p>
            <p className="text-xs text-[rgba(0,0,0,0.6)]">
              {item.status === "error"
                ? item.error
                : item.status === "uploading"
                  ? `Uploading ${item.progress}%`
                  : formatBytes(item.file.size)}
            </p>
          </div>

          {item.status === "error" && (
            <button
              type="button"
              onClick={() => onRetry(item.id)}
              className="shrink-0 rounded px-2 py-1 text-xs font-semibold text-[#3C65F5] hover:bg-[#3C65F5]/10 cursor-pointer"
            >
              Retry
            </button>
          )}

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.file.name}`}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
          >
            <FiX />
          </button>
        </div>
      ))}
    </div>
  );
};

/** Progress ring / error overlay drawn on top of a visual thumbnail. */
const ProgressVeil: React.FC<{
  item: PendingMedia;
  onRetry: (id: string) => void;
}> = ({ item, onRetry }) => {
  if (item.status === "error") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-[rgba(0,0,0,0.7)] p-2 text-center">
        <FiAlertCircle className="text-xl text-[#f5988f]" />
        <p className="line-clamp-2 text-[11px] font-medium text-white">{item.error}</p>
        <button
          type="button"
          onClick={() => onRetry(item.id)}
          className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[rgba(0,0,0,0.9)] cursor-pointer"
        >
          <FiRefreshCw className="text-[10px]" /> Retry
        </button>
      </div>
    );
  }

  if (item.status !== "uploading") return null;

  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="absolute inset-0 grid place-items-center bg-[rgba(0,0,0,0.45)]">
      <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="4"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - item.progress / 100)}
          className="transition-[stroke-dashoffset] duration-200"
        />
      </svg>
    </div>
  );
};

export default MediaPreviewGrid;
