import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameState, Question, Answer, GameStats, SpecialEventType, SpecialEventState } from '../types';
import questionsData from '../data/questions.json';
import { getNextGame } from '../utils/schedule';

const INITIAL_TIME = 90;
const INITIAL_BANK = 100000;
const INITIAL_SWEAT = 15;
const FINE_AMOUNT = 25000;
const SWEAT_PER_SECOND = 0.5;
const SWEAT_PEAK = 2;
const SWEAT_MID = 3;
const SWEAT_ANTI = 10;
const FEEDBACK_DURATION = 1500;

const MAX_EVENTS_PER_GAME = 3;
const MIN_QUESTIONS_BETWEEN_EVENTS = 2;
const EVENT_CHANCE = 0.50;
const FORCE_TRIGGER_THRESHOLD = 0.75; // Force event if past 75% of a window with none yet

const rawQuestions = questionsData as Question[];

// Substitute dynamic templates in questions
function hydrateQuestions(): Question[] {
  const nextGame = getNextGame();
  const opponent = nextGame?.opponent ?? 'your next opponent';
  const coach = nextGame?.coach ?? 'the opposing coach';
  return rawQuestions.map(q => {
    if (!q.dynamic) return q;
    return {
      ...q,
      question: q.question
        .replace('{{NEXT_OPPONENT}}', opponent)
        .replace('{{NEXT_COACH}}', coach),
    };
  });
}

const questions = hydrateQuestions();

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function selectNextQuestion(used: Set<string>, lastCategory: string | null): Question | null {
  const available = questions.filter(
    (q) => !used.has(q.id) && q.category !== lastCategory
  );
  if (available.length === 0) {
    const fallback = questions.filter((q) => !used.has(q.id));
    if (fallback.length === 0) return null;
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  return available[Math.floor(Math.random() * available.length)];
}

const initialStats: GameStats = {
  peakKelvinCount: 0,
  midCount: 0,
  antiKelvinCount: 0,
  timeoutCount: 0,
  bestStreak: 0,
  totalAnswered: 0,
  finesPaid: 0,
};

const initialSpecialEvent: SpecialEventState = {
  activeEvent: null,
  eventsFired: [],
  questionsSinceLastEvent: 0,
  tieRipped: false,
};

function createInitialState(): GameState {
  return {
    phase: 'title',
    timeRemaining: INITIAL_TIME,
    score: 0,
    bankAccount: INITIAL_BANK,
    sweatLevel: INITIAL_SWEAT,
    streak: 0,
    multiplier: 1,
    currentQuestion: null,
    questionsUsed: new Set(),
    lastCategory: null,
    stats: { ...initialStats },
    endReason: null,
    feedbackType: null,
    showingFeedback: false,
    specialEvent: { ...initialSpecialEvent },
    lastAnswerType: null,
  };
}

// Decide which special event pool is available
function getAvailableEvents(state: GameState): SpecialEventType[] {
  const { specialEvent, stats } = state;
  if (specialEvent.eventsFired.length >= MAX_EVENTS_PER_GAME) return [];
  if (specialEvent.questionsSinceLastEvent < MIN_QUESTIONS_BETWEEN_EVENTS) return [];
  if (specialEvent.activeEvent) return [];

  const allEvents: SpecialEventType[] = ['tie_rip', 'pronunciation_blitz', 'cronin_venmo', 'invent_school'];
  const available = allEvents.filter(e => !specialEvent.eventsFired.includes(e));

  // Tie rip only after an anti-kelvin answer
  if (available.includes('tie_rip') && stats.antiKelvinCount === 0) {
    return available.filter(e => e !== 'tie_rip');
  }

  return available;
}

// Should we trigger an event now?
function shouldTriggerEvent(state: GameState): SpecialEventType | null {
  const available = getAvailableEvents(state);
  if (available.length === 0) return null;

  const elapsed = INITIAL_TIME - state.timeRemaining;

  // Don't fire in the first 10 seconds or last 10 seconds
  if (elapsed < 10 || state.timeRemaining < 10) return null;

  // Distribute events across the game timeline
  const eventCount = state.specialEvent.eventsFired.length;
  const windows: [number, number][] = [
    [15, 35],  // first event window
    [35, 60],  // second event window
    [55, 75],  // third event window
  ];

  if (eventCount >= windows.length) return null;
  const [start, end] = windows[eventCount];
  if (elapsed < start || elapsed > end) return null;

  // Force trigger if we're past 75% of the window to guarantee events happen
  const windowProgress = (elapsed - start) / (end - start);
  const forceTriggering = windowProgress >= FORCE_TRIGGER_THRESHOLD;

  // 50% random chance per question, or force if past threshold
  if (!forceTriggering && Math.random() > EVENT_CHANCE) return null;

  // Tie rip: only after an anti-kelvin was the LAST answer (uses lastAnswerType, not feedbackType)
  let filtered = available;
  if (state.lastAnswerType !== 'anti_kelvin') {
    filtered = filtered.filter(e => e !== 'tie_rip');
  }

  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function useGameEngine() {
  const [state, setState] = useState<GameState>(createInitialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    timerRef.current = null;
    questionTimerRef.current = null;
    feedbackTimerRef.current = null;
  }, []);

  const endGame = useCallback(
    (reason: 'survived' | 'fined_out' | 'sweat_out') => {
      clearAllTimers();
      setState((prev) => ({
        ...prev,
        phase: 'game_over',
        endReason: reason,
        currentQuestion: null,
        showingFeedback: false,
        feedbackType: null,
        specialEvent: { ...prev.specialEvent, activeEvent: null },
      }));
    },
    [clearAllTimers]
  );

  const scheduleNextQuestion = useCallback(
    (delay?: number) => {
      if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
      questionTimerRef.current = setTimeout(() => {
        setState((prev) => {
          if (prev.phase !== 'playing') return prev;

          // Force tie_rip after the 4th question answered
          const questionsAnswered = prev.stats.totalAnswered;
          if (questionsAnswered >= 4 && !prev.specialEvent.eventsFired.includes('tie_rip')) {
            return {
              ...prev,
              currentQuestion: null,
              showingFeedback: false,
              feedbackType: null,
              specialEvent: {
                ...prev.specialEvent,
                activeEvent: 'tie_rip' as SpecialEventType,
                eventsFired: [...prev.specialEvent.eventsFired, 'tie_rip' as SpecialEventType],
                questionsSinceLastEvent: 0,
              },
            };
          }

          // Check if we should trigger a special event
          const eventToTrigger = shouldTriggerEvent(prev);
          if (eventToTrigger) {
            return {
              ...prev,
              currentQuestion: null,
              showingFeedback: false,
              feedbackType: null,
              specialEvent: {
                ...prev.specialEvent,
                activeEvent: eventToTrigger,
                eventsFired: [...prev.specialEvent.eventsFired, eventToTrigger],
                questionsSinceLastEvent: 0,
              },
            };
          }

          const next = selectNextQuestion(prev.questionsUsed, prev.lastCategory);
          if (!next) return prev;
          const newUsed = new Set(prev.questionsUsed);
          newUsed.add(next.id);
          return {
            ...prev,
            currentQuestion: { ...next, answers: shuffleArray(next.answers) },
            questionsUsed: newUsed,
            lastCategory: next.category,
            showingFeedback: false,
            feedbackType: null,
            specialEvent: {
              ...prev.specialEvent,
              questionsSinceLastEvent: prev.specialEvent.questionsSinceLastEvent + 1,
            },
          };
        });
      }, delay ?? 500);
    },
    []
  );

  const startGame = useCallback(() => {
    clearAllTimers();
    const fresh = createInitialState();
    fresh.phase = 'playing';
    // Always start with the coach prep question
    const coachQ = questions.find(q => q.id === 'q_opponents_coach_prep');
    const firstQ = coachQ ?? selectNextQuestion(new Set(), null);
    if (firstQ) {
      fresh.currentQuestion = { ...firstQ, answers: shuffleArray(firstQ.answers) };
      fresh.questionsUsed.add(firstQ.id);
      fresh.lastCategory = firstQ.category;
    }
    setState(fresh);
  }, [clearAllTimers]);

  // Main countdown timer - keeps ticking even during special events (except Venmo has its own timer)
  useEffect(() => {
    if (state.phase !== 'playing') return;

    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.phase !== 'playing') return prev;
        const newTime = prev.timeRemaining - 1;
        const newSweat = Math.min(100, prev.sweatLevel + SWEAT_PER_SECOND);

        if (newTime <= 0) {
          return { ...prev, timeRemaining: 0 };
        }
        if (newSweat >= 100) {
          return { ...prev, sweatLevel: 100 };
        }
        return { ...prev, timeRemaining: newTime, sweatLevel: newSweat };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.phase]);

  // Check end conditions
  useEffect(() => {
    if (state.phase !== 'playing') return;
    if (state.timeRemaining <= 0) {
      endGame('survived');
    } else if (state.bankAccount <= 0) {
      endGame('fined_out');
    } else if (state.sweatLevel >= 100) {
      endGame('sweat_out');
    }
  }, [state.phase, state.timeRemaining, state.bankAccount, state.sweatLevel, endGame]);

  const answerQuestion = useCallback(
    (answer: Answer) => {
      setState((prev) => {
        if (prev.phase !== 'playing' || !prev.currentQuestion || prev.showingFeedback) return prev;

        let newScore = prev.score;
        let newBank = prev.bankAccount;
        let newSweat = prev.sweatLevel;
        let newStreak = prev.streak;
        let newMultiplier = prev.multiplier;
        const newStats = { ...prev.stats };
        newStats.totalAnswered++;

        if (answer.type === 'peak_kelvin') {
          newStreak++;
          if (newStreak >= 5) {
            newMultiplier = 3;
          } else if (newStreak >= 3) {
            newMultiplier = 2;
          }
          const points = answer.points * newMultiplier;
          newScore += points;
          newSweat = Math.min(100, newSweat + SWEAT_PEAK);
          newStats.peakKelvinCount++;
          if (newStreak > newStats.bestStreak) {
            newStats.bestStreak = newStreak;
          }
        } else if (answer.type === 'mid') {
          newScore += answer.points * newMultiplier;
          newStreak = 0;
          newMultiplier = 1;
          newSweat = Math.min(100, newSweat + SWEAT_MID);
          newStats.midCount++;
        } else {
          // anti_kelvin
          newBank -= FINE_AMOUNT;
          newStreak = 0;
          newMultiplier = 1;
          newSweat = Math.min(100, newSweat + SWEAT_ANTI);
          newStats.antiKelvinCount++;
          newStats.finesPaid += FINE_AMOUNT;
        }

        return {
          ...prev,
          score: newScore,
          bankAccount: Math.max(0, newBank),
          sweatLevel: newSweat,
          streak: newStreak,
          multiplier: newMultiplier,
          stats: newStats,
          feedbackType: answer.type,
          showingFeedback: true,
          lastAnswerType: answer.type,
        };
      });

      // After feedback, load next question
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = setTimeout(() => {
        setState((prev) => {
          if (prev.phase !== 'playing') return prev;
          return { ...prev, showingFeedback: false, feedbackType: null };
        });
        scheduleNextQuestion(200);
      }, FEEDBACK_DURATION);
    },
    [scheduleNextQuestion]
  );

  const completeSpecialEvent = useCallback(
    (points: number) => {
      setState((prev) => {
        if (prev.phase !== 'playing') return prev;
        const tieRipped = prev.specialEvent.activeEvent === 'tie_rip'
          ? true
          : prev.specialEvent.tieRipped;
        return {
          ...prev,
          score: Math.max(0, prev.score + points),
          specialEvent: {
            ...prev.specialEvent,
            activeEvent: null,
            tieRipped,
          },
        };
      });
      scheduleNextQuestion(500);
    },
    [scheduleNextQuestion]
  );

  const resetGame = useCallback(() => {
    clearAllTimers();
    setState(createInitialState());
  }, [clearAllTimers]);

  return { state, startGame, answerQuestion, resetGame, completeSpecialEvent };
}
