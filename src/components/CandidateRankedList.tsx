import * as React from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DeveloperAnalysisResult } from "../types";
import { 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  UploadCloud, 
  Sparkles, 
  Filter, 
  Trash2, 
  FolderDown, 
  CheckCircle2, 
  TrendingUp, 
  Award,
  Flame,
  FileSpreadsheet
} from "lucide-react";

interface CandidateRankedListProps {
  candidates: DeveloperAnalysisResult[];
  onSelectCandidate: (candidate: DeveloperAnalysisResult) => void;
  selectedCandidate: DeveloperAnalysisResult | null;
  onUpdateCandidates: (newCandidates: DeveloperAnalysisResult[]) => void;
  onPrepopulate: () => void;
  isLoading: boolean;
}

export default function CandidateRankedList({
  candidates,
  onSelectCandidate,
  selectedCandidate,
  onUpdateCandidates,
  onPrepopulate,
  isLoading
}: CandidateRankedListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const itemsPerPage = 10;

  // Compute rank score dynamically for candidates to rank them
  const rankedCandidates = [...candidates].map((c) => {
    const score = Math.round(
      (c.stats.activityScore * 0.35) + 
      (c.performanceMetrics.maintainabilityIndex * 0.35) + 
      (Math.min(100, c.stats.totalRepos * 1.5) * 0.15) +
      (c.performanceMetrics.testCoverage * 0.15)
    );
    return { ...c, calculatedRankScore: score };
  }).sort((a, b) => b.calculatedRankScore - a.calculatedRankScore);

  // Filter candidates by Language
  const languages = ["All", ...Array.from(new Set(rankedCandidates.map(c => c.stats.mostUsedLanguage || "Python")))];
  
  const filteredCandidates = selectedLanguage === "All" 
    ? rankedCandidates 
    : rankedCandidates.filter(c => c.stats.mostUsedLanguage === selectedLanguage);

  // Total pages calculation
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  
  // Slice candidates for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage);

  // Map each candidate back to their global rank
  const getGlobalRank = (username: string) => {
    return rankedCandidates.findIndex(c => c.profile.username === username) + 1;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseJsonFile(file);
    }
  };

  const parseJsonFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          // Validate and conform imported candidate items
          const conformed: DeveloperAnalysisResult[] = json.map((item: any, idx: number) => {
            return {
              profile: {
                username: item.username || `imported_user_${idx + 1}`,
                name: item.name || item.username || `Imported Candidate ${idx + 1}`,
                avatarUrl: item.avatarUrl || `https://ui-avatars.com/api/?name=${item.username || 'imported'}&background=ec4899&color=fff`,
                bio: item.bio || "Custom uploaded developer profile.",
                company: item.company || "Independent",
                location: item.location || "Remote",
                followers: item.followers || 150,
                publicRepos: item.publicRepos || item.totalRepos || 15,
              },
              stats: {
                totalRepos: item.totalRepos || item.publicRepos || 15,
                mostUsedLanguage: item.mostUsedLanguage || item.language || "TypeScript",
                mostStarredRepo: item.mostStarredRepo || "imported-library",
                activityScore: item.activityScore || item.score || 75,
                totalStars: item.totalStars || item.stars || 120,
              },
              aiAnalysis: {
                overallFeedback: item.overallFeedback || "High-growth dynamic candidate profile from uploaded sourcing dataset.",
                strengths: item.strengths || ["Modular implementation flow", "Vibrant documentation commits"],
                weaknesses: item.weaknesses || ["Needs advanced automated coverage integration"],
              },
              careerCoach: {
                target: item.targetRole || item.target || "Full Stack Software Engineer",
                suggestions: item.suggestions || ["Explore Docker structures", "Build stateful modules"],
                suggestedRoadmap: item.suggestedRoadmap || [
                  { step: 1, title: "Containerization Mechanics", description: "Learn cluster deployment methods.", tech: ["Docker", "Kubernetes"] },
                  { step: 2, title: "State Handling Protocols", description: "Learn advanced browser state machines.", tech: ["React", "Redux"] }
                ]
              },
              skills: item.skills || [
                { name: item.mostUsedLanguage || "TypeScript", score: 85 },
                { name: "Git Workflow", score: 80 }
              ],
              performanceMetrics: item.performanceMetrics || {
                cognitiveComplexity: item.cognitiveComplexity || 14,
                maintainabilityIndex: item.maintainabilityIndex || 85,
                testCoverage: item.testCoverage || 60,
                documentationRatio: item.documentationRatio || 75,
                realTimeActiveAnalyses: item.realTimeActiveAnalyses || [
                  { file: "index.ts", language: item.mostUsedLanguage || "TypeScript", issueCount: 0, complexity: "Medium" }
                ]
              }
            };
          });

          // Confound upload metrics with current candidates
          const updatedNodes = [...conformed, ...candidates];
          // Remove duplicates based on unique username
          const uniqueNodes = updatedNodes.filter((v, i, a) => a.findIndex(t => t.profile.username === v.profile.username) === i);
          
          onUpdateCandidates(uniqueNodes);
          setUploadSuccessMsg(`Successfully parsed and ranked ${conformed.length} candidates from dataset uploads!`);
          setCurrentPage(1);
          setTimeout(() => setUploadSuccessMsg(null), 5000);
        } else {
          alert("Uploaded JSON file must be an array of applicant profiles.");
        }
      } catch (err) {
        alert("Incorrect JSON schema. Make sure it represents a valid JSON array.");
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      parseJsonFile(file);
    }
  };

  const clearAllCustomNodes = () => {
    onUpdateCandidates([]);
    setCurrentPage(1);
  };

  const getFitPillColor = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/25";
    if (score >= 80) return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/25";
    if (score >= 70) return "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/25";
    return "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/25";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 border border-indigo-200/60 rounded-3xl p-6 shadow-xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 rounded-full bg-indigo-100/50 pointer-events-none blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 rounded-full bg-pink-100/30 pointer-events-none blur-3xl" />

      {/* Title Header Block with Lively Animations */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-fuchsia-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
              <Award className="h-4.5 w-4.5 text-white" />
            </div>
            <h2 className="font-display font-black text-lg text-slate-800 tracking-tight flex items-center gap-2">
              Sourced Applicants Shortlist
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-mono font-bold">
                {filteredCandidates.length} Active Candidates
              </span>
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 font-mono tracking-tight uppercase font-extrabold mt-1">
            * PAGINATED TOP 10 REGIME • RECRUITERS OPTIMIZATION INDEX *
          </p>
        </div>

        {/* Quick Filtering & Action triggers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Prepopulator */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrepopulate}
            className="px-3.5 py-2 bg-gradient-to-r from-fuchsia-600 to-rose-500 hover:from-fuchsia-700 hover:to-rose-600 text-white rounded-xl text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-pink-500/20 border-none cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-yellow-200 animate-pulse" />
            Auto-Seed 25 Elite Talents
          </motion.button>

          {/* Delete All Nodes */}
          {candidates.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearAllCustomNodes}
              className="px-3.5 py-2 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
              Clear Dataset
            </motion.button>
          )}

          {/* Language selector filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-[11px] font-mono font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN: THE REAL-TIME DRAG-N-DROP JSON UPLOADER (4 Cols) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <motion.div
            whileHover={{ scale: 1.01 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-6 text-center flex flex-col justify-center items-center transition-all duration-300 relative cursor-pointer min-h-[220px] ${
              isDragOver 
                ? "border-fuchsia-500 bg-fuchsia-50/40" 
                : "border-slate-300 bg-white hover:border-indigo-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".json" 
              className="hidden" 
            />
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-fuchsia-100 to-indigo-100 flex items-center justify-center mb-3">
              <UploadCloud className="h-6 w-6 text-fuchsia-600 animate-bounce" />
            </div>
            
            <h4 className="text-xs font-bold font-sans text-slate-800">
              Drag & Drop Applicant JSON
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] mx-auto font-mono leading-relaxed">
              Upload custom database array file (.json) to evaluate candidate skills instantly in real-time.
            </p>
            <span className="mt-3.5 px-3 py-1 bg-gradient-to-r from-fuchsia-500 to-indigo-500 rounded-lg text-[9px] font-mono font-bold text-white tracking-widest uppercase">
              SELECT FILE
            </span>
          </motion.div>

          {/* Download Schema Link or Tutorial notice */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-4 rounded-3xl text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-fuchsia-500/10 pointer-events-none blur-xl" />
            <h5 className="text-[10px] font-mono text-fuchsia-300 tracking-wider uppercase font-extrabold flex items-center gap-1.5">
              <FileSpreadsheet className="h-3.5 w-3.5 text-pink-400" />
              Easy JSON Dataset Template
            </h5>
            <p className="text-[10.5px] text-slate-300 mt-1 leading-normal font-sans">
              Want to test importing? Create a file <code className="bg-slate-800 text-teal-300 px-1 rounded text-[9.5px]">candidates.json</code> with an array of objects e.g.:
            </p>
            <pre className="text-[9px] font-mono text-slate-400 bg-slate-950 p-2 rounded-lg mt-2 overflow-x-auto max-h-[110px] scrollbar-thin">
{`[
  {
    "username": "coder_queen",
    "name": "Sarah Croft",
    "mostUsedLanguage": "Go",
    "score": 93
  }
]`}
            </pre>
          </div>
        </div>

        {/* RIGHT COLUMN: PAGINATED SHORTLIST GRID CARD (8 Cols) */}
        <div className="xl:col-span-8 flex flex-col justify-between">
          <AnimatePresence>
            {uploadSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-250 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold"
              >
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>{uploadSuccessMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {paginatedCandidates.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 flex flex-col items-center justify-center min-h-[340px]">
              <Users className="h-10 w-10 text-slate-300 mb-2 animate-pulse" />
              <p className="text-xs text-slate-500 font-mono">No candidates match current language search filters.</p>
              <button 
                onClick={() => setSelectedLanguage("All")}
                className="mt-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-mono cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {paginatedCandidates.map((candidate, idx) => {
                const globalRank = getGlobalRank(candidate.profile.username);
                const isSelected = selectedCandidate?.profile?.username.toLowerCase() === candidate.profile.username.toLowerCase();
                const progressScore = candidate.calculatedRankScore || 75;

                return (
                  <motion.div
                    key={candidate.profile.username}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 100, delay: idx * 0.04 }}
                    whileHover={{ translateY: -2, scale: 1.005 }}
                    onClick={() => onSelectCandidate(candidate)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-slate-950 shadow-lg shadow-indigo-950/20"
                        : "bg-white border-slate-200 hover:border-slate-350 shadow-sm"
                    }`}
                  >
                    {/* Left: Avatar, Name, and Global Rank Badge */}
                    <div className="flex items-center gap-3">
                      {/* Rank badge */}
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center font-mono text-xs font-black shrink-0 shadow-sm ${
                        globalRank <= 3 
                          ? "bg-gradient-to-tr from-yellow-400 to-amber-500 text-slate-900 ring-2 ring-amber-100" 
                          : isSelected ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700"
                      }`}>
                        #{globalRank}
                      </div>

                      <div className="relative">
                        <img
                          src={candidate.profile.avatarUrl}
                          alt={candidate.profile.name}
                          className="h-10 w-10 rounded-xl object-cover shrink-0 border border-slate-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.profile.username)}&background=818cf8&color=fff`;
                          }}
                        />
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className={`font-display font-bold text-xs truncate max-w-[120px] ${isSelected ? "text-white" : "text-slate-900"}`}>
                            {candidate.profile.name || candidate.profile.username}
                          </h4>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            isSelected ? "bg-white/10 text-pink-300" : "bg-slate-50 text-indigo-600 border border-indigo-100"
                          }`}>
                            {candidate.stats.mostUsedLanguage}
                          </span>
                        </div>
                        <p className={`text-[10px] truncate max-w-[180px] sm:max-w-[240px] mt-0.5 font-sans italic ${isSelected ? "text-slate-300" : "text-slate-450"}`}>
                          @{candidate.profile.username} • {candidate.profile.bio || "No public bio."}
                        </p>
                      </div>
                    </div>

                    {/* Right: Scores & Interaction progress */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-100/10 pt-2 sm:pt-0 shrink-0">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          <span className={`text-[9px] font-mono uppercase tracking-wider font-extrabold ${isSelected ? "text-slate-400" : "text-slate-450"}`}>
                            RANK MATCH SCORE
                          </span>
                        </div>
                        <span className={`text-sm font-display font-black tracking-tight ${
                          isSelected ? "text-pink-400" : "text-indigo-600"
                        }`}>
                          {progressScore}%
                        </span>
                      </div>

                      <div className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl shadow-inner ${getFitPillColor(progressScore)}`}>
                        {progressScore >= 90 ? "A-Tier" : progressScore >= 80 ? "B-Tier" : "C-Tier"}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination controls: Paginated Page 1, Page 2 10-by-10 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-2xl shadow-sm mt-4">
              <span className="text-[10px] text-slate-500 font-mono uppercase font-black">
                Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredCandidates.length)} of {filteredCandidates.length}
              </span>

              <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                      currentPage === index + 1
                        ? "bg-slate-900 border border-slate-900 text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Page {index + 1}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
