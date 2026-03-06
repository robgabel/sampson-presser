# Cost Estimate: Coach Samp's Pregame Presser

**What it would cost if human developers built this project**

---

## Codebase Inventory

| Metric | Count |
|---|---|
| TypeScript/TSX source files | 15 |
| CSS files | 2 |
| Data/content files (JSON) | 3 |
| Lines of TypeScript/TSX | 2,120 |
| Lines of CSS | 1,406 |
| Lines of curated content JSON | 1,260 |
| **Total lines** | **~4,786** |

---

## What Was Built

### Core Game Engine (401 LOC)
- 90-second countdown timer with passive sweat accrual
- Score system with dynamic streak multipliers (1.5x → 2x → 3x)
- Bank account system ($100K start, $25K fines)
- Sweat meter (0–100) with 3 end-game conditions
- Weighted question selection across 8+ categories with no repeats
- 15 interconnected state fields managed via React hooks
- Dynamic question hydration (opponent/coach name substitution)

### 8 React Components
- **TitleScreen** — dynamic next-opponent display from schedule data
- **GameScreen** — HUD, question bubbles, answer feedback, reporter silhouettes
- **GameOverScreen** — 7-tier rating system, stats, share functionality
- **KelvinPuppet** — CSS character with mouth animation, fire aura, sweat drops
- **TieRipEvent** — swipe gesture with timing windows (perfect/okay/missed)
- **PronunciationBlitz** — 3-card swipe minigame
- **CroninVenmo** — timed notification overlay with choice buttons
- **InventSchool** — template-based school selection with countdown

### Sound System (304 LOC)
- 8 procedurally synthesized sounds via Web Audio API (no audio files)
- iOS audio context unlock mechanism
- Persistent silent playback to keep iOS audio session alive
- Auto-recovery from iOS re-suspension

### Visual Design (1,406 LOC CSS)
- Mobile-first responsive layout (430px max-width)
- Dark mode with UH scarlet accent (#C8102E)
- Framer Motion animations throughout
- Glass morphism effects, gradient backgrounds
- 56–64px touch targets for mobile

### Content
- 40+ questions across 8 categories, each with 3 scored answers
- 50+ curated Kelvin Sampson quotes
- Dynamic schedule data (4 games with opponent, rank, venue, TV)

---

## Cost Breakdown

**Rate assumptions:** $150/hr senior US freelance React developer, $100/hr for content/PM work

| Work Item | Hours | Rate | Cost |
|---|---|---|---|
| Project setup & tooling (Vite + React + TS, ESLint, build config) | 3 | $150 | $450 |
| Game engine (timer, scoring, streaks, sweat, state machine, question logic, event scheduling) | 14 | $150 | $2,100 |
| Title screen (dynamic schedule, opponent display, how-to-play overlay) | 4 | $150 | $600 |
| Main game screen (HUD, questions, feedback, reporters, animations) | 10 | $150 | $1,500 |
| Game over screen (ratings, stats, share text, opponent context) | 4 | $150 | $600 |
| Kelvin puppet (CSS character, mouth flap, fire aura, sweat drops) | 6 | $150 | $900 |
| 4 special events (Tie Rip, Pronunciation Blitz, Cronin Venmo, Invent a School) | 14 | $150 | $2,100 |
| Sound manager (Web Audio API, 8 synthesized sounds, iOS workarounds) | 8 | $150 | $1,200 |
| CSS & visual design (full responsive styling, animations, gradients, mobile-first) | 12 | $150 | $1,800 |
| Content creation (40 questions × 3 answers, 50 quotes, schedule data) | 8 | $100 | $800 |
| Type system & utilities | 2 | $150 | $300 |
| QA, playtesting, difficulty tuning | 6 | $150 | $900 |
| Project management & PRD/spec writing | 6 | $100 | $600 |

---

## Totals

| | Freelancer | Agency (1.5–2x) |
|---|---|---|
| **Hours** | ~97 | ~97 |
| **Blended rate** | ~$140/hr | ~$210–280/hr |
| **Estimated cost** | **$13,850** | **$20,000–$27,000** |

---

## What's NOT Included in This Estimate

These items from the CLAUDE.md roadmap have not been built yet:

- Vercel deployment & custom domain setup
- html2canvas share card image generation
- Game Phase 2 visual polish (photo puppet layers, reporter animations, environment effects)
- Open Graph meta tags & link preview optimization
- Any testing (zero test coverage currently)
- The entire Part 2 full Expo/React Native app (Schedule, Stats, History, News, Supabase backend, AI news pipeline, App Store submission)

### Full App Estimate (Parts 1 + 2)

If the complete vision in CLAUDE.md were built by humans:

| Phase | Hours | Cost (Freelancer) |
|---|---|---|
| Mini-game (current, done) | ~97 | $13,850 |
| Game Phase 2–4 (polish, events, sharing, domain) | ~60 | $9,000 |
| App Phase 0–1 (Expo setup, design system, skeleton) | ~80 | $12,000 |
| App Phase 2 (database, scrapers, historical data) | ~120 | $18,000 |
| App Phase 3 (live data pipelines, core screens) | ~160 | $24,000 |
| App Phase 4 (AI news pipeline, media) | ~80 | $12,000 |
| App Phase 5 (polish, App Store submission) | ~60 | $9,000 |
| **Full project total** | **~657** | **~$98,850** |

At agency rates: **$148,000–$197,000**

---

*Estimate generated March 6, 2026. Based on US market rates for mid-senior freelance React/React Native developers.*
