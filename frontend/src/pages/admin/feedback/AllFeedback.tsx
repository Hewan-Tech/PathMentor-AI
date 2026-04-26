import React from 'react';
import { MessageSquare, Search, Filter, Trash2, Archive, CornerUpLeft, Quote } from 'lucide-react';

const AllFeedback = () => {
  const feedbacks = [
    { id: 1, user: "Alice Freeman", role: "Student", text: "The new UI is much smoother, but I miss the old progress tracker layout.", sentiment: "Neutral", date: "4h ago" },
    { id: 2, user: "Dr. Robert Fox", role: "Mentor", text: "Integration with Zoom for live sessions is working perfectly now. Great update!", sentiment: "Positive", date: "1d ago" },
    { id: 3, user: "Kevin Space", role: "Student", text: "Searching for specific lesson timestamps is still a bit clunky on mobile.", sentiment: "Negative", date: "2d ago" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">General Feedback</h1>
          <p className="text-slate-500 text-sm">Direct thoughts and suggestions from your users.</p>
        </div>
        <div className="flex gap-2">
           <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white"><Filter size={18}/></button>
           <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20">Export All</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {feedbacks.map((f) => (
          <div key={f.id} className="p-6 bg-slate-900/40 border border-white/10 rounded-2xl backdrop-blur-xl relative group">
            <Quote className="absolute right-6 top-6 text-white/5" size={48} />
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-bold text-slate-300">
                  {f.user.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{f.user}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{f.role} • {f.date}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                f.sentiment === 'Positive' ? 'bg-emerald-500/20 text-emerald-400' : 
                f.sentiment === 'Negative' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'
              }`}>{f.sentiment}</span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed relative z-10 mb-6 italic">"{f.text}"</p>

            <div className="flex gap-3 border-t border-white/5 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex items-center gap-2 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors">
                <CornerUpLeft size={14}/> Reply
              </button>
              <button className="flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-white transition-colors">
                <Archive size={14}/> Archive
              </button>
              <button className="flex items-center gap-2 text-[11px] font-bold text-red-500/70 hover:text-red-400 transition-colors">
                <Trash2 size={14}/> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllFeedback;