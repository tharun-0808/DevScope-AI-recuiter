export interface UserProfile {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  company: string;
  location: string;
  followers: number;
  publicRepos: number;
}

export interface RepoStats {
  totalRepos: number;
  mostUsedLanguage: string;
  mostStarredRepo: string;
  activityScore: number;
  totalStars: number;
}

export interface AIAnalysis {
  overallFeedback: string;
  strengths: string[];
  weaknesses: string[];
  skillSummary?: string;
}

export interface CareerCoach {
  target: string;
  suggestions: string[];
  suggestedRoadmap: {
    step: number;
    title: string;
    description: string;
    tech: string[];
  }[];
}

export interface SkillItem {
  name: string;
  score: number;
}

export interface PerformanceMetrics {
  cognitiveComplexity: number;
  maintainabilityIndex: number;
  testCoverage: number;
  documentationRatio: number;
  realTimeActiveAnalyses: {
    file: string;
    language: string;
    issueCount: number;
    complexity: 'Low' | 'Medium' | 'High';
  }[];
}

export interface DeveloperAnalysisResult {
  profile: UserProfile;
  stats: RepoStats;
  aiAnalysis: AIAnalysis;
  careerCoach: CareerCoach;
  skills: SkillItem[];
  performanceMetrics: PerformanceMetrics;
  offlineMode?: boolean;
  aiError?: boolean;
}

export interface ResumeAnalysisResult {
  matchScore: number;
  resumeSkills: string[];
  githubSkills: string[];
  missingOnGithub: string[];
  missingOnResume: string[];
  detailedGapAnalysis: string;
  recommendations: string[];
  offlineMode?: boolean;
  aiError?: boolean;
}

export interface RecruiterInsightsReport {
  username: string;
  recommendedRole: string;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  riskFactors: string[];
  interviewFocusAreas: string[];
  hiringRecommendation: "Strong Hire" | "Hire" | "Consider" | "Reject";
  executiveSummary: string;
  generatedAt: string;
  offlineMode?: boolean;
  aiError?: boolean;
}
