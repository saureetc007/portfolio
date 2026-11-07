import { useState, useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover' | 'mount';
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

/**
 * DecryptedText inspired by DavidHDev/react-bits
 * Text decryption / scramble animation.
 */
export function DecryptedText({
  text,
  speed = 40,
  maxIterations = 10,
  characters = DEFAULT_CHARS,
  className = '',
  encryptedClassName = 'decrypted-char--scrambled',
  animateOn = 'mount',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();
  const intervalRef = useRef<number | null>(null);

  const startScramble = useCallback(() => {
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    setIsScrambling(true);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index]!;
            return characters[Math.floor(Math.random() * characters.length)]!;
          })
          .join('')
      );

      if (iteration >= text.length) {
        setIsScrambling(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / maxIterations;
    }, speed);
  }, [text, speed, maxIterations, characters, prefersReducedMotion]);

  useEffect(() => {
    if (animateOn === 'mount') {
      startScramble();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [animateOn, startScramble]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover' && !isHovering) {
      setIsHovering(true);
      startScramble();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <span
      className={`decrypted-text ${className} ${isScrambling ? encryptedClassName : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </span>
  );
}
