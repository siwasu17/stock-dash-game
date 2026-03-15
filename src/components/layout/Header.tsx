import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Clock, TrendingUp, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { balance, holdings, stocks, timer } = useGameStore();

  const totalAssets = balance + (Object.values(holdings).reduce((acc, h) => {
    return acc + (h.quantity * stocks[h.stockId].currentPrice);
  }, 0));

  const isLowTime = timer < 30;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10">
      {/* Timer Card */}
      <motion.div 
        animate={isLowTime ? { scale: [1, 1.02, 1], borderColor: ['#3f3f46', '#ef4444', '#3f3f46'] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
        className="bg-zinc-900/40 backdrop-blur-xl p-5 rounded-3xl border border-zinc-800 shadow-2xl flex items-center gap-4 group"
      >
        <div className={`p-3 rounded-2xl ${isLowTime ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'} group-hover:scale-110 transition-transform`}>
          <Clock size={24} />
        </div>
        <div>
          <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest leading-none mb-1.5">Market Closes In</p>
          <p className={`text-4xl font-mono font-black ${isLowTime ? 'text-red-500' : 'text-zinc-100'}`}>
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </p>
        </div>
      </motion.div>

      {/* Net Worth Card */}
      <div className="bg-zinc-900/40 backdrop-blur-xl p-5 rounded-3xl border border-zinc-800 shadow-2xl flex items-center gap-4 group">
        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
          <TrendingUp size={24} />
        </div>
        <div className="flex-1">
          <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest leading-none mb-1.5">Net Worth (Equity + Cash)</p>
          <div className="flex items-baseline gap-2">
            <AnimatePresence mode="popLayout">
              <motion.p 
                key={totalAssets}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-mono font-black text-zinc-100"
              >
                ¥{totalAssets.toLocaleString()}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Cash Balance Card */}
      <div className="bg-zinc-900/40 backdrop-blur-xl p-5 rounded-3xl border border-zinc-800 shadow-2xl flex items-center gap-4 group">
        <div className="p-3 rounded-2xl bg-green-500/10 text-green-500 group-hover:scale-110 transition-transform">
          <Wallet size={24} />
        </div>
        <div>
          <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest leading-none mb-1.5">Buying Power (Cash)</p>
          <p className="text-4xl font-mono font-black text-green-400">
            ¥{balance.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
