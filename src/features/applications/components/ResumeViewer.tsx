import React, { useState } from "react";
import {
  FiFileText,
  FiExternalLink,
  FiDownload,
  FiX,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface ResumeViewerProps {
  resumeUrl?: string;
  applicantName?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  applicantLocation?: string;
  applicantHeadline?: string;
  applicantSkills?: string[];
  coverLetter?: string;
  variant?: "default" | "compact";
}

export const ResumeViewer: React.FC<ResumeViewerProps> = ({
  resumeUrl,
  applicantName = "Candidate",
  applicantEmail = "",
  applicantPhone = "",
  applicantLocation = "",
  applicantHeadline = "",
  applicantSkills = [],
  coverLetter = "",
  variant = "default",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isDirectUrl = Boolean(
    resumeUrl &&
      (resumeUrl.startsWith("http://") ||
        resumeUrl.startsWith("https://") ||
        resumeUrl.startsWith("data:") ||
        resumeUrl.startsWith("blob:"))
  );

  const handleView = () => {
    if (isDirectUrl && resumeUrl) {
      window.open(resumeUrl, "_blank", "noopener,noreferrer");
    } else {
      setIsModalOpen(true);
    }
  };

  const handleDownload = () => {
    if (isDirectUrl && resumeUrl) {
      const link = document.createElement("a");
      link.href = resumeUrl;
      link.target = "_blank";
      link.download = `${applicantName.replace(/\s+/g, "_")}_Resume`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${applicantName}'s resume...`);
    } else {
      // Generate formatted resume summary file for download
      const content = `====================================================
RESUME & CANDIDATE PROFILE SUMMARY
====================================================
Candidate Name : ${applicantName}
Email          : ${applicantEmail || "N/A"}
Phone          : ${applicantPhone || "N/A"}
Location       : ${applicantLocation || "N/A"}
Headline       : ${applicantHeadline || "Job Candidate"}
Skills         : ${applicantSkills.length > 0 ? applicantSkills.join(", ") : "N/A"}

----------------------------------------------------
COVER LETTER / STATEMENT
----------------------------------------------------
${coverLetter || "No cover letter attached."}

====================================================
JobBox Portal Verified Candidate Profile
====================================================`;

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = `${applicantName.replace(/\s+/g, "_")}_Resume.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${applicantName}'s candidate resume!`);
    }
  };

  return (
    <>
      {variant === "compact" ? (
        <div className="inline-flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleView}
            className="inline-flex items-center gap-1 rounded-lg border border-[#EAEFF7] bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-bold text-[#05264E] transition hover:bg-[#E8F0FE] hover:text-[#3C65F5] cursor-pointer shadow-2xs"
            title="View Candidate Resume"
          >
            <FiExternalLink className="text-[10px] shrink-0" />
            <span>View</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-[#EAEFF7] bg-white text-gray-700 transition hover:bg-gray-50 hover:text-[#3C65F5] cursor-pointer shadow-2xs"
            title="Download Candidate Resume"
          >
            <FiDownload className="text-xs shrink-0" />
          </button>
        </div>
      ) : (
        <div className="inline-flex items-center gap-2">
          <button
            onClick={handleView}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] px-3.5 py-2 text-xs font-bold text-[#05264E] transition hover:bg-[#E8F0FE] hover:text-[#3C65F5] cursor-pointer shadow-sm"
            title="View Candidate Resume"
          >
            <FiExternalLink className="text-xs shrink-0" />
            <span>View Resume</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAEFF7] bg-white px-3.5 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 hover:text-[#3C65F5] cursor-pointer shadow-sm"
            title="Download Candidate Resume"
          >
            <FiDownload className="text-xs shrink-0" />
            <span>Download</span>
          </button>
        </div>
      )}

      {/* Resume Viewer Modal Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#EAEFF7] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EAEFF7] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3C65F5] text-white font-extrabold text-xl shadow-md">
                  {applicantName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#05264E]">{applicantName}</h3>
                  <p className="text-xs font-semibold text-[#3C65F5]">{applicantHeadline || "Job Candidate"}</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Candidate Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-[#F8FAFC] p-4 border border-[#EAEFF7] mb-6">
              {applicantEmail && (
                <div className="flex items-center gap-2 text-xs font-medium text-[#05264E]">
                  <FiMail className="text-[#3C65F5]" /> <span>{applicantEmail}</span>
                </div>
              )}
              {applicantPhone && (
                <div className="flex items-center gap-2 text-xs font-medium text-[#05264E]">
                  <FiPhone className="text-[#3C65F5]" /> <span>{applicantPhone}</span>
                </div>
              )}
              {applicantLocation && (
                <div className="flex items-center gap-2 text-xs font-medium text-[#05264E]">
                  <FiMapPin className="text-[#3C65F5]" /> <span>{applicantLocation}</span>
                </div>
              )}
              {applicantSkills.length > 0 && (
                <div className="flex items-center gap-2 text-xs font-medium text-[#05264E]">
                  <FiBriefcase className="text-[#3C65F5]" /> <span>{applicantSkills.length} Verified Skills</span>
                </div>
              )}
            </div>

            {/* Resume Content Preview */}
            <div className="space-y-4">
              {applicantSkills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#05264E] uppercase tracking-wider mb-2">Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {applicantSkills.map((skill) => (
                      <span key={skill} className="rounded-xl bg-[#EBF2FF] px-3 py-1 text-xs font-bold text-[#3C65F5]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {coverLetter && (
                <div>
                  <h4 className="text-xs font-bold text-[#05264E] uppercase tracking-wider mb-2">Cover Letter / Statement</h4>
                  <div className="rounded-2xl bg-[#F8FAFC] p-4 text-xs text-[#66789C] leading-relaxed border border-[#EAEFF7] whitespace-pre-line">
                    {coverLetter}
                  </div>
                </div>
              )}

              {resumeUrl && !isDirectUrl && (
                <div>
                  <h4 className="text-xs font-bold text-[#05264E] uppercase tracking-wider mb-2">Resume Document</h4>
                  <div className="rounded-2xl bg-[#F8FAFC] p-4 text-xs font-semibold text-[#05264E] border border-[#EAEFF7] flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FiFileText className="text-[#3C65F5] text-lg" /> {resumeUrl}
                    </span>
                    <button
                      onClick={handleDownload}
                      className="text-xs font-bold text-[#3C65F5] hover:underline"
                    >
                      Download File
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-8 pt-4 border-t border-[#EAEFF7] flex items-center justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#254BD6] transition cursor-pointer"
              >
                <FiDownload /> Download Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResumeViewer;
