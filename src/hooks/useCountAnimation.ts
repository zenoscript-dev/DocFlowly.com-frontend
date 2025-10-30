import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for animated counting with easing
 * @param end - The target number to count to
 * @param duration - Animation duration in milliseconds
 * @param trigger - Whether to trigger the animation
 * @returns The current animated count value
 */
export const useCountAnimation = (
  end: number, 
  duration: number = 1000, 
  trigger: boolean = false
): number => {
  const [count, setCount] = useState(end);
  const countRef = useRef(0);

  useEffect(() => {
    if (!trigger) {
      setCount(end);
      return;
    }

    setCount(0);
    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = easeOutQuart * end;
      
      countRef.current = currentCount;
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, trigger]);

  return count;
};

