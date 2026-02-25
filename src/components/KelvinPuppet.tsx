import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGE_SRCS = [
  '/images/coach-samp-mouth-closed-suit.png',
  '/images/coach-samp-mouth-open-suit.png',
  '/images/coach-samp-mouth-closed-polo.png',
  '/images/coach-samp-mouth-open-polo.png',
];

function getImageSrc(tieRipped: boolean, mouthOpen: boolean): string {
  if (tieRipped) {
    return mouthOpen
      ? '/images/coach-samp-mouth-open-polo.png'
      : '/images/coach-samp-mouth-closed-polo.png';
  }
  return mouthOpen
    ? '/images/coach-samp-mouth-open-suit.png'
    : '/images/coach-samp-mouth-closed-suit.png';
}

interface KelvinPuppetProps {
  feedbackType: 'peak_kelvin' | 'mid' | 'anti_kelvin' | null;
  showingFeedback: boolean;
  sweatLevel: number;
  streak: number;
  tieRipped: boolean;
}

export default function KelvinPuppet({
  feedbackType,
  showingFeedback,
  sweatLevel,
  streak,
  tieRipped,
}: KelvinPuppetProps) {
  const [mouthOpen, setMouthOpen] = useState(false);

  // Preload all 4 images on mount to prevent flicker
  useEffect(() => {
    IMAGE_SRCS.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Mouth flap animation: toggle open/closed every 150ms for ~750ms when feedback shows
  useEffect(() => {
    if (!showingFeedback) {
      setMouthOpen(false);
      return;
    }
    let count = 0;
    const maxFlaps = 5;
    setMouthOpen(true);
    const interval = setInterval(() => {
      count++;
      if (count >= maxFlaps) {
        clearInterval(interval);
        setMouthOpen(false);
        return;
      }
      setMouthOpen(prev => !prev);
    }, 150);
    return () => clearInterval(interval);
  }, [showingFeedback]);

  const isReacting = showingFeedback && feedbackType;
  const isPeak = isReacting && feedbackType === 'peak_kelvin';
  const isMid = isReacting && feedbackType === 'mid';
  const isAnti = isReacting && feedbackType === 'anti_kelvin';

  // Whole-image reaction transforms
  const photoAnimate = isPeak
    ? { rotate: -2, scale: 1.03 }
    : isAnti
      ? { rotate: 2, y: 3 }
      : isMid
        ? { y: [0, 2, 0] }
        : { rotate: 0, scale: 1, y: 0 };

  const transitionSnap = { duration: 0.4, ease: 'easeOut' as const };
  const transitionReturn = { duration: 0.3 };

  // Brightness dims as sweat increases
  const photoBrightness = 1 - sweatLevel * 0.003;

  // Fire intensity
  const fireScale = streak >= 5 ? 1.2 : 1;

  return (
    <div className="kelvin-area">
      {/* Fire aura behind everything */}
      <AnimatePresence>
        {streak >= 3 && (
          <motion.div
            className="kelvin-fire-aura"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: fireScale, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="fire-layer fire-outer" />
            <div className="fire-layer fire-middle" />
            <div className="fire-layer fire-inner" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sweat drops */}
      <div className="kelvin-sweat-drops">
        {sweatLevel > 25 && <div className="sweat-drop drop-left" />}
        {sweatLevel > 50 && <div className="sweat-drop drop-right" />}
        {sweatLevel > 75 && (
          <div
            className="sweat-drop drop-center"
            style={{ animationDuration: '1s' }}
          />
        )}
      </div>

      {/* Photo puppet */}
      <motion.div
        className="kelvin-figure"
        animate={{ y: [0, -1.5, 0] }}
        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.img
          className="kelvin-photo"
          src={getImageSrc(tieRipped, mouthOpen)}
          alt="Coach Sampson"
          animate={photoAnimate}
          transition={isReacting ? transitionSnap : transitionReturn}
          style={{ filter: `brightness(${photoBrightness})` }}
        />
      </motion.div>
    </div>
  );
}
