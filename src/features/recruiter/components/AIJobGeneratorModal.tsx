import React, { useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import toast from "react-hot-toast";
import { useGenerateJobDescriptionMutation, type GeneratedJobResponse } from "../../ai/api/aiApi";

interface AIJobGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGeneratedJob: (job: GeneratedJobResponse) => void;
}

export const AIJobGeneratorModal: React.FC<AIJobGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyGeneratedJob,
}) => {
  const [title, setTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level");
  const [keySkills, setKeySkills] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [generatedJob, setGeneratedJob] = useState<GeneratedJobResponse | null>(null);

  const [generateJob, { isLoading }] = useGenerateJobDescriptionMutation();

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a Job Title.");
      return;
    }

    try {
      const response = await generateJob({
        title,
        experienceLevel,
        keySkills: keySkills ? keySkills.split(",").map((s) => s.trim()) : [],
        companyName,
      }).unwrap();

      if (response.success && response.data) {
        setGeneratedJob(response.data);
        toast.success("Job description generated successfully!");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to generate job description.");
    }
  };

  const handleApply = () => {
    if (generatedJob) {
      onApplyGeneratedJob(generatedJob);
      toast.success("Job form auto-filled with AI description!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <HiSparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Smart Job Description Generator</h2>
            <p className="text-sm text-slate-400">Generate structured descriptions, responsibilities, and skills in seconds</p>
          </div>
        </div>

        {!generatedJob ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Full Stack Engineer, UX Designer..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Seniority / Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Entry-Level / Junior">Entry-Level / Junior</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead / Management">Lead / Management</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TechCorp Solutions"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Key Skills (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, TypeScript, PostgreSQL"
                value={keySkills}
                onChange={(e) => setKeySkills(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <>
                    <HiSparkles className="w-4 h-4 animate-spin" />
                    Generating Job Content...
                  </>
                ) : (
                  <>
                    <HiSparkles className="w-4 h-4" />
                    Generate Job Post
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Overview</h3>
              <p className="text-sm text-slate-200 leading-relaxed">{generatedJob.overview}</p>
            </div>

            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Key Responsibilities</h3>
              <ul className="space-y-1.5">
                {generatedJob.responsibilities.map((r, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-indigo-400 shrink-0">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Requirements</h3>
              <ul className="space-y-1.5">
                {generatedJob.requirements.map((reqItem, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-indigo-400 shrink-0">•</span>
                    <span>{reqItem}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Suggested Skill Tags</h3>
              <div className="flex flex-wrap gap-2">
                {generatedJob.suggestedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setGeneratedJob(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm"
              >
                Regenerate
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <FiCheck className="w-4 h-4" /> Auto-Fill Job Form
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
