import { useState } from "react";
import { FiCode, FiPlus, FiX } from "react-icons/fi";
import type { UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";
import type { JobFormData } from "../validation/job.schema";

interface SkillsSectionProps {
  setValue: UseFormSetValue<JobFormData>;
  watch: UseFormWatch<JobFormData>;
  errors: FieldErrors<JobFormData>;
}

const suggestedSkills = [
  "React",
  "Node.js",
  "MongoDB",
  "TypeScript",
  "Express",
  "Redux",
  "Tailwind CSS",
  "Python",
  "Docker",
  "AWS",
];

export const SkillsSection = ({
  setValue,
  watch,
  errors,
}: SkillsSectionProps) => {
  const [skillInput, setSkillInput] = useState("");
  const selectedSkills = watch("skills") || [];

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!selectedSkills.includes(trimmed)) {
      const updated = [...selectedSkills, trimmed];
      setValue("skills", updated, { shouldValidate: true });
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = selectedSkills.filter((s) => s !== skillToRemove);
    setValue("skills", updated, { shouldValidate: true });
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100/80 shadow-xs">
          <FiCode className="text-lg" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Required Technical Skills</h3>
          <p className="text-xs text-slate-400 font-medium">Add key technologies, frameworks, and tools candidates need.</p>
        </div>
      </div>

      {/* Input box */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddSkill(skillInput);
            }
          }}
          placeholder="Type a skill (e.g. React) and press Enter..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs"
        />

        <button
          type="button"
          onClick={() => handleAddSkill(skillInput)}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-xs font-black text-white hover:brightness-110 shadow-md transition shrink-0 cursor-pointer"
        >
          <FiPlus className="text-base" /> Add Skill
        </button>
      </div>

      {errors.skills && (
        <p className="mb-4 text-xs font-bold text-rose-500">{errors.skills.message}</p>
      )}

      {/* Selected Skill Tags */}
      {selectedSkills.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2 pt-1">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 px-3.5 py-1.5 text-xs font-extrabold text-indigo-700 border border-indigo-200/80 shadow-xs"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-indigo-400 hover:text-rose-600 transition cursor-pointer"
                title="Remove skill"
              >
                <FiX />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Suggested Quick Add Skills */}
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Suggested Popular Skills:
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestedSkills.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => handleAddSkill(skill)}
                disabled={isSelected}
                className={`rounded-xl px-3 py-1 text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 hover:bg-white shadow-2xs"
                }`}
              >
                + {skill}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
