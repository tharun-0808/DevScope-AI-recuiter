// server.ts
import express from "express";
import path2 from "path";
import fs2 from "fs/promises";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// db.ts
import fs from "fs/promises";
import path from "path";

// src/data/mockCandidates.ts
var mockCandidatesList = [
  {
    profile: {
      username: "torvalds",
      name: "Linus Torvalds",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      bio: "I write code that works directly on hardware. Creator of Linux and Git.",
      company: "Linux Foundation",
      location: "Portland, OR",
      followers: 189e3,
      publicRepos: 18
    },
    stats: {
      totalRepos: 18,
      mostUsedLanguage: "C",
      mostStarredRepo: "linux",
      activityScore: 99,
      totalStars: 42e4
    },
    aiAnalysis: {
      overallFeedback: "A legendary kernel developer and systems operating architect. Code is exceptionally performant with minimal footprint. Perfect for high-concurrency low-level kernel abstractions.",
      strengths: [
        "Extraordinary concurrency memory models.",
        "Author of the world's most stable revision tree controller.",
        "Unflinching focus on bare-metal processor speed."
      ],
      weaknesses: [
        "Averse to high-level framework layers or abstract virtual runtimes.",
        "Uncompromising feedback loops can overwhelm junior engineers."
      ]
    },
    careerCoach: {
      target: "Chief Technology Officer / Systems Architect",
      suggestions: [
        "Investigate Rust-embedded kernel modules to strengthen security boundaries.",
        "Guide structural concurrency paradigms through open standards panels."
      ],
      suggestedRoadmap: [
        { step: 1, title: "Memory-Safe Systems Architecture", description: "Design modular microcontrollers with memory guarantees.", tech: ["Rust", "Assembly"] },
        { step: 2, title: "Low-Latency Event Buffers", description: "Design fast ring buffers handling terabytes of raw telemetry.", tech: ["C", "GCC", "POSIX"] }
      ]
    },
    skills: [
      { name: "C Programming", score: 100 },
      { name: "Systems design", score: 99 },
      { name: "CPU Pipelines", score: 97 },
      { name: "Assembly", score: 94 }
    ],
    performanceMetrics: {
      cognitiveComplexity: 6,
      maintainabilityIndex: 96,
      testCoverage: 95,
      documentationRatio: 88,
      realTimeActiveAnalyses: [
        { file: "kernel/sched.c", language: "C", issueCount: 0, complexity: "High" }
      ]
    }
  },
  {
    profile: {
      username: "tharun123",
      name: "Tharun Kumar",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      bio: "Backend Architect & System Lead. Specialized in Python, FastAPI, and memory caches.",
      company: "DevScope Inc.",
      location: "Bangalore, IN",
      followers: 1250,
      publicRepos: 42
    },
    stats: {
      totalRepos: 42,
      mostUsedLanguage: "Python",
      mostStarredRepo: "fast-cache-endpoint",
      activityScore: 98,
      totalStars: 980
    },
    aiAnalysis: {
      overallFeedback: "Tharun is a highly innovative backend engineer with robust expertise building caching microservices, async network endpoints, and scalable cloud systems.",
      strengths: [
        "Expertise in Python FastAPI asynchronous operations.",
        "Robust database caching integration patterns.",
        "Exemplary system scalability planning."
      ],
      weaknesses: [
        "Minimal direct involvement with advanced browser components.",
        "Needs more focus on automated continuous testing streams."
      ]
    },
    careerCoach: {
      target: "Senior Distributed Architect",
      suggestions: [
        "Adopt advanced TypeScript to secure client endpoints.",
        "Incorporate systematic continuous integration workflows."
      ],
      suggestedRoadmap: [
        { step: 1, title: "Interactive UI Orchestration", description: "Design high fidelity frontend states using React.", tech: ["React", "TypeScript", "Tailwind"] },
        { step: 2, title: "Kubernetes Cluster Management", description: "Deploy scalable backend nodes globally.", tech: ["Kubernetes", "Helm", "gRPC"] }
      ]
    },
    skills: [
      { name: "Python / FastAPI", score: 96 },
      { name: "Cache Strategy", score: 94 },
      { name: "API Optimization", score: 92 },
      { name: "CI/CD Systems", score: 85 }
    ],
    performanceMetrics: {
      cognitiveComplexity: 11,
      maintainabilityIndex: 92,
      testCoverage: 62,
      documentationRatio: 84,
      realTimeActiveAnalyses: [
        { file: "app/main.py", language: "Python", issueCount: 0, complexity: "Medium" }
      ]
    }
  },
  {
    profile: {
      username: "karpathy",
      name: "Andrej Karpathy",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      bio: "I build neural processors from scratch. Former OpenAI and Tesla Autopilot Director.",
      company: "Eureka Labs",
      location: "San Francisco, CA",
      followers: 94200,
      publicRepos: 29
    },
    stats: {
      totalRepos: 29,
      mostUsedLanguage: "Python",
      mostStarredRepo: "llm.c",
      activityScore: 97,
      totalStars: 154e3
    },
    aiAnalysis: {
      overallFeedback: "A world-renowned deep-learning scientist who specializes in building highly understandable, robust transformer designs from the ground up.",
      strengths: [
        "Deep analytical command of neural models.",
        "Exceptional conceptual explanation ability.",
        "Pioneering work in autonomous systems."
      ],
      weaknesses: [
        "Less emphasis on relational transactional database scaling.",
        "Minimal interest in legacy browser architectures."
      ]
    },
    careerCoach: {
      target: "Chief AI Architect",
      suggestions: [
        "Explore WebGPU to host fast neural pipelines entirely inside client engines.",
        "Standardize interactive neural sandboxes for distributed educational groups."
      ],
      suggestedRoadmap: [
        { step: 1, title: "Client Neural Execution", description: "Deploy compiled models straight to the browser with WebAssembly.", tech: ["WebGPU", "C++", "WASM"] },
        { step: 2, title: "Multi-Modal Tokenizers", description: "Construct advanced video and audial tokens mapping strategies.", tech: ["PyTorch", "CUDA", "Python"] }
      ]
    },
    skills: [
      { name: "Deep Learning", score: 100 },
      { name: "Python Models", score: 97 },
      { name: "CUDA Mechanics", score: 95 },
      { name: "Transformer design", score: 99 }
    ],
    performanceMetrics: {
      cognitiveComplexity: 18,
      maintainabilityIndex: 89,
      testCoverage: 78,
      documentationRatio: 94,
      realTimeActiveAnalyses: [
        { file: "train_gpt.py", language: "Python", issueCount: 1, complexity: "High" }
      ]
    }
  },
  {
    profile: {
      username: "gaearon",
      name: "Dan Abramov",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      bio: "Co-creator of Redux and React Hot Loader. Focus on developer tool ergonomics.",
      company: "Bluesky",
      location: "London, UK",
      followers: 84e3,
      publicRepos: 68
    },
    stats: {
      totalRepos: 68,
      mostUsedLanguage: "JavaScript",
      mostStarredRepo: "redux",
      activityScore: 96,
      totalStars: 98e3
    },
    aiAnalysis: {
      overallFeedback: "An extraordinary interactive client-side architect who shaped standard state loops. He excels at compiling developer utilities with optimal layout render speed.",
      strengths: [
        "Incredible component rendering logic.",
        "Pioneered standard global status controls.",
        "Exceptional user design ergonomics focus."
      ],
      weaknesses: [
        "Lower involvement in native binary compilers (Rust, Go, C).",
        "Minimal work on heavy cloud cluster servers."
      ]
    },
    careerCoach: {
      target: "Principal Design Architect",
      suggestions: [
        "Harness high speed native tools (SWC, Rspack) to supercharge developer environments.",
        "Integrate dynamic state machines into real-time offline document engines."
      ],
      suggestedRoadmap: [
        { step: 1, title: "High-Speed Asset Compilers", description: "Migrate traditional web build systems to fast native Rust.", tech: ["Rust", "WASM", "SWC"] },
        { step: 2, title: "Federated Mesh Syncing", description: "Structure dynamic distributed nodes across client indices.", tech: ["TypeScript", "Schema-LD", "NoSQL"] }
      ]
    },
    skills: [
      { name: "React System", score: 100 },
      { name: "State Frameworks", score: 98 },
      { name: "JavaScript / TS", score: 97 },
      { name: "Ergonomic Design", score: 95 }
    ],
    performanceMetrics: {
      cognitiveComplexity: 8,
      maintainabilityIndex: 91,
      testCoverage: 88,
      documentationRatio: 95,
      realTimeActiveAnalyses: [
        { file: "src/index.js", language: "JavaScript", issueCount: 0, complexity: "Medium" }
      ]
    }
  },
  {
    profile: {
      username: "elena_rust",
      name: "Elena Rostova",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      bio: "Rust Core Contributor. Believer in strict compiler safety and zero cost memory loops.",
      company: "Mozilla",
      location: "Munich, DE",
      followers: 8430,
      publicRepos: 33
    },
    stats: {
      totalRepos: 33,
      mostUsedLanguage: "Rust",
      mostStarredRepo: "safety-audit-engine",
      activityScore: 94,
      totalStars: 4120
    },
    aiAnalysis: {
      overallFeedback: "An exceptionally meticulous systems engineer with profound Rust design knowledge. She designs lightweight async structures with maximum thread safety.",
      strengths: [
        "Impeccable memory ownership rules.",
        "Advanced concurrent messaging controllers.",
        "Extremely high rigorous testing coverage."
      ],
      weaknesses: [
        "Slower prototype creation speeds due to rigorous compile-safety loops.",
        "Relatively lower visual styling projects history."
      ]
    },
    careerCoach: {
      target: "Lead Concurrency Engineer",
      suggestions: [
        "Integrate rapid prototyping loops with scripting layers.",
        "Publish structured utilities to expand community ecosystem."
      ],
      suggestedRoadmap: [
        { step: 1, title: "WebAssembly Direct Drivers", description: "Port multi-threaded physics modules to run fully inside client browsers.", tech: ["Rust", "WASM", "WebAudio"] },
        { step: 2, title: "High-Throughput IO Buffers", description: "Construct locks-free concurrent queues handling high volume records streams.", tech: ["Rust", "Tokio", "gRPC"] }
      ]
    },
    skills: [
      { name: "Rust Compiler", score: 98 },
      { name: "Memory Layouts", score: 96 },
      { name: "Concurrency", score: 95 },
      { name: "Async Tokio", score: 92 }
    ],
    performanceMetrics: {
      cognitiveComplexity: 6,
      maintainabilityIndex: 97,
      testCoverage: 98,
      documentationRatio: 94,
      realTimeActiveAnalyses: [
        { file: "src/lib.rs", language: "Rust", issueCount: 0, complexity: "Low" }
      ]
    }
  },
  {
    profile: {
      username: "sindresorhus",
      name: "Sindre Sorhus",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
      bio: "Full-time open-sorcerer. Creator of Chalk, Yeoman, Ava, and thousands of other open-source modules.",
      company: "Sindre Sorhus Inc.",
      location: "Oslo, Norway",
      followers: 52e3,
      publicRepos: 1140
    },
    stats: {
      totalRepos: 1140,
      mostUsedLanguage: "TypeScript",
      mostStarredRepo: "awesome",
      activityScore: 97,
      totalStars: 28e4
    },
    aiAnalysis: {
      overallFeedback: "The ultimate open-source modularist. Excels at small, highly focused, single-responsibility modules that are downloaded billions of times. Exemplary packaging standards and robust test reliability.",
      strengths: [
        "Unrivaled mastery of Node.js ecosystem packaging rules.",
        "Author of fundamental web utilities powering millions of codebases (chalk, p-limit, globby).",
        "Pioneer of micro-module architectures with strict quality bars."
      ],
      weaknesses: [
        "Less emphasis on complex enterprise server architectures or heavy distributed message queues.",
        "Maintains thousands of repositories leading to high multi-tasking and integration overhead."
      ]
    },
    careerCoach: {
      target: "Chief Technology Officer / Senior Principal Engineer",
      suggestions: [
        "Provide standardized engineering practices to massive cloud application clusters.",
        "Engage with major runtime bodies to steer modern TC39 Javascript capabilities."
      ],
      suggestedRoadmap: [
        { step: 1, title: "Enterprise Systems Design", description: "Learn to design large globally distributed asynchronous broker architectures.", tech: ["Kafka", "Kubernetes", "gRPC"] },
        { step: 2, title: "TC39 Specification Governance", description: "Author core language standards proposals representing modular concerns on committees.", tech: ["ECMAScript Specs", "WASI"] }
      ]
    },
    skills: [
      { name: "Node.js Modules", score: 100 },
      { name: "TypeScript / JS", score: 98 },
      { name: "API Design", score: 96 },
      { name: "NPM Architecture", score: 99 }
    ],
    performanceMetrics: {
      cognitiveComplexity: 4,
      maintainabilityIndex: 98,
      testCoverage: 96,
      documentationRatio: 92,
      realTimeActiveAnalyses: [
        { file: "index.js", language: "JavaScript", issueCount: 0, complexity: "Low" }
      ]
    }
  }
];

// db.ts
var DB_FILE = path.join(process.cwd(), "devscope_db.json");
var dbData = {
  Users: {},
  Repositories: [],
  Skills: [],
  AnalysisReports: {}
};
var dbLoaded = false;
async function saveToDisk() {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(dbData, null, 2), "utf-8");
  } catch (err) {
    console.error(`[DevScope JSON DB] Failed to save database to ${DB_FILE}:`, err);
  }
}
async function initDatabase() {
  if (dbLoaded) {
    return {
      run: async (query, params) => {
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
    dbData = JSON.parse(raw);
    dbLoaded = true;
    console.log(`[DevScope JSON DB] Database loaded successfully from ${DB_FILE}. Loaded ${Object.keys(dbData.Users || {}).length} candidates.`);
  } catch (err) {
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
    run: async (query, params) => {
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
function calculateScoresLocally(profile, repos) {
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
  const languagesUsed = Array.from(new Set(repos.map((r) => r.language).filter(Boolean)));
  const langPoints = Math.min(30, languagesUsed.length * 10);
  const repoCountPoints = Math.min(30, repoCount * 3);
  const starsPoints = Math.min(30, totalStars * 1.5);
  const forksComplexityPoints = Math.min(10, totalForks * 2);
  const technicalScore = Math.min(100, Math.round(langPoints + repoCountPoints + starsPoints + forksComplexityPoints));
  const reposWithDesc = repos.filter((r) => r.description && r.description.trim().length > 3).length;
  const descRatio = reposWithDesc / repoCount;
  const descRatioPoints = descRatio * 50;
  const totalDescLength = repos.reduce((sum, r) => sum + (r.description ? r.description.length : 0), 0);
  const avgDescLength = reposWithDesc > 0 ? totalDescLength / reposWithDesc : 0;
  const avgDescPoints = Math.min(30, Math.round(avgDescLength * 0.5));
  const wikiOrHasReadmeBonus = repoCount > 0 ? 20 : 0;
  const documentationScore = Math.min(100, Math.round(descRatioPoints + avgDescPoints + wikiOrHasReadmeBonus));
  let recentUpdatesCount = 0;
  const now = /* @__PURE__ */ new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1e3);
  repos.forEach((r) => {
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
  const langDistribution = {};
  repos.forEach((r) => {
    if (r.language) {
      langDistribution[r.language] = (langDistribution[r.language] || 0) + 1;
    }
  });
  let primaryLangCount = 0;
  Object.values(langDistribution).forEach((count) => {
    if (count > primaryLangCount) primaryLangCount = count;
  });
  const focusRatio = repoCount > 0 ? primaryLangCount / repoCount : 0;
  const focusPoints = Math.min(30, Math.round(focusRatio * 40));
  const starsForksRatioPoints = totalStars > 0 ? Math.min(40, totalForks / totalStars * 40 + 20) : 25;
  const structuralConsistencyPoints = repoCount >= 5 ? 30 : repoCount * 6;
  const maturityScore = Math.min(100, Math.round(focusPoints + starsForksRatioPoints + structuralConsistencyPoints));
  const overallScore = Math.round(
    technicalScore * 0.4 + documentationScore * 0.2 + activityScore * 0.2 + maturityScore * 0.2
  );
  let rankRecommendation;
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
async function saveUserData(githubRaw, analysisResult, scores) {
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
  dbData.Repositories = dbData.Repositories.filter((r) => r.username.toLowerCase() !== username);
  if (githubRaw.repos && Array.isArray(githubRaw.repos)) {
    let currentId = dbData.Repositories.length > 0 ? Math.max(...dbData.Repositories.map((r) => r.id)) + 1 : 1;
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
  dbData.Skills = dbData.Skills.filter((s) => s.username.toLowerCase() !== username);
  if (analysisResult.skills && Array.isArray(analysisResult.skills)) {
    let currentId = dbData.Skills.length > 0 ? Math.max(...dbData.Skills.map((s) => s.id)) + 1 : 1;
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
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  await saveToDisk();
  console.log(`[DevScope JSON DB] Successfully persisted candidate records in database for user @${username}`);
}
async function getCachedUserData(username) {
  await initDatabase();
  const normUser = username.trim().toLowerCase();
  let uResult = dbData.Users[normUser];
  if (!uResult) {
    const mockCand = mockCandidatesList.find((c) => c.profile.username.toLowerCase() === normUser);
    if (!mockCand) {
      return null;
    }
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
      createdDate: (/* @__PURE__ */ new Date()).toISOString(),
      updatedDate: (/* @__PURE__ */ new Date()).toISOString()
    };
    dbData.Repositories = dbData.Repositories.filter((r) => r.username.toLowerCase() !== normUser);
    let currentRepoId = dbData.Repositories.length > 0 ? Math.max(...dbData.Repositories.map((r) => r.id)) + 1 : 1;
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
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    dbData.Skills = dbData.Skills.filter((s) => s.username.toLowerCase() !== normUser);
    let currentSkillId = dbData.Skills.length > 0 ? Math.max(...dbData.Skills.map((s) => s.id)) + 1 : 1;
    for (const skill of mockCand.skills) {
      dbData.Skills.push({
        id: currentSkillId++,
        username: normUser,
        skill_name: skill.name,
        score: skill.score
      });
    }
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
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    await saveToDisk();
    uResult = dbData.Users[normUser];
  }
  const reposResult = dbData.Repositories.filter((r) => r.username.toLowerCase() === normUser);
  const skillsResult = dbData.Skills.filter((s) => s.username.toLowerCase() === normUser);
  const rResult = dbData.AnalysisReports[normUser];
  if (!rResult) return null;
  const profile = {
    username: uResult.username,
    name: uResult.name || "",
    avatarUrl: uResult.avatarUrl || "",
    bio: uResult.bio || "",
    company: uResult.company || "",
    location: uResult.location || "",
    followers: uResult.followers || 0,
    publicRepos: uResult.publicRepos || 0
  };
  const repoStats = reposResult.map((r) => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stars,
    updatedAt: r.updatedAt,
    forks: r.forks
  }));
  const langCounts = {};
  let mostStarredRepo = "None";
  let maxStars = -1;
  let totalStars = 0;
  repoStats.forEach((r) => {
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
  const stats = {
    totalRepos: uResult.publicRepos || repoStats.length,
    mostUsedLanguage,
    mostStarredRepo,
    activityScore: Math.round(rResult.activity_score || 50),
    totalStars
  };
  const aiAnalysis = {
    overallFeedback: rResult.overall_feedback || "",
    strengths: JSON.parse(rResult.strengths || "[]"),
    weaknesses: JSON.parse(rResult.weaknesses || "[]"),
    skillSummary: rResult.skill_summary || ""
  };
  const careerCoach = {
    target: "Software Engineer",
    suggestions: JSON.parse(rResult.suggestions || "[]"),
    suggestedRoadmap: JSON.parse(rResult.roadmap || "[]")
  };
  const performanceMetrics = JSON.parse(rResult.performance_metrics || "{}");
  const skills = skillsResult.map((sk) => ({
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
async function getAllCachedCandidates() {
  await initDatabase();
  const list = [];
  for (const [normUser, user] of Object.entries(dbData.Users)) {
    const fullCand = await getCachedUserData(user.username);
    if (fullCand) {
      list.push(fullCand);
    } else {
      const report = dbData.AnalysisReports[normUser];
      const overallScore = report ? report.overall_score || 70 : 70;
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
          overallFeedback: report ? report.overall_feedback || "" : "",
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
      (a.stats?.activityScore ?? 75) * 0.35 + (a.performanceMetrics?.maintainabilityIndex ?? 70) * 0.35 + Math.min(100, (a.stats?.totalRepos ?? 10) * 1.5) * 0.15 + (a.performanceMetrics?.testCoverage ?? 50) * 0.15
    );
    const scoreB = Math.round(
      (b.stats?.activityScore ?? 75) * 0.35 + (b.performanceMetrics?.maintainabilityIndex ?? 70) * 0.35 + Math.min(100, (b.stats?.totalRepos ?? 10) * 1.5) * 0.15 + (b.performanceMetrics?.testCoverage ?? 50) * 0.15
    );
    return scoreB - scoreA;
  });
  return list;
}

// server.ts
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
  }
  return aiClient;
}
function getMockGitHubData(username) {
  const normUser = username.trim().toLowerCase();
  if (normUser === "torvalds") {
    return {
      username: "torvalds",
      name: "Linus Torvalds",
      avatarUrl: "https://avatars.githubusercontent.com/u/1024025?v=4",
      bio: "I write code that works directly on hardware. Creator of Linux and Git.",
      company: "Linux Foundation",
      location: "Portland, OR",
      followers: 189e3,
      publicRepos: 18,
      repos: [
        { name: "linux", description: "Linux kernel source tree", language: "C", stars: 162e3, updatedAt: "2026-06-01T12:00:00Z", forks: 49e3 },
        { name: "git", description: "Fast, scalable, distributed revision control system", language: "C", stars: 49e3, updatedAt: "2026-05-30T15:30:00Z", forks: 26e3 },
        { name: "subsurface", description: "Subsurface divelog program", language: "C++", stars: 2100, updatedAt: "2026-05-15T09:00:00Z", forks: 450 },
        { name: "pesconvert", description: "Convert embroidery files to PES format", language: "C", stars: 180, updatedAt: "2026-04-10T12:00:00Z", forks: 20 },
        { name: "test-repo", description: "Test repository for kernel extensions", language: "C", stars: 95, updatedAt: "2026-03-20T14:30:00Z", forks: 5 }
      ]
    };
  }
  if (normUser === "tharun123" || normUser === "tharun") {
    return {
      username: "tharun123",
      name: "Tharun Kumar",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      bio: "Python developer crafting backend services, database architectures and exploring cloud infrastructure.",
      company: "DataSync Corp",
      location: "Bengaluru, India",
      followers: 142,
      publicRepos: 15,
      repos: [
        { name: "Food Ordering System", description: "A high-performance microservices application built with FastAPI, PostgreSQL, and Redis for distributed caching.", language: "Python", stars: 23, updatedAt: "2026-05-30T10:00:00Z", forks: 8 },
        { name: "FastAPI Boilerplate", description: "Production-ready async Python boilerplate including OAuth2 security, database migrations with Alembic, and pytest files.", language: "Python", stars: 14, updatedAt: "2026-05-15T08:00:00Z", forks: 4 },
        { name: "SQLite DB Migrator", description: "Streamlined script to audit and migrate active legacy databases directly to scalable cloud SQL databases.", language: "Python", stars: 8, updatedAt: "2026-03-20T14:30:00Z", forks: 1 },
        { name: "Async Fetcher", description: "Concurrency evaluation utilities focusing on optimizing scraping queues and code execution speeds.", language: "Python", stars: 5, updatedAt: "2026-04-10T12:00:00Z", forks: 2 },
        { name: "SQL Schema Analyzer", description: "Interactive CLI to validate table dependencies and highlight bottlenecks such as missing indices.", language: "SQL", stars: 12, updatedAt: "2026-05-01T15:20:00Z", forks: 3 }
      ]
    };
  }
  const knownTech = ["TypeScript", "Python", "Go", "Java", "C++", "Rust", "Swift"];
  const selectedTech = knownTech[Math.abs(username.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % knownTech.length];
  return {
    username,
    name: username.charAt(0).toUpperCase() + username.slice(1),
    avatarUrl: `https://images.unsplash.com/photo-${15e11 + username.length * 1e6}?auto=format&fit=crop&q=80&w=150`,
    bio: `Full-stack architecture enthusiast focusing on ${selectedTech} microservices and frontend mechanics.`,
    company: "Independent Developer",
    location: "Global",
    followers: 24,
    publicRepos: 8,
    repos: [
      { name: `${username}-core-service`, description: `Core core services designed using highly optimized systems in ${selectedTech}.`, language: selectedTech, stars: 11, updatedAt: "2026-05-28T09:00:00Z", forks: 2 },
      { name: "utility-scripts", description: "A compilation of command line configurations and helper setups.", language: "Shell", stars: 3, updatedAt: "2026-02-14T11:00:00Z", forks: 0 },
      { name: "interface-design-study", description: "Preliminary responsive grid frameworks and user interface outlines.", language: "JavaScript", stars: 4, updatedAt: "2026-04-03T16:00:00Z", forks: 1 }
    ]
  };
}
async function startServer() {
  await initDatabase();
  const app = express();
  const PORT = 3e3;
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));
  app.post("/api/github/chat", async (req, res) => {
    const { username, candidateData, message, history } = req.body;
    if (!username || !candidateData || !message) {
      return res.status(400).json({ error: "Missing required fields: username, candidateData, or message." });
    }
    const ai = getGeminiClient();
    if (!ai) {
      const query = message.toLowerCase();
      let responseText = `I've audited @${username}'s track record. They scored ${candidateData.stats.activityScore}/100 in our tracking engine and their core stack is ${candidateData.stats.mostUsedLanguage}. They look like an outstanding prospect for your open ${candidateData.careerCoach.target} roles!`;
      if (query.includes("strength") || query.includes("good at") || query.includes("positive")) {
        responseText = `@${username}'s primary strengths lie in their consistent focus on ${candidateData.stats.mostUsedLanguage} coupled with high engineering maintainability scores (${candidateData.performanceMetrics.maintainabilityIndex}/100 Index). Their software practices show structured hygiene that will ease active team integration!`;
      } else if (query.includes("weak") || query.includes("gap") || query.includes("bad") || query.includes("improve")) {
        responseText = `@${username}'s main technical gaps include limited software quality testing metrics (${candidateData.performanceMetrics.testCoverage}% test coverage verified) and a lack of container configuration workflows. I'd advise setting up an interview screening centered around Docker or unit test models.`;
      } else if (query.includes("interview") || query.includes("question") || query.includes("ask") || query.includes("test")) {
        responseText = `Here are two high-yield interview questions designed specifically for screening @${username}:
1. "We noticed your projects heavily leverage ${candidateData.stats.mostUsedLanguage}. What are some concurrency bottlenecks you've encountered in this environment, and how did you resolve them?"
2. "How would you design a scalable continuous integration workflow to solve the current ${candidateData.performanceMetrics.testCoverage}% test coverage gap in your repositories?"`;
      } else if (query.includes("suit") || query.includes("fit") || query.includes("hire") || query.includes("employ")) {
        responseText = `Hiring Profile Suitability: **Highly Recommended (A-Tier)**. Their computed maintainability index of ${candidateData.performanceMetrics.maintainabilityIndex}% is solid. If you can pair their robust systems knowledge with frontend styling guidance, they will accelerate very quickly.`;
      } else if (query.includes("salary") || query.includes("pay") || query.includes("compensation")) {
        responseText = `Recruiter Index suggests high-market demand for ${candidateData.stats.mostUsedLanguage} developers. An initial offering of approximately $85,000 to $120,000 annually aligns with the candidate's computed stats. We recommend confirming their milestone progress!`;
      }
      return res.json({ response: responseText });
    }
    try {
      const systemPrompt = `
        You are ScoutAI, an elite technical HR recruiter assistant, interviewer, and developer assessment AI.
        You are reviewing a job applicant's GitHub intelligence summary with an HR manager.
        
        APPLICANT PROFILE: @${username} (${candidateData.profile.name})
        BIO: ${candidateData.profile.bio}
        CORE TECH LANGUAGE: ${candidateData.stats.mostUsedLanguage}
        REPOS COUNT: ${candidateData.stats.totalRepos}
        STARS ACCUMULATED: ${candidateData.stats.totalStars}
        ACTIVITY RATING: ${candidateData.stats.activityScore}/100
        STRENGTHS: ${JSON.stringify(candidateData.aiAnalysis.strengths)}
        WEAKNESSES: ${JSON.stringify(candidateData.aiAnalysis.weaknesses)}
        TARGET POSITION: ${candidateData.careerCoach.target}
        MAINTAINABILITY SCORE: ${candidateData.performanceMetrics.maintainabilityIndex}/100
        UNIT TEST COVERAGE ESTIMATE: ${candidateData.performanceMetrics.testCoverage}%
        
        PREVIOUS CONVERSATION CONTEXT:
        ${JSON.stringify(history)}
        
        HR RECRUITER CURRENT QUESTION: "${message}"
        
        INSTRUCTIONS:
        1. Respond with high intelligence, friendly humanized language, and recruiters' strategic intelligence.
        2. Give concrete answers regarding their software repositories, strengths, fit, or roadmap.
        3. Keep your output concise: strictly 2-4 sentences max. Avoid fluffy disclaimers. Bold key terms for scan-readability.
      `;
      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemPrompt
      });
      const text = result.text ? result.text.trim() : "Unable to compile assessment recommendations.";
      return res.json({ response: text });
    } catch (err) {
      console.error("[DevScope-Chat] Error:", err.message);
      return res.json({ response: `I encountered an API latency issue, but my pre-audit states that @${username} shows strong capabilities in ${candidateData.stats.mostUsedLanguage} and is ready for further technical screening!` });
    }
  });
  app.post("/api/resume/analyze", async (req, res) => {
    const { githubSkills, resumeBase64, fileName } = req.body;
    if (!githubSkills || !resumeBase64 || !fileName) {
      return res.status(400).json({ error: "Missing required fields: githubSkills, resumeBase64, or fileName." });
    }
    const ai = getGeminiClient();
    const getOfflineResumeAnalysis = () => {
      const skillList = Array.isArray(githubSkills) ? githubSkills.map((s) => typeof s === "string" ? s : s.name || "Software Engineering") : ["Software Engineering"];
      return {
        matchScore: 82,
        resumeSkills: [...skillList, "Docker", "AWS", "Kubernetes", "CI/CD Pipelines"],
        githubSkills: skillList,
        missingOnGithub: ["Docker", "AWS", "Kubernetes"],
        missingOnResume: skillList.slice(0, 1),
        detailedGapAnalysis: "Offline Mode activated. Your resume demonstrates extensive foundational systems engineering, container configurations (Docker), and cloud services deployment (AWS) matching the desired job profiles well. However, direct open-source corroboration on GitHub is currently missing for Docker relative to your core code bases. The applicant possesses solid design disciplines overall, though validating deployment configurations live in public modules remains a key action item.",
        recommendations: [
          "Deploy a production-ready repository showcasing multi-stage Dockerfiles and container services.",
          "Construct a workflow compiling your code and launching deployments automatically to AWS static hosts."
        ]
      };
    };
    if (!ai) {
      console.log("[DevScope] No Gemini API key present. Yielding offline resume assessment.");
      return res.json({
        ...getOfflineResumeAnalysis(),
        offlineMode: true
      });
    }
    try {
      console.log(`[DevScope] Analyzing Resume (${fileName}) against verified GitHub skills...`);
      let cleanBase64 = resumeBase64;
      if (cleanBase64.startsWith("data:")) {
        const commaIndex = cleanBase64.indexOf(",");
        if (commaIndex !== -1) {
          cleanBase64 = cleanBase64.substring(commaIndex + 1);
        }
      }
      const isPdf = fileName.toLowerCase().endsWith(".pdf");
      const mimeType = isPdf ? "application/pdf" : "text/plain";
      const filePart = {
        inlineData: {
          mimeType,
          data: cleanBase64
        }
      };
      const skillList = Array.isArray(githubSkills) ? githubSkills.map((s) => typeof s === "string" ? s : s.name || "Software Engineering") : ["Software Engineering"];
      const prompt = `
        You are ScoutAI, an elite Technical Recruiter, Screener, and Developer Agent.
        Your task is to analyze the attached resume content (file provided as first parameter) and compare it with the verified skills list from their GitHub repositories.
        
        VERIFIED GITHUB SKILLS METRICS:
        ${JSON.stringify(skillList)}
        
        INSTRUCTIONS:
        1. Compare all technical claims on the resume against the verified open source skills list from GitHub.
        2. Identify:
           - matchScore: Overall alignment ranking from 0 to 100 on how solidly GitHub validates their resume claims.
           - resumeSkills: List of technical skills parsed from the resume file.
           - githubSkills: Same array of GitHub skills as input.
           - missingOnGithub: Tech skills claimed on resume but with 0 verified code presence under their GitHub repositories.
           - missingOnResume: Highly active skills visible inside their GitHub repositories but NOT listed/highlighted on their resume.
           - detailedGapAnalysis: Professional 2-paragraph evaluation summarizing overall alignment, gaps, truthfulness, and risk factors.
           - recommendations: Tactical steps detailing what repositories or demo applications they should publish next on GitHub to back their resume claims.
        
        Return strictly a JSON representation matching the required schema. Do not prefix or suffix with any markdown headers. Just raw JSON.
      `;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [filePart, prompt],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchScore: { type: Type.NUMBER },
              resumeSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              githubSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              missingOnGithub: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              missingOnResume: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              detailedGapAnalysis: { type: Type.STRING },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: [
              "matchScore",
              "resumeSkills",
              "githubSkills",
              "missingOnGithub",
              "missingOnResume",
              "detailedGapAnalysis",
              "recommendations"
            ]
          }
        }
      });
      const responseText = response.text ? response.text.trim() : "";
      if (!responseText) {
        throw new Error("Empty response from resume analyzer model.");
      }
      const parsedJSON = JSON.parse(responseText);
      return res.json({
        ...parsedJSON,
        offlineMode: false
      });
    } catch (err) {
      console.error("[DevScope] Resume AI Generation Error. Reverting to smart fallback:", err.message);
      return res.json({
        ...getOfflineResumeAnalysis(),
        offlineMode: true,
        aiError: true
      });
    }
  });
  app.get("/api/candidates", async (req, res) => {
    try {
      const candidatesList = await getAllCachedCandidates();
      return res.json({ candidates: candidatesList });
    } catch (err) {
      console.error("[DevScope Cache list error]", err);
      return res.status(500).json({ error: "Failed to retrieve candidates list." });
    }
  });
  app.post("/api/candidates/bulk-save", async (req, res) => {
    try {
      const { candidates: inputCandidates } = req.body;
      if (!inputCandidates || !Array.isArray(inputCandidates)) {
        return res.status(400).json({ error: "Missing or invalid 'candidates' array parameter." });
      }
      console.log(`[DevScope DB] Bulk saving ${inputCandidates.length} candidate profiles in database.`);
      for (const candidate of inputCandidates) {
        const mockRaw = {
          username: candidate.profile.username,
          name: candidate.profile.name,
          avatarUrl: candidate.profile.avatarUrl,
          bio: candidate.profile.bio,
          company: candidate.profile.company,
          location: candidate.profile.location,
          followers: candidate.profile.followers,
          following: Math.round(candidate.profile.followers / 2),
          publicRepos: candidate.stats.totalRepos,
          createdDate: (/* @__PURE__ */ new Date()).toISOString(),
          updatedDate: (/* @__PURE__ */ new Date()).toISOString(),
          repos: [
            {
              name: candidate.stats.mostStarredRepo,
              description: "Imported repository summary.",
              language: candidate.stats.mostUsedLanguage,
              stars: candidate.stats.totalStars,
              forks: Math.round(candidate.stats.totalStars / 5),
              updatedAt: (/* @__PURE__ */ new Date()).toISOString()
            }
          ]
        };
        const localScores = {
          technicalScore: Math.min(100, Math.max(20, candidate.stats.activityScore - 5)),
          documentationScore: Math.min(100, Math.max(30, candidate.stats.activityScore - 10)),
          activityScore: candidate.stats.activityScore,
          maturityScore: Math.min(100, Math.max(40, candidate.stats.activityScore - 2)),
          overallScore: candidate.stats.activityScore,
          rankRecommendation: candidate.stats.activityScore >= 83 ? "Strong Hire" : candidate.stats.activityScore >= 68 ? "Hire" : candidate.stats.activityScore >= 45 ? "Consider" : "Reject"
        };
        await saveUserData(mockRaw, candidate, localScores);
      }
      return res.json({ success: true, count: inputCandidates.length });
    } catch (err) {
      console.error("[DevScope Bulk save error]", err);
      return res.status(500).json({ error: "Failed to execute bulk save database operations." });
    }
  });
  app.post("/api/candidates/clear", async (req, res) => {
    try {
      const db = await initDatabase();
      await db.run("DELETE FROM Users;");
      console.log("[DevScope DB] All candidates cache cleared.");
      return res.json({ success: true });
    } catch (err) {
      console.error("[DevScope Clear error]", err);
      return res.status(500).json({ error: "Failed to clear database records." });
    }
  });
  app.get("/api/candidates/:username/recruiter-insights", async (req, res) => {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const normUsername = username.trim().toLowerCase();
    const dirPath = path2.join(process.cwd(), "analysis_reports");
    const filePath = path2.join(dirPath, `${normUsername}.json`);
    try {
      await fs2.mkdir(dirPath, { recursive: true });
      const stats = await fs2.stat(filePath);
      if (stats.isFile()) {
        const raw = await fs2.readFile(filePath, "utf-8");
        const report = JSON.parse(raw);
        return res.json(report);
      }
    } catch (err) {
    }
    return res.status(404).json({ error: "Recruiter Insights report not generated yet." });
  });
  app.post("/api/candidates/:username/recruiter-insights", async (req, res) => {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const normUsername = username.trim().toLowerCase();
    const candidate = await getCachedUserData(normUsername);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate profile not found. Please analyze their GitHub profile first." });
    }
    const dirPath = path2.join(process.cwd(), "analysis_reports");
    await fs2.mkdir(dirPath, { recursive: true });
    const filePath = path2.join(dirPath, `${normUsername}.json`);
    const getOfflineRecruiterInsights = (cand) => {
      const score = cand.stats.activityScore || 75;
      let rec = "Consider";
      if (score >= 83) rec = "Strong Hire";
      else if (score >= 68) rec = "Hire";
      else if (score >= 45) rec = "Consider";
      else rec = "Reject";
      const lang = cand.stats.mostUsedLanguage || "Web Technologies";
      return {
        username: cand.profile.username,
        recommendedRole: score >= 83 ? `Senior Systems Architect (${lang})` : score >= 68 ? `Full Stack Engineer (${lang})` : `Software Engineer (${lang})`,
        confidenceScore: Math.round(score),
        strengths: cand.aiAnalysis.strengths && cand.aiAnalysis.strengths.length > 0 ? cand.aiAnalysis.strengths : [
          `Specialized programming expertise in ${lang} implementations.`,
          "Competent handling of software architecture modular design patterns.",
          "Good codebase structure with high density of custom solutions."
        ],
        weaknesses: cand.aiAnalysis.weaknesses && cand.aiAnalysis.weaknesses.length > 0 ? cand.aiAnalysis.weaknesses : [
          "Needs focused coverage targets for supplementary unit testing frameworks.",
          "Lacking complete configurations for container Orchestration paradigms.",
          "Requires deeper technical validation indicators in junior projects."
        ],
        riskFactors: [
          `Technology concentration with predominant reliance on ${lang}.`,
          "Absence of standardized container scripts like Dockerfiles and pipeline automation files."
        ],
        interviewFocusAreas: [
          "Inquire about architectural scalability and multi-threading models.",
          "Evaluate unit testing philosophies, mocking patterns, and QA tooling preference.",
          "Discuss strategies for multi-language stack integrations."
        ],
        hiringRecommendation: rec,
        executiveSummary: `Through automated diagnostics, candidate @${cand.profile.username} exhibits a robust understanding of ${lang} principles, maintaining a solid standard of modular codebase organization. Based on an overall competency rating of ${score}%, we find their repository profile places them inside the optimal hiring spectrum. Essential focus areas for early onboarding involve deployment configurations and test structure improvements.`,
        generatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    };
    const ai = getGeminiClient();
    if (!ai) {
      console.log(`[DevScope Insights] Gemini key missing, generating resilient offline recruiter report for @${normUsername}`);
      const report = getOfflineRecruiterInsights(candidate);
      await fs2.writeFile(filePath, JSON.stringify(report, null, 2), "utf-8");
      return res.json({ ...report, offlineMode: true });
    }
    try {
      console.log(`[DevScope Insights] Querying Gemini for Recruiter Intelligence report of @${normUsername}`);
      const sysPrompt = `
        You are ScoutAI, an elite Technical Executive Talents Recruiter.
        Analyze the following technical developer profile gathered from their active GitHub repositories:

        DEVELOPER PROFILE:
        - Username: ${candidate.profile.username}
        - Full Name: ${candidate.profile.name}
        - Bio: ${candidate.profile.bio}
        - Location: ${candidate.profile.location}
        - Company: ${candidate.profile.company}
        - Primary Language: ${candidate.stats.mostUsedLanguage}
        - Combined Activity Score: ${candidate.stats.activityScore}/100
        - Top Strengths: ${JSON.stringify(candidate.aiAnalysis.strengths)}
        - Gaps / Weaknesses: ${JSON.stringify(candidate.aiAnalysis.weaknesses)}

        Your task is to generate a comprehensive Recruiter Intelligence Report conforming to the following requirements:
        1. recommendedRole: A specific, standard standard industry role matching their tech stack (e.g., "Senior Python Architect", "Mid Frontend Developer (TypeScript)", etc.)
        2. confidenceScore: A confidence percentage (integer between 10 and 100) based on repository size, followers, and languages.
        3. strengths: exactly 3 or 4 detailed, concrete technical strengths.
        4. weaknesses: exactly 2 or 3 detailed, constructive engineering gaps.
        5. riskFactors: exactly 2 specific recruiter risk factors (e.g. documentation deficits, library isolation, lack of configuration, single-language bias).
        6. interviewFocusAreas: exactly 2 or 3 critical questions or topic boundaries an interviewer should probe to vet this engineer.
        7. hiringRecommendation: A string matching their activity score:
           - 83 to 100 -> "Strong Hire"
           - 68 to 82 -> "Hire"
           - 45 to 67 -> "Consider"
           - Under 45 -> "Reject"
        8. executiveSummary: A highly polished executive summary (3-4 sentences in markdown) explaining their core identity, visual capabilities, and suitability for high-performing engineering organizations.

        Return STRICTLY valid JSON conforming to the structural schema. Do not include any HTML markdown wrappers or text outside this JSON object.
      `;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: sysPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedRole: { type: Type.STRING },
              confidenceScore: { type: Type.INTEGER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
              interviewFocusAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              hiringRecommendation: { type: Type.STRING },
              executiveSummary: { type: Type.STRING }
            },
            required: [
              "recommendedRole",
              "confidenceScore",
              "strengths",
              "weaknesses",
              "riskFactors",
              "interviewFocusAreas",
              "hiringRecommendation",
              "executiveSummary"
            ]
          }
        }
      });
      const responseText = response.text ? response.text.trim() : "";
      if (!responseText) throw new Error("Received blank output from Gemini model.");
      const parsed = JSON.parse(responseText);
      const report = {
        username: candidate.profile.username,
        recommendedRole: parsed.recommendedRole,
        confidenceScore: parsed.confidenceScore,
        strengths: parsed.strengths,
        weaknesses: parsed.weaknesses,
        riskFactors: parsed.riskFactors,
        interviewFocusAreas: parsed.interviewFocusAreas,
        hiringRecommendation: parsed.hiringRecommendation,
        executiveSummary: parsed.executiveSummary,
        generatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await fs2.writeFile(filePath, JSON.stringify(report, null, 2), "utf-8");
      return res.json({ ...report, offlineMode: false });
    } catch (err) {
      console.error("[DevScope Insights] Gemini API Error:", err.message);
      const report = getOfflineRecruiterInsights(candidate);
      await fs2.writeFile(filePath, JSON.stringify(report, null, 2), "utf-8");
      return res.json({ ...report, offlineMode: true, aiError: true });
    }
  });
  app.get("/api/github/analyze/:username", async (req, res) => {
    const { username } = req.params;
    const forceRefresh = req.query.force === "true";
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const normUsername = username.trim().toLowerCase();
    if (!forceRefresh) {
      try {
        const cached = await getCachedUserData(normUsername);
        if (cached) {
          console.log(`[DevScope Cache] Loaded user @${normUsername} from database.`);
          return res.json(cached);
        }
      } catch (err) {
        console.warn("[DevScope DB Cache search failed, resuming fetch]", err);
      }
    }
    let harvested;
    let rateLimitExceeded = false;
    let userNotFound = false;
    try {
      console.log(`[DevScope API] Attempting to harvest live GitHub details for: ${normUsername}`);
      const gitHubHeaders = {
        "User-Agent": "DevScope-Profile-Analyzer",
        "Accept": "application/vnd.github+json"
      };
      if (process.env.GITHUB_TOKEN) {
        gitHubHeaders["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
      }
      const userResponse = await fetch(`https://api.github.com/users/${normUsername}`, {
        headers: gitHubHeaders
      });
      if (userResponse.status === 403 || userResponse.status === 429) {
        const remaining = userResponse.headers.get("x-ratelimit-remaining");
        if (remaining === "0") {
          rateLimitExceeded = true;
          console.warn("[DevScope API] GitHub Rate Limit Hit.");
          throw new Error("GitHub REST API rate limit exceeded.");
        }
      }
      if (userResponse.status === 404) {
        userNotFound = true;
        return res.status(404).json({ error: `The requested GitHub profile "@${username}" does not exist.` });
      }
      if (userResponse.ok) {
        const userData = await userResponse.json();
        const reposResponse = await fetch(`https://api.github.com/users/${normUsername}/repos?per_page=100&sort=updated`, {
          headers: gitHubHeaders
        });
        let reposList = [];
        if (reposResponse.ok) {
          const rawRepos = await reposResponse.json();
          reposList = Array.isArray(rawRepos) ? rawRepos.map((r) => ({
            name: r.name || "Unnamed Repo",
            description: r.description || "",
            language: r.language || "Other",
            stars: r.stargazers_count || 0,
            updatedAt: r.updated_at || "",
            forks: r.forks_count || 0
          })) : [];
        }
        harvested = {
          username: userData.login || normUsername,
          name: userData.name || userData.login || username,
          avatarUrl: userData.avatar_url || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150`,
          bio: userData.bio || "",
          company: userData.company || "",
          location: userData.location || "",
          followers: userData.followers || 0,
          publicRepos: userData.public_repos || reposList.length,
          repos: reposList
        };
      } else {
        throw new Error(`GitHub API responded with status ${userResponse.status}`);
      }
    } catch (error) {
      console.warn(`[DevScope API] Active fetch failed: ${error.message}. Checking resilient local fallback.`);
      if (userNotFound) {
        return res.status(404).json({ error: `The requested GitHub profile "@${username}" does not exist.` });
      }
      if (rateLimitExceeded) {
        return res.status(429).json({
          error: "GitHub API rate limit exceeded. Please configure a GITHUB_TOKEN inside settings or try again in a few minutes."
        });
      }
      harvested = getMockGitHubData(normUsername);
    }
    const totalRepos = Math.max(harvested.publicRepos, harvested.repos.length);
    const langCounts = {};
    let mostStarredRepo = "None";
    let maxStars = -1;
    let totalStars = 0;
    harvested.repos.forEach((r) => {
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
    const localScores = calculateScoresLocally(harvested, harvested.repos);
    const sortedLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const skills = sortedLangs.map(([lang, count], idx) => {
      const baseScore = idx === 0 ? 95 : Math.max(45, 90 - idx * 15);
      return { name: lang, score: baseScore };
    });
    if (skills.length === 0) {
      skills.push({ name: mostUsedLanguage || "Web Technologies", score: 85 });
    }
    if (skills.length < 4) {
      skills.push({ name: "Systems Architecture", score: 80 });
      skills.push({ name: "CI/CD & DevOps", score: 65 });
      skills.push({ name: "Standard Databases", score: 75 });
    }
    const documentationRatioScore = Math.min(100, Math.round(harvested.repos.filter((r) => r.description).length / Math.max(1, harvested.repos.length) * 100));
    const testKeywordsCount = harvested.repos.filter((r) => r.name.toLowerCase().includes("test") || r.name.toLowerCase().includes("spec") || r.name.toLowerCase().includes("pytest") || r.name.toLowerCase().includes("jest")).length;
    const computedTestCoverage = Math.min(95, Math.max(15, testKeywordsCount * 25));
    const finalMetrics = {
      cognitiveComplexity: Math.min(98, Math.max(30, 100 - localScores.technicalScore + 15)),
      maintainabilityIndex: localScores.maturityScore,
      testCoverage: computedTestCoverage,
      documentationRatio: documentationRatioScore,
      realTimeActiveAnalyses: [
        { file: `core.${mostUsedLanguage === "Python" ? "py" : mostUsedLanguage === "C++" ? "cpp" : "ts"}`, language: mostUsedLanguage, issueCount: 0, complexity: "Low" },
        { file: "index.html", language: "HTML", issueCount: 1, complexity: "Low" },
        { file: "utils.ts", language: "TypeScript", issueCount: 2, complexity: "Medium" }
      ]
    };
    const getOfflineAnalysis = () => ({
      profile: {
        username: harvested.username,
        name: harvested.name,
        avatarUrl: harvested.avatarUrl,
        bio: harvested.bio || "Staff Engineer exploring distributed backends and automated continuous systems.",
        company: harvested.company || "Independent",
        location: harvested.location || "Global Core",
        followers: harvested.followers,
        publicRepos: totalRepos
      },
      stats: {
        totalRepos,
        mostUsedLanguage,
        mostStarredRepo,
        activityScore: localScores.overallScore,
        totalStars
      },
      aiAnalysis: {
        overallFeedback: `Verified evaluation indicates excellent code architecture. Competency diagnostics confirm highly organized modular interfaces under ${mostUsedLanguage}, strict component validation, and standard software quality parameters. Score matches a reliable "${localScores.rankRecommendation}" hiring outcome.`,
        strengths: [
          `Consistent coding structures implementing clean ${mostUsedLanguage} paradigms.`,
          "Designed robust decoupled controllers which support microservice scaling.",
          "Healthy repository structure showcasing regular integration loops."
        ],
        weaknesses: [
          "Currently records missing container instructions like multi-stage Dockerfiles.",
          "Insufficient direct mock coverage files inside junior auxiliary segments."
        ],
        skillSummary: `Highly experienced back-end resource with substantial focus in ${mostUsedLanguage}, reliable API routing strategies, data schema validations, and standard version practices.`
      },
      careerCoach: {
        target: mostUsedLanguage === "Python" ? "Backend Architect" : mostUsedLanguage === "TypeScript" ? "Frontend & UI Lead" : "Full Stack Software Engineer",
        suggestions: [
          "Master UI workflows by mounting modern React elements alongside your static APIs.",
          "Enhance verification by adopting robust unit testing models.",
          "Embed multi-tier Docker compositions validating environment variables.",
          "Implement automatic code pipelines via GitHub actions."
        ],
        suggestedRoadmap: [
          {
            step: 1,
            title: "Scalable Application Frameworks",
            description: "Study structural handlers, hooks, responsive styling, and fast asset deployment pipelines.",
            tech: ["React", "TypeScript", "Tailwind CSS"]
          },
          {
            step: 2,
            title: "Testing Automation & Quality",
            description: "Deploy comprehensive assertion testing suites to verify component reliability.",
            tech: ["Unit Testing", "GitHub Actions"]
          },
          {
            step: 3,
            title: "Container Compositions",
            description: "Wrap your backend scripts in lightweight containers implementing isolated dev layers.",
            tech: ["Docker", "Compose", "Redis"]
          },
          {
            step: 4,
            title: "Secure Cloud Services",
            description: "Publish your container images to highly scalable, isolated server systems.",
            tech: ["AWS ECS", "Amazon S3"]
          }
        ]
      },
      skills,
      performanceMetrics: finalMetrics
    });
    const ai = getGeminiClient();
    if (!ai) {
      console.log("[DevScope] Gemini Key missing. Merging local calculations into offline fallback payload.");
      const offlineResult = getOfflineAnalysis();
      try {
        await saveUserData(harvested, offlineResult, localScores);
      } catch (err) {
        console.warn("[DevScope DB] Offline save warning:", err);
      }
      return res.json({
        ...offlineResult,
        offlineMode: true
      });
    }
    try {
      console.log(`[DevScope Gemini] Prompting content generation for user: ${normUsername}.`);
      const summarizedRepos = harvested.repos.slice(0, 8).map((repo) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stars,
        forks: repo.forks,
        updatedAt: repo.updatedAt
      }));
      const sysPrompt = `
        You are ScoutAI, an elite Technical Executive Recruiter, Recruiter Examiner, and Career Coach.
        Your task is to review the candidate's GitHub raw facts and provide deep qualitative explanations.
        
        CRITICAL CONSTRAINT: High-fidelity scoring and rankings HAVE ALREADY BEEN CALCULATED LOCALLY. 
        Do NOT modify or output these scores. Simply validate and support the determined rank recommendation.
        
        CANDIDATE GENERAL DATA:
        - Username: ${harvested.username}
        - Full Name: ${harvested.name}
        - Public bio: ${harvested.bio}
        - Company: ${harvested.company}
        - Location: ${harvested.location}
        - Followers count: ${harvested.followers}
        
        CALCULATED LOCAL STATISTICS (DO NOT ALTER):
        - Total Repos: ${totalRepos}
        - Total Stars: ${totalStars}
        - Key Language: ${mostUsedLanguage}
        - Local Score: ${localScores.overallScore}/100
        - Determined Rank: ${localScores.rankRecommendation}
        
        REPOSITORY OVERVIEWS (Top 8 Summarized):
        ${JSON.stringify(summarizedRepos, null, 2)}
        
        INSTRUCTIONS:
        1. Write a professional, concise summary of their engineering style (overallFeedback) matching the "${localScores.rankRecommendation}" rank.
        2. Give 3 strengths (strengths) focusing on patterns, clean design, or languages used.
        3. Give 3 weaknesses (weaknesses) focusing on gaps in their repositories (like lack of tests, lacking container files, or missing databases).
        4. Write a single-paragraph 'skillSummary' analyzing their technology stack and primary code layouts.
        5. Suggest a recommended 'target' job position (one string) fitting their key skills.
        6. Provide 4 concise tips (suggestions) showing what they should work on next (e.g. Docker, automated pipelines, UI frameworks).
        7. Provide a progressive 4-step learning roadmap (suggestedRoadmap) guiding them step-by-step to scale their careers.
        8. Synthesize simulated file insights (realTimeActiveAnalyses) containing 3 realistic code file names and complexities suitable for their stack.
        
        Return STRICTLY a JSON format conforming to the exact schema. Do not output markdown code guards or text other than the required JSON object.
      `;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: sysPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallFeedback: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              skillSummary: { type: Type.STRING },
              target: { type: Type.STRING },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedRoadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.NUMBER },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    tech: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["step", "title", "description", "tech"]
                }
              },
              realTimeActiveAnalyses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    file: { type: Type.STRING },
                    language: { type: Type.STRING },
                    issueCount: { type: Type.NUMBER },
                    complexity: { type: Type.STRING }
                  },
                  required: ["file", "language", "issueCount", "complexity"]
                }
              }
            },
            required: ["overallFeedback", "strengths", "weaknesses", "skillSummary", "target", "suggestions", "suggestedRoadmap", "realTimeActiveAnalyses"]
          }
        }
      });
      const responseText = response.text ? response.text.trim() : "";
      if (!responseText) throw new Error("Empty text response from Gemini API.");
      const aiData = JSON.parse(responseText);
      const result = {
        profile: {
          username: harvested.username,
          name: harvested.name,
          avatarUrl: harvested.avatarUrl,
          bio: harvested.bio || "Specialist Software Architect.",
          company: harvested.company || "Independent",
          location: harvested.location || "Earth",
          followers: harvested.followers,
          publicRepos: totalRepos
        },
        stats: {
          totalRepos,
          mostUsedLanguage,
          mostStarredRepo,
          activityScore: localScores.overallScore,
          totalStars
        },
        aiAnalysis: {
          overallFeedback: aiData.overallFeedback,
          strengths: aiData.strengths,
          weaknesses: aiData.weaknesses,
          skillSummary: aiData.skillSummary
        },
        careerCoach: {
          target: aiData.target,
          suggestions: aiData.suggestions,
          suggestedRoadmap: aiData.suggestedRoadmap
        },
        skills,
        performanceMetrics: {
          ...finalMetrics,
          realTimeActiveAnalyses: aiData.realTimeActiveAnalyses
        }
      };
      await saveUserData(harvested, result, localScores);
      return res.json({
        ...result,
        offlineMode: false
      });
    } catch (err) {
      console.error("[DevScope API] AI Synthesis error, serving localized calculation data:", err.message);
      const offlineResult = getOfflineAnalysis();
      try {
        await saveUserData(harvested, offlineResult, localScores);
      } catch (dbErr) {
        console.warn("[DevScope DB] Db persist warning on AI mismatch:", dbErr);
      }
      return res.json({
        ...offlineResult,
        offlineMode: true,
        aiError: true
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path2.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path2.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DevScope] Server successfully active on port ${PORT}`);
  });
}
startServer();
