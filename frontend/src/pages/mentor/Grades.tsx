import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Award, TrendingUp, BarChart3, FileText } from "lucide-react";

const Grades = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [gradeFilter, setGradeFilter] = useState("all");

  const gradeRecords = useMemo(
    () => [
      { student: "Abel Tesfaye", course: "React Mastery", grade: "A+", status: "Excellent" },
      { student: "Selam Worku", course: "Node.js Backend", grade: "B+", status: "Improving" },
      { student: "Hana Mekonnen", course: "UI/UX Design", grade: "A", status: "Strong" },
      { student: "Daniel Abraham", course: "Python AI", grade: "B", status: "Needs review" },
    ],
    []
  );

  const filteredRecords = useMemo(
    () =>
      gradeRecords.filter((record) => gradeFilter === "all" || record.grade.startsWith(gradeFilter)),
    [gradeFilter, gradeRecords]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth");
  }, [navigate]);

  return (
    <div className="min-h-screen relative bg-[#020617] text-white overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,199,44,0.22),_transparent_45%)]" />
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
        activeView="grades"
      />
      <main className={`relative z-10 pt-28 pb-16 transition-all duration-300 ${sidebarCollapsed ? "lg:pl-28" : "lg:pl-80"}`}>
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#33b6ff]">Grades dashboard</p>
              <h1 className="text-4xl font-extrabold">Assess student performance</h1>
              <p className="text-white/60 mt-2">Review grade trends, award badges, and publish progress reports.</p>
            </div>
            <button
              onClick={() => navigate("/mentor/assignments")}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#33b6ff] px-5 py-3 font-semibold text-black transition hover:bg-[#2aa0e8]"
            >
              <FileText size={18} />
              Open assignments
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-[#33b6ff] mb-3"><Award size={20} /></div>
              <p className="text-sm text-white/50">Top grade this week</p>
              <h2 className="text-3xl font-semibold">A+</h2>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-[#33b6ff] mb-3"><TrendingUp size={20} /></div>
              <p className="text-sm text-white/50">Average performance</p>
              <h2 className="text-3xl font-semibold">88%</h2>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-[#33b6ff] mb-3"><BarChart3 size={20} /></div>
              <p className="text-sm text-white/50">Students above target</p>
              <h2 className="text-3xl font-semibold">3/4</h2>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold">Grade records</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGradeFilter("all")}
                  className={`rounded-2xl px-4 py-2 text-sm transition ${gradeFilter === "all" ? "bg-[#33b6ff] text-black" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setGradeFilter("A")}
                  className={`rounded-2xl px-4 py-2 text-sm transition ${gradeFilter === "A" ? "bg-[#33b6ff] text-black" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
                >
                  A+
                </button>
                <button
                  onClick={() => setGradeFilter("B")}
                  className={`rounded-2xl px-4 py-2 text-sm transition ${gradeFilter === "B" ? "bg-[#33b6ff] text-black" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
                >
                  B+
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-white/80">
                <thead>
                  <tr className="border-b border-white/10 text-white/70">
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRecords.map((record) => (
                    <tr key={record.student} className="hover:bg-white/5 transition">
                      <td className="px-4 py-4 font-medium">{record.student}</td>
                      <td className="px-4 py-4">{record.course}</td>
                      <td className="px-4 py-4 text-[#33b6ff]">{record.grade}</td>
                      <td className="px-4 py-4">{record.status}</td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => navigate("/mentor/students")}
                          className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 hover:bg-white/15"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Grades;
