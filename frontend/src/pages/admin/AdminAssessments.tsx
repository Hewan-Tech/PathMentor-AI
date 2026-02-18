import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/services/api";
import { 
  ClipboardList, Plus, Eye, Edit3, Trash2, 
  Menu, LayoutDashboard, UserCheck, Users, 
  Settings, LogOut, Clock, BookOpen 
} from "lucide-react";
import { toast } from "sonner";

// UI Components
import { ParticlesBackground } from "@/components/landing/ParticlesBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

const AdminAssessments = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const res = await api.get("/admin/assessments");
      setAssessments(res.data);
    } catch (err) {
      console.error(err);
      // Simulation data if API fails
      setAssessments([
        { _id: "1", title: "Frontend Basics", track: "Frontend", questions: [1,2,3,4,5], duration: 30 },
        { _id: "2", title: "Node.js Advanced", track: "Backend", questions: [1,2,3,4,5,6,7,8,9,10], duration: 45 },
      ]);
    } finally {
      setLoading(false);
    }
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
        {/* SIDEBAR */}
        <aside className={`h-full transition-all duration-300 ${sidebarOpen ? "w-72" : "w-20"} bg-white/[0.02] backdrop-blur-xl border-r border-white/10 p-6 flex flex-col`}>
          <div className="flex justify-between items-center mb-10">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/20 text-white font-black text-lg">P</div>
                <span className="text-xl font-bold tracking-tight text-white">PathMentor</span>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Menu size={20} /></button>
          </div>

          <nav className="flex flex-col gap-2">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" open={sidebarOpen} onClick={() => navigate("/dashboard")} />
            <NavItem icon={<UserCheck size={20} />} label="Mentors" open={sidebarOpen} onClick={() => navigate("/admin/mentors")} />
            <NavItem icon={<Users size={20} />} label="Students" open={sidebarOpen} onClick={() => navigate("/admin/students")} />
            <NavItem icon={<ClipboardList size={20} />} label="Assessments" open={sidebarOpen} active />
            <NavItem icon={<Settings size={20} />} label="Settings" open={sidebarOpen} onClick={() => navigate("/admin/settings")} />
          </nav>

          <button onClick={logout} className="mt-auto flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto px-8 pb-8 pt-6">
          {/* HEADER */}
          <header className="sticky top-0 z-50 mb-10">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between px-6 py-4 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
                <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">PathMentor AI</h2>
                <GlassButton variant="primary" glow className="px-6 py-2.5 rounded-xl text-xs font-bold" onClick={logout}>Sign Out</GlassButton>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto">
            {/* WELCOME & ACTION */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Assessments <span className="text-primary">Hub</span></h1>
                <p className="text-muted-foreground mt-1">Design and manage learning evaluations for all tracks.</p>
              </div>
              <GlassButton variant="primary" glow onClick={() => {}}>
                <Plus className="w-4 h-4 mr-2" /> Create New Quiz
              </GlassButton>
            </div>

            {/* TABLE CARD */}
            <GlassCard className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-muted-foreground uppercase text-[11px] font-bold tracking-wider bg-white/[0.02]">
                    <tr>
                      <th className="px-6 py-4 text-white/70">Title</th>
                      <th className="px-6 py-4 text-white/70">Track</th>
                      <th className="px-6 py-4 text-white/70">Content</th>
                      <th className="px-6 py-4 text-white/70">Duration</th>
                      <th className="px-6 py-4 text-right text-white/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {assessments.map((test) => (
                      <tr key={test._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 font-bold text-white group-hover:text-primary transition-colors">
                          {test.title}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {test.track}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          <div className="flex items-center gap-2">
                            <BookOpen size={14} className="text-primary/60" />
                            {test.questions?.length || 0} Questions
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-primary/60" />
                            {test.duration} mins
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 bg-white/5 text-muted-foreground hover:text-white rounded-lg transition-all border border-white/10" title="View">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg transition-all border border-amber-500/10" title="Edit">
                              <Edit3 size={16} />
                            </button>
                            <button className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/10" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {assessments.length === 0 && (
                <div className="p-20 text-center">
                  <ClipboardList className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-muted-foreground">No assessments created yet.</p>
                </div>
              )}
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
};

/* Reusable NavItem Component */
const NavItem = ({ icon, label, open, onClick, active }: any) => (
  <div onClick={onClick} className={`flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all ${active ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}>
    {icon}
    {open && <span className="font-medium">{label}</span>}
  </div>
);

export default AdminAssessments;