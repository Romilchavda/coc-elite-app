import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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

export default function WidgetView() {
  const { id } = useParams();
  const [leagues, setLeagues] = useState([]);
  const [stats, setStats] = useState(JSON.parse(localStorage.getItem('coc_v4_data')) || {});

  const account = ACCOUNTS.find(a => a.id === parseInt(id));

  useEffect(() => {
    fetch('/leagues.json').then(res => res.json()).then(data => setLeagues(data));
  }, []);

  if (!account || leagues.length === 0) return <div className="p-10 text-center">Loading Widget...</div>;

  const s = stats[id] || { count: 0, leagueId: leagues[0].id };
  const l = leagues.find(lg => lg.id === s.leagueId) || leagues[0];
  const progress = (s.count / l.attacks) * 100;

  return (
    <div className="min-h-screen bg-darkBg flex items-center justify-center p-4">
      <div className="w-full max-w-[320px] bg-cardBg border-2 border-accent/20 p-6 rounded-[2.5rem] shadow-2xl text-center">
        <img src={l.iconUrls.small} className="w-20 h-20 mx-auto mb-4 drop-shadow-gold" alt="L" />
        <h3 className="font-rajdhani font-black text-xl text-accent uppercase leading-none">{account.name}</h3>
        
        <div className="my-6">
          <span className="text-8xl font-rajdhani font-black text-white">{s.count}</span>
          <p className="text-[10px] text-gray-500 tracking-[0.4em] uppercase mt-2 font-bold">Target: {l.attacks}</p>
        </div>

        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white"
        >
          Tap to Refresh
        </button>
      </div>
    </div>
  );
}