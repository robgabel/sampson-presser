# Quote Expansion Plan — Coach Samp's Pregame Presser

## Context

We researched 50 real Kelvin Sampson quotes from GoCoogs, PaperCity, Chron, SI, On3, Yahoo Sports, and other sources. These are verified quotes from press conferences, interviews, and player testimonials from 2021-2026. They're saved in `/sampson_quotes_50.json` at the project root.

Your job is to use these quotes to:
1. **Write 20 NEW questions** for `src/data/questions.json` (bringing the total from 40 to 60)
2. **Expand the game-over quote pool** in `src/data/quotes.ts` (from 15 to 30)
3. **Add 2 new question categories** and beef up thin existing ones

Read `sampson_quotes_50.json`, `src/data/questions.json`, `src/data/quotes.ts`, and `src/types.ts` before making any changes.

---

## Part 1: Write 20 New Questions

### Format (must match exactly)

```json
{
  "id": "q_category_##",
  "category": "string",
  "question": "Reporter question text",
  "difficulty": 1-3,
  "answers": [
    {
      "text": "Peak Kelvin answer",
      "type": "peak_kelvin",
      "points": 500,
      "animation": "nod|point|slam",
      "kelvinQuote": true
    },
    {
      "text": "Mid answer",
      "type": "mid",
      "points": 100,
      "animation": "shrug|neutral",
      "kelvinQuote": false
    },
    {
      "text": "Anti-Kelvin answer",
      "type": "anti_kelvin",
      "points": 0,
      "animation": "angry|sweat",
      "kelvinQuote": false
    }
  ]
}
```

### New Questions to Write (organized by category)

#### NEW CATEGORY: "kelvinisms" (6 questions)

These use his actual one-liners as Peak Kelvin answers. The reporter asks a question that sets up the real quote.

**Q1 — Soft Players**
- Reporter: "Coach, your bench players looked hesitant out there tonight. How do you get them to play with more edge?"
- Peak Kelvin: "They're soft as puppy poop in the rain. We'll fix that by Monday." (actual quote, id:1 in quotes file)
- Mid: "We'll work on their confidence in practice."
- Anti-Kelvin: "I think they just need a hug and some encouragement."

**Q2 — Mud in the Blood**
- Reporter: "Coach, how do you evaluate whether a recruit fits your program's culture?"
- Peak Kelvin: "Can we get enough mud in his blood? Kids with sugar in their veins don't do really good here." (actual quote, id:13)
- Mid: "We look at their work ethic and character."
- Anti-Kelvin: "We check their social media presence and brand potential."

**Q3 — River and Rock**
- Reporter: "How do you handle players who push back on your coaching style?"
- Peak Kelvin: "It's the battle between the river and the rock. The river always wins. I'll let you figure out who the river is." (actual quote, id:17)
- Mid: "We have honest conversations about expectations."
- Anti-Kelvin: "I let the players set the culture. It's their team."

**Q4 — Hair on Fire**
- Reporter: "What's your message to the team before a big road game?"
- Peak Kelvin: "Play like the hair on certain body parts is on fire." (actual quote via Emanuel Sharp, id:15)
- Mid: "Execute the game plan and stay disciplined."
- Anti-Kelvin: "Just relax and have fun out there. No pressure."

**Q5 — Fart in a Skillet**
- Reporter: "Coach, the offense seemed scattered in the first half. What adjustments did you make?"
- Peak Kelvin: "I told them they looked like a fart in a skillet — all over the place. We settled down." (actual quote via Kellen, id:5)
- Mid: "We simplified our sets and got better spacing."
- Anti-Kelvin: "I let the players figure it out themselves."

**Q6 — Quannas White Rebounds**
- Reporter: "Coach, your forwards combined for just 4 rebounds tonight. Is that a concern?"
- Peak Kelvin: "Four rebounds? Quannas White had the same amount and he was wearing a suit on the bench." (actual quote, id:16)
- Mid: "We need to do a better job on the glass."
- Anti-Kelvin: "Rebounds are kind of an overrated stat honestly."

#### NEW CATEGORY: "money" (4 questions)

Based on his viral NIL/budget quotes and the $25K fine saga.

**Q7 — Poor Athletic Department**
- Reporter: "Coach, how do you compete in NIL with programs like Kansas and Texas?"
- Peak Kelvin: "We have a very poor athletic department. We're poor. We were poor when I got here, and we're still poor." (actual quote, id:10)
- Mid: "We're working on growing our NIL collective."
- Anti-Kelvin: "Money doesn't matter. Kids come here for the love of the game."

**Q8 — Afford to Sign**
- Reporter: "There are some big-name transfers in the portal this spring. Are you making calls?"
- Peak Kelvin: "It's not about who we want to sign. It's 'who can we afford to sign?'" (actual quote, id:38)
- Mid: "We're being strategic about our portal approach."
- Anti-Kelvin: "We're throwing blank checks at five-stars. Spare no expense."

**Q9 — The Cronin Dollar (already in game as special event, but also works as a question)**
- Reporter: "Coach, Mick Cronin apparently sent you a dollar after your budget comments. Your reaction?"
- Peak Kelvin: "He Venmo'd me a dollar and said 'I heard your schtick. Here's a dollar.' Mick's a good dude." (actual quote, id:11)
- Mid: "I appreciate the gesture. Mick and I go way back."
- Anti-Kelvin: "I'm going to Venmo him back double. UCLA needs it more."

**Q10 — Walk It Back**
- Reporter: "Do you regret calling Houston's athletic department 'poor' last week?"
- Peak Kelvin: "I shouldn't have said we're poor. We're not poor. We're anything but poor. But the NIL thing? That's not a bottomless pit." (actual quote, id:12)
- Mid: "I could have phrased it differently."
- Anti-Kelvin: "I stand by everything I said. We're broke."

#### EXPAND "respect" category (3 more questions → 9 total)

**Q11 — Toy Poodle League**
- Reporter: "Coach, critics say Houston's Big 12 schedule doesn't prepare you for March."
- Peak Kelvin: "We weren't 34-4 playing in the Toy Poodle League. This is the Big 12." (actual quote, id:2)
- Mid: "Our conference record speaks for itself."
- Anti-Kelvin: "Yeah, we probably need a harder schedule."

**Q12 — Little Old Houston**
- Reporter: "Some analysts still rank Kansas and Iowa State ahead of you despite your record. Thoughts?"
- Peak Kelvin: "Little old University of Houston jumping up, swinging with the big boys. That's something to take pride in." (actual quote, id:23)
- Mid: "Rankings don't matter to us. Wins do."
- Anti-Kelvin: "They're probably right. Those programs have more tradition."

**Q13 — National Relevance**
- Reporter: "Coach, some people still think of Houston as a football school. How do you change that?"
- Peak Kelvin: "The University of Houston is a program that should have national relevance. And now it does." (actual quote, id:49)
- Mid: "We're building something special here."
- Anti-Kelvin: "Football is king in Texas. We're just happy to be here."

#### EXPAND "toughness" category (3 more questions → 9 total)

**Q14 — Road Toughness**
- Reporter: "How do you prepare this team for hostile road environments?"
- Peak Kelvin: "To win on the road, you don't have to be great. You have to be tough. And we were tough enough." (actual quote, id:24)
- Mid: "We simulate crowd noise in practice."
- Anti-Kelvin: "Road games are really hard. We're just hoping to split."

**Q15 — Surrender Early**
- Reporter: "Coach, your team always seems to wear opponents down in the second half. What's the secret?"
- Peak Kelvin: "Surrender early, thrive later. Do hard things, do them harder than your opponents, and do them for 40 minutes." (actual quote, id:37)
- Mid: "We emphasize conditioning and depth."
- Anti-Kelvin: "We're just lucky teams get tired against us."

**Q16 — Choose Who You Want to Be**
- Reporter: "How do you get freshmen to buy into a program where they might not start?"
- Peak Kelvin: "You choose who you want to be. Nobody's making that choice for you." (actual quote, id:43)
- Mid: "We have a developmental plan for every player."
- Anti-Kelvin: "We promise them minutes in their recruitment."

#### EXPAND "personal" category (2 more questions → 6 total)

**Q17 — Little Ricky from Hickory**
- Reporter: "Coach, you and Rick Barnes have been coaching against each other for decades. What's that rivalry like?"
- Peak Kelvin: "Rick Barnes and I played college basketball against each other 50 years ago. I used to call him Little Ricky from Hickory." (actual quote, id:20)
- Mid: "Rick's a great coach. We have a lot of respect for each other."
- Anti-Kelvin: "Rick Barnes? Never heard of him."

**Q18 — Lumbee Heritage**
- Reporter: "Coach, you've talked about your Lumbee heritage shaping who you are. How does that show up in your coaching?"
- Peak Kelvin: "My connections to my culture, to coaching, is being Lumbee. That's who I am." (actual quote, id:44)
- Mid: "My upbringing taught me the value of hard work."
- Anti-Kelvin: "I don't really think about that stuff."

#### EXPAND "curveball" category (2 more questions → 6 total)

**Q19 — Not Very Smart**
- Reporter: "Coach, you started four freshmen in the first half tonight. Was that the plan?"
- Peak Kelvin: "Believe it or not, I played four freshmen in the first half. Who does that? Nobody has ever accused me of being very smart." (actual quote, id:18)
- Mid: "We needed to shake things up."
- Anti-Kelvin: "My analytics team told me to. I just do what the numbers say."

**Q20 — Bill Self Compliment**
- Reporter: "Coach, Bill Self called you 'the best ball coach in America' after the game. Your response?"
- Peak Kelvin: "Bill's just trying to make me feel good so I stop beating him. But I'll take it." (inspired by the Self quote context, id:39 related)
- Mid: "That means a lot coming from a Hall of Famer."
- Anti-Kelvin: "He's right. I should be in the Hall of Fame by now."

---

## Part 2: Expand Game-Over Quote Pool (15 → 30)

Add these 15 quotes to `src/data/quotes.ts`. These are all real Sampson quotes or close paraphrases:

```typescript
// ADD these to the existing quotes array:

"You're soft as puppy poop in the rain.",
"Hoss, we've been fouling since you were born.",
"Play like the hair on certain body parts is on fire.",
"You're like a fart in a skillet, all over the place.",
"If I tell the truth, they fine me $25,000. What part of that are you paying?",
"This isn't January against Sasquatch State.",
"Nobody has ever accused me of being very smart.",
"Show me a man that's not humble, I'll show you a man about to be humbled.",
"Surrender early. Thrive later. Do hard things for 40 minutes.",
"It's not about who we want to sign. It's who can we afford to sign.",
"I used to call Rick Barnes 'Little Ricky from Hickory.'",
"The river always wins. I'll let you figure out who the river is.",
"You and Quannas White had the same amount of rebounds, and he was in a suit.",
"Coach Sampson has no bad days. If you come in with one, he'll run right through you.",
"You choose who you want to be."
```

---

## Part 3: Implementation Notes

### Question Balance After Expansion

| Category | Before | After | Notes |
|----------|--------|-------|-------|
| officiating | 6 | 6 | Good as-is |
| respect | 6 | 9 | +3 from real quotes |
| toughness | 6 | 9 | +3 from real quotes |
| nil | 4 | 4 | Now covered by new "money" category |
| pronunciation | 4 | 4 | Good as-is |
| opponents | 6 | 6 | Good as-is |
| personal | 4 | 6 | +2 from real quotes |
| curveball | 4 | 6 | +2 from real quotes |
| **kelvinisms** | 0 | **6** | **NEW** — actual one-liners as answers |
| **money** | 0 | **4** | **NEW** — NIL/budget quotes |
| **TOTAL** | **40** | **60** | +20 questions |

### Question Selection Logic Update

In `useGameEngine.ts`, update the question selection to:
- Pull from 60 questions instead of 40
- Weight the new "kelvinisms" category slightly higher (they're the funniest)
- Ensure at least 1 "kelvinisms" question appears per game
- Ensure at least 1 "money" question appears per game
- Keep existing category distribution logic otherwise

### Difficulty Distribution

New questions should follow existing patterns:
- difficulty 1: Reporter asks something straightforward, Peak Kelvin answer is obviously the funniest
- difficulty 2: Reporter question is a bit of a trap, answers are less obvious
- difficulty 3: All three answers sound plausible, requires knowing Kelvin's personality

The 20 new questions should be: 10 at difficulty 1, 7 at difficulty 2, 3 at difficulty 3.

### Animation Mapping for New Answers

- Peak Kelvin one-liners (insults): `"slam"` animation (podium slam for emphasis)
- Peak Kelvin philosophical: `"nod"` animation
- Peak Kelvin pointing out a reporter: `"point"` animation
- Mid answers: `"shrug"` or `"neutral"`
- Anti-Kelvin: `"angry"` or `"sweat"`

### Source File Reference

All quotes sourced from `sampson_quotes_50.json` in project root. Each quote entry has:
- `id` — reference number
- `quote` — exact text
- `context` — when/where it was said
- `source` — publication
- `hilarity_score` — 1-10 rating
- `tags` — categories
- `game_use` — suggested placement

---

## Execution Order

1. Read `sampson_quotes_50.json` for source material
2. Read `src/data/questions.json` to see existing format
3. Read `src/data/quotes.ts` to see existing game-over quotes
4. Read `src/types.ts` to confirm type definitions
5. Add the 20 new questions to `questions.json` following the exact format above
6. Add the 15 new quotes to `quotes.ts`
7. Update question selection logic in `useGameEngine.ts` to handle 60 questions and new categories
8. Test that the game still loads and plays correctly
