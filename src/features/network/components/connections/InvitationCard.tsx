import React from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import { useNetworkPaths } from "../../hooks/useNetworkPaths";
import { timeAgo } from "../../utils/format";
import {
  useAcceptInviteMutation,
  useIgnoreInviteMutation,
  useWithdrawInviteMutation,
} from "../../api/networkApi";
import type { InvitationDTO } from "../../types";

interface InvitationCardProps {
  invitation: InvitationDTO;
  /** "received" offers Accept/Ignore, "sent" offers Withdraw. */
  direction: "received" | "sent";
}

export const InvitationCard: React.FC<InvitationCardProps> = ({ invitation, direction }) => {
  const paths = useNetworkPaths();
  const person = invitation.user || ({} as InvitationDTO["user"]);

  const [accept, { isLoading: isAccepting }] = useAcceptInviteMutation();
  const [ignore, { isLoading: isIgnoring }] = useIgnoreInviteMutation();
  const [withdraw, { isLoading: isWithdrawing }] = useWithdrawInviteMutation();

  const [resolved, setResolved] = React.useState<string | null>(null);
  const busy = isAccepting || isIgnoring || isWithdrawing;

  const run = async (
    action: () => Promise<unknown>,
    doneLabel: string,
    failLabel: string
  ) => {
    try {
      await action();
      setResolved(doneLabel);
      toast.success(doneLabel);
    } catch (error: any) {
      toast.error(error?.data?.message || failLabel);
    }
  };

  if (resolved) {
    return (
      <li className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-[rgba(0,0,0,0.6)]">
        <span className="truncate">
          <span className="font-semibold text-[rgba(0,0,0,0.9)]">{person.fullName}</span> — {resolved}
        </span>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <Avatar
        src={person.profilePicture}
        name={person.fullName}
        email={person.email}
        size="lg"
        to={paths.profile(person.userId)}
      />

      <div className="min-w-0 flex-1">
        <Link
          to={paths.profile(person.userId)}
          className="block truncate text-sm font-semibold text-[rgba(0,0,0,0.9)] hover:text-[#0a66c2] hover:underline"
        >
          {person.fullName}
        </Link>
        <p className="truncate text-xs text-[rgba(0,0,0,0.6)]">{person.headline}</p>
        {invitation.message && (
          <p className="mt-1 rounded border border-[rgba(0,0,0,0.08)] bg-[#f4f2ee] px-2 py-1 text-xs italic text-[rgba(0,0,0,0.75)]">
            “{invitation.message}”
          </p>
        )}
        <p className="mt-0.5 text-[11px] text-[rgba(0,0,0,0.6)]">
          {timeAgo(invitation.sentAt)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {direction === "received" ? (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                run(
                  () => ignore(invitation.connectionId).unwrap(),
                  "Invitation ignored",
                  "Could not ignore the invitation."
                )
              }
              className="rounded-full px-3 py-1 text-sm font-semibold text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] disabled:opacity-60 enabled:cursor-pointer"
            >
              Ignore
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                run(
                  () => accept(invitation.connectionId).unwrap(),
                  "You're now connected",
                  "Could not accept the invitation."
                )
              }
              className="rounded-full border border-[#0a66c2] px-4 py-1 text-sm font-semibold text-[#0a66c2] transition hover:bg-[#0a66c2]/10 disabled:opacity-60 enabled:cursor-pointer"
            >
              Accept
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              run(
                () => withdraw(invitation.connectionId).unwrap(),
                "Invitation withdrawn",
                "Could not withdraw the invitation."
              )
            }
            className="rounded-full border border-[rgba(0,0,0,0.6)] px-3 py-1 text-sm font-semibold text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] disabled:opacity-60 enabled:cursor-pointer"
          >
            Withdraw
          </button>
        )}
      </div>
    </li>
  );
};

export default InvitationCard;
