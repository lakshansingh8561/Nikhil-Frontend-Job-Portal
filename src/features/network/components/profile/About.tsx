import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { CARD_CLASS } from "../common/Card";
import SeeMoreText from "../common/SeeMoreText";
import EditSectionModal from "./EditSectionModal";
import { useNetworkPaths } from "../../hooks/useNetworkPaths";
import type { PublicProfileDTO } from "../../types";

interface AboutProps {
  profile: PublicProfileDTO;
  editable: boolean;
}

export const About: React.FC<AboutProps> = ({ profile, editable }) => {
  const paths = useNetworkPaths();
  const [open, setOpen] = React.useState(false);

  if (!profile.bio && !editable) return null;

  return (
    <section className={`${CARD_CLASS} px-4 py-3`}>
      <header className="flex items-start justify-between gap-2">
        <h2 className="text-xl font-semibold text-[rgba(0,0,0,0.9)]">About</h2>
        {editable && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Edit about"
            className="rounded-full p-2 text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
          >
            <FiEdit2 className="text-lg" />
          </button>
        )}
      </header>

      {profile.bio ? (
        <div className="mt-1 text-sm">
          <SeeMoreText text={profile.bio} limit={400} hashtagBasePath={paths.feed} />
        </div>
      ) : (
        <p className="mt-1 text-sm text-[rgba(0,0,0,0.6)]">
          Add a summary so people know what you do and what you're looking for.
        </p>
      )}

      <EditSectionModal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit about"
        description="Tell people about your experience, strengths and what you're looking for."
        fields={[
          {
            name: "bio",
            label: "About",
            type: "textarea",
            rows: 10,
            maxLength: 2600,
            placeholder: "I'm a frontend engineer who…",
          },
        ]}
        initialValues={{ bio: profile.bio || "" }}
        toPayload={(values) => ({ bio: values.bio })}
      />
    </section>
  );
};

export default About;
