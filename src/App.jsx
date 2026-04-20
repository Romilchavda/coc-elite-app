import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ACCOUNTS = [
  { id: 1, name: "Romil Chavda-Th17", tag: "PLGQLGLRY" },
  { id: 2, name: "Romil Chavda-Th15", tag: "PRGJC80UU" }
];

export default function App() {
  const [stats, setStats] = useState(JSON.parse(localStorage.getItem('coc_v4')) || {});

  const updateCount = (id, val) => {
    const newStats = { ...stats, [id]: (stats[id] || 0) + val };
    setStats(newStats);
    localStorage.setItem('coc_v4', JSON.stringify(newStats));
  };

  return (
    <div className="min-h-screen bg-darkBg text-white font-poppins p-4">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-cardBg p-4 rounded-2xl border border-white/5 mb-8 shadow-2xl">
        <h1 className="text-2xl font-rajdhani font-bold italic">ELITE<span className="text-accent">TRACKER</span></h1>
        <button className="bg-red-500 px-4 py-2 rounded-lg font-rajdhani font-bold text-sm">RESET</button>
      </nav>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACCOUNTS.map(acc => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-cardBg border border-white/5 p-6 rounded-[2rem] shadow-xl relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
               <h3 className="text-accent font-rajdhani text-xl font-bold">{acc.name}</h3>
               <span className="text-xs text-gray-500">#{acc.tag}</span>
            </div>

            <div className="text-center my-8">
              <span className="text-7xl font-rajdhani font-black block leading-none">{stats[acc.id] || 0}</span>
              <span className="text-[0.6rem] tracking-[0.3em] text-gray-500 uppercase mt-2 block">Battles Completed</span>
            </div>

            <div className="flex gap-4">
              <button onClick={() => updateCount(acc.id, -1)} className="flex-1 h-14 bg-gray-800 rounded-xl text-2xl font-bold active:scale-90 transition-transform"> - </button>
              <button onClick={() => updateCount(acc.id, 1)} className="flex-1 h-14 bg-accent text-black rounded-xl text-2xl font-bold active:scale-90 transition-transform"> + </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}