import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PronunciationBlitzProps {
  onComplete: (points: number) => void;
}

interface WordCard {
  word: string;
  pronunciation: string;
  correct: boolean; // is the shown pronunciation correct?
}

const WORD_POOL: WordCard[] = [
  { word: 'Gonzaga', pronunciation: 'Gon-ZAG-ah', correct: true },
  { word: 'Gonzaga', pronunciation: 'Gon-ZAWG-ah', correct: false },
  { word: 'Spokane', pronunciation: 'Spo-CAN', correct: true },
  { word: 'Spokane', pronunciation: 'Spo-CANE', correct: false },
  { word: 'Kelvin', pronunciation: 'KEL-vin', correct: true },
  { word: 'Kelvin', pronunciation: 'KEV-in', correct: false },
  { word: 'Lumbee', pronunciation: 'LUM-bee', correct: true },
  { word: 'Lumbee', pronunciation: 'Loo-MEE', correct: false },
  { word: 'Nevada', pronunciation: 'Neh-VAD-ah', correct: true },
  { word: 'Nevada', pronunciation: 'Neh-VAH-dah', correct: false },
  { word: 'Louisville', pronunciation: 'LOO-ee-vil', correct: true },
  { word: 'Louisville', pronunciation: 'LOO-iss-ville', correct: false },
  { word: 'Appalachian', pronunciation: 'App-ah-LATCH-un', correct: true },
  { word: 'Appalachian', pronunciation: 'App-ah-LAY-shun', correct: false },
];

function pickThreeCards(): WordCard[] {
  // Pick 3 different words from the pool
  const words = [...new Set(WORD_POOL.map(w => w.word))];
  const shuffled = words.sort(() => Math.random() - 0.5).slice(0, 3);
  return shuffled.map(word => {
    const options = WORD_POOL.filter(w => w.word === word);
    return options[Math.floor(Math.random() * options.length)];
  });
}

export function PronunciationBlitz({ onComplete }: PronunciationBlitzProps) {
  const [cards] = useState<WordCard[]>(() => pickThreeCards());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [cardResult, setCardResult] = useState<'correct' | 'wrong' | null>(null);
  const swipeStartRef = useRef<number | null>(null);
  const processedRef = useRef(false);

  const currentCard = currentIndex < cards.length ? cards[currentIndex] : null;

  const handleAnswer = useCallback((swipedRight: boolean) => {
    if (!currentCard || processedRef.current) return;
    processedRef.current = true;

    // Right = "correct pronunciation", Left = "wrong pronunciation"
    const isCorrectAnswer = swipedRight === currentCard.correct;
    setCardResult(isCorrectAnswer ? 'correct' : 'wrong');

    if (isCorrectAnswer) {
      setCorrectCount(prev => prev + 1);
    }

    setTimeout(() => {
      setCardResult(null);
      processedRef.current = false;
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 600);
  }, [currentCard, currentIndex, cards.length]);

  // Auto-complete after showing result
  useEffect(() => {
    if (!showResult) return;
    const finalCorrect = correctCount + (cardResult === 'correct' ? 0 : 0); // already counted
    let points: number;
    if (finalCorrect >= 3) points = 750;
    else if (finalCorrect === 2) points = 400;
    else points = 100;
    const t = setTimeout(() => onComplete(points), 1500);
    return () => clearTimeout(t);
  }, [showResult, correctCount, onComplete, cardResult]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    swipeStartRef.current = e.clientX;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (swipeStartRef.current === null) return;
    const delta = e.clientX - swipeStartRef.current;
    if (Math.abs(delta) > 40) {
      handleAnswer(delta > 0);
    }
    swipeStartRef.current = null;
  }, [handleAnswer]);

  return (
    <motion.div
      className="special-event-overlay pronunciation-event"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div className="event-header">PRONUNCIATION CHECK!</div>
      <div className="pronunciation-progress">
        {cards.map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i < currentIndex ? 'done' : ''} ${i === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentCard && !showResult && (
          <motion.div
            key={currentIndex}
            className={`pronunciation-card ${cardResult ? `card-${cardResult}` : ''}`}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="pron-word">{currentCard.word}</div>
            <div className="pron-pronunciation">"{currentCard.pronunciation}"</div>
            <div className="pron-buttons">
              <button
                className="pron-btn pron-btn-wrong"
                onClick={() => handleAnswer(false)}
              >
                WRONG
              </button>
              <button
                className="pron-btn pron-btn-right"
                onClick={() => handleAnswer(true)}
              >
                CORRECT
              </button>
            </div>
            <div className="pron-swipe-hint">or swipe left / right</div>
          </motion.div>
        )}

        {showResult && (
          <motion.div
            key="result"
            className="event-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="event-result">
              <div className="pron-result-count">{correctCount}/3</div>
              <div className="event-score">
                +{correctCount >= 3 ? '750' : correctCount === 2 ? '400' : '100'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
