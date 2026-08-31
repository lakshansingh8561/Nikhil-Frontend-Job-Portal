import React from "react";
import toast from "react-hot-toast";
import Modal from "../common/Modal";
import { useUpdateMyNetworkProfileMutation } from "../../api/networkApi";

export type FieldType = "text" | "textarea" | "date" | "checkbox" | "select" | "tags";

export interface FieldDef {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  options?: string[];
  rows?: number;
  maxLength?: number;
  /** Hides the field when this predicate returns false for the current values. */
  visibleWhen?: (values: Record<string, any>) => boolean;
  half?: boolean;
}

interface EditSectionModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  fields: FieldDef[];
  initialValues: Record<string, any>;
  /** Maps the edited values onto the PATCH /network/me/profile body. */
  toPayload: (values: Record<string, any>) => Record<string, unknown>;
  onSaved?: () => void;
  /** Custom controls rendered below the declarative fields. */
  children?: React.ReactNode;
  widthClass?: string;
}

/**
 * One modal drives every editable profile section — the backend exposes a
 * single role-agnostic `PATCH /network/me/profile`, so each section only has to
 * describe its fields and how they map onto that body.
 */
export const EditSectionModal: React.FC<EditSectionModalProps> = ({
  open,
  onClose,
  title,
  description,
  fields,
  initialValues,
  toPayload,
  onSaved,
  children,
  widthClass,
}) => {
  const [values, setValues] = React.useState<Record<string, any>>(initialValues);
  const [updateProfile, { isLoading }] = useUpdateMyNetworkProfileMutation();

  React.useEffect(() => {
    if (open) setValues(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const setField = (name: string, value: any) =>
    setValues((current) => ({ ...current, [name]: value }));

  const save = async () => {
    try {
      await updateProfile(toPayload(values)).unwrap();
      toast.success("Profile updated");
      onSaved?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not save your changes.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      widthClass={widthClass}
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-1.5 text-sm font-semibold text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={isLoading}
            className="rounded-full bg-[#3C65F5] px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-[#2C52E0] disabled:opacity-60 enabled:cursor-pointer"
          >
            {isLoading ? "Saving…" : "Save"}
          </button>
        </div>
      }
    >
      {description && (
        <p className="mb-3 text-sm text-[rgba(0,0,0,0.6)]">{description}</p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields
          .filter((field) => !field.visibleWhen || field.visibleWhen(values))
          .map((field) => (
            <div
              key={field.name}
              className={field.half ? "sm:col-span-1" : "sm:col-span-2"}
            >
              <FieldControl
                field={field}
                value={values[field.name]}
                onChange={(value) => setField(field.name, value)}
              />
            </div>
          ))}
      </div>

      {children}
    </Modal>
  );
};

const inputClass =
  "w-full rounded border border-[rgba(0,0,0,0.3)] px-3 py-2 text-sm text-[rgba(0,0,0,0.9)] outline-none transition focus:border-[#3C65F5] focus:ring-1 focus:ring-[#3C65F5]";

const FieldControl: React.FC<{
  field: FieldDef;
  value: any;
  onChange: (value: any) => void;
}> = ({ field, value, onChange }) => {
  const label = (
    <span className="mb-1 block text-xs font-semibold text-[rgba(0,0,0,0.6)]">
      {field.label}
    </span>
  );

  if (field.type === "checkbox") {
    return (
      <label className="flex cursor-pointer items-center gap-2 text-sm text-[rgba(0,0,0,0.9)]">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 cursor-pointer accent-[#3C65F5]"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "textarea") {
    const text = String(value ?? "");
    return (
      <label className="block">
        {label}
        <textarea
          value={text}
          rows={field.rows || 5}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} resize-none`}
        />
        {field.maxLength && (
          <span className="mt-0.5 block text-right text-[11px] text-[rgba(0,0,0,0.6)]">
            {text.length}/{field.maxLength}
          </span>
        )}
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="block">
        {label}
        <select
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="">Select…</option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "tags") {
    const list: string[] = Array.isArray(value) ? value : [];
    return (
      <label className="block">
        {label}
        <input
          type="text"
          defaultValue={list.join(", ")}
          placeholder={field.placeholder || "React, Node.js, SQL"}
          onChange={(event) =>
            onChange(
              event.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            )
          }
          className={inputClass}
        />
        <span className="mt-0.5 block text-[11px] text-[rgba(0,0,0,0.6)]">
          Separate with commas
        </span>
      </label>
    );
  }

  return (
    <label className="block">
      {label}
      <input
        type={field.type === "date" ? "date" : "text"}
        value={String(value ?? "")}
        maxLength={field.maxLength}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </label>
  );
};

export default EditSectionModal;
