import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Eye, 
  Cpu, 
  Save, 
  RefreshCcw,
  Volume2,
  Moon
} from 'lucide-react';

// Reusable Toggle Component
const GlassToggle = ({ enabled, setEnabled }) => (
  <button 
    onClick={() => setEnabled(!enabled)}
    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${enabled ? 'bg-primary' : 'bg-white/10'}`}
  >
    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
  </button>
);

export const Settings = ({ preferences, updatePreferences }) => {
  const [notifications, setNotifications] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      className="max-w-5xl mx-auto space-y-8 pb-20"
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">
            System <span className="text-primary">Settings</span>
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-1">Configure your learning environment parameters.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all text-white">
          <RefreshCcw size={14} /> Factory Reset
        </button>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* SIDEBAR NAVIGATION (Settings Categories) */}
        <div className="space-y-2">
          {[
            { label: 'Learning Logic', icon: Cpu, active: true },
            { label: 'Notifications', icon: Bell, active: false },
            { label: 'Security & Privacy', icon: Lock, active: false },
            { label: 'Interface', icon: Eye, active: false },
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                item.active 
                ? 'bg-primary/10 border border-primary/30 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]' 
                : 'text-muted-foreground hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>

        {/* MAIN SETTINGS PANEL */}
        <div className="lg:col-span-2 space-y-6">
          {/* LEARNING PREFERENCES CARD */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-8">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em] flex items-center gap-2">
                <Cpu size={14} className="text-primary" /> Learning Engine
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">AI Persona</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none transition-colors">
                    <option>The Architect (Structured)</option>
                    <option>The Speedrunner (Fast-paced)</option>
                    <option>The Scholar (Deep Dive)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Daily Commitment</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none transition-colors">
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                    <option>2+ Hours</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em] flex items-center gap-2">
                <Eye size={14} className="text-primary" /> Interface & Accessibility
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Bell size={18} /></div>
                    <div>
                      <p className="text-sm font-bold text-white">Push Notifications</p>
                      <p className="text-[10px] text-muted-foreground">Alerts for upcoming live sessions.</p>
                    </div>
                  </div>
                  <GlassToggle enabled={notifications} setEnabled={setNotifications} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><Moon size={18} /></div>
                    <div>
                      <p className="text-sm font-bold text-white">High Contrast Mode</p>
                      <p className="text-[10px] text-muted-foreground">Enhance UI visibility for focus.</p>
                    </div>
                  </div>
                  <GlassToggle enabled={highContrast} setEnabled={setHighContrast} />
                </div>
              </div>
            </div>

            {/* SAVE ACTION */}
            <div className="pt-4 flex justify-end gap-4">
              <button className="px-6 py-3 rounded-xl text-xs font-bold text-muted-foreground hover:text-white transition-colors">
                Cancel
              </button>
              <button className="px-8 py-3 bg-primary text-black rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all">
                <Save size={16} /> Sync Changes
              </button>
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20">
            <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4">Danger Zone</h4>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">Deleting your profile will permanently wipe all learning progress and XP.</p>
              <button className="px-4 py-2 border border-red-500/30 text-red-500 rounded-lg text-[10px] font-bold hover:bg-red-500 hover:text-white transition-all">
                Terminate Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default Settings;