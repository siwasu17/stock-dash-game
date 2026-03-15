import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { GameState, StockId, Order, OrderType, Stock, Holding, GameStatus } from '../types/game';

interface GameActions {
  startGame: () => void;
  placeOrder: (stockId: StockId, quantity: number, type: OrderType) => void;
  executeOrder: (orderId: string) => void;
  updatePrices: () => void;
  tickTimer: () => void;
  setGameStatus: (status: GameStatus) => void;
}

const INITIAL_STOCKS: Record<StockId, Stock> = {
  A: { id: 'A', name: 'Stock A', currentPrice: 1000, volatility: 0.1, history: [1000] },
  B: { id: 'B', name: 'Stock B', currentPrice: 1200, volatility: 0.15, history: [1200] },
  C: { id: 'C', name: 'Stock C', currentPrice: 800, volatility: 0.05, history: [800] },
  D: { id: 'D', name: 'Stock D', currentPrice: 1500, volatility: 0.2, history: [1500] },
  E: { id: 'E', name: 'Stock E', currentPrice: 2000, volatility: 0.1, history: [2000] },
};

const INITIAL_HOLDINGS: Record<StockId, Holding> = {
  A: { stockId: 'A', quantity: 0, averagePrice: 0 },
  B: { stockId: 'B', quantity: 0, averagePrice: 0 },
  C: { stockId: 'C', quantity: 0, averagePrice: 0 },
  D: { stockId: 'D', quantity: 0, averagePrice: 0 },
  E: { stockId: 'E', quantity: 0, averagePrice: 0 },
};

export const useGameStore = create<GameState & GameActions>()(
  subscribeWithSelector((set, get) => ({
    balance: 1000000, // 初期資産: 100万円
    holdings: INITIAL_HOLDINGS,
    stocks: INITIAL_STOCKS,
    orders: [],
    timer: 180, // 3分間
    gameStatus: 'READY',

    startGame: () => set({ gameStatus: 'PLAYING', timer: 180, balance: 1000000, holdings: INITIAL_HOLDINGS, orders: [] }),

    setGameStatus: (gameStatus) => set({ gameStatus }),

    placeOrder: (stockId, quantity, type) => {
      const { stocks, balance } = get();
      const stock = stocks[stockId];
      const price = stock.currentPrice;
      const totalCost = price * quantity;

      if (type === 'BUY' && balance < totalCost) {
        console.warn('Insufficient balance');
        return;
      }

      const now = Date.now();
      const newOrder: Order = {
        id: crypto.randomUUID(),
        stockId,
        quantity,
        price,
        type,
        status: 'PENDING',
        placedAt: now,
        executionTime: now + 5000, // 5秒後に約定
      };

      set((state) => ({
        orders: [...state.orders, newOrder],
        // 購入時は即座に現金を引き落とす（仮押さえ）
        balance: type === 'BUY' ? state.balance - totalCost : state.balance,
      }));
    },

    executeOrder: (orderId) => {
      set((state) => {
        const orderIndex = state.orders.findIndex((o) => o.id === orderId);
        if (orderIndex === -1) return state;

        const order = state.orders[orderIndex];
        const newOrders = [...state.orders];
        newOrders.splice(orderIndex, 1);

        const newHoldings = { ...state.holdings };
        const currentHolding = newHoldings[order.stockId];

        if (order.type === 'BUY') {
          const totalQuantity = currentHolding.quantity + order.quantity;
          const totalCost = (currentHolding.quantity * currentHolding.averagePrice) + (order.quantity * order.price);
          newHoldings[order.stockId] = {
            stockId: order.stockId,
            quantity: totalQuantity,
            averagePrice: totalCost / totalQuantity,
          };
        } else {
          if (currentHolding.quantity < order.quantity) {
            console.error('Not enough holdings to sell');
            return state;
          }
          const totalQuantity = currentHolding.quantity - order.quantity;
          newHoldings[order.stockId] = {
            ...currentHolding,
            quantity: totalQuantity,
          };
          // 売却時は約定時に現金が増える
          return {
            ...state,
            orders: newOrders,
            holdings: newHoldings,
            balance: state.balance + (order.quantity * order.price),
          };
        }

        return {
          ...state,
          orders: newOrders,
          holdings: newHoldings,
        };
      });
    },

    updatePrices: () => {
      set((state) => {
        const newStocks = { ...state.stocks };
        (Object.keys(newStocks) as StockId[]).forEach((id) => {
          const stock = newStocks[id];
          // 簡易的なランダムウォーク (± volatility %)
          const changePercent = (Math.random() - 0.5) * 2 * stock.volatility * 0.05;
          const newPrice = Math.max(1, Math.round(stock.currentPrice * (1 + changePercent)));
          newStocks[id] = {
            ...stock,
            currentPrice: newPrice,
            history: [...stock.history.slice(-100), newPrice], // 直近100件を保持
          };
        });
        return { stocks: newStocks };
      });
    },

    tickTimer: () => {
      set((state) => {
        if (state.timer <= 0) {
          return { gameStatus: 'RESULT', timer: 0 };
        }
        return { timer: state.timer - 1 };
      });
    },
  }))
);
