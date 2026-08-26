import React, { useState } from "react";
import { FiCheck, FiAlertCircle, FiTrendingUp, FiRefreshCw } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { useAnalyzeMatchMutation, type ATSMatchResponse } from "../../ai/api/aiApi";

interface AIMatchScoreCardProps {
  jobId: string;
  jobData: {
    title: string;
    description: string;
    skills?: string[];
    requirements?: string;
  };
}

export const AIMatchScoreCard: React.FC<AIMatchScoreCardProps> = ({ jobId, jobData }) => {
  const [matchData, setMatchData] = useState<ATSMatchResponse | null>(null);
  const [analyzeMatch, { isLoading }] = useAnalyzeMatchMutation();

  const handleRunAnalysis = async () => {
    try {
      const response = await analyzeMatch({
        jobId,
        jobData,
      }).unwrap();
      if (response.success && response.data) {
        setMatchData(response.data);
      }
    } catch (err) {
      console.error("Match analysis failed:", err);
    }
  };

  const getMatchBadgeColor = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (percentage >= 65) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (percentage >= 45) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-rose-500/20 text-rose-400 border-rose-500/30";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-5 relative overflow-hidden">
      {/* Glow highlight background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-md">
            <HiSparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">AI ATS Match Analyzer</h3>
            <p className="text-xs text-slate-400">See how your resume & skills match this job</p>
          </div>
        </div>

        {matchData && (
          <button
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Re-analyze"
          >
            <FiRefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>

      {!matchData ? (
        <div className="text-center py-6 px-4 bg-slate-800/40 rounded-xl border border-slate-800/80 space-y-4">
          <p className="text-sm text-slate-300">
            Click analyze to compare your candidate profile against this job description and unlock ATS optimization tips.
          </p>
          <button
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 transition-all inline-flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <HiSparkles className="w-4 h-4 animate-spin" />
                Analyzing ATS Match...
              </>
            ) : (
              <>
                <HiSparkles className="w-4 h-4" />
                Analyze My Match
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Match Score Bar */}
          <div className="flex items-center justify-between p-4 bg-slate-800/80 rounded-xl border border-slate-700">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">ATS Match Fit</span>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold text-white">{matchData.matchPercentage}%</span>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full border ${getMatchBadgeColor(
                    matchData.matchPercentage
                  )}`}
                >
                  {matchData.verdict}
                </span>
              </div>
            </div>

            {/* Circular Progress Meter */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    matchData.matchPercentage >= 80
                      ? "text-emerald-400"
                      : matchData.matchPercentage >= 65
                        ? "text-blue-400"
                        : "text-amber-400"
                  }
                  strokeDasharray={`${matchData.matchPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>

          {/* Matched Skills */}
          {matchData.matchedSkills && matchData.matchedSkills.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <FiCheck className="w-4 h-4" /> Matched Skills ({matchData.matchedSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchData.matchedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-md text-xs font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing ATS Keywords */}
          {matchData.missingSkills && matchData.missingSkills.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <FiAlertCircle className="w-4 h-4" /> Missing Keywords to Add ({matchData.missingSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchData.missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md text-xs font-medium"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Recommendations */}
          {matchData.recommendations && matchData.recommendations.length > 0 && (
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                <FiTrendingUp className="w-4 h-4" /> How to Improve Fit
              </span>
              <ul className="space-y-1.5">
                {matchData.recommendations.map((tip, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-indigo-400 shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
