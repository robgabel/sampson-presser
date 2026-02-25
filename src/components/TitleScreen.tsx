import { getNextGame, formatGameSubtitle, formatVenueLine } from '../utils/schedule';

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const nextGame = getNextGame();

  return (
    <div className="title-screen">
      <div className="title-content">
        <div className="title-badge">PREGAME PRESSER</div>
        <h1 className="title-main">COACH SAMP'S<br />PREGAME PRESSER</h1>

        {nextGame ? (
          <div className="title-opponent">
            <div className="opponent-name">{formatGameSubtitle(nextGame)}</div>
            <div className="opponent-venue">{formatVenueLine(nextGame)}</div>
          </div>
        ) : (
          <div className="title-opponent">
            <div className="opponent-name">PRESS CONFERENCE SURVIVAL</div>
          </div>
        )}

        <p className="title-tagline">
          Don't get fined. Don't get soft. Don't call him Kevin.
        </p>

        <button className="start-button" onClick={onStart}>
          START PRESS CONFERENCE
        </button>

        <div className="title-how-to-play">
          <details>
            <summary>How to Play</summary>
            <div className="how-to-content">
              <div className="how-step">
                <span className="step-num">1</span>
                Reporters ask questions. Pick the most KELVIN response.
              </div>
              <div className="how-step">
                <span className="step-num">2</span>
                Peak Kelvin = big points. Mid = meh. Anti-Kelvin = $25K fine.
              </div>
              <div className="how-step">
                <span className="step-num">3</span>
                Survive 90 seconds. Don't go broke. Don't sleep on Houston.
              </div>
            </div>
          </details>
        </div>
      </div>

      <div className="title-podium">
        <div className="podium-graphic">
          <div className="podium-mics">
            <div className="mic"></div>
            <div className="mic"></div>
            <div className="mic"></div>
          </div>
          <div className="podium-body">
            <div className="podium-logo">UH</div>
          </div>
        </div>
      </div>
    </div>
  );
}
