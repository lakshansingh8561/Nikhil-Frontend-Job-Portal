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
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#05264E] mb-6 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
        <FiCode className="text-[#3C65F5]" /> Required Technical Skills
      </h3>

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
          className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
        />

        <button
          type="button"
          onClick={() => handleAddSkill(skillInput)}
          className="flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-5 py-3 text-xs font-semibold text-white shadow-xs transition hover:bg-[#254BD6] shrink-0 cursor-pointer"
        >
          <FiPlus className="text-base" /> Add Skill
        </button>
      </div>

      {errors.skills && (
        <p className="mt-1 text-xs text-red-500 mb-3">{errors.skills.message}</p>
      )}

      {/* Selected Tags */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#EBF2FF] px-3 py-1.5 text-xs font-bold text-[#3C65F5] border border-blue-100"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="rounded-full p-0.5 hover:bg-blue-200 transition cursor-pointer"
              >
                <FiX className="text-xs" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Quick Suggestions */}
      <div>
        <p className="text-xs font-semibold text-[#66789C] mb-2">
          Popular Suggested Skills:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {suggestedSkills
            .filter((s) => !selectedSkills.includes(s))
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleAddSkill(s)}
                className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600 hover:bg-blue-50 hover:text-[#3C65F5] transition cursor-pointer"
              >
                + {s}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
