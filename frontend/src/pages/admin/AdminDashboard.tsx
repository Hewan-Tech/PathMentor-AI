import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/services/api";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  Check,
  X,
} from "lucide-react";

import { ParticlesBackground } from "@/components/landing/ParticlesBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

const UnifiedDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [pendingMentors, setPendingMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          className="w-16 h-16 rounded-full bg-gradient-primary"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-background text-foreground overflow-hidden">
      <ParticlesBackground />

      <div className="flex relative z-10 h-screen">
        {/* SIDEBAR - Now uses the "P" Icon Branding */}
        <aside
          className={`h-full transition-all duration-300 ${
            sidebarOpen ? "w-72" : "w-20"
          } bg-white/[0.02] backdrop-blur-xl border-r border-white/10 p-6 flex flex-col`}
        >
          <div className="flex justify-between items-center mb-10">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/20 text-white font-black text-lg">
                  P
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  PathMentor
                </span>
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" open={sidebarOpen} activeonClick={() => navigate("/admin/AdminDashboard")} />
            <NavItem icon={<UserCheck size={20} />} label="Mentors" open={sidebarOpen} onClick={() => navigate("/admin/mentors")} />
            <NavItem icon={<Users size={20} />} label="Students" open={sidebarOpen} onClick={() => navigate("/admin/students")} />
            <NavItem icon={<ClipboardList size={20} />} label="Assessments" open={sidebarOpen} onClick={() => navigate("/admin/assessments")} />
            <NavItem icon={<Settings size={20} />} label="Settings" open={sidebarOpen} onClick={() => navigate("/admin/settings")} />
          </nav>

          <button 
            onClick={logout}
            className="mt-auto flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto px-8 pb-8 pt-6">
          
          {/* HEADER - Uses the PathMentor AI gradient text and Sign Out */}
          <header className="sticky top-0 z-50 mb-10">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between px-6 py-4 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
                <div>
                  <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    PathMentor AI
                  </h2>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-semibold text-white/90">
                      {user.email.split('@')[0]}
                    </span>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  <GlassButton 
                    variant="primary" 
                    glow 
                    className="px-6 py-2.5 rounded-xl text-xs font-bold"
                    onClick={logout}
                  >
                    Sign Out
                  </GlassButton>
                </div>
              </div>
            </div>
          </header>

          {/* DASHBOARD CONTENT (Logic remains unchanged) */}
          {user.role === "admin" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Verified Mentors" value={stats?.verifiedMentors || 0} />
                <StatCard title="Total Students" value={stats?.totalStudents || 0} />
                <StatCard title="Pending Review" value={stats?.pendingMentors || 0} highlight />
              </div>

              <GlassCard className="p-0 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="font-bold text-lg text-white">Pending Applications</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-muted-foreground uppercase text-[11px] font-bold tracking-wider bg-white/[0.02]">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {pendingMentors.map((m: any) => (
                                <tr key={m._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 font-medium">{m.name}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{m.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-[10px] font-bold">PENDING</span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => approveMentor(m._id)} className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all">
                                            <Check size={16} />
                                        </button>
                                        <button className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                                            <X size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {user.role === "mentor" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
              <StatCard title="Assigned Students" value={stats?.students || 0} />
              <StatCard title="Pending Reviews" value={stats?.pendingReviews || 0} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const NavItem = ({ icon, label, open, onClick, active }: any) => (
  <div 
    onClick={onClick} 
    className={`flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all ${
      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
    }`}
  >
    {icon}
    {open && <span className="font-medium">{label}</span>}
  </div>
);

const StatCard = ({ title, value, highlight }: any) => (
  <GlassCard className={`p-6 ${highlight ? 'border-primary/20 bg-primary/[0.02]' : ''}`}>
    <p className="text-muted-foreground text-sm font-medium">{title}</p>
    <div className="flex items-end justify-between mt-2">
        <h2 className="text-4xl font-bold tracking-tight text-white">{value}</h2>
        {highlight && (
            <GlassButton variant="primary" className="px-3 py-1 text-[10px] h-auto">
                Review All
            </GlassButton>
        )}
    </div>
  </GlassCard>
);

export default UnifiedDashboard;