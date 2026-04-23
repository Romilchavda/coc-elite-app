import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';
import BattleLog from './pages/BattleLog'; // Ise check karo, ye missing hoga

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-darkBg text-white selection:bg-accent/30">
      {/* Mobile Bar */}
      <header className="fixed top-0 left-0 w-full h-16 bg-cardBg/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-5 z-40 md:hidden">
        <button onClick={() => setIsOpen(true)} className="text-accent p-2 bg-white/5 rounded-lg active:scale-90 transition-transform">
          <Menu />
        </button>
        <span className="font-rajdhani font-bold italic text-xl uppercase tracking-tighter text-white">ELITE<span className="text-accent">TRACKER</span></span>
        <div className="w-8"></div>
      </header>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <main className="md:ml-72 pt-24 md:pt-12 p-5 md:p-10 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/battlelog" element={<BattleLog />} />
        </Routes>
      </main>
    </div>
  );
}