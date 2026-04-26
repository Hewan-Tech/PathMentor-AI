import React from 'react';
import { UserPlus, MoreHorizontal, Mail, ShieldCheck } from 'lucide-react';

const AdminTeam = () => {
  const team = [
    { name: "John Carter", role: "Super Admin", email: "john@ls.com", status: "Active" },
    { name: "Sarah Vance", role: "Content Manager", email: "sarah@ls.com", status: "Active" },
    { name: "Mike Ross", role: "Support Lead", email: "mike@ls.com", status: "Offline" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Admin Team</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg">
          <UserPlus size={18} /> Add Member
        </button>
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            <tr>
              <th className="p-5">Team Member</th>
              <th className="p-5">Role</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {team.map((member, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-400">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="flex items-center gap-2 text-xs text-slate-300">
                    <ShieldCheck size={14} className="text-blue-500" /> {member.role}
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`} />
                    <span className="text-xs text-slate-400">{member.status}</span>
                  </div>
                </td>
                <td className="p-5 text-right">
                  <button className="p-2 text-slate-500 hover:text-white transition-colors"><MoreHorizontal size={20}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTeam;