import * as React from "react";
import { useState, useRef, useEffect, UIEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DeveloperAnalysisResult } from "../types";
import { 
  Users, 
  ArrowLeft, 
  Search, 
  Filter, 
  Award, 
  CheckCircle, 
  PlusCircle,
  TrendingUp,
  Cpu,
  BookmarkCheck,
  ChevronRight,
  ArrowRight,
  BarChart4
} from "lucide-react";

interface SourcedRosterViewProps {
  candidates: DeveloperAnalysisResult[];
  shortlistedUsernames: string[];
  onToggleShortlist: (username: string) => void;
  onSelectCandidate: (candidate: DeveloperAnalysisResult) => void;
  onGoBackHome: () => void;
  onGoToShortlist: () => void;
}

export default function SourcedRosterView({
  candidates,
  shortlistedUsernames,
  onToggleShortlist,
  onSelectCandidate,
  onGoBackHome,
  onGoToShortlist
}: SourcedRosterViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [directSearchName, setDirectSearchName] = useState("");
  const itemsPerPage = 50;

  // Scroll tracking for performance optimization list
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rowHeight = isMobile ? 140 : 86;
  const viewportHeight = 600;

  // Score computation
  const rankedCandidates = [...candidates].map((c) => {
    const score = Math.round(
      (c.stats.activityScore * 0.35) + 
      (c.performanceMetrics.maintainabilityIndex * 0.35) + 
      (Math.min(100, c.stats.totalRepos * 1.5) * 0.15) +
      (c.performanceMetrics.testCoverage * 0.15)
    );
    return { ...c, calculatedRankScore: score };
  }).sort((a, b) => b.calculatedRankScore - a.calculatedRankScore);

  const languagesList = ["All", ...Array.from(new Set(rankedCandidates.map(c => c.stats.mostUsedLanguage)))].filter(Boolean);

  const filteredCandidates = rankedCandidates.filter(c => {
    const matchLang = selectedLanguage === "All" || c.stats.mostUsedLanguage === selectedLanguage;
    const matchSearch = c.profile.name.toLowerCase().includes(directSearchName.toLowerCase()) || 
                        c.profile.username.toLowerCase().includes(directSearchName.toLowerCase());
    return matchLang && matchSearch;
  });

  useEffect(() => {
    setScrollTop(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [selectedLanguage, directSearchName, currentPage]);

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const getGlobalRank = (username: string) => {
    return rankedCandidates.findIndex(c => c.profile.username === username) + 1;
  };

  const getPillColor = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30";
    if (score >= 82) return "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30";
    if (score >= 70) return "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30";
    return "bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-300 border border-rose-500/30";
  };

  // Virtualizer calculations
  const totalItemHeight = paginatedCandidates.length * rowHeight;
  const visibleStartIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 3);
  const visibleEndIndex = Math.min(paginatedCandidates.length, Math.ceil((scrollTop + viewportHeight) / rowHeight) + 3);

  const activeVisibleCandidatesWithIndex = paginatedCandidates
    .map((candidate, pageIndex) => ({ candidate, pageIndex }))
    .slice(visibleStartIndex, visibleEndIndex);

  const getPageNumbers = () => {
    const range = [];
    const delta = 1; // display delta around current page
    const left = currentPage - delta;
    const right = currentPage + delta;
    
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        range.push(i);
      } else if (i === left - 1 || i === right + 1) {
        range.push("...");
      }
    }
    
    // De-duplicate consecutive ellipses
    const uniqueRange: (number | string)[] = [];
    let last: number | string | null = null;
    for (const val of range) {
      if (val !== last) {
        uniqueRange.push(val);
        last = val;
      }
    }
    return uniqueRange;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 relative">
      
      {/* Top action block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <button
            onClick={onGoBackHome}
            className="group flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white mb-2 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Upload Hub
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Users className="h-4.5 w-4.5 text-white" />
            </div>
            <h2 className="font-display font-black text-xl text-white tracking-tight flex items-center gap-2">
              Sourced Talent Pool
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-mono font-bold border border-white/5">
                {candidates.length} Profiles Loaded
              </span>
            </h2>
          </div>
        </div>

        {/* Action center */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onGoToShortlist}
            className="px-4 py-2 clay-btn-emerald text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <BookmarkCheck className="h-4 w-4" />
            View Shortlist ({shortlistedUsernames.length})
          </button>
        </div>
      </div>

      {/* Roster description & count indicators */}
      <div className="mb-6 p-4 bg-slate-950/40 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-slate-400">
          ✨ Broadly review your entire candidate directory. Click the <strong className="text-pink-400">Shortlist</strong> button of any candidate to accept them onto the <strong className="text-emerald-400 font-bold">Shortlist Desk</strong>.
        </p>
        
        <div className="flex items-center gap-3">
          {/* Preset Language Filter Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-[10.5px] font-mono font-bold text-slate-300 focus:outline-none cursor-pointer border-none"
            >
              {languagesList.map(lang => (
                <option key={lang} value={lang} className="bg-slate-950 text-slate-350">{lang}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interactive search console */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450" />
        <input
          type="text"
          value={directSearchName}
          onChange={(e) => {
            setDirectSearchName(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search candidates by name, username or primary stack in talent pool..."
          className="w-full pl-10 pr-4 py-3 clay-input text-xs text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Virtualized list window card representation */}
      <div className="clay-card-dark p-6 relative">
        {filteredCandidates.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-mono">No matching candidates in this batch.</p>
          </div>
        ) : (
          /* VIRTUAL SCROLLPORT ENGINE */
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="overflow-y-auto relative pr-1"
            style={{ height: Math.min(600, totalItemHeight) }}
          >
            {/* Scroll runner height offset */}
            <div style={{ height: totalItemHeight, width: "100%", position: "absolute", top: 0, left: 0, pointerEvents: "none" }} />

            {/* Render subset of candidates based on page range */}
            {activeVisibleCandidatesWithIndex.map(({ candidate, pageIndex }) => {
              const globalRank = getGlobalRank(candidate.profile.username);
              const score = candidate.calculatedRankScore;
              const topOffset = pageIndex * rowHeight;
              const isShortlisted = shortlistedUsernames.includes(candidate.profile.username);

              return (
                <div
                  key={candidate.profile.username}
                  style={{
                    position: "absolute",
                    top: topOffset,
                    left: 0,
                    right: 0,
                    height: rowHeight - 8
                  }}
                  className="group px-4 bg-slate-900/30 hover:bg-slate-900/70 border border-white/5 hover:border-white/10 rounded-2xl transition-all flex items-center justify-between gap-4 overflow-hidden"
                >
                  {/* Left Segment - Rank, Avatar, Identity */}
                  <div className="flex items-center gap-3 min-w-0 h-full">
                    
                    {/* Rank Indicator Badge */}
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs font-black shrink-0 ${
                      globalRank === 1 
                        ? "bg-gradient-to-tr from-yellow-400 to-amber-500 text-slate-950 ring-2 ring-amber-400/20" 
                        : globalRank === 2
                        ? "bg-gradient-to-tr from-slate-300 to-slate-400 text-slate-950 ring-2 ring-slate-300/20"
                        : globalRank === 3
                        ? "bg-gradient-to-tr from-orange-400 to-amber-600 text-white ring-2 ring-orange-500/20"
                        : "bg-white/5 text-slate-300"
                    }`}>
                      #{globalRank}
                    </div>

                    {/* Avatar with click detail view link */}
                    <div 
                      onClick={() => onSelectCandidate(candidate)}
                      className="relative shrink-0 cursor-pointer group/avatar"
                    >
                      <img
                        src={candidate.profile.avatarUrl}
                        alt={candidate.profile.name}
                        className="h-11 w-11 rounded-xl object-cover shrink-0 border border-white/10 bg-slate-800 group-hover/avatar:border-pink-500/50 transition-all"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.profile.name)}&background=818cf8&color=fff&bold=true`;
                        }}
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border border-slate-900" />
                    </div>

                    {/* Identity Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span 
                          onClick={() => onSelectCandidate(candidate)}
                          className="font-display font-black text-xs text-white hover:text-pink-400 transition-colors cursor-pointer block truncate"
                        >
                          {candidate.profile.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-mono font-bold uppercase leading-none border border-indigo-500/25 shrink-0">
                          {candidate.stats.mostUsedLanguage}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5 line-clamp-1 italic">
                        @{candidate.profile.username} • {candidate.profile.bio}
                      </p>
                    </div>
                  </div>

                  {/* Right Segment - Score Index & Action Tick to shortlist button */}
                  <div className="flex items-center gap-4 shrink-0 pr-1">
                    <div className="flex flex-col items-end">
                      <span className="text-[8.5px] font-mono text-slate-400 font-black uppercase tracking-wider">
                        Competency Index
                      </span>
                      <span className="text-sm font-display font-black text-pink-400 tracking-tight leading-none mt-0.5">
                        {score}%
                      </span>
                    </div>

                    <div className={`hidden sm:block px-2.5 py-0.5 text-[9px] font-mono font-bold rounded ${getPillColor(score)}`}>
                      {score >= 90 ? "A-Tier Elite" : score >= 82 ? "B-Tier Senior" : "Standard Engine"}
                    </div>

                    {/* Checkmark TICK TO SHORTLIST Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleShortlist(candidate.profile.username);
                      }}
                      className={`h-8 px-3 rounded-xl text-[10.5px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isShortlisted
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-white/5 hover:bg-emerald-600 hover:text-white text-slate-350 border border-white/10"
                      }`}
                      title={isShortlisted ? "Click to remove from shortlist" : "Click to shortlist Candidate"}
                    >
                      <PlusCircle className={`h-4 w-4 ${isShortlisted ? "fill-emerald-400/20 text-emerald-400 stroke-[3px]" : ""}`} />
                      <span className="hidden xs:inline">{isShortlisted ? "Shortlisted" : "Shortlist"}</span>
                    </button>

                    {/* View Details Profile Arrow (Keep as requested) */}
                    <div 
                      onClick={() => onSelectCandidate(candidate)}
                      className="h-7 w-7 rounded-full bg-white/5 group-hover:bg-pink-600 group-hover:text-white text-slate-450 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Simplified clean Pagination indicators */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 clay-card-pill p-4 mt-6 max-w-full overflow-hidden">
            <span className="text-[10px] text-slate-400 font-mono">
              Page {currentPage} of {totalPages} ({filteredCandidates.length} Total)
            </span>
            
            <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-full">
              {/* Prev Button - Always first */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-slate-300 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer text-[10px] font-mono font-bold transition-all clay-btn-secondary"
              >
                Prev
              </button>

              {/* Smart Sliding Ellipses Numbers list */}
              {getPageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <span key={`ell-${index}`} className="px-1 text-[10px] text-slate-500 font-mono">
                      ...
                    </span>
                  );
                }
                const isActive = currentPage === page;
                return (
                  <button
                    key={`p-${page}`}
                    onClick={() => handlePageChange(page as number)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      isActive
                        ? "clay-btn-pink rounded-lg scale-105"
                        : "clay-btn-secondary rounded-lg"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-white font-mono text-[10px] font-bold cursor-pointer transition-all clay-btn-pink disabled:opacity-20 disabled:hover:scale-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
