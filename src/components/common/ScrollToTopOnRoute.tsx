import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Automatically scrolls window to the top on every route/page change.
 */
export const ScrollToTopOnRoute = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, [pathname]);

  return null;
};

export default ScrollToTopOnRoute;
