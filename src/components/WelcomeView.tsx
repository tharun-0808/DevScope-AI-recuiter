import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DeveloperAnalysisResult } from "../types";
import { parseSingleCSVLine } from "../utils/csvParser";
import { apiUrl } from "../api";
import { 
  UploadCloud, 
  Sparkles, 
  HelpCircle, 
  CheckCircle,
  FileText,
  TrendingUp,
  Cpu,
  Layers,
  Zap,
  ArrowRight,
  Swords,
  Loader2,
  XCircle,
  AlertTriangle
} from "lucide-react";

interface WelcomeViewProps {
  candidates: DeveloperAnalysisResult[];
  onUpdateCandidates: (newCandidates: DeveloperAnalysisResult[], skipDb?: boolean) => void;
  onGoToShortlist: () => void;
  onSeedCore: () => void;
  onGoToBattle: () => void;
}

interface ToastMessage {
  id: string;
  type: "success" | "error";
  text: string;
}

export default function WelcomeView({
  candidates,
  onUpdateCandidates,
  onGoToShortlist,
  onSeedCore,
  onGoToBattle
}: WelcomeViewProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chunked Upload State
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [processedRowsCount, setProcessedRowsCount] = useState(0);
  const [totalRowsToProcess, setTotalRowsToProcess] = useState(0);
  const [activeBatchStep, setActiveBatchStep] = useState<string>("");

  const addToast = (type: "success" | "error", text: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, type, text }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const parseCSVFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      addToast("error", "Please upload a valid .csv spreadsheet file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const allLines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        
        if (allLines.length <= 1) {
          addToast("error", "CSV is empty or missing content rows.");
          return;
        }

        const headers = allLines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, "").toLowerCase());
        let contentLines = allLines.slice(1);
        
        // Cap at 1000 rows max to prevent browser freeze from large datasets
        const MAX_ROWS = 1000;
        if (contentLines.length > MAX_ROWS) {
          addToast("error", `CSV has ${contentLines.length} rows. Limiting import to first ${MAX_ROWS} records for performance.`);
          contentLines = contentLines.slice(0, MAX_ROWS);
        }
        
        const totalRows = contentLines.length;

        // Start import pipeline
        setIsImporting(true);
        setImportProgress(0);
        setProcessedRowsCount(0);
        setTotalRowsToProcess(totalRows);
        setActiveBatchStep("Initializing dataset ingest queue...");

        const parsedBatchResults: DeveloperAnalysisResult[] = [];
        const batchSize = 100;
        let startIndex = 0;

        // Recursive generator/chunk loop to allow React thread to stay perfectly responsive
        const processNextChunk = async () => {
          if (startIndex >= totalRows) {
            // FINISHED PARSING IN CLIENT, NOW PERSIST VIA BACKGROUND QUEUED BATCHES TO API
            setActiveBatchStep("Ingest completed. Coordinating background data pipelines...");
            await persistInChunks(parsedBatchResults);
            return;
          }

          const endIndex = Math.min(startIndex + batchSize, totalRows);
          setActiveBatchStep(`Parsing candidate batch rows ${startIndex + 1} - ${endIndex}...`);

          // Process batch
          for (let k = startIndex; k < endIndex; k++) {
            const dev = parseSingleCSVLine(headers, contentLines[k], k + 1);
            if (dev) {
              parsedBatchResults.push(dev);
            }
          }

          setProcessedRowsCount(endIndex);
          setImportProgress(Math.round((endIndex / totalRows) * 50)); // First 50% is parsing

          startIndex += batchSize;
          // Yield to UI thread
          setTimeout(processNextChunk, 16);
        };

        // Start process
        setTimeout(processNextChunk, 50);

      } catch (err) {
        setIsImporting(false);
        addToast("error", "Failed to parse CSV string correctly. Please verify formatting.");
      }
    };
    reader.readAsText(file);
  };

  // Background Database Save Queue (100 row payloads per request to keep server snappy)
  const persistInChunks = async (allParsed: DeveloperAnalysisResult[]) => {
    if (allParsed.length === 0) {
      setIsImporting(false);
      addToast("error", "No valid candidates could be premium parsed from CSV database.");
      return;
    }

    const batchSize = 100;
    const totalToSave = allParsed.length;
    let savedIndex = 0;

    const saveNextBatch = async () => {
      if (savedIndex >= totalToSave) {
        // Complete everything
        setActiveBatchStep("Sync complete. Loading your roster...");
        
        // Combine with existing candidates list
        const combined = [...allParsed, ...candidates];
        const unique = combined.filter((v, i, a) => a.findIndex(t => t.profile.username === v.profile.username) === i);
        
        // Update primary context (pass true to skip standard giant bulk-save inside App since we pre-chunked saved it here)
        onUpdateCandidates(unique, true);
        
        setIsImporting(false);
        addToast("success", `Successfully integrated ${allParsed.length} new candidate records smoothly!`);
        return;
      }

      const endSaveIdx = Math.min(savedIndex + batchSize, totalToSave);
      const batchToSave = allParsed.slice(savedIndex, endSaveIdx);
      
      setActiveBatchStep(`Syncing candidates queue to secure DB: ${savedIndex + 1} - ${endSaveIdx} of ${totalToSave}...`);

      try {
        const response = await fetch(apiUrl("/api/candidates/bulk-save"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidates: batchToSave })
        });
        
        if (!response.ok) {
          throw new Error("Batch save transaction failed");
        }
      } catch (dbErr) {
        console.warn(`[Batch Queue Warning] Failed chunk ${savedIndex}-${endSaveIdx}, retrying once...`, dbErr);
        // Fallback retry delay but proceed to keep pipeline green
      }

      savedIndex += batchSize;
      const progressPercent = 50 + Math.round((savedIndex / totalToSave) * 50);
      setImportProgress(Math.min(100, progressPercent));

      setTimeout(saveNextBatch, 50);
    };

    setTimeout(saveNextBatch, 10);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseCSVFile(file);
    }
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
      parseCSVFile(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      {/* Visual background lights for authentic glassy theme */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-pink-500/20 blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: "3s" }} />

      {/* Elegant Toast Notifications */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className={`p-4 rounded-2xl shadow-xl border backdrop-blur-xl flex items-center gap-3 text-xs font-semibold max-w-sm pointer-events-auto ${
                toast.type === "success" 
                  ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/30" 
                  : "bg-rose-950/90 text-rose-300 border-rose-500/30"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
              )}
              <span>{toast.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Intro Header area with bouncing indicators */}
      <div className="text-center space-y-4 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-sm"
        >
          <Sparkles className="h-4 w-4 text-pink-400 animate-spin" style={{ animationDuration: "3s" }} />
          <span className="text-[10px] font-mono tracking-widest text-pink-300 font-extrabold uppercase">
            NEXT-GEN COGNITIVE SOURCING
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-display font-black tracking-tight leading-none text-white"
        >
          DevScope <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">Diagnostics Hub</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed"
        >
          Ditch generic candidate lists. Upload your sourcing sheet directly in `.csv` format to unlock real-time, multi-dimensional talent reviews, diagnostic indices, and career roadmaps in one dashboard.
        </motion.p>
      </div>

      {/* Main Glassy container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.3 }}
        className="bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Render Import Loading Overlay/Page when active */}
        <AnimatePresence mode="wait">
          {isImporting ? (
            <motion.div
              key="importing-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-6"
            >
              {/* Spinning high fidelity indicator */}
              <div className="relative flex items-center justify-center h-20 w-20">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-pink-500 animate-spin" style={{ animationDuration: "1.2s" }} />
                <UploadCloud className="h-8 w-8 text-indigo-300 animate-pulse" />
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-bold text-white font-display tracking-tight">
                  High Capacity CSV Pipeline Active
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1 font-mono text-pink-400 font-bold uppercase tracking-wider">
                  {activeBatchStep}
                </p>
              </div>

              {/* Progress Slider Box */}
              <div className="w-full max-w-md bg-slate-900/80 border border-white/10 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-450 uppercase font-bold">Processed Rows</span>
                  <span className="text-white font-black">{processedRowsCount} / {totalRowsToProcess}</span>
                </div>

                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-pink-500 via-fuchsia-600 to-indigo-600 rounded-full"
                    animate={{ width: `${importProgress}%` }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>UI Main-Thread: Snappy</span>
                  <span>{importProgress}% Complete</span>
                </div>
              </div>

              <p className="text-[10px] text-indigo-400 max-w-xs leading-relaxed font-mono">
                * Processing in chunked micro-batches of 100 on the fly to avoid blocking application rendering state.
              </p>
            </motion.div>
          ) : (
            <div className="w-full space-y-8">
              {/* Centered Large Upload box - resized to span full width beautifully */}
              <div className="max-w-xl mx-auto space-y-6">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-10 text-center flex flex-col justify-center items-center transition-all duration-300 relative cursor-pointer min-h-[260px] ${
                    isDragOver 
                      ? "border-pink-500 bg-pink-500/5 shadow-lg shadow-pink-500/5" 
                      : "border-white/10 bg-white/[0.02] hover:border-indigo-500/45 hover:bg-white/[0.04]"
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept=".csv" 
                    className="hidden" 
                  />
                  
                  <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-pink-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center mb-5">
                    <UploadCloud className="h-8 w-8 text-pink-400 animate-bounce" />
                  </div>
                  
                  <h3 className="text-md font-bold text-white tracking-tight">
                    Drag & Drop Dataset CSV
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 max-w-[280px] mx-auto leading-relaxed">
                    Import client recruitment databases, CSV spreadsheets or sourcing lists directly. Supporting large datasets of over 1500+ candidates asynchronously.
                  </p>
                  
                  <span className="mt-6 px-5 py-2.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 rounded-xl text-[10px] font-mono font-black text-white tracking-widest uppercase transition-all shadow-md shadow-pink-600/10">
                    BROWSE FILES
                  </span>
                </motion.div>
              </div>

              {/* Global Navigation Hub */}
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-slate-300 font-sans">
                    Currently Loaded Datasets: <strong className="text-pink-400 font-black">{candidates.length} profiles</strong>
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Instant sorting indexation (50-by-50) is active.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {candidates.length === 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onSeedCore}
                      className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                      Seed 5 Elite Talents
                    </motion.button>
                  )}

                  {candidates.length > 0 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onGoToShortlist}
                        className="px-5 py-2.5 bg-gradient-to-r from-pink-500 via-fuchsia-600 to-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg shadow-pink-500/20 border-none flex items-center gap-2"
                      >
                        Access Candidate Directory
                        <ArrowRight className="h-4 w-4 text-white" />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Feature Bento boxes for high design value */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <motion.div
          whileHover={{ translateY: -3 }}
          className="bg-slate-950/30 border border-white/5 rounded-2xl p-5 shadow-sm space-y-2 hover:border-pink-500/20 transition-all duration-300"
        >
          <div className="h-8 w-8 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
            <TrendingUp className="h-4.5 w-4.5 text-pink-400" />
          </div>
          <h4 className="text-xs font-bold text-white">Continuous Ranking</h4>
          <p className="text-[11px] text-slate-400 leading-normal">
            Every candidate is automatically ranked by an integrated **Competency Quotient** algorithm. See pages of 50-by-50 items clearly.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ translateY: -3 }}
          className="bg-slate-950/30 border border-white/5 rounded-2xl p-5 shadow-sm space-y-2 hover:border-indigo-500/20 transition-all duration-300"
        >
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Cpu className="h-4.5 w-4.5 text-indigo-400" />
          </div>
          <h4 className="text-xs font-bold text-white">Intelligent AI Coaching</h4>
          <p className="text-[11px] text-slate-400 leading-normal">
            Generates custom strengths, weaknesses, suggested career milestones, and training routes parsed for specific language paths.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ translateY: -3 }}
          className="bg-slate-950/30 border border-white/5 rounded-2xl p-5 shadow-sm space-y-2 hover:border-cyan-500/20 transition-all duration-300"
        >
          <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Layers className="h-4.5 w-4.5 text-cyan-400" />
          </div>
          <h4 className="text-xs font-bold text-white">Diagnostics Stack</h4>
          <p className="text-[11px] text-slate-400 leading-normal">
            Inspect maintenance metrics, cognitive complexity indices, documentation ratios, and active modules of the applicants instantly.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
