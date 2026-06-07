import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CareerCoach } from "../types";
import { 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  Bookmark, 
  CircleDot, 
  CheckCircle2, 
  Lightbulb, 
  GraduationCap
} from "lucide-react";

interface RoadmapViewProps {
  roadmap: CareerCoach["suggestedRoadmap"];
}

export default function RoadmapView({ roadmap }: RoadmapViewProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [activeStep, setActiveStep] = useState<number>(1);

  const toggleStep = (stepNo: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNo]: !prev[stepNo]
    }));
  };

  const totalSteps = roadmap.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const percentComplete = Math.round((completedCount / totalSteps) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white border border-slate-200 rounded-2xl p-6 overflow-hidden relative"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xs uppercase font-mono tracking-widest text-slate-400 mb-2 flex items-center gap-2 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
            Career Development Roadmap
          </h2>
          <p className="text-xs text-slate-500 font-mono uppercase">
            A strategic tech sequence based on verified user metrics
          </p>
        </div>

        {/* Dynamic Completion progress indicator */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
          <div className="relative h-10 w-10 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#E2E8F0" strokeWidth="3" />
              <motion.circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#0F172A"
                strokeWidth="3"
                strokeDasharray="100"
                strokeDashoffset={100 - percentComplete}
                strokeLinecap="round"
                transition={{ duration: 0.4 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-slate-900">
              {percentComplete}%
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-800 font-mono uppercase tracking-wider">
              Roadmap Progress
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {completedCount} of {totalSteps} milestones achieved
            </div>
          </div>
        </div>
      </div>

      {percentComplete === 100 && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 p-4 rounded-xl bg-slate-950 text-white flex items-center gap-3"
        >
          <Trophy className="h-5 w-5 text-yellow-500 shrink-0 animate-bounce" />
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-teal-400">Mastery Achieved!</h4>
            <p className="text-xs font-sans text-slate-300">Excellent work! You possess the theoretical foundations and skillset alignment to lock-in active recruitment.</p>
          </div>
        </motion.div>
      )}

      {/* Main Roadmap Steps timeline flow */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Step list selector */}
        <div className="md:col-span-4 space-y-2">
          {roadmap.map((milestone) => {
            const isCompleted = completedSteps[milestone.step];
            const isActive = activeStep === milestone.step;

            return (
              <button
                key={milestone.step}
                onClick={() => setActiveStep(milestone.step)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-slate-900 border-slate-900 text-white scale-[1.01]"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-6 w-6 rounded flex items-center justify-center font-mono text-[10px] font-bold ${
                    isActive 
                      ? "bg-white/10 text-white" 
                      : "bg-slate-100 text-slate-800"
                  }`}>
                    {milestone.step}
                  </div>
                  
                  <div>
                    <h3 className={`text-xs font-sans font-bold truncate max-w-[145px] md:max-w-none ${
                      isActive ? "text-white" : "text-slate-900"
                    }`}>
                      {milestone.title}
                    </h3>
                  </div>
                </div>

                <div onClick={(e) => {
                  e.stopPropagation();
                  toggleStep(milestone.step);
                }} className="cursor-pointer">
                  {isCompleted ? (
                    <CheckCircle2 className={`h-4.5 w-4.5 ${isActive ? "text-teal-300" : "text-slate-900"}`} />
                  ) : (
                    <div className={`h-4 w-4 rounded-full border ${
                      isActive ? "border-slate-500 hover:border-white" : "border-slate-350 hover:border-slate-800"
                    }`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Step view details card */}
        <div className="md:col-span-8 bg-slate-50 border border-slate-200 rounded-xl p-5 min-h-[200px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {roadmap.filter(m => m.step === activeStep).map((milestone) => {
              const isCompleted = completedSteps[milestone.step];

              return (
                <motion.div
                  key={milestone.step}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5 text-slate-700" /> Curriculum Step {milestone.step}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                      isCompleted ? "bg-slate-200 text-slate-800" : "bg-slate-900 text-white"
                    }`}>
                      {isCompleted ? "Completed" : "Action Needed"}
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-base text-slate-900">
                    {milestone.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {milestone.description}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">
                      Required Stack & Toolsets:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {milestone.tech.map((tool) => (
                        <span 
                          key={tool} 
                          className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-700 font-semibold"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <Lightbulb className="h-3.5 w-3.5 text-slate-500" />
                      <span>Learn via modular coding challenges</span>
                    </div>

                    <button
                      onClick={() => toggleStep(milestone.step)}
                      className="px-3.5 py-1.5 bg-slate-900 text-white rounded text-[10px] font-sans font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      {isCompleted ? "Achieved! Undo" : "Achieve Milestone"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
