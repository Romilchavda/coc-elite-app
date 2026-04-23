import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ExternalLink, Target } from 'lucide-react';

const ACCOUNTS = [
  { id: 1, name: "Romil Chavda-Th17", tag: "PLGQLGLRY" },
  { id: 2, name: "Romil Chavda-Th15", tag: "PRGJC80UU" },
  { id: 3, name: "Romil Chavda-Th14", tag: "LL9P29L9Y" },
  { id: 4, name: "Romil Chavda-Th14", tag: "Q28LGU0VC" },
  { id: 5, name: "Romil Chavda-Th13", tag: "QJY928LPY" },
  { id: 6, name: "Romil Chavda-Th12", tag: "QR28JVGJ8" },
  { id: 7, name: "Mittu-Th12", tag: "QGUYP0J0Q" },
  { id: 8, name: "Mittu-Th9", tag: "G8VY8G220" }
];

export default function Dashboard() {
  const [leagues, setLeagues] = useState([]);
  const [stats, setStats] = useState(JSON.parse(localStorage.getItem('coc_v4_data')) || {});

  useEffect(() => {
    fetch('/leagues.json').then(res => res.json()).then(data => setLeagues(data));
  }, []);

  const updateCount = (id, val) => {
    const acc = stats[id] || { count: 0, leagueId: leagues[0]?.id };
    const league = leagues.find(l => l.id === acc.leagueId);
    const max = league?.attacks || 8;
    const newCount = Math.max(0, Math.min(max, (acc.count || 0) + val));
    const newStats = { ...stats, [id]: { ...acc, count: newCount } };
    setStats(newStats);
    localStorage.setItem('coc_v4_data', JSON.stringify(newStats));
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
        {leagues.length > 0 && ACCOUNTS.map(acc => {
          const s = stats[acc.id] || { count: 0, leagueId: leagues[0].id };
          const l = leagues.find(lg => lg.id === s.leagueId) || leagues[0];
          
          return (
            <motion.div key={acc.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-[#11161d] border border-white/5 p-6 rounded-[2.5rem] shadow-2xl relative">
              
              {/* Top Section */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                   <img src={l.iconUrls.small} className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(252,196,25,0.3)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-rajdhani font-bold text-accent text-xl leading-none truncate uppercase tracking-tight">{acc.name}</h3>
                  <select value={s.leagueId} onChange={(e) => {
                    const ns = { ...stats, [acc.id]: { ...s, leagueId: parseInt(e.target.value) } };
                    setStats(ns); localStorage.setItem('coc_v4_data', JSON.stringify(ns));
                  }} className="bg-white/5 text-[10px] text-gray-500 px-2 py-1 mt-2 rounded-md outline-none w-full border border-white/5 appearance-none">
                    {leagues.map(lg => <option key={lg.id} value={lg.id}>{lg.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Ammo-Clip Segmented Progress Bar */}
              <div className="flex gap-1 mt-2 mb-6 h-4 px-1">
                {Array.from({ length: l.attacks }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-sm skew-x-[-15deg] transition-all duration-500 ${
                      i < s.count 
                      ? 'bg-[#22c55e] shadow-[0_0_12px_#22c55e] opacity-100' // Glowing Neon Green
                      : 'bg-orange-500/10 border border-orange-500/20' // Faded Glass Orange
                    }`}
                  />
                ))}
              </div>

              {/* Big Attack Number */}
              <div className="bg-black/40 rounded-3xl py-6 text-center mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
                    <Target size={100} />
                </div>
                <span className="text-8xl font-rajdhani font-black text-white leading-none tracking-tighter">{s.count}</span>
                <p className="text-[10px] text-accent/60 font-bold tracking-[.4em] uppercase mt-2">Captured / {l.attacks}</p>
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                <button onClick={() => updateCount(acc.id, -1)} className="flex-1 h-14 bg-[#1a202c] hover:bg-gray-800 text-white rounded-2xl text-2xl font-bold transition-all active:scale-90">-</button>
                <button onClick={() => updateCount(acc.id, 1)} className="flex-1 h-14 bg-accent text-black rounded-2xl text-4xl font-bold transition-all active:scale-95 shadow-lg shadow-accent/20">+</button>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                 <a href={`https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${acc.tag}`} target="_blank" className="bg-white/5 p-3 rounded-xl text-cyan-400 hover:text-white transition-colors">
                    <ExternalLink size={18} />
                 </a>
                 <div className="text-right">
                    <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Identity</p>
                    <p className="text-[11px] font-rajdhani text-gray-300 font-bold">#{acc.tag}</p>
                 </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}