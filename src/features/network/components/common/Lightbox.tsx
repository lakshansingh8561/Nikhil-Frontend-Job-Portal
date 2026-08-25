import React from "react";
import { createPortal } from "react-dom";
import { FiChevronLeft, FiChevronRight, FiDownload, FiX } from "react-icons/fi";
import { mediaUrl } from "../../utils/format";
import type { PostMedia } from "../../types";

interface LightboxProps {
  items: PostMedia[];
  startIndex: number;
  onClose: () => void;
}

/** Full-screen media viewer with arrow-key navigation. */
export const Lightbox: React.FC<LightboxProps> = ({ items, startIndex, onClose }) => {
  const [index, setIndex] = React.useState(startIndex);

  const count = items.length;
  const current = items[index];

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setIndex((value) => (value + 1) % count);
      if (event.key === "ArrowLeft") setIndex((value) => (value - 1 + count) % count);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [count, onClose]);

  if (!current) return null;

  const url = mediaUrl(current.url);

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex flex-col bg-[rgba(0,0,0,0.92)]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex shrink-0 items-center justify-between px-4 py-3 text-white">
        <span className="text-sm font-medium">
          {count > 1 ? `${index + 1} of ${count}` : current.fileName || ""}
        </span>
        <div className="flex items-center gap-1">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Open original"
          >
            <FiDownload />
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <FiX className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6 sm:px-14">
        {count > 1 && (
          <button
            type="button"
            onClick={() => setIndex((value) => (value - 1 + count) % count)}
            aria-label="Previous"
            className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/50 text-white transition hover:bg-black/70 cursor-pointer"
          >
            <FiChevronLeft className="text-2xl" />
          </button>
        )}

        {current.type === "VIDEO" ? (
          <video
            src={url}
            controls
            autoPlay
            className="max-h-full max-w-full rounded"
          />
        ) : current.type === "DOCUMENT" ? (
          <iframe
            src={url}
            title={current.fileName || "Document"}
            className="h-full w-full rounded bg-white"
          />
        ) : (
          <img
            src={url}
            alt={current.fileName || "Attachment"}
            className="max-h-full max-w-full object-contain"
          />
        )}

        {count > 1 && (
          <button
            type="button"
            onClick={() => setIndex((value) => (value + 1) % count)}
            aria-label="Next"
            className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/50 text-white transition hover:bg-black/70 cursor-pointer"
          >
            <FiChevronRight className="text-2xl" />
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Lightbox;
