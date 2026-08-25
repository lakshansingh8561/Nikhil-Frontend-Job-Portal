import React from "react";
import Avatar from "../common/Avatar";
import Modal from "../common/Modal";
import { ReactionBadges } from "./ReactionPicker";
import { REACTIONS, reactionMeta, safeSocialProof } from "../../utils/reactions";
import { useGetPostReactionsQuery } from "../../api/networkApi";
import { useNetworkPaths } from "../../hooks/useNetworkPaths";
import { formatCount } from "../../utils/format";
import type { PostDTO, ReactionType } from "../../types";

interface ReactionsModalProps {
  post: PostDTO;
  open: boolean;
  onClose: () => void;
}

/** "Who reacted" dialog with a tab per reaction type, like LinkedIn. */
export const ReactionsModal: React.FC<ReactionsModalProps> = ({ post, open, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<ReactionType | "ALL">("ALL");
  const paths = useNetworkPaths();

  const { data, isFetching } = useGetPostReactionsQuery(post._id, { skip: !open });

  const proof = safeSocialProof(post.socialProof, post.reactionsCount);
  const reactors: any[] = Array.isArray(data?.reactions) ? data.reactions : [];

  const visible =
    activeTab === "ALL"
      ? reactors
      : reactors.filter((entry) => entry?.type === activeTab);

  const tabs = REACTIONS.filter((reaction) =>
    proof.breakdown.some((entry) => entry.type === reaction.key)
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      widthClass="max-w-[560px]"
      title={
        <span className="flex items-center gap-2">
          <ReactionBadges types={proof.topTypes} />
          <span>{formatCount(proof.total)}</span>
        </span>
      }
    >
      <div className="sticky top-0 z-10 flex items-center gap-1 overflow-x-auto border-b border-[rgba(0,0,0,0.08)] bg-white px-4 no-scrollbar">
        <TabButton
          active={activeTab === "ALL"}
          onClick={() => setActiveTab("ALL")}
          label={`All ${formatCount(proof.total)}`}
        />
        {tabs.map((reaction) => {
          const count = proof.breakdown.find((entry) => entry.type === reaction.key)?.count || 0;
          return (
            <TabButton
              key={reaction.key}
              active={activeTab === reaction.key}
              onClick={() => setActiveTab(reaction.key)}
              label={
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true">{reaction.emoji}</span>
                  {formatCount(count)}
                </span>
              }
            />
          );
        })}
      </div>

      <div className="divide-y divide-[rgba(0,0,0,0.08)] px-4">
        {isFetching && reactors.length === 0 && (
          <p className="py-8 text-center text-sm text-[rgba(0,0,0,0.6)]">Loading reactions…</p>
        )}

        {!isFetching && visible.length === 0 && (
          <p className="py-8 text-center text-sm text-[rgba(0,0,0,0.6)]">No reactions yet.</p>
        )}

        {visible.map((entry) => {
          const person = entry.user || entry.author || {};
          const meta = reactionMeta(entry.type);
          return (
            <div key={`${person.userId}-${entry.type}`} className="flex items-center gap-3 py-3">
              <div className="relative shrink-0">
                <Avatar
                  src={person.profilePicture}
                  name={person.fullName}
                  email={person.email}
                  size="lg"
                  to={person.userId ? paths.profile(person.userId) : undefined}
                />
                {meta && (
                  <span
                    style={{ backgroundColor: meta.badgeBg }}
                    className="absolute -bottom-0.5 -right-0.5 grid h-[18px] w-[18px] place-items-center rounded-full text-[10px] ring-1 ring-white"
                  >
                    <span aria-hidden="true" className="scale-[0.8]">
                      {meta.emoji}
                    </span>
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <a
                  href={person.userId ? paths.profile(person.userId) : "#"}
                  className="block truncate text-sm font-semibold text-[rgba(0,0,0,0.9)] hover:text-[#0a66c2] hover:underline"
                >
                  {person.fullName || "Member"}
                </a>
                <p className="truncate text-xs text-[rgba(0,0,0,0.6)]">{person.headline || ""}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  label: React.ReactNode;
}> = ({ active, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`shrink-0 border-b-2 px-3 py-3 text-sm font-semibold transition cursor-pointer ${
      active
        ? "border-[#0a66c2] text-[#0a66c2]"
        : "border-transparent text-[rgba(0,0,0,0.6)] hover:text-[rgba(0,0,0,0.9)]"
    }`}
  >
    {label}
  </button>
);

export default ReactionsModal;
