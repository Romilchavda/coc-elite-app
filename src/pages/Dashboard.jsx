import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ACCOUNTS = [
  { id: 1, name: "Romil Chavda-Th17", tag: "PLGQLGLRY" },
  { id: 2, name: "Romil Chavda-Th15", tag: "PRGJC80UU" },
  // ... baki accounts
];

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
  const [playerData, setPlayerData] = useState({}); // API data store hoga
  const [stats, setStats] = useState(JSON.parse(localStorage.getItem('coc_v4_data')) || {});

  useEffect(() => {
    // 1. Pehle local leagues.json load karo
    fetch('/leagues.json').then(res => res.json()).then(data => setLeagues(data));

    // 2. Har account ka data API se lao
    ACCOUNTS.forEach(acc => {
      fetch(`/.netlify/functions/fetchPlayer?tag=${acc.tag}`)
        .then(res => res.json())
        .then(data => {
          setPlayerData(prev => ({ ...prev, [acc.id]: data }));
        });
    });
  }, []);

  const updateCount = (id, val) => {
    // ... wahi purana logic attack count update karne ka
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {leagues.length > 0 && ACCOUNTS.map(acc => {
        const apiInfo = playerData[acc.id]; // API se aaya data
        if (!apiInfo) return <div key={acc.id} className="p-10 bg-cardBg rounded-3xl animate-pulse">Loading API Data...</div>;

        // API se League ID mil gayi, ab hamare JSON me uska data dhoondo
        const currentLeague = leagues.find(l => l.id === apiInfo.league?.id) || leagues[0];
        const s = stats[acc.id] || { count: 0 };
        
        return (
          <motion.div key={acc.id} className="bg-cardBg p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              {/* Dynamic Icon from API selection */}
              <img src={currentLeague.iconUrls.small} className="w-16 h-16 drop-shadow-gold" />
              <div>
                <h3 className="font-rajdhani font-black text-accent text-xl">{apiInfo.name}</h3>
                <p className="text-[10px] text-success font-bold uppercase">TH {apiInfo.townHallLevel} | {currentLeague.name}</p>
              </div>
            </div>

            {/* Segmented Bar with dynamic target from API selection */}
            <div className="flex gap-1 h-3 mb-6">
              {Array.from({ length: currentLeague.attacks }).map((_, i) => (
                <div key={i} className={`flex-1 skew-x-[-15deg] rounded-sm ${i < s.count ? 'bg-success shadow-glow' : 'bg-orange-500/10'}`} />
              ))}
            </div>

            {/* Big Counter */}
            <div className="text-center py-6 bg-black/20 rounded-3xl mb-6">
               <span className="text-7xl font-rajdhani font-black">{s.count}</span>
               <p className="text-[10px] text-gray-500 tracking-widest uppercase">Target: {currentLeague.attacks}</p>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
               <button onClick={() => updateCount(acc.id, -1)} className="flex-1 h-14 bg-gray-800 rounded-xl text-2xl font-bold"> - </button>
               <button onClick={() => updateCount(acc.id, 1)} className="flex-1 h-14 bg-accent text-black rounded-xl text-2xl font-bold"> + </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}