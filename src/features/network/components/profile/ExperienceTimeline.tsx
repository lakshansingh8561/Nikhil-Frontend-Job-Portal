import React from "react";
import toast from "react-hot-toast";
import { FiBriefcase, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { CARD_CLASS } from "../common/Card";
import EditSectionModal from "./EditSectionModal";
import type { FieldDef } from "./EditSectionModal";
import { useUpdateMyNetworkProfileMutation } from "../../api/networkApi";
import { dateRangeLabel } from "../../utils/format";
import type { ExperienceEntry, PublicProfileDTO } from "../../types";

const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
  "TEMPORARY",
];

const FIELDS: FieldDef[] = [
  { name: "designation", label: "Title", placeholder: "Frontend Engineer" },
  { name: "company", label: "Company", placeholder: "Acme Inc." },
  { name: "employmentType", label: "Employment type", type: "select", options: EMPLOYMENT_TYPES, half: true },
  { name: "currentlyWorking", label: "I currently work here", type: "checkbox", half: true },
  { name: "startDate", label: "Start date", type: "date", half: true },
  {
    name: "endDate",
    label: "End date",
    type: "date",
    half: true,
    visibleWhen: (values) => !values.currentlyWorking,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    rows: 5,
    maxLength: 2000,
    placeholder: "What you owned, shipped and improved.",
  },
];

interface ExperienceTimelineProps {
  profile: PublicProfileDTO;
  editable: boolean;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ profile, editable }) => {
  const list = profile.experienceList || [];
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [adding, setAdding] = React.useState(false);
  const [updateProfile] = useUpdateMyNetworkProfileMutation();

  if (list.length === 0 && !editable) return null;

  const toIsoDay = (value?: string | null) =>
    value ? new Date(value).toISOString().slice(0, 10) : "";

  const buildList = (values: Record<string, any>, index: number | null): ExperienceEntry[] => {
    const entry: ExperienceEntry = {
      company: String(values.company || "").trim(),
      designation: String(values.designation || "").trim(),
      employmentType: values.employmentType || "FULL_TIME",
      startDate: values.startDate,
      endDate: values.currentlyWorking ? null : values.endDate || null,
      currentlyWorking: Boolean(values.currentlyWorking),
      description: values.description || "",
    };

    const next = [...list];
    if (index === null) next.push(entry);
    else next[index] = entry;
    // The endpoint replaces the whole array, so strip the ids Mongo added.
    return next.map(({ _id, ...rest }) => rest as ExperienceEntry);
  };

  const remove = async (index: number) => {
    if (!window.confirm("Remove this position?")) return;
    try {
      await updateProfile({
        experience: list
          .filter((_, position) => position !== index)
          .map(({ _id, ...rest }) => rest),
      }).unwrap();
      toast.success("Position removed");
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not remove the position.");
    }
  };

  const editingEntry = editingIndex !== null ? list[editingIndex] : null;

  return (
    <section className={`${CARD_CLASS} px-4 py-3`}>
      <header className="flex items-start justify-between gap-2">
        <h2 className="text-xl font-semibold text-[rgba(0,0,0,0.9)]">Experience</h2>
        {editable && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            aria-label="Add position"
            className="rounded-full p-2 text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
          >
            <FiPlus className="text-xl" />
          </button>
        )}
      </header>

      {list.length === 0 ? (
        <p className="mt-1 text-sm text-[rgba(0,0,0,0.6)]">
          Add the roles you've held so people can see your background.
        </p>
      ) : (
        <ul className="mt-1 divide-y divide-[rgba(0,0,0,0.08)]">
          {list.map((entry, index) => (
            <li key={entry._id || `${entry.company}-${index}`} className="flex gap-3 py-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded bg-[#f4f2ee] text-xl text-[rgba(0,0,0,0.6)]">
                <FiBriefcase />
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold leading-tight text-[rgba(0,0,0,0.9)]">
                  {entry.designation}
                </h3>
                <p className="text-sm text-[rgba(0,0,0,0.9)]">
                  {entry.company}
                  {entry.employmentType && (
                    <span className="text-[rgba(0,0,0,0.6)]">
                      {" · "}
                      {entry.employmentType.replace(/_/g, " ").toLowerCase()}
                    </span>
                  )}
                </p>
                <p className="text-xs text-[rgba(0,0,0,0.6)]">
                  {dateRangeLabel(entry.startDate, entry.endDate, entry.currentlyWorking)}
                </p>
                {entry.description && (
                  <p className="mt-1.5 whitespace-pre-line text-sm text-[rgba(0,0,0,0.9)]">
                    {entry.description}
                  </p>
                )}
              </div>

              {editable && (
                <div className="flex shrink-0 items-start gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingIndex(index)}
                    aria-label="Edit position"
                    className="rounded-full p-2 text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label="Remove position"
                    className="rounded-full p-2 text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] hover:text-[#b24020] cursor-pointer"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <EditSectionModal
        open={adding}
        onClose={() => setAdding(false)}
        title="Add position"
        fields={FIELDS}
        initialValues={{
          designation: "",
          company: "",
          employmentType: "FULL_TIME",
          currentlyWorking: false,
          startDate: "",
          endDate: "",
          description: "",
        }}
        toPayload={(values) => ({ experience: buildList(values, null) })}
      />

      <EditSectionModal
        open={editingIndex !== null}
        onClose={() => setEditingIndex(null)}
        title="Edit position"
        fields={FIELDS}
        initialValues={{
          designation: editingEntry?.designation || "",
          company: editingEntry?.company || "",
          employmentType: editingEntry?.employmentType || "FULL_TIME",
          currentlyWorking: Boolean(editingEntry?.currentlyWorking),
          startDate: toIsoDay(editingEntry?.startDate),
          endDate: toIsoDay(editingEntry?.endDate),
          description: editingEntry?.description || "",
        }}
        toPayload={(values) => ({ experience: buildList(values, editingIndex) })}
      />
    </section>
  );
};

export default ExperienceTimeline;
