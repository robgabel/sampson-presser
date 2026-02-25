import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TieRipEventProps {
  onComplete: (points: number) => void;
}

type RipPhase = 'intro' | 'swipe' | 'result';

export function TieRipEvent({ onComplete }: TieRipEventProps) {
  const [phase, setPhase] = useState<RipPhase>('intro');
  const [result, setResult] = useState<'perfect' | 'okay' | 'missed' | null>(null);
  const swipeStartRef = useRef<number | null>(null);
  const swipeStartTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Intro phase -> swipe phase after 1s
  useEffect(() => {
    const t = setTimeout(() => setPhase('swipe'), 1000);
    return () => clearTimeout(t);
  }, []);

  // 2-second window for swipe
  useEffect(() => {
    if (phase !== 'swipe') return;
    swipeStartTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      setResult('missed');
      setPhase('result');
    }, 2000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase]);

  // End after showing result
  useEffect(() => {
    if (phase !== 'result') return;
    const points = result === 'perfect' ? 1000 : result === 'okay' ? 300 : 0;
    const t = setTimeout(() => onComplete(points), 1200);
    return () => clearTimeout(t);
  }, [phase, result, onComplete]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (phase !== 'swipe') return;
    swipeStartRef.current = e.clientY;
  }, [phase]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (phase !== 'swipe' || swipeStartRef.current === null) return;
    const delta = e.clientY - swipeStartRef.current;
    if (delta > 40) {
      // Downward swipe detected
      if (timerRef.current) clearTimeout(timerRef.current);
      const elapsed = Date.now() - swipeStartTimeRef.current;
      setResult(elapsed < 800 ? 'perfect' : 'okay');
      setPhase('result');
    }
    swipeStartRef.current = null;
  }, [phase]);

  // Also support click/tap as fallback
  const handleTap = useCallback(() => {
    if (phase !== 'swipe') return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const elapsed = Date.now() - swipeStartTimeRef.current;
    setResult(elapsed < 800 ? 'perfect' : 'okay');
    setPhase('result');
  }, [phase]);

  return (
    <motion.div
      className="special-event-overlay tie-rip-event"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div className="event-border-flash" />

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            className="event-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="event-alert">TERRIBLE CALL!</div>
          </motion.div>
        )}

        {phase === 'swipe' && (
          <motion.div
            key="swipe"
            className="event-center tie-rip-prompt"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="event-instruction">RIP THE TIE!</div>
            <div className="tie-target" onClick={handleTap}>
              <motion.div
                className="tie-icon"
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <div className="tie-rip-visual">
                  <div className="tie-knot"></div>
                  <div className="tie-body-rip"></div>
                </div>
              </motion.div>
              <div className="swipe-hint">SWIPE DOWN or TAP</div>
            </div>
            <motion.div
              className="event-timer-bar"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 2, ease: 'linear' }}
            />
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div
            key="result"
            className="event-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {result === 'perfect' && (
              <div className="event-result event-result-great">
                <motion.div
                  className="tie-flying"
                  initial={{ rotate: 0, y: 0, opacity: 1 }}
                  animate={{ rotate: 360, y: -200, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="tie-knot"></div>
                  <div className="tie-body-rip"></div>
                </motion.div>
                <div className="event-score">TIE RIPPED! +1,000</div>
              </div>
            )}
            {result === 'okay' && (
              <div className="event-result event-result-ok">
                <div className="event-score">TIE FUMBLE! +300</div>
              </div>
            )}
            {result === 'missed' && (
              <div className="event-result event-result-miss">
                <div className="event-score">TOO SLOW!</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
