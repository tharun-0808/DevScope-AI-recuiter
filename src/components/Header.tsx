import { useState, FormEvent } from "react";
import { Search, Terminal, Zap, Info, ShieldAlert } from "lucide-react";

interface HeaderProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  offlineMode: boolean;
}

export default function Header({ onSearch, isLoading, offlineMode }: HeaderProps) {
  const [usernameInput, setUsernameInput] = useState("");
  const quickPickUsers = ["tharun123", "torvalds", "karpathy", "gaearon"];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      onSearch(usernameInput.trim());
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Logo & Mood with gorgeous colorful gradients */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-fuchsia-600 via-pink-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
            <Terminal className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-xl tracking-tight bg-gradient-to-r from-slate-900 via-fuchsia-900 to-indigo-950 bg-clip-text text-transparent">
                DevScope Hub
              </h1>
              <span className="text-[9px] bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                HR VERIFIED
              </span>
            </div>
            <p className="text-[10px] text-fuchsia-600 font-mono tracking-tight uppercase font-extrabold">
              REAL-TIME APPLICANT SOURCING PIPELINE
            </p>
          </div>
        </div>

        {/* Dynamic Connection Status badge indicator */}
        <div className="flex items-center gap-3">
          {offlineMode ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-250 rounded-xl text-amber-800 text-[10px] font-mono tracking-wider font-bold shadow-sm">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>OFFLINE ENGINES ACCELERATED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-250 rounded-xl text-emerald-800 text-[10px] font-mono tracking-wider font-bold shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE RECRUITMENT LINK STATUS</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
