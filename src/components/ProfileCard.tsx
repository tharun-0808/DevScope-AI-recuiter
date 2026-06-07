import { motion } from "motion/react";
import { UserProfile, RepoStats } from "../types";
import { 
  GitBranch, 
  MapPin, 
  Award, 
  Flame, 
  Users, 
  FileCode, 
  FolderGit2,
  BookmarkCheck
} from "lucide-react";

interface ProfileCardProps {
  profile: UserProfile;
  stats: RepoStats;
}

export default function ProfileCard({ profile, stats }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden"
    >
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
        Profile Overview
      </h2>

      <div className="flex flex-col gap-6">
        {/* Core Identity info with subtle modern minimalist layout */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="h-16 w-16 rounded-xl object-cover bg-slate-50 border border-slate-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=0F172A&color=fff`;
              }}
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div>
            <h3 className="font-display font-bold text-base text-slate-900 leading-tight">
              {profile.name}
            </h3>
            <p className="font-mono text-xs text-slate-400">@{profile.username}</p>
            {profile.location && (
              <p className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3 inline text-slate-400" />
                {profile.location}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-lg border-l-2 border-slate-400">
          &ldquo;{profile.bio || "Crafting reliable, scalable software solutions with zero bloat."}&rdquo;
        </p>

        {/* List of Stats - Minimal clean rows with bottom border */}
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-slate-100 pb-2">
            <span className="text-slate-500 text-sm">Total Repositories</span>
            <span className="text-xl font-bold font-display text-slate-900">{stats.totalRepos}</span>
          </div>
          
          <div className="flex justify-between items-end border-b border-slate-100 pb-2">
            <span className="text-slate-500 text-sm">Most Used Language</span>
            <span className="text-xl font-bold font-display text-blue-600">{stats.mostUsedLanguage || "Python"}</span>
          </div>

          <div className="flex justify-between items-end border-b border-slate-100 pb-2">
            <span className="text-slate-500 text-sm">Most Starred Repo</span>
            <span className="text-sm font-semibold font-sans text-slate-800 truncate max-w-[180px]" title={stats.mostStarredRepo}>
              {stats.mostStarredRepo || "None"}
            </span>
          </div>
        </div>

        {/* Highlighted Activity Score Widget Block matching design exactly */}
        <div className="mt-2 p-4 bg-slate-900 rounded-xl text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Activity Score</span>
            <span className="text-base font-mono font-bold">{stats.activityScore}%</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.activityScore || 0}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-blue-500 h-full rounded-full"
            />
          </div>
          <div className="mt-2 flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>{profile.followers} followers</span>
            <span>{stats.totalStars} total stars</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
