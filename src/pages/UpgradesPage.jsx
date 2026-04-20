import React, { useState, useEffect } from 'react';
import { Hammer, Bell, Trash2, Play, Volume2 } from 'lucide-react';

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

export default function UpgradesPage() {
  const [upgrades, setUpgrades] = useState(JSON.parse(localStorage.getItem('coc_upgrades')) || []);
  const [sounds, setSounds] = useState([]);
  const [form, setForm] = useState({ accId: 1, name: '', days: '', hours: '', mins: '', sound: '' });

  // 1. GitHub se MP3 files fetch karna
  useEffect(() => {
    fetch(`https://api.github.com/repos/Romilchavda/My-attacks/contents/assets`)
      .then(res => res.json())
      .then(data => {
        const mp3s = data.filter(f => f.name.endsWith('.mp3'));
        setSounds(mp3s);
        if (mp3s.length > 0) setForm(prev => ({ ...prev, sound: mp3s[0].download_url }));
      })
      .catch(() => console.error("Sound fetch failed"));

    // Timer check every second
    const interval = setInterval(() => {
      const now = Date.now();
      let changed = false;
      const updatedUpgrades = upgrades.map(up => {
        if (up.endTime <= now && !up.notified) {
          triggerAlarm(up);
          changed = true;
          return { ...up, notified: true };
        }
        return up;
      });
      if (changed) {
        setUpgrades(updatedUpgrades);
        localStorage.setItem('coc_upgrades', JSON.stringify(updatedUpgrades));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [upgrades]);

  const triggerAlarm = (up) => {
    const audio = new Audio(up.sound);
    audio.play().catch(e => console.log("Interaction required for sound"));
    if (Notification.permission === 'granted') {
      new Notification(`Mission Ready!`, { 
        body: `${up.name} upgrade complete!`,
        icon: 'https://cdn-icons-png.flaticon.com/512/3522/3522030.png'
      });
    }
  };

  const playPreview = () => {
    if (form.sound) new Audio(form.sound).play();
  };

  const startUp = () => {
    if (!form.name) return alert("Enter item name!");
    const duration = ((parseInt(form.days) || 0) * 86400 + (parseInt(form.hours) || 0) * 3600 + (parseInt(form.mins) || 0) * 60) * 1000;
    const endTime = Date.now() + duration;
    const newList = [...upgrades, { ...form, id: Date.now(), endTime, notified: false }];
    setUpgrades(newList);
    localStorage.setItem('coc_upgrades', JSON.stringify(newList));
    setForm({ ...form, name: '', days: '', hours: '', mins: '' });
    if (Notification.permission !== 'granted') Notification.requestPermission();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <div className="bg-cardBg border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
        <h2 className="text-2xl font-rajdhani font-black text-accent mb-6 flex items-center gap-3 italic">
          <Hammer size={24} /> NEW UPGRADE ORDER
        </h2>
        <div className="space-y-4">
          <select value={form.accId} onChange={e => setForm({ ...form, accId: e.target.value })} className="w-full bg-black/40 p-4 rounded-2xl outline-none border border-white/5 text-gray-300">
            {ACCOUNTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <input type="text" placeholder="Building/Hero Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-black/40 border border-white/5 p-4 rounded-2xl outline-none" />
          
          <div className="grid grid-cols-3 gap-4">
            <input type="number" placeholder="Days" value={form.days} onChange={e => setForm({ ...form, days: e.target.value })} className="bg-black/40 border border-white/5 p-4 rounded-2xl text-center font-bold text-accent" />
            <input type="number" placeholder="Hrs" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} className="bg-black/40 border border-white/5 p-4 rounded-2xl text-center font-bold text-accent" />
            <input type="number" placeholder="Min" value={form.mins} onChange={e => setForm({ ...form, mins: e.target.value })} className="bg-black/40 border border-white/5 p-4 rounded-2xl text-center font-bold text-accent" />
          </div>

          <div className="flex gap-3">
            <select value={form.sound} onChange={e => setForm({ ...form, sound: e.target.value })} className="flex-1 bg-black/40 border border-white/5 p-4 rounded-2xl outline-none text-gray-400 text-sm">
              {sounds.map((s, i) => <option key={i} value={s.download_url}>{s.name.replace('.mp3', '').toUpperCase()}</option>)}
            </select>
            <button onClick={playPreview} className="p-4 bg-white/5 rounded-2xl text-accent hover:bg-accent hover:text-black transition-all">
              <Volume2 size={24} />
            </button>
          </div>

          <button onClick={startUp} className="w-full py-5 bg-accent text-black font-black font-rajdhani text-xl rounded-2xl shadow-lg shadow-accent/20 uppercase tracking-widest active:scale-95 transition-transform">
            Initiate Upgrade
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {upgrades.sort((a, b) => a.endTime - b.endTime).map(up => {
          const acc = ACCOUNTS.find(a => a.id == up.accId);
          const timeLeft = up.endTime - Date.now();
          const isDone = timeLeft <= 0;

          return (
            <div key={up.id} className={`p-6 rounded-[2rem] border transition-all ${isDone ? 'bg-success/5 border-success/30 shadow-[0_0_20px_rgba(32,198,7,0.1)]' : 'bg-cardBg border-white/5'} flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden`}>
              <button onClick={() => {
                const newList = upgrades.filter(u => u.id !== up.id);
                setUpgrades(newList);
                localStorage.setItem('coc_upgrades', JSON.stringify(newList));
              }} className="absolute top-4 right-6 text-gray-600 hover:text-red-500"><Trash2 size={18} /></button>

              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDone ? 'bg-success text-black' : 'bg-accent/10 text-accent'}`}>
                  <Bell size={24} className={isDone ? 'animate-bounce' : ''} />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-rajdhani font-black text-lg leading-none uppercase">{up.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{acc?.name}</p>
                </div>
              </div>

              <div className={`font-rajdhani font-black text-4xl italic tracking-tighter ${isDone ? 'text-success animate-pulse' : 'text-white'}`}>
                {isDone ? "READY" : formatTime(timeLeft)}
              </div>

              <button onClick={() => window.open(`https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${acc?.tag}`)} className={`px-8 py-3 rounded-xl font-rajdhani font-bold flex items-center gap-2 transition-all ${isDone ? 'bg-success text-black shadow-lg shadow-success/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                <Play size={16} fill="currentColor" /> ACTION
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatTime(ms) {
  let s = Math.floor(ms / 1000);
  let d = Math.floor(s / 86400); s %= 86400;
  let h = Math.floor(s / 3600); s %= 3600;
  let m = Math.floor(s / 60);
  return `${d}D : ${h}H : ${m}M : ${s % 60}S`;
}