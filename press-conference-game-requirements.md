# 🎙️ COACH SAMP'S PRESS CONFERENCE SURVIVAL
## Complete Product Requirements Document

---

## 1. PRODUCT OVERVIEW

### Concept
A 90-second mobile-first web game where you play as Kelvin Sampson at a postgame press conference. Reporters fire questions. You pick the most "Kelvin" response. Survive without getting fined out of existence.

### Target Audience
- University of Houston alumni and basketball fans
- Kelvin Sampson enthusiasts
- College basketball fans who know the memes (Toy Poodle League, Sasquatch State)
- Designed to be shared in group chats on game days

### Platform
- Mobile web app (responsive, works on all phones)
- Playable in-browser — no app store download
- Shareable via link
- Built with React (bolt.new compatible)

---

## 2. VISUAL STYLE: "THE CUTOUT PUPPET"

### Core Aesthetic
Real photographs of Kelvin Sampson, segmented into movable layers like a paper puppet / Monty Python–style cutout animation. The jaw, arms, and tie are separate pieces that move independently. Cartoon elements (sweat drops, action lines, fire effects) are layered ON TOP of the photo cutouts.

### Kelvin Puppet — Layer Breakdown

| Layer | Description | Movement |
|-------|-------------|----------|
| **Head (upper)** | Forehead, eyes, nose — static base | Slight tilt/nod on answer selection |
| **Jaw** | Lower face from upper lip down — separate cutout | Flaps up/down rapidly when "speaking," snaps shut on silence |
| **Torso** | Blue dress shirt, shoulders | Subtle breathing motion (scale pulse). Shirt color darkens progressively with sweat |
| **Left arm** | Separate piece, resting position | Raises to point at reporters on Peak Kelvin answers |
| **Right arm** | Separate piece, resting position | Slams podium on emphasis, grabs tie during Tie Rip |
| **Tie** | Red tie — its own physics-enabled object | Sways gently at rest. During Tie Rip, detaches and flies off screen with physics arc |
| **Sweat drops** | Cartoon drawn drops overlaid on photo | Multiply and increase in size as sweat meter rises |

### The Podium
- Simple graphic podium with a UH logo on the front
- Microphones clustered on top (2-3 small mic graphics)
- Podium shakes/vibrates on emphatic answers

### Reporter Characters
- Bottom 1/3 of screen
- Shown as a row of silhouette heads with speech bubbles
- When a question fires, one silhouette highlights and a speech bubble animates in
- Silhouettes should have slight variety (different hair, glasses, hat) for visual interest
- On Peak Kelvin answers, reporters visibly recoil (silhouettes lean back)
- On Anti-Kelvin answers, reporters lean forward eagerly (they got him)

### Background
- Blurred press conference room backdrop (generic or UH branded)
- Row of camera flashes that pop on key moments (streak bonuses, special events)
- UH / Fertitta Center branding elements subtly placed

### Color Palette

| Element | Color | Notes |
|---------|-------|-------|
| Kelvin's shirt | `#1E5AA8` → `#0D2D54` | Starts bright blue, darkens with sweat |
| Kelvin's tie | `#CC2233` | Houston red |
| Background | `#1A1A2E` | Dark press room |
| Podium | `#8B0000` with `#C8102E` UH logo | |
| Sweat drops | `#87CEEB` with white highlight | Cartoon style |
| Fire streak effect | `#FF6B35` → `#FFD700` | Gradient flames behind Kelvin on streaks |
| Fine/penalty text | `#FF0000` | Bold, stamp-style |
| Score text | `#FFFFFF` | Clean white on dark header |
| Peak Kelvin flash | `#FFD700` gold | Screen flash on perfect answers |

### Typography
- **Question text:** Bold sans-serif (Inter or similar), white on dark bubble
- **Answer buttons:** Rounded rectangles, large touch targets, bold text
- **Score/timer:** Monospace or sporty font for the HUD
- **End screen ratings:** Big, punchy display font
- **Kelvin quotes in results:** Italic serif for that "newspaper quote" feel

### Animation Principles
- Puppet movements should feel slightly janky/stiff on purpose — that's the comedy
- Jaw should flap at a fixed rhythm (like a ventriloquist dummy), not lip-sync
- Sweat drops use simple CSS keyframe animations (drip downward, fade)
- Screen shake on wrong answers (CSS transform)
- Camera flash = brief white overlay with opacity fade
- Tie physics can be simplified: CSS transition with rotation + translate on rip, no need for real physics engine

---

## 3. GAME SCREENS & FLOW

### Screen 1: TITLE SCREEN
- Kelvin puppet at podium, jaw slowly flapping, idle animation
- Title: **"COACH SAMP'S PRESS CONFERENCE SURVIVAL"**
- Subtitle: *"Don't get fined. Don't get soft. Don't call him Kevin."*
- **[START PRESS CONFERENCE]** button — large, red, Houston branded
- Small "How to Play" link that opens a brief overlay
- Background: camera flashes popping intermittently

### Screen 2: HOW TO PLAY (overlay/modal)
- 3 quick panels, swipeable:
  1. "Reporters will ask you questions. Pick the most KELVIN response."
  2. "🔥 Peak Kelvin = big points. 😐 Mid = meh. 💀 Anti-Kelvin = $25K fine."
  3. "Survive 90 seconds. Don't go broke. Don't sleep on Houston."
- **[GOT IT, LET'S GO]** button

### Screen 3: MAIN GAME SCREEN

```
┌─────────────────────────────────┐
│ ⏱️ 1:14    SCORE: 3,500   💰$75K │  ← HUD bar (timer, score, bank)
│ [🔥🔥🔥 STREAK x3 — 2x MULT]    │  ← Streak indicator (when active)
│                                   │
│     ┌─────────────────────┐       │
│     │   SWEAT: ████░░░░   │       │  ← Sweat meter (horizontal bar)
│     └─────────────────────┘       │
│                                   │
│        ┌──────────────┐           │
│        │              │           │
│        │   [KELVIN    │           │  ← Kelvin puppet (center)
│        │    PUPPET]   │           │
│        │              │           │
│        │  ┌──PODIUM──┐│           │
│        └──┴──────────┴┘           │
│                                   │
│  ┌────────────────────────────┐   │
│  │  "Coach, any thoughts on   │   │  ← Question bubble
│  │   the officiating tonight?" │   │
│  └────────────────────────────┘   │
│  👤  👤  👤  👤  👤               │  ← Reporter silhouettes
│                                   │
│ ┌──────────┐ ┌──────────┐        │
│ │ Answer A │ │ Answer B │        │  ← Answer buttons (2-3)
│ └──────────┘ └──────────┘        │
│        ┌──────────┐              │
│        │ Answer C │              │
│        └──────────┘              │
└─────────────────────────────────┘
```

#### HUD Elements (top bar, always visible)
- **Timer:** Countdown from 1:30, displayed as M:SS
- **Score:** Running point total
- **Bank Account:** Starts at $100,000, decreases with fines, displayed as 💰$XXK
- **Streak Counter:** Only visible when streak ≥ 2. Shows flame emojis and multiplier

#### Sweat Meter
- Horizontal progress bar below HUD
- Label: subtle icon or "🥵" emoji
- Fills from left to right
- Color gradient: blue → yellow → orange → red as it fills
- At key thresholds, Kelvin's shirt visually darkens (CSS filter or swap sprite)

#### Answer Buttons
- 3 buttons arranged in a 2-over-1 or vertical stack depending on text length
- Large touch targets (minimum 48px height, ideally 56-64px)
- Each button has subtle color coding ONLY AFTER selection:
  - Peak Kelvin: gold flash + 🔥
  - Mid: gray/neutral
  - Anti-Kelvin: red flash + 💀
- Buttons should NOT be color-coded before selection (no hints!)
- Answer order is randomized each question so Peak Kelvin isn't always in the same position

### Screen 4: SPECIAL EVENT OVERLAYS

These temporarily replace the standard Q&A flow:

#### 4a. PRONUNCIATION BLITZ
- Full-screen takeover for ~8 seconds
- Header: "⚡ PRONUNCIATION CHECK!"
- 3 word cards appear one at a time
- Each card shows a word with pronunciation (e.g., "Gon-ZAWG-ah")
- Player swipes LEFT (❌ wrong) or RIGHT (✅ correct)
- Quick success/fail animation per card
- Bonus awarded for getting all 3

#### 4b. TIE RIP MOMENT
- Screen border flashes red
- Text: "TERRIBLE CALL! RIP THE TIE!"
- A large swipe-down gesture zone appears over Kelvin's tie
- Player swipes down to rip — timing window of ~2 seconds
- Perfect timing: tie flies off with dramatic arc, big point bonus, crowd roars
- Too early/late: Kelvin fumbles with the tie awkwardly, small bonus
- Miss entirely: tie stays on, no bonus, slight embarrassment

#### 4c. MICK CRONIN VENMO
- A phone notification slides in from the top
- Styled like a real Venmo notification: "Mick Cronin paid you $1.00 — 'Heard your presser'"
- Two buttons: **[ACCEPT & LAUGH]** (+500 pts) or **[DECLINE]** (-200 pts, too proud)
- Quick 3-second event, doesn't pause the clock

#### 4d. INVENT A SCHOOL
- Question format: "Complete the quote: 'This isn't January against ____'"
- 4 fictional school name options appear as buttons
- All give points, but the "best" one gives the most
- Examples: "Sasquatch State" / "Chihuahua Tech" / "Mothman A&M" / "Platypus Poly"
- Winning choice triggers Kelvin puppet doing a smug head-tilt animation

### Screen 5: GAME OVER — FINED OUT (fail state)
- Triggered when bank hits $0
- Kelvin puppet slumps at podium
- Big red stamp animation: **"FINED OUT — PRESS CONFERENCE OVER"**
- Sad trombone sound (optional)
- Shows final score, rating (low tier), and share button
- **[TRY AGAIN]** button

### Screen 6: GAME OVER — TIME'S UP (normal end)
- Timer hits 0:00
- Kelvin puppet stands tall (or slumped, depending on score)
- Camera flashes pop like crazy
- Score tallies up with slot-machine animation
- Rating title revealed with dramatic flourish

### Screen 7: RESULTS & SHARE CARD

```
┌─────────────────────────────────┐
│    🎙️ PRESS CONFERENCE RESULTS   │
│                                   │
│    ┌───────────────────────┐     │
│    │                       │     │
│    │  [Kelvin puppet at    │     │  ← Puppet shown in final state
│    │   final sweat level,  │     │    (sweat level, tie on/off)
│    │   tie on or off]      │     │
│    │                       │     │
│    └───────────────────────┘     │
│                                   │
│    RATING: "MUD IN THE BLOOD"    │  ← Big dramatic title
│    SCORE: 9,450                  │
│                                   │
│    ────── STATS ──────           │
│    Peak Kelvin Answers: 8/12     │
│    Fines Paid: $25,000           │
│    Best Streak: 5x 🔥            │
│    Schools Invented: 2           │
│    Reporters Scared: 4           │
│    Ties Ripped: 1                │
│                                   │
│    BEST QUOTE:                   │
│    "What part of $25,000 are     │
│     you willing to pay?"         │
│                                   │
│    ┌──────────┐ ┌──────────┐    │
│    │  SHARE   │ │ PLAY     │    │
│    │  📱      │ │ AGAIN 🔄 │    │
│    └──────────┘ └──────────┘    │
└─────────────────────────────────┘
```

#### Share Card (generated image for social/texts)
- Compact card format optimized for iMessage / group chat previews
- Shows: Kelvin puppet (at final state), rating title, score, one stat line, one quote
- "Don't sleep on [PLAYER NAME]" as a footer (or generic "Whose House? Coogs' House!")
- Card should be visually distinctive — people should recognize it in a group chat instantly
- Consider: UH red border, halftone dot pattern overlay for that newspaper/press feel
- Tech: use html2canvas or dom-to-image to generate a PNG from a styled div

---

## 4. GAME MECHANICS — DETAILED SPECS

### 4.1 Question System

#### Question Data Structure
```json
{
  "id": "q_officiating_01",
  "category": "officiating",
  "question": "Coach, any thoughts on the officiating tonight?",
  "reporterType": "standard",
  "answers": [
    {
      "text": "What part of $25,000 are you willing to pay? Don't ask me silly questions.",
      "type": "peak_kelvin",
      "points": 500,
      "animation": "podium_slam",
      "kelvinQuote": true
    },
    {
      "text": "We just need to play through the adversity.",
      "type": "mid",
      "points": 100,
      "animation": "neutral_nod",
      "kelvinQuote": false
    },
    {
      "text": "The refs did a wonderful job tonight, honestly.",
      "type": "anti_kelvin",
      "points": -25000,
      "animation": "crowd_boo",
      "kelvinQuote": false
    }
  ],
  "specialTrigger": null,
  "difficulty": 1
}
```

#### Question Pool Requirements
- **Minimum 40 questions for MVP** (ensures no repeats in a 90-second game)
- Questions should be categorized:
  - Officiating (5-6 questions)
  - Respect / media coverage (5-6 questions)
  - Team identity / toughness (5-6 questions)
  - NIL / money (3-4 questions)
  - Pronunciation traps (3-4 questions)
  - Opponents / conference (5-6 questions)
  - Personal / family (3-4 questions)
  - Curveballs / weird questions (5-6 questions)
- No two questions from the same category should appear back-to-back
- Questions get harder as time progresses (earlier = more obvious Peak Kelvin, later = trickier choices)

#### Question Delivery Timing
| Game Phase | Time Remaining | Seconds Per Question | Questions in Phase |
|------------|---------------|---------------------|--------------------|
| Warmup | 90–70s | 6 seconds | ~3-4 |
| Rolling | 70–40s | 5 seconds | ~6 |
| Heated | 40–15s | 4 seconds | ~6 |
| Rapid Fire | 15–0s | 3 seconds | ~5 |

- If timer expires on a question: auto-selects "No comment" (worst outcome: -300 points, no fine but ratings tank)
- Special events can trigger between any questions (see section 4.3)

### 4.2 Scoring System

#### Points per Answer Type
| Answer Type | Base Points | With 2x Multiplier | With 3x Multiplier |
|-------------|-------------|--------------------|--------------------|
| Peak Kelvin | +500 | +1,000 | +1,500 |
| Mid | +100 | +200 | +300 |
| Anti-Kelvin | 0 pts + $25K fine | 0 pts + $25K fine | 0 pts + $25K fine |
| No Comment (timeout) | -300 | -300 | -300 |

#### Streak System
- Consecutive Peak Kelvin answers build the streak
- Mid answers reset the streak
- Anti-Kelvin answers reset the streak AND break any active multiplier

| Streak | Multiplier | Visual Effect |
|--------|-----------|---------------|
| 0-1 | 1x | None |
| 2 | 1x | Small "🔥" appears |
| 3 | 2x | "🔥🔥🔥 2X MULTIPLIER" banner, flames appear behind Kelvin |
| 5 | 3x | "WHOSE HOUSE? COOGS' HOUSE!" chant, screen borders glow red, camera flashes go wild |
| 7+ | 3x (capped) | Full meltdown mode — Kelvin is on fire (literally, cartoon flames), reporters cowering, podium shaking |

#### Bank Account
- Starts at $100,000
- Each Anti-Kelvin answer deducts $25,000
- At $0 = GAME OVER (fined out)
- This means you can only make 4 Anti-Kelvin choices before losing
- Some special events can add small amounts (+$1 from Venmo, +$10K from pronunciation blitz)
- Bank never goes above $100K (no hoarding)

### 4.3 Special Events

Special events trigger randomly between questions. Rules:
- First event cannot trigger before the 75-second mark (let player settle in)
- Minimum 15 seconds between events
- Maximum 4 events per game
- Each event type can only appear once per game
- Events DO NOT pause the main game timer (adds pressure)

| Event | Duration | Trigger Window | Frequency |
|-------|----------|---------------|-----------|
| Pronunciation Blitz | ~8 sec | After 15s, before 70s | Once per game |
| Tie Rip Moment | ~4 sec | After 30s | Once per game |
| Mick Cronin Venmo | ~3 sec | After 20s | Once per game |
| Invent a School | ~6 sec | After 25s | Once per game |

### 4.4 Sweat Meter

- Range: 0% to 100%
- Starting value: 15%
- Passive increase: +0.5% per second (natural game tension)
- Peak Kelvin answer: +2% (he's fired up but controlled)
- Mid answer: +3% (boring answers make him uncomfortable)
- Anti-Kelvin answer: +10% (stress spike)
- Tie Rip event: -15% (relief!)
- Streak of 5+: sweat increases pause (he's in the zone)

#### Visual thresholds for shirt darkening:
| Sweat % | Shirt State | CSS Approach |
|---------|-------------|-------------|
| 0-25% | Fresh blue | Base image, no filter |
| 26-50% | Slightly damp | `brightness(0.9)` + small sweat drops |
| 51-75% | Visibly soaked | `brightness(0.75)` + medium drops + collar stain overlay |
| 76-100% | Absolutely drenched | `brightness(0.6)` + heavy drops + full chest stain overlay + drip animations |

### 4.5 Kelvin Puppet Animations

Each answer type triggers a specific puppet animation. These are CSS-driven transforms on the layered image pieces:

| Event | Head | Jaw | Left Arm | Right Arm | Tie | Podium |
|-------|------|-----|----------|-----------|-----|--------|
| **Question appears** | Slight tilt toward reporter | Closed | Rest | Rest | Gentle sway | Still |
| **Peak Kelvin selected** | Nods firmly | Rapid flap (3-4 cycles) | Points at reporter | Slams podium | Swings with emphasis | Shakes briefly |
| **Mid selected** | Slight nod | Slow flap (2 cycles) | Rest | Rest | Barely moves | Still |
| **Anti-Kelvin selected** | Tilts down (shame) | Drops open (shock) | Rest | Covers face | Limp | Still |
| **Streak 5+ active** | Tilted back (confidence) | Rapid flap | Both raised | Both raised | Swinging wildly | Continuous shake |
| **Tie Rip** | Looks down | Clenched | Holds shirt | Grabs tie, yanks | Detaches, flies off screen | Big shake |
| **Timer almost up** | Slight panic tilt | Quick nervous flaps | Fidgeting | Fidgeting | Quick sway | Slight vibration |
| **Fined Out** | Drops forward | Hangs open | Limp at sides | Limp at sides | Limp (if still on) | Still |

### 4.6 End Game Ratings

| Score Range | Rating Title | Kelvin Puppet State | Flavor Text |
|-------------|-------------|--------------------| ------------|
| 0 (fined out) | **"Escorted Out by Security"** | Slumped, tie on, max sweat | "You owe the Big 12 more than your house is worth." |
| 1–2,000 | **"Sasquatch State Assistant Coach"** | Awkward, tie crooked | "You have sugar in your veins." |
| 2,001–5,000 | **"Sugar in the Veins"** | Neutral, tie loosened | "Kelvin would not recruit you." |
| 5,001–8,000 | **"Big 12 Respectable"** | Confident, moderate sweat | "You survived. Shout out to the Big 12 brethren." |
| 8,001–12,000 | **"Mud in the Blood"** | Strong pose, tie off, moderate sweat | "Now we're talking. Don't sleep on this one." |
| 12,001–15,000 | **"Don't Sleep on This One"** | Power pose, soaked, no tie | "You ARE the press conference." |
| 15,001+ | **"Peak Kelvin 🐐"** | Full meltdown pose, drenched, no tie, flames | "You out-Kelvined Kelvin. Reporters in shambles." |

---

## 5. AUDIO (optional but impactful)

Audio can be toggled on/off. Game should work perfectly silent (most mobile users will have sound off).

| Event | Sound | Notes |
|-------|-------|-------|
| Game start | Press conference room ambience (murmur + camera clicks) | Loops for duration |
| Question appears | Quick "reporter" mumble or mic tap | Short, subtle |
| Peak Kelvin answer | Crowd "OHHH!" reaction + camera flash burst | Satisfying, punchy |
| Mid answer | Polite golf clap | Intentionally underwhelming |
| Anti-Kelvin answer | Record scratch + crowd boo | Comedy effect |
| Streak 3x | Intensifying crowd buzz | Layers over ambient |
| Streak 5x | "Whose House? Coogs' House!" chant clip | The payoff moment |
| Tie Rip | Fabric rip + crowd eruption | Big moment |
| Fine | Cash register "cha-ching" (ironic) | Quick |
| Fined Out | Sad trombone | Classic |
| Game End (good score) | Triumphant horn + cheering | Celebration |
| Timer last 10 seconds | Heartbeat or ticking intensifies | Tension builder |

---

## 6. TECHNICAL REQUIREMENTS

### Stack
- **Framework:** React (single-page app)
- **Build tool:** Vite (bolt.new default)
- **Styling:** Tailwind CSS + custom CSS animations
- **State management:** React useState/useReducer (no external state library needed)
- **Image assets:** PNG cutouts with transparent backgrounds
- **Share card generation:** html2canvas or dom-to-image
- **Hosting:** Vercel, Netlify, or similar (static site)
- **Backend:** None for MVP. Optional Supabase for V2 leaderboard.

### Performance Requirements
- Must load in <3 seconds on 4G mobile
- Smooth 60fps animations (CSS transforms, not JS-driven layout changes)
- Total bundle size <2MB (excluding image assets)
- Image assets should be optimized WebP, lazy-loaded where possible
- Touch response <100ms (critical for a timed game)

### Mobile-First Design
- Primary target: iPhone 12-16 screen sizes (390px width)
- Must work on Android (Chrome) as well
- Portrait orientation only (lock if possible)
- Touch targets minimum 48x48px (Apple HIG)
- No hover-dependent interactions
- Safe area handling for notch/dynamic island phones
- Prevent pull-to-refresh during gameplay
- Prevent accidental back-swipe during gameplay

### Asset Requirements

#### Kelvin Puppet Parts (PNG, transparent background)
1. `kelvin-head-upper.png` — forehead through nose (~400x300px)
2. `kelvin-jaw.png` — mouth/chin area (~250x150px)
3. `kelvin-torso.png` — shoulders and chest in blue shirt (~500x400px)
4. `kelvin-torso-sweat-1.png` — same but with light sweat stains
5. `kelvin-torso-sweat-2.png` — medium sweat
6. `kelvin-torso-sweat-3.png` — soaked
7. `kelvin-arm-left.png` — left arm, resting position (~200x300px)
8. `kelvin-arm-left-point.png` — left arm, pointing forward
9. `kelvin-arm-right.png` — right arm, resting position (~200x300px)
10. `kelvin-arm-right-slam.png` — right arm, slamming podium
11. `kelvin-tie.png` — red tie, separate piece (~80x200px)
12. `podium.png` — press conference podium with UH logo (~600x250px)
13. `reporter-silhouette-1.png` through `reporter-silhouette-5.png` — varied shapes
14. `sweat-drop.png` — single cartoon sweat drop (~30x40px)
15. `camera-flash.png` — white starburst shape

#### UI Assets
16. `uh-logo.png` — University of Houston logo for branding
17. `fire-overlay.png` — flame effect for streak mode
18. `fine-stamp.png` — red "FINED $25,000" stamp graphic
19. `venmo-notification.png` — styled Venmo-like notification card
20. `share-card-template.png` — background for the share card

#### Notes on Asset Creation
- The Kelvin cutouts can be created from 1-2 high-res press conference photos
- Use Photoshop/Figma to separate layers with clean edges
- Slight drop shadows on each piece enhance the "paper puppet" look
- Consider adding a subtle paper/cardboard texture overlay to each piece
- The "janky cutout" aesthetic means perfect edges are NOT needed — slightly rough cuts are better

### Data Structure: Game State

```typescript
interface GameState {
  phase: 'title' | 'playing' | 'special_event' | 'game_over' | 'results';
  timeRemaining: number; // seconds, starts at 90
  score: number;
  bankAccount: number; // starts at 100000
  sweatLevel: number; // 0-100
  streak: number; // consecutive peak kelvin answers
  multiplier: number; // 1, 2, or 3
  tieStatus: 'on' | 'loosened' | 'off';
  questionsAnswered: Question[];
  currentQuestion: Question | null;
  specialEventsUsed: string[];
  stats: {
    peakKelvinCount: number;
    midCount: number;
    antiKelvinCount: number;
    timeoutCount: number;
    bestStreak: number;
    schoolsInvented: number;
    tiesRipped: number;
    pronunciationScore: number;
    finesPaid: number;
    reportersScared: number; // count of peak kelvin answers (reporters recoil)
  };
}

interface Question {
  id: string;
  category: string;
  question: string;
  answers: Answer[];
  specialTrigger: string | null;
  difficulty: number; // 1-3
}

interface Answer {
  text: string;
  type: 'peak_kelvin' | 'mid' | 'anti_kelvin';
  points: number;
  animation: string;
  kelvinQuote: boolean; // is this a real Kelvin quote?
}
```

---

## 7. QUESTION BANK — FULL MVP SET (40 Questions)

### Category: Officiating (6)
1. "Coach, any thoughts on the officiating tonight?"
   - 🔥 "What part of $25,000 are you willing to pay? Don't ask me silly questions."
   - 😐 "The refs made some calls, we dealt with it."
   - 💀 "The officials were very fair tonight. No complaints."

2. "You seemed upset about that foul call in the second half?"
   - 🔥 "I have no thoughts. Because if I tell the truth, it costs me $25,000."
   - 😐 "We need to play through those moments."
   - 💀 "Looking back, it was probably the right call."

3. "Do you think there was a missed goaltend on that last play?"
   - 🔥 "I'll tell you what I think when you write the check for my fine. Next question."
   - 😐 "It's hard to tell in real time. We'll look at the film."
   - 💀 "No, I think the refs got it right in a tough spot."

4. "Will you be reaching out to the conference office about those calls?"
   - 🔥 "I've got better things to do. Like winning basketball games."
   - 😐 "We'll handle that internally."
   - 💀 "No, the conference office does a great job managing the officials."

5. "Coach, you got pretty animated with the officials in the first half—"
   - 🔥 "Animated? I was just having a conversation. A LOUD conversation."
   - 😐 "I'm a passionate coach. It happens."
   - 💀 "Yeah, I need to do better at controlling my emotions out there."

6. "You charged across the entire court to argue that call. What happened?"
   - 🔥 "I needed the exercise. My Fitbit was telling me to get my steps in."
   - 😐 "I disagreed with the call and let them know."
   - 💀 "That was embarrassing. I should have stayed on my side."

### Category: Respect / Media Coverage (6)
7. "A lot of the national media picked your opponent to win. Reaction?"
   - 🔥 "Don't sleep on Houston. DON'T. SLEEP. ON. HOUSTON."
   - 😐 "We don't pay attention to predictions."
   - 💀 "I understand why people picked them. They're a great program."

8. "The pregame show spent 20 minutes on your opponent and 2 on Houston—"
   - 🔥 "That's fine. We weren't 34-4 playing in the Toy Poodle League."
   - 😐 "We let our play speak for itself."
   - 💀 "They probably deserve the attention more than us right now."

9. "Do you feel Houston gets overlooked nationally?"
   - 🔥 "Little old University of Houston, jumping up, swinging with the big boys. Keep sleeping."
   - 😐 "We're focused on what we can control."
   - 💀 "We're still building our brand. The blue bloods have earned their coverage."

10. "How does it feel to silence the doubters?"
    - 🔥 "We work in silence from June to November. The doubters are just loud in January."
    - 😐 "It feels good to validate what we've been doing."
    - 💀 "I don't really think about doubters. Everyone's entitled to their opinion."

11. "Your players were dancing in the locker room. Was that planned?"
    - 🔥 "We don't plan celebrations. We plan how to destroy people's offensive sets."
    - 😐 "They earned the right to enjoy the moment."
    - 💀 "We need to be more humble after wins. I'll talk to them."

12. "ESPN's analytics give you a 15% chance in the next round—"
    - 🔥 "Analytics? My analytic is: we've got mud in our blood and we don't quit."
    - 😐 "Numbers are just numbers until you play the game."
    - 💀 "Those models are usually pretty accurate. We're the underdog."

### Category: Team Identity / Toughness (6)
13. "How would you describe this team's identity?"
    - 🔥 "Kids with sugar in their veins don't do really good here."
    - 😐 "We're a tough, defensive-minded team."
    - 💀 "We're a finesse team that likes to push the pace and shoot threes."

14. "Your team gave up only 42 points tonight. How?"
    - 🔥 "You're a good defensive team because you CARE. Not because of coaching."
    - 😐 "Defense has been our emphasis all season."
    - 💀 "Honestly, I think they just had an off shooting night."

15. "Some people say your style of play is 'ugly basketball'—"
    - 🔥 "Ugly? 35 wins is the prettiest thing I've ever seen."
    - 😐 "We play winning basketball. That's all that matters."
    - 💀 "I can see why people think that. We're not the most exciting team to watch."

16. "How do you build that toughness in your guys?"
    - 🔥 "First Monday in June. 18 hundred-yard sprints on the baseball field. That's where it starts."
    - 😐 "It's a daily process in practice."
    - 💀 "Some players just come in with it naturally. We're lucky."

17. "Your team dove on the floor six times for loose balls tonight—"
    - 🔥 "Only six? That's a slow night for us."
    - 😐 "Effort plays are the foundation of what we do."
    - 💀 "We might need to be more careful with that. Don't want anyone getting hurt."

18. "You've called this team 'junkyard dogs.' What do you mean?"
    - 🔥 "It means we'll fight you for every single possession and you're gonna feel it tomorrow."
    - 😐 "It means we play hard and compete."
    - 💀 "That might have been a little strong. We're just a competitive group."

### Category: NIL / Money (4)
19. "How is Houston's NIL situation compared to other Big 12 schools?"
    - 🔥 "We're very poor. Somebody Venmo me a dollar."
    - 😐 "We're working on it every day. The Big 12 transition takes time."
    - 💀 "We can't compete with the top programs financially. It's really hard."

20. "Do you worry about losing players to the transfer portal over NIL?"
    - 🔥 "If a kid's here for the money, he's got sugar in his veins. That ain't our guy."
    - 😐 "We trust the culture we've built."
    - 💀 "Yes, it keeps me up at night. We need way more NIL money."

21. "A reporter just Venmo'd you $100 after your 'poor' comments—"
    - 🔥 "Mick Cronin already sent me a dollar. Y'all are late."
    - 😐 "That's funny. But we really are working on it."
    - 💀 "That's very kind. We'll take any help we can get."

22. "How do you sell Houston to a five-star recruit over a blueblood?"
    - 🔥 "I tell them: You wanna be comfortable? Go somewhere else. You wanna be GREAT? Come here."
    - 😐 "We sell the development and the culture."
    - 💀 "It's tough. Those schools have advantages we just can't match."

### Category: Pronunciation Traps (4)
23. "Coach, what can you tell us about your upcoming game against Gonzaga?" *(pronounced Gon-ZAWG-ah)*
    - 🔥 "Gon-ZAA-ga. It always burns me up when people say that. It's like calling me Kevin."
    - 😐 "It's pronounced Gonzaga, but they're a great team."
    - 💀 "Gon-ZAWG-ah should be a great matchup for us."

24. "Kevin, can you talk about—"
    - 🔥 *[Death stare]* "My name is KELVIN. My mother didn't raise a Kevin."
    - 😐 "It's Kelvin. Go ahead with your question."
    - 💀 "Kevin's fine. What's your question?"

25. "You coached at Washington State, up in Spokane—" *(pronounced Spo-CANE)*
    - 🔥 "Spo-CAN. Not Spo-CANE. You can't say Snohomish or Chelan either, can you?"
    - 😐 "It's Spokane. Great city. Go ahead."
    - 💀 "Spo-CANE was a wonderful place to start my career."

26. "What can you tell us about the Loo-mee tribe's support for your program?"
    - 🔥 "LUM-bee. The Lumbee. My father didn't chase the Klan out of North Carolina so y'all could mispronounce us."
    - 😐 "It's Lumbee. Their support means the world to me."
    - 💀 "The Loo-mee community has been wonderful."

### Category: Opponents / Conference (6)
27. "Your opponent's coach said they weren't worried about Houston's defense—"
    - 🔥 "Good. We love when teams aren't worried. Worry happens in the second half."
    - 😐 "They can say what they want. We'll be ready."
    - 💀 "They're a talented team. They probably have good reason to be confident."

28. "What conference produces the best basketball?"
    - 🔥 "Shout out to my Big 12 brethren. We weren't 19-1 playing against Sasquatch State."
    - 😐 "The Big 12 is an elite conference."
    - 💀 "The SEC and Big Ten are probably at the top right now."

29. "Duke gets all the attention going into this matchup—"
    - 🔥 "Duke this, Duke that. Duke's great. Jon Scheyer is awesome. But DON'T SLEEP ON HOUSTON."
    - 😐 "They're a great program. We respect them."
    - 💀 "Duke is the standard. We're just trying to compete at their level."

30. "How important is it to represent the Big 12 well in the tournament?"
    - 🔥 "Playing in the Big 12 helped us. I didn't see anybody from the Toy Poodle League in the Final Four."
    - 😐 "Conference pride is real. We want to do well for our league."
    - 💀 "It's more about Houston than the conference, honestly."

31. "This is a championship game, not a regular season game. Does that change things?"
    - 🔥 "This isn't the middle of January against Sasquatch State. This is the national championship. There's gonna be nerves."
    - 😐 "The stage is bigger, but we prepare the same way."
    - 💀 "I'm trying not to think about it too much. We just need to relax and have fun."

32. "What do you know about tonight's opponent?"
    - 🔥 "I know they're about to meet a team with mud in its blood and a chip on its shoulder."
    - 😐 "We've scouted them thoroughly. They're very well-coached."
    - 💀 "Honestly, I wish we had more time to prepare. They're really talented."

### Category: Personal / Family (4)
33. "Your son Kellen was fired up on the sideline tonight—"
    - 🔥 "My personality is more like my mother's. She was fiery. Kellen got a double dose."
    - 😐 "He's passionate. That's what I want from my staff."
    - 💀 "I've told him he needs to tone it down."

34. "What would your father think of this team?"
    - 🔥 "Mr. Ned would say these boys have mud in their blood. Highest compliment."
    - 😐 "He'd be proud. He always believed in hard work."
    - 💀 "I try not to bring my personal life into press conferences."

35. "At 69, do you ever think about retirement?"
    - 🔥 "Retire? I just got to Monday night. I've been waiting 40 years for this."
    - 😐 "I'll coach as long as I have the energy."
    - 💀 "Yeah, my wife keeps bringing it up. Maybe after this season."

36. "What's the secret to your longevity in coaching?"
    - 🔥 "A blue shirt, a red tie, and absolutely no interest in making people comfortable."
    - 😐 "Loving what you do and surrounding yourself with good people."
    - 💀 "Honestly, I'm just lucky. A lot of great coaches don't get these opportunities."

### Category: Curveballs / Wild Cards (4)
37. "Coach, you're sweating quite a bit. Everything okay?"
    - 🔥 "I coach every game like I'm running the 18 sprints with my guys. This is what it looks like."
    - 😐 "It's hot under these lights."
    - 💀 "I should probably drink more water and calm down a bit."

38. "Some fans are already making memes about your press conferences—"
    - 🔥 "Good. Put that on a t-shirt. 'Don't Sleep on Houston.' That's merch."
    - 😐 "The internet is the internet. We focus on basketball."
    - 💀 "I probably need to be more careful with what I say."

39. "If Houston was an animal, what would it be?"
    - 🔥 "A junkyard dog with mud on its paws and a bone it ain't giving up."
    - 😐 "A cougar, obviously."
    - 💀 "Maybe a dolphin? Smart, works well in groups."

40. "Last question, Coach. Any final message?"
    - 🔥 "You're not a loser in anything until you quit. Don't quit. And don't sleep on Houston."
    - 😐 "Go Coogs."
    - 💀 "I just hope people start giving us more respect. Please?"

---

## 8. SPECIAL EVENT CONTENT

### Pronunciation Blitz Words
| Word Shown | Pronunciation Shown | Correct? |
|------------|-------------------|----------|
| "Gon-ZAWG-ah" | Wrong | ❌ Swipe Left |
| "Gon-ZAA-ga" | Correct | ✅ Swipe Right |
| "KEL-vin" | Correct | ✅ Swipe Right |
| "KEV-in" | Wrong | ❌ Swipe Left |
| "Spo-CANE" | Wrong | ❌ Swipe Left |
| "Spo-CAN" | Correct | ✅ Swipe Right |
| "LUM-bee" | Correct | ✅ Swipe Right |
| "LOO-mee" | Wrong | ❌ Swipe Left |
| "SNOH-hoh-mish" | Correct | ✅ Swipe Right |
| "Sheh-LAN" | Correct | ✅ Swipe Right |

*(Game randomly selects 3 from this pool, always mixing correct and incorrect)*

### Invent a School Options (4 sets, one randomly chosen)

**Set 1:** "This isn't January against ____"
- Sasquatch State (+500 — the OG)
- Chihuahua Tech (+400)
- Mothman A&M (+350)
- Narwhal University (+300)

**Set 2:** "We weren't 34-4 in the ____ Conference"
- Toy Poodle League (+500 — the OG)
- Hamster Wheel Conference (+400)
- Goldfish Bowl League (+350)
- Participation Trophy Conference (+300)

**Set 3:** "I've coached everywhere. Even ____"
- Cryptid Community College (+500)
- Bermuda Triangle Tech (+400)
- Area 51 State (+350)
- Atlantis A&M (+300)

**Set 4:** "You want soft? Go play for ____"
- Marshmallow University (+500)
- Pillow Fight State (+400)
- Bubble Wrap Tech (+350)
- Cotton Candy College (+300)

---

## 9. V2 FEATURES (Post-MVP Roadmap)

These are NOT in the MVP but are designed to be easy additions:

### 9.1 Leaderboard (Supabase)
- Global leaderboard showing top scores
- Friend group leaderboard (share a group code)
- Daily/weekly resets to keep competition fresh
- Display player name + rating title + score

### 9.2 Daily Challenge Mode
- One new curated set of 12 questions each game day (when UH plays)
- Questions themed around that day's opponent
- Everyone gets the same set — compete for best score
- Push notification or social reminder: "Today's Press Conference is LIVE"

### 9.3 Expanded Question Packs
- "March Madness Pack" — tournament-specific questions
- "Big 12 Gauntlet" — questions about each conference opponent
- "Throwback Pack" — Oklahoma/Indiana era Kelvin quotes
- Community-submitted questions (moderated)

### 9.4 Unlockable Kelvin Outfits
- Default: Blue shirt, red tie
- Unlockable: Championship suit, Oklahoma-era outfit, casual polo, the soaked shirt as a badge of honor

### 9.5 Multiplayer: Press Conference Battle
- Two players answer the same questions simultaneously
- Split screen or async (both play, compare scores)
- Perfect for your alumni group chat rivalry

### 9.6 Sound Board
- After the game, unlock a Kelvin soundboard with your favorite quotes
- Tap to play audio clips
- Share individual audio clips to group chats

---

## 10. SUCCESS METRICS

How we'll know this game is working:

| Metric | Target | Why It Matters |
|--------|--------|---------------|
| Games played per user | ≥3 per session | Replayability is working |
| Share card generation rate | ≥40% of completed games | The viral loop is active |
| Average session time | 3-5 minutes (2-3 plays) | Sticky but not addictive |
| Load time | <3s on 4G | Mobile users bounce fast |
| Completion rate | ≥80% of started games | Game isn't too hard or frustrating |
| "Peak Kelvin" achievement rate | ~10-15% of plays | Hard enough to be meaningful |
| "Fined Out" rate | ~15-20% of plays | Creates stakes without being punishing |

---

## 11. IMPLEMENTATION PRIORITY

### Phase 1: Playable Core (MVP)
1. Title screen with start button
2. Main game loop: timer, questions, 3 answer buttons, scoring
3. Static Kelvin image (no puppet animation yet) at podium
4. Sweat meter (visual bar only, no shirt changes yet)
5. Bank account with $25K fines
6. Streak counter with multiplier
7. End screen with rating and score
8. 40 questions loaded from JSON
9. Basic share card (text-based, styled div)

### Phase 2: Visual Polish
10. Kelvin cutout puppet with jaw animation
11. Arm movements on different answer types
12. Shirt darkening at sweat thresholds
13. Reporter silhouettes with reactions
14. Screen shake, camera flashes, fire effects
15. Tie as separate animated element

### Phase 3: Special Events
16. Tie Rip mini-game
17. Pronunciation Blitz
18. Mick Cronin Venmo
19. Invent a School

### Phase 4: Share & Sound
20. Canvas-generated share card image
21. Sound effects (all optional/togglable)
22. Social share buttons (copy link, share to Twitter/iMessage)

### Phase 5: V2 Features
23. Supabase leaderboard
24. Daily challenge mode
25. Additional question packs
