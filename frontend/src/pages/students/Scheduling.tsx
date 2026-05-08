import React from 'react';
import { motion } from 'framer-motion';
import { Clock, PlayCircle, Calendar, ChevronLeft, Star } from 'lucide-react';

export const Scheduling = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
      className="grid lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-6">
        <h3 className="text-white/70 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <Clock size={16} className="text-primary" /> Timeline
        </h3>
        {[
          { time: "04:00 PM", title: "Live Q&A: React Patterns", type: "Live Class", active: true },
          { time: "11:59 PM", title: "Project Submission", type: "Deadline", active: false }
        ].map((item, i) => (
          <div key={i} className={`p-6 rounded-3xl border ${item.active ? 'border-primary/40 bg-primary/5' : 'border-white/5 bg-white/5'} flex justify-between items-center`}>
            <div>
              <span className="text-[10px] font-bold text-primary uppercase">{item.time}</span>
              <h4 className="text-lg font-bold text-white">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.type}</p>
            </div>
            {item.active && (
              <button className="bg-primary text-black px-4 py-2 rounded-xl font-bold text-xs">Join Room</button>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">October</h4>
            <div className="flex gap-2"><ChevronLeft size={16}/><ChevronLeft size={16} className="rotate-180"/></div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-muted-foreground">
            {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
            {Array.from({length: 31}).map((_, i) => (
              <div key={i} className={`p-2 rounded-lg ${i+1 === 21 ? 'bg-primary text-black font-bold' : 'hover:bg-white/10'}`}>
                {i+1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default Scheduling;