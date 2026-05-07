import React, { useState, useMemo } from 'react';
import { Search, Plus, MoreVertical, Star, Users, GraduationCap, TrendingUp, Filter } from 'lucide-react';

const AllMentors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All Roles');

  const mentors = [
    { id: 1, name: "Jane Cooper", role: "UI/UX Design", students: 256, rating: 4.9, image: "https://i.pravatar.cc/150?u=jane", status: "Active" },
    { id: 2, name: "Cody Fisher", role: "Full Stack", students: 189, rating: 4.8, image: "https://i.pravatar.cc/150?u=cody", status: "Active" },
    { id: 3, name: "Esther Howard", role: "Data Science", students: 176, rating: 4.8, image: "https://i.pravatar.cc/150?u=esther", status: "On Leave" },
    { id: 4, name: "Robert Fox", role: "Full Stack", students: 432, rating: 4.9, image: "https://i.pravatar.cc/150?u=robert", status: "Active" },
  ];

  const roles = ["All Roles", ...new Set(mentors.map(m => m.role))];

  const filteredMentors = useMemo(() => {
    return mentors.filter(m => {
      const matchesRole = filterRole === 'All Roles' || m.role === filterRole;
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [filterRole, searchQuery]);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <GraduationCap className="text-cyan-500" size={32} />
            Educator Directory
          </h2>
          <p className="text-slate-400 text-sm mt-1">Managing {mentors.length} professional mentors across {roles.length - 1} disciplines.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Find a mentor..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/40 border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all w-full md:w-64"
            />
          </div>
          
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
             <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-slate-900/40 border border-white/10 rounded-2xl py-2.5 pl-10 pr-8 text-xs font-bold text-slate-300 appearance-none focus:outline-none cursor-pointer"
             >
               {roles.map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
             </select>
          </div>

          <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-2.5 px-6 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95">
            <Plus size={18} /> Onboard Mentor
          </button>
        </div>
      </div>

      {/* Mentor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredMentors.map((mentor) => (
          <div key={mentor.id} className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 hover:border-cyan-500/40 transition-all duration-500 hover:-translate-y-1">
            
            {/* Top Bar: Image & Status */}
            <div className="flex justify-between items-start mb-6">
              <div className="relative">
                <img 
                  src={mentor.image} 
                  className="w-20 h-20 rounded-[2rem] object-cover border-2 border-white/5 group-hover:border-cyan-500/30 transition-colors" 
                  alt={mentor.name} 
                />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-4 border-slate-950 rounded-full ${
                  mentor.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-600'
                }`} title={mentor.status} />
              </div>
              <button className="p-2 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="mb-6">
              <h3 className="text-xl font-black text-white leading-tight">{mentor.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">{mentor.role}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-slate-500 text-[10px] font-bold uppercase">{mentor.status}</span>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 py-5 border-y border-white/5">
              <div className="space-y-1">
                <p className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-black tracking-widest">
                  <Users size={12} className="text-cyan-500" /> Students
                </p>
                <p className="text-white text-lg font-black">{mentor.students.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-black tracking-widest">
                  <Star size={12} className="text-amber-400" /> Rating
                </p>
                <div className="flex items-center gap-1.5 text-white text-lg font-black">
                  {mentor.rating} <span className="text-[10px] text-slate-600 font-medium">/ 5.0</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-2">
              <button className="flex-1 py-3 rounded-2xl bg-white/5 text-white text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
                Analytics
              </button>
              <button className="flex-1 py-3 rounded-2xl bg-cyan-500/10 text-cyan-400 text-[11px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-slate-950 transition-all">
                Profile
              </button>
            </div>

            {/* Hover Accent */}
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <TrendingUp size={20} className="text-cyan-500/50" />
            </div>
          </div>
        ))}

        {/* Add New Card Entry (Optional visual for scaling) */}
        <button className="group border-2 border-dashed border-white/5 rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-4 hover:border-cyan-500/20 hover:bg-cyan-500/[0.02] transition-all min-h-[350px]">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-cyan-500 group-hover:bg-cyan-500/10 transition-all">
            <Plus size={32} />
          </div>
          <div className="text-center">
            <p className="text-white font-bold">Add New Mentor</p>
            <p className="text-slate-500 text-xs">Invite expert to platform</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AllMentors;