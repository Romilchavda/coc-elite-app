import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, History, Hammer, Menu, X, ExternalLink, RotateCcw } from 'lucide-react';

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

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'History', path: '/history', icon: <History size={20} /> },
    { name: 'Upgrades', path: '/upgrades', icon: <Hammer size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-darkBg text-white font-poppins">
      {/* Mobile Top Bar */}
      <header className="fixed top-0 left-0 w-full h-16 bg-cardBg/80 backdrop-blur-lg border-b border-white/5 flex items-center justify-between px-5 z-40 md:hidden">
        <button onClick={toggleSidebar} className="text-accent p-2 bg-white/5 rounded-lg">
          <Menu />
        </button>
        <span className="font-rajdhani font-bold text-xl italic tracking-tighter text-white">ELITE<span className="text-accent">TRACKER</span></span>
        <div className="w-10"></div>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-cardBg border-r border-white/5 z-[60] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-2xl font-rajdhani font-black italic">ROMIL<span className="text-accent">CHAVDA</span></h1>
            <button onClick={toggleSidebar} className="md:hidden text-gray-500"><X /></button>
          </div>
          
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path} to={link.path} onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-xl font-rajdhani font-bold text-lg tracking-wide transition-all ${location.pathname === link.path ? 'bg-accent/10 text-accent border border-accent/20 shadow-lg shadow-accent/5' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                {link.icon} {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-72 pt-24 md:pt-12 p-5 md:p-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<div className="text-center py-20 text-gray-500 font-rajdhani text-2xl">Archives loading...</div>} />
          <Route path="/upgrades" element={<div className="text-center py-20 text-gray-500 font-rajdhani text-2xl">Upgrade Timers loading...</div>} />
        </Routes>
      </main>
    </div>
  );
}

// --- Dashboard Component ---
function Dashboard() {
  const [leagues, setLeagues] = useState([]);
  const [stats, setStats] = useState(JSON.parse(localStorage.getItem('coc_v4_data')) || {});

  // Fetch leagues.json
  useEffect(() => {
    fetch('/leagues.json')
      .then(res => res.json())
      .then(data => setLeagues(data))
      .catch(err => console.error("Error loading leagues:", err));
  }, []);

  // Initialize stats for new accounts
  useEffect(() => {
    if (leagues.length > 0) {
      let updated = { ...stats };
      let changed = false;
      ACCOUNTS.forEach(acc => {
        if (!updated[acc.id]) {
          updated[acc.id] = { count: 0, leagueId: leagues[0].id };
          changed = true;
        }
      });
      if (changed) {
        setStats(updated);
        localStorage.setItem('coc_v4_data', JSON.stringify(updated));
      }
    }
  }, [leagues]);

  const updateCount = (id, val) => {
    const accountStats = stats[id];
    const league = leagues.find(l => l.id === accountStats.leagueId);
    const maxAtks = league ? league.attacks : 8;

    const newCount = Math.max(0, Math.min(maxAtks, (accountStats.count || 0) + val));
    const newStats = { ...stats, [id]: { ...accountStats, count: newCount } };
    setStats(newStats);
    localStorage.setItem('coc_v4_data', JSON.stringify(newStats));
  };

  const changeLeague = (id, leagueId) => {
    const newStats = { ...stats, [id]: { ...stats[id], leagueId: parseInt(leagueId) } };
    setStats(newStats);
    localStorage.setItem('coc_v4_data', JSON.stringify(newStats));
  };

  const resetAll = () => {
    if (window.confirm("Reset all attack counts for this week?")) {
      const reseted = {};
      Object.keys(stats).forEach(key => {
        reseted[key] = { ...stats[key], count: 0 };
      });
      setStats(reseted);
      localStorage.setItem('coc_v4_data', JSON.stringify(reseted));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Reset */}
      <div className="flex justify-between items-center bg-cardBg border border-white/5 p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-2xl font-rajdhani font-bold text-cyanCustom">Ranked Attacks</h2>
          <p className="text-xs text-gray-500">Track 8 accounts performance</p>
        </div>
        <button onClick={resetAll} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg">
          <RotateCcw size={24} />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {leagues.length > 0 && ACCOUNTS.map((acc) => {
          const userStat = stats[acc.id] || { count: 0, leagueId: leagues[0].id };
          const currentLeague = leagues.find(l => l.id === userStat.leagueId) || leagues[0];
          const progress = (userStat.count / currentLeague.attacks) * 100;

          return (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              key={acc.id} 
              className="bg-cardBg border border-white/5 p-6 rounded-[2.5rem] shadow-2xl relative group hover:border-accent/20 transition-all duration-500"
            >
              {/* Header: League Icon + Name */}
              <div className="flex items-center gap-4 mb-6">
                <img src={currentLeague.iconUrls.small} className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(252,196,25,0.3)]" alt="League" />
                <div className="flex-1">
                  <h3 className="text-lg font-rajdhani font-bold text-accent leading-none mb-1">{acc.name}</h3>
                  <select 
                    value={userStat.leagueId}
                    onChange={(e) => changeLeague(acc.id, e.target.value)}
                    className="bg-black/40 border-none text-[10px] text-gray-400 p-1 rounded-md outline-none cursor-pointer hover:text-white transition-colors"
                  >
                    {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <a 
                  href={`https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${acc.tag}`}
                  target="_blank" rel="noreferrer"
                  className="p-3 bg-white/5 rounded-2xl text-cyanCustom hover:bg-cyanCustom hover:text-black transition-all"
                >
                  <ExternalLink size={18} />
                </a>
              </div>

              {/* Counter UI */}
              <div className="bg-black/20 rounded-[2rem] py-8 text-center mb-6 border border-white/[0.02]">
                <span className="text-7xl font-rajdhani font-black leading-none drop-shadow-lg">{userStat.count}</span>
                <p className="text-[10px] text-gray-500 tracking-[0.4em] uppercase mt-2 font-medium">
                  Battles / {currentLeague.attacks}
                </p>
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                <button 
                  onClick={() => updateCount(acc.id, -1)} 
                  className="flex-1 h-14 bg-white/5 hover:bg-white/10 rounded-2xl text-2xl font-bold transition-all active:scale-90"
                > - </button>
                <button 
                  onClick={() => updateCount(acc.id, 1)} 
                  className="flex-1 h-14 bg-accent text-black rounded-2xl text-3xl font-bold transition-all active:scale-95 shadow-lg shadow-accent/20"
                > + </button>
              </div>

              {/* Tag and Progress */}
              <div className="mt-6">
                <p className="text-center text-[10px] text-gray-600 font-rajdhani tracking-widest mb-3">TAG: #{acc.tag}</p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full ${progress >= 100 ? 'bg-success shadow-[0_0_10px_#20C607]' : 'bg-accent'}`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}