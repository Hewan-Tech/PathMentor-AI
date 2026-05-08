import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  ShieldCheck, 
  Zap, 
  Award, 
  Dna, 
  Fingerprint, 
  Mail, 
  MapPin, 
  Trophy
} from 'lucide-react';

// Reusable Sub-component for Identity Rows
const IdentityRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 group hover:bg-white/[0.02] px-2 transition-colors">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white/5 rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
        <Icon size={16} />
      </div>
      <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{label}</span>
    </div>
    <span className="text-sm font-medium text-white">{value}</span>
  </div>
);

export const UserProfile = ({ user, stats }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="space-y-6"
    >
      {/* 1. IDENTITY HEADER */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-transparent border border-primary/20 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute -right-10 -top-10 opacity-5">
          <Fingerprint size={200} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar with Status Glow */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-white/10 border-2 border-primary p-1 shadow-[0_0_25px_rgba(var(--primary),0.4)]">
              <div className="w-full h-full rounded-xl bg-black flex items-center justify-center overflow-hidden">
                <User size={48} className="text-primary/50" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-primary text-black text-[10px] font-black rounded uppercase italic shadow-lg">
              Level 14
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">
              {user?.name || "Neural_Link_User"}
            </h2>
            <p className="text-primary text-xs font-mono tracking-widest mt-1">
              Class: {user?.persona || "Systems Architect"}
            </p>
            
            {/* XP Bar */}
            <div className="mt-4 w-64 space-y-1">
              <div className="flex justify-between text-[9px] font-bold uppercase text-muted-foreground">
                <span>Experience</span>
                <span className="text-primary">2,450 / 3,000 XP</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-[1px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.6)] rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 2. CORE BIOMETRICS (Data Table) */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <Dna size={14} className="text-primary" /> Core Biometrics
          </h3>
          <div className="space-y-1">
            <IdentityRow label="Neural Email" value={user?.email || "user@net.exe"} icon={Mail} />
            <IdentityRow label="Location" value="Sector 7G / Remote" icon={MapPin} />
            <IdentityRow label="Account Age" value="256 Days" icon={ShieldCheck} />
            <IdentityRow label="Access Level" value="Tier 3 / Scholar" icon={Fingerprint} />
          </div>
        </div>

        {/* 3. ACHIEVEMENTS & MEDALS */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <Award size={14} className="text-primary" /> Recent Commendations
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Top 1%", icon: Trophy, color: "text-yellow-400" },
              { label: "Quick Learner", icon: Zap, color: "text-blue-400" },
              { label: "Consistent", icon: ShieldCheck, color: "text-green-400" },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all">
                <badge.icon className={`${badge.color} mb-2 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all`} size={24} />
                <span className="text-[8px] font-bold text-center uppercase leading-tight text-muted-foreground">{badge.label}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 border border-dashed border-white/10 rounded-xl text-[10px] font-bold text-muted-foreground hover:text-white hover:border-white/30 transition-all">
            View All Achievements
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default UserProfile;