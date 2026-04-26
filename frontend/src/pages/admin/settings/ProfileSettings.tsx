import React from 'react';
import { User, Mail, Shield, Camera, Save, Key } from 'lucide-react';

const ProfileSettings = () => {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-6 p-8 bg-slate-900/40 border border-white/10 rounded-3xl backdrop-blur-xl">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
            AD
          </div>
          <button className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-lg text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all">
            <Camera size={16} />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Admin Profile</h2>
          <p className="text-slate-500 text-sm">Update your personal information and profile picture.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/40 border border-white/10 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <User size={14} /> Personal Details
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-500 ml-1">Full Name</label>
              <input type="text" defaultValue="Admin User" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500 ml-1">Email Address</label>
              <input type="email" defaultValue="admin@learnsphere.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900/40 border border-white/10 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Key size={14} /> Change Password
          </h3>
          <div className="space-y-4">
            <input type="password" placeholder="Current Password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
            <input type="password" placeholder="New Password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition-all">
          <Save size={18} /> Save All Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;