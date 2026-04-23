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
  const [playerData, setPlayerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(JSON.parse(localStorage.getItem('coc_v4_data')) || {});

  useEffect(() => {
    // 1. Load Local Leagues JSON
    fetch('/leagues.json').then(res => res.json()).then(data => setLeagues(data));

    // 2. Fetch all players from Proxy API
    const fetchAll = async () => {
      const results = {};
      for (const acc of ACCOUNTS) {
        try {
          const res = await fetch(`/.netlify/functions/fetchPlayer?tag=${acc.tag}`);
          const data = await res.json();
          results[acc.id] = data;
        } catch (e) { console.error("Error fetching", acc.tag); }
      }
      setPlayerData(results);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const updateCount = (id, val) => {
    const apiInfo = playerData[id];
    const currentLeague = leagues.find(l => l.id === apiInfo?.league?.id) || leagues[0];
    const max = currentLeague?.attacks || 8;

    const currentStats = stats[id] || { count: 0 };
    const newCount = Math.max(0, Math.min(max, (currentStats.count || 0) + val));
    
    const newStats = { ...stats, [id]: { ...currentStats, count: newCount } };
    setStats(newStats);
    localStorage.setItem('coc_v4_data', JSON.stringify(newStats));
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {ACCOUNTS.map(acc => {
          const apiInfo = playerData[acc.id];
          if (!apiInfo) return (
            <div key={acc.id} className="bg-cardBg p-10 rounded-[2.5rem] animate-pulse border border-white/5 text-center text-gray-500 font-rajdhani">
              FETCHING CLASH DATA...
            </div>
          );

          const currentLeague = leagues.find(l => l.id === apiInfo.league?.id) || leagues[0];
          const s = stats[acc.id] || { count: 0 };

          return (
            <motion.div key={acc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-cardBg border border-white/5 p-6 rounded-[2.5rem] shadow-2xl relative">
              
              {/* Header: Icon + Info */}
              <div className="flex items-center gap-4 mb-6">
                <img src={currentLeague.iconUrls.small} className="w-16 h-16 object-contain drop-shadow-gold" />
                <div className="flex-1">
                  <h3 className="font-rajdhani font-black text-accent text-xl leading-none truncate uppercase">{apiInfo.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-success/10 text-success text-[9px] font-bold px-2 py-0.5 rounded border border-success/20 uppercase">TH {apiInfo.townHallLevel}</span>
                    <span className="bg-white/5 text-gray-400 text-[9px] font-bold px-2 py-0.5 rounded border border-white/10 uppercase">{currentLeague.name}</span>
                  </div>
                </div>
              </div>

              {/* Cyberpunk Ammo-Clip Progress Bar */}
              <div className="flex gap-1 mb-6 h-4 px-1">
                {Array.from({ length: currentLeague.attacks }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-sm skew-x-[-15deg] transition-all duration-500 ${
                      i < s.count 
                      ? 'bg-success shadow-[0_0_12px_#20C607]' 
                      : 'bg-orange-500/10 border border-orange-500/20' 
                    }`}
                  />
                ))}
              </div>

              {/* Counter View */}
              <div className="bg-black/40 rounded-3xl py-6 text-center mb-6 border border-white/[0.03]">
                <span className="text-7xl font-rajdhani font-black text-white">{s.count}</span>
                <p className="text-[10px] text-accent/60 font-bold tracking-[.4em] uppercase mt-2">BATTLES DONE</p>
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                <button onClick={() => updateCount(acc.id, -1)} className="flex-1 h-14 bg-white/5 hover:bg-white/10 rounded-2xl text-2xl font-bold"> - </button>
                <button onClick={() => updateCount(acc.id, 1)} className="flex-1 h-14 bg-accent text-black rounded-2xl text-3xl font-bold"> + </button>
              </div>

              {/* Profile Link */}
              <div className="mt-6 flex justify-center border-t border-white/5 pt-4">
                <a href={`https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${acc.tag}`} target="_blank" className="flex items-center gap-2 text-[10px] font-bold text-cyanCustom tracking-widest hover:underline uppercase">
                  <ExternalLink size={12} /> VISIT: #{acc.tag}
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}