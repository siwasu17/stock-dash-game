import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/useGameStore';
import { useGameLoop } from './hooks/useGameLoop';
import { StockId } from './types/game';
import Header from './components/layout/Header';
import MarketCard from './components/market/MarketCard';
import TradingSidebar from './components/trading/TradingSidebar';
import { Play, RotateCcw, Trophy, Target, Zap } from 'lucide-react';

const STOCK_COLORS: Record<StockId, string> = {
  A: '#3b82f6', // Blue
  B: '#ef4444', // Red
  C: '#10b981', // Green
  D: '#f59e0b', // Amber
  E: '#8b5cf6', // Violet
};

const App: React.FC = () => {
  useGameLoop();
  const { 
    balance, 
    stocks, 
    holdings, 
    gameStatus, 
    startGame 
  } = useGameStore();

  const totalAssets = balance + (Object.values(holdings).reduce((acc, h) => {
    return acc + (h.quantity * stocks[h.stockId].currentPrice);
  }, 0));

  const getRank = (assets: number) => {
    if (assets > 2000000) return { name: 'MARKET WHALE', color: 'text-purple-400', icon: <Zap size={48} /> };
    if (assets > 1500000) return { name: 'PROFESSIONAL', color: 'text-blue-400', icon: <Trophy size={48} /> };
    if (assets > 1100000) return { name: 'TRADER', color: 'text-green-400', icon: <Target size={48} /> };
    return { name: 'NOVICE', color: 'text-zinc-500', icon: <RotateCcw size={48} /> };
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <AnimatePresence mode="wait">
        {gameStatus === 'READY' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative flex flex-col items-center justify-center min-h-screen p-8 text-center z-20"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-8xl md:text-9xl font-black mb-2 tracking-tighter italic bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                STOCK DASH
              </h1>
              <p className="text-zinc-500 mb-12 text-lg uppercase tracking-[0.5em] font-light">Precision Trading Simulator</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16 text-left">
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <div className="text-blue-500 mb-4 font-black">01 / REAL-TIME</div>
                  <p className="text-sm text-zinc-400">Monitor 5 volatile stocks with live streaming charts. Every second counts.</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <div className="text-yellow-500 mb-4 font-black">02 / 5S DELAY</div>
                  <p className="text-sm text-zinc-400">Orders take 5 seconds to execute. Predict the future to win big.</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <div className="text-green-500 mb-4 font-black">03 / PROFIT</div>
                  <p className="text-sm text-zinc-400">You have 3 minutes. Turn ¥1M into a fortune to reach Whale status.</p>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(59, 130, 246, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-blue-600 text-white px-16 py-6 rounded-full text-2xl font-black transition-all flex items-center gap-4 mx-auto"
              >
                <Play fill="white" /> INITIATE SESSION
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {gameStatus === 'PLAYING' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 lg:p-8 max-w-[1600px] mx-auto relative z-10"
          >
            <Header />

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3">
                <div className="flex items-center justify-between mb-6 px-2">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Live Market Terminal</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-zinc-500">System Online</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(Object.keys(stocks) as StockId[]).map((id) => (
                    <MarketCard key={id} id={id} color={STOCK_COLORS[id]} />
                  ))}
                  
                  {/* Market Info Placeholder */}
                  <div className="bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800 flex flex-col items-center justify-center p-8 text-zinc-700">
                    <AlertCircle size={40} strokeWidth={1} className="mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">More Stocks Coming Soon</p>
                  </div>
                </div>
              </div>

              <TradingSidebar />
            </div>
          </motion.div>
        )}

        {gameStatus === 'RESULT' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 rounded-[48px] border border-zinc-800 p-12 max-w-xl w-full text-center shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              
              <div className="mb-8 flex justify-center text-blue-500">
                {getRank(totalAssets).icon}
              </div>
              
              <h2 className="text-sm font-black text-zinc-500 uppercase tracking-[0.4em] mb-4">Trading Session Ended</h2>
              
              <div className="mb-12">
                <p className="text-xs text-zinc-500 uppercase font-bold mb-2">Final Net Worth</p>
                <p className="text-7xl font-mono font-black text-white tracking-tighter">¥{totalAssets.toLocaleString()}</p>
              </div>

              <div className="bg-black/50 rounded-3xl p-6 mb-12 border border-zinc-800">
                <p className="text-[10px] text-zinc-500 uppercase font-black mb-2 tracking-widest">Trader Designation</p>
                <p className={`text-3xl font-black ${getRank(totalAssets).color}`}>{getRank(totalAssets).name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="text-left p-4 bg-zinc-800/30 rounded-2xl">
                  <p className="text-[10px] text-zinc-500 font-black uppercase">Profit/Loss</p>
                  <p className={`text-xl font-mono font-black ${totalAssets >= 1000000 ? 'text-green-500' : 'text-red-500'}`}>
                    {totalAssets >= 1000000 ? '+' : ''}¥{(totalAssets - 1000000).toLocaleString()}
                  </p>
                </div>
                <div className="text-left p-4 bg-zinc-800/30 rounded-2xl">
                  <p className="text-[10px] text-zinc-500 font-black uppercase">Performance</p>
                  <p className={`text-xl font-mono font-black ${totalAssets >= 1000000 ? 'text-green-500' : 'text-red-500'}`}>
                    {((totalAssets / 1000000 - 1) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>

              <button 
                onClick={startGame}
                className="w-full bg-white hover:bg-zinc-200 text-black py-5 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
              >
                <RotateCcw size={20} /> New Trading Session
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple utility for layout
const AlertCircle: React.FC<{ size: number, strokeWidth: number, className: string }> = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default App;
