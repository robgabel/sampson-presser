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

// Minimal silent MP3 used to switch iOS audio session to "playback" mode,
// allowing Web Audio API to work even when the device ringer/silent switch is off.
const SILENT_MP3 =
  'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRBqSAAAAAAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRBqSAAAAAAAAAAAAAAAAAAAA';

export function useSoundManager() {
  const ctxRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);
  const unlockedRef = useRef(false);
  // Keep a persistent HTMLAudioElement so iOS doesn't garbage-collect the audio session
  const silentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Get or create the AudioContext. Also attaches a statechange listener
  // the first time the context is created so iOS re-suspensions are caught.
  function getCtx(): AudioContext {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      // Auto-resume if iOS suspends the context after an interruption
      ctx.addEventListener('statechange', () => {
        if (ctx.state === 'suspended' && unlockedRef.current) {
          ctx.resume().catch(() => {});
        }
      });
      ctxRef.current = ctx;
    }
    return ctxRef.current;
  }

  // Ensure the AudioContext is running — call on every user interaction.
  // On iOS Safari, the AudioContext can be re-suspended at any time (tab switch,
  // lock screen, silence switch toggle). Unlike the initial unlock, calling resume()
  // on a subsequent gesture is lightweight but critical.
  const unlock = useCallback(() => {
    try {
      const ctx = getCtx();

      // Always attempt resume — iOS can re-suspend at any time
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // First-time unlock: play silent buffer + oscillator
      if (!unlockedRef.current) {
        // Play a silent buffer to fully unlock iOS audio
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);

        // Also play a brief silent oscillator as belt-and-suspenders
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        gain.gain.value = 0.001;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(0);
        osc.stop(ctx.currentTime + 0.01);

        unlockedRef.current = true;
      }

      // Play the silent mp3 on EVERY user gesture. On iOS this keeps the audio
      // session in "playback" mode so sounds work even with the ringer switch off.
      // Reusing the same Audio element avoids creating orphaned resources.
      if (!silentAudioRef.current) {
        silentAudioRef.current = new Audio(SILENT_MP3);
      }
      const audio = silentAudioRef.current;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch {
      // Silently fail
    }
  }, []);

  const play = useCallback((type: SoundType) => {
    if (!enabledRef.current) return;
    try {
      const ctx = getCtx();
      // Re-resume if iOS suspended the context between interactions
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      // If the context is not running yet (resume is async), bail out gracefully
      // rather than queueing sounds that will never be heard.
      if (ctx.state !== 'running') return;
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

  // Resume audio context on any user interaction (touchstart/touchend) anywhere
  // in the document. This keeps iOS audio alive during gameplay when the user
  // taps answer buttons, swipes special events, etc.
  useEffect(() => {
    const warmup = () => {
      const ctx = ctxRef.current;
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    };
    document.addEventListener('touchstart', warmup, { passive: true });
    document.addEventListener('touchend', warmup, { passive: true });
    return () => {
      document.removeEventListener('touchstart', warmup);
      document.removeEventListener('touchend', warmup);
    };
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      ctxRef.current?.close();
      silentAudioRef.current = null;
    };
  }, []);

  return { play, setEnabled, enabledRef, unlock };
}
