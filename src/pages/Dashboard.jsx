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
    try {
      // 1. Fetch Leagues Limits
      const lRes = await fetch(`/leagues.json?t=${Date.now()}`);
      const lData = await lRes.json();
      setLeagues(lData);

      // 2. Parallel Fetch Players from API
      const fetchPromises = PLAYER_TAGS.map(tag => 
        fetch(`/.netlify/functions/fetchPlayer?tag=${tag}&t=${Date.now()}`)
          .then(res => res.json())
          .catch(() => null)
      );

      const results = await Promise.all(fetchPromises);
      const newPlayerData = {};
      
      PLAYER_TAGS.forEach((tag, index) => {
        if (results[index]) {
          newPlayerData[tag] = results[index];
        }
      });

      setPlayerData(newPlayerData);
    } catch (e) {
      console.error("Load Error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-10 px-2">
      {/* Header */}
      <div className="flex justify-between items-center bg-cardBg border border-white/5 p-6 rounded-[2rem] shadow-xl">
        <div>
          <h2 className="text-2xl font-rajdhani font-black italic">LIVE<span className="text-accent">TRACKER</span></h2>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">Real-time API Sync</p>
        </div>
        <button 
          onClick={fetchAllData} 
          className={`p-3 bg-white/5 text-accent rounded-xl ${loading ? 'animate-spin' : 'active:scale-90'}`}
        >
          <RotateCcw size={20}/>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {PLAYER_TAGS.map(tag => {
          const apiInfo = playerData[tag];

          // Loading State for individual card
          if (!apiInfo) return (
            <div key={tag} className="bg-cardBg p-24 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center gap-4">
               <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
               <p className="font-rajdhani text-gray-600 text-sm uppercase">Syncing...</p>
            </div>
          );

          // Data extracted from API
          const tier = apiInfo.leagueTier || apiInfo.league;
          const matchedLeague = leagues.find(l => Number(l.id) === Number(tier?.id));
          const targetAtks = matchedLeague ? matchedLeague.attacks : 8;
          
          const currentAttacks = apiInfo.attackWins || 0;
          const currentDefenses = apiInfo.defenseWins || 0;
          const progress = Math.min(100, (currentAttacks / targetAtks) * 100);

          return (
            <motion.div key={tag} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-cardBg border border-white/5 p-6 rounded-[2.5rem] shadow-2xl relative">
              
              {/* Profile */}
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={tier?.iconUrls?.large || tier?.iconUrls?.small || 'https://link.clashofclans.com/static/img/leagues/unranked.png'} 
                  className="w-16 h-16 object-contain drop-shadow-gold" 
                  alt="L" 
                />
                <div className="flex-1 truncate">
                  <h3 className="font-rajdhani font-black text-accent text-xl leading-none uppercase truncate">{apiInfo.name}</h3>
                  <div className="flex gap-2 mt-1.5">
                    <span className="bg-success/10 text-success text-[9px] font-bold px-2 py-0.5 rounded border border-success/20">TH {apiInfo.townHallLevel}</span>
                    <span className="bg-white/5 text-gray-400 text-[9px] font-bold px-2 py-0.5 rounded border border-white/10 uppercase">{tier?.name || 'Unranked'}</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
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

              {/* Line Progress Bar */}
              <div className="mb-6 px-1">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tournament Progress</span>
                  <span className="text-xs font-rajdhani font-bold text-success">{currentAttacks} / {targetAtks}</span>
                </div>
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-success shadow-[0_0_10px_#20C607]' : 'bg-accent'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center px-1">
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Current Trophies</span>
                  <span className="text-xs font-rajdhani font-bold text-white">🏆 {apiInfo.trophies}</span>
                </div>
                <a href={`https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${tag}`} target="_blank" className="bg-accent/10 p-2.5 rounded-xl text-accent active:scale-90 transition-all">
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