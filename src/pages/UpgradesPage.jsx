import React, { useState, useEffect, useRef } from 'react';
import { Hammer, Bell, Trash2, Play } from 'lucide-react';

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

  useEffect(() => {
    fetch(`https://api.github.com/repos/Romilchavda/My-attacks/contents/assets`)
      .then(res => res.json()).then(data => {
        const mp3s = data.filter(f => f.name.endsWith('.mp3'));
        setSounds(mp3s); if(mp3s.length > 0) setForm(f => ({ ...f, sound: mp3s[0].path }));
      });
    const interval = setInterval(() => setUpgrades(prev => [...prev]), 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerAlarm = (up) => {
    new Audio(up.sound).play();
    if (Notification.permission === 'granted') new Notification(`Mission Ready: ${up.name}`);
  };

  const startUp = () => {
    const endTime = Date.now() + ((parseInt(form.days)||0)*86400 + (parseInt(form.hours)||0)*3600 + (parseInt(form.mins)||0)*60)*1000;
    const newList = [...upgrades, { ...form, id: Date.now(), endTime, notified: false }];
    setUpgrades(newList); localStorage.setItem('coc_upgrades', JSON.stringify(newList));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-cardBg border border-white/5 p-6 rounded-[2rem] shadow-2xl">
        <h2 className="text-xl font-rajdhani font-black text-accent mb-4 italic">INITIATE UPGRADE</h2>
        <div className="space-y-3">
          <select value={form.accId} onChange={e=>setForm({...form, accId: e.target.value})} className="w-full bg-black/40 p-3 rounded-xl outline-none border border-white/5">
             {ACCOUNTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <input type="text" placeholder="Item Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full bg-black/40 p-3 rounded-xl outline-none border border-white/5" />
          <div className="grid grid-cols-3 gap-3">
             <input type="number" placeholder="Days" onChange={e=>setForm({...form, days: e.target.value})} className="bg-black/40 p-3 rounded-xl text-center font-bold text-accent border border-white/5" />
             <input type="number" placeholder="Hrs" onChange={e=>setForm({...form, hours: e.target.value})} className="bg-black/40 p-3 rounded-xl text-center font-bold text-accent border border-white/5" />
             <input type="number" placeholder="Min" onChange={e=>setForm({...form, mins: e.target.value})} className="bg-black/40 p-3 rounded-xl text-center font-bold text-accent border border-white/5" />
          </div>
          <button onClick={startUp} className="w-full py-4 bg-accent text-black font-black font-rajdhani text-lg rounded-xl uppercase tracking-tighter">Start Timer</button>
        </div>
      </div>
      <div className="space-y-4">
        {upgrades.map(up => {
          const acc = ACCOUNTS.find(a => a.id == up.accId);
          const diff = up.endTime - Date.now();
          const isDone = diff <= 0;
          if(isDone && !up.notified) { triggerAlarm(up); up.notified = true; }
          return (
            <div key={up.id} className={`p-5 rounded-3xl border ${isDone ? 'bg-success/5 border-success/30' : 'bg-cardBg border-white/5'} flex justify-between items-center`}>
              <div>
                <h4 className="font-rajdhani font-black text-white">{up.name}</h4>
                <p className="text-[10px] text-gray-500 uppercase">{acc?.name}</p>
              </div>
              <div className={`font-rajdhani font-black text-2xl ${isDone ? 'text-success' : 'text-cyan-400'}`}>
                {isDone ? "READY" : Math.floor(diff/1000/3600) + "H " + Math.floor((diff/1000/60)%60) + "M"}
              </div>
              <button onClick={()=>{setUpgrades(upgrades.filter(u=>u.id!==up.id))}} className="text-red-500"><Trash2 size={18}/></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}