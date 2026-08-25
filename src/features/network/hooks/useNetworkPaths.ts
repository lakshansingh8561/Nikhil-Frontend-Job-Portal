import { useMemo } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";

/**
 * The network section is mounted under both `/job-seeker` and `/recruiter`, so
 * every internal link has to be built from the signed-in user's role rather
 * than hardcoded. Admins get the job-seeker paths (read-only in practice).
 */
export const useNetworkPaths = () => {
  const user = useAppSelector((state) => state.auth.user);

  return useMemo(() => {
    const base = user?.role === "RECRUITER" ? "/recruiter" : "/job-seeker";
    const network = `${base}/network`;

    return {
      currentUserId: String(user?.id || ""),
      currentUserRole: user?.role || "JOB_SEEKER",
      base,
      network,
      feed: network,
      directory: `${network}/directory`,
      connections: `${network}/connections`,
      saved: `${network}/saved`,
      post: (postId: string) => `${network}/post/${postId}`,
      profile: (userId: string) => `${network}/profile/${userId}`,
      messages: `${base}/messages`,
    };
  }, [user?.id, user?.role]);
};
