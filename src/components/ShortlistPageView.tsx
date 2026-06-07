import * as React from "react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DeveloperAnalysisResult } from "../types";
import { 
  Users, 
  ArrowLeft, 
  Check, 
  X, 
  Mail, 
  Copy, 
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Award,
  ChevronRight,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  BarChart4
} from "lucide-react";

interface ShortlistPageViewProps {
  candidates: DeveloperAnalysisResult[];
  shortlistedUsernames: string[];
  onToggleShortlist: (username: string) => void;
  onSelectCandidate: (candidate: DeveloperAnalysisResult) => void;
  onGoBackRoster: () => void;
  selectedForComparison?: string[];
  onToggleComparison?: (username: string) => void;
  onGoToCompare?: () => void;
}

export default function ShortlistPageView({
  candidates,
  shortlistedUsernames,
  onToggleShortlist,
  onSelectCandidate,
  onGoBackRoster,
  selectedForComparison = [],
  onToggleComparison,
  onGoToCompare
}: ShortlistPageViewProps) {

  // List of shortlisted candidate objects
  const shortlistedCandidates = useMemo(() => {
    return candidates.filter(c => shortlistedUsernames.includes(c.profile.username))
      .map((c) => {
        const score = Math.round(
          (c.stats.activityScore * 0.35) + 
          (c.performanceMetrics.maintainabilityIndex * 0.35) + 
          (Math.min(100, c.stats.totalRepos * 1.5) * 0.15) +
          (c.performanceMetrics.testCoverage * 0.15)
        );
        return { ...c, calculatedRankScore: score };
      });
  }, [candidates, shortlistedUsernames]);

  // HR evaluation states mapped by candidate username: "none" | "selected" | "rejected"
  const [evaluationStates, setEvaluationStates] = useState<Record<string, "none" | "selected" | "rejected">>({});
  const [copiedEmailUser, setCopiedEmailUser] = useState<string | null>(null);

  const handleEvaluation = (username: string, state: "selected" | "rejected") => {
    setEvaluationStates(prev => ({
      ...prev,
      [username]: prev[username] === state ? "none" : state
    }));
  };

  const getRecipientEmail = (username: string) => {
    return `${username.toLowerCase()}@devscope.net`;
  };

  // Generate dynamic selected paragraph
  const getSelectedParagraph = (candidate: DeveloperAnalysisResult) => {
    const lang = candidate.stats.mostUsedLanguage;
    const score = Math.round(
      (candidate.stats.activityScore * 0.35) + 
      (candidate.performanceMetrics.maintainabilityIndex * 0.35) + 
      (Math.min(100, candidate.stats.totalRepos * 1.5) * 0.15) +
      (candidate.performanceMetrics.testCoverage * 0.15)
    );
    const strength = candidate.aiAnalysis.strengths?.[0] || `excellent expertise in modular systems styling.`;
    
    return `We are thrilled to officially select ${candidate.profile.name} (@${candidate.profile.username}) for this premium technical position. With an outstanding Competency Index of ${score}% and comprehensive masterclass proficiency in ${lang}, they have verified alignment with our structural roadmap needs. Our analytics verified their pristine codebase patterns—specifically highlighting their ${strength.toLowerCase().replace(/\.$/, "")}—which ensures they will rapidly integrate as a highly productive engineering leader on our desk.`;
  };

  // Generate dynamic rejected paragraph
  const getRejectedParagraph = (candidate: DeveloperAnalysisResult) => {
    const lang = candidate.stats.mostUsedLanguage;
    const weakness = candidate.aiAnalysis.weaknesses?.[0] || "broadening their automated code coverage configurations.";
    
    return `Thank you for your application to our sourcing pipelines, @${candidate.profile.username}. Although we appreciate your background and competency score in ${lang}, we are unfortunately unable to advance your profile at this time because we are prioritizing developers with established coverage configurations. We suggest dedicating attention to ${weakness.toLowerCase().replace(/\.$/, "")} in future repositories, and we sincerely look forward to keeping in touch for subsequent operational cycles on our talent desk.`;
  };

  const handleCopyText = (text: string, username: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmailUser(username);
    setTimeout(() => setCopiedEmailUser(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <button
            onClick={onGoBackRoster}
            className="group flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white mb-2 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to All Candidates Directory
          </button>

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
              <CheckCircle className="h-4.5 w-4.5 text-white" />
            </div>
            <h2 className="font-display font-black text-xl text-white tracking-tight">
              Recruiter Shortlist Board
            </h2>
          </div>
          <p className="text-[10px] text-emerald-400 font-mono uppercase font-black tracking-tight mt-1">
            * SHORTLIST PANEL • ACCEPTANCE & DEFECTION LOGISTICS CONTROL *
          </p>
        </div>

        {/* Action center for comparison on Shortlist board */}
        {selectedForComparison.length > 0 && onGoToCompare && (
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 self-center">
            <button
              onClick={onGoToCompare}
              className="px-4 py-2 clay-btn-amber text-[10.5px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer font-black"
            >
              <BarChart4 className="h-3.5 w-3.5" />
              Compare Selected ({selectedForComparison.length})
            </button>
          </div>
        )}
      </div>

      <div className="clay-card-pill p-6 mb-8 space-y-4">
        <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">
          Decisional Evaluation Instructions
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          This specialized space acts as an ultimate decision boardroom. Every candidate checked from the central directory is available here for granular review. You can evaluate their alignment by selecting **Approve Selection** or **Reject**. Choosing a state automatically writes and prepares customized professional description emails instantly!
        </p>
      </div>

      <div className="space-y-6">
        {shortlistedCandidates.length === 0 ? (
          <div className="py-16 text-center clay-card-dark rounded-3xl">
            <Users className="h-12 w-12 text-slate-650 mx-auto mb-3 animate-pulse" />
            <p className="text-xs text-slate-400 font-mono">Your shortlists board is currently vacant.</p>
            <button
              onClick={onGoBackRoster}
              className="mt-4 px-4 py-2.5 clay-btn-pink font-mono text-xs rounded-xl font-bold cursor-pointer transition-all"
            >
              Check All Candidates
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {shortlistedCandidates.map((candidate) => {
              const email = getRecipientEmail(candidate.profile.username);
              const score = candidate.calculatedRankScore;
              const currentEval = evaluationStates[candidate.profile.username] || "none";
              
              const isAccepted = currentEval === "selected";
              const isRejected = currentEval === "rejected";

              const generatedText = isAccepted 
                ? getSelectedParagraph(candidate)
                : isRejected 
                ? getRejectedParagraph(candidate)
                : "";

              const mailSubject = isAccepted
                ? `Wonderful News! DevScope Selection Confirmation`
                : `Application Status - DevScope Sourcing Audit`;

              const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(generatedText)}`;
              const isSelectedForComp = selectedForComparison.includes(candidate.profile.username);

              return (
                <div
                  key={candidate.profile.username}
                  className="clay-card-dark p-5 sm:p-6 transition-all space-y-5 relative"
                >
                  {/* Candidate Identity, Score and Arrow Link */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      
                      {/* Checkbox for side-by-side comparison */}
                      {onToggleComparison && (
                        <div className="shrink-0 flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={isSelectedForComp}
                            onChange={() => onToggleComparison(candidate.profile.username)}
                            className="h-4.5 w-4.5 bg-slate-950/85 border border-white/20 text-pink-500 rounded focus:ring-fuchsia-500 cursor-pointer accent-pink-600 transition-all"
                            title="Select to compare side-by-side"
                          />
                        </div>
                      )}

                      {/* Avatar with detail view link */}
                      <div 
                        onClick={() => onSelectCandidate(candidate)}
                        className="relative shrink-0 cursor-pointer group"
                      >
                        <img
                          src={candidate.profile.avatarUrl}
                          alt={candidate.profile.name}
                          className="h-12 w-12 rounded-xl object-cover border border-white/10 bg-slate-800 group-hover:border-pink-500/50 transition-all"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border border-slate-900" />
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 
                            onClick={() => onSelectCandidate(candidate)}
                            className="font-display font-black text-xs text-white hover:text-pink-400 transition-colors cursor-pointer"
                          >
                            {candidate.profile.name}
                          </h4>
                          <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-mono font-bold uppercase border border-indigo-500/20">
                            {candidate.stats.mostUsedLanguage}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                          @{candidate.profile.username} • {candidate.profile.company} • {candidate.profile.location}
                        </p>
                      </div>
                    </div>

                    {/* Competency rating & Profile link arrow (DONT CHANGE AS MANDATED) */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                      
                      {/* Competency rating values */}
                      <div className="flex flex-col items-start sm:items-end">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-450 font-black">
                          Competency
                        </span>
                        <span className="text-xs sm:text-sm font-display font-black text-pink-400 tracking-tight mt-0.5">
                          {score}%
                        </span>
                      </div>

                      {/* Detail deep link arrow */}
                      <div 
                        onClick={() => onSelectCandidate(candidate)}
                        className="h-7 w-7 rounded-full bg-white/5 hover:bg-pink-600 hover:text-white text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                        title="Open technical summary dashboard"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Accept & Reject Buttons Section */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-white/5">
                    <p className="text-[10.5px] text-slate-450 leading-relaxed max-w-sm">
                      Mark candidate evaluation status. Choosing an option drafts tailored feedback instant channels.
                    </p>

                    <div className="flex items-center gap-2">
                      {/* APPROVE SELECTION BUTTON */}
                      <button
                        onClick={() => handleEvaluation(candidate.profile.username, "selected")}
                        className={`flex-1 sm:flex-none px-4 py-2 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isAccepted
                            ? "clay-btn-emerald text-slate-950 font-black"
                            : "bg-slate-900/40 hover:bg-slate-900/90 border border-emerald-500/20 hover:border-emerald-500/50 text-emerald-300 rounded-xl"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve Selection
                      </button>

                      {/* REJECT (Cross) BUTTON */}
                      <button
                        onClick={() => handleEvaluation(candidate.profile.username, "rejected")}
                        className={`flex-1 sm:flex-none px-4 py-2 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isRejected
                            ? "clay-btn-pink text-slate-950 font-black"
                            : "bg-slate-900/40 hover:bg-slate-900/90 border border-rose-500/20 hover:border-rose-500/50 text-rose-300 rounded-xl"
                        }`}
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </button>

                      {/* Remove Shortlist trigger */}
                      <button
                        onClick={() => onToggleShortlist(candidate.profile.username)}
                        className="px-2.5 py-2 clay-btn-secondary text-xs font-bold font-mono text-slate-400 hover:text-white cursor-pointer"
                        title="Remove from shortlist board"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Decision Explanation Subpanel Overlay */}
                  <AnimatePresence>
                    {currentEval !== "none" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 mt-2 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5">
                              {isAccepted ? (
                                <span className="text-emerald-400">✓ Selection Rationale Paragraph</span>
                              ) : (
                                <span className="text-rose-400">✗ Defection Feedback Paragraph</span>
                              )}
                            </span>
                            <span className="text-[10px] text-pink-400 font-mono">
                              Email Attached
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
                            {generatedText}
                          </p>

                          {/* Email attachment and quick compose actions */}
                          <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-lg">
                            <div className="space-y-0.5">
                              <span className="text-[9px] text-slate-450 font-mono uppercase font-black block">Respected Candidate Mail</span>
                              <span className="text-xs text-emerald-300 font-mono font-bold">{email}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Copy Text Button */}
                              <button
                                onClick={() => handleCopyText(generatedText, candidate.profile.username)}
                                className="px-2.5 py-1.5 bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 rounded-lg text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                {copiedEmailUser === candidate.profile.username ? (
                                  <>Copied!</>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    Copy Text
                                  </>
                                )}
                              </button>

                              {/* Compose Mail via Mailto with address & body */}
                              <a
                                href={mailtoUrl}
                                className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-sans font-bold text-[10.5px] uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all shadow-md"
                              >
                                <Mail className="h-3 w-3" />
                                Send Email
                              </a>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
