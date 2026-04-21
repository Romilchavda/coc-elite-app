import React from 'react';
import { ExternalLink, Copy } from 'lucide-react';

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

export default function WidgetsPage() {
  const openWidget = (id) => {
    window.open(`/widget/${id}`, '_blank', 'width=400,height=500');
  };

  return (
    <div className="space-y-8">
      <div className="bg-cardBg border border-white/5 p-6 rounded-3xl">
        <h2 className="text-2xl font-rajdhani font-black text-accent italic">WIDGET GENERATOR</h2>
        <p className="text-sm text-gray-500 mt-2">Har ID ke liye ek alag mini-app shortcut banayein.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACCOUNTS.map(acc => (
          <div key={acc.id} className="bg-cardBg p-5 rounded-2xl border border-white/5 flex justify-between items-center">
            <div>
              <h4 className="font-rajdhani font-bold text-lg">{acc.name}</h4>
              <p className="text-[10px] text-gray-500">#{acc.tag}</p>
            </div>
            <button 
              onClick={() => openWidget(acc.id)}
              className="p-3 bg-accent/10 text-accent rounded-xl hover:bg-accent hover:text-black transition-all"
            >
              <ExternalLink size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}