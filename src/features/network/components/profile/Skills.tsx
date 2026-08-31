import React from "react";
import { FiEdit2, FiPlus, FiX } from "react-icons/fi";
import { CARD_CLASS } from "../common/Card";
import EditSectionModal from "./EditSectionModal";
import type { PublicProfileDTO } from "../../types";

interface SkillsProps {
  profile: PublicProfileDTO;
  editable: boolean;
}

export const Skills: React.FC<SkillsProps> = ({ profile, editable }) => {
  const [open, setOpen] = React.useState(false);
  const skills = profile.skills || [];

  if (skills.length === 0 && !editable) return null;

  return (
    <section className={`${CARD_CLASS} px-4 py-3`}>
      <header className="flex items-start justify-between gap-2">
        <h2 className="text-xl font-semibold text-[rgba(0,0,0,0.9)]">Skills</h2>
        {editable && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Edit skills"
            className="rounded-full p-2 text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
          >
            {skills.length > 0 ? <FiEdit2 className="text-lg" /> : <FiPlus className="text-lg" />}
          </button>
        )}
      </header>

      {skills.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-[rgba(0,0,0,0.15)] bg-[#f4f2ee] px-3 py-1 text-sm font-medium text-[rgba(0,0,0,0.9)]"
            >
              {skill}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-[rgba(0,0,0,0.6)]">
          Add skills so recruiters can find you for the right roles.
        </p>
      )}

      <SkillsEditor
        open={open}
        onClose={() => setOpen(false)}
        initial={skills}
      />
    </section>
  );
};

/**
 * Chip-style editor: typing a comma or pressing Enter commits a skill, so the
 * list stays clean instead of relying on the user to format one long string.
 */
const SkillsEditor: React.FC<{
  open: boolean;
  onClose: () => void;
  initial: string[];
}> = ({ open, onClose, initial }) => {
  const [list, setList] = React.useState<string[]>(initial);
  const [draft, setDraft] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setList(initial);
      setDraft("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const commit = (raw: string) => {
    const parts = raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    setList((current) => {
      const merged = [...current];
      parts.forEach((part) => {
        if (!merged.some((item) => item.toLowerCase() === part.toLowerCase())) merged.push(part);
      });
      return merged.slice(0, 50);
    });
    setDraft("");
  };

  return (
    <EditSectionModal
      open={open}
      onClose={onClose}
      title="Edit skills"
      description="Up to 50 skills. Press Enter or type a comma to add one."
      fields={[]}
      initialValues={{}}
      toPayload={() => ({ skills: list })}
    >
      <div>
        <div className="flex flex-wrap gap-2">
          {list.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1 rounded-full border border-[rgba(0,0,0,0.15)] bg-[#f4f2ee] px-3 py-1 text-sm text-[rgba(0,0,0,0.9)]"
            >
              {skill}
              <button
                type="button"
                aria-label={`Remove ${skill}`}
                onClick={() => setList((current) => current.filter((item) => item !== skill))}
                className="text-[rgba(0,0,0,0.6)] transition hover:text-[#b24020] cursor-pointer"
              >
                <FiX />
              </button>
            </span>
          ))}
          {list.length === 0 && (
            <span className="text-sm text-[rgba(0,0,0,0.6)]">No skills yet.</span>
          )}
        </div>

        <input
          value={draft}
          onChange={(event) => {
            const value = event.target.value;
            if (value.includes(",")) commit(value);
            else setDraft(value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit(draft);
            }
            if (event.key === "Backspace" && draft === "" && list.length > 0) {
              setList((current) => current.slice(0, -1));
            }
          }}
          onBlur={() => commit(draft)}
          placeholder="Add a skill and press Enter"
          className="mt-3 w-full rounded border border-[rgba(0,0,0,0.3)] px-3 py-2 text-sm outline-none transition focus:border-[#3C65F5]"
        />
      </div>
    </EditSectionModal>
  );
};

export default Skills;
