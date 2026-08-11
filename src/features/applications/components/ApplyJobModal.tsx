import React, { useState, useEffect, useRef } from "react";
import {
  FiX,
  FiSend,
  FiFileText,
  FiMessageSquare,
  FiCheckCircle,
  FiMail,
  FiArrowRight,
  FiBriefcase,
  FiUploadCloud,
  FiLoader,
  FiExternalLink,
} from "react-icons/fi";
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data: profile } = useGetProfileQuery();

  const [resume, setResume] = useState(initialResumeUrl || profile?.resume || "");
  const [coverLetter, setCoverLetter] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applyJob, { isLoading }] = useApplyJobMutation();

  useEffect(() => {
    if (initialResumeUrl) {
      setResume(initialResumeUrl);
    } else if (profile?.resume) {
      setResume(profile.resume);
    }
  }, [initialResumeUrl, profile]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate PDF / document file format
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast.error("Please select a valid PDF or Word document (.pdf, .doc, .docx).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File size exceeds 15MB limit.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading PDF resume to Cloudinary...");

    try {
      const token = localStorage.getItem("jobbox_accessToken");
      const formData = new FormData();
      formData.append("file", file);

      const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/v1/upload/resume`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.data?.url) {
        setResume(json.data.url);
        setUploadedFileName(file.name);
        toast.success("Resume uploaded successfully to Cloudinary!", { id: toastId });
      } else {
        toast.error(json.message || "Failed to upload resume to Cloudinary.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err?.message || "Resume upload failed.", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setCoverLetter("");
    setUploadedFileName("");
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resume || !resume.trim()) {
      toast.error("Please upload a PDF resume or provide a valid Resume URL.");
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
          disabled={isLoading || isUploading}
          className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#F8FAFC] text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer z-10"
        >
          <FiX className="text-xl" />
        </button>

        {isSubmitted ? (
          /* SUCCESS POPUP SCREEN */
          <div className="py-4 text-center space-y-6 animate-scaleUp">
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
              {/* Cloudinary PDF Upload Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#05264E] mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FiFileText className="text-[#3C65F5]" /> Resume File (PDF) <span className="text-red-500">*</span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Cloudinary Powered
                  </span>
                </label>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Drag & Drop / Upload Trigger Box */}
                <div
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={`group relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed transition cursor-pointer ${
                    isUploading
                      ? "border-blue-300 bg-blue-50/50"
                      : resume
                      ? "border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70"
                      : "border-blue-200 bg-[#F8FAFC] hover:border-[#3C65F5] hover:bg-blue-50/30"
                  }`}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center space-y-2 text-[#3C65F5]">
                      <FiLoader className="text-3xl animate-spin" />
                      <span className="text-xs font-bold">Uploading to Cloudinary...</span>
                    </div>
                  ) : resume ? (
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                        <FiCheckCircle className="text-2xl" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-[#05264E]">
                          {uploadedFileName || "PDF Resume Loaded"}
                        </p>
                        <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                          Cloudinary Upload Complete
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-[11px] font-bold text-[#3C65F5] underline group-hover:text-[#254BD6]">
                          Click to Change PDF
                        </span>
                        <a
                          href={resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-[#3C65F5]"
                        >
                          <span>Preview PDF</span>
                          <FiExternalLink />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5] group-hover:scale-110 transition">
                        <FiUploadCloud className="text-2xl" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-[#05264E]">
                          Click to Upload Resume PDF
                        </p>
                        <p className="text-[11px] text-[#66789C] mt-0.5">
                          Upload your PDF file directly to Cloudinary (Max 15MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Direct Resume URL Input (Optional / Editable Fallback) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Or Paste Direct Resume URL
                </label>
                <input
                  type="url"
                  value={resume}
                  onChange={(e) => {
                    setResume(e.target.value);
                    setUploadedFileName("");
                  }}
                  placeholder="https://res.cloudinary.com/.../your-resume.pdf"
                  className="w-full rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-xs font-medium text-[#05264E] outline-none focus:border-[#3C65F5] focus:bg-white transition"
                />
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
                  disabled={isLoading || isUploading}
                  className="rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] px-6 py-3 text-xs font-bold text-[#05264E] hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading || isUploading || !resume}
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
