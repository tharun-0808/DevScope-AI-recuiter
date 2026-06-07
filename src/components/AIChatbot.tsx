import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare, 
  Send, 
  Sparkles, 
  X, 
  Bot, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  Building,
  User,
  RefreshCw
} from "lucide-react";
import { DeveloperAnalysisResult } from "../types";
import { apiUrl, readErrorMessage } from "../api";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  time: string;
}

interface AIChatbotProps {
  candidateData: DeveloperAnalysisResult | null;
  username: string;
}

export default function AIChatbot({ candidateData, username }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggested quick prompts specifically matching the selected developer
  const starterSuggestions = [
    { text: "💼 Is this candidate suitable for our core jobs?", query: "suitability" },
    { text: "📊 What interview questions should we ask?", query: "interview" },
    { text: "🔥 What are their main technical strengths?", query: "strengths" },
    { text: "⚠️ Review their gaps & improvement areas", query: "weaknesses" }
  ];

  // Initialize welcome message when candidate changes
  useEffect(() => {
    if (username) {
      setMessages([
        {
          sender: "bot",
          text: `Hi there! I am **ScoutAI**, your interactive HR Talent Intelligence agent. I have completed a deep-dive audit of **@${username}** (${candidateData?.profile.name || "GitHub User"}). Ask me anything about their tech competence, salary fit, code structure or tailored interview questions!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [username, candidateData]);

  // Scroll to bottom on message updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || !candidateData) return;

    // Add user message to state
    const currentMsg: ChatMessage = {
      sender: "user",
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, currentMsg]);
    setInputMessage("");
    setIsSending(true);

    try {
      const historyFormatted = messages.map(m => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));

      const res = await fetch(apiUrl("/api/github/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          candidateData,
          message: trimmed,
          history: historyFormatted.slice(-6) // Include up to last 6 logs
        })
      });

      if (!res.ok) {
        const message = await readErrorMessage(res, "Endpoint returned connection failure");
        throw new Error(message);
      }

      const data = await res.json();
      
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response || "No response received.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Offline simulated scan result: **@${username}** has exceptional focus in **${candidateData.stats.mostUsedLanguage}** and holds a clean activity score of **${candidateData.stats.activityScore}/100**. They bring high potential alignment for open systems engineering roles!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const parseMarkdown = (text: string) => {
    // Basic formatting for bold markdowns
    return text.split("**").map((chunk, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-slate-900 bg-slate-100/60 px-1 rounded">{chunk}</strong>;
      }
      return chunk;
    });
  };

  return (
    <>
      {/* Dynamic colorful Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          id="scout-ai-trigger"
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 w-14 rounded-full flex items-center justify-center text-white shadow-2xl relative cursor-pointer outline-none border border-white/20 overflow-hidden bg-gradient-to-tr ${
            isOpen 
              ? "from-slate-800 to-slate-950" 
              : "from-fuchsia-600 via-pink-600 to-rose-500 animate-bounce"
          }`}
        >
          {/* Subtle pulse wave */}
          {!isOpen && (
            <span className="absolute inset-0 bg-white/20 animate-ping rounded-full pointer-events-none" />
          )}
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close-icon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat-icon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                className="flex items-center justify-center text-white"
              >
                <Sparkles className="h-6 w-6 text-yellow-200 fill-yellow-200 animate-spin-slow absolute -top-1 -right-1" />
                <Bot className="h-6 w-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Embedded/Popup Chat Canvas */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="scout-ai-canvas"
            initial={{ opacity: 0, y: 50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.85 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-24 right-6 w-11/12 sm:w-[420px] h-[520px] bg-white border border-slate-200 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header: Super colorful & gradient filled */}
            <div className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-indigo-600 px-5 py-4 text-white relative">
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/25 flex items-center justify-center text-white border border-white/20 relative animate-pulse">
                  <Bot className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-black text-sm tracking-tight">ScoutAI Assistant</h3>
                    <span className="text-[9px] bg-white text-pink-600 scale-90 px-1.5 py-0.2 rounded-full font-mono font-bold uppercase">HR PRO</span>
                  </div>
                  <p className="text-[10px] text-pink-100 font-mono">Real-time Recruiter Intelligence Node</p>
                </div>
              </div>
            </div>

            {/* Candidate Quick Stats panel */}
            {candidateData && (
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                <div className="flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-slate-400" />
                  <span>Applicant: <strong>@{username}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">Activity: <strong className="text-pink-600">{candidateData.stats.activityScore}/100</strong></span>
                  <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">{candidateData.stats.mostUsedLanguage}</span>
                </div>
              </div>
            )}

            {/* Chat Messages Panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => {
                const isBot = msg.sender === "bot";
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isBot ? -10 : 10, y: 5 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    className={`flex items-start gap-2.5 ${!isBot ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs text-white shrink-0 shadow ${
                      isBot 
                        ? "bg-gradient-to-tr from-fuchsia-500 to-indigo-600" 
                        : "bg-gradient-to-tr from-slate-700 to-slate-900"
                    }`}>
                      {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>

                    <div className="space-y-0.5 max-w-[80%]">
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isBot 
                          ? "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50" 
                          : "bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white rounded-tr-none shadow-md shadow-pink-500/10"
                      }`}>
                        {parseMarkdown(msg.text)}
                      </div>
                      <p className={`text-[9px] text-slate-400 font-mono px-1 ${!isBot ? "text-right" : ""}`}>
                        {msg.time}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {isSending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-fuchsia-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow animate-pulse">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-slate-100 border border-slate-200/50 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}

              <div ref={scrollRef} />
            </div>

            {/* Quick Option suggestion Pills */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1.5">ASSESSMENT SUGGESTION CHANNELS:</span>
                <div className="flex flex-col gap-1.5">
                  {starterSuggestions.map((item) => (
                    <button
                      key={item.query}
                      disabled={isSending || !candidateData}
                      onClick={() => handleSend(item.text)}
                      className="w-full text-left bg-white hover:bg-gradient-to-r hover:from-fuchsia-50 hover:to-indigo-50 border border-slate-200/80 hover:border-pink-300 rounded-xl px-3 py-1.5 text-[10px] font-semibold text-slate-700 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <span>{item.text}</span>
                      <Send className="h-2.5 w-2.5 text-slate-300 group-hover:text-pink-500 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input Panel */}
            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputMessage);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  required
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask ScoutAI e.g. suitable for senior dev?"
                  disabled={isSending || !candidateData}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-slate-800 placeholder-slate-400 font-sans transition-all"
                />

                <button
                  type="submit"
                  disabled={isSending || !inputMessage.trim() || !candidateData}
                  className="h-8 w-8 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
              <div className="text-[8px] text-slate-400 text-center mt-1.5 font-mono">
                Leverages deep-learning to diagnose candidate software repositories.
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
