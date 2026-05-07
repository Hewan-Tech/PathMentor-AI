import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ClipboardCheck, Plus, Clock, CheckCircle2 } from "lucide-react";

const Assignments = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [assignments, setAssignments] = useState([
    { id: "a1", title: "React component workshop", due: "2026-05-14", status: "Open" },
    { id: "a2", title: "API integration lab", due: "2026-05-18", status: "Review" },
    { id: "a3", title: "UI accessibility audit", due: "2026-05-24", status: "Draft" },
  ]);
  const [form, setForm] = useState({ title: "", due: "", description: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth");
  }, [navigate]);

  const addAssignment = () => {
    if (!form.title || !form.due) return;
    setAssignments((prev) => [
      ...prev,
      { id: `a${prev.length + 1}`, title: form.title, due: form.due, status: "Open" },
    ]);
    setForm({ title: "", due: "", description: "" });
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen relative bg-[#020617] text-white overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(51,182,255,0.25),_transparent_45%)]" />
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
        activeView="assignments"
      />
      <main className={`relative z-10 pt-28 pb-16 transition-all duration-300 ${sidebarCollapsed ? "lg:pl-28" : "lg:pl-80"}`}>
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#33b6ff]">Assignment hub</p>
              <h1 className="text-4xl font-extrabold">Create and manage tasks</h1>
              <p className="text-white/60 mt-2">Keep deadlines, review status, and student handoffs all in one place.</p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#33b6ff] px-5 py-3 font-semibold text-black transition hover:bg-[#2aa0e8]"
            >
              <Plus size={18} />
              New assignment
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {assignments.map((assignment) => (
              <motion.div
                key={assignment.id}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{assignment.title}</h2>
                    <p className="text-sm text-white/50">Due {assignment.due}</p>
                  </div>
                  <span className="rounded-full bg-[#33b6ff]/15 px-3 py-1 text-xs font-semibold text-[#33b6ff]">
                    {assignment.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Clock size={18} />
                  <span>Deadline planning made easy</span>
                </div>
                <button
                  onClick={() => navigate("/mentor/grades")}
                  className="mt-6 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Publish grading
                </button>
              </motion.div>
            ))}
          </div>

          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="w-full max-w-2xl rounded-3xl bg-[#0b1220] border border-white/10 p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">New assignment</h2>
                    <p className="text-white/50">Create practice tasks for students.</p>
                  </div>
                  <button onClick={() => setModalOpen(false)} className="text-white/50 hover:text-white">✕</button>
                </div>
                <div className="grid gap-4">
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Assignment title"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                  />
                  <input
                    type="date"
                    value={form.due}
                    onChange={(e) => setForm({ ...form, due: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                  />
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Description"
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                  />
                  <button
                    onClick={addAssignment}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#33b6ff] px-5 py-3 font-semibold text-black transition hover:bg-[#2aa0e8]"
                  >
                    <CheckCircle2 size={18} />
                    Publish assignment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Assignments;
