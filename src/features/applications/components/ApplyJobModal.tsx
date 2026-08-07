import React, { useState, useEffect } from "react";
import { FiX, FiSend, FiFileText, FiMessageSquare, FiCheckCircle, FiMail, FiArrowRight, FiBriefcase } from "react-icons/fi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { data: profile } = useGetProfileQuery();
  const [resume, setResume] = useState(initialResumeUrl || profile?.resume || "");
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applyJob, { isLoading }] = useApplyJobMutation();

  useEffect(() => {
    if (initialResumeUrl) {
      setResume(initialResumeUrl);
    } else if (profile?.resume) {
      setResume(profile.resume);
    }
  }, [initialResumeUrl, profile]);

  // Reset form & state when modal closes
  const handleClose = () => {
    setIsSubmitted(false);
    setCoverLetter("");
    onClose();
  };

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
      setIsSubmitted(true);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit application.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl transition-all transform scale-100">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#F8FAFC] text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer z-10"
        >
          <FiX className="text-xl" />
        </button>

        {isSubmitted ? (
          /* SUCCESS POPUP SCREEN */
          <div className="py-4 text-center space-y-6 animate-scaleUp">
            {/* Animated Glowing Badge */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-500/10 shadow-inner">
              <FiCheckCircle className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 rounded-full">
                Application Received
              </span>
              <h2 className="text-2xl font-black text-[#05264E]">
                You Have Applied Successfully! 🎉
              </h2>
              <p className="text-sm font-medium text-[#66789C]">
                Your application for <strong className="text-[#05264E]">{jobTitle}</strong> at{" "}
                <strong className="text-[#3C65F5]">{companyName}</strong> has been submitted.
              </p>
            </div>

            {/* Gmail Notice Box */}
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 text-left flex items-start gap-3.5 shadow-sm">
              <div className="flex-shrink-0 mt-0.5 p-2 rounded-xl bg-white text-emerald-600 shadow-xs">
                <FiMail className="h-5 w-5" />
              </div>
              <div className="text-xs space-y-1">
                <h4 className="font-bold text-[#05264E]">Gmail Confirmation Dispatched</h4>
                <p className="text-[#66789C] leading-relaxed">
                  A confirmation receipt has been sent to your registered Gmail address with job summary & tracking details.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  navigate("/job-seeker/applications");
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#254BD6] hover:shadow-lg transition cursor-pointer"
              >
                <FiBriefcase className="text-sm" />
                <span>Track My Applications</span>
                <FiArrowRight className="text-sm" />
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] px-6 py-3.5 text-xs font-bold text-[#05264E] hover:bg-gray-100 transition cursor-pointer"
              >
                Explore More Jobs
              </button>
            </div>
          </div>
        ) : (
          /* APPLICATION FORM SCREEN */
          <div>
            {/* Header */}
            <div className="border-b border-[#EAEFF7] pb-4 mb-6">
              <h2 className="text-xl font-bold text-[#05264E]">Apply for Position</h2>
              <p className="text-xs font-semibold text-[#3C65F5] mt-0.5">
                {jobTitle} <span className="text-gray-400">at</span> {companyName}
              </p>
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
                  rows={4}
                  placeholder="Write a brief pitch to the recruiter introducing yourself and why you're a great fit..."
                  className="w-full rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] p-3.5 text-sm font-medium text-[#05264E] outline-none focus:border-[#3C65F5] focus:bg-white transition"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-[#EAEFF7] pt-5">
                <button
                  type="button"
                  onClick={handleClose}
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
        )}
      </div>
    </div>
  );
};

export default ApplyJobModal;
