import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ExternalLink, ShieldCheck, Sword } from 'lucide-react';

const PLAYER_TAGS = [
  "PLGQLGLRY", "PRGJC80UU", "LL9P29L9Y", "Q28LGU0VC", 
  "QJY928LPY", "QR28JVGJ8", "QGUYP0J0Q", "G8VY8G220"
];

export default function Dashboard() {
  const [leagues, setLeagues] = useState([]);
  const [playerData, setPlayerData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    // 1. Local JSON load karna
    try {
      const lRes = await fetch('/leagues.json');
      const lData = await lRes.json();
      setLeagues(lData);
    } catch (e) { console.error("JSON Error"); }

    // 2. API se Live Data lana
    const results = {};
    for (const tag of PLAYER_TAGS) {
      try {
        const res = await fetch(`/.netlify/functions/fetchPlayer?tag=${tag}`);
        const data = await res.json();
        results[tag] = data;
      } catch (e) { console.error("API Error", tag); }
    }
    setPlayerData(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="space-y-8 pb-10 px-2">
      {/* Header with Manual Refresh */}
      <div className="flex justify-between items-center bg-cardBg border border-white/5 p-6 rounded-[2rem] shadow-xl">
        <div>
          <h2 className="text-2xl font-rajdhani font-black tracking-tighter italic">LIVE<span className="text-accent">TRACKER</span></h2>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Real-time API Sync</p>
        </div>
        <button 
          onClick={fetchAllData} 
          className={`p-3 bg-white/5 text-accent rounded-xl transition-all ${loading ? 'animate-spin' : 'active:scale-90'}`}
        >
          <RotateCcw size={20}/>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {PLAYER_TAGS.map(tag => {
          const apiInfo = playerData[tag];
          if (!apiInfo) return (
            <div key={tag} className="bg-cardBg p-24 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center gap-4">
               <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
               <p className="font-rajdhani text-gray-600 text-sm uppercase">Loading Soldier...</p>
            </div>
          );

          // League and Stats calculation
          const tier = apiInfo.leagueTier || apiInfo.league;
          const matchedLeague = leagues.find(l => Number(l.id) === Number(tier?.id));
          const targetAtks = matchedLeague ? matchedLeague.attacks : 8;
          
          // API counts
          const currentAttacks = apiInfo.attackWins || 0;
          const currentDefenses = apiInfo.defenseWins || 0;
          
          // Progress bar percentage (season wins vs tournament target)
          const progress = Math.min(100, (currentAttacks / targetAtks) * 100);

          return (
            <motion.div key={tag} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-cardBg border border-white/5 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={tier?.iconUrls?.large || tier?.iconUrls?.small || 'https://link.clashofclans.com/static/img/leagues/unranked.png'} 
                  className="w-16 h-16 object-contain drop-shadow-gold" 
                  alt="League" 
                />
                <div className="flex-1 truncate">
                  <h3 className="font-rajdhani font-black text-accent text-xl leading-none uppercase truncate">{apiInfo.name}</h3>
                  <div className="flex gap-2 mt-1.5">
                    <span className="bg-success/10 text-success text-[9px] font-bold px-2 py-0.5 rounded border border-success/20">TH {apiInfo.townHallLevel}</span>
                    <span className="bg-white/5 text-gray-400 text-[9px] font-bold px-2 py-0.5 rounded border border-white/10 uppercase">{tier?.name || 'Unranked'}</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid: Attack vs Defense */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/30 p-4 rounded-2xl border border-white/[0.03] text-center">
                  <Sword size={16} className="mx-auto mb-1 text-accent" />
                  <span className="text-3xl font-rajdhani font-black text-white">{currentAttacks}</span>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Attack Wins</p>
                </div>
                <div className="bg-black/30 p-4 rounded-2xl border border-white/[0.03] text-center">
                  <ShieldCheck size={16} className="mx-auto mb-1 text-cyanCustom" />
                  <span className="text-3xl font-rajdhani font-black text-white">{currentDefenses}</span>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Defenses</p>
                </div>
              </div>

              {/* Simple Line Progress Bar */}
              <div className="mb-6 px-1">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tournament Progress</span>
                  <span className="text-xs font-rajdhani font-bold text-success">{currentAttacks} / {targetAtks}</span>
                </div>
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full rounded-full transition-all duration-1000 ${
                      progress >= 100 ? 'bg-success shadow-[0_0_10px_#20C607]' : 'bg-accent'
                    }`}
                  />
                </div>
              </div>

              {/* Identity & Link */}
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center px-1">
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Current Trophies</span>
                  <span className="text-xs font-rajdhani font-bold text-white">🏆 {apiInfo.trophies}</span>
                </div>
                <a 
                  href={`https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${tag}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-accent/10 p-2.5 rounded-xl text-accent hover:bg-accent hover:text-black transition-all"
                >
                  <ExternalLink size={16} />
                </a>
              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}