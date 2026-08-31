import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiExternalLink,
  FiFileText,
  FiGithub,
  FiGlobe,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiTwitter,
} from "react-icons/fi";
import NetworkShell from "../components/common/NetworkShell";
import { CARD_CLASS } from "../components/common/Card";
import { CardSkeleton } from "../components/common/Skeletons";
import ProfileHero from "../components/profile/ProfileHero";
import About from "../components/profile/About";
import ExperienceTimeline from "../components/profile/ExperienceTimeline";
import Education from "../components/profile/Education";
import Skills from "../components/profile/Skills";
import Activity from "../components/profile/Activity";
import PeopleYouMayKnowRail from "../components/rails/PeopleYouMayKnowRail";
import FooterRail from "../components/rails/FooterRail";
import { useNetworkPaths } from "../hooks/useNetworkPaths";
import { mediaUrl, roleLabel } from "../utils/format";
import {
  useGetMyNetworkProfileQuery,
  useGetPublicProfileQuery,
} from "../api/networkApi";
import type { PublicProfileDTO } from "../types";

const PublicProfile: React.FC = () => {
  const { userId = "" } = useParams<{ userId: string }>();
  const paths = useNetworkPaths();

  // `/network/profile` with no id shows the signed-in member's own profile.
  const targetId = userId || paths.currentUserId;
  const isOwnRoute = !userId || userId === paths.currentUserId;

  const publicQuery = useGetPublicProfileQuery(targetId, { skip: !targetId || isOwnRoute });
  const mineQuery = useGetMyNetworkProfileQuery(undefined, { skip: !isOwnRoute });
  const { data: viewer } = useGetMyNetworkProfileQuery();

  const profile = (isOwnRoute ? mineQuery.data : publicQuery.data) as
    | PublicProfileDTO
    | undefined;
  const isLoading = isOwnRoute ? mineQuery.isLoading : publicQuery.isLoading;
  const isError = isOwnRoute ? mineQuery.isError : publicQuery.isError;

  const me = {
    fullName: viewer?.fullName,
    profilePicture: viewer?.profilePicture,
    email: viewer?.email,
  };

  if (isLoading) {
    return (
      <NetworkShell variant="wide">
        <CardSkeleton className="h-64" />
        <CardSkeleton className="h-32" />
        <CardSkeleton className="h-48" />
      </NetworkShell>
    );
  }

  if (isError || !profile) {
    return (
      <NetworkShell variant="wide">
        <div className={`${CARD_CLASS} px-6 py-12 text-center`}>
          <h1 className="text-lg font-semibold text-[rgba(0,0,0,0.9)]">Profile not found</h1>
          <p className="mt-1 text-sm text-[rgba(0,0,0,0.6)]">
            This member may have deactivated their account.
          </p>
          <Link
            to={paths.directory}
            className="mt-4 inline-block rounded-full bg-[#3C65F5] px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-[#2C52E0]"
          >
            Browse members
          </Link>
        </div>
      </NetworkShell>
    );
  }

  const editable = Boolean(profile.isSelf || profile.connectionStatus === "SELF");

  return (
    <NetworkShell
      variant="wide"
      right={
        <>
          <ContactCard profile={profile} editable={editable} />
          <PeopleYouMayKnowRail />
          <FooterRail />
        </>
      }
    >
      <ProfileHero profile={profile} />
      <About profile={profile} editable={editable} />
      <ExperienceTimeline profile={profile} editable={editable} />
      <Education profile={profile} editable={editable} />
      <Skills profile={profile} editable={editable} />
      <Activity profile={profile} me={me} />
    </NetworkShell>
  );
};

/** Contact details and links — only shown to connections and to yourself. */
const ContactCard: React.FC<{ profile: PublicProfileDTO; editable: boolean }> = ({
  profile,
  editable,
}) => {
  const links = profile.socialLinks || {};
  const canSeeContact = editable || profile.connectionStatus === "CONNECTED";
  const resume = mediaUrl(profile.resumeUrl);

  const entries = [
    { key: "linkedin", icon: <FiLinkedin />, label: "LinkedIn", url: links.linkedin },
    { key: "github", icon: <FiGithub />, label: "GitHub", url: links.github },
    { key: "twitter", icon: <FiTwitter />, label: "Twitter", url: links.twitter },
    { key: "website", icon: <FiGlobe />, label: "Website", url: links.website },
    { key: "portfolio", icon: <FiExternalLink />, label: "Portfolio", url: links.portfolio },
  ].filter((entry) => Boolean(entry.url));

  if (!canSeeContact && entries.length === 0) return null;

  return (
    <div className={`${CARD_CLASS} px-4 py-3`}>
      <h2 className="text-base font-semibold text-[rgba(0,0,0,0.9)]">
        {roleLabel(profile.role)} details
      </h2>

      <ul className="mt-2 space-y-2 text-sm">
        {canSeeContact && profile.email && (
          <li className="flex items-center gap-2 text-[rgba(0,0,0,0.75)]">
            <FiMail className="shrink-0 text-[rgba(0,0,0,0.6)]" />
            <a href={`mailto:${profile.email}`} className="truncate hover:text-[#3C65F5] hover:underline">
              {profile.email}
            </a>
          </li>
        )}
        {canSeeContact && profile.phone && (
          <li className="flex items-center gap-2 text-[rgba(0,0,0,0.75)]">
            <FiPhone className="shrink-0 text-[rgba(0,0,0,0.6)]" />
            <span className="truncate">{profile.phone}</span>
          </li>
        )}
        {entries.map((entry) => (
          <li key={entry.key} className="flex items-center gap-2 text-[rgba(0,0,0,0.75)]">
            <span className="shrink-0 text-[rgba(0,0,0,0.6)]">{entry.icon}</span>
            <a
              href={entry.url as string}
              target="_blank"
              rel="noreferrer noopener"
              className="truncate hover:text-[#3C65F5] hover:underline"
            >
              {entry.label}
            </a>
          </li>
        ))}
        {canSeeContact && resume && (
          <li className="flex items-center gap-2 text-[rgba(0,0,0,0.75)]">
            <FiFileText className="shrink-0 text-[rgba(0,0,0,0.6)]" />
            <a
              href={resume}
              target="_blank"
              rel="noreferrer noopener"
              className="truncate font-semibold text-[#3C65F5] hover:underline"
            >
              View résumé
            </a>
          </li>
        )}
      </ul>

      {!canSeeContact && (
        <p className="mt-2 text-xs text-[rgba(0,0,0,0.6)]">
          Connect to see contact details.
        </p>
      )}
    </div>
  );
};

export default PublicProfile;
