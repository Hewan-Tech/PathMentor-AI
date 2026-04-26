import React from 'react';
import { Check, X, FileText } from 'lucide-react';

const MentorApplications = () => {
  const apps = [
    { id: 1, name: "Samuel Kebede", expertise: "React & Node.js", date: "April 24, 2026", status: "Pending" },
    { id: 2, name: "Hana Tadesse", expertise: "Python for AI", date: "April 25, 2026", status: "Under Review" },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold text-white tracking-tight">Applications</h2>
      
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="p-6">Applicant</th>
              <th className="p-6">Expertise</th>
              <th className="p-6">Submission Date</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {apps.map((app) => (
              <tr key={app.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                      {app.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-white">{app.name}</span>
                  </div>
                </td>
                <td className="p-6 text-sm">{app.expertise}</td>
                <td className="p-6 text-sm text-slate-500">{app.date}</td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    app.status === 'Pending' ? 'bg-orange-500/10 text-orange-400' : 'bg-cyan-500/10 text-cyan-400'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors" title="Approve">
                      <Check size={16} />
                    </button>
                    <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Reject">
                      <X size={16} />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors">
                      <FileText size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MentorApplications;