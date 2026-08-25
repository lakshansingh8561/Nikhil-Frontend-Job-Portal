import React from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Tailwind max-width class for the dialog. */
  widthClass?: string;
  /** Hides the header divider for media-first dialogs. */
  bare?: boolean;
}

/**
 * Portal dialog with LinkedIn's chrome: 8px radius, sticky header with a close
 * button, scrollable body, optional sticky footer. Locks page scroll and closes
 * on Escape or backdrop click.
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  widthClass = "max-w-[744px]",
  bare = false,
}) => {
  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-[rgba(0,0,0,0.75)] p-0 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative flex w-full ${widthClass} max-h-full flex-col overflow-hidden bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-lg`}
      >
        {!bare && (
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[rgba(0,0,0,0.08)] px-4 py-3 sm:px-6">
            <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)]">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-8 w-8 place-items-center rounded-full text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
            >
              <FiX className="text-xl" />
            </button>
          </header>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {footer && (
          <footer className="shrink-0 border-t border-[rgba(0,0,0,0.08)] px-4 py-3 sm:px-6">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
