import React from "react";

/**
 * The LinkedIn page frame.
 *
 * The network pages are mounted inside the dashboard layout, whose `<main>`
 * carries `p-4 sm:p-6 lg:p-8`. Negative margins cancel that padding so the
 * feed can own the full width of the content area — without this the grid is
 * squeezed and the middle column ends up no wider than the right rail.
 *
 * Column widths follow LinkedIn: a narrow identity rail, a dominant feed, and
 * a 300px suggestions rail. Both rails are sticky; the feed scrolls.
 */

const BLEED =
  "-mx-4 -my-4 sm:-mx-6 sm:-my-6 lg:-mx-8 lg:-my-8 min-h-[calc(100%+4rem)] bg-[#f4f2ee]";

interface NetworkShellProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  /** Full-width single column (used by the profile page). */
  variant?: "feed" | "wide";
  /** Optional sticky sub-nav rendered above the grid. */
  header?: React.ReactNode;
}

export const NetworkShell: React.FC<NetworkShellProps> = ({
  left,
  right,
  children,
  variant = "feed",
  header,
}) => {
  if (variant === "wide") {
    return (
      <div className={BLEED}>
        {header}
        <div className="mx-auto w-full max-w-[1128px] px-3 py-4 sm:px-5 lg:px-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 space-y-2">{children}</div>
            {right && (
              <aside className="hidden lg:block">
                <div className="sticky top-4 space-y-2">{right}</div>
              </aside>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={BLEED}>
      {header}
      <div className="mx-auto w-full max-w-[1240px] px-3 py-4 sm:px-5 lg:px-6">
        <div
          className="
            grid grid-cols-1 gap-4
            lg:grid-cols-[minmax(0,1fr)_300px]
            xl:grid-cols-[216px_minmax(0,1fr)_300px]
          "
        >
          {/* Identity rail — hidden below xl, where the feed takes the space. */}
          {left && (
            <aside className="hidden xl:block">
              <div className="sticky top-4 space-y-2">{left}</div>
            </aside>
          )}

          {/* The feed: always the widest column. */}
          <div className="min-w-0 space-y-2">{children}</div>

          {right && (
            <aside className="hidden lg:block">
              <div className="sticky top-4 space-y-2">{right}</div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkShell;
