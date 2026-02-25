# COOGS APP — Ultimate Houston Cougars Basketball App

## Master Project Checklist (Final v2)

---

## How This Is Structured

The mini-game ships first as a standalone web game. It's the proof of concept, the viral hook, and the motivation engine. Deploy it to a fun domain, share it in UH group chats, and let it spread. Then build the full app around it.

The game is a live pregame presser simulator. It dynamically shows the next real UH opponent on the title screen — "Away at #17 Kansas, Feb 23" — so it feels timely and alive, not generic. Questions are static for v1, with opponent-specific questions planned for v2 to drive repeat play on game days.

The full app is built in Expo (React Native) — one codebase outputs both a mobile web app and a native iOS app. Friends test by opening a URL on their phone. When it's polished, submit to the App Store.

V2 community features are documented at the end so smart architecture decisions are made now without building anything not needed yet.

---

## When to Use Claude Mac App vs. Claude Code

| Use Claude Mac App for: | Use Claude Code CLI for: |
|---|---|
| Planning, strategy, brainstorming | Actually writing code and building |
| Writing copy (App Store listing, in-app text, questions) | Scaffolding projects, installing dependencies |
| Discussing architecture decisions | Creating components, screens, functions |
| Reviewing/critiquing PRD or specs | Editing existing files across the codebase |
| Asking "should I do X or Y?" | Running the app, debugging errors |
| Researching APIs and data sources conversationally | Writing scrapers, edge functions, data pipelines |
| Generating content (Sampson quotes, historical events) | Deploying to Vercel, configuring EAS Build |
| Updating this checklist | Everything that touches the file system |

**The handoff moment:** planning is done when CLAUDE.md is written and the checklist phase is clear. Then open terminal, navigate to the project folder, type `claude`, and start building with Claude Code.

**For the mini-game specifically:** ready to switch to Claude Code NOW. The PRD is written, questions are written, checklist is clear. Next step is `claude` and telling it to read CLAUDE.md and start building Game Phase 1.

---

## PART 1: THE MINI-GAME

### Coach Samp's Pregame Presser

This is a standalone project. Separate repo, separate deploy, separate share link. It joins the main app later as a tab. The title screen dynamically shows the next real UH opponent so it feels like a live pregame experience on game days.

---

### GAME PHASE 0: Setup (Day 1)

- [x] Create GitHub repo (sampson-presser or similar)
- [x] Scaffold project: React + TypeScript + Vite (lightweight, fast, bolt.new compatible if desired)
  - OR scaffold in Expo Web to reuse components later in the main app (pure React is simpler for a standalone game)
- [x] Install dependencies: react, framer-motion (for animations), html2canvas (for share cards)
- [ ] Set up Vercel project for deployment
- [x] Copy full PRD into a CLAUDE.md at the project root — this IS the spec for Claude Code
- [x] Create `questions.json` with all 40 questions from the spec (already written)
- [x] Create `schedule.json` with the remaining 2025-26 UH schedule (see below)
- [x] Decide: static Kelvin image for Phase 1, or illustrated version? (Recommendation: find a good press conference photo and use it as a static image for now. Puppet layers come in Game Phase 2.)
  - Decision: CSS-drawn Kelvin figure at podium for Phase 1. Photo cutout puppet layers in Phase 2.
- [ ] Source assets:
  - [ ] Kelvin press conference photo (check UH Athletics media page or creative commons)
  - [x] UH logo for podium (CSS text-based for Phase 1)
  - [x] Reporter silhouette SVGs (simple, can generate with Claude Code) — CSS-drawn for Phase 1
  - [x] Microphone graphic SVGs — CSS-drawn for Phase 1

#### Schedule Data for Dynamic Title

Hardcode this JSON in the project. Update it manually as postseason games are announced (30-second edit, push to Vercel). No database needed.

```json
[
  {
    "date": "2026-02-23T21:00:00-06:00",
    "opponent": "Kansas",
    "rank": 17,
    "location": "Away",
    "venue": "Allen Fieldhouse",
    "tv": "ESPN"
  },
  {
    "date": "2026-02-28T12:00:00-06:00",
    "opponent": "Colorado",
    "rank": null,
    "location": "Home",
    "venue": "Fertitta Center",
    "tv": "TBD"
  },
  {
    "date": "2026-03-04T21:00:00-06:00",
    "opponent": "Baylor",
    "rank": null,
    "location": "Home",
    "venue": "Fertitta Center",
    "tv": "TBD"
  },
  {
    "date": "2026-03-07T12:00:00-06:00",
    "opponent": "Oklahoma State",
    "rank": null,
    "location": "Away",
    "venue": "Gallagher-Iba Arena",
    "tv": "CBS"
  }
]
```

**Logic:** Find the first game where `date > now`. That's the "next game" shown on the title screen. A game is considered "over" ~2.5 hours after its tip time. If all games are past, show a generic title or a manually added postseason entry.

**Postseason updates:** As Big 12 Tournament (Mar 11-15, Kansas City) and NCAA Tournament games are announced, add entries to this array. One line, push, done.

---

### GAME PHASE 1: Playable Core (Week 1)

**The goal:** a complete, playable 90-second game loop. No animations, no special events, no sound. Just the core mechanic working and fun.

#### Game Engine

- [x] Build game state manager:
  - [x] Timer: 90-second countdown
  - [x] Score: running total
  - [x] Bank account: starts at $100,000
  - [x] Streak counter: consecutive Peak Kelvin answers
  - [x] Sweat meter: 0-100, increases on wrong answers and over time
  - [x] Questions seen: track to avoid repeats
  - [x] Game state: `title | playing | game-over`
- [x] Build question selection logic:
  - [x] Pool of 40 questions, categorized
  - [x] Select 12-15 per game based on time (one every 6-8 seconds)
  - [x] Weighted random: pull from different categories, don't repeat
  - [x] Randomize answer button order each question
- [x] Build scoring system:
  - [x] Peak Kelvin: +500 base x streak multiplier
  - [x] Mid: +100, streak resets
  - [x] Anti-Kelvin: -$25,000 fine, streak resets, +15 sweat
  - [x] Streak multiplier: 2 in a row = 1.5x, 3+ = 2x
  - [x] Sweat buildup: +5 per question passively, +15 on Anti-Kelvin, -5 on Peak Kelvin
- [x] Build end conditions:
  - [x] Timer hits 0 -> game over (survived)
  - [x] Bank account hits $0 -> "Fined Out" game over
  - [x] Sweat meter hits 100 -> "Sweat Out" game over (medical timeout)

#### Screens

- [x] **Title Screen** (dynamic pregame presser):
  - [x] Read `schedule.json`, find next upcoming game
  - [x] Title: "COACH SAMP'S PREGAME PRESSER"
  - [x] Dynamic subtitle showing next opponent:
    - Away game: "Away at #17 Kansas — Mon, Feb 23"
    - Home game: "vs Colorado — Sat, Feb 28"
    - With venue name below: "Allen Fieldhouse - ESPN"
  - [x] If no upcoming game found: fall back to generic "PRESS CONFERENCE SURVIVAL"
  - [x] Subtitle tagline: "Don't get fined. Don't get soft. Don't call him Kevin."
  - [x] [START PRESS CONFERENCE] button
  - [x] Static Kelvin image at podium
  - [x] "How to Play" link -> overlay with 3-panel explainer
  - [x] Opponent logo or name displayed prominently (makes screenshots more shareable — "I'm prepping for Kansas tonight")

- [x] **Main Game Screen:**
  - [x] HUD bar: timer (M:SS), score, bank account ($XXK)
  - [x] Streak indicator (only visible when streak >= 2, shows multiplier)
  - [x] Sweat meter: horizontal bar with color gradient (blue -> yellow -> orange -> red)
  - [x] Static Kelvin image at podium (center)
  - [x] Question bubble (animated in from reporter area)
  - [x] Reporter silhouettes (bottom third) — static row for Phase 1
  - [x] 3 answer buttons: large touch targets (56-64px height), no color coding before selection
  - [x] Post-selection feedback: brief gold flash (Peak Kelvin), gray (Mid), or red flash + screen shake (Anti-Kelvin)
  - [x] 1.5-second pause between questions for feedback to register

- [x] **Game Over Screen:**
  - [x] Final rating title based on score thresholds:
    - 0-1999: "Assistant Coach Material"
    - 2000-3999: "Mid-Major Mentality"
    - 4000-5999: "Blue Collar, Hard Hat"
    - 6000-7999: "Don't Sleep on This Guy"
    - 8000+: "PEAK KELVIN"
  - [x] Context line: "Pregame presser: Away at #17 Kansas" (from schedule data)
  - [x] Stats: questions answered, Peak Kelvin %, streak record, money remaining
  - [x] Random Kelvin quote from curated list
  - [x] [PLAY AGAIN] button
  - [x] [SHARE RESULTS] button (text-based for Phase 1, image in Game Phase 4)
  - [x] How ended: "Survived" or "Fined Out" or "Sweat Out"

#### GAME CHECKPOINT 1: Is it fun?

- [ ] Deploy to Vercel
- [ ] Play it 10 times — is the pacing right? Too easy? Too hard?
- [ ] Send link to 3-4 friends: "Play this and tell me your rating"
- [ ] Tune difficulty: adjust fine amounts, sweat rates, timing if needed
- [ ] Key question: are people playing it more than once? If yes, golden.

---

### GAME PHASE 2: Visual Polish (Week 2)

Now the game is fun. Make it look amazing.

#### Kelvin Puppet

- [ ] Segment Kelvin photo into layers OR commission simple illustrated version:
  - [ ] Head (upper): forehead, eyes, nose — base layer
  - [ ] Jaw: lower face — separate element
  - [ ] Torso: blue shirt, shoulders
  - [ ] Left arm: resting position
  - [ ] Right arm: resting position
  - [ ] Tie: separate element (Houston red)
- [ ] Implement jaw animation: fixed-rhythm flap when "speaking" (CSS keyframes)
- [ ] Implement head nod/tilt on answer selection (CSS transform)
- [ ] Implement arm movements:
  - [ ] Peak Kelvin: left arm raises to point at reporters
  - [ ] Anti-Kelvin: right arm slams podium (podium shakes)
- [ ] Implement shirt darkening at sweat thresholds (CSS filter: brightness decrease at 33%, 66%, 90%)
- [ ] Add cartoon sweat drops overlaid on photo (CSS keyframe: drip down, fade, multiply with meter)

#### Reporter Reactions

- [ ] Create 5 reporter silhouettes with variety (hair, glasses, hat)
- [ ] Highlight active reporter when question fires (opacity/scale change)
- [ ] Peak Kelvin: reporters visibly recoil (translateX lean back)
- [ ] Anti-Kelvin: reporters lean forward eagerly
- [ ] Add speech bubble animation (scale up from reporter position)

#### Environment

- [ ] Blurred press conference room backdrop
- [ ] Camera flash effects on streak bonuses (brief white overlay, opacity fade)
- [ ] Fire streak effect behind Kelvin on 3+ streak (gradient flames, CSS animation)
- [ ] Podium vibration on emphatic answers (CSS transform shake)
- [ ] Screen shake on Anti-Kelvin answers (CSS transform)

#### Typography & Polish

- [ ] Bold sans-serif for questions (Inter or system font)
- [ ] Monospace/sporty font for HUD (timer, score)
- [ ] Display font for end-screen ratings
- [ ] Italic serif for Kelvin quotes on results screen
- [ ] Ensure all touch targets are >= 48px, ideally 56-64px
- [ ] Test on small phones (iPhone SE viewport)

#### GAME CHECKPOINT 2: Does it look right?

- [ ] Deploy updated build
- [ ] Screenshot test: does a screenshot of gameplay look share-worthy?
- [ ] Animation test: do the puppet movements feel intentionally janky (comedy) or just broken?
- [ ] Send to friends: "Same game, now it looks real. Play again."

---

### GAME PHASE 3: Special Events (Week 2-3)

These are the moments that make the game memorable and give it replay value.

#### Tie Rip Moment

- [ ] Trigger: randomly once per game, after an Anti-Kelvin answer
- [ ] Screen border flashes red
- [ ] Text overlay: "TERRIBLE CALL! RIP THE TIE!"
- [ ] Swipe-down gesture zone over Kelvin's tie
- [ ] Timing window: ~2 seconds
- [ ] Perfect timing: tie detaches, flies off screen with CSS rotation + translate arc, +1000 pts
- [ ] Okay timing: tie fumble animation, +300 pts
- [ ] Missed: tie stays, no bonus
- [ ] Tie stays off for rest of game after successful rip (visual state change)

#### Pronunciation Blitz

- [ ] Trigger: randomly once per game, around the midpoint
- [ ] Full-screen takeover, ~8 seconds total
- [ ] Header: "PRONUNCIATION CHECK!"
- [ ] 3 word cards from pool of 10, one at a time
- [ ] Each shows word + pronunciation (e.g., "Gon-ZAWG-ah")
- [ ] Player swipes LEFT (wrong) or RIGHT (correct)
- [ ] Quick success/fail animation per card
- [ ] All 3 correct: +750 bonus
- [ ] 2 correct: +400
- [ ] 1 or 0: +100

#### Mick Cronin Venmo

- [ ] Trigger: randomly once per game
- [ ] Venmo-styled notification slides in from top
- [ ] "Mick Cronin paid you $1.00 — 'Heard your presser'"
- [ ] Two buttons: [ACCEPT & LAUGH] (+500) or [DECLINE] (-200)
- [ ] 3-second event, does NOT pause the clock
- [ ] Plays over the current question if one is active

#### Invent a School

- [ ] Trigger: randomly once per game
- [ ] Prompt: "THIS ISN'T JANUARY AGAINST ____" (or one of 4 set templates)
- [ ] 4 fake school options with point values (500 for OG references, 300-400 for others)
- [ ] All options are correct (all give points), but the most Kelvin-authentic ones score highest
- [ ] 5-second timer
- [ ] Kelvin puppet delivers the line with selected school after choice

#### Special Event Logic

- [ ] Maximum 3 special events per game (from pool of 4 event types)
- [ ] No two events back-to-back — minimum 2 regular questions between events
- [ ] Events distributed across the 90 seconds (not all clustered at end)
- [ ] Track which events fired to avoid showing the same event twice in one game

---

### GAME PHASE 4: Share & Virality (Week 3)

This is how the game spreads. Treat the share card like a product unto itself.

#### Share Card (Image)

- [ ] Use html2canvas or Canvas API to generate a shareable image from the results screen
- [ ] Share card layout:

```
+------------------------------+
| COACH SAMP'S PREGAME PRESSER |
| Away at #17 Kansas - Feb 23  |
|                              |
| [Kelvin puppet image, small] |
|                              |
| PEAK KELVIN                  |
| Score: 8,450                 |
| $62,000 remaining            |
| Best streak: 5               |
| Survived                     |
|                              |
| "Don't sleep on Houston."    |
|                              |
| sampsonpresser.com           |
+------------------------------+
```

- [ ] Dynamic opponent + date on the card makes it timely — "I prepped for Kansas tonight"
- [ ] Card should look good as an iMessage image (roughly 1080x1350 or 1080x1080)
- [ ] Include game URL on the card so recipients know where to play
- [ ] Dark background, bold typography, UH colors — screenshot-worthy

#### Share Mechanics

- [ ] [SHARE] button on game over screen
- [ ] Uses Web Share API (`navigator.share`) on mobile — triggers native iOS share sheet
- [ ] Fallback: "Copy Link" button that copies URL + score text to clipboard
- [ ] Share text (dynamic with opponent): "I got PEAK KELVIN prepping for Kansas tonight! Score: 8,450. Can you survive Coach Samp's presser? [link]"
- [ ] Generic fallback if no upcoming game: "I got PEAK KELVIN in Coach Samp's Pregame Presser! Score: 8,450. [link]"
- [ ] Optional: "Share to Twitter/X" deep link with pre-filled text

#### Domain & Branding

- [ ] Register a fun domain: sampsonpresser.com, dontsleeponghouston.com, or similar
- [ ] Point domain to Vercel deployment
- [ ] Add Open Graph meta tags so the link previews well in iMessage/Twitter:
  - og:title: "Coach Samp's Pregame Presser" (or dynamic: "Coach Samp's Pregame Presser — vs Kansas")
  - og:description: "Don't get fined. Don't get soft. Don't call him Kevin."
  - og:image: static promotional image (Kelvin at podium with game title)
  - Note: OG tags are static HTML. For dynamic opponent in previews, need server-side rendering (Vercel Edge Functions). Fine to keep static for v1 — the share card image carries the opponent context.
- [ ] Add favicon (small UH-colored basketball or microphone icon)

#### Sound Effects (Optional, Togglable)

- [ ] Sound toggle button in HUD (on/off), default OFF on mobile
- [ ] Sounds to add (short, punchy, royalty-free):
  - [ ] Question appear: subtle "ding"
  - [ ] Peak Kelvin: crowd cheer / air horn
  - [ ] Anti-Kelvin: buzzer / record scratch
  - [ ] Streak fire: rising flame whoosh
  - [ ] Tie rip: fabric tear
  - [ ] Podium slam: thud
  - [ ] Camera flash: shutter click
  - [ ] Game over: press conference wrap-up murmur
- [ ] All sounds loaded as small audio sprites, not individual files
- [ ] Respect mobile audio policies (require user interaction before playing)

#### GAME CHECKPOINT 3: Viral test

- [ ] Deploy final game to custom domain
- [ ] Send to full UH friend group (10-20 people)
- [ ] Watch for organic sharing: do people send their share cards to others without being asked?
- [ ] Track: How many unique visitors in the first 48 hours?
- [ ] Track: Are people playing multiple times? (check if average games > 1 per visitor)
- [ ] If it's spreading: post in UH alumni Facebook groups, Reddit r/UniversityOfHouston, UH Twitter/X

---

## PART 2: THE FULL COOGS APP

### Schedule, Scores, Stats, History, News + The Game

Now build the comprehensive app. The mini-game becomes a feature inside it.

---

### APP PHASE 0: Environment & Infrastructure (Days 1-3)

#### Dev Environment

- [ ] Install Claude Code CLI (if not already done from game project)
- [ ] Perplexity MCP, Context7 MCP, Supabase MCP should still be configured
- [ ] Verify: `claude mcp list`

#### Project Setup

- [ ] Create NEW GitHub repo (uh-coogs-app)
- [ ] Scaffold Expo project: `npx create-expo-app@latest uh-coogs --template blank-typescript`
- [ ] Verify Expo web support: `npx expo start --web`
- [ ] Create Supabase project (new project for the full app)
- [ ] Set up `.env` with `EXPO_PUBLIC_` prefixed variables
- [ ] Install core dependencies:
  - @supabase/supabase-js
  - expo-router (file-based routing)
  - react-native-reanimated (animations)
  - expo-web-browser (in-app article links)
  - expo-calendar (add to calendar)
  - expo-notifications (push notifications, for later)
  - expo-haptics (haptic feedback)
- [ ] Configure EAS Build (for eventual App Store — set up now, use later)
- [ ] Set up Vercel project for web deployment (friend testing)
- [ ] Write CLAUDE.md in project root:
  - Full app vision and feature set
  - Tech stack and conventions (TypeScript strict, dark mode only, component patterns)
  - Supabase schema overview
  - Design system specs
  - "Do not" list: no sign-in for v1, no community features, no light mode
  - Link to the mini-game PRD for game integration reference

#### Design Decisions (Locked In)

- [ ] Dark mode only for v1
- [ ] 5 tabs: Home, Schedule, History, News, More
  - "More" contains: Sampson Zone (with game), Settings, About, Watch Parties
- [ ] Data refresh: pull-to-refresh + background cron, no WebSockets for v1
- [ ] Web-first testing: deploy to Vercel, share URL, friends test on mobile Safari

---

### APP PHASE 1: Design System & Skeleton (Week 1)

#### Design System

- [ ] Create `theme.ts`:
  - Colors: Scarlet `#C8102E`, White `#FFFFFF`, Dark BG `#111111`, Card BG `#1A1A1A`, Muted `#999999`, Win Green `#2ECC71`, Loss Red `#E74C3C`
  - Typography scale: title 28pt, header 20pt, body 16pt, caption 13pt (system font / SF Pro)
  - Spacing: 4, 8, 12, 16, 24, 32, 48
  - Border radius: 12px cards, 8px buttons, 24px modals
- [ ] Build reusable components:
  - GameCard — opponent logo/name, score or tip time, W/L color bar, date
  - CountdownTimer — days/hours/min/sec, auto-updating
  - SectionHeader — title + optional "See All" link
  - NewsCard — headline, source badge, time ago, thumbnail
  - StatRow — label + value, alternating row shading
  - ScoreBug — compact score display
  - PlayerRow — photo placeholder, name, key stat
  - ScreenShell — consistent wrapper with scroll, pull-to-refresh, safe areas
  - EmptyState — friendly message when no data ("Season starts soon!")
  - SkeletonLoader — shimmer placeholder for loading states

#### App Skeleton

- [ ] Set up Expo Router with 5-tab navigation + icons
- [ ] Create placeholder screens for each tab
- [ ] Build Home screen layout with hardcoded mock data:
  - Next game countdown card
  - Last game result card
  - "This Day in Cougar History" card
  - Quick links row (Schedule, Stats, History, News)
  - Sampson Quote of the Day
- [ ] Deploy to Vercel — verify it works on mobile Safari

#### Mini-Game Integration

- [ ] Port mini-game into the app as a screen under More > Sampson Zone > Press Conference Game
- [ ] Reuse components where possible, adapt styling to match app theme
- [ ] OR embed the standalone web game via WebView (simpler for v1, less native feel)
- [ ] Decide approach based on how much game code can cleanly share with Expo components

---

### APP PHASE 2: Database & Historical Data (Week 2-3)

#### Supabase Schema

Design and deploy full migration:

**Core Tables:**

- [ ] `coaches` — id (UUID), name, start_year, end_year, wins, losses, conf_wins, conf_losses, tournament_apps, final_fours, bio, photo_url, created_at, updated_at
- [ ] `seasons` — id (UUID), year, coach_id (FK), wins, losses, conf_wins, conf_losses, conf_name, tournament_result, tournament_seed, ap_preseason_rank, ap_final_rank, awards_text, created_at, updated_at
- [ ] `players` — id (UUID), name, position, jersey_number, hometown, high_school, height, photo_url, years_active_start, years_active_end, created_at, updated_at
- [ ] `player_seasons` — id (UUID), player_id (FK), season_year, games, starts, mpg, ppg, rpg, apg, spg, bpg, fg_pct, three_pct, ft_pct, created_at, updated_at

**Games & Stats:**

- [ ] `games` — id (UUID), season_year, date, opponent, opponent_logo_url, location, venue, home_away, result, uh_score, opp_score, is_conference, is_tournament, tournament_round, tv_channel, attendance, created_at, updated_at
- [ ] `game_box_scores` — id (UUID), game_id (FK), player_id (FK), minutes, points, rebounds, assists, steals, blocks, turnovers, fouls, fg_made, fg_att, three_made, three_att, ft_made, ft_att
- [ ] `betting_lines` — id (UUID), game_id (FK), spread, over_under, spread_result, ou_result, source, fetched_at

**Curated Content:**

- [ ] `top_recruits` — id (UUID), rank, name, recruit_year, position, high_school, city_state, stars, career_summary, went_pro, pro_career_note, photo_url
- [ ] `top_games` — id (UUID), rank, game_id (FK nullable), headline, season_year, opponent, description, why_it_matters
- [ ] `historical_events` — id (UUID), month, day, year, title, description, game_id (FK nullable), significance (1-5)
- [ ] `sampson_quotes` — id (UUID), quote_text, context, source

**News & Media:**

- [ ] `news_articles` — id (UUID), title, source_name, source_url, summary, relevance_score, published_at, tags (text[]), article_type, is_duplicate, hero_image_url, created_at
- [ ] `press_conferences` — id (UUID), title, youtube_url, youtube_thumbnail, game_id (FK nullable), date, type (pre/post/weekly)

**Database Setup:**

- [ ] Set up RLS: public read, service_role write
- [ ] Create indexes: games(date), games(season_year), player_seasons(season_year), news_articles(published_at), historical_events(month, day)
- [ ] All primary keys are UUIDs (future-proofs for sync, offline, user references)
- [ ] All tables have created_at and updated_at

#### Historical Data Seeding

- [ ] Use Perplexity MCP to research scraping strategy
- [ ] Write Node.js scrapers for sports-reference.com/cbb/schools/houston:
  - Season records (all years, records, coaches)
  - Game logs per season
  - Rosters per season
- [ ] Run scrapers -> transform -> bulk insert to Supabase
- [ ] Spot-check critical seasons:
  - 1967-68 (Elvin Hayes, Game of the Century)
  - 1982-84 (Phi Slama Jama, Hakeem, Clyde)
  - 2020-21 (Final Four)
  - 2022-23 (National Championship game)
  - Current season

#### Curated Content (Recruit Your Friends)

- [ ] Create shared Google Sheet for collaborative input:
  - Top 50 Games — each friend nominates 10, rank together
  - Top 100 Recruits — start with all McDonald's All-Americans + 5-stars
  - "This Day in Cougar History" — aim for 100+ events across the calendar
  - Sampson quotes — pull from pressers, aim for 30+
- [ ] Build import script: Google Sheet -> Supabase
- [ ] Source coach photos and historical images (check UH Athletics media guidelines)

---

### APP PHASE 3: Current Season — Core Experience (Week 3-5)

#### Data Pipelines

- [ ] Sign up for The-Odds-API (free tier: 500 requests/month)
- [ ] Use Perplexity MCP to research working ESPN endpoints for college basketball
- [ ] Build Supabase edge functions:
  - `sync-schedule` — fetch current season schedule, upsert to games
  - `sync-scores` — update game results after completion
  - `sync-odds` — pull spreads/O/U for upcoming UH games
  - `sync-box-scores` — fetch player stats for completed games
- [ ] Set up pg_cron:
  - Schedule: daily 6am CT
  - Scores: every 2 hours (Nov-Apr)
  - Odds: every 6 hours
  - Box scores: 3 hours after each scheduled game time
- [ ] Add error logging: `pipeline_errors` table
- [ ] Create `DATASOURCES.md` documenting every endpoint, rate limit, fragility

#### Build Core Screens

- [ ] **Home Screen** (replace mocks with live Supabase queries):
  - Next game countdown (next game where date > now)
  - Last game result card
  - "This Day in Cougar History" (query by month + day)
  - Sampson Quote of the Day (rotate by day of year)
  - Latest news card (top article from news table)

- [ ] **Schedule Screen:**
  - Full season list, W/L color-coded (green/red/gray)
  - Each row: date, opponent + logo, score or tip time, TV, spread
  - Season record summary at top (Overall, Conference, Home, Away)
  - ATS record: "UH is 18-9 ATS"
  - Tap -> Game Detail
  - "Add to Calendar" for future games

- [ ] **Game Detail Screen:**
  - Score header with team styling
  - Box score table (sortable)
  - Betting result: spread covered or not, O/U result
  - Press conference link (if available)
  - Recap article link (if available)

- [ ] **Stats Screen:**
  - Team averages (PPG, RPG, APG, FG%, 3P%)
  - Player leaderboard — sortable columns
  - Tap player -> season stats + game log

- [ ] **History Tab** (wire up to Phase 2 data):
  - Season browser grouped by era/decade
  - Season detail: coach, record, roster, game log, tournament badge
  - Top 50 Games: ranked cards
  - Top 100 Recruits: ranked list
  - Coach profiles

#### APP CHECKPOINT 1: Core testing

- [ ] Deploy to Vercel
- [ ] Send to 5-10 UH fan friends
- [ ] Test questions:
  - "Find last game's box score — how many taps?"
  - "When's the next game and what channel?"
  - "Is UH covering the spread this year?"
  - "Look up the 1983 roster"
- [ ] Fix top 3 issues

---

### APP PHASE 4: News & Media (Week 5-6)

#### AI News Pipeline

- [ ] Identify and test RSS feeds:
  - Houston Chronicle / Chron.com UH sports
  - 247Sports Houston
  - On3 Houston
  - UH Athletics (uhcougars.com)
  - The Athletic Houston
  - GoCoogs.com
- [ ] Build edge function `curate-news`:
  - Pull latest articles from all feeds
  - Call Claude Sonnet 4.5 (Anthropic API) with structured prompt:
    - Relevance score 0-100 for UH men's basketball
    - 2-sentence summary
    - Tags: recruiting, game-preview, game-recap, injury, transfer-portal, feature, presser, big-12, nil
    - Duplicate check against last 48 hours
    - Return as JSON
  - Store articles scoring 40+, skip duplicates
  - pg_cron: every 2 hours
- [ ] Build edge function `sync-press-conferences`:
  - Check UH Athletics YouTube for new basketball uploads
  - Match to games by date
  - Store in press_conferences table
- [ ] Build News Screen:
  - Card feed: headline, source badge, time ago, thumbnail
  - Filter row: All | Game Day | Recruiting | Features
  - Tap -> in-app browser (Expo WebBrowser)
  - Press conference section with video thumbnails
- [ ] Add latest news card to Home screen

---

### APP PHASE 5: Polish & Ship (Week 6-8)

#### The Steve Jobs Pass

- [ ] Audit every screen: spacing, alignment, color, typography consistency
- [ ] Add page transitions (Expo Router shared element transitions)
- [ ] Add skeleton loading states everywhere (shimmer, not spinners)
- [ ] Add pull-to-refresh on all data screens
- [ ] Add haptic feedback (tab switches, game card taps, score reveals)
- [ ] Add empty states with personality ("No games this week — rest up, Coogs")
- [ ] Handle offline: cached data + "Last updated X hours ago" badge
- [ ] Add About screen (credits, data sources, version)
- [ ] Test across iPhone sizes (SE, 15, 16 Pro Max)

#### Web Launch

- [ ] Final Vercel deploy
- [ ] Custom domain (e.g., coogs.app — check availability)
- [ ] PWA manifest: app name, icon, theme color, splash
- [ ] "Add to Home Screen" instructions for Safari
- [ ] Test the full flow: open link -> add to home -> use as app
- [ ] Share with full friend network + UH alumni groups

#### App Store Submission (Parallel Track)

- [ ] Apple Developer account ($99/year)
- [ ] App icon: scarlet background, clean basketball/cougar mark
- [ ] Splash screen: scarlet + white logo
- [ ] App Store copy:
  - Title: "Coogs — Houston Basketball"
  - Subtitle: "Scores, Stats, History & More"
  - Description: 4 paragraphs, feature-focused
  - Keywords: houston cougars, uh basketball, kelvin sampson, big 12, college basketball
- [ ] 6 screenshots (6.7" + 6.1"): Home, Schedule, Game Detail, History, News, Sampson Zone
- [ ] Privacy policy URL (free generator, host on GitHub Pages)
- [ ] EAS Build -> production iOS build
- [ ] TestFlight to 5 friends for native-specific QA (gestures, safe areas, notch)
- [ ] Fix native issues
- [ ] Submit to App Store

#### Ops Setup

- [ ] Sentry for crash monitoring (free tier)
- [ ] PostHog or Expo Analytics for screen views + DAU (free tier)
- [ ] Personal runbook:
  - Pipeline broke — how to diagnose and fix
  - Manually update a game score
  - Add a press conference link
  - Adjust news relevance threshold
- [ ] Monthly Supabase cost check
- [ ] Claude API cost estimate for news curation (~$5-15/month)

---

## POST-LAUNCH ROADMAP

### V1.1 — Quick Wins (Week 1-2 Post-Launch)

- [ ] Player Comparison tool (any two players, side-by-side)
- [ ] Big 12 standings widget on Home
- [ ] Head-to-head records vs. rivals (Memphis, Cincy, BYU, UCF, Kansas)
- [ ] "Revenge Game" badge on schedule
- [ ] Podcast feed curation

### V1.2 — Sampson Zone Expansion (Week 3-4 Post-Launch)

- [ ] Career milestones interactive timeline
- [ ] Win counter with milestone markers
- [ ] Signature moments gallery
- [ ] Mini-game: add daily challenge mode (same questions for everyone on game days)
- [ ] Mini-game: Supabase leaderboard
- [ ] Mini-game: opponent-specific dynamic questions — 3-5 questions per opponent mixed into the pool (e.g., "Coach, Kansas has won 14 straight at Allen Fieldhouse..." with Peak Kelvin/Mid/Anti-Kelvin answers). Stored in schedule.json or Supabase. Drives repeat play every game day since the question mix changes.

### V1.3 — Engagement (Month 2)

- [ ] Watch party locator (admin-curated by city)
- [ ] NIL tracker (admin-curated)
- [ ] Recruiting pipeline: commits, class ranking, signing day countdown
- [ ] iOS native widget: next game + last score
- [ ] Push notifications: game reminders, final score alerts

### V1.4 — Deep Stats (Month 3)

- [ ] Bart Torvik advanced stats integration
- [ ] Season trend charts (PPG, margin, SOS)
- [ ] Live game companion: real-time play-by-play, run tracker

---

## V2 VISION: Community & Social (Month 4+)

Design for this now. Build it later.

### Authentication

- [ ] Google Sign-In via Supabase Auth
- [ ] Apple Sign-In (required on iOS if any sign-in offered)
- [ ] `profiles` table: user_id, display_name, avatar_url, joined_at, is_admin
- [ ] All v1 content stays readable without sign-in

### Community Features

- [ ] Game thread comments — `game_comments` table (game_id, user_id, text, parent_id for replies). Real-time via Supabase Realtime.
- [ ] Fan polls — "Player of the Game" voting after each game. `polls` + `poll_votes` tables.
- [ ] Top 50/100 fan voting — community rankings alongside editorial picks
- [ ] Predictions — predict score/spread/player stats. Season leaderboard. "Oracle of Fertitta" award.
- [ ] Badges — earned by engagement (games attended, prediction streaks, app streaks)

### Architecture Prep (Already Done If This Checklist Was Followed)

- [ ] UUIDs on all tables
- [ ] created_at/updated_at everywhere
- [ ] Stable IDs on games and news_articles for future comment anchoring
- [ ] RLS ready for per-user write rules
- [ ] Plan content moderation BEFORE launching community

---

## RISKS & WATCH-OUTS

| Risk | Impact | Mitigation |
|---|---|---|
| UH trademark | App Store rejection / legal | Check licensing before using official logos. May need permission or generic imagery. |
| Kelvin likeness (game) | Potential issue | Illustrated version is safer than photo cutouts. Game is clearly parody/fan tribute. |
| ESPN API breakage | No live scores | Document endpoints in DATASOURCES.md. Manual score entry as fallback. |
| Player photos | NIL complexity | Silhouettes or skip current player photos in v1. |
| Scope creep | Never ship | Rule: if past Week 8 on the app with no deploy, cut to Home + Schedule + History + News and ship. |
| Maintenance | App goes stale | Budget 2-3 hrs/week during season: pipeline health, pressers, news QC. |
| Mini-game schedule updates | Title shows wrong game | Update schedule.json after each game or when postseason bracket drops. 30-second edit + push. Set a phone reminder. |
| Costs | Surprise bills | Supabase free: 500MB DB, 2GB storage, 500K edge functions. Claude API: ~$5-15/mo. The-Odds-API free: 500 req/mo. Monitor monthly. |
| Data accuracy | Embarrassment | Spot-check aggressively. Superfans WILL notice if the 1983 roster is wrong. |

---

## KEY MILESTONES

| When | What | Share? |
|---|---|---|
| Game Week 1 | Playable core — 90 seconds, scoring, dynamic opponent title, game over | "Play this before the Colorado game" |
| Game Week 2 | Visual polish — puppet, animations, effects | "Play again, it looks real now" |
| Game Week 3 | Special events + share card + custom domain | MINI-GAME LAUNCH |
| App Week 1 | App skeleton + design system + game integrated | Internal only |
| App Week 3 | Historical data loaded, History screens live | "Look up 1983" |
| App Week 5 | Schedule, scores, stats, odds all working | "Check the next game" |
| App Week 6 | News + press conferences live | "Full app feedback" |
| App Week 8 | Polish done, web live, App Store submitted | APP LAUNCH |
| App Week 10+ | V1.1 features rolling | Growing |

---

## STACK REFERENCE

| Layer | Tool | Purpose |
|---|---|---|
| Mini-game | React + Vite (or Expo Web) | Standalone web game, later embedded in app |
| Full app | Expo (React Native) | One codebase -> iOS + web |
| Backend | Supabase | Postgres, edge functions, auth (v2), real-time (v2) |
| AI (news) | Claude Sonnet 4.5 | Article scoring, summaries, dedup. Called from edge functions. |
| AI (coding) | Claude Code CLI + Opus | Pair programmer. Builds everything. |
| Research | Perplexity MCP | Claude Code searches live web while coding |
| Docs | Context7 MCP | Current Expo/RN API references |
| Odds data | The-Odds-API | Spreads, O/U for UH games |
| Scores | ESPN hidden endpoints | Schedule, results, box scores (unofficial) |
| Web hosting | Vercel | Free, instant deploys, custom domains |
| iOS distribution | App Store via EAS Build | Native app |
| Errors | Sentry | Crash reporting |
| Analytics | PostHog | Screen views, DAU, feature usage |
