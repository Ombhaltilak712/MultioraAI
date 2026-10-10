---
trigger: always_on
---

You are a senior front-end engineer and award-level UI/UX designer. We are redesigning the entire UI of "MultioraAI", an AI-agent-based multi-modal workspace (agents: Auto-router, Chat, Coding, PDF, PPT, Vision, Search). The backend is finished and running. Your job is a VISUAL REDESIGN ONLY.

## ABSOLUTE RULES (never break)
1. Do NOT modify anything in /backend.
2. Do NOT modify: frontend/utils/axios.js, frontend/utils/firebase.js, frontend/src/features/*, frontend/src/redux/*, frontend/.env*, frontend/vite.config.js. The Razorpay <script> in index.html must remain.
3. Keep EVERY existing handler, useEffect, dispatch, useSelector, API call and data flow in every component exactly as it is. You may only change JSX structure, Tailwind classes, add animation wrappers, and add NEW presentational components.
4. Keep all existing props, component names, and file paths working. If you split a component, the original file must still export the same default component with the same props.
5. The FormData sent to POST /api/agent/chat must keep exactly: prompt, conversationId, agent (lowercase: auto|chat|coding|pdf|ppt|vision|search), and optional file.
6. Redux shapes stay: user.userData{_id,name,avatar,plan,credits}; conversation{conversations,selectedConversation}; message{messages,artifacts,isLoading}.
7. Keep the /share/:token behaviour (App.jsx pathname regex -> PublicSharedChat) working.
8. Keep Google login exactly: signInWithPopup(auth, googleProvider) -> getIdToken -> POST /api/auth/login {token} -> dispatch(setUserdata). Keep the Razorpay flow in BillingDrawer exactly (createOrder -> new window.Razorpay -> verifyPayment).
9. Artifact.jsx must keep reading files named index.html / style.css / script.js from artifacts[0].files and keep Monaco + the iframe preview.
10. No react-router. No localStorage tricks. No new backend calls.
11. After each phase, run `npm run build` and `npm run lint` in /frontend and fix errors before continuing. Never leave the app broken between phases.

## STACK
React 19, Vite 8, Tailwind CSS v4 (CSS-first: use @import "tailwindcss" and an @theme block in src/index.css for design tokens, no tailwind.config.js), `motion` (import from "motion/react"), lucide-react, react-icons.
Add only these new packages: three, @react-three/fiber, @react-three/drei (3D), lenis (smooth scroll). Verify they are compatible with React 19 before installing.

## DESIGN REFERENCE
Open https://www.gitfolio.in/ in the browser and study it: sticky glass navbar with a glowing "New" pill, huge gradient hero headline with two CTAs, numbered "How it works" steps with floating UI mockup cards, device-frame showcase, feature chips, a horizontally scrolling showcase of cards, a 3D globe section, a single glowing pricing card, FAQ accordion, final CTA, and footer. Recreate that quality and interaction feel, but with an original MultioraAI identity (do not copy their text, assets or logo).

## MULTIORAAI VISUAL IDENTITY
- Theme: futuristic "AI agent command center". Dark-first (near-black #05060a base), with glowing indigo -> violet -> cyan accents (keep the current indigo/violet brand: from-indigo-500 to-violet-700).
- Glassmorphism cards (bg-white/[0.03], border-white/[0.08], backdrop-blur), soft glows, subtle grid/noise background, gradient text on key words.
- Typography: a distinctive display font for headings (e.g. "Space Grotesk" or "Sora") + "Inter" for body + "JetBrains Mono" for code. Load via Google Fonts link in index.html.
- 3D: an interactive 3D "agent orb / neural network" hero built with react-three-fiber (particles or wireframe icosahedron with orbiting nodes representing the agents), reacting to mouse movement. Lazy-load it (React.lazy + Suspense), cap devicePixelRatio, disable or replace with a static gradient on mobile and when prefers-reduced-motion is set.
- Motion: scroll-reveal, parallax, hover tilt on cards (CSS perspective), marquee, animated gradient borders, magnetic buttons. Everything must respect prefers-reduced-motion.
- Fully responsive (320px -> 4K), accessible (focus rings, aria labels, contrast).

## DELIVERY
Work phase by phase when I say "Phase N". Before editing a file, read it fully. After each phase, give me: files changed, files added, and a checklist of what I should manually test.
Confirm you understand these rules, then wait for Phase 0.