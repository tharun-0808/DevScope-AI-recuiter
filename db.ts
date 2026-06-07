import fs from "fs/promises";
import path from "path";
import { DeveloperAnalysisResult, SkillItem, UserProfile, RepoStats, AIAnalysis, CareerCoach, PerformanceMetrics } from "./src/types.ts";
import { mockCandidatesList } from "./src/data/mockCandidates.ts";

const DB_FILE = path.join(process.cwd(), "devscope_db.json");

export interface LocalScores {
  technicalScore: number;
  documentationScore: number;
  activityScore: number;
  maturityScore: number;
  overallScore: number;
  rankRecommendation: "Strong Hire" | "Hire" | "Consider" | "Reject";
}

interface DBData {
  Users: Record<string, {
    username: string;
    name: string;
    avatarUrl: string;
    bio: string;
    company: string;
    location: string;
    followers: number;
    following: number;
    publicRepos: number;
    createdDate: string;
    updatedDate: string;
  }>;
  Repositories: Array<{
    id: number;
    username: string;
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    updatedAt: string;
  }>;
  Skills: Array<{
    id: number;
    username: string;
    skill_name: string;
    score: number;
  }>;
  AnalysisReports: Record<string, {
    username: string;
    overall_score: number;
    technical_score: number;
    documentation_score: number;
    activity_score: number;
    maturity_score: number;
    rank_recommendation: string;
    overall_feedback: string;
    strengths: string;
    weaknesses: string;
    skill_summary: string;
    suggestions: string;
    roadmap: string;
    performance_metrics: string;
    created_at: string;
  }>;
}

// In-Memory Representation
let dbData: DBData = {
  Users: {},
  Repositories: [],
  Skills: [],
  AnalysisReports: {}
};

let dbLoaded = false;

function normalizeDbData(input: Partial<DBData> | null | undefined): DBData {
  return {
    Users: input?.Users && typeof input.Users === "object" && !Array.isArray(input.Users) ? input.Users : {},
    Repositories: Array.isArray(input?.Repositories) ? input.Repositories : [],
    Skills: Array.isArray(input?.Skills) ? input.Skills : [],
    AnalysisReports: input?.AnalysisReports && typeof input.AnalysisReports === "object" && !Array.isArray(input.AnalysisReports) ? input.AnalysisReports : {}
  };
}

async function saveToDisk(): Promise<void> {
  try {
    dbData = normalizeDbData(dbData);
    await fs.writeFile(DB_FILE, JSON.stringify(dbData, null, 2), "utf-8");
  } catch (err) {
    console.error(`[DevScope JSON DB] Failed to save database to ${DB_FILE}:`, err);
  }
}

export async function initDatabase(): Promise<any> {
  if (dbLoaded) {
    return {
      run: async (query: string, params?: any[]) => {
        const q = query.trim().toUpperCase();
        if (q.startsWith("DELETE FROM USERS")) {
          dbData.Users = {};
          dbData.Repositories = [];
          dbData.Skills = [];
          dbData.AnalysisReports = {};
          await saveToDisk();
          console.log("[DevScope JSON DB] Clear database triggered.");
        }
      }
    };
  }

  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");
    dbData = normalizeDbData(JSON.parse(raw));
    dbLoaded = true;
    await saveToDisk();
    console.log(`[DevScope JSON DB] Database loaded successfully from ${DB_FILE}. Loaded ${Object.keys(dbData.Users || {}).length} candidates.`);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      console.log(`[DevScope JSON DB] Database file not found. Initializing empty database at ${DB_FILE}.`);
      await saveToDisk();
      dbLoaded = true;
    } else {
      console.error("[DevScope JSON DB] Error loading database file, initializing empty fallback context:", err);
      dbLoaded = true;
    }
  }

  return {
    run: async (query: string, params?: any[]) => {
      const q = query.trim().toUpperCase();
      if (q.startsWith("DELETE FROM USERS")) {
        dbData.Users = {};
        dbData.Repositories = [];
        dbData.Skills = [];
        dbData.AnalysisReports = {};
        await saveToDisk();
        console.log("[DevScope JSON DB] Re-initialized empty user collection.");
      }
    }
  };
}

export function calculateScoresLocally(
  profile: any,
  repos: { name: string; description: string; language: string; stars: number; forks: number; updatedAt: string; openIssues?: number }[]
): LocalScores {
  const repoCount = repos.length;
  if (repoCount === 0) {
    return {
      technicalScore: 10,
      documentationScore: 10,
      activityScore: 10,
      maturityScore: 10,
      overallScore: 10,
      rankRecommendation: "Reject"
    };
  }

  const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0);
  const totalForks = repos.reduce((sum, r) => sum + (r.forks || 0), 0);
  const languagesUsed = Array.from(new Set(repos.map(r => r.language).filter(Boolean)));

  const langPoints = Math.min(30, languagesUsed.length * 10);
  const repoCountPoints = Math.min(30, repoCount * 3);
  const starsPoints = Math.min(30, totalStars * 1.5);
  const forksComplexityPoints = Math.min(10, totalForks * 2);
  const technicalScore = Math.min(100, Math.round(langPoints + repoCountPoints + starsPoints + forksComplexityPoints));

  const reposWithDesc = repos.filter(r => r.description && r.description.trim().length > 3).length;
  const descRatio = reposWithDesc / repoCount;
  const descRatioPoints = descRatio * 50;

  const totalDescLength = repos.reduce((sum, r) => sum + (r.description ? r.description.length : 0), 0);
  const avgDescLength = reposWithDesc > 0 ? totalDescLength / reposWithDesc : 0;
  const avgDescPoints = Math.min(30, Math.round(avgDescLength * 0.5));

  const wikiOrHasReadmeBonus = repoCount > 0 ? 20 : 0;
  const documentationScore = Math.min(100, Math.round(descRatioPoints + avgDescPoints + wikiOrHasReadmeBonus));

  let recentUpdatesCount = 0;
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  repos.forEach(r => {
    if (!r.updatedAt) return;
    const updateTime = new Date(r.updatedAt);
    if (updateTime >= thirtyDaysAgo) {
      recentUpdatesCount += 3;
    } else if (updateTime >= ninetyDaysAgo) {
      recentUpdatesCount += 1;
    }
  });

  const recentActivityPoints = Math.min(70, recentUpdatesCount * 10 + 20);
  const followersBonus = Math.min(30, (profile.followers || 0) * 0.5);
  const activityScore = Math.min(100, Math.round(recentActivityPoints + followersBonus));

  const langDistribution: Record<string, number> = {};
  repos.forEach(r => {
    if (r.language) {
      langDistribution[r.language] = (langDistribution[r.language] || 0) + 1;
    }
  });

  let primaryLangCount = 0;
  Object.values(langDistribution).forEach(count => {
    if (count > primaryLangCount) primaryLangCount = count;
  });

  const focusRatio = repoCount > 0 ? primaryLangCount / repoCount : 0;
  const focusPoints = Math.min(30, Math.round(focusRatio * 40));

  const starsForksRatioPoints = totalStars > 0 ? Math.min(40, (totalForks / totalStars) * 40 + 20) : 25;
  const structuralConsistencyPoints = repoCount >= 5 ? 30 : repoCount * 6;

  const maturityScore = Math.min(100, Math.round(focusPoints + starsForksRatioPoints + structuralConsistencyPoints));

  const overallScore = Math.round(
    technicalScore * 0.4 +
    documentationScore * 0.2 +
    activityScore * 0.2 +
    maturityScore * 0.2
  );

  let rankRecommendation: "Strong Hire" | "Hire" | "Consider" | "Reject";
  if (overallScore >= 83) {
    rankRecommendation = "Strong Hire";
  } else if (overallScore >= 68) {
    rankRecommendation = "Hire";
  } else if (overallScore >= 45) {
    rankRecommendation = "Consider";
  } else {
    rankRecommendation = "Reject";
  }

  return {
    technicalScore,
    documentationScore,
    activityScore,
    maturityScore,
    overallScore,
    rankRecommendation
  };
}

export async function saveUserData(
  githubRaw: any,
  analysisResult: DeveloperAnalysisResult,
  scores: LocalScores
): Promise<void> {
  await initDatabase();
  const username = githubRaw.username.trim().toLowerCase();

  dbData.Users[username] = {
    username,
    name: githubRaw.name || "",
    avatarUrl: githubRaw.avatarUrl || "",
    bio: githubRaw.bio || "",
    company: githubRaw.company || "",
    location: githubRaw.location || "",
    followers: githubRaw.followers || 0,
    following: githubRaw.following || 0,
    publicRepos: githubRaw.publicRepos || 0,
    createdDate: githubRaw.createdDate || "",
    updatedDate: githubRaw.updatedDate || ""
  };

  dbData.Repositories = dbData.Repositories.filter(r => r.username.toLowerCase() !== username);
  if (githubRaw.repos && Array.isArray(githubRaw.repos)) {
    let currentId = dbData.Repositories.length > 0 ? Math.max(...dbData.Repositories.map(r => r.id)) + 1 : 1;
    for (const repo of githubRaw.repos) {
      dbData.Repositories.push({
        id: currentId++,
        username,
        name: repo.name,
        description: repo.description || "",
        language: repo.language || "Other",
        stars: repo.stars || 0,
        forks: repo.forks || 0,
        updatedAt: repo.updatedAt || ""
      });
    }
  }

  dbData.Skills = dbData.Skills.filter(s => s.username.toLowerCase() !== username);
  if (analysisResult.skills && Array.isArray(analysisResult.skills)) {
    let currentId = dbData.Skills.length > 0 ? Math.max(...dbData.Skills.map(s => s.id)) + 1 : 1;
    for (const skill of analysisResult.skills) {
      dbData.Skills.push({
        id: currentId++,
        username,
        skill_name: skill.name,
        score: skill.score
      });
    }
  }

  dbData.AnalysisReports[username] = {
    username,
    overall_score: scores.overallScore,
    technical_score: scores.technicalScore,
    documentation_score: scores.documentationScore,
    activity_score: scores.activityScore,
    maturity_score: scores.maturityScore,
    rank_recommendation: scores.rankRecommendation,
    overall_feedback: analysisResult.aiAnalysis.overallFeedback || "",
    strengths: JSON.stringify(analysisResult.aiAnalysis.strengths || []),
    weaknesses: JSON.stringify(analysisResult.aiAnalysis.weaknesses || []),
    skill_summary: analysisResult.aiAnalysis.skillSummary || "",
    suggestions: JSON.stringify(analysisResult.careerCoach.suggestions || []),
    roadmap: JSON.stringify(analysisResult.careerCoach.suggestedRoadmap || []),
    performance_metrics: JSON.stringify(analysisResult.performanceMetrics || {}),
    created_at: new Date().toISOString()
  };

  await saveToDisk();
  console.log(`[DevScope JSON DB] Successfully persisted candidate records in database for user @${username}`);
}

export async function getCachedUserData(username: string): Promise<DeveloperAnalysisResult | null> {
  await initDatabase();
  const normUser = username.trim().toLowerCase();

  let uResult = dbData.Users[normUser];
  if (!uResult) {
    const mockCand = mockCandidatesList.find((c: DeveloperAnalysisResult) => c.profile.username.toLowerCase() === normUser);
    if (!mockCand) {
      return null;
    }
    // Seed candidate beautifully!
    dbData.Users[normUser] = {
      username: mockCand.profile.username,
      name: mockCand.profile.name,
      avatarUrl: mockCand.profile.avatarUrl || "",
      bio: mockCand.profile.bio || "",
      company: mockCand.profile.company || "",
      location: mockCand.profile.location || "",
      followers: mockCand.profile.followers || 0,
      following: 50,
      publicRepos: mockCand.profile.publicRepos || 0,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };

    // Seed Repositories
    dbData.Repositories = dbData.Repositories.filter(r => r.username.toLowerCase() !== normUser);
    let currentRepoId = dbData.Repositories.length > 0 ? Math.max(...dbData.Repositories.map(r => r.id)) + 1 : 1;
    const mockRepos = [
      { name: mockCand.stats.mostStarredRepo || "source-repo", description: "Primary candidate code repository analyzed.", stars: mockCand.stats.totalStars || 0, forks: 4 }
    ];
    for (const repo of mockRepos) {
      dbData.Repositories.push({
        id: currentRepoId++,
        username: normUser,
        name: repo.name,
        description: repo.description,
        language: mockCand.stats.mostUsedLanguage || "TypeScript",
        stars: repo.stars,
        forks: repo.forks,
        updatedAt: new Date().toISOString()
      });
    }

    // Seed Skills
    dbData.Skills = dbData.Skills.filter(s => s.username.toLowerCase() !== normUser);
    let currentSkillId = dbData.Skills.length > 0 ? Math.max(...dbData.Skills.map(s => s.id)) + 1 : 1;
    for (const skill of mockCand.skills) {
      dbData.Skills.push({
        id: currentSkillId++,
        username: normUser,
        skill_name: skill.name,
        score: skill.score
      });
    }

    // Seed Analysis Report
    dbData.AnalysisReports[normUser] = {
      username: normUser,
      overall_score: mockCand.stats.activityScore || 80,
      technical_score: mockCand.stats.activityScore || 80,
      documentation_score: mockCand.stats.activityScore || 80,
      activity_score: mockCand.stats.activityScore || 80,
      maturity_score: mockCand.stats.activityScore || 80,
      rank_recommendation: (mockCand.stats.activityScore || 80) >= 83 ? "Strong Hire" : "Hire",
      overall_feedback: mockCand.aiAnalysis.overallFeedback || "",
      strengths: JSON.stringify(mockCand.aiAnalysis.strengths || []),
      weaknesses: JSON.stringify(mockCand.aiAnalysis.weaknesses || []),
      skill_summary: mockCand.aiAnalysis.overallFeedback || "",
      suggestions: JSON.stringify(mockCand.careerCoach.suggestions || []),
      roadmap: JSON.stringify(mockCand.careerCoach.suggestedRoadmap || []),
      performance_metrics: JSON.stringify(mockCand.performanceMetrics || {}),
      created_at: new Date().toISOString()
    };

    await saveToDisk();
    uResult = dbData.Users[normUser];
  }

  const reposResult = dbData.Repositories.filter(r => r.username.toLowerCase() === normUser);
  const skillsResult = dbData.Skills.filter(s => s.username.toLowerCase() === normUser);
  
  const rResult = dbData.AnalysisReports[normUser];
  if (!rResult) return null;

  const profile: UserProfile = {
    username: uResult.username,
    name: uResult.name || "",
    avatarUrl: uResult.avatarUrl || "",
    bio: uResult.bio || "",
    company: uResult.company || "",
    location: uResult.location || "",
    followers: uResult.followers || 0,
    publicRepos: uResult.publicRepos || 0
  };

  const repoStats = reposResult.map((r: any) => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stars,
    updatedAt: r.updatedAt,
    forks: r.forks
  }));

  const langCounts: Record<string, number> = {};
  let mostStarredRepo = "None";
  let maxStars = -1;
  let totalStars = 0;

  repoStats.forEach(r => {
    totalStars += r.stars;
    if (r.stars > maxStars) {
      maxStars = r.stars;
      mostStarredRepo = r.name;
    }
    if (r.language && r.language !== "Other") {
      langCounts[r.language] = (langCounts[r.language] || 0) + 1;
    }
  });

  let mostUsedLanguage = "Other";
  let maxLangCount = 0;
  Object.entries(langCounts).forEach(([lang, count]) => {
    if (count > maxLangCount) {
      maxLangCount = count;
      mostUsedLanguage = lang;
    }
  });

  const stats: RepoStats = {
    totalRepos: uResult.publicRepos || repoStats.length,
    mostUsedLanguage: mostUsedLanguage,
    mostStarredRepo: mostStarredRepo,
    activityScore: Math.round(rResult.activity_score || 50),
    totalStars: totalStars
  };

  const aiAnalysis: AIAnalysis = {
    overallFeedback: rResult.overall_feedback || "",
    strengths: JSON.parse(rResult.strengths || "[]"),
    weaknesses: JSON.parse(rResult.weaknesses || "[]"),
    skillSummary: rResult.skill_summary || ""
  };

  const careerCoach: CareerCoach = {
    target: "Software Engineer",
    suggestions: JSON.parse(rResult.suggestions || "[]"),
    suggestedRoadmap: JSON.parse(rResult.roadmap || "[]")
  };

  const performanceMetrics: PerformanceMetrics = JSON.parse(rResult.performance_metrics || "{}");

  const skills: SkillItem[] = skillsResult.map((sk: any) => ({
    name: sk.skill_name,
    score: sk.score
  }));

  if (aiAnalysis.overallFeedback.includes("architect") || aiAnalysis.overallFeedback.includes("Architect")) {
    careerCoach.target = "Backend Systems Architect";
  } else if (aiAnalysis.overallFeedback.includes("Full Stack") || aiAnalysis.overallFeedback.includes("full-stack")) {
    careerCoach.target = "Full Stack Software Engineer";
  } else if (stats.mostUsedLanguage === "Python") {
    careerCoach.target = "AI & Backend Engineer";
  } else if (stats.mostUsedLanguage === "TypeScript" || stats.mostUsedLanguage === "JavaScript") {
    careerCoach.target = "Frontend & Product Developer";
  }

  return {
    profile,
    stats,
    aiAnalysis,
    careerCoach,
    skills,
    performanceMetrics
  };
}

export async function getAllCachedCandidates(): Promise<any[]> {
  await initDatabase();

  const list: any[] = [];
  for (const [normUser, user] of Object.entries(dbData.Users)) {
    const fullCand = await getCachedUserData(user.username);
    if (fullCand) {
      list.push(fullCand);
    } else {
      const report = dbData.AnalysisReports[normUser];
      const overallScore = report ? (report.overall_score || 70) : 70;
      list.push({
        profile: {
          username: user.username,
          name: user.name || user.username,
          avatarUrl: user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}&background=ec4899&color=fff`,
          bio: user.bio || "",
          company: user.company || "",
          location: user.location || "",
          followers: user.followers || 0,
          publicRepos: user.publicRepos || 0
        },
        stats: {
          totalRepos: user.publicRepos || 0,
          mostUsedLanguage: "TypeScript",
          mostStarredRepo: "",
          activityScore: overallScore,
          totalStars: 0
        },
        aiAnalysis: {
          overallFeedback: report ? (report.overall_feedback || "") : "",
          strengths: report ? JSON.parse(report.strengths || "[]") : [],
          weaknesses: report ? JSON.parse(report.weaknesses || "[]") : []
        },
        careerCoach: {
          target: "Software Engineer",
          suggestions: report ? JSON.parse(report.suggestions || "[]") : [],
          suggestedRoadmap: report ? JSON.parse(report.roadmap || "[]") : []
        },
        skills: [],
        performanceMetrics: report ? JSON.parse(report.performance_metrics || "{}") : {
          cognitiveComplexity: 0,
          maintainabilityIndex: 70,
          testCoverage: 50,
          documentationRatio: 50,
          realTimeActiveAnalyses: []
        }
      });
    }
  }

  list.sort((a, b) => {
    const scoreA = Math.round(
      ((a.stats?.activityScore ?? 75) * 0.35) + 
      ((a.performanceMetrics?.maintainabilityIndex ?? 70) * 0.35) + 
      (Math.min(100, (a.stats?.totalRepos ?? 10) * 1.5) * 0.15) +
      ((a.performanceMetrics?.testCoverage ?? 50) * 0.15)
    );
    const scoreB = Math.round(
      ((b.stats?.activityScore ?? 75) * 0.35) + 
      ((b.performanceMetrics?.maintainabilityIndex ?? 70) * 0.35) + 
      (Math.min(100, (b.stats?.totalRepos ?? 10) * 1.5) * 0.15) +
      ((b.performanceMetrics?.testCoverage ?? 50) * 0.15)
    );
    return scoreB - scoreA;
  });

  return list;
}
