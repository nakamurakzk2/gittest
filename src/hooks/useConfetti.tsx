import { useEffect, useCallback, useRef } from 'react';

interface ConfettiConfig {
  duration?: number;
  startVelocity?: number;
  spread?: number;
  ticks?: number;
  particleCount?: number;
  originLeft?: { min: number; max: number };
  originRight?: { min: number; max: number };
}

export const useConfetti = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // confettiスクリプトの動的読み込み
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.3.2/dist/confetti.browser.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // コンポーネントのアンマウント時にクリーンアップ
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // アクティブなキャンバスをクリア
      if (typeof window !== 'undefined' && window.confetti) {
        window.confetti.reset();
      }
      document.body.removeChild(script);
    };
  }, []);

  const fireConfetti = useCallback((config: ConfettiConfig = {}) => {
    const {
      duration = 15000,
      startVelocity = 30,
      spread = 360,
      ticks = 60,
      particleCount = 100,
      originLeft = { min: 0.1, max: 0.3 },
      originRight = { min: 0.7, max: 0.9 }
    } = config;

    if (typeof window === 'undefined' || !window.confetti) {
      console.warn('Confetti script is not loaded yet');
      return;
    }

    // 既存のインターバルをクリア
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity, spread, ticks, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    intervalRef.current = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      const currentParticleCount = Math.floor(particleCount * (timeLeft / duration));

      // Fire from left side
      window.confetti(Object.assign({}, defaults, {
        particleCount: currentParticleCount,
        origin: {
          x: randomInRange(originLeft.min, originLeft.max),
          y: Math.random() - 0.2
        }
      }));

      // Fire from right side
      window.confetti(Object.assign({}, defaults, {
        particleCount: currentParticleCount,
        origin: {
          x: randomInRange(originRight.min, originRight.max),
          y: Math.random() - 0.2
        }
      }));
    }, 250);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      window.confetti.reset();
    };
  }, []);

  return fireConfetti;
};