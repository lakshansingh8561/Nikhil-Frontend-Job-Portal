import React from "react";
import { FiFileText, FiImage, FiVideo } from "react-icons/fi";
import Avatar from "../common/Avatar";
import { CARD_CLASS } from "../common/Card";

interface ComposerTriggerProps {
  me?: { fullName?: string; profilePicture?: string; email?: string };
  onOpen: (preset?: "media" | "document") => void;
}

/** The "Start a post" bar that sits at the top of the feed. */
export const ComposerTrigger: React.FC<ComposerTriggerProps> = ({ me, onOpen }) => (
  <div className={`${CARD_CLASS} px-4 py-3`}>
    <div className="flex items-center gap-2">
      <Avatar src={me?.profilePicture} name={me?.fullName} email={me?.email} size="lg" />
      <button
        type="button"
        onClick={() => onOpen()}
        className="h-12 flex-1 rounded-full border border-[rgba(0,0,0,0.3)] px-4 text-left text-sm font-semibold text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
      >
        Start a post
      </button>
    </div>

    <div className="mt-1.5 flex items-center justify-around gap-1">
      <TriggerAction
        icon={<FiImage className="text-lg text-[#378fe9]" />}
        label="Photo"
        onClick={() => onOpen("media")}
      />
      <TriggerAction
        icon={<FiVideo className="text-lg text-[#5f9b41]" />}
        label="Video"
        onClick={() => onOpen("media")}
      />
      <TriggerAction
        icon={<FiFileText className="text-lg text-[#e06847]" />}
        label="Document"
        onClick={() => onOpen("document")}
      />
    </div>
  </div>
);

const TriggerAction: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-1 items-center justify-center gap-2 rounded px-2 py-2.5 text-sm font-semibold text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default ComposerTrigger;
