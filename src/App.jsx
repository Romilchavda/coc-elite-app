import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, History, Hammer, Menu, X, RotateCcw } from 'lucide-react';

// Demo Data
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
    <div class="min-h-screen">
      {/* Mobile Top Bar */}
      <header className="fixed top-0 left-0 w-full h-16 bg-cardBg/80 backdrop-blur-lg border-b border-white/5 flex items-center justify-between px-5 z-40 md:hidden">
        <button onClick={toggleSidebar} className="text-accent p-2 bg-white/5 rounded-lg">
          <Menu />
        </button>
        <span className="font-rajdhani font-bold text-xl italic tracking-tighter">ELITE<span className="text-accent">TRACKER</span></span>
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
            <h1 className="text-3xl font-rajdhani font-black italic">ROMIL<span className="text-accent">CHAVDA</span></h1>
            <button onClick={toggleSidebar} className="md:hidden text-gray-500"><X /></button>
          </div>
          
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-xl font-rajdhani font-bold text-lg tracking-wide transition-all ${location.pathname === link.path ? 'bg-accent/10 text-accent border border-accent/20' : 'text-gray-500 hover:text-white'}`}
              >
                {link.icon} {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-72 pt-20 md:pt-10 p-5 md:p-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<div className="text-center py-20 text-gray-500">History coming soon...</div>} />
          <Route path="/upgrades" element={<div className="text-center py-20 text-gray-500">Upgrades coming soon...</div>} />
        </Routes>
      </main>
    </div>
  );
}

// Sub-Component: Dashboard
function Dashboard() {
  const [counts, setCounts] = useState(JSON.parse(localStorage.getItem('coc_counts')) || {});

  const update = (id, val) => {
    const newCounts = { ...counts, [id]: Math.max(0, (counts[id] || 0) + val) };
    setCounts(newCounts);
    localStorage.setItem('coc_counts', JSON.stringify(newCounts));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {ACCOUNTS.map((acc) => (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          key={acc.id} 
          className="bg-cardBg border border-white/5 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-rajdhani font-bold text-accent">{acc.name}</h3>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase">#{acc.tag}</p>
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-cyanCustom">
               <LayoutDashboard size={20} />
            </div>
          </div>

          <div className="bg-black/20 rounded-3xl py-8 text-center mb-6">
            <span className="text-7xl font-rajdhani font-black leading-none">{counts[acc.id] || 0}</span>
            <p className="text-[10px] text-gray-500 tracking-[0.3em] uppercase mt-2">Attacks Done</p>
          </div>

          <div className="flex gap-4">
            <button onClick={() => update(acc.id, -1)} className="flex-1 h-16 bg-white/5 hover:bg-white/10 rounded-2xl text-2xl font-bold transition-all active:scale-90">-</button>
            <button onClick={() => update(acc.id, 1)} className="flex-1 h-16 bg-accent text-black rounded-2xl text-3xl font-bold transition-all active:scale-95 shadow-lg shadow-accent/20">+</button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}