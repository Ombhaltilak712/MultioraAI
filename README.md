# MultioraAI

**One workspace. Every AI agent.**

MultioraAI is an AI workspace where you type one prompt and the right specialised agent handles it: general chat, coding, PDF, PowerPoint, image tasks or live web search. Results come back in a clean chat interface, and anything generated (code, files) opens in a side panel where you can preview, copy, download and share it.

> **Project status:** Backend complete. Frontend UI redesign complete (all 8 phases). The app is feature-complete and ready for wider testing and deployment. See [Project Progress](#project-progress).

---

## Table of Contents
1. [What can it do?](#what-can-it-do)
2. [A quick tour of the app](#a-quick-tour-of-the-app)
3. [The AI agents](#the-ai-agents)
4. [How it works](#how-it-works)
5. [Tech stack](#tech-stack)
6. [Project structure](#project-structure)
7. [Getting started](#getting-started)
8. [Environment variables](#environment-variables)
9. [API reference](#api-reference)
10. [Plans and credits](#plans-and-credits)
11. [Frontend guide for contributors](#frontend-guide-for-contributors)
12. [Project progress](#project-progress)
13. [Troubleshooting](#troubleshooting)
14. [Roadmap](#roadmap)
15. [Security notes](#security-notes)

---

## What can it do?

| Capability | Description |
|---|---|
| **Auto agent routing** | Leave the agent on *Auto* and MultioraAI picks the best one for your prompt |
| **Multi-modal input** | Text, PDF uploads, image uploads and voice input (speech to text) |
| **Code generation with live preview** | The coding agent returns a working web project, shown in a code editor and a live preview |
| **Documents** | Generate PDF reports and PowerPoint decks |
| **Chat with your PDF** | Upload a PDF and ask questions about it |
| **Image understanding** | Upload an image and ask about it |
| **Live web search** | Up-to-date answers with sources |
| **Conversation tools** | Create, rename, pin, delete, edit a past message and regenerate the reply |
| **Public sharing** | Turn on a read-only link for any chat |
| **Library** | One place to find, rename and delete every file you generated |
| **Credits and payments** | Free, Starter and Pro plans paid through Razorpay |
| **Google sign-in** | One-click login, no passwords |

## A quick tour of the app

### 1. Landing page (visitors who are not logged in)
A dark, futuristic page that explains the product.
- **Navbar:** logo, section links, a "New" announcement pill and a **Get Started** button.
- **Hero:** big headline with an interactive **3D agent orb** that follows your mouse. On phones and for users who prefer reduced motion it falls back to a lightweight version.
- **How it works:** four steps, from asking a question to getting a result.
- **Agents showcase:** cards for each agent with an example prompt.
- **Features:** the main things you can do.
- **Device showcase:** shows the app on a laptop and a phone.
- **Pricing:** the real Free, Starter and Pro plans.
- **FAQ and footer.**

Every "Get Started" button starts the Google login. The landing page itself never calls the backend.

### 2. Chat workspace (after login)
- **Sidebar:** New chat button, pinned and recent conversations, a menu for rename, pin, share and delete, your profile card with plan and credits, and links to Library, Billing and Settings. It collapses on desktop and becomes a slide-in drawer on mobile.
- **Top bar:** conversation title, pinned badge, message count and Share button.
- **Chat area:** your messages and the AI replies with formatted text, code blocks with a copy button, and images that open in a larger view. Hover a message to copy or edit it. While an agent works you see a "thinking" animation.
- **Empty state:** greeting plus four suggestion cards. Clicking one fills the message box (it does not send automatically).
- **Message box:** attach a file, use the microphone, pick an agent (Auto, Chat, Coding, PDF, PPT, Vision, Search) and send. Enter sends, Shift+Enter adds a new line.

### 3. Artifact panel
When an agent returns code, a panel opens beside the chat with:
- file tabs (`index.html`, `style.css`, `script.js`)
- a **Code** tab (Monaco editor, the same editor as VS Code) and a **Preview** tab (the page running live in a browser-style frame)
- a copy button; on mobile the panel opens as a drawer

### 4. Library
A grid of all generated files with type icons, search and filters, plus rename and delete.

### 5. Modals and drawers
Billing drawer (plans, current plan, history, Razorpay checkout), Share, Rename, Delete confirmation, Profile and Settings. They share one consistent look.

### 6. Public share page
Anyone with a share link (`/share/<token>`) can read the conversation without logging in, and sees a button to try MultioraAI.

## The AI agents

| Agent | What it does | Typical prompt |
|---|---|---|
| **Auto** | Router: reads your prompt (and any attached file) and picks an agent | anything |
| **Chat** | General conversation, remembers earlier messages | "Explain Redis pub/sub" |
| **Coding** | Builds web projects and returns code files with live preview | "Build a Netflix clone" |
| **PDF** | Writes and generates a PDF report | "Summarise AI advances as a PDF" |
| **PDF RAG** | Answers questions about a PDF you upload, using a vector database | upload a PDF, "What does section 2 say?" |
| **PPT** | Generates a PowerPoint deck | "Make a deck on Quantum Computing" |
| **Vision** | Image-related generation and tasks | "Create an image of ..." |
| **Image Analyzer** | Describes and analyses an image you upload | upload an image, "What is in this chart?" |
| **Search** | Searches the web and answers with sources | "Latest React release" |

**Auto routing rules:** if you attach a PDF it goes to PDF RAG, if you attach an image it goes to Image Analyzer, otherwise a model reads the prompt and chooses. If you pick an agent manually, Auto is skipped. The agents are connected with **LangGraph** (a state graph: `start` then `router` then the chosen agent).

## How it works

### Architecture

```
                        ┌─────────────────────┐
  React + Vite  ──────▶ │     API Gateway     │  :8000
  (frontend :5173)      │ checks login, proxies│
                        └──────────┬──────────┘
        ┌────────────┬─────────────┴──┬──────────────┐
        ▼            ▼                ▼              ▼
   Auth service  Chat service   Agent service  Billing service
      :8001         :8002          :8003          :8004
        │            │                │              │
        └──────── MongoDB ────────────┴──────────────┘
                  Redis (shared)

   Agent service also uses: LLM providers, Tavily (search),
   Qdrant (vector DB), AWS S3 (files)
```

The frontend only ever talks to the **gateway**. The gateway checks the session cookie and forwards each request to the right service.

### What happens when you send a message
1. You type a prompt (optionally attach a file, pick an agent) and press Send.
2. If there is no open conversation, the frontend creates one first.
3. The frontend sends `POST /api/agent/chat` as multipart form data: `prompt`, `conversationId`, `agent` and optional `file`.
4. The gateway verifies your session and forwards to the Agent service.
5. The router picks the agent (or uses your choice). The agent does the work (LLM call, search, PDF/PPT generation, vector search and so on). Credits are deducted.
6. The response comes back with `answer`, `images` and `artifacts`.
7. The message is saved, and the UI shows the answer. If there are code artifacts, the side panel opens.

### How login works
1. You click **Get Started**; a Google popup opens (Firebase Auth).
2. The frontend gets a Firebase ID token and sends it to `POST /api/auth/login`.
3. The Auth service verifies it, creates or finds your user and sets a session cookie.
4. On every page load the app calls `GET /api/me`. If the cookie is valid you go straight to the workspace, otherwise you see the landing page.

### How payment works
1. You pick a plan in the Billing drawer; the frontend calls `POST /api/billing/create` and gets a Razorpay order.
2. Razorpay checkout opens in the browser and you pay.
3. On success the frontend calls `POST /api/billing/verify`; the Billing service verifies the payment signature and adds the credits.

## Tech stack

**Frontend**
- React 19, Vite, Tailwind CSS v4 (design tokens in `src/index.css`)
- Redux Toolkit for state
- `motion` for animation, Three.js with React Three Fiber for the 3D hero, Lenis for smooth scrolling on the landing page
- Monaco Editor, react-markdown, lucide-react / react-icons
- Firebase Auth (Google), axios, Razorpay checkout

**Backend**
- Node.js (ES modules) microservices with nodemon for development
- LangGraph / LangChain for agent orchestration
- MongoDB, Redis, Qdrant (vector search), AWS S3 (file storage)
- Tavily (web search), Razorpay (payments)
- Docker and GitHub Actions (builds backend images and pushes to AWS ECR)

## Project structure

```
Multiora/
├── backend/
│   ├── docker-compose.yml        # local Redis
│   ├── gateway/                  # API gateway (port 8000)
│   ├── shared/redis/             # shared Redis helper
│   └── services/
│       ├── auth/                 # login, session, profile
│       ├── chat/                 # conversations, messages, library, sharing
│       ├── agent/                # AI agents
│       │   ├── agents/           # chat, coding, search, pdf, pdfRag, ppt, vision, imageAnalyzer
│       │   ├── graph/            # graph.js, router.js, state.js
│       │   ├── config/           # models, S3, vector DB, uploads, limits
│       │   └── utils/            # PDF/PPT generation, S3 helpers, credit deduction
│       └── billing/              # Razorpay orders, verification, history
├── frontend/
│   ├── index.html                # fonts, Razorpay script
│   ├── utils/                    # axios.js and firebase.js (do not edit casually)
│   └── src/
│       ├── features/             # one file per backend call
│       ├── redux/                # store and slices
│       ├── pages/                # Home, Landing, PublicSharedChat
│       ├── components/
│       │   ├── ui/               # reusable design-system pieces (buttons, cards, modal shell...)
│       │   ├── landing/          # landing page sections and 3D hero
│       │   └── ...               # SideBar, Nav, ChatArea, ChatInput, MessageList,
│       │                         # Artifact, LibraryView, BillingDrawer, modals
│       └── index.css             # Tailwind import and design tokens
└── .github/workflows/deploy.yml  # backend image build and push
```

## Getting started

### Prerequisites
- Node.js 18 or newer
- Docker (for local Redis)
- A MongoDB database (local or Atlas)
- Keys for the external services listed under [Environment variables](#environment-variables)

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

### 3. Create the environment files
```bash
cp backend/gateway/.env.example backend/gateway/.env
cp backend/services/auth/.env.example backend/services/auth/.env
cp backend/services/chat/.env.example backend/services/chat/.env
cp backend/services/agent/.env.example backend/services/agent/.env
cp backend/services/billing/.env.example backend/services/billing/.env
cp frontend/.env.example frontend/.env
```
Fill in every value. The Auth service also needs a Firebase Admin key saved as `backend/services/auth/serviceAccountKey.json` (never commit it).

### 4. Run the backend (one terminal per service)
```bash
cd backend/gateway          && npm install && npm run dev
cd backend/services/auth    && npm install && npm run dev
cd backend/services/chat    && npm install && npm run dev
cd backend/services/agent   && npm install && npm run dev
cd backend/services/billing && npm install && npm run dev
```

### 5. Run the frontend
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173**.

### 6. Production build of the frontend
```bash
cd frontend
npm run build      # output in frontend/dist
npm run lint
```

## Environment variables

| Where | Variables |
|---|---|
| `backend/gateway/.env` | `PORT`, `AUTH_SERVICE`, `CHAT_SERVICE`, `AGENT_SERVICE`, `BILLING_SERVICE`, `FRONTEND_URL`, `REDIS_URL` |
| `backend/services/auth/.env` | `PORT`, `MONGODB_URI`, `REDIS_URL`, `CHAT_SERVICE` |
| `backend/services/chat/.env` | `PORT`, `MONGODB_URI`, `REDIS_URL` |
| `backend/services/agent/.env` | `PORT`, `MONGODB_URI`, `REDIS_URL`, `CHAT_SERVICE`, `AUTH_SERVICE`, `GROQ_API_KEY`, `GOOGLE_API_KEY`, `OPENROUTER_API_KEY`, `TAVILY_API_KEY`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_KEY`, `AWS_BUCKET_NAME`, `QDRANT_URL`, `QDRANT_API_KEY` |
| `backend/services/billing/.env` | `PORT`, `MONGODB_URI`, `AUTH_SERVICE`, `REDIS_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| `frontend/.env` | `VITE_SERVER_URL` (gateway URL), `VITE_FIREBASE_API_KEY`, `VITE_RAZORPAY_KEY_ID` |

Default local ports: gateway 8000, auth 8001, chat 8002, agent 8003, billing 8004, frontend 5173. `FRONTEND_URL` in the gateway must match the address the frontend runs on, otherwise login cookies and CORS will fail.

## API reference

All requests go through the gateway and use the session cookie (`withCredentials: true`).

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/login`, `GET /api/auth/logout`, `GET /api/me`, `POST /api/auth/update-profile`, `POST /api/auth/delete-account` |
| Conversations | `GET /api/chat/create-conversation`, `GET /api/chat/get-conversations`, `GET /api/chat/get-messages/:id`, `POST /api/chat/update-conversation`, `DELETE /api/chat/delete-conversation/:id`, `POST /api/chat/pin-conversation/:id`, `POST /api/chat/edit-message` |
| Sharing | `POST /api/chat/share/:id`, `GET /api/chat/public/share/:token` (public) |
| Library | `GET`, `PATCH`, `DELETE /api/chat/library[/:id]` |
| Agent | `POST /api/agent/chat` (multipart: `prompt`, `conversationId`, `agent`, optional `file`) |
| Billing | `POST /api/billing/create`, `POST /api/billing/verify`, `GET /api/billing/history` |

The agent response contains `answer`, `images` and `artifacts` (`[{ title, files: [{ name, content }] }]`).

## Plans and credits

| Plan | Price | Credits | Validity |
|---|---|---|---|
| Free | ₹0 | 100 | 30 days |
| Starter | ₹199 | 500 | 30 days |
| Pro | ₹499 | 1000 | 30 days |

Using an agent deducts credits from your balance. Your plan and remaining credits are always visible in the sidebar profile card.

## Frontend guide for contributors

The frontend has two layers. Keep them separate.

**Connection layer (change with care, it talks to the backend):**
`frontend/utils/axios.js`, `frontend/utils/firebase.js`, `frontend/src/features/*`, `frontend/src/redux/*`.
These define every API call and the shared state (`user.userData`, `conversation`, `message`). Changing them can break the app.

**Visual layer (safe to restyle):**
`frontend/src/components/*`, `frontend/src/pages/*`, `frontend/src/index.css`.
You can freely change layout, classes and animation here, as long as you keep every handler, `useEffect`, dispatch and API call in place.

Rules of thumb:
- Colours, fonts and radii live as design tokens in `src/index.css`. Use them instead of hard-coded values.
- Reusable pieces (buttons, glass cards, modal shell, reveal-on-scroll) live in `components/ui/`.
- The landing page does not call the API or use Redux. It receives `onGetStarted`, `loginLoading` and `loginError` from `Home.jsx`.
- The 3D hero is lazy-loaded and is turned off on small screens and when the user prefers reduced motion.
- There is no react-router. `App.jsx` checks the URL for `/share/:token`, otherwise renders `Home`, which shows the landing page or the workspace depending on login.
- Before opening a pull request run `npm run lint` and `npm run build`.

## Project progress

### Backend: complete
- [x] API gateway with login check and service proxying
- [x] Auth service (Google login, sessions, profile, account deletion)
- [x] Chat service (conversations, messages, pin, share, edit, library)
- [x] Agent service (LangGraph router, 8 agents, uploads, S3, vector search, credits)
- [x] Billing service (Razorpay orders, verification, history)
- [x] Dockerfiles and GitHub Actions workflow for AWS ECR

### Frontend redesign: complete

| Phase | Scope | Status |
|---|---|---|
| 0 | Safety snapshot and code audit | Done |
| 1 | Design system: tokens, fonts, reusable UI pieces | Done |
| 2 | Landing page with 3D agent orb | Done |
| 3 | Landing page connected to Google login | Done |
| 4 | App shell: sidebar, top bar, layout | Done |
| 5 | Chat: messages, thinking animation, composer, clickable suggestions | Done |
| 6 | Artifact panel (code and live preview) and Library | Done |
| 7 | Modals, billing drawer, public share page | Done |
| 8 | Polish, performance, accessibility, final QA | Done |

The redesign changed only how the app looks. The frontend-to-backend connections were kept as they were, and the backend was not modified.

## Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| Google popup closes or login fails | Check `VITE_FIREBASE_API_KEY`, that your domain is in Firebase authorised domains, and that `serviceAccountKey.json` is in the auth service |
| Logged in but refresh sends you to the landing page | Cookie not stored: make sure `FRONTEND_URL` in the gateway matches the frontend address exactly, and `VITE_SERVER_URL` points to the gateway |
| CORS errors in the browser console | `FRONTEND_URL` mismatch in `backend/gateway/.env` |
| Chat sends but no answer | Check that the agent service is running and the LLM keys (`GROQ_API_KEY`, `GOOGLE_API_KEY`, `OPENROUTER_API_KEY`) are valid |
| PDF questions fail | Check Qdrant (`QDRANT_URL`, `QDRANT_API_KEY`) and S3 settings |
| Web search returns nothing | Check `TAVILY_API_KEY` |
| Payment window does not open | The Razorpay script in `frontend/index.html` must be present, and `VITE_RAZORPAY_KEY_ID` set |
| Services cannot talk to each other | Check Redis is running (`docker compose up -d`) and the `*_SERVICE` URLs in each `.env` |
| 3D hero is missing | Expected on small screens or with reduced motion enabled; otherwise check the browser console for WebGL errors |

## Roadmap
- [ ] Automated tests (none yet) for backend services and key frontend flows
- [ ] Frontend deployment pipeline (the current workflow only builds backend images)
- [ ] Rename the workflow in `deploy.yml` from its old name
- [ ] Per-agent usage analytics and rate limiting
- [ ] More agents and file types

## Security notes
- Never commit `.env` files or `serviceAccountKey.json`. Both are in `.gitignore`; run `git status` before every push.
- If a secret was ever committed or shared (including inside a zip), rotate it.
- The Firebase web API key and the Razorpay key **ID** are public by design. The Razorpay **secret** must stay in the billing service only.

## License
Add a license of your choice (for example MIT) before making the repository public.