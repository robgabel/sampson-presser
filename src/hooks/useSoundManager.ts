import { useCallback, useRef, useEffect } from 'react';

type SoundType =
  | 'question_appear'
  | 'peak_kelvin'
  | 'mid'
  | 'anti_kelvin'
  | 'streak_fire'
  | 'game_over'
  | 'timer_warning'
  | 'event_intro';

export function useSoundManager() {
  const ctxRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

  // Lazily create AudioContext on first user interaction
  function getCtx(): AudioContext {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }

  const play = useCallback((type: SoundType) => {
    if (!enabledRef.current) return;
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;

      switch (type) {
        case 'question_appear': {
          // Short bright ding
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        case 'peak_kelvin': {
          // Rising triumphant tone + harmonic
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          const gain2 = ctx.createGain();
          osc1.type = 'sawtooth';
          osc1.frequency.setValueAtTime(400, now);
          osc1.frequency.exponentialRampToValueAtTime(800, now + 0.3);
          gain1.gain.setValueAtTime(0.12, now);
          gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(600, now);
          osc2.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
          gain2.gain.setValueAtTime(0.08, now);
          gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc1.connect(gain1).connect(ctx.destination);
          osc2.connect(gain2).connect(ctx.destination);
          osc1.start(now);
          osc1.stop(now + 0.5);
          osc2.start(now);
          osc2.stop(now + 0.4);

          // Noise burst for crowd cheer feel
          const bufferSize = ctx.sampleRate * 0.3;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.5;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const noiseGain = ctx.createGain();
          const noiseFilter = ctx.createBiquadFilter();
          noiseFilter.type = 'bandpass';
          noiseFilter.frequency.value = 2000;
          noiseFilter.Q.value = 0.5;
          noiseGain.gain.setValueAtTime(0.06, now + 0.1);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
          noise.start(now + 0.1);
          noise.stop(now + 0.5);
          break;
        }

        case 'mid': {
          // Neutral flat tone
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }

        case 'anti_kelvin': {
          // Low buzzer / error
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = 'square';
          osc1.frequency.setValueAtTime(150, now);
          osc2.type = 'square';
          osc2.frequency.setValueAtTime(155, now); // slight detune for grit
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.setValueAtTime(0.15, now + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc1.connect(gain).connect(ctx.destination);
          osc2.connect(gain);
          osc1.start(now);
          osc1.stop(now + 0.5);
          osc2.start(now);
          osc2.stop(now + 0.5);
          break;
        }

        case 'streak_fire': {
          // Rising whoosh
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.exponentialRampToValueAtTime(1600, now + 0.4);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(400, now);
          filter.frequency.exponentialRampToValueAtTime(3000, now + 0.4);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.setValueAtTime(0.12, now + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.connect(filter).connect(gain).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.5);
          break;
        }

        case 'timer_warning': {
          // Quick double beep
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1000, now);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
          gain.gain.linearRampToValueAtTime(0, now + 0.08);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.12);
          gain.gain.linearRampToValueAtTime(0, now + 0.18);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        case 'event_intro': {
          // Dramatic alert tone
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.setValueAtTime(800, now + 0.15);
          osc.frequency.setValueAtTime(600, now + 0.3);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.setValueAtTime(0.1, now + 0.35);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.5);
          break;
        }

        case 'game_over': {
          // Descending tone
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.6);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.7);
          break;
        }
      }
    } catch {
      // Silently fail if AudioContext is unavailable
    }
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      ctxRef.current?.close();
    };
  }, []);

  return { play, setEnabled, enabledRef };
}
