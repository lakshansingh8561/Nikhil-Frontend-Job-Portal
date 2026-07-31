import React from "react";
import { FiFileText, FiExternalLink, FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";

interface ResumeViewerProps {
  resumeUrl?: string;
  applicantName?: string;
}

export const ResumeViewer: React.FC<ResumeViewerProps> = ({
  resumeUrl,
  applicantName = "Candidate",
}) => {
  const handleView = () => {
    if (!resumeUrl) {
      toast.error("Resume URL is not available.");
      return;
    }
    window.open(resumeUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    if (!resumeUrl) {
      toast.error("Resume file is not available for download.");
      return;
    }
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.target = "_blank";
    link.download = `${applicantName.replace(/\s+/g, "_")}_Resume`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!resumeUrl) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400">
        <FiFileText /> No Resume Attached
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={handleView}
        className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] px-3 py-1.5 text-xs font-bold text-[#05264E] transition hover:bg-[#E8F0FE] hover:text-[#3C65F5] cursor-pointer"
        title="View Resume in new tab"
      >
        <FiExternalLink className="text-xs" />
        <span>View Resume</span>
      </button>

      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAEFF7] bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:bg-gray-50 hover:text-[#05264E] cursor-pointer"
        title="Download Resume"
      >
        <FiDownload className="text-xs" />
        <span>Download</span>
      </button>
    </div>
  );
};

export default ResumeViewer;
