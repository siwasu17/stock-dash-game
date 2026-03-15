import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export const useGameLoop = () => {
  const { gameStatus, tickTimer, updatePrices, executeOrder } = useGameStore();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameStatus === 'PLAYING') {
      timerRef.current = window.setInterval(() => {
        // 1. タイマー更新
        tickTimer();
        // 2. 株価更新 (Phase 1では1秒ごと)
        updatePrices();
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus, tickTimer, updatePrices]);

  // 約定の監視 (100ms単位で細かくチェック)
  useEffect(() => {
    let orderInterval: number | null = null;

    if (gameStatus === 'PLAYING') {
      orderInterval = window.setInterval(() => {
        const now = Date.now();
        const pendingOrders = useGameStore.getState().orders;
        
        pendingOrders.forEach((order) => {
          if (now >= order.executionTime) {
            executeOrder(order.id);
          }
        });
      }, 100);
    }

    return () => {
      if (orderInterval) clearInterval(orderInterval);
    };
  }, [gameStatus, executeOrder]);
};
