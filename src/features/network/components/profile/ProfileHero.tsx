import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiBriefcase,
  FiCamera,
  FiEdit2,
  FiMapPin,
  FiMessageSquare,
  FiUserCheck,
  FiUserPlus,
} from "react-icons/fi";
import Avatar from "../common/Avatar";
import { CARD_CLASS } from "../common/Card";
import ConnectionButton from "../connections/ConnectionButton";
import EditSectionModal from "./EditSectionModal";
import { useNetworkPaths } from "../../hooks/useNetworkPaths";
import { useMediaUpload } from "../../hooks/useMediaUpload";
import { formatCount, locationLabel, mediaUrl } from "../../utils/format";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useUpdateMyNetworkProfileMutation,
} from "../../api/networkApi";
import type { PublicProfileDTO } from "../../types";

interface ProfileHeroProps {
  profile: PublicProfileDTO;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ profile }) => {
  const paths = useNetworkPaths();
  const [editOpen, setEditOpen] = React.useState(false);
  const [following, setFollowing] = React.useState(Boolean(profile.isFollowing));

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [updateProfile] = useUpdateMyNetworkProfileMutation();

  React.useEffect(() => setFollowing(Boolean(profile.isFollowing)), [profile.isFollowing]);

  const cover = mediaUrl(profile.coverPhoto);
  const place = locationLabel(profile.location);
  const isSelf = profile.isSelf || profile.connectionStatus === "SELF";

  const toggleFollow = async () => {
    const previous = following;
    setFollowing(!previous);
    try {
      if (previous) await unfollowUser(profile.userId).unwrap();
      else await followUser(profile.userId).unwrap();
    } catch (error: any) {
      setFollowing(previous);
      toast.error(error?.data?.message || "Could not update following.");
    }
  };

  // The chat feature is scoped to a job application (`POST /chat/conversations`
  // requires a jobId), so a profile "Message" button can only open the inbox.

  return (
    <section className={`${CARD_CLASS} overflow-hidden`}>
      <div className="relative">
        <div
          className="h-[134px] w-full bg-gradient-to-r from-[#a0b4b7] to-[#8aa5aa] bg-cover bg-center sm:h-[201px]"
          style={cover ? { backgroundImage: `url(${cover})` } : undefined}
        />
        {isSelf && (
          <ImagePickerButton
            className="absolute right-3 top-3"
            label="Change cover photo"
            onUploaded={(url) => updateProfile({ coverPhoto: url })}
          >
            <FiCamera />
          </ImagePickerButton>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="relative -mt-[52px] w-fit sm:-mt-[76px]">
          <Avatar
            src={profile.profilePicture}
            name={profile.fullName}
            email={profile.email}
            size="hero"
            ring
            className="!h-[104px] !w-[104px] sm:!h-[152px] sm:!w-[152px]"
          />
          {isSelf && (
            <ImagePickerButton
              className="absolute bottom-1 right-1"
              label="Change profile photo"
              onUploaded={(url) => updateProfile({ profilePicture: url })}
            >
              <FiCamera />
            </ImagePickerButton>
          )}
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold leading-tight text-[rgba(0,0,0,0.9)]">
              {profile.fullName}
            </h1>
            {profile.headline && (
              <p className="mt-0.5 text-base leading-snug text-[rgba(0,0,0,0.9)]">
                {profile.headline}
              </p>
            )}

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-[rgba(0,0,0,0.6)]">
              {place && (
                <span className="flex items-center gap-1">
                  <FiMapPin className="text-xs" /> {place}
                </span>
              )}
              {profile.currentCompany && (
                <span className="flex items-center gap-1">
                  <FiBriefcase className="text-xs" /> {profile.currentCompany}
                </span>
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
              <Link
                to={paths.connections}
                className="font-semibold text-[#0a66c2] hover:underline"
              >
                {formatCount(profile.connectionsCount)} connections
              </Link>
              <span className="text-[rgba(0,0,0,0.6)]">
                {formatCount(profile.followersCount)} followers
              </span>
              {!isSelf && profile.mutualConnectionsCount > 0 && (
                <span className="text-[rgba(0,0,0,0.6)]">
                  {profile.mutualConnectionsCount} mutual
                </span>
              )}
            </div>
          </div>

          {isSelf && (
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              aria-label="Edit intro"
              className="shrink-0 self-start rounded-full p-2 text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
            >
              <FiEdit2 className="text-xl" />
            </button>
          )}
        </div>

        {!isSelf && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ConnectionButton
              userId={profile.userId}
              status={profile.connectionStatus}
              size="md"
              variant="solid"
            />
            <Link
              to={paths.messages}
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.6)] px-4 py-1.5 text-sm font-semibold text-[rgba(0,0,0,0.75)] transition hover:bg-[rgba(0,0,0,0.08)]"
            >
              <FiMessageSquare /> Message
            </Link>
            <button
              type="button"
              onClick={toggleFollow}
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.6)] px-4 py-1.5 text-sm font-semibold text-[rgba(0,0,0,0.75)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
            >
              {following ? <FiUserCheck /> : <FiUserPlus />}
              {following ? "Following" : "Follow"}
            </button>
          </div>
        )}
      </div>

      <EditSectionModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit intro"
        fields={[
          { name: "firstName", label: "First name", half: true },
          { name: "lastName", label: "Last name", half: true },
          {
            name: "headline",
            label: "Headline",
            maxLength: 220,
            placeholder: "Senior Frontend Engineer at Acme",
          },
          { name: "city", label: "City", half: true },
          { name: "state", label: "State", half: true },
          { name: "country", label: "Country", half: true },
          { name: "currentCompany", label: "Current company", half: true },
          { name: "designation", label: "Job title", half: true },
        ]}
        initialValues={{
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          headline: profile.headline || "",
          city: profile.location?.city || "",
          state: profile.location?.state || "",
          country: profile.location?.country || "",
          currentCompany: profile.currentCompany || "",
          designation: profile.designation || "",
        }}
        toPayload={(values) => ({
          firstName: values.firstName,
          lastName: values.lastName,
          headline: values.headline,
          currentCompany: values.currentCompany,
          designation: values.designation,
          location: {
            city: values.city,
            state: values.state,
            country: values.country,
          },
        })}
      />
    </section>
  );
};

/**
 * Cover/profile photo picker. Uploads through the shared media hook (raw fetch,
 * because RTK Query forces a JSON content-type) and hands back the stored URL.
 */
const ImagePickerButton: React.FC<{
  onUploaded: (url: string) => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}> = ({ onUploaded, label, className = "", children }) => {
  const media = useMediaUpload();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = React.useState(false);

  const pick = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      media.reset();
      media.addFiles([files[0]]);
      const { media: uploaded } = await media.uploadAll();
      const url = uploaded?.[0]?.url;
      if (!url) throw new Error("upload failed");
      onUploaded(url);
      toast.success("Photo updated");
    } catch {
      toast.error("Could not upload that image.");
    } finally {
      media.reset();
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => pick(event.target.files)}
      />
      <button
        type="button"
        aria-label={label}
        title={label}
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className={`grid h-9 w-9 place-items-center rounded-full bg-white text-[#0a66c2] shadow-md ring-1 ring-[rgba(0,0,0,0.1)] transition hover:bg-[#eef3f8] disabled:opacity-60 enabled:cursor-pointer ${className}`}
      >
        {busy ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0a66c2] border-t-transparent" />
        ) : (
          children
        )}
      </button>
    </>
  );
};

export default ProfileHero;
