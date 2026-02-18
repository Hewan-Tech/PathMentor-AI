import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/services/api";
import { 
  Users, UserPlus, Search, Edit3, Trash2, 
  ChevronLeft, ChevronRight, Menu, LayoutDashboard,
  UserCheck, ClipboardList, Settings, LogOut 
} from "lucide-react";
import { toast } from "sonner";

// UI Components
import { ParticlesBackground } from "@/components/landing/ParticlesBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

const AdminStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pageSize = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/students");
      const mentorRes = await api.get("/admin/mentors");
      setStudents(res.data);
      setMentors(mentorRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  /* ================= LOGIC ================= */
  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const deleteStudent = async (id: string) => {
    if (!confirm("Delete this student?")) return;
    try {
      await api.delete(`/admin/students/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      toast.success("Student deleted");
    } catch (err) { toast.error("Delete failed"); }
  };

  const assignMentor = async (studentId: string, mentorId: string) => {
    try {
      await api.put(`/admin/assign-mentor`, { studentId, mentorId });
      setStudents((prev) =>
        prev.map((s) => (s._id === studentId ? { ...s, mentor: mentorId } : s))
      );
      toast.success("Mentor assigned");
    } catch (err) { toast.error("Assignment failed"); }
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
            <NavItem icon={<Users size={20} />} label="Students" open={sidebarOpen} active />
            <NavItem icon={<ClipboardList size={20} />} label="Assessments" open={sidebarOpen} onClick={() => navigate("/admin/assessments")} />
            <NavItem icon={<Settings size={20} />} label="Settings" open={sidebarOpen} onClick={() => navigate("/admin/settings")} />
          </nav>

          <button onClick={logout} className="mt-auto flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto px-8 pb-8 pt-6">
          <header className="sticky top-0 z-50 mb-10">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between px-6 py-4 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
                <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">PathMentor AI</h2>
                <GlassButton variant="primary" glow className="px-6 py-2.5 rounded-xl text-xs font-bold" onClick={logout}>Sign Out</GlassButton>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto">
            {/* SEARCH & TITLE */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Student <span className="text-primary">Directory</span></h1>
                <p className="text-muted-foreground mt-1">Manage and assign mentors to your learners.</p>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            {/* TABLE */}
            <GlassCard className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-muted-foreground uppercase text-[11px] font-bold tracking-wider bg-white/[0.02]">
                    <tr>
                      <th className="px-6 py-4">Student Info</th>
                      <th className="px-6 py-4">Track</th>
                      <th className="px-6 py-4">Assigned Mentor</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginated.map((student) => (
                      <tr key={student._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{student.name}</div>
                          <div className="text-xs text-muted-foreground">{student.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[11px]">
                            {student.track || "Frontend"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={student.mentor || ""}
                            onChange={(e) => assignMentor(student._id, e.target.value)}
                            className="bg-background/50 border border-white/10 text-xs px-2 py-1.5 rounded-lg outline-none focus:border-primary transition-all w-full max-w-[160px]"
                          >
                            <option value="">No Mentor</option>
                            {mentors.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-bold">ACTIVE</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => navigate(`/admin/students/edit/${student._id}`)} className="p-2 bg-white/5 text-muted-foreground hover:text-white rounded-lg transition-all border border-white/10"><Edit3 size={16} /></button>
                            <button onClick={() => deleteStudent(student._id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/10"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-muted-foreground">Showing {paginated.length} of {filtered.length} students</p>
              <div className="flex gap-2">
                <GlassButton variant="secondary" className="px-3 py-1 h-auto" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></GlassButton>
                <div className="flex items-center px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold">{page} / {totalPages}</div>
                <GlassButton variant="secondary" className="px-3 py-1 h-auto" disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></GlassButton>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/* Reusable NavItem Component */
const NavItem = ({ icon, label, open, onClick, active }: any) => (
  <div onClick={onClick} className={`flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}>
    {icon}
    {open && <span className="font-medium">{label}</span>}
  </div>
);

export default AdminStudents;