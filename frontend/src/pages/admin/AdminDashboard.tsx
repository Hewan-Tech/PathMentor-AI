import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/services/api";
import { Check, X, Users, UserCheck, Clock, Activity } from "lucide-react";

import { ParticlesBackground } from "@/components/landing/ParticlesBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  /* ================= NO CHANGES TO LOGIC ================= */
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [pendingMentors, setPendingMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/auth");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        if (user.role === "admin") {
          const res = await api.get("/admin/dashboard");
          setStats(res.data);
          const pending = await api.get("/admin/pending-mentors");
          setPendingMentors(pending.data);
        } else if (user.role === "mentor") {
          const res = await api.get("/mentor/dashboard");
          setStats(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const approveMentor = async (id: string) => {
    await api.put(`/admin/mentor/${id}/approve`);
    const pending = await api.get("/admin/pending-mentors");
    setPendingMentors(pending.data);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  /* ================= CSS STYLING (SIZE & POSITION PRESERVED) ================= */

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-transparent">
        <motion.div
          className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#33b6ff] to-[#a855f7]"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-8">
      {/* BACKGROUND (Nexus Orbs) */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <ParticlesBackground />
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#33b6ff]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#a855f7]/10 rounded-full blur-[150px]" />
      </div>

      {/* HEADER SECTION (Original Position/Size) */}
      <header className="sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#33b6ff] to-[#a855f7] bg-clip-text text-transparent">
              PathMentor AI
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-white/90 tracking-tight">
                {user?.email?.split('@')[0]}
              </span>
              <span className="text-[10px] text-[#33b6ff] font-black uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
            <GlassButton 
              variant="primary" 
              glow 
              className="px-6 py-2.5 rounded-xl text-xs font-bold border border-white/10"
              onClick={logout}
            >
              Sign Out
            </GlassButton>
          </div>
        </div>
      </header>

      {/* STATS SECTION (Original 3-Column Grid) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatCard title="Verified Mentors" value={stats?.verifiedMentors || 0} icon={<UserCheck size={20} />} />
        <StatCard title="Total Students" value={stats?.totalStudents || 0} icon={<Users size={20} />} />
        <StatCard title="Pending Review" value={stats?.pendingMentors || 0} icon={<Clock size={20} />} highlight />
      </motion.div>

      {/* TABLE SECTION (Original Table Layout) */}
      {user?.role === "admin" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-0 overflow-hidden border-white/5 rounded-3xl bg-white/[0.02]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-lg text-white tracking-tight">Pending Applications</h3>
                <Activity size={16} className="text-[#33b6ff] animate-pulse" />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-slate-500 uppercase text-[11px] font-black tracking-widest bg-white/[0.02]">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {pendingMentors.map((m: any) => (
                            <tr key={m._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4 font-bold text-white text-base tracking-tight">{m.name}</td>
                                <td className="px-6 py-4 text-slate-400 italic">{m.email}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-[10px] font-bold">PENDING</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => approveMentor(m._id)} className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all border border-emerald-500/20">
                                            <Check size={16} />
                                        </button>
                                        <button className="p-2 bg-rose-500/10 text-red-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all border border-rose-500/20">
                                            <X size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {pendingMentors.length === 0 && (
                <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                    Queue Cleared
                </div>
            )}
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const StatCard = ({ title, value, highlight, icon }: any) => (
  <GlassCard className={`p-6 rounded-3xl border-white/5 relative overflow-hidden group ${highlight ? 'bg-[#33b6ff]/[0.02] border-[#33b6ff]/20' : 'bg-white/[0.01]'}`}>
    <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform ${highlight ? 'text-amber-500' : 'text-[#33b6ff]'}`}>
            {icon}
        </div>
        {highlight && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
    </div>
    
    <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1">{title}</p>
    <div className="flex items-end justify-between">
        <h2 className="text-4xl font-black tracking-tighter text-white">{value}</h2>
        {highlight && (
            <GlassButton variant="primary" className="px-3 py-1 text-[9px] font-black h-auto rounded-lg uppercase tracking-tighter">
                Review All
            </GlassButton>
        )}
    </div>
  </GlassCard>
);

export default AdminDashboard;