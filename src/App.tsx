import { useEffect, useRef } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { useSoundManager } from './hooks/useSoundManager';
import { TitleScreen } from './components/TitleScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import './App.css';

function App() {
  const { state, startGame, answerQuestion, resetGame, completeSpecialEvent } = useGameEngine();
  const sound = useSoundManager();
  const prevPhaseRef = useRef(state.phase);

  // Sound: game over
  useEffect(() => {
    if (state.phase === 'game_over' && prevPhaseRef.current === 'playing') {
      sound.play('game_over');
    }
    prevPhaseRef.current = state.phase;
  }, [state.phase, sound]);

  return (
    <div className="app">
      {state.phase === 'title' && <TitleScreen onStart={startGame} />}
      {state.phase === 'playing' && (
        <GameScreen
          state={state}
          onAnswer={answerQuestion}
          onEventComplete={completeSpecialEvent}
          sound={sound}
        />
      )}
      {state.phase === 'game_over' && (
        <GameOverScreen state={state} onPlayAgain={startGame} onBackToTitle={resetGame} />
      )}
    </div>
  );
}

export default App;
