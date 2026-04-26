import React from 'react';
import { Star, TrendingUp, BarChart3, Users, Award } from 'lucide-react';

const Ratings = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Platform Average</p>
          <h2 className="text-5xl font-black text-white mb-2">4.8</h2>
          <div className="flex justify-center text-yellow-500 mb-4">
             {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
          </div>
          <p className="text-emerald-400 text-xs font-bold flex items-center justify-center gap-1">
            <TrendingUp size={14}/> +0.2% from last month
          </p>
        </div>

        <div className="md:col-span-2 p-8 bg-slate-900/40 border border-white/10 rounded-3xl">
          <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Rating Distribution</h3>
          <div className="space-y-4">
            {[88, 8, 3, 1, 0].map((perc, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-xs text-slate-500 w-12 font-bold">{5-i} Stars</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${perc}%` }} />
                </div>
                <span className="text-xs text-slate-400 w-10 text-right">{perc}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-8 px-2">
          <h3 className="text-lg font-bold text-white">Top Rated Categories</h3>
          <BarChart3 className="text-slate-600" size={20} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Development", rating: 4.9, icon: <Award className="text-blue-400"/> },
            { name: "UI/UX Design", rating: 4.7, icon: <Award className="text-purple-400"/> },
            { name: "Marketing", rating: 4.5, icon: <Award className="text-emerald-400"/> },
            { name: "Soft Skills", rating: 4.8, icon: <Award className="text-orange-400"/> },
          ].map((item) => (
            <div key={item.name} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 hover:border-white/20 transition-all">
              <div className="p-3 bg-slate-800 rounded-xl">{item.icon}</div>
              <div>
                <p className="text-xs font-bold text-white">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star size={12} fill="#eab308" className="text-yellow-500"/>
                  <span className="text-sm font-black text-slate-200">{item.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ratings;