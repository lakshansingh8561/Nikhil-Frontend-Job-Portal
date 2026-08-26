import React, { useState } from "react";
import { FiUploadCloud, FiCheckCircle, FiX, FiFileText } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import toast from "react-hot-toast";
import { useParseResumeMutation, type ParsedResumeResponse } from "../../ai/api/aiApi";

interface ResumeParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyParsedData: (data: ParsedResumeResponse) => void;
}

export const ResumeParserModal: React.FC<ResumeParserModalProps> = ({
  isOpen,
  onClose,
  onApplyParsedData,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedResumeResponse | null>(null);
  const [parseResume, { isLoading }] = useParseResumeMutation();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
        toast.error("Please select a PDF file.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUploadAndParse = async () => {
    if (!file) {
      toast.error("Please upload a PDF resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await parseResume(formData).unwrap();
      if (response.success && response.data) {
        setParsedResult(response.data);
        toast.success("Resume parsed successfully!");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to parse resume.");
    }
  };

  const handleConfirmApply = () => {
    if (parsedResult) {
      onApplyParsedData(parsedResult);
      toast.success("Profile auto-filled with extracted data!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <HiSparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Resume Parser & Profile Auto-Fill</h2>
            <p className="text-sm text-slate-400">
              Upload your PDF resume and let our intelligent engine extract your skills, experience, and details.
            </p>
          </div>
        </div>

        {!parsedResult ? (
          /* Step 1: Upload Dropzone */
          <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/80 rounded-2xl p-8 text-center transition-all bg-slate-800/40">
              <input
                type="file"
                accept=".pdf"
                id="resume-upload-input"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="resume-upload-input"
                className="cursor-pointer flex flex-col items-center justify-center space-y-3"
              >
                <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full">
                  <FiUploadCloud className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-200">
                    {file ? file.name : "Click to upload or drag & drop PDF resume"}
                  </p>
                  <p className="text-xs text-slate-400">PDF up to 10MB</p>
                </div>
              </label>
            </div>

            {file && (
              <div className="flex items-center justify-between p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3">
                  <FiFileText className="w-6 h-6 text-indigo-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadAndParse}
                disabled={!file || isLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <>
                    <HiSparkles className="w-4 h-4 animate-spin" />
                    Parsing Resume...
                  </>
                ) : (
                  <>
                    <HiSparkles className="w-4 h-4" />
                    Extract Profile Data
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Extracted Preview & Confirm */
          <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 text-sm">
              <FiCheckCircle className="w-5 h-5 shrink-0" />
              <span>Extracted profile information from resume! Review details below before applying.</span>
            </div>

            {/* Extracted Headline & Summary */}
            <div className="space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Headline & Overview</h3>
              <p className="text-sm font-semibold text-white">{parsedResult.headline || "Specialist"}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{parsedResult.summary}</p>
            </div>

            {/* Extracted Skills */}
            <div className="space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Extracted Skills ({parsedResult.skills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {parsedResult.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Experience */}
            {parsedResult.experience && parsedResult.experience.length > 0 && (
              <div className="space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Extracted Work History</h3>
                <div className="space-y-2">
                  {parsedResult.experience.map((exp, idx) => (
                    <div key={idx} className="text-xs border-l-2 border-indigo-500 pl-3 py-1">
                      <p className="font-semibold text-white">{exp.title}</p>
                      <p className="text-slate-400">{exp.company}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setParsedResult(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm"
              >
                Upload Different File
              </button>
              <button
                type="button"
                onClick={handleConfirmApply}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm shadow-lg shadow-emerald-500/20"
              >
                Apply to My Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
