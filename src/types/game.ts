export type StockId = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Stock {
  id: StockId;
  name: string;
  currentPrice: number;
  volatility: number; // 0 to 1
  history: number[];
}

export type OrderType = 'BUY' | 'SELL';

export interface Order {
  id: string;
  stockId: StockId;
  quantity: number;
  price: number;
  type: OrderType;
  status: 'PENDING' | 'EXECUTED';
  placedAt: number; // timestamp
  executionTime: number; // timestamp (placedAt + 5000)
}

export interface Holding {
  stockId: StockId;
  quantity: number;
  averagePrice: number;
}

export type GameStatus = 'READY' | 'PLAYING' | 'RESULT';

export interface GameState {
  balance: number;
  holdings: Record<StockId, Holding>;
  stocks: Record<StockId, Stock>;
  orders: Order[];
  timer: number;
  gameStatus: GameStatus;
}
