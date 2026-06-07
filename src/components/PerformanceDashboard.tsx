import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PerformanceMetrics } from "../types";
import { 
  Gauge, 
  Activity, 
  ShieldCheck, 
  Code2, 
  FileCheck, 
  RefreshCw, 
  Cpu, 
  Bug,
  BadgeAlert
} from "lucide-react";

interface PerformanceDashboardProps {
  metrics: PerformanceMetrics;
}

export default function PerformanceDashboard({ metrics }: PerformanceDashboardProps) {
  const [activeFileIdx, setActiveFileIdx] = useState<number | null>(null);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [coverageSim, setCoverageSim] = useState(metrics.testCoverage);

  const getMetricColor = (val: number) => {
    if (val >= 80) return "text-emerald-600 stroke-emerald-500 bg-emerald-50";
    if (val >= 50) return "text-amber-600 stroke-amber-500 bg-amber-50";
    return "text-rose-600 stroke-rose-500 bg-rose-50";
  };

  const getComplexityBadge = (level: "Low" | "Medium" | "High") => {
    switch (level) {
      case "Low":
        return "bg-slate-50 border-slate-100 text-slate-700";
      case "Medium":
        return "bg-slate-50 border-slate-200 text-slate-800";
      case "High":
        return "bg-slate-100 border-slate-300 text-slate-900";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
        <h2 className="text-xs uppercase font-mono tracking-widest text-slate-400 flex items-center gap-2 font-bold">
          <Activity className="h-4 w-4 text-slate-900 animate-pulse" />
          Code Performance & Diagnostic Metrics
        </h2>
        
        <div className="flex items-center gap-2">
          {/* Simulation Toggle button */}
          <button
            onClick={() => setInteractiveMode(!interactiveMode)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all flex items-center gap-1 cursor-pointer ${
              interactiveMode 
                ? "bg-slate-900 border-slate-900 text-white" 
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>{interactiveMode ? "Simulating Live Sync..." : "Simulation Mode"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Dials & Gauge Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {/* Metric Card 1: Cleanliness/Complexity rating */}
        <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors duration-200">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-450 mb-3 font-semibold">
            Maintainability Index
          </p>
          <div className="relative h-20 w-20 flex items-center justify-center">
            {/* Custom SVG ring element */}
            <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${metrics.maintainabilityIndex}, 100` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={metrics.maintainabilityIndex >= 80 ? "text-slate-900" : "text-slate-500"}
                strokeWidth="2.5"
                strokeDasharray="82, 100"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-xl font-display font-bold text-slate-900">
              {metrics.maintainabilityIndex}
            </span>
          </div>
          <span className="text-[10px] text-slate-600 font-medium font-mono mt-2 flex items-center gap-0.5">
            <ShieldCheck className="h-3 w-3 text-slate-900" /> Healthy Rating
          </span>
        </div>

        {/* Metric Card 2: Cognitive Code Complexity */}
        <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors duration-200">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-450 mb-3 font-semibold">
            Complexity Level
          </p>
          <div className="relative h-20 w-20 flex items-center justify-center">
            <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${metrics.cognitiveComplexity}, 100` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-slate-900"
                strokeWidth="2.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-xl font-display font-bold text-slate-900">
              {metrics.cognitiveComplexity}%
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium font-mono mt-2">
            Lower is cleaner (Clean API)
          </span>
        </div>

        {/* Metric Card 3: Test Coverage */}
        <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors duration-200 relative">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-450 mb-3 font-semibold">
            Code Test Coverage
          </p>
          <div className="relative h-20 w-20 flex items-center justify-center">
            <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${coverageSim}, 100` }}
                transition={{ duration: 1 }}
                className="text-slate-900"
                strokeWidth="2.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-xl font-display font-bold text-slate-900">
              {coverageSim}%
            </span>
          </div>

          {/* Interactive controls */}
          {interactiveMode ? (
            <div className="mt-2 w-full flex flex-col items-center">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={coverageSim}
                onChange={(e) => setCoverageSim(Number(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900" 
              />
              <span className="text-[9px] font-mono text-slate-500 mt-1">Adjust to audit</span>
            </div>
          ) : (
            <span className="text-[10px] font-mono mt-2 font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-850">
              {coverageSim >= 50 ? "Satisfactory" : "Low coverage"}
            </span>
          )}
        </div>

        {/* Metric 4: Documentation Volume */}
        <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors duration-200">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-450 mb-3 font-semibold">
            Documentation ratio
          </p>
          <div className="relative h-20 w-20 flex items-center justify-center">
            <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${metrics.documentationRatio}, 100` }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="text-slate-900"
                strokeWidth="2.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-xl font-display font-bold text-slate-900">
              {metrics.documentationRatio}%
            </span>
          </div>
          <span className="text-[10px] text-slate-550 font-medium font-mono mt-2">
            Verified README structure
          </span>
        </div>
      </div>

      {/* In-depth File audits section */}
      <div>
        <h3 className="text-xs uppercase font-mono tracking-widest text-slate-450 mb-4 flex items-center gap-1.5 font-semibold">
          <Code2 className="h-3.5 w-3.5 text-slate-900" />
          Individual Repository Sample Files Audited
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.realTimeActiveAnalyses.map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveFileIdx(activeFileIdx === index ? null : index)}
              className={`border rounded-xl p-4 transition-all duration-250 text-left relative overflow-hidden cursor-pointer ${
                activeFileIdx === index
                  ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                  : "border-slate-200 bg-white hover:border-slate-400"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileCheck className="h-3.5 w-3.5 text-slate-600" />
                  {item.file}
                </span>
                <span className="text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                  {item.language}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 font-sans mt-3">
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                    Complexity Index
                  </div>
                  <span className={`inline-block px-2 py-0.5 mt-0.5 text-[9px] rounded border font-mono font-bold ${getComplexityBadge(item.complexity as "Low" | "Medium" | "High")}`}>
                    {item.complexity}
                  </span>
                </div>

                <div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                    Syntax Flags
                  </div>
                  <span className={`flex items-center gap-1 mt-0.5 text-[10px] font-mono font-bold ${
                    item.issueCount > 0 ? "text-slate-900" : "text-slate-500"
                  }`}>
                    {item.issueCount > 0 ? (
                      <>
                        <Bug className="h-3.5 w-3.5 text-slate-900 inline animate-bounce" /> {item.issueCount} flags
                      </>
                    ) : (
                      "Conformant"
                    )}
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {activeFileIdx === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-slate-200 mt-4 pt-3 text-[11px] text-slate-500 leading-normal"
                  >
                    <p className="font-mono font-bold text-slate-900 mb-1 flex items-center gap-1 text-xs">
                      Diagnostic recommendation:
                    </p>
                    {item.issueCount > 0 ? (
                      <span className="italic">
                        Complexity levels are moderate. Refactor logic branches to ensure optimal maintainability ratios. Add robust try/catch layers.
                      </span>
                    ) : (
                      <span className="text-slate-800 italic">
                        Clean logical flow. Conforms entirely with modern syntax and modular declarations. Zero warnings found.
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
