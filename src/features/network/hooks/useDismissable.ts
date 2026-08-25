import React from "react";

/**
 * Closes a popover/menu on outside click or Escape.
 * Returns the ref to attach to the popover's outermost element.
 */
export const useDismissable = <T extends HTMLElement>(
  open: boolean,
  onDismiss: () => void
) => {
  const ref = React.useRef<T | null>(null);

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onDismiss();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onDismiss]);

  return ref;
};

export default useDismissable;
