import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ExternalLink } from 'lucide-react';

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
    alert("History Saved!");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-cardBg border border-white/5 p-6 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-rajdhani font-black">WAR ROOM</h2>
        <button onClick={resetAll} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><RotateCcw /></button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {leagues.length > 0 && ACCOUNTS.map(acc => {
          const s = stats[acc.id] || { count: 0, leagueId: leagues[0].id };
          const l = leagues.find(lg => lg.id === s.leagueId) || leagues[0];
          const progress = (s.count / l.attacks) * 100;
          return (
            <motion.div key={acc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-cardBg border border-white/5 p-6 rounded-[2.5rem] shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <img src={l.iconUrls.small} className="w-14 h-14 object-contain" />
                <div className="flex-1">
                  <h3 className="font-bold text-accent font-rajdhani leading-none truncate w-32">{acc.name}</h3>
                  <select value={s.leagueId} onChange={(e) => {
                    const ns = { ...stats, [acc.id]: { ...s, leagueId: parseInt(e.target.value) } };
                    setStats(ns); localStorage.setItem('coc_v4_data', JSON.stringify(ns));
                  }} className="bg-black/40 text-[10px] text-gray-500 p-1 mt-1 rounded-md outline-none w-full">
                    {leagues.map(lg => <option key={lg.id} value={lg.id}>{lg.name}</option>)}
                  </select>
                </div>
                <a href={`https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${acc.tag}`} className="p-2 bg-white/5 rounded-xl text-cyan-400"><ExternalLink size={16} /></a>
              </div>
              <div className="bg-black/20 rounded-3xl py-6 text-center mb-6 border border-white/[0.02]">
                <span className="text-6xl font-rajdhani font-black">{s.count}</span>
                <p className="text-[10px] text-gray-500 tracking-[0.4em] uppercase">Target: {l.attacks}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => updateCount(acc.id, -1)} className="flex-1 h-14 bg-gray-800 rounded-xl text-2xl font-bold transition-all active:scale-90">-</button>
                <button onClick={() => updateCount(acc.id, 1)} className="flex-1 h-14 bg-accent text-black rounded-xl text-3xl font-bold transition-all active:scale-95 shadow-lg shadow-accent/20">+</button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}