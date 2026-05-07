import React from 'react';
import { Search, Plus, MoreVertical, Star } from 'lucide-react';

const AllMentors = () => {
  const mentors = [
    { id: 1, name: "Jane Cooper", role: "UI/UX Design", students: 256, rating: 4.9, image: "https://i.pravatar.cc/150?u=jane" },
    { id: 2, name: "Cody Fisher", role: "Full Stack Development", students: 189, rating: 4.8, image: "https://i.pravatar.cc/150?u=cody" },
    { id: 3, name: "Esther Howard", role: "Data Science", students: 176, rating: 4.8, image: "https://i.pravatar.cc/150?u=esther" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Mentors</h2>
          <p className="text-slate-400 text-sm mt-1">Manage and monitor all platform educators.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search mentors..." 
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all w-64"
            />
          </div>
          <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20">
            <Plus size={18} /> Add Mentor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-slate-300">Loading mentors...</div>
        ) : mentorCards.length ? (
          mentorCards.map((mentor) => (
            <div key={mentor.id} className="group relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl p-6 hover:border-cyan-500/30 transition-all duration-300 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <img src={mentor.image} className="w-16 h-16 rounded-2xl object-cover border border-white/10" alt={mentor.name} />
                <button className="text-slate-500 hover:text-white transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
              <h3 className="text-lg font-bold text-white">{mentor.name}</h3>
              <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">{mentor.role}</p>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Status</p>
                  <p className="text-white font-bold">{mentor.students}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Rating</p>
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star size={12} fill="currentColor" /> {mentor.rating}
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 py-2 rounded-xl bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-colors border border-white/5">
                View Full Profile
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-slate-300">No mentors found.</div>
        )}
      </div>
    </div>
  );
};

export default AllMentors;