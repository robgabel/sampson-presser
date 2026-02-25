import { useEffect, useRef } from 'react';
import type { GameState, Answer } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import KelvinPuppet from './KelvinPuppet';
import { TieRipEvent } from './TieRipEvent';
import { PronunciationBlitz } from './PronunciationBlitz';
import { CroninVenmo } from './CroninVenmo';
import { InventSchool } from './InventSchool';
import type { useSoundManager } from '../hooks/useSoundManager';

// Derive active reporter from question ID (deterministic hash to 0-4)
function getActiveReporter(questionId: string | undefined): number {
  if (!questionId) return -1;
  let hash = 0;
  for (let i = 0; i < questionId.length; i++) {
    hash = ((hash << 5) - hash + questionId.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 5;
}

interface GameScreenProps {
  state: GameState;
  onAnswer: (answer: Answer) => void;
  onEventComplete: (points: number) => void;
  sound: ReturnType<typeof useSoundManager>;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatBank(amount: number): string {
  if (amount >= 1000) {
    return `$${Math.floor(amount / 1000)}K`;
  }
  return `$${amount}`;
}

function getSweatColor(level: number): string {
  if (level < 25) return '#4FC3F7';
  if (level < 50) return '#FFD54F';
  if (level < 75) return '#FF9800';
  return '#F44336';
}

export function GameScreen({ state, onAnswer, onEventComplete, sound }: GameScreenProps) {
  const { timeRemaining, score, bankAccount, streak, multiplier, sweatLevel, currentQuestion, showingFeedback, feedbackType, specialEvent } = state;
  const prevQuestionRef = useRef<string | null>(null);
  const prevStreakRef = useRef(0);
  const prevEventRef = useRef<string | null>(null);
  const timerWarnedRef = useRef(false);

  // Sound: feedback on answer
  useEffect(() => {
    if (showingFeedback && feedbackType) {
      sound.play(feedbackType);
    }
  }, [showingFeedback, feedbackType, sound]);

  // Sound: new question appears
  useEffect(() => {
    if (currentQuestion && currentQuestion.id !== prevQuestionRef.current) {
      prevQuestionRef.current = currentQuestion.id;
      sound.play('question_appear');
    }
  }, [currentQuestion, sound]);

  // Sound: streak fire when hitting 3+
  useEffect(() => {
    if (streak >= 3 && streak > prevStreakRef.current) {
      sound.play('streak_fire');
    }
    prevStreakRef.current = streak;
  }, [streak, sound]);

  // Sound: special event intro
  useEffect(() => {
    if (specialEvent.activeEvent && specialEvent.activeEvent !== prevEventRef.current) {
      sound.play('event_intro');
    }
    prevEventRef.current = specialEvent.activeEvent;
  }, [specialEvent.activeEvent, sound]);

  // Sound: timer warning at 10 seconds
  useEffect(() => {
    if (timeRemaining === 10 && !timerWarnedRef.current) {
      timerWarnedRef.current = true;
      sound.play('timer_warning');
    }
    if (timeRemaining > 10) {
      timerWarnedRef.current = false;
    }
  }, [timeRemaining, sound]);

  const feedbackClass = showingFeedback
    ? feedbackType === 'peak_kelvin'
      ? 'feedback-peak'
      : feedbackType === 'anti_kelvin'
        ? 'feedback-anti'
        : 'feedback-mid'
    : '';

  const activeEvent = specialEvent.activeEvent;

  return (
    <div className={`game-screen ${feedbackClass}`}>
      {/* HUD */}
      <div className="hud">
        <div className="hud-item hud-timer">
          <span className="hud-label">TIME</span>
          <span className={`hud-value ${timeRemaining <= 15 ? 'timer-critical' : ''}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
        <div className="hud-item hud-score">
          <span className="hud-label">SCORE</span>
          <span className="hud-value">{score.toLocaleString()}</span>
        </div>
        <div className="hud-item hud-bank">
          <span className="hud-label">BANK</span>
          <span className={`hud-value ${bankAccount <= 25000 ? 'bank-low' : ''}`}>
            {formatBank(bankAccount)}
          </span>
        </div>
      </div>

      {/* Streak */}
      <AnimatePresence>
        {streak >= 2 && (
          <motion.div
            className="streak-bar"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {'🔥'.repeat(Math.min(streak, 7))} STREAK x{streak}
            {multiplier > 1 && ` — ${multiplier}X MULT`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sweat Meter */}
      <div className="sweat-meter">
        <div className="sweat-label">SWEAT</div>
        <div className="sweat-track">
          <motion.div
            className="sweat-fill"
            animate={{ width: `${sweatLevel}%` }}
            transition={{ duration: 0.3 }}
            style={{ backgroundColor: getSweatColor(sweatLevel) }}
          />
        </div>
      </div>

      {/* Press Conference Area */}
      <div className="press-area">
        {/* Kelvin Puppet at Podium */}
        <KelvinPuppet
          feedbackType={feedbackType}
          showingFeedback={showingFeedback}
          sweatLevel={sweatLevel}
          streak={streak}
          tieRipped={specialEvent.tieRipped}
        />

        {/* Question Bubble */}
        <AnimatePresence mode="wait">
          {currentQuestion && !activeEvent && (
            <motion.div
              key={currentQuestion.id}
              className="question-bubble"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p className="question-text">{currentQuestion.question}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reporters */}
        <div className="reporters">
          {[1, 2, 3, 4, 5].map((i) => {
            const activeIdx = getActiveReporter(currentQuestion?.id);
            const isActive = i - 1 === activeIdx && !showingFeedback && !activeEvent;
            const reactionClass = showingFeedback
              ? feedbackType === 'peak_kelvin'
                ? 'reporter-recoil'
                : feedbackType === 'anti_kelvin'
                  ? 'reporter-lean-in'
                  : ''
              : '';
            return (
              <div
                key={i}
                className={`reporter reporter-${i} ${isActive ? 'reporter-active' : ''} ${reactionClass}`}
              >
                <div className="reporter-head" />
                <div className="reporter-body" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer Buttons - hidden during special events */}
      {!activeEvent && (
        <div className="answers">
          <AnimatePresence mode="wait">
            {currentQuestion && !showingFeedback && (
              <motion.div
                key={currentQuestion.id + '-answers'}
                className="answer-list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {currentQuestion.answers.map((answer, idx) => (
                  <button
                    key={idx}
                    className="answer-button"
                    onClick={() => {
                      // Re-unlock/resume audio on every tap — iOS can
                      // re-suspend the AudioContext between interactions
                      sound.unlock();
                      onAnswer(answer);
                    }}
                  >
                    {answer.text}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {showingFeedback && (
            <motion.div
              className={`feedback-display feedback-${feedbackType}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {feedbackType === 'peak_kelvin' && (
                <span className="feedback-text">🔥 PEAK KELVIN! +{500 * state.multiplier}</span>
              )}
              {feedbackType === 'mid' && (
                <span className="feedback-text">😐 Mid. +{100 * state.multiplier}</span>
              )}
              {feedbackType === 'anti_kelvin' && (
                <span className="feedback-text">💀 ANTI-KELVIN! -$25,000</span>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Special Events */}
      <AnimatePresence>
        {activeEvent === 'tie_rip' && (
          <TieRipEvent onComplete={onEventComplete} />
        )}
        {activeEvent === 'pronunciation_blitz' && (
          <PronunciationBlitz onComplete={onEventComplete} />
        )}
        {activeEvent === 'cronin_venmo' && (
          <CroninVenmo onComplete={onEventComplete} />
        )}
        {activeEvent === 'invent_school' && (
          <InventSchool onComplete={onEventComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}
