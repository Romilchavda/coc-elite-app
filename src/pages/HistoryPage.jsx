import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Trash2 } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem('coc_history')) || []);

  const exportJSON = () => {
    const data = { stats: JSON.parse(localStorage.getItem('coc_v4_data')), history, upgrades: JSON.parse(localStorage.getItem('coc_upgrades')) };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Elite_Backup.json`;
    link.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-cardBg border border-white/5 p-6 rounded-3xl">
        <h2 className="text-2xl font-rajdhani font-black italic">ARCHIVES</h2>
        <div className="flex gap-2">
          <button onClick={exportJSON} className="p-3 bg-accent text-black rounded-xl"><Download size={20}/></button>
          <button onClick={() => document.getElementById('fIn').click()} className="p-3 bg-white/5 rounded-xl"><Upload size={20}/></button>
          <input type="file" id="fIn" hidden onChange={(e) => {
             const reader = new FileReader();
             reader.onload = (ev) => {
               const d = JSON.parse(ev.target.result);
               if(d.history) { localStorage.setItem('coc_history', JSON.stringify(d.history)); setHistory(d.history); }
               alert("Restored!");
             };
             reader.readAsText(e.target.files[0]);
          }}/>
        </div>
      </div>
      <div className="grid gap-6">
        {history.map(entry => (
          <motion.div key={entry.id} className="bg-cardBg border border-white/5 rounded-3xl p-6">
            <div className="flex justify-between mb-4 border-b border-white/5 pb-2">
              <span className="font-bold text-gray-500 uppercase">Week: {entry.date}</span>
              <Trash2 className="text-red-500 cursor-pointer" size={18} onClick={() => {
                const nh = history.filter(h => h.id !== entry.id);
                setHistory(nh); localStorage.setItem('coc_history', JSON.stringify(nh));
              }} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {entry.accounts.map((a, i) => (
                <div key={i} className="flex items-center gap-2 bg-black/20 p-3 rounded-xl border border-white/[0.02]">
                  <img src={a.icon} className="w-6 h-6 object-contain" />
                  <span className="font-rajdhani font-bold text-sm">{a.count}/{a.target}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}