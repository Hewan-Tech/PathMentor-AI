import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Bell, CheckCircle2, MessageSquare, Mail, AlertTriangle } from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "n1", title: "New student message", detail: "Abel has asked a question on React state.", read: false, icon: MessageSquare },
    { id: "n2", title: "Assignment submitted", detail: "Selam uploaded her backend lab.", read: true, icon: Mail },
    { id: "n3", title: "Review reminder", detail: "Project feedback is due tomorrow.", read: false, icon: AlertTriangle },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth");
  }, [navigate]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    <div className="min-h-screen relative bg-[#020617] text-white overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,0,123,0.18),_transparent_45%)]" />
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
        activeView="notifications"
      />
      <main className={`relative z-10 pt-28 pb-16 transition-all duration-300 ${sidebarCollapsed ? "lg:pl-28" : "lg:pl-80"}`}>
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#33b6ff]">Notification center</p>
              <h1 className="text-4xl font-extrabold">Stay up to date</h1>
              <p className="text-white/60 mt-2">Review unread alerts and keep student communication flowing.</p>
            </div>
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#33b6ff] px-5 py-3 font-semibold text-black transition hover:bg-[#2aa0e8]"
            >
              <CheckCircle2 size={18} />
              Mark all read
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`rounded-3xl border px-5 py-5 transition ${notification.read ? "border-white/10 bg-white/5" : "border-[#33b6ff]/30 bg-[#33b6ff]/10 shadow-lg shadow-[#33b6ff]/10"}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Icon className="text-[#33b6ff]" />
                        <div>
                          <h2 className="text-lg font-semibold">{notification.title}</h2>
                          <p className="text-sm text-white/60">{notification.detail}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${notification.read ? "bg-white/10 text-white/70" : "bg-[#33b6ff] text-black"}`}>
                        {notification.read ? "Read" : "New"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3 text-[#33b6ff] mb-4"><Bell size={20} /></div>
            <h2 className="text-2xl font-semibold">Notifications workflow</h2>
            <p className="mt-3 text-white/60">Use smart notification filters to focus on priority alerts. This page is designed to help you act quickly while keeping student communication organized.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
