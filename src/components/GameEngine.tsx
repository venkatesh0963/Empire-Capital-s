'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export function GameEngine() {
  const { time, advanceDay, recalculateNetWorth } = useGameStore();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!time.isPaused) {
      const tickRate = 1000 / time.speed;
      
      timer = setInterval(() => {
        advanceDay();
        recalculateNetWorth(); 
      }, tickRate);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [time.isPaused, time.speed, advanceDay, recalculateNetWorth]);

  return null;
}
