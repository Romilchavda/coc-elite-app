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
    // 1. Pehle local leagues.json load karo (is me Tier Icons [I, II, III] ke links hain)
    fetch('/leagues.json')
      .then(res => res.json())
      .then(data => setLeagues(data))
      .catch(err => console.error("JSON error:", err));

    // 2. Players ka data fetch karo
    const fetchAll = async () => {
      const results = {};
      for (const tag of PLAYER_TAGS) {
        try {
          const res = await fetch(`/.netlify/functions/fetchPlayer?tag=${tag}`);
          const data = await res.json();
          results[tag] = data;
        } catch (e) { console.error("Fetch error for", tag); }
      }
      setPlayerData(results);
    };
    fetchAll();
  }, []);

  const updateCount = (tag, val) => {
    const apiInfo = playerData[tag];
    const matched = leagues.find(l => Number(l.id) === Number(apiInfo?.league?.id));
    const max = matched ? matched.attacks : 8;
    const currentCount = stats[tag] || 0;
    const newCount = Math.max(0, Math.min(max, currentCount + val));
    setStats(prev => {
      const updated = { ...prev, [tag]: newCount };
      localStorage.setItem('coc_v4_stats', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {PLAYER_TAGS.map(tag => {
          const apiInfo = playerData[tag];
          if (!apiInfo) return <div key={tag} className="bg-cardBg p-20 rounded-[2.5rem] animate-pulse text-center text-gray-700 font-rajdhani">FETCHING DATA...</div>;

          // --- IMPORTANT: TIER ICON MATCHING ---
          // Hum API se aane wali League ID ko apne leagues.json me dhoondhenge
          const matchedLeague = leagues.find(l => Number(l.id) === Number(apiInfo.league?.id));
          
          // Agar hamare JSON me wo ID mili (jis me Tier I, II, III wale links hain), toh wo dikhao.
          // Warna API ka normal icon fallback me use karo.
          const tierIcon = matchedLeague?.iconUrls?.small || apiInfo.league?.iconUrls?.small || 'https://link.clashofclans.com/static/img/leagues/unranked.png';
          
          const maxAtks = matchedLeague ? matchedLeague.attacks : 8;
          const currentCount = stats[tag] || 0;

          return (
            <motion.div key={tag} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-cardBg border border-white/5 p-6 rounded-[2.5rem] shadow-2xl relative">
              
              <div className="flex items-center gap-4 mb-6">
                {/* Yahan ab Tier specific icon (I, II, III wala) dikhega */}
                <img src={tierIcon} className="w-16 h-16 object-contain drop-shadow-gold" alt="Tier Icon" />
                <div className="flex-1">
                  <h3 className="font-rajdhani font-black text-accent text-xl leading-none uppercase">{apiInfo.name}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded border border-success/20">TH {apiInfo.townHallLevel}</span>
                    <span className="bg-white/5 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded border border-white/10 uppercase">
                      {apiInfo.league?.name || 'Unranked'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Counter (Aapka purana stylish code) */}
              <div className="flex gap-1 mb-6 h-4 px-1">
                {Array.from({ length: maxAtks }).map((_, i) => (
                  <div key={i} className={`flex-1 rounded-sm skew-x-[-15deg] transition-all duration-500 ${i < currentCount ? 'bg-success shadow-[0_0_12px_#20C607]' : 'bg-orange-500/10 border border-orange-500/20'}`} />
                ))}
              </div>

              <div className="bg-black/40 rounded-3xl py-6 text-center mb-6 border border-white/[0.03]">
                <span className="text-7xl font-rajdhani font-black text-white">{currentCount}</span>
                <p className="text-[10px] text-accent/60 font-bold tracking-[.4em] uppercase mt-2">BATTLES DONE</p>
              </div>

              <div className="flex gap-4">
                <button onClick={() => updateCount(tag, -1)} className="flex-1 h-14 bg-white/5 hover:bg-white/10 rounded-2xl text-2xl font-bold"> - </button>
                <button onClick={() => updateCount(tag, 1)} className="flex-1 h-14 bg-accent text-black rounded-2xl text-3xl font-bold"> + </button>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex justify-center">
                <a href={`https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${tag}`} target="_blank" className="flex items-center gap-2 text-[10px] font-bold text-cyanCustom tracking-widest hover:underline uppercase">
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