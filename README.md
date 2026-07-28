# TrustHire AI

AI-powered hiring platform featuring resume analysis, AI mock interviews, and credential verification.

## Features

- **Resume Analysis** — Upload a PDF resume, get an ATS score, skills breakdown, strengths, and improvement suggestions powered by AI
- **AI Mock Interviews** — 5-question structured technical interview with adaptive difficulty, real-time scoring, and detailed evaluation
- **Job Match Analysis** — Compare your resume against a job description to get a match score and missing skills
- **Credential Verification** — SHA-256 hash-based verification of candidate credentials (resume + interview score)
- **Recruiter Dashboard** — View candidates, change recruitment status, schedule interviews
- **Dark Mode** — Full dark mode support across the application

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, Zustand, React Query |
| Backend | Express 5, Node.js, Mongoose |
| Database | MongoDB Atlas |
| AI | Groq API (Llama 3.3 70B Versatile) via OpenAI SDK |
| Auth | JWT (JSON Web Tokens) |
| PDF Parsing | pdf-parse |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Groq API key (get one at https://console.groq.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/TrustHire-AI.git
cd TrustHire-AI

# Install server dependencies
cd server
cp .env.example .env   # Fill in your values
npm install

# Install client dependencies
cd ../client
cp .env.example .env.local
npm install
```

### Environment Variables

**Server** (`server/.env`):

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLIENT_URL` | Frontend URL (default: http://localhost:3000) |
| `GROQ_API_KEY` | Groq API key for AI features |

**Client** (`client/.env.local`):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: http://localhost:5000/api) |

### Running

```bash
# Terminal 1 — Server
cd server
npm run dev

# Terminal 2 — Client
cd client
npm run dev
```

Open http://localhost:3000

## Future Roadmap

| Feature | Description |
|---------|-------------|
| **Job Board** | Recruiters can post job openings; candidates can browse and apply directly through the platform |
| **Real-time Chat** | In-app messaging between recruiters and candidates |
| **Email Notifications** | Automated email alerts for status changes, interview invites, and application updates |
| **Admin Panel** | Manage users, jobs, and platform analytics from a dedicated admin dashboard |
| **Resume Builder** | In-browser resume editor with AI-powered suggestions and pre-built templates |
| **Interview Scheduling** | Calendar integration (Google/Outlook) for automated interview scheduling |
| **ATS Score History** | Track how resume changes affect ATS scores over time with version history |
| **Skill Gap Analysis** | AI recommends courses and learning resources based on missing skills |
| **LinkedIn Integration** | Import resume data from LinkedIn profile |
| **Multi-language Support** | Resume analysis for resumes in multiple languages |
| **PDF Export** | Download analysis reports, interview results, and job match reports as PDF |
| **Rate Limiting** | Per-user API rate limiting to prevent abuse of AI endpoints |

## Project Structure

```
TrustHire-AI/
├── client/          # Next.js frontend
│   └── src/
│       ├── app/             # Page routes
│       ├── components/      # UI components
│       ├── hooks/           # Custom React hooks
│       ├── store/           # Zustand state stores
│       └── services/        # API service functions
├── server/          # Express backend
│   └── src/
│       ├── controllers/     # Route handlers
│       ├── middleware/       # Auth, error handling
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express routes
│       └── services/        # Business logic
└── blockchain/      # Hardhat config (Solidity contract placeholder)
```
