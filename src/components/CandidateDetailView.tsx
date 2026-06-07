import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DeveloperAnalysisResult, ResumeAnalysisResult } from "../types";
import { apiUrl, readErrorMessage } from "../api";
import { 
  ArrowLeft, 
  User2, 
  Wrench, 
  Cpu, 
  Activity, 
  Milestone, 
  CheckCircle2, 
  Globe, 
  Building, 
  MapPin, 
  Users, 
  Award,
  Zap,
  Lightbulb,
  ShieldCheck,
  Code,
  Bug,
  GraduationCap,
  Trophy,
  UploadCloud,
  AlertCircle,
  Sparkles,
  RefreshCw,
  FileText,
  Check,
  X
} from "lucide-react";

interface CandidateDetailViewProps {
  candidate: DeveloperAnalysisResult;
  onBackToShortlist: () => void;
}

export default function CandidateDetailView({ 
  candidate, 
  onBackToShortlist 
}: CandidateDetailViewProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "skills" | "coach" | "performance" | "resume" | "insights">("profile");
  
  // Recruiter Insights state
  const [insights, setInsights] = useState<any | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState<boolean>(false);
  const [insightsError, setInsightsError] = useState<string>("");
  const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);

  const getAvatarFallback = (name: string) => {
    const initials = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("")
      .slice(0, 2) || "U";
    const svg = `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"128\" height=\"128\"><rect width=\"100%\" height=\"100%\" fill=\"#312e81\"/><text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"system-ui, sans-serif\" font-size=\"56\" fill=\"#fff\">${initials}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  // Auto load existing insights when tab changes
  React.useEffect(() => {
    if (activeTab === "insights" && candidate.profile.username) {
      const fetchExistingInsights = async () => {
        setIsLoadingInsights(true);
        setInsightsError("");
        try {
          const res = await fetch(apiUrl(`/api/candidates/${encodeURIComponent(candidate.profile.username)}/recruiter-insights`));
          if (res.ok) {
            const data = await res.json();
            setInsights(data);
          } else {
            // Not generated yet, keep insights null so can show trigger button
            setInsights(null);
          }
        } catch (err: any) {
          console.warn("Error fetching insights:", err);
          setInsightsError("Unable to load recruiter insights. Please make sure the DevScope server is running.");
        } finally {
          setIsLoadingInsights(false);
        }
      };
      fetchExistingInsights();
    }
  }, [activeTab, candidate.profile.username]);

  const generateRecruiterInsights = async () => {
    setIsGeneratingInsights(true);
    setInsightsError("");
    try {
      const res = await fetch(apiUrl(`/api/candidates/${encodeURIComponent(candidate.profile.username)}/recruiter-insights`), {
        method: "POST"
      });
      if (!res.ok) {
        const errorText = await readErrorMessage(res, "Failed to generate recruiter intelligence report.");
        throw new Error(errorText);
      }
      const data = await res.json();
      setInsights(data);
    } catch (err: any) {
      setInsightsError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // Resume Analysis states
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string>("");
  const [isAnalyzingResume, setIsAnalyzingResume] = useState<boolean>(false);
  const [resumeAnalysisError, setResumeAnalysisError] = useState<string>("");
  const [resumeAnalysisResult, setResumeAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<string>("");

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
    setResumeAnalysisError("");
    setResumeAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultStr = event.target?.result as string;
      setResumeBase64(resultStr);
    };
    reader.onerror = () => {
      setResumeAnalysisError("Failed to parse the file structure.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    // Check if txt or pdf
    if (!file.name.toLowerCase().endsWith(".pdf") && !file.name.toLowerCase().endsWith(".txt") && !file.name.toLowerCase().endsWith(".md")) {
      setResumeAnalysisError("Please upload a .pdf, .txt, or .md file.");
      return;
    }

    setResumeFile(file);
    setResumeAnalysisError("");
    setResumeAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultStr = event.target?.result as string;
      setResumeBase64(resultStr);
    };
    reader.onerror = () => {
      setResumeAnalysisError("Failed to parse the file structure.");
    };
    reader.readAsDataURL(file);
  };

  const runResumeAnalysis = async () => {
    if (!resumeBase64 || !resumeFile) {
      setResumeAnalysisError("Please attach a valid PDF or Text document first.");
      return;
    }

    setIsAnalyzingResume(true);
    setResumeAnalysisError("");
    
    const statuses = [
      "Accessing Recruiter Intelligence Core...",
      "Extracting Resume Credentials from PDF...",
      "Mapping Structural Engineering Claims...",
      "Cross-referencing GitHub Code Repositories...",
      "Formulating Risk & Skill Alignment Report..."
    ];

    let statusIdx = 0;
    setAnalysisStatus(statuses[0]);
    const interval = setInterval(() => {
      if (statusIdx < statuses.length - 1) {
        statusIdx += 1;
        setAnalysisStatus(statuses[statusIdx]);
      }
    }, 1200);

    try {
      const response = await fetch(apiUrl("/api/resume/analyze"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubSkills: candidate.skills,
          resumeBase64: resumeBase64,
          fileName: resumeFile.name
        })
      });

      clearInterval(interval);

      if (!response.ok) {
        const errorText = await readErrorMessage(response, "Alignment verification request failed.");
        throw new Error(errorText);
      }

      const data = await response.json();
      setResumeAnalysisResult(data);
    } catch (err: any) {
      clearInterval(interval);
      setResumeAnalysisError(err.message || "Failed to audit resume alignment.");
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  // Roadmap states
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [activeStep, setActiveStep] = useState<number>(1);
  const toggleStep = (stepNo: number) => {
    setCompletedSteps(prev => ({ ...prev, [stepNo]: !prev[stepNo] }));
  };
  const totalSteps = candidate.careerCoach.suggestedRoadmap.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const percentComplete = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  // Diagnostics states
  const [coverageSim, setCoverageSim] = useState(candidate.performanceMetrics.testCoverage);
  const [activeFileIdx, setActiveFileIdx] = useState<number | null>(null);

  // Sorting skills just in case
  const sortedSkills = [...candidate.skills].sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 relative">
      
      {/* Decorative localized space dust glowing colors */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-64 h-64 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <button
            onClick={onBackToShortlist}
            className="group flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors bg-transparent border-none p-0 mb-3 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Roster
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-black text-white leading-none tracking-tight">
              Applicant <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">Telemetry Profile</span>
            </h1>
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase animate-pulse">
              Linked Active
            </span>
          </div>
        </div>

        {/* Global info indicators */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
          <img 
            src={candidate.profile.avatarUrl || getAvatarFallback(candidate.profile.name)} 
            alt="" 
            className="h-10 w-10 rounded-xl object-cover border border-white/10 shrink-0"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.onerror = null;
              img.src = getAvatarFallback(candidate.profile.name);
            }}
          />
          <div className="text-left">
            <h4 className="text-xs font-bold text-white leading-none">{candidate.profile.name}</h4>
            <p className="text-[10px] text-slate-400 font-mono mt-1">@{candidate.profile.username}</p>
          </div>
        </div>
      </div>

      {/* Grid: Left Column navigation controller & Right Column detail display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: THE CONTROLLER BUTTONS PANEL */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 space-y-2">
            <p className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase px-2 mb-3">
              TELEMETRY MODULES
            </p>

            {/* Tab 1: Profile Matrix */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border cursor-pointer transition-all ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-pink-600 via-fuchsia-600 to-rose-600 text-white border-pink-500 shadow-lg shadow-fuchsia-600/20"
                  : "bg-slate-900/60 hover:bg-slate-900 text-slate-300 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <User2 className={`h-4.5 w-4.5 ${activeTab === "profile" ? "text-yellow-200 fill-yellow-200 animate-bounce" : "text-fuchsia-400"}`} />
                <div>
                  <h4 className="text-xs font-bold leading-none">01. Profile Matrix</h4>
                  <p className="text-[9px] text-slate-450 mt-1 font-mono uppercase">Executive Biography</p>
                </div>
              </div>
              <Zap className={`h-3 w-3 ${activeTab === "profile" ? "text-yellow-100" : "text-slate-500"}`} />
            </motion.button>

            {/* Tab 2: Skills Visualizer */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("skills")}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border cursor-pointer transition-all ${
                activeTab === "skills"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20"
                  : "bg-slate-900/60 hover:bg-slate-900 text-slate-300 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <Wrench className={`h-4.5 w-4.5 ${activeTab === "skills" ? "text-white fill-blue-300 animate-pulse" : "text-indigo-400"}`} />
                <div>
                  <h4 className="text-xs font-bold leading-none">02. Skills Graph</h4>
                  <p className="text-[9px] text-slate-450 mt-1 font-mono uppercase">T-shaped Capability</p>
                </div>
              </div>
              <Zap className={`h-3 w-3 ${activeTab === "skills" ? "text-indigo-200" : "text-slate-500"}`} />
            </motion.button>

            {/* Tab 3: AI Intelligence assessment */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("coach")}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border cursor-pointer transition-all ${
                activeTab === "coach"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-500 shadow-lg shadow-amber-500/20"
                  : "bg-slate-900/60 hover:bg-slate-900 text-slate-300 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <Cpu className={`h-4.5 w-4.5 ${activeTab === "coach" ? "text-yellow-250 animate-spin" : "text-amber-400"}`} style={{ animationDuration: "5s" }} />
                <div>
                  <h4 className="text-xs font-bold leading-none">03. AI Assessment</h4>
                  <p className="text-[9px] text-slate-450 mt-1 font-mono uppercase">Target Suitability</p>
                </div>
              </div>
              <Zap className={`h-3 w-3 ${activeTab === "coach" ? "text-yellow-200" : "text-slate-500"}`} />
            </motion.button>

            {/* Tab 4: Performance diagnostics */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("performance")}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border cursor-pointer transition-all ${
                activeTab === "performance"
                  ? "bg-gradient-to-r from-cyan-600 to-teal-500 text-white border-cyan-500 shadow-lg shadow-cyan-600/20"
                  : "bg-slate-900/60 hover:bg-slate-900 text-slate-300 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity className={`h-4.5 w-4.5 ${activeTab === "performance" ? "text-cyan-200 animate-pulse" : "text-cyan-400"}`} />
                <div>
                  <h4 className="text-xs font-bold leading-none">04. Code Diagnostics</h4>
                  <p className="text-[9px] text-slate-450 mt-1 font-mono uppercase">Complexity & Quality</p>
                </div>
              </div>
              <Zap className={`h-3 w-3 ${activeTab === "performance" ? "text-cyan-200" : "text-slate-500"}`} />
            </motion.button>

            {/* Tab 5: Resume Analyzer */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("resume")}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border cursor-pointer transition-all ${
                activeTab === "resume"
                  ? "bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500 text-white border-fuchsia-500 shadow-lg shadow-fuchsia-600/20"
                  : "bg-slate-900/60 hover:bg-slate-900 text-slate-300 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className={`h-4.5 w-4.5 ${activeTab === "resume" ? "text-yellow-200 animate-bounce" : "text-pink-400"}`} />
                <div>
                  <h4 className="text-xs font-bold leading-none">05. Resume Analyzer</h4>
                  <p className="text-[9px] text-slate-450 mt-1 font-mono uppercase">Compare Credentials</p>
                </div>
              </div>
              <Zap className={`h-3 w-3 ${activeTab === "resume" ? "text-yellow-200" : "text-slate-500"}`} />
            </motion.button>

            {/* Tab 6: Recruiter Insights */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("insights")}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border cursor-pointer transition-all ${
                activeTab === "insights"
                  ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white border-violet-500 shadow-lg shadow-violet-600/20"
                  : "bg-slate-900/60 hover:bg-slate-900 text-slate-300 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <Award className={`h-4.5 w-4.5 ${activeTab === "insights" ? "text-yellow-200 fill-emerald-300" : "text-violet-400"}`} />
                <div>
                  <h4 className="text-xs font-bold leading-none">06. Recruiter Insights</h4>
                  <p className="text-[9px] text-slate-450 mt-1 font-mono uppercase">ScoutAI Executive Audit</p>
                </div>
              </div>
              <Zap className={`h-3 w-3 ${activeTab === "insights" ? "text-yellow-200" : "text-slate-500"}`} />
            </motion.button>
          </div>

          {/* Quick Stats banner inside controller left column */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-white/5 rounded-3xl p-5 text-left relative overflow-hidden">
            <h4 className="text-[10px] font-mono tracking-widest text-slate-450 uppercase mb-3">
              QUICK SCORE METRIC
            </h4>
            
            <div className="flex items-end justify-between border-b border-white/5 pb-2.5 mb-2.5">
              <span className="text-xs text-slate-400">Primary Technology:</span>
              <span className="text-sm font-bold text-pink-400 font-mono tracking-wider">{candidate.stats.mostUsedLanguage}</span>
            </div>

            <div className="flex items-end justify-between">
              <span className="text-xs text-slate-400">Assessed Competency:</span>
              <span className="text-base font-black text-white font-display">{candidate.stats.activityScore || 85}%</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL WORKSPACE CONTENT */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {/* SUB-PANEL 1: PROFILE MATRIX VIEW */}
            {activeTab === "profile" && (
              <motion.div
                key="profile-sub"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 text-left relative"
              >
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-sm font-mono tracking-wider text-slate-400 uppercase font-black flex items-center gap-1.5">
                    <User2 className="h-4.5 w-4.5 text-fuchsia-400" /> Executive Biography & Stats
                  </h3>
                  <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold">
                    MATRIX MODULE
                  </span>
                </div>

                {/* Identity header inside file card */}
                <div className="flex flex-col sm:flex-row items-center gap-5 bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                  <img
                    src={candidate.profile.avatarUrl || getAvatarFallback(candidate.profile.name)}
                    alt=""
                    className="h-16 w-16 rounded-2xl object-cover border border-white/10 shrink-0 bg-slate-800"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.onerror = null;
                      img.src = getAvatarFallback(candidate.profile.name);
                    }}
                  />
                  <div className="text-center sm:text-left space-y-1">
                    <h2 className="text-lg font-display font-black text-white">{candidate.profile.name}</h2>
                    <p className="text-xs text-pink-400 font-mono font-bold">@{candidate.profile.username}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-mono">
                      {candidate.profile.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-500" /> {candidate.profile.location}
                        </span>
                      )}
                      {candidate.profile.company && (
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-slate-500" /> {candidate.profile.company}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio text block */}
                <div className="bg-slate-900/60 p-4 rounded-2xl border-l-4 border-fuchsia-500 italic text-xs text-slate-350 leading-relaxed font-sans">
                  " {candidate.profile.bio || "Systems alignment and dynamic programming developer."} "
                </div>

                {/* Detailed repo list stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-1">
                    <p className="text-[10px] text-slate-450 font-mono uppercase font-black">Public Repositories</p>
                    <h3 className="text-2xl font-display font-black text-white">{candidate.stats.totalRepos}</h3>
                  </div>

                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-1">
                    <p className="text-[10px] text-slate-450 font-mono uppercase font-black">Stars Generated</p>
                    <h3 className="text-2xl font-display font-black text-white">{candidate.stats.totalStars}</h3>
                  </div>

                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-1">
                    <p className="text-[10px] text-slate-450 font-mono uppercase font-black">Most Used Language</p>
                    <h3 className="text-2xl font-display font-black text-indigo-400">{candidate.stats.mostUsedLanguage}</h3>
                  </div>

                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-1">
                    <p className="text-[10px] text-slate-450 font-mono uppercase font-black">Most Starred Repo</p>
                    <h3 className="text-sm font-mono font-bold text-white truncate py-1.5" title={candidate.stats.mostStarredRepo}>
                      {candidate.stats.mostStarredRepo || "None"}
                    </h3>
                  </div>
                </div>

                {/* Performance progress meter */}
                <div className="p-4.5 bg-slate-950/80 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Activity Index Metric</span>
                    <span className="text-xs font-mono font-bold text-pink-400">{candidate.stats.activityScore || 85}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${candidate.stats.activityScore || 85}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-2">
                    <span>{candidate.profile.followers || 0} followers</span>
                    <span>Synchronized Live</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUB-PANEL 6: RESUME ANALYZER MODULE */}
            {activeTab === "resume" && (
              <motion.div
                key="resume-sub"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 text-left relative overflow-hidden"
              >
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-sm font-mono tracking-wider text-slate-400 uppercase font-black flex items-center gap-1.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-pink-450 animate-pulse" /> Resume & GitHub Alignment Audit
                  </h3>
                  <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono font-bold">
                    VERIFICATION ENGINE
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Upload the candidate's PDF or TXT resume to run a deep strategic validation comparing resume claims against actual mined open-source GitHub coding footprints. This detects missing skills, unverified competencies, and unlisted "hidden gems" automatically.
                </p>

                {/* Drop Zone Area */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="group relative border border-dashed border-white/10 hover:border-pink-500/40 rounded-2xl p-6 sm:p-10 text-center transition-all bg-white/[0.01] hover:bg-white/[0.02] cursor-pointer flex flex-col items-center justify-center gap-3"
                >
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.txt,.md"
                    className="hidden"
                    onChange={handleResumeChange}
                  />
                  <label htmlFor="resume" className="cursor-pointer flex flex-col items-center justify-center gap-3 w-full h-full">
                    <div className="p-4 bg-white/5 rounded-full border border-white/10 group-hover:bg-pink-500/10 group-hover:border-pink-500/30 transition-all">
                      <UploadCloud className="h-8 w-8 text-slate-400 group-hover:text-pink-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-sans font-black text-white">
                        {resumeFile ? resumeFile.name : "Drag & drop CV/resume or click to browse"}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">
                        Accepts PDF or Text (.pdf, .txt, .md) formats • Max size 15MB
                      </p>
                    </div>
                  </label>
                  
                  {resumeFile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setResumeFile(null);
                        setResumeBase64("");
                        setResumeAnalysisResult(null);
                        setResumeAnalysisError("");
                      }}
                      className="absolute top-3 right-3 p-1.5 bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 border border-white/10 rounded-lg text-slate-400 hover:text-red-400 text-[10px] font-mono cursor-pointer flex items-center gap-1 transition-all"
                    >
                      <X className="h-3 w-3" /> Clear file
                    </button>
                  )}
                </div>

                {resumeAnalysisError && (
                  <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
                    <AlertCircle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
                    <p>{resumeAnalysisError}</p>
                  </div>
                )}

                {/* Audit trigger buttons */}
                {resumeFile && !resumeAnalysisResult && !isAnalyzingResume && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={runResumeAnalysis}
                    className="w-full py-3.5 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-rose-500 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer border-none shadow-lg shadow-fuchsia-600/10 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-4 w-4 animate-pulse text-yellow-200" /> Verify Sourcing Alignment Match
                  </motion.button>
                )}

                {/* Loading State with Animated Telemetry */}
                {isAnalyzingResume && (
                  <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl space-y-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCw className="h-5 w-5 text-pink-500 animate-spin" />
                      <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
                        {analysisStatus || "Analyzing credentials..."}
                      </h4>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 animate-[pulse_1.5s_infinite] w-3/4 rounded-full" />
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono italic">
                      Cross-referencing GitHub repository parameters in real-time, please hold...
                    </p>
                  </div>
                )}

                {/* High Fidelity Verification Report Output */}
                {resumeAnalysisResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 pt-2"
                  >
                    
                    {/* Gauge alignment card */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center p-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-white/5 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-[50px] rounded-full pointer-events-none" />
                      
                      {/* Score circle */}
                      <div className="md:col-span-4 flex flex-col items-center justify-center py-2 border-r border-white/5 md:pr-5">
                        <div className="relative h-24 w-24 flex items-center justify-center">
                          <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                            <circle
                              cx="18"
                              cy="18"
                              r="16"
                              fill="none"
                              stroke="url(#pinkGradient)"
                              strokeWidth="3.2"
                              strokeDasharray="100"
                              strokeDashoffset={100 - resumeAnalysisResult.matchScore}
                              strokeLinecap="round"
                            />
                            <defs>
                              <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ec4899" />
                                <stop offset="100%" stopColor="#f43f5e" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <span className="text-xl font-display font-black text-white">
                            {resumeAnalysisResult.matchScore}%
                          </span>
                        </div>
                        <p className="text-[9px] font-mono uppercase tracking-wider text-slate-400 mt-2 font-bold text-center">
                          Alignment Index
                        </p>
                      </div>

                      {/* Diagnostic summary text */}
                      <div className="md:col-span-8 space-y-2">
                        <h4 className="text-xs font-sans font-black text-pink-400 uppercase tracking-wide flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 animate-pulse" /> High Precision Audit Generated
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {resumeAnalysisResult.detailedGapAnalysis}
                        </p>
                        {resumeAnalysisResult.offlineMode && (
                          <span className="inline-block text-[8.5px] bg-slate-500/10 text-slate-405 border border-white/5 px-2 py-0.5 rounded font-mono uppercase mt-1">
                            Simulated Assessment Verification
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Claims Comparer columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Left: Resume claims */}
                      <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl space-y-3">
                        <h5 className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider border-b border-white/5 pb-1.5 flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-slate-405" /> RESUME DECLARED CLAIMS
                        </h5>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {resumeAnalysisResult.resumeSkills.map((sk: string) => (
                            <span key={sk} className="px-2.5 py-1 bg-white/[0.02] border border-white/5 rounded-lg text-slate-200 text-xs font-sans font-medium flex items-center gap-1">
                              <span className="h-1 w-1 bg-slate-500 rounded-full" /> {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: GitHub Telemetry */}
                      <div className="p-4 bg-slate-900/60 border border-white/5 rounded-xl space-y-3">
                        <h5 className="text-[9px] font-mono text-pink-400 uppercase font-bold tracking-wider border-b border-white/5 pb-1.5 flex items-center gap-1.5">
                          <Code className="h-3.5 w-3.5 text-pink-400" /> GITHUB CORES VERIFIED
                        </h5>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {resumeAnalysisResult.githubSkills.map((sk: string) => (
                            <span key={sk} className="px-2.5 py-1 bg-pink-500/5 border border-pink-500/15 rounded-lg text-pink-300 text-xs font-sans font-bold flex items-center gap-1">
                              <span className="h-1.5 w-1.5 bg-pink-400 rounded-full animate-pulse" /> {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Critical gaps & Hidden Gems grids */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Left: Critical Gaps */}
                      <div className="p-4 bg-red-950/10 border border-red-500/10 rounded-xl space-y-3">
                        <h5 className="text-[9px] font-mono text-red-400 uppercase font-bold tracking-wider flex items-center gap-1.5 border-b border-red-500/10 pb-2">
                          <X className="h-4 w-4 bg-red-500/10 text-red-500 rounded-full p-0.5 shrink-0" /> UNVERIFIED CLAIMS ON GITHUB (GAPS)
                        </h5>
                        {resumeAnalysisResult.missingOnGithub.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {resumeAnalysisResult.missingOnGithub.map((sk: string) => (
                              <span key={sk} className="px-2.5 py-1 bg-red-500/5 border border-red-500/10 rounded-lg text-red-300 text-[10.5px] font-mono">
                                {sk}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] italic text-slate-500">Every single claimed resume skill is corroborated by public GitHub metrics. Solid representation!</p>
                        )}
                        <p className="text-[9.5px] text-slate-450 leading-relaxed pt-1.5 font-mono">
                          Recruitment Notice: Core files contain no visible references corroborating these credentials. Proceed with specific code test matrices.
                        </p>
                      </div>

                      {/* Right: Hidden Gems */}
                      <div className="p-4 bg-teal-950/10 border border-teal-500/10 rounded-xl space-y-3">
                        <h5 className="text-[9px] font-mono text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1.5 border-b border-emerald-500/10 pb-2">
                          <Check className="h-4 w-4 bg-emerald-500/10 text-emerald-400 rounded-full p-0.5 shrink-0" /> ADVANCED GITHUB HIDDEN GEMS
                        </h5>
                        {resumeAnalysisResult.missingOnResume.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {resumeAnalysisResult.missingOnResume.map((sk: string) => (
                              <span key={sk} className="px-2.5 py-1 bg-emerald-500/0.05 border border-emerald-500/10 rounded-lg text-emerald-300 text-[10.5px] font-mono font-bold">
                                {sk}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] italic text-slate-500">No unlisted high-index repository languages detected beyond listed skills.</p>
                        )}
                        <p className="text-[9.5px] text-slate-455 leading-relaxed pt-1.5 font-mono">
                          Sourcing Intel: The candidate has working code repos for these technologies, but omitted or downplaced them on their CV! Excellent lookup.
                        </p>
                      </div>

                    </div>

                    {/* Actionable recommendations card */}
                    <div className="p-4.5 bg-slate-900/40 border border-white/5 rounded-2xl space-y-3">
                      <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">
                        TACTICAL ALIGNMENT RECOMMENDATIONS
                      </h4>
                      <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
                        {resumeAnalysisResult.recommendations.map((rec: string, rIdx: number) => (
                          <li key={rIdx} className="flex gap-2.5 items-start leading-normal">
                            <span className="flex items-center justify-center h-4.5 w-4.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 font-mono text-[9.5px] font-black shrink-0 mt-0.5">
                              {rIdx + 1}
                            </span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </motion.div>
                )}

              </motion.div>
            )}

            {/* SUB-PANEL 7: RECRUITER INSIGHTS PANEL */}
            {activeTab === "insights" && (
              <motion.div
                key="insights-sub"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 text-left relative overflow-hidden text-white"
              >
                {/* Decorative neon subtle glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/5 blur-[80px] rounded-full pointer-events-none" />

                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-sm font-mono tracking-wider text-slate-400 uppercase font-black flex items-center gap-1.5">
                    <Award className="h-4.5 w-4.5 text-violet-400" /> ScoutAI Recruiter Insights
                  </h3>
                  <span className="text-[9px] bg-violet-500/10 border border-violet-500/20 text-violet-300 px-2.5 py-0.5 rounded-full font-mono font-bold">
                    EXECUTIVE AUDIT ENGINE
                  </span>
                </div>

                {isLoadingInsights && (
                  <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                    <RefreshCw className="h-8 w-8 text-violet-500 animate-spin" />
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest animate-pulse">
                      Accessing Cached Executive Dossier...
                    </p>
                  </div>
                )}

                {!isLoadingInsights && !insights && !isGeneratingInsights && (
                  <div className="py-10 text-center space-y-6">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="h-12 w-12 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="h-6 w-6 text-violet-400 animate-pulse" />
                      </div>
                      <h4 className="text-base font-display font-black text-white">
                        Executive Intel Screening Blueprint
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Generate a comprehensive, executive-level technical assessment report mapping candidate @{candidate.profile.username}'s code details and competency scores to target engineering organizations.
                      </p>
                    </div>

                    {insightsError && (
                      <div className="max-w-md mx-auto p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-xs text-red-350 font-sans flex items-start gap-2 text-left">
                        <AlertCircle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
                        <p>{insightsError}</p>
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generateRecruiterInsights}
                      className="px-6 py-3.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer border-none shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 mx-auto"
                    >
                      <Sparkles className="h-4 w-4 text-yellow-250 fill-yellow-250 animate-bounce" />
                      Compile Recruiter Intelligence Report
                    </motion.button>
                  </div>
                )}

                {isGeneratingInsights && (
                  <div className="py-12 text-center space-y-6">
                    <div className="h-12 w-12 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center mx-auto animate-spin" style={{ animationDuration: "3s" }}>
                      <RefreshCw className="h-6 w-6 text-violet-400" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest animate-pulse">
                        Analyzing Repository footprints & metrics...
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Querying AI Recruiter Intelligence • Structuring Interview Targets
                      </p>
                    </div>

                    <div className="max-w-sm mx-auto bg-slate-900 border border-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 animate-[pulse_1s_infinite] w-5/6 rounded-full" />
                    </div>

                    <p className="text-[10px] text-slate-500 font-mono italic max-w-xs mx-auto leading-relaxed">
                      Writing outputs directly to the persistent analysis_reports directory.
                    </p>
                  </div>
                )}

                {!isLoadingInsights && insights && !isGeneratingInsights && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                      <div>
                        <p className="text-[10px] font-mono uppercase text-slate-500 font-black">Recommended Hiring Target</p>
                        <h4 className="text-base font-display font-black text-white">{insights.recommendedRole}</h4>
                      </div>
                      
                      <button
                        onClick={generateRecruiterInsights}
                        disabled={isGeneratingInsights}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-xl text-[10.5px] font-mono font-bold text-slate-300 hover:text-white transition-all cursor-pointer select-none"
                      >
                        <RefreshCw className="h-3 w-3" /> Re-Analyze Dossier
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      
                      <div className="md:col-span-4 bg-gradient-to-br from-slate-950 to-slate-900 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[200px]">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 blur-[40px] rounded-full pointer-events-none" />
                        
                        <div className="relative h-24 w-24 flex items-center justify-center">
                          <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                            <circle
                              cx="18"
                              cy="18"
                              r="16"
                              fill="none"
                              stroke="url(#insightsProgressGrad)"
                              strokeWidth="3.2"
                              strokeDasharray="100"
                              strokeDashoffset={100 - insights.confidenceScore}
                              strokeLinecap="round"
                            />
                            <defs>
                              <linearGradient id="insightsProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#d946ef" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <span className="text-2xl font-display font-black text-white leading-none">
                            {insights.confidenceScore}%
                          </span>
                        </div>
                        
                        <h5 className="text-[9px] font-mono uppercase tracking-wider text-slate-400 mt-3 font-bold">
                          Assessor Confidence
                        </h5>
                        <p className="text-[10px] text-slate-500 font-mono mt-1 leading-snug">
                          Validating repo size and metrics consistency
                        </p>
                      </div>

                      <div className="md:col-span-8 bg-gradient-to-br from-slate-950 to-slate-900 border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start border-b border-white/5 pb-3">
                          <div>
                            <h5 className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                              Hiring Decision Verdict
                            </h5>
                            <h3 className={`text-xl font-display font-black mt-1 ${
                              insights.hiringRecommendation === "Strong Hire" ? "text-emerald-400" :
                              insights.hiringRecommendation === "Hire" ? "text-cyan-400" :
                              insights.hiringRecommendation === "Consider" ? "text-amber-400" :
                              "text-rose-400"
                            }`}>
                              ● {insights.hiringRecommendation}
                            </h3>
                          </div>
                          
                          <span className={`text-[10px] font-mono uppercase font-bold border px-2.5 py-0.5 rounded-full ${
                            insights.hiringRecommendation === "Strong Hire" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            insights.hiringRecommendation === "Hire" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                            insights.hiringRecommendation === "Consider" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                            "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}>
                            Recommendation Status
                          </span>
                        </div>

                        <div className="space-y-1.5 text-left">
                          <h6 className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-black">
                            Executive Highlights Summary
                          </h6>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
                            "{insights.executiveSummary}"
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between text-[9px] text-slate-500 font-mono border-t border-white/5 pt-2 gap-2">
                          <span>Report location: /analysis_reports/{candidate.profile.username.toLowerCase()}.json</span>
                          {insights.offlineMode && <span>(Offline Fallback Active)</span>}
                        </div>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      <div className="p-4 bg-emerald-950/10 border border-emerald-500/10 hover:border-emerald-500/20 rounded-2xl space-y-3 transition-colors">
                        <h4 className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-black border-b border-emerald-500/10 pb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Mapped Candidate Strengths
                        </h4>
                        <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
                          {insights.strengths && insights.strengths.map((str: string, index: number) => (
                            <li key={index} className="flex gap-2 items-start leading-relaxed">
                              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full shrink-0 mt-1.5  animate-pulse" />
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 bg-amber-950/10 border border-amber-500/15 hover:border-amber-500/25 rounded-2xl space-y-3 transition-colors">
                        <h4 className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-black border-b border-amber-500/10 pb-2 flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 text-amber-400" /> Constructive Improvement Weaknesses
                        </h4>
                        <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
                          {insights.weaknesses && insights.weaknesses.map((weak: string, index: number) => (
                            <li key={index} className="flex gap-2 items-start leading-relaxed">
                              <span className="h-1.5 w-1.5 bg-amber-400 rounded-full shrink-0 mt-1.5" />
                              <span>{weak}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      <div className="p-4 bg-rose-950/15 border border-rose-500/10 hover:border-rose-500/20 rounded-2xl space-y-3 transition-colors">
                        <h4 className="text-[10px] font-mono tracking-widest text-rose-400 uppercase font-black border-b border-rose-500/10 pb-2 flex items-center gap-1.5">
                          <X className="h-4 w-4 text-rose-400 bg-rose-500/10 rounded-full p-0.5" /> Recruiter Risk Assessments
                        </h4>
                        <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
                          {insights.riskFactors && insights.riskFactors.map((risk: string, index: number) => (
                            <li key={index} className="flex gap-2 items-start leading-relaxed">
                              <span className="flex items-center justify-center h-4 w-4 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[9px] font-bold shrink-0">
                                !
                              </span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 bg-violet-950/10 border border-violet-500/10 hover:border-violet-500/20 rounded-2xl space-y-3 transition-colors">
                        <h4 className="text-[10px] font-mono tracking-widest text-violet-400 uppercase font-black border-b border-violet-500/10 pb-2 flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-violet-400" /> Active Interview Topic Areas
                        </h4>
                        <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
                          {insights.interviewFocusAreas && insights.interviewFocusAreas.map((area: string, index: number) => (
                            <li key={index} className="flex gap-2 items-start leading-relaxed border-l-2 border-violet-500/20 pl-2.5 italic text-slate-200">
                              <span>"{area}"</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                  </motion.div>
                )}
              </motion.div>
            )}

            {/* SUB-PANEL 2: SKILLS MODULE */}
            {activeTab === "skills" && (
              <motion.div
                key="skills-sub"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 text-left relative"
              >
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-sm font-mono tracking-wider text-slate-400 uppercase font-black flex items-center gap-1.5">
                    <Wrench className="h-4.5 w-4.5 text-indigo-400" /> T-Shaped Capability Matrix
                  </h3>
                  <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold">
                    SKILLS MODULE
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  The primary language metric acts as the central anchor core. Dynamic secondary technology scores are calculated by public stack usage indices.
                </p>

                {/* Skill progres bars */}
                <div className="space-y-4">
                  {sortedSkills.map((skill, sIdx) => {
                    const skillScore = skill.score || 80;
                    return (
                      <div key={skill.name} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-sans font-black text-white">{skill.name}</span>
                          <span className="font-mono text-pink-400 font-bold">{skillScore}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skillScore}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: sIdx * 0.08 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-white/5 pt-4 flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-pink-500" /> Core Focus (85%+)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Secondary capability
                  </span>
                </div>
              </motion.div>
            )}

            {/* SUB-PANEL 3: AI ASSESSMENT ASSESSMENT */}
            {activeTab === "coach" && (
              <motion.div
                key="coach-sub"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 text-left relative"
              >
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-sm font-mono tracking-wider text-slate-400 uppercase font-black flex items-center gap-1.5">
                    <Cpu className="h-4.5 w-4.5 text-amber-400 animate-pulse" /> AI Sourcing Report
                  </h3>
                  <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold">
                    ASSESSMENT
                  </span>
                </div>

                {/* Overall Feedback banner */}
                <div className="p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl">
                  <span className="text-[8.5px] font-mono uppercase tracking-wider text-amber-400 font-extrabold flex items-center gap-1 mb-1.5">
                    <Lightbulb className="h-3.5 w-3.5" /> Core Sourcing Feedback
                  </span>
                  <p className="text-xs text-slate-200 leading-normal font-sans">
                    {candidate.aiAnalysis.overallFeedback}
                  </p>
                </div>

                {/* Skill Summary (from Phase 2) */}
                {candidate.aiAnalysis.skillSummary && (
                  <div className="p-5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                    <span className="text-[8.5px] font-mono uppercase tracking-wider text-indigo-400 font-extrabold flex items-center gap-1 mb-1.5">
                      <GraduationCap className="h-3.5 w-3.5" /> Technical Skill Summary Analysis
                    </span>
                    <p className="text-xs text-indigo-100 leading-normal font-sans">
                      {candidate.aiAnalysis.skillSummary}
                    </p>
                  </div>
                )}

                {/* Strengths & Weaknesses comparison lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  
                  {/* Strengths */}
                  <div className="p-4 bg-slate-900/60 border border-emerald-500/20 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-3">
                        ✓ HIGHLIGHTED STRENGTHS
                      </span>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {candidate.aiAnalysis.strengths.map((str, sIdx) => (
                          <li key={sIdx} className="flex gap-2 items-start leading-normal">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Weaknesses */}
                  <div className="p-4 bg-slate-900/60 border border-amber-500/20 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider block mb-3">
                        ⚠ IDENTIFIED GAP MODULES
                      </span>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {candidate.aiAnalysis.weaknesses.map((weak, wIdx) => (
                          <li key={wIdx} className="flex gap-2 items-start leading-normal">
                            <span className="text-amber-400 mt-0.5">•</span>
                            <span>{weak}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Career Goals section */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <span className="text-[9px] font-mono text-slate-450 uppercase block mb-1">Target Strategy Career Alignment</span>
                  <h4 className="text-sm font-sans font-bold text-white text-left leading-snug">{candidate.careerCoach.target}</h4>
                </div>
              </motion.div>
            )}

            {/* SUB-PANEL 4: TECHNICAL DIAGNOSTICS */}
            {activeTab === "performance" && (
              <motion.div
                key="performance-sub"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 text-left relative"
              >
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-sm font-mono tracking-wider text-slate-400 uppercase font-black flex items-center gap-1.5">
                    <Activity className="h-4.5 w-4.5 text-cyan-400 animate-pulse" /> Diagnostics Telemetry Records
                  </h3>
                  <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold">
                    DIAGNOSTICS
                  </span>
                </div>

                {/* Progress Dial Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                  
                  {/* Dial 1: Maintainability Index */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 block">
                      Maintainability
                    </span>
                    <div className="relative h-16 w-16 flex items-center justify-center">
                      <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <motion.circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="3"
                          strokeDasharray="100"
                          strokeDashoffset={100 - candidate.performanceMetrics.maintainabilityIndex}
                          strokeLinecap="round"
                          transition={{ duration: 1 }}
                        />
                      </svg>
                      <span className="text-sm font-display font-black text-white">{candidate.performanceMetrics.maintainabilityIndex}</span>
                    </div>
                  </div>

                  {/* Dial 2: Cognitive Complexity */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 block">
                      Complexity
                    </span>
                    <div className="relative h-16 w-16 flex items-center justify-center">
                      <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <motion.circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeDasharray="100"
                          strokeDashoffset={100 - (candidate.performanceMetrics.cognitiveComplexity * 5)}
                          strokeLinecap="round"
                          transition={{ duration: 1 }}
                        />
                      </svg>
                      <span className="text-sm font-display font-black text-white">{candidate.performanceMetrics.cognitiveComplexity}</span>
                    </div>
                  </div>

                  {/* Dial 3: Code coverage */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 block">
                      Test Coverage
                    </span>
                    <div className="relative h-16 w-16 flex items-center justify-center">
                      <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <motion.circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke="#ec4899"
                          strokeWidth="3"
                          strokeDasharray="100"
                          strokeDashoffset={100 - coverageSim}
                          strokeLinecap="round"
                          transition={{ duration: 1 }}
                        />
                      </svg>
                      <span className="text-sm font-display font-black text-white">{coverageSim}%</span>
                    </div>
                  </div>

                  {/* Dial 4: Doc volume */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 block">
                      Doc Ratio
                    </span>
                    <div className="relative h-16 w-16 flex items-center justify-center">
                      <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <motion.circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="3"
                          strokeDasharray="100"
                          strokeDashoffset={100 - candidate.performanceMetrics.documentationRatio}
                          strokeLinecap="round"
                          transition={{ duration: 1 }}
                        />
                      </svg>
                      <span className="text-sm font-display font-black text-white">{candidate.performanceMetrics.documentationRatio}%</span>
                    </div>
                  </div>

                </div>

                {/* Audit files lists */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-extrabold flex items-center gap-1">
                    <Code className="h-4 w-4 text-cyan-400" /> AUDITED SOURCE BLOCKS
                  </h4>

                  {candidate.performanceMetrics.realTimeActiveAnalyses.map((f, fIdx) => (
                    <div
                      key={fIdx}
                      onClick={() => setActiveFileIdx(activeFileIdx === fIdx ? null : fIdx)}
                      className={`border rounded-2xl p-4 transition-all duration-200 cursor-pointer ${
                        activeFileIdx === fIdx
                          ? "border-pink-500 bg-slate-900/80"
                          : "border-white/5 bg-white/[0.02] hover:border-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4 text-emerald-400" /> {f.file}
                        </span>
                        <span className="text-[9px] bg-indigo-500/25 text-pink-300 font-mono font-bold px-2 py-0.5 rounded">
                          {f.language}
                        </span>
                      </div>

                      <div className="flex items-center gap-6 mt-3 text-[11px] text-slate-400 font-sans">
                        <div>
                          <p className="text-[8.5px] font-mono uppercase tracking-wider text-slate-450 mb-0.5">Complexity Mode</p>
                          <span className="px-2 py-0.5 text-[9px] border border-white/10 rounded font-mono font-bold text-slate-300">
                            {f.complexity || "Medium"}
                          </span>
                        </div>
                        <div>
                          <p className="text-[8.5px] font-mono uppercase tracking-wider text-slate-450 mb-0.5">Detected Warnings</p>
                          <span className="flex items-center gap-1 font-mono font-bold text-slate-300 text-[10px]">
                            {f.issueCount > 0 ? (
                              <>
                                <Bug className="h-3.5 w-3.5 text-rose-400 animate-bounce" /> {f.issueCount} warnings
                              </>
                            ) : (
                              "Conformant Code"
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Expand recommendation */}
                      <AnimatePresence>
                        {activeFileIdx === fIdx && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-white/5 mt-3 pt-3 text-[11px] text-slate-400 leading-normal"
                          >
                            <strong className="text-white block font-mono text-xs mb-1">Code Quality Report:</strong>
                            {f.issueCount > 0 ? (
                              <span className="italic">
                                Structural logic is valid but complex logic splits exist. Refactoring blocks into standard helper lines is advised.
                              </span>
                            ) : (
                              <span className="italic text-slate-300">
                                Perfect syntactic alignment. File incorporates streamlined, safe type mappings and proper parameter handling. Zero issues identified.
                              </span>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

              </motion.div>
            )}


          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
