import { DeveloperAnalysisResult } from "../types";

export const mockCandidatesList: DeveloperAnalysisResult[] = [
  {
    profile: {
      username: "torvalds",
      name: "Linus Torvalds",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      bio: "I write code that works directly on hardware. Creator of Linux and Git.",
      company: "Linux Foundation",
      location: "Portland, OR",
      followers: 189000,
      publicRepos: 18,
    },
    stats: {
      totalRepos: 18,
      mostUsedLanguage: "C",
      mostStarredRepo: "linux",
      activityScore: 99,
      totalStars: 420000,
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
      publicRepos: 42,
    },
    stats: {
      totalRepos: 42,
      mostUsedLanguage: "Python",
      mostStarredRepo: "fast-cache-endpoint",
      activityScore: 98,
      totalStars: 980,
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
      publicRepos: 29,
    },
    stats: {
      totalRepos: 29,
      mostUsedLanguage: "Python",
      mostStarredRepo: "llm.c",
      activityScore: 97,
      totalStars: 154000,
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
      followers: 84000,
      publicRepos: 68,
    },
    stats: {
      totalRepos: 68,
      mostUsedLanguage: "JavaScript",
      mostStarredRepo: "redux",
      activityScore: 96,
      totalStars: 98000,
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
      publicRepos: 33,
    },
    stats: {
      totalRepos: 33,
      mostUsedLanguage: "Rust",
      mostStarredRepo: "safety-audit-engine",
      activityScore: 94,
      totalStars: 4120,
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
      followers: 52000,
      publicRepos: 1140,
    },
    stats: {
      totalRepos: 1140,
      mostUsedLanguage: "TypeScript",
      mostStarredRepo: "awesome",
      activityScore: 97,
      totalStars: 280000,
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
