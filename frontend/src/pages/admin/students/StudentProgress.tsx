import React from 'react';
import { TrendingUp, Clock } from 'lucide-react';

const StudentProgress = () => {
  const data = [
    { name: "Alex Rivera", course: "React Masterclass", progress: 85, lastActive: "2 hours ago" },
    { name: "Sarah Chen", course: "UI/UX Design", progress: 40, lastActive: "Yesterday" },
    { name: "Jordan Smith", course: "Node.js API", progress: 12, lastActive: "5 mins ago" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Student Progress Tracking</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-bold">{item.name}</h3>
                <p className="text-slate-400 text-xs">{item.course}</p>
              </div>
              <TrendingUp className="text-indigo-400" size={20} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Completion</span>
                <span className="font-bold">{item.progress}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-700" 
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <Clock size={12} />
              Last active: {item.lastActive}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentProgress;