import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ExternalLink } from 'lucide-react';

const PLAYER_TAGS = [
  "PLGQLGLRY", "PRGJC80UU", "LL9P29L9Y", "Q28LGU0VC", 
  "QJY928LPY", "QR28JVGJ8", "QGUYP0J0Q", "G8VY8G220"
];

export default function Dashboard() {
  const [leagues, setLeagues] = useState([]);
  const [playerData, setPlayerData] = useState({});
  const [stats, setStats] = useState(JSON.parse(localStorage.getItem('coc_v4_stats')) || {});

  useEffect(() => {
    // 1. Local JSON load karo (Atk Limits ke liye)
    fetch('/leagues.json').then(res => res.json()).then(data => setLeagues(data));

    // 2. Fetch players
    const fetchAll = async () => {
      const results = {};
      for (const tag of PLAYER_TAGS) {
        try {
          const res = await fetch(`/.netlify/functions/fetchPlayer?tag=${tag}`);
          const data = await res.json();
          results[tag] = data;
        } catch (e) { console.error("Error", tag); }
      }
      setPlayerData(results);
    };
    fetchAll();
  }, []);

  const updateCount = (tag, val) => {
    const apiInfo = playerData[tag];
    // Ab leagueTier ki ID se match karenge
    const matched = leagues.find(l => Number(l.id) === Number(apiInfo?.leagueTier?.id));
    const max = matched ? matched.attacks : 8;
    
    const currentCount = stats[tag] || 0;
    const newCount = Math.max(0, Math.min(max, currentCount + val));
    
    const newStats = { ...stats, [tag]: newCount };
    setStats(newStats);
    localStorage.setItem('coc_v4_stats', JSON.stringify(newStats));
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
        {PLAYER_TAGS.map(tag => {
          const apiInfo = playerData[tag];
          if (!apiInfo) return <div key={tag} className="bg-cardBg p-24 rounded-[2.5rem] animate-pulse border border-white/5 text-center text-gray-700 font-rajdhani">SYNCHRONIZING...</div>;

          // --- API RESPONSE SE leagueTier NIKALNA ---
          const tier = apiInfo.leagueTier; 
          
          // leagues.json me se attack limit find karna
          const matchedLeague = leagues.find(l => Number(l.id) === Number(tier?.id));
          const maxAtks = matchedLeague ? matchedLeague.attacks : 8;
          
          // Icon Priority: API ka leagueTier Large Icon -> API ka Small -> Fallback Unranked
          const tierIcon = tier?.iconUrls?.large || tier?.iconUrls?.small || 'https://link.clashofclans.com/static/img/leagues/unranked.png';
          
          const sCount = stats[tag] || 0;

          return (
            <motion.div key={tag} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-cardBg border border-white/5 p-6 rounded-[2.5rem] shadow-2xl relative">
              
              {/* Header Section */}
              <div className="flex items-center gap-4 mb-6">
                <img src={tierIcon} className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(252,196,25,0.4)]" alt="Tier" />
                <div className="flex-1">
                  <h3 className="font-rajdhani font-black text-accent text-xl leading-none uppercase">{apiInfo.name}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-success/10 text-success text-[9px] font-bold px-2 py-0.5 rounded border border-success/20">TH {apiInfo.townHallLevel}</span>
                    <span className="bg-white/5 text-gray-400 text-[9px] font-bold px-2 py-0.5 rounded border border-white/10 uppercase truncate w-24">
                      {tier?.name || 'Unranked'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ammo Clip Progress Bar */}
              <div className="flex gap-1 mb-6 h-4 px-1">
                {Array.from({ length: maxAtks }).map((_, i) => (
                  <div key={i} className={`flex-1 rounded-sm skew-x-[-15deg] transition-all duration-500 ${i < sCount ? 'bg-success shadow-[0_0_12px_#20C607]' : 'bg-orange-500/10 border border-orange-500/20'}`} />
                ))}
              </div>

              {/* Counter Display */}
              <div className="bg-black/40 rounded-3xl py-6 text-center mb-6 border border-white/[0.03]">
                <span className="text-7xl font-rajdhani font-black text-white leading-none">{sCount}</span>
                <p className="text-[10px] text-accent/60 font-bold tracking-[.4em] uppercase mt-2">Captured / {maxAtks}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button onClick={() => updateCount(tag, -1)} className="flex-1 h-14 bg-[#1a202c] hover:bg-gray-800 text-white rounded-2xl text-2xl font-bold active:scale-90 transition-transform">-</button>
                <button onClick={() => updateCount(tag, 1)} className="flex-1 h-14 bg-accent text-black rounded-2xl text-3xl font-bold active:scale-95 transition-transform shadow-lg shadow-accent/20">+</button>
              </div>

              {/* Profile Link */}
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-center">
                <a href={`https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${tag}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-bold text-cyanCustom tracking-widest hover:underline uppercase">
                  <ExternalLink size={12} /> PROFILE: #{tag}
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}