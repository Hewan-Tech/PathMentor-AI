import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Search, Users, Award, BarChart3, MessageSquare } from "lucide-react";

const Students = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [students] = useState([
    { id: "1", name: "Abel Tesfaye", course: "React Mastery", progress: 92, grade: "A+" },
    { id: "2", name: "Selam Worku", course: "Node.js Backend", progress: 78, grade: "B+" },
    { id: "3", name: "Hana Mekonnen", course: "UI/UX Design", progress: 84, grade: "A" },
    { id: "4", name: "Daniel Abraham", course: "Python AI", progress: 65, grade: "B" },
  ]);

  const filteredStudents = useMemo(
    () =>
      students.filter((student) =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.course.toLowerCase().includes(search.toLowerCase())
      ),
    [search, students]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth");
  }, [navigate]);

  return (
    <div className="min-h-screen relative bg-[#020617] text-white overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(51,182,255,0.35),_transparent_45%)]" />
      <DashboardTopNav
        userName="Lead Mentor"
        userEmail="mentor@pathmentor.ai"
        onSignOut={() => {
          localStorage.removeItem("token");
          navigate("/auth");
        }}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeView="students"
      />
      <main className={`relative z-10 pt-28 pb-16 transition-all duration-300 ${sidebarCollapsed ? "lg:pl-28" : "lg:pl-80"}`}>
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#33b6ff]">Mentor control</p>
              <h1 className="text-4xl font-extrabold">Student roster</h1>
              <p className="text-white/60 mt-2">Quickly review student progress, grades, and current courses.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3">
                <Users className="text-[#33b6ff]" />
                <div>
                  <div className="text-xs text-white/50">Total students</div>
                  <div className="text-xl font-semibold">{students.length}</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3">
                <Award className="text-[#33b6ff]" />
                <div>
                  <div className="text-xs text-white/50">Top grade</div>
                  <div className="text-xl font-semibold">A+</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950/70 px-4 py-3">
                <Search className="text-white/50" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search students or courses"
                  className="w-full bg-transparent outline-none text-white placeholder:text-white/40"
                />
              </div>
              <button
                onClick={() => navigate("/mentor/messages")}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#33b6ff] px-5 py-3 font-semibold text-black transition hover:bg-[#2aa0e8]"
              >
                <MessageSquare size={18} />
                Contact students
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredStudents.map((student) => (
              <motion.div
                key={student.id}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{student.name}</h2>
                    <p className="text-sm text-white/50">{student.course}</p>
                  </div>
                  <span className="rounded-full bg-[#33b6ff]/15 px-3 py-1 text-xs font-semibold text-[#33b6ff]">{student.grade}</span>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl bg-slate-950/80 p-4">
                    <div className="flex justify-between text-sm text-white/60 mb-2">
                      <span>Progress</span>
                      <span>{student.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-[#33b6ff]" style={{ width: `${student.progress}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/mentor/student/${student.id}`)}
                    className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    View profile
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Students;
