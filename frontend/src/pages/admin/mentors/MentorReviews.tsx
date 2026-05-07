import React, { useState } from 'react';
import { Star, MessageSquare, ShieldAlert, CheckCircle, Flag, Quote, Filter, MoreHorizontal } from 'lucide-react';

const MentorReviews = () => {
  const [filter, setFilter] = useState('All');

  const reviews = [
    { 
      id: 1, 
      student: "Hana T.", 
      mentor: "Jane Cooper", 
      course: "React Masterclass", 
      rating: 5, 
      comment: "The React course by Jane was life-changing. Great mentor! She explained complex state management in a way that finally clicked.", 
      date: "2 days ago",
      sentiment: "Positive",
      isFeatured: true 
    },
    { 
      id: 2, 
      student: "Abebe B.", 
      mentor: "Cody Fisher", 
      course: "Full Stack Dev", 
      rating: 3, 
      comment: "Good content, but sometimes the response time for questions was a bit slow during the final project week.", 
      date: "1 week ago",
      sentiment: "Neutral",
      isFeatured: false 
    },
    { 
      id: 3, 
      student: "Sara M.", 
      mentor: "Jane Cooper", 
      course: "UI/UX Foundations", 
      rating: 5, 
      comment: "Jane is incredible. Her feedback on my portfolio was professional and helped me land my first internship!", 
      date: "3 days ago",
      sentiment: "Positive",
      isFeatured: false 
    }
  ];

  const filteredReviews = filter === 'All' ? reviews : reviews.filter(r => r.sentiment === filter);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header & Social Proof Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <MessageSquare className="text-amber-500" size={32} />
            Sentiment & Feedback
          </h2>
          <p className="text-slate-400 text-sm mt-1">Monitor student satisfaction and mentor engagement.</p>
        </div>

        <div className="flex gap-2 p-1 bg-slate-900/40 border border-white/5 rounded-2xl">
          {['All', 'Positive', 'Neutral'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === s ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Review Feed */}
      <div className="grid grid-cols-1 gap-6">
        {filteredReviews.map((rev) => (
          <div 
            key={rev.id} 
            className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 hover:border-amber-500/30 transition-all duration-500"
          >
            {/* Top Row: Ratings & Moderation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < rev.rating ? "currentColor" : "none"} 
                      className={i < rev.rating ? "text-amber-400" : "text-slate-700"} 
                    />
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                   {rev.date} • {rev.course}
                </p>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  rev.isFeatured ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}>
                  <CheckCircle size={14} /> {rev.isFeatured ? 'Featured' : 'Feature'}
                </button>
                <button type="button" title="Flag review" className="p-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                  <Flag size={14} />
                </button>
                <button type="button" title="More options" className="p-2 bg-white/5 text-slate-500 rounded-xl hover:text-white transition-all">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="relative">
              <Quote size={40} className="absolute -top-4 -left-4 text-white/[0.03] rotate-180" />
              <p className="text-lg font-medium text-slate-200 italic leading-relaxed relative z-10 pl-6">
                "{rev.comment}"
              </p>
            </div>

            {/* Attribution Footer */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-[10px]">
                  {rev.student.charAt(0)}
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                  {rev.student} <span className="text-slate-600 px-2">for</span> <span className="text-white">{rev.mentor}</span>
                </p>
              </div>
              
              <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                rev.sentiment === 'Positive' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 bg-white/5'
              }`}>
                {rev.sentiment === 'Positive' ? <CheckCircle size={12}/> : <ShieldAlert size={12}/>}
                {rev.sentiment} Sentiment
              </div>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="py-24 text-center">
            <MessageSquare size={48} className="mx-auto text-slate-800 mb-4" />
            <p className="text-slate-500 italic">No reviews found for this sentiment filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorReviews;