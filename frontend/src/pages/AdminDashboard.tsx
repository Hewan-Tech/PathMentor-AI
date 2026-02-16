import { useState } from "react";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  ShieldAlert, UserCheck, BarChart3,
  Activity, RefreshCw,
  Briefcase, Sparkles,
  LayoutDashboard, Users, MessageSquare
} from "lucide-react";

const UnifiedDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userRole, setUserRole] = useState<"admin" | "mentor">("admin");

  const renderView = () => {
    if (userRole === "admin") {
      switch (activeTab) {
        case "dashboard": return <AdminDashboardView />;
        case "roadmap": return <RoadmapView />;
        case "lessons": return <LessonsView />;
        case "settings": return <SettingsView />;
        default: return <AdminDashboardView />;
      }
    } else {
      switch (activeTab) {
        case "dashboard": return <MentorDashboardView />;
        case "projects": return <MentorProjectsView />;
        case "ai-mentor": return <MentorInsightsView />;
        default: return <MentorDashboardView />;
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020617] text-white font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1E5350]/10 blur-[140px]" />

      <DashboardTopNav
  userName={userRole === "admin" ? "Super Admin" : "Lead Mentor"}
  userEmail={userRole === "admin" ? "admin@platform.com" : "mentor@platform.com"}
  role={userRole === "admin" ? "Admin" : "Mentor"}
  onSignOut={() => {
    console.log("Signed out");
  }}
  onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
/>

      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className={`pt-24 pb-12 transition-all ${sidebarCollapsed ? "lg:pl-24" : "lg:pl-72"}`}>
        <div className="max-w-7xl mx-auto px-6 space-y-8">

          <div className="flex justify-end">
            <button
              onClick={() => setUserRole(userRole === "admin" ? "mentor" : "admin")}
              className="glass-panel px-4 py-2 text-xs font-bold border-primary/30 flex items-center gap-2"
            >
              <RefreshCw size={14} /> Switch to {userRole === "admin" ? "Mentor" : "Admin"}
            </button>
          </div>

          {renderView()}
        </div>
      </main>
    </div>
  );
};

/* ================= ADMIN ================= */

const AdminDashboardView = () => (
  <>
    <PageHeader title="System Console" subtitle="Global Platform Control" icon={<LayoutDashboard size={40} />} />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <AdminStat icon={<UserCheck />} label="Verified Mentors" value="142" />
      <AdminStat icon={<ShieldAlert />} label="Security Flags" value="0" color="rose" />
      <AdminStat icon={<BarChart3 />} label="Total Revenue" value="$14.2k" />
      <AdminStat icon={<Activity />} label="Server Load" value="22%" />
    </div>
    <ActivityFeed />
  </>
);

/* ================= MENTOR ================= */

const MentorDashboardView = () => (
  <>
    <PageHeader title="Mentor Hub" subtitle="Active Student Success" icon={<Users size={40} />} />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <AdminStat icon={<Users />} label="Assigned Students" value="24" />
      <AdminStat icon={<Briefcase />} label="Reviews Pending" value="7" color="rose" />
      <AdminStat icon={<MessageSquare />} label="Unread Messages" value="12" color="emerald" />
    </div>
  </>
);

const MentorProjectsView = () => (
  <>
    <PageHeader title="Project Review" subtitle="Awaiting Assessment" icon={<Briefcase size={40} />} />
    <div className="glass-panel p-6 border-rose-500/20 bg-rose-500/5">
      <p>You have 7 projects waiting review</p>
    </div>
  </>
);

const MentorInsightsView = () => (
  <>
    <PageHeader title="AI Assistant" subtitle="Mentor Copilot Tools" icon={<Sparkles size={40} />} />
    <div className="glass-panel p-10 text-center">
      <h3 className="text-2xl font-black">Generate Student Reports</h3>
    </div>
  </>
);

/* ================= SHARED ================= */

const PageHeader = ({ title, subtitle, icon }: any) => (
  <header className="mb-8">
    <div className="glass-panel p-10 bg-primary/5 border-primary/20 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-6">
        <div className="p-5 bg-primary/10 rounded-3xl text-primary border border-primary/20">
          {icon}
        </div>
        <div>
          <h1 className="text-4xl font-black">{title}</h1>
          <p className="text-emerald-400 text-sm uppercase mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  </header>
);

const AdminStat = ({ icon, label, value, color = "primary" }: any) => (
  <div className="glass-panel p-6">
    <div className="mb-4">{icon}</div>
    <p className="text-xs text-slate-400">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

/* ======= MISSING COMPONENTS FIXED ======= */

const RoadmapView = () => <div className="glass-panel p-6">Roadmap View</div>;
const LessonsView = () => <div className="glass-panel p-6">Lessons View</div>;
const SettingsView = () => <div className="glass-panel p-6">Settings View</div>;
const ActivityFeed = () => <div className="glass-panel p-6">Recent Activity Feed</div>;

export default UnifiedDashboard;
