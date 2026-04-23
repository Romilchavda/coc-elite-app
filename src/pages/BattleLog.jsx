import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Shield, Star, Zap, Coins, Droplet, ExternalLink } from 'lucide-react';

const PLAYER_TAGS = [
  { name: "Account 1", tag: "PLGQLGLRY" },
  { name: "Account 2", tag: "PRGJC80UU" },
  { name: "Account 3", tag: "LL9P29L9Y" },
  { name: "Account 4", tag: "Q28LGU0VC" },
  { name: "Account 5", tag: "QJY928LPY" },
  { name: "Account 6", tag: "QR28JVGJ8" },
  { name: "Account 7", tag: "QGUYP0J0Q" },
  { name: "Account 8", tag: "G8VY8G220" }
];

export default function BattleLog() {
  const [activeTab, setActiveTab] = useState(PLAYER_TAGS[0].tag);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (tag) => {
    setLoading(true);
    try {
      const res = await fetch(`/.netlify/functions/fetchBattleLog?tag=${tag}`);
      const data = await res.json();
      setLogs(data.items || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs(activeTab);
  }, [activeTab]);

  return (
    <div className="space-y-8 pb-20">
      <div className="border-l-4 border-cyanCustom pl-4">
        <h2 className="text-3xl font-rajdhani font-black tracking-tighter italic">BATTLE<span className="text-cyanCustom">LOGS</span></h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em]">Recent Multiplayer & War Actions</p>
      </div>

      {/* Account Selector (Horizontal Scroll on Mobile) */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {PLAYER_TAGS.map((acc) => (
          <button
            key={acc.tag}
            onClick={() => setActiveTab(acc.tag)}
            className={`flex-shrink-0 px-6 py-2 rounded-xl font-rajdhani font-bold text-sm transition-all ${activeTab === acc.tag ? 'bg-cyanCustom text-black' : 'bg-cardBg text-gray-500 border border-white/5'}`}
          >
            {acc.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="py-20 text-center animate-pulse font-rajdhani text-gray-500">ACCESSING ENEMY INTEL...</div>
        ) : (
          logs.map((battle, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              key={idx}
              className="bg-cardBg border border-white/5 p-5 rounded-[1.5rem] shadow-xl relative flex flex-col md:flex-row gap-6 items-center"
            >
              {/* Attack/Defense Badge */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${battle.attack ? 'bg-accent/10 text-accent' : 'bg-cyanCustom/10 text-cyanCustom'}`}>
                {battle.attack ? <Swords size={24} /> : <Shield size={24} />}
              </div>

              {/* Stars & Percentage */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} size={18} className={`${i < battle.stars ? 'text-accent fill-accent' : 'text-gray-800'}`} />
                  ))}
                  <span className="ml-3 font-rajdhani font-black text-2xl">{battle.destructionPercentage}%</span>
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Opponent: <span className="text-gray-300">{battle.opponentPlayerTag}</span>
                </p>
              </div>

              {/* Resources Looted */}
              <div className="flex gap-4 bg-black/20 p-3 rounded-2xl border border-white/[0.03]">
                {battle.lootedResources?.map((res, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {res.name === 'Gold' && <Coins size={14} className="text-yellow-500" />}
                    {res.name === 'Elixir' && <Droplet size={14} className="text-pink-500" />}
                    {res.name === 'DarkElixir' && <Zap size={14} className="text-purple-500" />}
                    <span className="font-rajdhani font-bold text-sm">{res.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* View Profile */}
              <a 
                href={`https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${battle.opponentPlayerTag.replace('#', '')}`}
                target="_blank" rel="noreferrer"
                className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-accent transition-all"
              >
                <ExternalLink size={18} />
              </a>
            </motion.div>
          ))
        )}
        {!loading && logs.length === 0 && <p className="text-center py-10 text-gray-600">No battle logs available for this account.</p>}
      </div>
    </div>
  );
}