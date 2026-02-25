import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CroninVenmoProps {
  onComplete: (points: number) => void;
}

export function CroninVenmo({ onComplete }: CroninVenmoProps) {
  const [choice, setChoice] = useState<'accept' | 'decline' | null>(null);

  // 3-second auto-expire if no choice
  useEffect(() => {
    const t = setTimeout(() => {
      if (!choice) {
        setChoice('decline');
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [choice]);

  // After choice, show result then complete
  useEffect(() => {
    if (!choice) return;
    const points = choice === 'accept' ? 500 : -200;
    const t = setTimeout(() => onComplete(points), 1000);
    return () => clearTimeout(t);
  }, [choice, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="special-event-overlay cronin-venmo-event"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="venmo-notification"
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <div className="venmo-header">
            <div className="venmo-logo">V</div>
            <div className="venmo-app-name">Venmo</div>
          </div>
          <div className="venmo-body">
            <div className="venmo-avatar">MC</div>
            <div className="venmo-details">
              <div className="venmo-sender">Mick Cronin paid you $1.00</div>
              <div className="venmo-note">"Heard your presser 😂"</div>
            </div>
          </div>

          {!choice ? (
            <motion.div
              className="venmo-actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                className="venmo-btn venmo-accept"
                onClick={() => setChoice('accept')}
              >
                ACCEPT & LAUGH
              </button>
              <button
                className="venmo-btn venmo-decline"
                onClick={() => setChoice('decline')}
              >
                DECLINE
              </button>
            </motion.div>
          ) : (
            <motion.div
              className="venmo-result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {choice === 'accept' ? (
                <span className="venmo-result-text">+500 pts</span>
              ) : (
                <span className="venmo-result-text venmo-result-negative">-200 pts</span>
              )}
            </motion.div>
          )}

          {!choice && (
            <motion.div
              className="event-timer-bar venmo-timer"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 3, ease: 'linear' }}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
