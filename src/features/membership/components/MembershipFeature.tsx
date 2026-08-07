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
    <li className="flex items-start gap-3 py-1.5 text-sm">
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          feature.enabled
            ? "bg-emerald-100 text-emerald-600"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {feature.enabled ? <FiCheck /> : <FiX />}
      </span>
      <div className="flex flex-col">
        <span
          className={`font-semibold ${
            feature.enabled ? "text-[#05264E]" : "text-gray-400 line-through"
          }`}
        >
          {feature.title}
        </span>
        {feature.description && (
          <span className="text-xs text-gray-500 font-normal mt-0.5">
            {feature.description}
          </span>
        )}
      </div>
    </li>
  );
};
