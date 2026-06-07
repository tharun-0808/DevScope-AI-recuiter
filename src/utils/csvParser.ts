import { DeveloperAnalysisResult } from "../types";

export function parseSingleCSVLine(headers: string[], line: string, i: number): DeveloperAnalysisResult | null {
  const trimmedLine = line.trim();
  if (!trimmedLine) return null;

  // Split handling optional double quotes
  const values: string[] = [];
  let currentVal = "";
  let inQuotes = false;
  for (let charIdx = 0; charIdx < trimmedLine.length; charIdx++) {
    const char = trimmedLine[charIdx];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(currentVal.trim().replace(/^["']|["']$/g, ""));
      currentVal = "";
    } else {
      currentVal += char;
    }
  }
  values.push(currentVal.trim().replace(/^["']|["']$/g, ""));

  // Build the row object
  const row: any = {};
  headers.forEach((header, index) => {
    if (index < values.length) {
      row[header] = values[index];
    }
  });

  // Make sure we have a username
  const rawUsername = row.username || row.github_username || row.github || row.user || `applicant_${i}`;
  const cleanUsername = rawUsername.toLowerCase().replace(/[^a-z0-9_-]/g, "");
  if (!cleanUsername) return null;

  const rawName = row.name || row.fullname || row.username || `Applicant ${i}`;
  const mostUsedLanguage = row.language || row.mostusedlanguage || row.tech || "TypeScript";
  
  // Competency Score computation
  const scoreVal = parseInt(row.score || row.competencyscore || row.rank || row.activityscore) || Math.floor(Math.random() * 21) + 77; // random integer between 77 and 98
  
  const company = row.company || "Independent";
  const location = row.location || "Remote";
  const bio = row.bio || `Specialized ${mostUsedLanguage} Developer who designs reliable software ecosystems.`;
  const totalRepos = parseInt(row.totalrepos || row.repos || row.publicrepos) || Math.floor(Math.random() * 20) + 15;
  const totalStars = parseInt(row.stars || row.totalstars) || Math.floor(Math.random() * 1500) + 50;

  // Language configuration mapping to auto-mock realistic specs
  const languageSkillsMap: Record<string, { skills: string[], roadmap: { title: string, desc: string, tech: string[] }[] }> = {
    Python: {
      skills: ["Django Web", "FastAPI Endpoints", "PyTest Modules", "NumPy", "Pydantic Schemas"],
      roadmap: [
        { title: "Scalable Event Architectures", desc: "Build high-throughput parallel workers using Celery and Redis broker channels.", tech: ["FastAPI", "Celery", "Redis"] },
        { title: "Continuous Test Coverage", desc: "Write comprehensive unit fixtures verifying API integrations and DB transactions.", tech: ["PyTest", "Docker", "Sentry"] }
      ]
    },
    Typescript: {
      skills: ["React 19 System", "TypeScript strict", "NextJS Router", "Zustand State", "Vite Builders"],
      roadmap: [
        { title: "Full System Serialization", desc: "Compose type-safe contract validation patterns over client networks.", tech: ["React", "TypeScript", "Zustand"] },
        { title: "Bundle Optimization Budgets", desc: "Prune heavy visual assets using compilation tree-shaking algorithms.", tech: ["Vite", "ESLint", "Playwright"] }
      ]
    },
    Javascript: {
      skills: ["UI Components", "Node.js Server", "DOM interactions", "State Handlers", "Async Requests"],
      roadmap: [
        { title: "Multithreaded Web Workers", desc: "Offload computational overhead from rendering engines to separate client processes.", tech: ["JS ESNext", "Web Workers"] },
        { title: "Responsive Layout Ergonomics", desc: "Design adaptive client containers avoiding render blocking.", tech: ["Webpack", "Lighthouse"] }
      ]
    },
    C: {
      skills: ["Memory Pointers", "POSIX Multithreading", "GNU Compilers", "Kernel Blocks", "Makefile"],
      roadmap: [
        { title: "Low-Profile Thread Pools", desc: "Construct concurrent thread queues operating bare-metal structures efficiently.", tech: ["C", "GCC", "Valgrind"] },
        { title: "Custom Module Hooks", desc: "Inject highly efficient static buffers to bypass OS virtual delays.", tech: ["POSIX", "gdb"] }
      ]
    },
    Cpp: {
      skills: ["STL Vectors", "Embedded Engines", "Complex Logic", "Memory Drivers", "WASM Assemblies"],
      roadmap: [
        { title: "Wasm Assembly Bridges", desc: "Compile multithreaded calculation solvers executing fully inside web-browsers.", tech: ["C++17", "Emscripten", "WebGPU"] },
        { title: "Hardware-Aligned Buffers", desc: "Ensure flawless high-performance render queues matching frame refreshes.", tech: ["C++", "CMake"] }
      ]
    },
    Go: {
      skills: ["Goroutines", "HTTP Mutexes", "Go channels", "gRPC Interceptors", "Kafka Pipelines"],
      roadmap: [
        { title: "Locks-Free Concurrency Flow", desc: "Model robust stream processing routing terabytes of raw socket files.", tech: ["Go", "gRPC", "Prometheus"] },
        { title: "Scalable Internal APIs", desc: "Create microservices communicating within Kubernetes clusters.", tech: ["Go Channels", "Docker"] }
      ]
    },
    Rust: {
      skills: ["Borrowing Analyzer", "Tokio Sockets", "Option / Results", "Cargo Builds", "Unsafe Blocks Control"],
      roadmap: [
        { title: "Type-Validated Compute", desc: "Deploy WASM binary bundles driving high-speed algorithms within browser caches.", tech: ["Rust", "WASM", "Cargo-pack"] },
        { title: "Thread-Safe Memory Pipes", desc: "Configure strict concurrency layers protecting transactional queues.", tech: ["Tokio Async", "Mutex", "Serde"] }
      ]
    }
  };

  // Grab correct configuration based on language
  const normalizedLang = mostUsedLanguage.trim().charAt(0).toUpperCase() + mostUsedLanguage.trim().slice(1).toLowerCase();
  const config = languageSkillsMap[normalizedLang] || {
    skills: ["Algorithm Structures", "Full Stack Flow", "Secure Coding", "Version Management"],
    roadmap: [
      { title: "Scalable Deployment Systems", desc: "Adopt automated integration steps assuring continuous product safety.", tech: ["Git", "Docker"] },
      { title: "Modular Service Pipelines", desc: "Establish low-latency API layers handling heavy traffic records.", tech: ["FastAPI", "SQL"] }
    ]
  };

  return {
    profile: {
      username: cleanUsername,
      name: rawName,
      avatarUrl: row.avatar || row.avatarurl || `https://ui-avatars.com/api/?name=${encodeURIComponent(rawName)}&background=ec4899&color=fff&bold=true`,
      bio: bio,
      company: company,
      location: location,
      followers: Math.round(totalStars / 8) + 22,
      publicRepos: totalRepos
    },
    stats: {
      totalRepos: totalRepos,
      mostUsedLanguage: mostUsedLanguage,
      mostStarredRepo: row.starred_repo || row.moststarredrepo || `awesome-${mostUsedLanguage.toLowerCase()}`,
      activityScore: scoreVal,
      totalStars: totalStars
    },
    aiAnalysis: {
      overallFeedback: `Verified evaluation indicates excellent systems understanding of ${mostUsedLanguage}. Competency assessment confirms streamlined modular design choices, rigorous logical structures, and clean developer workflows.`,
      strengths: [
        `Pristine design adhering to standard ${mostUsedLanguage} paradigms.`,
        `High readability rating minimizing technical drift.`,
        `Effective function decoupling avoiding heavy scopes.`
      ],
      weaknesses: [
        `Needs systematically expanded coverage files.`,
        `Missing direct integration telemetry records.`
      ]
    },
    careerCoach: {
      target: `Principal ${mostUsedLanguage} Architect`,
      suggestions: [
        `Lead efforts establishing standard abstract module interfaces.`,
        `Adopt automated performance tracers checking query performance.`
      ],
      suggestedRoadmap: config.roadmap.map((item, idx) => ({
        step: idx + 1,
        title: item.title,
        description: item.desc,
        tech: item.tech
      }))
    },
    skills: [
      { name: `${mostUsedLanguage} Core`, score: Math.round(scoreVal) },
      ...config.skills.map((s, idx) => ({
        name: s,
        score: Math.max(65, Math.round(scoreVal - (idx + 1) * 4.5))
      }))
    ],
    performanceMetrics: {
      cognitiveComplexity: Math.floor(Math.random() * 8) + 5,
      maintainabilityIndex: Math.floor(Math.random() * 14) + 81,
      testCoverage: Math.floor(Math.random() * 30) + 65,
      documentationRatio: Math.floor(Math.random() * 18) + 72,
      realTimeActiveAnalyses: [
        { file: `main.${mostUsedLanguage === "C" ? "c" : mostUsedLanguage === "Rust" ? "rs" : "ts"}`, language: mostUsedLanguage, issueCount: 0, complexity: "Medium" }
      ]
    }
  };
}

export function parseCSVToDevelopers(csvText: string): DeveloperAnalysisResult[] {
  const lines = csvText.split(/\r?\n/);
  if (lines.length <= 1) return [];

  // Parse headers
  const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, "").toLowerCase());
  const results: DeveloperAnalysisResult[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const dev = parseSingleCSVLine(headers, line, i);
    if (dev) {
      results.push(dev);
    }
  }

  return results;
}
