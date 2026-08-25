import React from "react";
import toast from "react-hot-toast";
import { FiCheck, FiClock, FiMessageSquare, FiUserPlus } from "react-icons/fi";
import {
  useAcceptInviteMutation,
  useSendInviteMutation,
} from "../../api/networkApi";
import type { ViewerConnectionState } from "../../types";

interface ConnectionButtonProps {
  userId: string;
  status?: ViewerConnectionState;
  /** Needed to accept an incoming invitation in place. */
  connectionId?: string;
  size?: "sm" | "md";
  variant?: "outline" | "solid";
  onChanged?: (next: ViewerConnectionState) => void;
  fullWidth?: boolean;
}

/**
 * One button, five states — mirrors LinkedIn: Connect, Pending, Accept,
 * Message (when already connected) and nothing at all on your own profile.
 */
export const ConnectionButton: React.FC<ConnectionButtonProps> = ({
  userId,
  status = "NONE",
  connectionId,
  size = "sm",
  variant = "outline",
  onChanged,
  fullWidth = false,
}) => {
  const [local, setLocal] = React.useState<ViewerConnectionState>(status);
  const [sendInvite, { isLoading: isSending }] = useSendInviteMutation();
  const [acceptInvite, { isLoading: isAccepting }] = useAcceptInviteMutation();

  React.useEffect(() => setLocal(status), [status]);

  if (local === "SELF") return null;

  const padding = size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm";
  const width = fullWidth ? "w-full justify-center" : "";

  const outline =
    "border border-[#0a66c2] text-[#0a66c2] hover:bg-[#0a66c2]/10 font-semibold";
  const solid = "bg-[#0a66c2] text-white hover:bg-[#004182] font-semibold";
  const muted =
    "border border-[rgba(0,0,0,0.6)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)] font-semibold";

  const base = `inline-flex items-center gap-1.5 rounded-full transition ${padding} ${width}`;

  const connect = async () => {
    setLocal("PENDING_OUTGOING");
    try {
      await sendInvite({ recipientId: userId }).unwrap();
      toast.success("Invitation sent");
      onChanged?.("PENDING_OUTGOING");
    } catch (error: any) {
      setLocal(status);
      toast.error(error?.data?.message || "Could not send the invitation.");
    }
  };

  const accept = async () => {
    if (!connectionId) return;
    setLocal("CONNECTED");
    try {
      await acceptInvite(connectionId).unwrap();
      toast.success("You're now connected");
      onChanged?.("CONNECTED");
    } catch (error: any) {
      setLocal(status);
      toast.error(error?.data?.message || "Could not accept the invitation.");
    }
  };

  if (local === "CONNECTED") {
    return (
      <span className={`${base} ${muted} cursor-default`}>
        <FiCheck /> Connected
      </span>
    );
  }

  if (local === "PENDING_OUTGOING") {
    return (
      <span className={`${base} ${muted} cursor-default`}>
        <FiClock /> Pending
      </span>
    );
  }

  if (local === "PENDING_INCOMING") {
    return connectionId ? (
      <button
        type="button"
        onClick={accept}
        disabled={isAccepting}
        className={`${base} ${solid} enabled:cursor-pointer disabled:opacity-60`}
      >
        <FiCheck /> Accept
      </button>
    ) : (
      <span className={`${base} ${muted} cursor-default`}>
        <FiMessageSquare /> Invited you
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={connect}
      disabled={isSending}
      className={`${base} ${variant === "solid" ? solid : outline} enabled:cursor-pointer disabled:opacity-60`}
    >
      <FiUserPlus /> Connect
    </button>
  );
};

export default ConnectionButton;
