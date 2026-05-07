import React, { useState, useMemo } from 'react';
import { Check, X, FileText, Search, Briefcase, UserCheck, Clock, ShieldCheck } from 'lucide-react';

const MentorApplications = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const apps = [
    { id: 1, name: "Samuel Kebede", expertise: "React & Node.js", date: "April 24, 2026", status: "Pending", email: "samuel.k@dev.io" },
    { id: 2, name: "Hana Tadesse", expertise: "Python for AI", date: "April 25, 2026", status: "Under Review", email: "hana.t@tech.et" },
    { id: 3, name: "Yonas Alemu", expertise: "UI/UX Design", date: "April 20, 2026", status: "Pending", email: "yonas.design@studio.com" },
    { id: 4, name: "Liya Solomon", expertise: "React & Node.js", date: "April 18, 2026", status: "Approved", email: "liya.s@academy.com" },
  ];

  const tabs = ['All', 'Pending', 'Under Review', 'Approved'];

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesTab = activeTab === 'All' || app.status === activeTab;
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.expertise.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Pipeline Summary */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-indigo-500" size={32} />
            Mentor Recruitment
          </h2>
          <p className="text-slate-400 text-sm mt-2">Managing the vetting process for expert-led instruction.</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-orange-500/10 border border-orange-500/20 px-6 py-3 rounded-2xl">
            <p className="text-[10px] text-orange-500 uppercase font-black tracking-widest">New Leads</p>
            <p className="text-2xl font-bold text-white">{apps.filter(a => a.status === 'Pending').length}</p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/20 px-6 py-3 rounded-2xl">
            <p className="text-[10px] text-cyan-500 uppercase font-black tracking-widest">In Review</p>
            <p className="text-2xl font-bold text-white">{apps.filter(a => a.status === 'Under Review').length}</p>
          </div>
        </div>
      </div>

      {/* Navigation & Search Utilities */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex bg-slate-900/60 p-1 rounded-2xl border border-white/5 w-full md:w-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>

      {/* Applications Data Grid */}
      <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">
            <tr>
              <th className="p-8">Expert Profile</th>
              <th className="p-6">Domain Expertise</th>
              <th className="p-6">Applied On</th>
              <th className="p-6">Review Status</th>
              <th className="p-8 text-right">Decision Tool</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {filteredApps.map((app) => (
              <tr key={app.id} className="group border-t border-white/5 hover:bg-white/[0.03] transition-all">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform">
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-white text-base block">{app.name}</span>
                      <span className="text-xs text-slate-500">{app.email}</span>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-slate-200 font-medium">
                    <Briefcase size={14} className="text-indigo-400" />
                    {app.expertise}
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Clock size={14} />
                    {app.date}
                  </div>
                </td>
                <td className="p-6">
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                    app.status === 'Pending' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 
                    app.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      app.status === 'Pending' ? 'bg-orange-400' : app.status === 'Approved' ? 'bg-emerald-400' : 'bg-cyan-400'
                    }`} />
                    {app.status}
                  </span>
                </td>
                <td className="p-8 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold" title="Approve">
                      <UserCheck size={16} /> Approve
                    </button>
                    <button className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all" title="Reject">
                      <X size={18} />
                    </button>
                    <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all" title="View Details">
                      <FileText size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredApps.length === 0 && (
          <div className="py-32 text-center">
            <ShieldCheck size={48} className="mx-auto text-slate-800 mb-4" />
            <p className="text-slate-500 font-medium italic">No applications found in this stage.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorApplications;