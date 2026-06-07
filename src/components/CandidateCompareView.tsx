import * as React from "react";
import { motion } from "motion/react";
import { DeveloperAnalysisResult } from "../types";
import { 
  ArrowLeft, 
  Users, 
  BarChart4, 
  Sparkles, 
  Activity, 
  Layers, 
  FileCheck,
  CheckCircle,
  XCircle,
  TrendingDown,
  ExternalLink
} from "lucide-react";

interface CandidateCompareViewProps {
  candidates: DeveloperAnalysisResult[];
  compareUsernames: string[];
  onBack: () => void;
  onSelectCandidate: (candidate: DeveloperAnalysisResult) => void;
  onClearComparison: () => void;
}

export default function CandidateCompareView({
  candidates,
  compareUsernames,
  onBack,
  onSelectCandidate,
  onClearComparison
}: CandidateCompareViewProps) {

  // Fetch candidate objects
  const comparativePool = React.useMemo(() => {
    return candidates.filter(c => compareUsernames.includes(c.profile.username))
      .map((c) => {
        const score = Math.round(
          (c.stats.activityScore * 0.35) + 
          (c.performanceMetrics.maintainabilityIndex * 0.35) + 
          (Math.min(100, c.stats.totalRepos * 1.5) * 0.15) +
          (c.performanceMetrics.testCoverage * 0.15)
        );
        return { ...c, calculatedRankScore: score };
      });
  }, [candidates, compareUsernames]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white mb-2 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Roster Directory
          </button>

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-md">
              <BarChart4 className="h-4.5 w-4.5 text-slate-950 font-black" />
            </div>
            <h2 className="font-display font-black text-xl text-white tracking-tight flex items-center gap-2.5">
              Candidate Comparison Arena
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-mono font-bold border border-white/5">
                {comparativePool.length} Selected
              </span>
            </h2>
          </div>
        </div>

        <button
          onClick={onClearComparison}
          className="px-4 py-2 border border-white/10 hover:border-white/20 bg-slate-900 text-slate-350 rounded-xl text-xs font-bold"
        >
          Clear Selection & Reset
        </button>
      </div>

      {comparativePool.length === 0 ? (
        <div className="py-20 text-center bg-slate-950/40 border border-white/10 rounded-3xl">
          <BarChart4 className="h-12 w-12 text-slate-650 mx-auto mb-4 animate-bounce" />
          <p className="text-xs text-slate-400 font-mono">Select candidate checkboxes from the central directory to compare details.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-xl text-xs font-mono font-bold border-none"
          >
            Open Candidate Pool
          </button>
        </div>
      ) : (
        /* Scollable row comparing arbitrary candidates beautifully */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparativePool.map((cand) => {
            return (
              <motion.div
                key={cand.profile.username}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-955/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-pink-500/20 transition-all shadow-xl"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />

                {/* Identity header card */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={cand.profile.avatarUrl}
                      alt={cand.profile.name}
                      className="h-12 w-12 rounded-xl object-cover border border-white/10 bg-slate-900"
                    />
                    <div>
                      <h4 className="font-display font-black text-xs text-white">
                        {cand.profile.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">@{cand.profile.username}</p>
                      <span className="inline-block mt-1 text-[8.5px] font-mono font-black uppercase text-pink-400">
                        {cand.stats.mostUsedLanguage} Developer
                      </span>
                    </div>
                  </div>

                  {/* Core metric slider indexes */}
                  <div className="bg-slate-900/60 p-4 border border-white/5 rounded-2xl space-y-3.5">
                    
                    {/* Overall Competency score */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-400 uppercase font-black">Competency Score</span>
                        <span className="text-pink-400 font-black">{cand.calculatedRankScore}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-500 rounded-full" style={{ width: `${cand.calculatedRankScore}%` }} />
                      </div>
                    </div>

                    {/* Test Coverage */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-400 uppercase">Test Coverage</span>
                        <span className="text-emerald-400 font-black">{cand.performanceMetrics.testCoverage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${cand.performanceMetrics.testCoverage}%` }} />
                      </div>
                    </div>

                    {/* Maintainability Index */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-400 uppercase">Maintainability Index</span>
                        <span className="text-cyan-400 font-bold">{cand.performanceMetrics.maintainabilityIndex}/100</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${cand.performanceMetrics.maintainabilityIndex}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Highlights Bullet arrays */}
                  <div className="space-y-3.5 py-2">
                    <div>
                      <span className="text-[9px] font-mono uppercase font-black text-slate-450 tracking-wider">Key Strengths</span>
                      <ul className="text-[10px] text-slate-300 space-y-1 mt-1.5">
                        {cand.aiAnalysis.strengths.slice(0, 2).map((st, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-emerald-400 shrink-0">✓</span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono uppercase font-black text-slate-450 tracking-wider">Alignment Needs</span>
                      <ul className="text-[10px] text-slate-350 space-y-1 mt-1.5">
                        {cand.aiAnalysis.weaknesses.slice(0, 2).map((wk, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-rose-400 shrink-0">✗</span>
                            <span>{wk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* View Details Profile Arrow Link */}
                <button
                  onClick={() => onSelectCandidate(cand)}
                  className="mt-4 w-full px-4 py-2.5 bg-white/5 hover:bg-pink-600 border border-white/15 hover:border-pink-500/30 text-slate-200 hover:text-white rounded-xl text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  View Details
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
