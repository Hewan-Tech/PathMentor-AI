import React from 'react';
import { Shield, Check, Lock } from 'lucide-react';

const RolesPermissions = () => {
  const roles = [
    { title: "Super Admin", desc: "Full access to all system modules and settings.", color: "text-blue-400" },
    { title: "Instructor", desc: "Access to courses, lessons, and student progress.", color: "text-purple-400" },
    { title: "Support", desc: "Access to chats, tickets, and user feedback.", color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.title} className="p-6 bg-slate-900/40 border border-white/10 rounded-3xl hover:border-blue-500/30 transition-all cursor-pointer group">
            <Shield className={`${role.color} mb-4 group-hover:scale-110 transition-transform`} size={32} />
            <h3 className="text-lg font-bold text-white mb-2">{role.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">{role.desc}</p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
              <Check size={14} /> 12 Modules Enabled
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-slate-900/40 border border-white/10 rounded-3xl backdrop-blur-xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <Lock size={16} className="text-slate-500" /> Permission Matrix
        </h2>
        <div className="space-y-4">
          {['Access Admin Panel', 'Manage Payments', 'Delete Users', 'Edit Courses'].map((perm) => (
            <div key={perm} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <span className="text-sm text-slate-300 font-medium">{perm}</span>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative shadow-inner">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RolesPermissions;