import React from 'react';
import { Cog, Globe, Bell, Palette, Database } from 'lucide-react';

const SystemSettings = () => {
  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-white mb-8">System Configuration</h1>

      <div className="space-y-4">
        {[
          { icon: <Globe />, label: "Platform Language", val: "English (US)", desc: "Set the default language for all users." },
          { icon: <Database />, label: "Maintenance Mode", val: "OFF", desc: "Disable the platform for scheduled updates.", toggle: true },
          { icon: <Bell />, label: "Email Notifications", val: "ON", desc: "Automated emails for transactions and logins.", toggle: true },
          { icon: <Palette />, label: "Brand Identity", val: "LearnSphere Blue", desc: "Primary accent color for the platform UI." },
        ].map((item, i) => (
          <div key={i} className="p-5 bg-slate-900/40 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl text-slate-400 group-hover:text-blue-400 transition-colors">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{item.label}</p>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md">{item.val}</span>
              <button className="text-slate-600 hover:text-white transition-colors">
                 <Cog size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemSettings;
