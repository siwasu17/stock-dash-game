import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Briefcase, Clock9, AlertCircle, ArrowRight } from 'lucide-react';

const TradingSidebar: React.FC = () => {
  const { holdings, orders, stocks } = useGameStore();

  return (
    <div className="space-y-6">
      {/* Portfolio Section */}
      <div className="bg-zinc-900/60 backdrop-blur-md rounded-[32px] border border-zinc-800/50 p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-6 text-zinc-400">
          <Briefcase size={16} />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Portfolio</h2>
        </div>

        <div className="space-y-4">
          {(Object.values(holdings)).filter(h => h.quantity > 0).length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
              <AlertCircle size={32} strokeWidth={1} className="mb-2 opacity-20" />
              <p className="text-xs uppercase font-bold tracking-widest opacity-40">No Assets Found</p>
            </div>
          )}
          
          <AnimatePresence>
            {(Object.values(holdings)).map((h) => {
              if (h.quantity === 0) return null;
              const currentStock = stocks[h.stockId];
              const profit = (currentStock.currentPrice - h.averagePrice) * h.quantity;
              const profitPercent = ((currentStock.currentPrice / h.averagePrice) - 1) * 100;

              return (
                <motion.div 
                  key={h.stockId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-zinc-800/30 rounded-2xl p-4 border border-zinc-700/30 flex justify-between items-center group hover:border-zinc-500/50 transition-colors"
                >
                  <div>
                    <div className="text-xs font-black text-white mb-0.5">{currentStock.name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {h.quantity} UNITS @ ¥{Math.round(h.averagePrice).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-mono font-black ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {profit >= 0 ? '+' : ''}¥{profit.toLocaleString()}
                    </div>
                    <div className={`text-[10px] font-mono ${profit >= 0 ? 'text-green-500/50' : 'text-red-500/50'}`}>
                      {profitPercent.toFixed(1)}%
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-zinc-900/60 backdrop-blur-md rounded-[32px] border border-dashed border-yellow-500/20 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6 text-yellow-500/50">
          <Clock9 size={16} />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Live Orders (5s Lag)</h2>
        </div>

        <div className="space-y-3">
          {orders.length === 0 && (
            <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest text-center py-4">No Active Orders</p>
          )}
          <AnimatePresence>
            {orders.map((order) => {
              const progress = Math.max(0, 100 - ((order.executionTime - Date.now()) / 5000 * 100));
              return (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-black/40 rounded-2xl p-4 border border-zinc-800 relative overflow-hidden group shadow-lg"
                >
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="absolute left-0 bottom-0 h-1 bg-yellow-500/20"
                  />
                  
                  <div className="relative z-10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[8px] font-black ${order.type === 'BUY' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {order.type}
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-white">{stocks[order.stockId].name} x {order.quantity}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">@ ¥{order.price.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-black text-yellow-500">
                        {Math.max(0, ((order.executionTime - Date.now()) / 1000)).toFixed(1)}S
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TradingSidebar;
