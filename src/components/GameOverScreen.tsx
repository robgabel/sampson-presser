import type { GameState } from '../types';
import { getNextGame, formatGameContext } from '../utils/schedule';
import { getRandomQuote } from '../data/quotes';
import { useMemo } from 'react';

interface GameOverScreenProps {
  state: GameState;
  onPlayAgain: () => void;
  onBackToTitle: () => void;
}

function getRating(score: number): { title: string; flavor: string } {
  if (score >= 15001) return { title: 'PEAK KELVIN 🐐', flavor: "You out-Kelvined Kelvin. Reporters in shambles." };
  if (score >= 12001) return { title: "Don't Sleep on This One", flavor: "You ARE the press conference." };
  if (score >= 8001) return { title: 'Mud in the Blood', flavor: "Now we're talking. Don't sleep on this one." };
  if (score >= 5001) return { title: 'Big 12 Respectable', flavor: "You survived. Shout out to the Big 12 brethren." };
  if (score >= 2001) return { title: 'Sugar in the Veins', flavor: "Kelvin would not recruit you." };
  if (score >= 1) return { title: 'Sasquatch State Assistant Coach', flavor: "You have sugar in your veins." };
  return { title: 'Escorted Out by Security', flavor: "You owe the Big 12 more than your house is worth." };
}

function getEndLabel(reason: string | null): { text: string; emoji: string } {
  if (reason === 'fined_out') return { text: 'Fined Out', emoji: '💸' };
  if (reason === 'sweat_out') return { text: 'Sweat Out', emoji: '🥵' };
  return { text: 'Survived', emoji: '✅' };
}

export function GameOverScreen({ state, onPlayAgain, onBackToTitle }: GameOverScreenProps) {
  const rating = getRating(state.score);
  const endLabel = getEndLabel(state.endReason);
  const nextGame = getNextGame();
  const quote = useMemo(() => getRandomQuote(), []);

  const peakPct =
    state.stats.totalAnswered > 0
      ? Math.round((state.stats.peakKelvinCount / state.stats.totalAnswered) * 100)
      : 0;

  const shareText = useMemo(() => {
    const gameContext = nextGame ? formatGameContext(nextGame) : '';
    const contextLine = gameContext ? ` prepping for ${nextGame?.opponent} tonight!` : ' in Coach Samp\'s Pregame Presser!';
    return `I got ${rating.title}${contextLine} Score: ${state.score.toLocaleString()}. Can you survive Coach Samp's presser?`;
  }, [state.score, rating.title, nextGame]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Coach Samp's Pregame Presser",
          text: shareText,
          url: 'https://sampson-presser.vercel.app',
        });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${shareText} https://sampson-presser.vercel.app`);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="gameover-screen">
      <div className="gameover-header">
        <div className="gameover-badge">PRESS CONFERENCE RESULTS</div>
      </div>

      <div className="gameover-end-reason">
        <span className="end-emoji">{endLabel.emoji}</span>
        <span className="end-text">{endLabel.text}</span>
      </div>

      {nextGame && (
        <div className="gameover-context">
          Pregame presser: {formatGameContext(nextGame)}
        </div>
      )}

      <div className="gameover-rating">
        <h2 className="rating-title">{rating.title}</h2>
        <p className="rating-flavor">{rating.flavor}</p>
      </div>

      <div className="gameover-score">
        <span className="score-number">{state.score.toLocaleString()}</span>
        <span className="score-label">POINTS</span>
      </div>

      <div className="gameover-stats">
        <div className="stat-row">
          <span className="stat-label">Questions Answered</span>
          <span className="stat-value">{state.stats.totalAnswered}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Peak Kelvin %</span>
          <span className="stat-value">{peakPct}%</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Best Streak</span>
          <span className="stat-value">{state.stats.bestStreak}x 🔥</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Money Remaining</span>
          <span className="stat-value">${state.bankAccount.toLocaleString()}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Fines Paid</span>
          <span className="stat-value">${state.stats.finesPaid.toLocaleString()}</span>
        </div>
      </div>

      <div className="gameover-quote">
        <p>"{quote}"</p>
      </div>

      <div className="gameover-actions">
        <button className="action-button action-share" onClick={handleShare}>
          SHARE RESULTS
        </button>
        <button className="action-button action-play-again" onClick={onPlayAgain}>
          PLAY AGAIN
        </button>
        <button className="action-button action-title" onClick={onBackToTitle}>
          BACK TO TITLE
        </button>
      </div>
    </div>
  );
}
