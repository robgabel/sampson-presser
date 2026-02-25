import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNextGame } from '../utils/schedule';

interface InventSchoolProps {
  onComplete: (points: number) => void;
}

interface SchoolOption {
  name: string;
  points: number;
}

const TEMPLATES = [
  "THIS ISN'T JANUARY AGAINST ____",
  "WE DIDN'T GO 34-4 PLAYING ____",
  "YOU THINK ____ COULD SURVIVE OUR SCHEDULE?",
  "I DIDN'T SEE ____ IN THE FINAL FOUR",
];

const SCHOOL_SETS: SchoolOption[][] = [
  [
    { name: 'Sasquatch State', points: 500 },
    { name: 'Toy Poodle University', points: 500 },
    { name: 'North Central Florida A&T', points: 400 },
    { name: 'Southwest Idaho Tech', points: 300 },
  ],
  [
    { name: 'Upper Peninsula Polytechnic', points: 400 },
    { name: 'The Bermuda Triangle School of Hoops', points: 500 },
    { name: 'East Cupcake State', points: 500 },
    { name: 'Lake Wobegon Community College', points: 300 },
  ],
  [
    { name: 'Narnia A&M', points: 500 },
    { name: 'West Nowhere Bible College', points: 400 },
    { name: 'Mosquito Coast University', points: 400 },
    { name: 'The Toy Poodle League All-Stars', points: 500 },
  ],
];

export function InventSchool({ onComplete }: InventSchoolProps) {
  const [template] = useState(() => TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)]);
  const [schools] = useState(() => {
    const set = SCHOOL_SETS[Math.floor(Math.random() * SCHOOL_SETS.length)];
    return [...set].sort(() => Math.random() - 0.5);
  });
  const [selected, setSelected] = useState<SchoolOption | null>(null);
  const [timeExpired, setTimeExpired] = useState(false);

  // 5-second timer
  useEffect(() => {
    const t = setTimeout(() => {
      if (!selected) setTimeExpired(true);
    }, 5000);
    return () => clearTimeout(t);
  }, [selected]);

  // After selection or timeout, complete
  useEffect(() => {
    if (!selected && !timeExpired) return;
    const points = selected ? selected.points : 100;
    const t = setTimeout(() => onComplete(points), 1500);
    return () => clearTimeout(t);
  }, [selected, timeExpired, onComplete]);

  const nextGame = getNextGame();
  const opponentName = nextGame?.opponent ?? 'some cupcake';

  // Fill in template, replacing ____ with the selected school or ____
  const filledTemplate = selected
    ? template.replace('____', selected.name.toUpperCase())
    : template;

  return (
    <motion.div
      className="special-event-overlay invent-school-event"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="event-header">INVENT A SCHOOL!</div>
      <div className="school-context">
        Kelvin needs a fake school to trash-talk before the {opponentName} game
      </div>

      <motion.div
        className="school-template"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <span className="template-text">{filledTemplate}</span>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selected && !timeExpired ? (
          <motion.div
            key="options"
            className="school-options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {schools.map((school, i) => (
              <motion.button
                key={school.name}
                className="school-btn"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelected(school)}
              >
                {school.name}
              </motion.button>
            ))}
            <motion.div
              className="event-timer-bar"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="result"
            className="event-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {selected ? (
              <div className="event-result">
                <div className="school-kelvin-line">
                  "{filledTemplate}"
                </div>
                <div className="event-score">+{selected.points}</div>
              </div>
            ) : (
              <div className="event-result event-result-miss">
                <div className="event-score">TOO SLOW! +100</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
