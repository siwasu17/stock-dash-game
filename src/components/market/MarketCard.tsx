import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { StockId } from '../../types/game';
import RealtimeChart from '../RealtimeChart';

interface Props {
  id: StockId;
  color: string;
}

const MarketCard: React.FC<Props> = ({ id, color }) => {
  const stock = useGameStore((state) => state.stocks[id]);
  const placeOrder = useGameStore((state) => state.placeOrder);
  const [prevPrice, setPrevPrice] = useState(stock.currentPrice);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (stock.currentPrice > prevPrice) {
      setFlash('up');
    } else if (stock.currentPrice < prevPrice) {
      setFlash('down');
    }
    setPrevPrice(stock.currentPrice);
    const timer = setTimeout(() => setFlash(null), 500);
    return () => clearTimeout(timer);
  }, [stock.currentPrice]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, borderColor: color }}
      className="bg-zinc-900/60 backdrop-blur-md rounded-3xl border border-zinc-800/50 overflow-hidden flex flex-col group shadow-2xl transition-colors duration-500"
    >
      <div className="p-5 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{stock.name}</span>
            {flash === 'up' && <TrendingUp size={12} className="text-green-500" />}
            {flash === 'down' && <TrendingDown size={12} className="text-red-500" />}
          </div>
          <div className="flex items-baseline gap-2">
            <motion.span 
              key={stock.currentPrice}
              initial={{ scale: 1.1, color: flash === 'up' ? '#22c55e' : flash === 'down' ? '#ef4444' : '#fff' }}
              animate={{ scale: 1, color: '#fff' }}
              className="text-3xl font-mono font-black tracking-tighter"
            >
              ¥{stock.currentPrice.toLocaleString()}
            </motion.span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={() => placeOrder(id, 10, 'BUY')}
            className="relative overflow-hidden bg-white hover:bg-green-500 text-black hover:text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-90 flex items-center gap-1 group/btn"
          >
            <Plus size={14} /> BUY 10
          </button>
          <button 
            onClick={() => placeOrder(id, 10, 'SELL')}
            className="bg-zinc-800 hover:bg-red-500 text-zinc-400 hover:text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-90 flex items-center gap-1"
          >
            <Minus size={14} /> SELL 10
          </button>
        </div>
      </div>

      <div className="h-40 px-2 pb-4">
        <RealtimeChart stockId={id} color={color} />
      </div>

      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-1000" 
        style={{ background: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)` }}
      />
    </motion.div>
  );
};

export default MarketCard;
