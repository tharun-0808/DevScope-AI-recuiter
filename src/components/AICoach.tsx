import { motion } from "motion/react";
import { AIAnalysis, CareerCoach } from "../types";
import { ArrowRight, Lightbulb } from "lucide-react";

interface AICoachProps {
  aiAnalysis: AIAnalysis;
  coach: CareerCoach;
}

export default function AICoach({ aiAnalysis, coach }: AICoachProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* AI Intelligence Report Section - 7 Columns */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">AI Intelligence Report</h2>
          </div>

          {/* Overall feedback highlighted as a clean banner */}
          <div className="mb-6 p-4 bg-slate-50 border-l-4 border-slate-900 rounded-r-lg">
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">OVERVIEW STATUS</p>
            <p className="text-sm text-slate-800 font-sans leading-relaxed">
              {aiAnalysis.overallFeedback}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths mapping */}
            <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-emerald-500">
              <p className="text-xs text-emerald-600 font-bold mb-1 uppercase tracking-wider font-mono">STRENGTHS</p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {aiAnalysis.strengths.slice(0, 3).map((str, idx) => (
                  <li key={idx} className="list-disc list-inside truncate" title={str}>
                    {str}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps/Weaknesses mapping */}
            <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-amber-500">
              <p className="text-xs text-amber-600 font-bold mb-1 uppercase tracking-wider font-mono">DETECTED GAPS</p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {aiAnalysis.weaknesses.slice(0, 3).map((weak, idx) => (
                  <li key={idx} className="list-disc list-inside truncate" title={weak}>
                    {weak}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <Lightbulb className="h-3.5 w-3.5 text-slate-500" />
          <span>Feedback generated based on code languages & live analysis</span>
        </div>
      </motion.section>

      {/* Personalized Career Coach & roadmap actions - 5 Columns */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Career Strategy
            </h2>
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Goal Focus</span>
          </div>

          <div className="mb-6 p-4 bg-slate-900 rounded-xl text-white">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Alignment Role</span>
            <h3 className="font-sans font-bold text-base leading-tight mt-0.5">{coach.target}</h3>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Recommended Actions</span>
            <ul className="space-y-2.5">
              {coach.suggestions.slice(0, 3).map((sug, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs text-slate-700 leading-relaxed">
                  <span className="font-mono text-slate-400 mt-0.5 shrink-0">0{idx + 1}</span>
                  <p>{sug}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">Personal Evaluation Strategy</span>
          <span className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer">
            View Roadmap <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </motion.section>
    </div>
  );
}
