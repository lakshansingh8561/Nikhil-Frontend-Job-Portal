import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { CARD_CLASS } from "../common/Card";
import { useNetworkPaths } from "../../hooks/useNetworkPaths";

/** Small promo card LinkedIn keeps at the bottom of the right rail. */
export const FooterRail: React.FC = () => {
  const paths = useNetworkPaths();

  return (
    <div className={`${CARD_CLASS} p-4`}>
      <h3 className="text-sm font-semibold text-[rgba(0,0,0,0.9)]">Grow your network</h3>
      <p className="mt-1 text-xs leading-snug text-[rgba(0,0,0,0.6)]">
        Connect with recruiters and peers to get your profile in front of the right people.
      </p>
      <Link
        to={paths.directory}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0a66c2] hover:underline"
      >
        Find people <FiArrowRight />
      </Link>
    </div>
  );
};

export default FooterRail;
