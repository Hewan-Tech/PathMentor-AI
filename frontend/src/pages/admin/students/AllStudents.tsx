import React from 'react';
import { Search, UserPlus, MoreHorizontal, Mail, Filter } from 'lucide-react';

const AllStudents = () => {
  const students = [
    { id: "STU001", name: "Alex Rivera", email: "alex.r@example.com", joined: "2024-01-15", status: "Active" },
    { id: "STU002", name: "Sarah Chen", email: "s.chen@example.com", joined: "2024-02-10", status: "Active" },
    { id: "STU003", name: "Jordan Smith", email: "jordan@example.com", joined: "2024-03-01", status: "Inactive" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Directory</h1>
          <p className="text-slate-400 text-sm">Manage and view all registered students.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition">
          <UserPlus size={18} /> Add New Student
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input type="text" placeholder="Search by name, email or ID..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Student</th>
              <th className="px-6 py-4 font-semibold">Student ID</th>
              <th className="px-6 py-4 font-semibold">Joined Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">{s.name[0]}</div>
                    <div>
                      <div className="text-white font-medium">{s.name}</div>
                      <div className="text-slate-500 text-xs">{s.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300 font-mono text-sm">{s.id}</td>
                <td className="px-6 py-4 text-slate-400">{s.joined}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-slate-400">
                  <button className="hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllStudents;