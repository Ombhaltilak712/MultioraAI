# MultioraAI

**One workspace. Every AI agent.**

MultioraAI is a multi-agent AI workspace. You write one prompt, and the system routes it to the right specialised agent: chat, coding, PDF, PPT, vision or live web search. Generated files and code come back as artifacts you can preview, copy and share.

> **Status:** Backend is complete and running. Frontend UI redesign is in progress (Phases 0–5 of 8 done). See [Project Progress](#project-progress).

---

## Table of Contents
- [Features](#features)
- [AI Agents](#ai-agents)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Project Progress](#project-progress)
- [Roadmap](#roadmap)
- [Security Notes](#security-notes)

---

## Features

- **Auto agent routing:** leave the agent on *Auto* and MultioraAI picks the best one. A PDF upload goes to the PDF RAG agent, and an image upload goes to the image analyzer.
- **Multi-modal chat:** text prompts, PDF uploads, image uploads and voice input.
- **Code artifacts:** the coding agent returns `index.html`, `style.css` and `script.js`, shown in a Monaco editor with a live preview.
- **Document generation:** PDF reports and PowerPoint decks.
- **Live web search** with sources.
- **Conversation management:** create, rename, pin, delete, edit a past message and regenerate.
- **Public sharing:** share any chat through a read-only link (`/share/:token`).
- **Library:** browse, rename and delete all generated files.
- **Credit-based plans** with Razorpay payments.
- **Google sign-in** with Firebase Auth and cookie-based sessions.

## AI Agents

| Agent | What it does |
|---|---|
| Auto | Router: decides which agent should handle the prompt |
| Chat | General conversation with memory |
| Coding | Generates code projects with live preview |
| PDF | Generates PDF reports |
| PDF RAG | Answers questions about an uploaded PDF (vector search) |
| PPT | Generates slide decks |
| Vision | Image-related generation and tasks |
| Image Analyzer | Analyses an uploaded image |
| Search | Live web search answers |

Agents are orchestrated with a **LangGraph** state graph (`router` → selected agent).

## Architecture

```
                        ┌────────────────────┐
   React + Vite  ─────▶ │   API Gateway      │  :8000
   (frontend)           │ (auth check, proxy)│
                        └─────────┬──────────┘
          ┌──────────────┬────────┴───────┬───────────────┐
          ▼              ▼                ▼               ▼
   Auth service    Chat service     Agent service   Billing service
      :8001           :8002            :8003            :8004
          │              │                │               │
          └───────── MongoDB ─────────────┴───────────────┘
                         Redis (shared)
   Agent service also uses: LLM providers, Tavily, Qdrant, AWS S3
```

Each service runs independently (and has its own Dockerfile). The gateway is the only thing the frontend talks to.

## Tech Stack

**Frontend**
- React 19, Vite
- Tailwind CSS v4
- Redux Toolkit
- `motion` for animation, lucide-react / react-icons
- Monaco Editor, react-markdown
- Firebase Auth (Google), axios, Razorpay checkout

**Backend**
- Node.js (ES modules), Express-style microservices, nodemon for dev
- LangGraph / LangChain for agent orchestration
- MongoDB, Redis
- Qdrant (vector DB for PDF RAG)
- AWS S3 (file storage)
- Tavily (web search)
- Razorpay (payments)
- Docker, GitHub Actions to AWS ECR

## Project Structure

```
Multiora/
├── backend/
│   ├── docker-compose.yml        # local Redis
│   ├── gateway/                  # API gateway (port 8000)
│   ├── shared/redis/             # shared Redis helper
│   └── services/
│       ├── auth/                 # login, session, profile
│       ├── chat/                 # conversations, messages, library, sharing
│       ├── agent/                # LangGraph, agents, uploads, credits
│       │   ├── agents/           # chat, coding, search, pdf, pdfRag, ppt, vision, imageAnalyzer
│       │   ├── graph/            # graph.js, router.js, state.js
│       │   └── utils/            # PDF/PPT generation, S3, credit deduction
│       └── billing/              # Razorpay orders, verification, history
├── frontend/
│   ├── utils/                    # axios + firebase setup
│   └── src/
│       ├── features/             # API call functions (frontend to backend)
│       ├── redux/                # store and slices
│       ├── pages/                # Home, Landing, PublicSharedChat
│       └── components/           # SideBar, Nav, ChatArea, ChatInput, MessageList,
│                                 # Artifact, LibraryView, BillingDrawer, modals ...
└── .github/workflows/deploy.yml  # build and push backend images to AWS ECR
```

## Getting Started

### Prerequisites
- Node.js 18+
- Docker (for local Redis)
- A MongoDB database (local or Atlas)
- Accounts and keys for the services listed in [Environment Variables](#environment-variables)

### 1. Clone
```bash
git clone <your-repo-url>
cd Multiora
```

### 2. Start Redis
```bash
cd backend
docker compose up -d
```

### 3. Configure environment
Copy every `.env.example` to `.env` and fill in the values (see below):
```bash
cp backend/gateway/.env.example backend/gateway/.env
cp backend/services/auth/.env.example backend/services/auth/.env
cp backend/services/chat/.env.example backend/services/chat/.env
cp backend/services/agent/.env.example backend/services/agent/.env
cp backend/services/billing/.env.example backend/services/billing/.env
cp frontend/.env.example frontend/.env
```
The auth service also needs a Firebase Admin `serviceAccountKey.json` in `backend/services/auth/` (never commit it).

### 4. Run the backend (one terminal per service)
```bash
# gateway
cd backend/gateway && npm install && npm run dev
# auth
cd backend/services/auth && npm install && npm run dev
# chat
cd backend/services/chat && npm install && npm run dev
# agent
cd backend/services/agent && npm install && npm run dev
# billing
cd backend/services/billing && npm install && npm run dev
```

### 5. Run the frontend
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173**.

## Environment Variables

**Gateway** (`backend/gateway/.env`)
`PORT`, `AUTH_SERVICE`, `CHAT_SERVICE`, `AGENT_SERVICE`, `BILLING_SERVICE`, `FRONTEND_URL`, `REDIS_URL`

**Auth** (`backend/services/auth/.env`)
`PORT`, `MONGODB_URI`, `REDIS_URL`, `CHAT_SERVICE`

**Chat** (`backend/services/chat/.env`)
`PORT`, `MONGODB_URI`, `REDIS_URL`

**Agent** (`backend/services/agent/.env`)
`PORT`, `MONGODB_URI`, `REDIS_URL`, `CHAT_SERVICE`, `AUTH_SERVICE`, `GROQ_API_KEY`, `GOOGLE_API_KEY`, `OPENROUTER_API_KEY`, `TAVILY_API_KEY`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_KEY`, `AWS_BUCKET_NAME`, `QDRANT_URL`, `QDRANT_API_KEY`

**Billing** (`backend/services/billing/.env`)
`PORT`, `MONGODB_URI`, `AUTH_SERVICE`, `REDIS_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

**Frontend** (`frontend/.env`)
`VITE_SERVER_URL` (gateway URL), `VITE_FIREBASE_API_KEY`, `VITE_RAZORPAY_KEY_ID`

Default local ports: gateway `8000`, auth `8001`, chat `8002`, agent `8003`, billing `8004`, frontend `5173`.

## API Overview

All requests go through the gateway. Sessions use an HTTP-only cookie (`withCredentials: true`).

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/login`, `GET /api/auth/logout`, `GET /api/me`, `POST /api/auth/update-profile`, `POST /api/auth/delete-account` |
| Chat | `GET /api/chat/create-conversation`, `GET /api/chat/get-conversations`, `GET /api/chat/get-messages/:id`, `POST /api/chat/update-conversation`, `DELETE /api/chat/delete-conversation/:id`, `POST /api/chat/pin-conversation/:id`, `POST /api/chat/edit-message` |
| Sharing | `POST /api/chat/share/:id`, `GET /api/chat/public/share/:token` |
| Library | `GET / PATCH / DELETE /api/chat/library[/:id]` |
| Agent | `POST /api/agent/chat` (multipart: `prompt`, `conversationId`, `agent`, optional `file`) |
| Billing | `POST /api/billing/create`, `POST /api/billing/verify`, `GET /api/billing/history` |

### Plans
| Plan | Price | Credits | Validity |
|---|---|---|---|
| Free | ₹0 | 100 | 30 days |
| Starter | ₹199 | 500 | 30 days |
| Pro | ₹499 | 1000 | 30 days |

## Project Progress

### Backend: done and running
- [x] API gateway with auth check and service proxying
- [x] Auth service (Google login via Firebase, sessions, profile, account deletion)
- [x] Chat service (conversations, messages, pin, share, edit, library)
- [x] Agent service (LangGraph router + 8 agents, file upload, S3, Qdrant RAG, credit deduction)
- [x] Billing service (Razorpay orders, verification, history)
- [x] Dockerfiles and GitHub Actions deployment to AWS ECR

### Frontend: functional, now being redesigned
The original UI worked but did not suit an AI-agent product, so the whole interface is being redesigned phase by phase. **Frontend-to-backend connections (`utils/`, `src/features/`, `src/redux/`) are intentionally left untouched.**

| Phase | Scope | Status |
|---|---|---|
| 0 | Safety snapshot and code audit | Done |
| 1 | Design system: tokens, fonts, reusable UI primitives | Done |
| 2 | New landing page with 3D agent orb hero | Done |
| 3 | Landing page connected to Google login (`App.jsx` / `Home.jsx`) | Done |
| 4 | App shell: sidebar, top bar, layout | Done |
| 5 | Chat experience: messages, loading animation, composer, clickable suggestions | Done |
| 6 | Artifact panel (code and live preview) and Library | Pending |
| 7 | Modals, billing drawer, public share page | Pending |
| 8 | Polish, performance, accessibility, final QA | Pending |

### Redesign highlights so far
- Dark, glassmorphism "AI command center" look with indigo, violet and cyan accents
- Landing page: hero with interactive 3D agent orb, how it works, agent cards, features, pricing and FAQ
- Redesigned sidebar and chat screen with agent selector, thinking animation and clickable suggestion cards that fill the composer
- Responsive and reduced-motion aware

## Roadmap
- [ ] Finish Phases 6–8 of the UI redesign
- [ ] Add automated tests (none yet)
- [ ] Frontend deployment pipeline (the current workflow only builds backend images)
- [ ] Rename the workflow from its old name in `deploy.yml`
- [ ] Rate limiting and usage analytics per agent

## Security Notes
- Never commit `.env` files or `serviceAccountKey.json`. They are listed in `.gitignore`; confirm with `git status` before pushing.
- If any secret was ever committed or shared (including inside a zip), rotate it.
- The Firebase web API key and Razorpay **key ID** are public by design. The Razorpay **secret** must only live in the billing service.

## License
Add a license of your choice (for example MIT) before making the repository public.
