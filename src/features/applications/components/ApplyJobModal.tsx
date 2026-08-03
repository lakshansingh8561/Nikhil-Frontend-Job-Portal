import React, { useState, useEffect } from "react";
import { FiX, FiSend, FiFileText, FiMessageSquare } from "react-icons/fi";
import toast from "react-hot-toast";
import { useApplyJobMutation } from "../api/applicationApi";
import { useGetProfileQuery } from "../../jobSeeker/api/jobSeekerApi";

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle?: string;
  companyName?: string;
  initialResumeUrl?: string;
}

export const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  isOpen,
  onClose,
  jobId,
  jobTitle = "Job",
  companyName = "Company",
  initialResumeUrl = "",
}) => {
  const { data: profile } = useGetProfileQuery();
  const [resume, setResume] = useState(initialResumeUrl || profile?.resume || "");
  const [coverLetter, setCoverLetter] = useState("");
  const [applyJob, { isLoading }] = useApplyJobMutation();

  useEffect(() => {
    if (initialResumeUrl) {
      setResume(initialResumeUrl);
    } else if (profile?.resume) {
      setResume(profile.resume);
    }
  }, [initialResumeUrl, profile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resume || !resume.trim()) {
      toast.error("Please enter a valid Resume URL.");
      return;
    }

    try {
      await applyJob({
        jobId,
        resume: resume.trim(),
        coverLetter: coverLetter.trim() || undefined,
      }).unwrap();

      toast.success("Application submitted successfully!");
      setCoverLetter("");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit application.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAEFF7] pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#05264E]">Apply for Position</h2>
            <p className="text-xs font-semibold text-[#3C65F5] mt-0.5">
              {jobTitle} <span className="text-gray-400">at</span> {companyName}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8FAFC] text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Resume URL Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#05264E] mb-2 flex items-center gap-1.5">
              <FiFileText className="text-[#3C65F5]" /> Resume URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="https://drive.google.com/file/d/your-resume.pdf"
              required
              className="w-full rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] p-3.5 text-sm font-medium text-[#05264E] outline-none focus:border-[#3C65F5] focus:bg-white transition"
            />
            <p className="text-[11px] text-[#66789C] mt-1.5">
              Provide a direct URL to your PDF, Google Drive, or Cloudinary resume file.
            </p>
          </div>

          {/* Cover Letter Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#05264E] mb-2 flex items-center gap-1.5">
              <FiMessageSquare className="text-[#3C65F5]" /> Cover Letter (Optional)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
              placeholder="Write a brief pitch to the recruiter introducing yourself and why you're a great fit..."
              className="w-full rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] p-3.5 text-sm font-medium text-[#05264E] outline-none focus:border-[#3C65F5] focus:bg-white transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-[#EAEFF7] pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] px-6 py-3 text-xs font-bold text-[#05264E] hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-7 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#254BD6] hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FiSend className="text-sm" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal;
