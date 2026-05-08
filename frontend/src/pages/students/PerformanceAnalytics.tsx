import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, Activity, Target } from 'lucide-react';

export const PerformanceAnalytics = () => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{ label: "GPA", val: "3.9", icon: Trophy, color: "text-yellow-500" }, { label: "XP", val: "12k", icon: Zap, color: "text-primary" }].map((s, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10">
            <s.icon className={`${s.color} mb-2`} size={20} />
            <p className="text-xs text-muted-foreground font-bold uppercase">{s.label}</p>
            <p className="text-2xl font-black">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
        <h3 className="font-bold mb-6 flex items-center gap-2"><Activity size={18} className="text-primary" /> Weekly Activity</h3>
        <div className="h-48 flex items-end justify-between gap-2">
          {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
            <motion.div 
              key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }}
              className="flex-1 bg-gradient-to-t from-primary/20 to-primary rounded-t-lg"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
export default PerformanceAnalytics;