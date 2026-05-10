import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, ShieldCheck, Dna, Award, Trophy, Zap, Fingerprint, Save, Loader2, Lock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useProfile, useAchievements, useXP } from "@/hooks/useStudentApi";
import { useToast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { toast } = useToast();
  const { user, loading, updateProfile, changePassword } = useProfile();
  const { achievements } = useAchievements();
  const { totalXP } = useXP();

  const [editName, setEditName] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSaveName = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await updateProfile({ name: editName });
      toast({ title: "Profile updated!" });
      setEditing(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.response?.data?.message || "Failed", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwSaving(true);
    try {
      await changePassword(pwForm.currentPassword, pwForm.newPassword);
      toast({ title: "Password changed successfully!" });
      setPwForm({ currentPassword: "", newPassword: "" });
      setShowPw(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.response?.data?.message || "Failed", variant: "destructive" });
    } finally { setPwSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const xpPercent = Math.min(Math.round((totalXP % 1000) / 10), 100);
  const accountAge = user?.createdAt
    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 max-w-4xl">
      {/* Identity Header */}
      <GlassCard className="p-8 border-primary/20 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-5"><Fingerprint size={200} /></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-white/10 border-2 border-primary p-1 shadow-[0_0_25px_rgba(99,102,241,0.4)]">
              <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                <User size={48} className="text-primary/50" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-primary text-black text-[10px] font-black rounded uppercase italic shadow-lg">
              {user?.learningProfile?.experienceLevel || "Learner"}
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            {editing ? (
              <div className="flex items-center gap-3">
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="bg-white/5 border border-primary/30 rounded-xl px-4 py-2 text-white text-xl font-black outline-none focus:border-primary"
                  autoFocus
                />
                <button onClick={handleSaveName} disabled={saving}
                  className="p-2 bg-primary text-black rounded-xl hover:opacity-90">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                </button>
                <button onClick={() => setEditing(false)} className="p-2 bg-white/5 rounded-xl text-muted-foreground hover:text-white">
                  ✕
                </button>
              </div>
            ) : (
              <h2
                className="text-3xl font-black tracking-tighter text-white uppercase italic cursor-pointer hover:text-primary transition-colors"
                onClick={() => { setEditName(user?.name || ""); setEditing(true); }}
                title="Click to edit"
              >
                {user?.name || "Learner"}
              </h2>
            )}
            <p className="text-primary text-xs font-mono tracking-widest mt-1">
              {user?.learningProfile?.persona || user?.role || "Student"}
            </p>
            <div className="mt-4 w-64 space-y-1">
              <div className="flex justify-between text-[9px] font-bold uppercase text-muted-foreground">
                <span>Experience</span>
                <span className="text-primary">{totalXP.toLocaleString()} XP</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.6)]"
                />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Core Info */}
        <GlassCard className="p-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <Dna size={14} className="text-primary" /> Profile Info
          </h3>
          <div className="space-y-1">
            {[
              { label: "Email", value: user?.email, icon: Mail },
              { label: "Role", value: user?.role, icon: ShieldCheck },
              { label: "Skill Track", value: user?.learningProfile?.skillTrack || "Not set", icon: Zap },
              { label: "Learning Style", value: user?.learningProfile?.learningStyle || "Not set", icon: Fingerprint },
              { label: "Account Age", value: `${accountAge} days`, icon: ShieldCheck },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 group hover:bg-white/[0.02] px-2 transition-colors rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
                    <Icon size={14} />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{label}</span>
                </div>
                <span className="text-sm font-medium text-white capitalize">{value || "—"}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Achievements */}
        <GlassCard className="p-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <Award size={14} className="text-primary" /> Achievements ({achievements.length})
          </h3>
          {achievements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No achievements yet. Keep learning!</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {achievements.slice(0, 6).map((a: any) => (
                <div key={a._id} className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all text-center">
                  <Trophy className="text-yellow-400 mb-2 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" size={20} />
                  <span className="text-[9px] font-bold uppercase leading-tight text-muted-foreground group-hover:text-white transition-colors">{a.title}</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Change Password */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em] flex items-center gap-2">
            <Lock size={14} className="text-primary" /> Security
          </h3>
          <button
            onClick={() => setShowPw(!showPw)}
            className="text-[10px] font-bold text-primary hover:text-white transition-colors"
          >
            {showPw ? "Cancel" : "Change Password"}
          </button>
        </div>
        {showPw && (
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <input
              type="password"
              placeholder="Current password"
              value={pwForm.currentPassword}
              onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none"
            />
            <input
              type="password"
              placeholder="New password"
              value={pwForm.newPassword}
              onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none"
            />
            <button type="submit" disabled={pwSaving}
              className="px-6 py-3 bg-primary text-black rounded-xl text-xs font-black flex items-center gap-2 hover:opacity-90">
              {pwSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Update Password
            </button>
          </form>
        )}
        {!showPw && (
          <p className="text-xs text-muted-foreground">Keep your account secure with a strong password.</p>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default UserProfile;
