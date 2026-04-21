import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';
import WidgetsPage from './pages/WidgetsPage';
import WidgetView from './pages/WidgetView';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Widget view me sidebar/header nahi dikhana hai
  const isWidget = location.pathname.startsWith('/widget/');

  return (
    <div className="min-h-screen bg-darkBg text-white">
      {!isWidget && (
        <>
          <header className="fixed top-0 left-0 w-full h-16 bg-cardBg/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-5 z-40 md:hidden">
            <button onClick={() => setIsOpen(true)} className="text-accent p-2 bg-white/5 rounded-lg"><Menu /></button>
            <span className="font-rajdhani font-bold italic uppercase tracking-tighter">ELITE<span className="text-accent">TRACKER</span></span>
            <div className="w-8"></div>
          </header>
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
      )}

      <main className={`${!isWidget ? 'md:ml-72 pt-24 md:pt-12 p-5 md:p-10 max-w-7xl mx-auto' : ''}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/widgets" element={<WidgetsPage />} />
          <Route path="/widget/:id" element={<WidgetView />} />
        </Routes>
      </main>
    </div>
  );
}