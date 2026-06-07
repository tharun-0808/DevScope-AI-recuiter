import { motion } from "motion/react";
import { SkillItem } from "../types";
import { Zap } from "lucide-react";

interface SkillsGraphProps {
  skills: SkillItem[];
}

export default function SkillsGraph({ skills }: SkillsGraphProps) {
  // Sort skills descending
  const sortedSkills = [...skills].sort((a, b) => b.score - a.score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white border border-slate-200 rounded-2xl p-6 h-full flex flex-col justify-between"
    >
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
            Skills Visualization
          </span>
          <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 rounded px-1.5 py-0.5 font-mono">
            VERIFIED
          </span>
        </h2>

        {/* List of skills */}
        <div className="space-y-4">
          {sortedSkills.map((skill, index) => {
            return (
              <div key={skill.name}>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                  <span className="font-sans font-semibold">{skill.name}</span>
                  <span className="font-mono">{skill.score}%</span>
                </div>

                {/* Animated progress bar indicator */}
                <div className="h-1.5 w-full bg-slate-100 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.score}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                    className={`h-full rounded-full ${
                      skill.score >= 50 ? "bg-slate-900" : "bg-slate-400"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 border-t border-slate-100 pt-4 text-[10px] text-slate-400 font-mono flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-900" /> Professional Range (50%+)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Focus Target
        </span>
      </div>
    </motion.div>
  );
}
