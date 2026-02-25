export interface Answer {
  text: string;
  type: 'peak_kelvin' | 'mid' | 'anti_kelvin';
  points: number;
  animation: string;
  kelvinQuote: boolean;
}

export interface Question {
  id: string;
  category: string;
  question: string;
  difficulty: number;
  answers: Answer[];
  dynamic?: boolean;
}

export interface ScheduleGame {
  date: string;
  opponent: string;
  coach: string;
  rank: number | null;
  location: 'Home' | 'Away';
  venue: string;
  tv: string;
}

export interface GameStats {
  peakKelvinCount: number;
  midCount: number;
  antiKelvinCount: number;
  timeoutCount: number;
  bestStreak: number;
  totalAnswered: number;
  finesPaid: number;
}

export type GamePhase = 'title' | 'playing' | 'game_over';
export type EndReason = 'survived' | 'fined_out' | 'sweat_out';

export type SpecialEventType = 'tie_rip' | 'pronunciation_blitz' | 'cronin_venmo' | 'invent_school';

export interface SpecialEventState {
  activeEvent: SpecialEventType | null;
  eventsFired: SpecialEventType[];
  questionsSinceLastEvent: number;
  tieRipped: boolean;
}

export interface GameState {
  phase: GamePhase;
  timeRemaining: number;
  score: number;
  bankAccount: number;
  sweatLevel: number;
  streak: number;
  multiplier: number;
  currentQuestion: Question | null;
  questionsUsed: Set<string>;
  lastCategory: string | null;
  stats: GameStats;
  endReason: EndReason | null;
  feedbackType: 'peak_kelvin' | 'mid' | 'anti_kelvin' | null;
  showingFeedback: boolean;
  specialEvent: SpecialEventState;
  lastAnswerType: 'peak_kelvin' | 'mid' | 'anti_kelvin' | null;
}
