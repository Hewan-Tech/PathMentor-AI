import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Calendar, Clock, MapPin, CheckCircle2 } from "lucide-react";

const Schedule = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [meetings] = useState([
    { id: "m1", title: "Live coding session", date: "May 12", time: "10:00 AM", location: "Zoom" },
    { id: "m2", title: "Office hours", date: "May 14", time: "2:00 PM", location: "Discord" },
    { id: "m3", title: "Project review", date: "May 18", time: "5:00 PM", location: "Google Meet" },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth");
  }, [navigate]);

  return (
    <div className="min-h-screen relative bg-[#020617] text-white overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(51,182,255,0.3),_transparent_45%)]" />
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
        activeView="schedule"
      />
      <main className={`relative z-10 pt-28 pb-16 transition-all duration-300 ${sidebarCollapsed ? "lg:pl-28" : "lg:pl-80"}`}>
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#33b6ff]">Weekly calendar</p>
              <h1 className="text-4xl font-extrabold">Your teaching schedule</h1>
              <p className="text-white/60 mt-2">Plan sessions, office hours, and review meetings in one place.</p>
            </div>
            <button
              onClick={() => navigate("/mentor/assignments")}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#33b6ff] px-5 py-3 font-semibold text-black transition hover:bg-[#2aa0e8]"
            >
              <Clock size={18} />
              Add session
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Upcoming sessions</h2>
                <p className="text-white/50">Stay on top of your mentor calendar.</p>
              </div>
              <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-950/80 px-4 py-3">
                <Calendar className="text-[#33b6ff]" />
                <span className="text-sm text-white/70">Week of May 12</span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-sm text-white/50">{meeting.date}</span>
                    <span className="rounded-full bg-[#33b6ff]/15 px-3 py-1 text-xs text-[#33b6ff]">{meeting.time}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{meeting.title}</h3>
                  <p className="mt-3 text-white/60">Location: {meeting.location}</p>
                  <button
                    onClick={() => navigate("/mentor/messages")}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    <MapPin size={18} />
                    View details
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-[#33b6ff] mb-4"><Clock size={20} /></div>
              <h2 className="text-2xl font-semibold">Next meeting</h2>
              <p className="mt-3 text-white/60">Live coding session on React component patterns.</p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#33b6ff]/10 px-4 py-2 text-sm text-[#33b6ff]">
                <CheckCircle2 size={16} />
                Confirmed
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-[#33b6ff] mb-4"><Calendar size={20} /></div>
              <h2 className="text-2xl font-semibold">Planning notes</h2>
              <p className="mt-3 text-white/60">Use the schedule page to align sessions with student milestones.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;
