import React from 'react';
import { TrendingUp, Users, Award, Zap, ChevronRight, PieChart, DollarSign, BarChart3 } from 'lucide-react';

const MentorPerformance = () => {
  const mentors = [
    { 
      name: "Jane Cooper", 
      successRate: 98, 
      avgRating: 4.9, 
      activeStudents: 42, 
      earnings: "$4,200", 
      trend: "up",
      load: 85 // Percentage of maximum capacity
    },
    { 
      name: "Cody Fisher", 
      successRate: 91, 
      avgRating: 4.7, 
      activeStudents: 28, 
      earnings: "$2,850", 
      trend: "steady",
      load: 40 
    },
    { 
      name: "Esther Howard", 
      successRate: 84, 
      avgRating: 4.5, 
      activeStudents: 15, 
      earnings: "$1,400", 
      trend: "down",
      load: 20 
    }
  ];

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Financial Health Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/20 p-6 rounded-[2rem] backdrop-blur-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><DollarSign size={20}/></div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full font-black">LIFETIME</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Paid Out</p>
          <h3 className="text-3xl font-black text-white">$12,450.00</h3>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/20 p-6 rounded-[2rem] backdrop-blur-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><BarChart3 size={20}/></div>
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-black">15% MARGIN</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Platform Revenue</p>
          <h3 className="text-3xl font-black text-white">$3,120.00</h3>
        </div>

        <div className="bg-slate-900/40 border border-white/10 p-6 rounded-[2rem] flex flex-col justify-center">
          <div className="flex items-center gap-3 text-slate-400 mb-2">
            <Users size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Global Reach</span>
          </div>
          <h3 className="text-3xl font-black text-white">1,284 <span className="text-sm text-slate-500 font-medium italic">Active Students</span></h3>
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
              <Zap size={18} className="text-amber-400" /> Mentor Efficiency Matrix
            </h4>
            <p className="text-slate-500 text-xs mt-1">Real-time data on instructor engagement and student success.</p>
          </div>
          <button className="text-xs font-bold text-indigo-400 hover:text-white transition-colors flex items-center gap-1">
            View Full Audit <ChevronRight size={14} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {mentors.map((mentor) => (
            <div key={mentor.name} className="group p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Mentor Identity & Success Rate */}
              <div className="flex items-center gap-5 lg:w-1/4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 font-black">
                  {mentor.successRate}%
                </div>
                <div>
                  <p className="text-white font-bold">{mentor.name}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                    <Award size={12} className="text-amber-500" /> Top Tier Mentor
                  </div>
                </div>
              </div>

              {/* Workload Indicator */}
              <div className="flex-1 max-w-xs">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Current Workload</p>
                  <p className="text-[10px] text-white font-bold">{mentor.load}% Capacity</p>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      mentor.load > 80 ? 'bg-rose-500' : mentor.load > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${mentor.load}%` }}
                  />
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="flex items-center gap-8 lg:w-1/3 justify-end text-right">
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Kids</p>
                  <p className="text-white font-bold">{mentor.activeStudents}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Avg Rating</p>
                  <div className="flex items-center justify-end gap-1 text-white font-bold">
                    <TrendingUp size={14} className={mentor.trend === 'up' ? 'text-emerald-400' : 'text-slate-500'} />
                    {mentor.avgRating}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Earnings</p>
                  <p className="text-emerald-400 font-black">{mentor.earnings}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorPerformance;