import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DeveloperAnalysisResult } from "./types";
import Header from "./components/Header";
import WelcomeView from "./components/WelcomeView";
import SourcedRosterView from "./components/SourcedRosterView";
import ShortlistPageView from "./components/ShortlistPageView";
import CandidateDetailView from "./components/CandidateDetailView";
import CandidateCompareView from "./components/CandidateCompareView";
import AIChatbot from "./components/AIChatbot";
import { mockCandidatesList } from "./data/mockCandidates";
import { apiUrl, readErrorMessage } from "./api";
import { 
  Terminal, 
  Fingerprint, 
  Lock, 
  Briefcase, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Globe,
  RefreshCw,
  Zap,
  ArrowLeft
} from "lucide-react";

export default function App() {
  // Authentication states
  const [isHrLoggedIn, setIsHrLoggedIn] = useState(false);
  const [hrUsername, setHrUsername] = useState("");
  const [hrPassword, setHrPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Core view router
  // 'welcome': Landing Sourcing & CSV center
  // 'roster': Paginated list roster of all candidates (50-by-50)
  // 'shortlist': Recruiter boardroom shortlist action panel
  // 'detail': Distinct full page telemetry review channel
  // 'compare': Multi-candidate side-by-side comparison matrix panel
  const [viewState, setViewState] = useState<"welcome" | "roster" | "shortlist" | "detail" | "compare">("welcome");

  // State arrays for customized shortlist tracking
  const [shortlistedUsernames, setShortlistedUsernames] = useState<string[]>([]);

  // State arrays for multiple customizable comparisons
  const [compareUsernames, setCompareUsernames] = useState<string[]>([]);

  // Candidates database list
  const [candidates, setCandidates] = useState<DeveloperAnalysisResult[]>([]);
  const [activeCandidate, setActiveCandidate] = useState<DeveloperAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorPrint, setErrorPrint] = useState<string | null>(null);

  // Real-time lookup tag state
  const [customGitHubUser, setCustomGitHubUser] = useState("");

  // Load initially cached candidates inside SQLite DB on start
  useEffect(() => {
    const loadCached = async () => {
      try {
        const response = await fetch(apiUrl("/api/candidates"));
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.candidates) && data.candidates.length > 0) {
            setCandidates(data.candidates);
          }
        }
      } catch (err) {
        console.warn("Could not reload database cache on bootstrap.", err);
      }
    };
    loadCached();
  }, []);

  // Seed initial 5 elite candidates when direct requested or bypassing
  const handleSeedCoreElites = () => {
    setCandidates(mockCandidatesList);
    setViewState("roster");
  };

  const fetchAnalysis = async (userToQuery: string) => {
    if (!userToQuery.trim()) return;
    setLoading(true);
    setErrorPrint(null);
    try {
      const response = await fetch(apiUrl(`/api/github/analyze/${encodeURIComponent(userToQuery.trim())}`));
      if (!response.ok) {
        const message = await readErrorMessage(response, `Profile analytics returned status ${response.status}`);
        throw new Error(message);
      }
      const json: DeveloperAnalysisResult = await response.json();
      
      // Update roster
      setCandidates(prev => {
        const index = prev.findIndex(c => c.profile.username.toLowerCase() === json.profile.username.toLowerCase());
        if (index > -1) {
          const next = [...prev];
          next[index] = json;
          return next;
        } else {
          return [json, ...prev];
        }
      });
      
      setActiveCandidate(json);
      setViewState("detail");
    } catch (err: any) {
      console.error(err);
      setErrorPrint(err.message || "Could not reach the local DevScope server. Please start it with npm run dev.");
    } finally {
      setLoading(false);
    }
  };

  const handleHrLogin = (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    const validHrUser = hrUsername.trim() === "admin" || hrUsername.trim() === "recruiter";
    const validHrPass = hrPassword.trim() === "admin123" || hrPassword.trim() === "hr2026";

    if (validHrUser && validHrPass) {
      setIsHrLoggedIn(true);
      setViewState("welcome");
    } else {
      setAuthError("Incorrect Admin UID/Passkey credentials. Try admin / admin123");
    }
  };

  const handleBypassEntry = () => {
    setIsHrLoggedIn(true);
    setViewState("welcome");
  };

  const handleLogout = () => {
    setIsHrLoggedIn(false);
    setActiveCandidate(null);
    setCandidates([]);
    setHrUsername("");
    setHrPassword("");
    setViewState("welcome");
  };

  return (
    <div id="devscope-root" className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-pink-600 selection:text-white pb-16 relative">
      
      {/* Dynamic colorful space lights representing premium glassy visual mode */}
      <div className="absolute top-0 left-0 right-0 h-[640px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-950/40 via-indigo-950/20 to-transparent -z-20 pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-pink-500/10 blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-indigo-500/10 blur-[130px] -z-10 pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isHrLoggedIn ? (
          /* SECTION 1: AUTHENTICATION PORTAL */
          <motion.div 
            key="login-page-core"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="min-h-screen flex flex-col justify-center items-center px-4 py-8"
          >
            <div className="w-full max-w-4xl bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-indigo-500" />
              
              <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Left branding graphics column */}
                <div className="md:col-span-5 bg-gradient-to-br from-indigo-950 via-slate-950 to-black p-8 text-white flex flex-col justify-between relative overflow-hidden border-r border-white/5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="space-y-4">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-pink-550 via-fuchsia-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                      <Terminal className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-display font-black text-2xl tracking-tight text-white leading-tight">
                        DevScope Hub
                      </h2>
                      <p className="text-[10px] uppercase font-mono tracking-widest text-fuchsia-400 font-extrabold">
                        Talent Diagnostics Terminal
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 my-8">
                    <p className="text-xs text-indigo-300 leading-relaxed font-mono">
                      // SECURE CLOUD GATEWAY ACTIVE. COGNITIVE RECONCILIATION SYSTEMS READY FOR CANDIDATE PROFILE AUDITS.
                    </p>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-fuchsia-500 animate-ping" />
                        <span className="text-xs text-slate-300">Continuous Sorter (10-per-page)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-cyan-400" />
                        <span className="text-xs text-slate-300">Dynamic CSV Spreadsheet Importer</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-yellow-400" />
                        <span className="text-xs text-slate-300">Interactive Code Diagnostics Runway</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[9px] font-mono text-slate-400">
                    Host: <span className="text-emerald-400 font-bold">127.0.0.1</span> • Secure TLS 1.3
                  </div>
                </div>

                {/* Right credentials panel */}
                <div className="md:col-span-7 p-8 md:p-12 space-y-6 bg-slate-950/50">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Briefcase className="h-4.5 w-4.5 text-pink-500" />
                      <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 font-mono">
                        VERIFIED RECRUITMENT GATEWAY
                      </span>
                    </div>
                    <h1 className="text-3xl font-display font-black tracking-tight text-white leading-none">
                      HR Talent Sourcing
                    </h1>
                    <p className="text-xs text-slate-455 mt-2">
                      Access active shortlist profiles, check competency coefficients, map developmental pathways.
                    </p>
                  </div>

                  <form onSubmit={handleHrLogin} className="space-y-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Fingerprint className="h-3 w-3 text-pink-500" /> Admin Code Name
                      </label>
                      <input 
                        type="text" 
                        required
                        value={hrUsername}
                        onChange={(e) => setHrUsername(e.target.value)}
                        placeholder="e.g. admin"
                        className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-slate-600 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Lock className="h-3 w-3 text-pink-500" /> Security PIN
                      </label>
                      <input 
                        type="password" 
                        required
                        value={hrPassword}
                        onChange={(e) => setHrPassword(e.target.value)}
                        placeholder="e.g. admin123"
                        className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-slate-600 font-mono"
                      />
                    </div>

                    {authError && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-900/30 border border-red-500/30 text-rose-250 rounded-xl flex items-center gap-2 text-[10px] font-mono"
                      >
                        <AlertCircle className="h-4.5 w-4.5 text-red-400 shrink-0" />
                        <span>{authError}</span>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="py-3 bg-white text-slate-950 hover:bg-slate-100 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow border-none cursor-pointer"
                      >
                        Authenticate
                        <ArrowRight className="h-3.5 w-3.5" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleBypassEntry}
                        className="py-3 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-indigo-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow shadow-pink-500/20 border-none cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-yellow-200 fill-yellow-200" />
                        Bypass Authorization
                      </motion.button>
                    </div>
                  </form>

                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-left">
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Authorized login credentials: key-in identifier <code className="bg-slate-800 text-pink-400 px-1 rounded font-mono text-[10px]">admin</code> and password <code className="bg-slate-800 text-pink-400 px-1 rounded font-mono text-[10px]">admin123</code> or press the pink bypass button.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* SECTION 2: AUTHENTICATED CONTROL HUB */
          <motion.div
            key="dashboard-frame-core"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Elegant upper header panel */}
            <Header 
              onSearch={fetchAnalysis} 
              isLoading={loading} 
              offlineMode={activeCandidate?.offlineMode ?? false} 
            />

            <main className="max-w-6xl mx-auto px-4 space-y-6 relative pb-12">
              
              {/* Dynamic Action Console Panel */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 rounded-full bg-pink-500/5 pointer-events-none blur-3xl animate-pulse" />
                
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-pink-550 to-indigo-600 shadow-md flex items-center justify-center text-white font-display font-black text-lg">
                      DS
                    </div>
                    <span className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-extrabold shadow-sm border border-slate-950">
                      ✓
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                      <span className="text-[8.5px] bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500 text-white px-2.5 py-0.5 rounded-full font-mono font-black uppercase tracking-wider">
                        PORTAL MODE ACTIVE
                      </span>
                      <span className="text-[9px] bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Admin Authenticated
                      </span>
                    </div>
                    
                    <h2 className="font-display font-black text-xl text-white leading-none tracking-tight">
                      DevScope Verifier Core Workspace
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage uploaded applicant datasets, rank talent paginated, and inspect technical summaries.
                    </p>
                  </div>
                </div>

                {/* Return/Logout pathway actions */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {viewState !== "welcome" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewState("welcome")}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-white/10 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Upload Desk
                    </motion.button>
                  )}

                  {candidates.length > 0 && viewState !== "roster" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewState("roster")}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-white/10 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Talent Directory
                    </motion.button>
                  )}

                  {shortlistedUsernames.length > 0 && viewState !== "shortlist" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewState("shortlist")}
                      className="px-3.5 py-1.5 bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Shortlist Board ({shortlistedUsernames.length})
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-950/25 border border-red-500/20 text-red-300 hover:bg-red-950/50 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Logout Terminal
                  </motion.button>
                </div>
              </motion.div>

              {/* REAL-TIME INTERSECTION INJECT SEARCH */}
              {viewState === "welcome" && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-tr from-slate-950 to-indigo-950 text-white p-6 rounded-3xl border border-indigo-900/40 shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 -mr-24 -mt-24 w-56 h-56 rounded-full bg-pink-550/5 pointer-events-none blur-3xl animate-pulse" />
                  
                  <h3 className="text-[10px] font-black font-mono tracking-widest text-fuchsia-400 uppercase mb-2 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-pink-400" />
                    INJECT INDIVIDUAL GITHUB PROFILE
                  </h3>
                  <p className="text-xs text-slate-350 max-w-xl mb-4 leading-normal font-sans">
                    Want to audit a specific applicant is not in your CSV sheet? Enter their identifier below to immediately fetch their full profile live and open their diagnostics.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch gap-3">
                    <input
                      type="text"
                      value={customGitHubUser}
                      onChange={(e) => setCustomGitHubUser(e.target.value)}
                      placeholder="Search and inject client alias (e.g. torvalds, karpathy, gaearon...)"
                      className="flex-1 px-4 py-2.5 bg-slate-900/60 focus:bg-slate-900 border border-white/10 focus:border-pink-500 rounded-xl text-xs text-white placeholder-slate-655 font-mono transition-all outline-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (customGitHubUser.trim()) {
                          fetchAnalysis(customGitHubUser.trim());
                          setCustomGitHubUser("");
                        }
                      }}
                      disabled={loading || !customGitHubUser.trim()}
                      className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-indigo-600 rounded-xl text-xs font-bold hover:opacity-90 tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 border-none text-white font-sans"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="animate-spin h-3.5 w-3.5 text-white" />
                          Indexing...
                        </>
                      ) : (
                        <>
                          Inject & Audit
                          <Zap className="h-3.5 w-3.5 text-yellow-200 fill-yellow-250 animate-pulse" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Dynamic Error notifications */}
              <AnimatePresence>
                {errorPrint && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-md"
                  >
                    <span className="font-mono">
                      <strong className="uppercase font-extrabold text-rose-400">Connection status warning:</strong> {errorPrint}
                    </span>
                    <button 
                      onClick={() => setErrorPrint(null)}
                      className="px-2.5 py-1 bg-rose-900 hover:bg-rose-800 rounded text-[9.5px] font-mono text-white cursor-pointer"
                    >
                      Dismiss Error
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ROUTER PAGES */}
              <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                  {/* PAGE 1: Welcome / CSV Uploader Hub */}
                  {viewState === "welcome" && (
                    <motion.div
                      key="welcome-page-frame"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      transition={{ duration: 0.25 }}
                    >
                      <WelcomeView 
                        candidates={candidates}
                        onUpdateCandidates={(newCands, skipDb = false) => {
                          setCandidates(newCands);
                          if (skipDb) return;
                          fetch(apiUrl("/api/candidates/bulk-save"), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ candidates: newCands })
                          })
                          .then(r => r.json())
                          .then(d => {
                            console.log(`[DevScope DB Store] Automatically persisted ${d.count} candidate rows in local database.`);
                          })
                          .catch(err => {
                            console.warn("Database storage warning for CSV import.", err);
                          });
                        }}
                        onGoToShortlist={() => setViewState("roster")}
                        onSeedCore={handleSeedCoreElites}
                        onGoToBattle={() => {}}
                      />
                    </motion.div>
                  )}

                  {/* PAGE 2: Sourced Talent Pool Directory */}
                  {viewState === "roster" && (
                    <motion.div
                      key="roster-page-frame"
                      initial={{ opacity: 0, scale: 0.99 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <SourcedRosterView 
                        candidates={candidates}
                        shortlistedUsernames={shortlistedUsernames}
                        onToggleShortlist={(username) => {
                          setShortlistedUsernames(prev => {
                            const exists = prev.includes(username);
                            if (exists) {
                              return prev.filter(u => u !== username);
                            } else {
                              return [...prev, username];
                            }
                          });
                        }}
                        onSelectCandidate={(cand) => {
                          setActiveCandidate(cand);
                          setViewState("detail");
                        }}
                        onGoBackHome={() => setViewState("welcome")}
                        onGoToShortlist={() => setViewState("shortlist")}
                      />
                    </motion.div>
                  )}

                  {/* PAGE 3: Dedicated Recruiter Shortlist Action Desk */}
                  {viewState === "shortlist" && (
                    <motion.div
                      key="shortlist-page-frame"
                      initial={{ opacity: 0, scale: 0.99 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ShortlistPageView 
                        candidates={candidates}
                        shortlistedUsernames={shortlistedUsernames}
                        onToggleShortlist={(username) => {
                          setShortlistedUsernames(prev => prev.filter(u => u !== username));
                        }}
                        onSelectCandidate={(cand) => {
                          setActiveCandidate(cand);
                          setViewState("detail");
                        }}
                        onGoBackRoster={() => setViewState("roster")}
                        selectedForComparison={compareUsernames}
                        onToggleComparison={(username) => {
                          setCompareUsernames(prev => 
                            prev.includes(username) 
                              ? prev.filter(u => u !== username) 
                              : [...prev, username]
                          );
                        }}
                        onGoToCompare={() => setViewState("compare")}
                      />
                    </motion.div>
                  )}

                  {/* PAGE 4: CANDIDATE DETAIL WORKSPACE VIEW */}
                  {viewState === "detail" && activeCandidate && (
                    <motion.div
                      key="detail-page-frame"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.25 }}
                    >
                      <CandidateDetailView 
                        candidate={activeCandidate}
                        onBackToShortlist={() => {
                          if (shortlistedUsernames.includes(activeCandidate.profile.username)) {
                            setViewState("shortlist");
                          } else {
                            setViewState("roster");
                          }
                        }}
                      />
                    </motion.div>
                  )}

                  {/* PAGE 5: CANDIDATE COMPARISON VIEW */}
                  {viewState === "compare" && (
                    <motion.div
                      key="compare-page-frame"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <CandidateCompareView 
                        candidates={candidates}
                        compareUsernames={compareUsernames}
                        onBack={() => setViewState("roster")}
                        onSelectCandidate={(cand) => {
                          setActiveCandidate(cand);
                          setViewState("detail");
                        }}
                        onClearComparison={() => setCompareUsernames([])}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* INTEGRATED FLOATING HR BOT ASSISTANT */}
              <AIChatbot candidateData={activeCandidate} username={activeCandidate?.profile.username ?? "tharun123"} />

            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
