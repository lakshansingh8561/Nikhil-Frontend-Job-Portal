import React from "react";
import { FiCheck, FiX } from "react-icons/fi";
import type { IMembershipFeature } from "../types/membership.types";

interface MembershipFeatureProps {
  feature: IMembershipFeature;
}

export const MembershipFeature: React.FC<MembershipFeatureProps> = ({
  feature,
}) => {
  return (
    <li className="flex items-center gap-2.5 py-1 text-xs">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          feature.enabled
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-slate-800 text-slate-500 border border-slate-700"
        }`}
      >
        {feature.enabled ? <FiCheck /> : <FiX />}
      </span>
      <span
        className={`font-medium ${
          feature.enabled ? "text-slate-200" : "text-slate-500 line-through"
        }`}
      >
        {feature.title}
      </span>
    </li>
  );
};
