import scheduleData from '../data/schedule.json';
import type { ScheduleGame } from '../types';

const schedule = scheduleData as ScheduleGame[];
const GAME_DURATION_MS = 2.5 * 60 * 60 * 1000; // 2.5 hours

export function getNextGame(): ScheduleGame | null {
  const now = Date.now();
  for (const game of schedule) {
    const gameTime = new Date(game.date).getTime();
    const gameEnd = gameTime + GAME_DURATION_MS;
    if (gameEnd > now) {
      return game;
    }
  }
  return null;
}

export function formatGameSubtitle(game: ScheduleGame): string {
  const date = new Date(game.date);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();

  const rankStr = game.rank ? `#${game.rank} ` : '';
  if (game.location === 'Away') {
    return `Away at ${rankStr}${game.opponent} — ${dayName}, ${monthName} ${dayNum}`;
  }
  return `vs ${rankStr}${game.opponent} — ${dayName}, ${monthName} ${dayNum}`;
}

export function formatVenueLine(game: ScheduleGame): string {
  return `${game.venue} • ${game.tv}`;
}

export function formatGameContext(game: ScheduleGame): string {
  const rankStr = game.rank ? `#${game.rank} ` : '';
  if (game.location === 'Away') {
    return `Away at ${rankStr}${game.opponent}`;
  }
  return `vs ${rankStr}${game.opponent}`;
}
