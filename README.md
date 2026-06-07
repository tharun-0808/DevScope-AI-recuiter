<div align="center">

# 🔍 DevScope AI Recruiter

**AI-powered recruitment and developer intelligence platform**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

*Analyze candidates. Evaluate GitHub profiles. Rank applicants. Generate engineering reports — all in one AI-driven dashboard.*

</div>

---

## 📌 Overview

**DevScope AI Recruiter** is a full-stack recruitment intelligence platform designed to help technical recruiters make faster, smarter hiring decisions. It combines AI-powered candidate analysis, deep GitHub profile evaluation, resume parsing, and automated ranking — all surfaced through a clean, modern dashboard.

Whether you're sourcing engineering talent or evaluating a shortlist, DevScope gives you executive-level technical assessments in seconds.

---

## ✨ Features

### 🤖 AI Candidate Analysis
- Automated candidate evaluation with technical competency scoring
- Engineering skill assessment powered by Google Gemini
- AI-generated recruiter reports with hiring recommendations

### 🐙 GitHub Intelligence
- Deep GitHub profile analysis — repositories, contributions, activity
- Automatic skill extraction from developer history
- Full developer profile auditing

### 📄 Resume Analyzer
- Resume upload and intelligent parsing
- Candidate information and skill extraction
- Profile enrichment from resume content

### 🏆 Candidate Ranking System
- Automated applicant ranking with performance-based scoring
- Talent comparison dashboard
- Candidate shortlist generation

### 📊 AI Recruiter Insights
- Executive-level technical assessment reports
- Candidate strengths and weaknesses breakdown
- Engineering role fit evaluation

### 🚀 Developer Growth Tools
- AI career coaching and skill roadmap generation
- Personalized learning recommendations
- Career development guidance for candidates

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js, TypeScript |
| **AI** | Google Gemini API |
| **Database** | JSON-based local store (`devscope_db.json`) |

---

## 📁 Project Structure

```
DevScope-AI-recuiter/
│
├── src/
│   ├── components/       # UI components
│   ├── data/             # Static/mock data
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
│
├── server.ts             # Express backend server
├── db.ts                 # Database logic
├── devscope_db.json      # Local JSON database
├── .env                  # Environment variables
└── package.json
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- A Google Gemini API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/tharun-0808/DevScope-AI-recuiter.git

# 2. Navigate into the project
cd DevScope-AI-recuiter

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 🗺️ Roadmap

- [ ] Real-time recruiter analytics dashboard
- [ ] Multi-platform developer profiling (GitLab, Bitbucket)
- [ ] ATS (Applicant Tracking System) integration
- [ ] Advanced AI candidate matching
- [ ] Team hiring dashboards
- [ ] Resume scoring with ATS compatibility

---

## 👤 Author

**Tharun HD**

- GitHub: [@tharun-0808](https://github.com/tharun-0808)

---

## 📄 License

This project is open source. Feel free to use, fork, and contribute.

---

<div align="center">
  <i>Built with ❤️ to make technical hiring smarter and faster.</i>
</div>
