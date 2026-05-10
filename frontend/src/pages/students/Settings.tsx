import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Bell, Lock, Eye, Cpu, Save, RefreshCcw, Moon, Loader2, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useProfile } from "@/hooks/useStudentApi";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const GlassToggle = ({ enabled, setEnabled }: { enabled: boolean; setEnabled: (v: boolean) => void }) => (
  <button
    onClick={() => setEnabled(!enabled)}
    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${enabled ? "bg-primary" : "bg-white/10"}`}
  >
    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${enabled ? "translate-x-6" : "translate-x-0"}`} />
  </button>
);

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, updateProfile, changePassword } = useProfile();

  const [activeTab, setActiveTab] = useState("learning");
  const [notifications, setNotifications] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const [nameForm, setNameForm] = useState({ name: user?.name || "" });
  const [nameSaving, setNameSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);

  const handleSaveName = async () => {
    if (!nameForm.name.trim()) return;
    setNameSaving(true);
    try {
      await updateProfile({ name: nameForm.name });
      toast({ title: "Profile updated!" });
    } catch (e: any) {
      toast({ title: "Error", description: e.response?.data?.message || "Failed", variant: "destructive" });
    } finally { setNameSaving(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwSaving(true);
    try {
      await changePassword(pwForm.currentPassword, pwForm.newPassword);
      toast({ title: "Password changed!" });
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (e: any) {
      toast({ title: "Error", description: e.response?.data?.message || "Failed", variant: "destructive" });
    } finally { setPwSaving(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const tabs = [
    { id: "learning", label: "Learning Logic", icon: Cpu },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "interface", label: "Interface", icon: Eye },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">
            System <span className="text-primary">Settings</span>
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-1">Configure your learning environment.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all"
        >
          <RefreshCcw size={14} /> Logout
        </button>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Tab Nav */}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 border border-primary/30 text-primary"
                  : "text-muted-foreground hover:bg-white/5 border border-transparent"
              }`}
            >
              <tab.icon size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="lg:col-span-2 space-y-6">

          {/* Learning Logic */}
          {activeTab === "learning" && (
            <GlassCard className="p-8 space-y-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em] flex items-center gap-2">
                <Cpu size={14} className="text-primary" /> Learning Profile
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-muted-foreground mb-1 block">Display Name</label>
                  <div className="flex gap-3">
                    <input
                      value={nameForm.name}
                      onChange={e => setNameForm({ name: e.target.value })}
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={nameSaving}
                      className="px-4 py-3 bg-primary text-black rounded-xl text-xs font-black flex items-center gap-2"
                    >
                      {nameSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      Save
                    </button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-muted-foreground mb-1 block">Skill Track</label>
                    <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-muted-foreground">
                      {user?.learningProfile?.skillTrack || "Not set"}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-muted-foreground mb-1 block">Experience Level</label>
                    <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-muted-foreground">
                      {user?.learningProfile?.experienceLevel || "Not set"}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-muted-foreground mb-1 block">Learning Style</label>
                    <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-muted-foreground">
                      {user?.learningProfile?.learningStyle || "Not set"}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-muted-foreground mb-1 block">Commitment Time</label>
                    <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-muted-foreground">
                      {user?.learningProfile?.commitmentTime || "Not set"}
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">To update your learning profile, complete the onboarding again.</p>
              </div>
            </GlassCard>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <GlassCard className="p-8 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
                <Bell size={14} className="text-primary" /> Notification Preferences
              </h3>
              {[
                { label: "Push Notifications", desc: "Alerts for upcoming sessions", state: notifications, set: setNotifications },
                { label: "High Contrast Mode", desc: "Enhance UI visibility", state: highContrast, set: setHighContrast },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div>
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                  </div>
                  <GlassToggle enabled={item.state} setEnabled={item.set} />
                </div>
              ))}
            </GlassCard>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <GlassCard className="p-8 space-y-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em] flex items-center gap-2">
                <Lock size={14} className="text-primary" /> Change Password
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <input
                  type="password"
                  placeholder="Current password"
                  value={pwForm.currentPassword}
                  onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none"
                />
                <input
                  type="password"
                  placeholder="New password (min 8 chars, 1 uppercase, 1 number, 1 symbol)"
                  value={pwForm.newPassword}
                  onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none"
                />
                <button type="submit" disabled={pwSaving}
                  className="px-8 py-3 bg-primary text-black rounded-xl text-xs font-black flex items-center gap-2">
                  {pwSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Update Password
                </button>
              </form>
            </GlassCard>
          )}

          {/* Interface */}
          {activeTab === "interface" && (
            <GlassCard className="p-8 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
                <Eye size={14} className="text-primary" /> Interface
              </h3>
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
            </GlassCard>
          )}

          {/* Danger Zone */}
          <GlassCard className="p-6 border-red-500/20 bg-red-500/5">
            <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle size={12} /> Danger Zone
            </h4>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">Logging out will end your current session.</p>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-500/30 text-red-500 rounded-lg text-[10px] font-bold hover:bg-red-500 hover:text-white transition-all"
              >
                Logout
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
