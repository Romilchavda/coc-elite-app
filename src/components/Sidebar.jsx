import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, Swords, X } from 'lucide-react'; // Swords yahan hona chahiye

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={22} /> },
    { name: 'History', path: '/history', icon: <History size={22} /> },
    { name: 'Battle Log', path: '/battlelog', icon: <Swords size={22} /> }, // Naya Link
  ];

  return (
    <aside className={`fixed top-0 left-0 h-full w-72 bg-cardBg border-r border-white/5 z-[60] transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="p-8 flex flex-col h-full">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-rajdhani font-black italic tracking-widest text-white">ROMIL<span className="text-accent">CHAVDA</span></h1>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 hover:text-white"><X /></button>
        </div>
        <nav className="space-y-3 flex-1">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl font-rajdhani font-bold text-lg transition-all ${location.pathname === link.path ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              {link.icon} {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;