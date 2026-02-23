import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Bell, Shield, Database, Save, AlertTriangle 
} from "lucide-react";

// UI Components
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* PAGE TITLE */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          System <span className="text-primary">Configuration</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your administrative preferences and security.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SETTINGS TABS */}
        <div className="w-full lg:w-64 space-y-2">
          <TabButton 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")} 
            icon={<User size={18} />} 
            label="Profile" 
          />
          <TabButton 
            active={activeTab === "security"} 
            onClick={() => setActiveTab("security")} 
            icon={<Shield size={18} />} 
            label="Security" 
          />
          <TabButton 
            active={activeTab === "notifications"} 
            onClick={() => setActiveTab("notifications")} 
            icon={<Bell size={18} />} 
            label="Notifications" 
          />
          <TabButton 
            active={activeTab === "system"} 
            onClick={() => setActiveTab("system")} 
            icon={<Database size={18} />} 
            label="System Data" 
          />
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard className="p-8 border-white/10">
                {activeTab === "profile" && (
                  <div className="max-w-xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <User className="text-primary" size={20} /> Admin Profile
                    </h2>
                    <div className="space-y-5">
                      <InputGroup label="Display Name" defaultValue="Hewan Admin" />
                      <InputGroup label="Email Address" type="email" defaultValue="hewanadmin@gmail.com" />
                      <div className="pt-4">
                        <GlassButton variant="primary" className="px-8 py-2.5 rounded-xl font-bold">
                          <Save size={18} className="mr-2" /> Save Changes
                        </GlassButton>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="max-w-xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Shield className="text-amber-500" size={20} /> Password & Security
                    </h2>
                    <div className="space-y-5">
                      <InputGroup label="Current Password" type="password" placeholder="••••••••" />
                      <InputGroup label="New Password" type="password" placeholder="••••••••" />
                      <div className="pt-4">
                        <GlassButton variant="secondary" className="px-8 py-2.5 rounded-xl font-bold border-amber-500/20 text-amber-500 hover:bg-amber-500/10">
                          Update Password
                        </GlassButton>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "system" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Database className="text-rose-500" size={20} /> System Maintenance
                    </h2>
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl mb-8 flex items-start gap-3">
                      <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-rose-400 text-sm font-bold">Danger Zone</p>
                        <p className="text-rose-400/70 text-xs">The actions below are destructive and cannot be undone. Please proceed with caution.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl">
                        <div>
                          <p className="font-bold text-white">Clear All Logs</p>
                          <p className="text-xs text-muted-foreground">Delete all system activity logs older than 30 days.</p>
                        </div>
                        <button className="text-rose-500 font-bold hover:bg-rose-500/10 px-5 py-2 rounded-xl text-xs transition-all border border-rose-500/20">
                          Execute
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* ================= HELPER COMPONENTS ================= */

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-medium text-sm border ${
      active 
        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
        : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
    }`}
  >
    {icon} {label}
  </button>
);

const InputGroup = ({ label, type = "text", ...props }: any) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 ml-1">{label}</label>
    <input 
      type={type} 
      {...props}
      className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all" 
    />
  </div>
);

export default AdminSettings;