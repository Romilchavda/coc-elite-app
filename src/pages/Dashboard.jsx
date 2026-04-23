import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ExternalLink, Sword } from 'lucide-react';

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
    const newCount = Math.max(0, Math.min(league?.attacks || 8, (acc.count || 0) + val));
    const newStats = { ...stats, [id]: { ...acc, count: newCount } };
    setStats(newStats);
    localStorage.setItem('coc_v4_data', JSON.stringify(newStats));
  };

  const resetAll = () => {
    if (!window.confirm("Weekly reset karein?")) return;
    const history = JSON.parse(localStorage.getItem('coc_history')) || [];
    const snapshot = { id: Date.now(), date: new Date().toLocaleDateString('en-GB'), accounts: ACCOUNTS.map(a => {
        const s = stats[a.id] || { count: 0, leagueId: leagues[0].id };
        const l = leagues.find(lg => lg.id === s.leagueId);
        return { name: a.name, count: s.count, target: l.attacks, icon: l.iconUrls.small };
    })};
    localStorage.setItem('coc_history', JSON.stringify([snapshot, ...history]));
    const reseted = { ...stats };
    ACCOUNTS.forEach(a => { if(reseted[a.id]) reseted[a.id].count = 0; });
    setStats(reseted);
    localStorage.setItem('coc_v4_data', JSON.stringify(reseted));
    alert("History Saved & Dashboard Reset!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-cardBg border border-white/5 p-6 rounded-[2rem] shadow-2xl">
        <div>
          <h2 className="text-3xl font-rajdhani font-black tracking-tighter">BATTLE HUB</h2>
          <p className="text-[10px] text-accent font-bold tracking-[.3em] uppercase">Commander on Duty</p>
        </div>
        <button onClick={resetAll} className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90">
          <RotateCcw size={22} />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {leagues.length > 0 && ACCOUNTS.map(acc => {
          const s = stats[acc.id] || { count: 0, leagueId: leagues[0].id };
          const l = leagues.find(lg => lg.id === s.leagueId) || leagues[0];
          
          // Segment logic
          const totalSegments = l.attacks;
          const completedSegments = s.count;

          return (
            <motion.div key={acc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-cardBg border border-white/5 p-8 rounded-[3rem] shadow-xl relative overflow-hidden group">
              <div className="flex items-center gap-5 mb-8">
                <img src={l.iconUrls.small} className="w-16 h-16 object-contain drop-shadow-gold" alt="Icon" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-accent font-rajdhani text-xl leading-none truncate">{acc.name}</h3>
                  <select value={s.leagueId} onChange={(e) => {
                    const ns = { ...stats, [acc.id]: { ...s, leagueId: parseInt(e.target.value) } };
                    setStats(ns); localStorage.setItem('coc_v4_data', JSON.stringify(ns));
                  }} className="bg-black/40 text-[10px] text-gray-500 p-1.5 mt-2 rounded-lg outline-none w-full border border-white/5">
                    {leagues.map(lg => <option key={lg.id} value={lg.id}>{lg.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-black/20 rounded-[2.5rem] py-8 text-center mb-8 border border-white/[0.02]">
                <span className="text-8xl font-rajdhani font-black tracking-tighter">{s.count}</span>
                <p className="text-[10px] text-gray-500 tracking-[0.4em] uppercase mt-1 font-bold">Done / {l.attacks}</p>
              </div>

              {/* Segmented Progress Bar */}
              <div className="flex gap-1.5 mb-8 h-2.5">
                {Array.from({ length: totalSegments }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full transition-all duration-500 ${
                      i < completedSegments 
                      ? 'bg-success shadow-[0_0_10px_#20C607]' // Green if done
                      : 'bg-orange-500/20 border border-orange-500/10' // Light Orange if pending
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => updateCount(acc.id, -1)} className="flex-1 h-16 bg-gray-800/50 hover:bg-gray-800 rounded-2xl text-3xl font-bold transition-all active:scale-90">-</button>
                <button onClick={() => updateCount(acc.id, 1)} className="flex-1 h-16 bg-accent text-black rounded-2xl text-4xl font-bold transition-all active:scale-95 shadow-lg shadow-accent/20">+</button>
              </div>

              <div className="mt-8 flex justify-center">
                <a href={`https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${acc.tag}`} target="_blank" className="flex items-center gap-2 text-[10px] font-bold text-cyanCustom tracking-[0.2em] hover:underline uppercase">
                  <ExternalLink size={12} /> PROFILE: #{acc.tag}
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}