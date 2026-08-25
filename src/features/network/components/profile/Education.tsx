import React from "react";
import toast from "react-hot-toast";
import { FiBookOpen, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { CARD_CLASS } from "../common/Card";
import EditSectionModal from "./EditSectionModal";
import type { FieldDef } from "./EditSectionModal";
import { useUpdateMyNetworkProfileMutation } from "../../api/networkApi";
import { monthYear } from "../../utils/format";
import type { EducationEntry, PublicProfileDTO } from "../../types";

const FIELDS: FieldDef[] = [
  { name: "institution", label: "School", placeholder: "University of Example" },
  { name: "degree", label: "Degree", placeholder: "B.Tech" , half: true },
  { name: "fieldOfStudy", label: "Field of study", placeholder: "Computer Science", half: true },
  { name: "currentlyStudying", label: "I'm still studying here", type: "checkbox", half: true },
  { name: "startDate", label: "Start date", type: "date", half: true },
  {
    name: "endDate",
    label: "End date",
    type: "date",
    half: true,
    visibleWhen: (values) => !values.currentlyStudying,
  },
];

interface EducationProps {
  profile: PublicProfileDTO;
  editable: boolean;
}

export const Education: React.FC<EducationProps> = ({ profile, editable }) => {
  const list = profile.education || [];
  const [adding, setAdding] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [updateProfile] = useUpdateMyNetworkProfileMutation();

  if (list.length === 0 && !editable) return null;

  const toIsoDay = (value?: string | null) =>
    value ? new Date(value).toISOString().slice(0, 10) : "";

  const buildList = (values: Record<string, any>, index: number | null): EducationEntry[] => {
    const entry: EducationEntry = {
      institution: String(values.institution || "").trim(),
      degree: String(values.degree || "").trim(),
      fieldOfStudy: values.fieldOfStudy || "",
      startDate: values.startDate,
      endDate: values.currentlyStudying ? null : values.endDate || null,
      currentlyStudying: Boolean(values.currentlyStudying),
    };

    const next = [...list];
    if (index === null) next.push(entry);
    else next[index] = entry;
    return next.map(({ _id, ...rest }) => rest as EducationEntry);
  };

  const remove = async (index: number) => {
    if (!window.confirm("Remove this education entry?")) return;
    try {
      await updateProfile({
        education: list
          .filter((_, position) => position !== index)
          .map(({ _id, ...rest }) => rest),
      }).unwrap();
      toast.success("Education removed");
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not remove the entry.");
    }
  };

  const editingEntry = editingIndex !== null ? list[editingIndex] : null;

  const rangeLabel = (entry: EducationEntry) => {
    const from = monthYear(entry.startDate);
    const to = entry.currentlyStudying || !entry.endDate ? "Present" : monthYear(entry.endDate);
    return from ? `${from} - ${to}` : "";
  };

  return (
    <section className={`${CARD_CLASS} px-4 py-3`}>
      <header className="flex items-start justify-between gap-2">
        <h2 className="text-xl font-semibold text-[rgba(0,0,0,0.9)]">Education</h2>
        {editable && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            aria-label="Add education"
            className="rounded-full p-2 text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
          >
            <FiPlus className="text-xl" />
          </button>
        )}
      </header>

      {list.length === 0 ? (
        <p className="mt-1 text-sm text-[rgba(0,0,0,0.6)]">
          Add where you studied to complete your profile.
        </p>
      ) : (
        <ul className="mt-1 divide-y divide-[rgba(0,0,0,0.08)]">
          {list.map((entry, index) => (
            <li key={entry._id || `${entry.institution}-${index}`} className="flex gap-3 py-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded bg-[#f4f2ee] text-xl text-[rgba(0,0,0,0.6)]">
                <FiBookOpen />
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold leading-tight text-[rgba(0,0,0,0.9)]">
                  {entry.institution}
                </h3>
                <p className="text-sm text-[rgba(0,0,0,0.9)]">
                  {[entry.degree, entry.fieldOfStudy].filter(Boolean).join(", ")}
                </p>
                <p className="text-xs text-[rgba(0,0,0,0.6)]">{rangeLabel(entry)}</p>
              </div>

              {editable && (
                <div className="flex shrink-0 items-start gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingIndex(index)}
                    aria-label="Edit education"
                    className="rounded-full p-2 text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label="Remove education"
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
        title="Add education"
        fields={FIELDS}
        initialValues={{
          institution: "",
          degree: "",
          fieldOfStudy: "",
          currentlyStudying: false,
          startDate: "",
          endDate: "",
        }}
        toPayload={(values) => ({ education: buildList(values, null) })}
      />

      <EditSectionModal
        open={editingIndex !== null}
        onClose={() => setEditingIndex(null)}
        title="Edit education"
        fields={FIELDS}
        initialValues={{
          institution: editingEntry?.institution || "",
          degree: editingEntry?.degree || "",
          fieldOfStudy: editingEntry?.fieldOfStudy || "",
          currentlyStudying: Boolean(editingEntry?.currentlyStudying),
          startDate: toIsoDay(editingEntry?.startDate),
          endDate: toIsoDay(editingEntry?.endDate),
        }}
        toPayload={(values) => ({ education: buildList(values, editingIndex) })}
      />
    </section>
  );
};

export default Education;
