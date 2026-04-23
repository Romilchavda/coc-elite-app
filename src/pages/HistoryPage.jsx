import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords, Shield, Trophy, Medal, Star, Hash } from 'lucide-react';

const PLAYER_TAGS = ["PLGQLGLRY", "PRGJC80UU", "LL9P29L9Y", "Q28LGU0VC", "QJY928LPY", "QR28JVGJ8", "QGUYP0J0Q", "G8VY8G220"];

export default function HistoryPage() {
  const [leagues, setLeagues] = useState([]);
  const [historyData, setHistoryData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/leagues.json').then(res => res.json()).then(data => setLeagues(data));

    const fetchAllHistory = async () => {
      const results = {};
      for (const tag of PLAYER_TAGS) {
        try {
          const res = await fetch(`/.netlify/functions/fetchHistory?tag=${tag}`);
          const data = await res.json();
          results[tag] = data.items || [];
        } catch (e) { console.error("History Error", tag); }
      }
      setHistoryData(results);
      setLoading(false);
    };
    fetchAllHistory();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      <p className="font-rajdhani text-accent tracking-widest animate-pulse">DECODING WAR JOURNALS...</p>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center md:text-left border-l-4 border-accent pl-4">
        <h2 className="text-4xl font-rajdhani font-black tracking-tighter italic">COMBAT<span className="text-accent">ARCHIVES</span></h2>
        <p className="text-gray-500 text-xs uppercase tracking-[0.3em]">Official Ranked Performance History</p>
      </div>

      {PLAYER_TAGS.map(tag => {
        const history = historyData[tag] || [];
        if (history.length === 0) return null;

        return (
          <div key={tag} className="space-y-4">
            {/* Player Sub-Header */}
            <div className="flex items-center gap-3 px-2">
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <span className="font-rajdhani font-bold text-gray-500 tracking-widest text-sm">TAG: #{tag}</span>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.slice(0, 2).map((item, idx) => {
                const league = leagues.find(l => Number(l.id) === Number(item.leagueTierId));
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    key={idx} 
                    className="bg-cardBg border border-white/5 rounded-[2rem] p-6 shadow-xl relative overflow-hidden"
                  >
                    {/* Top Row: Date & Placement */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <img src={league?.iconUrls?.small} className="w-12 h-12 drop-shadow-gold" alt="" />
                        <div>
                          <h4 className="font-rajdhani font-black text-white text-lg leading-none uppercase">{league?.name || "Ranked Season"}</h4>
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">ID: {item.leagueSeasonId}</span>
                        </div>
                      </div>
                      <div className="bg-accent text-black px-3 py-1 rounded-lg flex items-center gap-2">
                         <Medal size={14} />
                         <span className="font-rajdhani font-bold text-sm">#{item.placement}</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Attack Stats */}
                      <div className="bg-black/30 p-4 rounded-2xl border border-white/[0.03]">
                        <div className="flex items-center gap-2 text-accent mb-2">
                          <Swords size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-tighter">Offense</span>
                        </div>
                        <div className="flex justify-between items-end">
                           <span className="text-3xl font-rajdhani font-bold">{item.attackWins}</span>
                           <div className="flex items-center text-success text-xs font-bold">
                              <Star size={12} className="mr-1 fill-success" /> {item.attackStars}
                           </div>
                        </div>
                        <p className="text-[9px] text-gray-600 mt-1 uppercase">Wins / Loss: {item.attackLosses}</p>
                      </div>

                      {/* Defense Stats */}
                      <div className="bg-black/30 p-4 rounded-2xl border border-white/[0.03]">
                        <div className="flex items-center gap-2 text-cyanCustom mb-2">
                          <Shield size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-tighter">Defense</span>
                        </div>
                        <div className="flex justify-between items-end">
                           <span className="text-3xl font-rajdhani font-bold">{item.defenseWins}</span>
                           <div className="flex items-center text-orange-500 text-xs font-bold">
                              <Star size={12} className="mr-1 fill-orange-500" /> {item.defenseStars}
                           </div>
                        </div>
                        <p className="text-[9px] text-gray-600 mt-1 uppercase">Wins / Loss: {item.defenseLosses}</p>
                      </div>
                    </div>

                    {/* Final Trophies Bar */}
                    <div className="mt-6 flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                       <div className="flex items-center gap-2">
                          <Trophy size={14} className="text-accent" />
                          <span className="text-xs font-rajdhani font-bold text-gray-300">FINAL SCORE:</span>
                       </div>
                       <span className="text-sm font-rajdhani font-black text-white">{item.leagueTrophies} TROPHIES</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}