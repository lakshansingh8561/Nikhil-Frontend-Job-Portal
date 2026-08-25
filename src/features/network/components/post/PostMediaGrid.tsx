import React from "react";
import { FiDownload, FiFileText, FiPlay } from "react-icons/fi";
import Lightbox from "../common/Lightbox";
import { formatBytes, mediaUrl } from "../../utils/format";
import type { PostMedia } from "../../types";

interface PostMediaGridProps {
  media: PostMedia[];
  /** Legacy posts only carry `mediaUrls`. */
  fallbackUrls?: string[];
}

/**
 * LinkedIn's media mosaic. A single image renders at its natural aspect ratio
 * inside a generous max-height — the previous implementation used
 * `object-cover` inside `max-h-80`, which hard-cropped every portrait photo.
 */
export const PostMediaGrid: React.FC<PostMediaGridProps> = ({ media, fallbackUrls }) => {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const items = React.useMemo<PostMedia[]>(() => {
    if (Array.isArray(media) && media.length > 0) return media.filter((item) => item?.url);
    return (fallbackUrls || [])
      .filter(Boolean)
      .map((url) => ({ url, type: "IMAGE" as const }));
  }, [media, fallbackUrls]);

  if (items.length === 0) return null;

  const visuals = items.filter((item) => item.type !== "DOCUMENT");
  const documents = items.filter((item) => item.type === "DOCUMENT");

  const openAt = (item: PostMedia) => {
    const index = items.findIndex((candidate) => candidate.url === item.url);
    setLightboxIndex(index >= 0 ? index : 0);
  };

  return (
    <>
      {visuals.length === 1 && (
        <button
          type="button"
          onClick={() => openAt(visuals[0])}
          className="block w-full bg-[#f4f2ee] cursor-zoom-in"
        >
          <MediaFrame item={visuals[0]} single />
        </button>
      )}

      {visuals.length === 2 && (
        <div className="grid grid-cols-2 gap-0.5">
          {visuals.map((item) => (
            <button
              key={item.url}
              type="button"
              onClick={() => openAt(item)}
              className="aspect-square bg-[#f4f2ee] cursor-zoom-in"
            >
              <MediaFrame item={item} />
            </button>
          ))}
        </div>
      )}

      {visuals.length === 3 && (
        <div className="grid grid-cols-2 gap-0.5">
          <button
            type="button"
            onClick={() => openAt(visuals[0])}
            className="row-span-2 bg-[#f4f2ee] cursor-zoom-in"
          >
            <MediaFrame item={visuals[0]} />
          </button>
          {visuals.slice(1).map((item) => (
            <button
              key={item.url}
              type="button"
              onClick={() => openAt(item)}
              className="aspect-[4/3] bg-[#f4f2ee] cursor-zoom-in"
            >
              <MediaFrame item={item} />
            </button>
          ))}
        </div>
      )}

      {visuals.length >= 4 && (
        <div className="grid grid-cols-2 gap-0.5">
          {visuals.slice(0, 4).map((item, index) => {
            const overflow = index === 3 ? visuals.length - 4 : 0;
            return (
              <button
                key={item.url}
                type="button"
                onClick={() => openAt(item)}
                className="relative aspect-square bg-[#f4f2ee] cursor-zoom-in"
              >
                <MediaFrame item={item} />
                {overflow > 0 && (
                  <span className="absolute inset-0 grid place-items-center bg-[rgba(0,0,0,0.6)] text-2xl font-semibold text-white">
                    +{overflow}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {documents.length > 0 && (
        <div className="space-y-1 px-4 pb-1">
          {documents.map((item) => (
            <a
              key={item.url}
              href={mediaUrl(item.url)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="flex items-center gap-3 rounded-lg border border-[rgba(0,0,0,0.15)] bg-[#f4f2ee] px-3 py-3 transition hover:border-[#0a66c2] hover:bg-[#0a66c2]/5"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded bg-white text-[#e06847]">
                <FiFileText className="text-xl" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-[rgba(0,0,0,0.9)]">
                  {item.fileName || "Attachment"}
                </span>
                <span className="block text-xs text-[rgba(0,0,0,0.6)]">
                  {formatBytes(item.bytes) || "Document"}
                </span>
              </span>
              <FiDownload className="shrink-0 text-[rgba(0,0,0,0.6)]" />
            </a>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
};

const MediaFrame: React.FC<{ item: PostMedia; single?: boolean }> = ({ item, single }) => {
  const url = mediaUrl(item.url);

  if (item.type === "VIDEO") {
    return (
      <span className="relative block h-full w-full">
        <video
          src={url}
          preload="metadata"
          muted
          playsInline
          className={single ? "max-h-[560px] w-full object-contain" : "h-full w-full object-cover"}
        />
        <span className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-black/60 text-white">
            <FiPlay className="text-2xl" />
          </span>
        </span>
      </span>
    );
  }

  return (
    <img
      src={url}
      alt={item.fileName || "Post attachment"}
      loading="lazy"
      className={
        single
          ? "max-h-[560px] w-full object-contain"
          : "h-full w-full object-cover"
      }
    />
  );
};

export default PostMediaGrid;
