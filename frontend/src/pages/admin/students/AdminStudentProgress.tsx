import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, GraduationCap, Search, 
  Filter, Edit2, ShieldAlert, ChevronRight, 
  LayoutGrid, List, MoreVertical
} from 'lucide-react';
import { cn } from "@/lib/utils";

const StudentProgress = () => {
  const [viewLevel, setViewLevel] = useState<'major' | 'class' | 'individual'>('major');
  const [searchTerm, setSearchTerm] = useState('');

  // Example Data Structure
  const majors = [
    { id: 1, name: "Software Engineering", students: 156, avgProgress: 72, classes: 5 },
    { id: 2, name: "UI/UX Design", students: 94, avgProgress: 48, classes: 3 },
    { id: 3, name: "Data Analytics", students: 62, avgProgress: 35, classes: 2 },
  ];

  const individualStudents = [
    { id: 'STU001', name: "Alex Rivera", major: "Software Eng.", batch: "2024-A", progress: 85, status: 'active' },
    { id: 'STU002', name: "Sarah Chen", major: "Software Eng.", batch: "2024-A", progress: 32, status: 'at-risk' },
    { id: 'STU003', name: "Jordan Smith", major: "UI/UX Design", batch: "2024-B", progress: 98, status: 'completed' },
  ];

  return (
    <div className="p-4 md:p-8 text-white min-h-screen bg-[#020617] animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Student Progress</h1>
          <p className="text-slate-400 text-sm mt-1">Monitor and control academic performance across all levels.</p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full lg:w-auto">
          {['major', 'class', 'individual'].map((type) => (
            <button
              key={type}
              onClick={() => setViewLevel(type as any)}
              className={cn(
                "flex-1 lg:flex-none px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all capitalize",
                viewLevel === type ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder={`Search ${viewLevel}...`}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-blue-500 transition-colors text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-colors">
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Major/Department Cards View */}
      {viewLevel === 'major' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {majors.map((m) => (
            <div key={m.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-blue-500/50 transition-all group cursor-pointer" onClick={() => setViewLevel('class')}>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                  <GraduationCap size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Avg Mastery</span>
                  <span className="text-xl font-bold text-blue-400">{m.avgProgress}%</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{m.name}</h3>
              <p className="text-sm text-slate-500">{m.students} Students • {m.classes} Classes</p>
              <div className="mt-6 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: `${m.avgProgress}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Individual Student Control Table */}
      {viewLevel === 'individual' && (
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-x-auto shadow-2xl">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-white/5 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="p-5">Student</th>
                <th className="p-5">Classification</th>
                <th className="p-5">Mastery Level</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {individualStudents.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{s.name}</p>
                        <p className="text-[10px] text-slate-500">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="text-sm text-slate-300">{s.major}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{s.batch}</p>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3 w-48">
                      <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full", s.progress < 40 ? "bg-red-500" : "bg-emerald-500")}
                          style={{ width: `${s.progress}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-300">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border",
                      s.status === 'active' && "bg-blue-500/10 text-blue-400 border-blue-500/20",
                      s.status === 'at-risk' && "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse",
                      s.status === 'completed' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    )}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-colors" title="Edit Progress">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" title="Restrict Access">
                        <ShieldAlert size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Class Level Placeholder (Empty State) */}
      {viewLevel === 'class' && (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 border-dashed rounded-3xl">
          <Users size={48} className="text-slate-700 mb-4" />
          <h3 className="text-lg font-bold">Class Analysis Mode</h3>
          <p className="text-slate-500 text-sm max-w-xs text-center mt-1">Select a major above to drill down into specific class and batch performance.</p>
        </div>
      )}
    </div>
  );
};

export default StudentProgress;
