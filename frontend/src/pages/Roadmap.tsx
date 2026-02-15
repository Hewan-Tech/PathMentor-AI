import { useState } from "react";
import { 
  ShieldAlert, UserCheck, BarChart3, Settings, Database, Activity, Search, 
  RefreshCw, Map, BookOpen, Briefcase, Sparkles, LineChart, CheckCircle2, 
  Sliders, LayoutDashboard, Plus, Users, MessageSquare, Clock, ChevronRight,
  Star, BrainCircuit, Zap, Upload, ArrowLeft, Lock
} from "lucide-react";
import { ResponsiveContainer, Tooltip, XAxis, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

// --- SHARED DATA ---
const roadmapLevels = [
  { level: 1, name: "Awareness", status: "completed", modules: 8, lessons: ["Introduction", "Core Concepts", "Tools Setup"] },
  { level: 2, name: "Beginner", status: "completed", modules: 12, lessons: ["Basic Syntax", "Control Flow", "Functions"] },
  { level: 3, name: "Fundamental", status: "current", modules: 15, lessons: ["OOP Concepts", "Error Handling", "Testing"] },
  { level: 4, name: "Intermediate", status: "locked", modules: 18, lessons: ["Advanced Patterns", "API Integration"] },
  { level: 5, name: "Advanced", status: "locked", modules: 20, lessons: ["System Design", "Scalability"] },
  { level: 6, name: "Proficient", status: "locked", modules: 15, lessons: ["CI/CD", "Production Deployment"] },
  { level: 7, name: "Mastery", status: "locked", modules: 10, lessons: ["Mentorship", "Technical Leadership"] },
];

const activityData = [
  { name: 'Mon', val: 400 }, { name: 'Tue', val: 300 }, { name: 'Wed', val: 600 },
  { name: 'Thu', val: 800 }, { name: 'Fri', val: 500 }, { name: 'Sat', val: 900 },
  { name: 'Sun', val: 750 },
];

// --- MAIN UNIFIED COMPONENT ---
const UnifiedDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userRole, setUserRole] = useState<"admin" | "mentor">("admin");

  // Toggle function for dev preview
  const toggleRole = () => {
    setUserRole(prev => prev === "admin" ? "mentor" : "admin");
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020617] text-white font-sans selection:bg-primary/30">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1E5350]/20 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0" />

      {/* Top Nav Mockup */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/10 bg-black/20 backdrop-blur-xl px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black font-black">P</div>
          <span className="font-black text-xl tracking-tighter">PathMentor <span className="text-primary">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleRole} className="text-xs font-bold px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all flex items-center gap-2">
            <RefreshCw size={14} /> Switching to {userRole === "admin" ? "Mentor" : "Admin"}
          </button>
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold">{userRole === 'admin' ? 'Super Admin' : 'Lead Mentor'}</p>
            <p className="text-[10px] text-primary uppercase font-black tracking-widest">{userRole}</p>
          </div>
        </div>
      </nav>

      {/* Sidebar Mockup */}
      <aside className={`fixed left-0 top-0 h-full pt-24 z-40 glass-panel border-r border-white/10 bg-black/40 transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-64"}`}>
        <div className="px-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={sidebarCollapsed} />
          <SidebarItem icon={<Map />} label={userRole === 'admin' ? "Roadmaps" : "Mentees"} active={activeTab === 'roadmap'} onClick={() => setActiveTab('roadmap')} collapsed={sidebarCollapsed} />
          <SidebarItem icon={<Briefcase />} label="Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} collapsed={sidebarCollapsed} />
          <SidebarItem icon={<Sparkles />} label="AI Insights" active={activeTab === 'ai-mentor'} onClick={() => setActiveTab('ai-mentor')} collapsed={sidebarCollapsed} />
          <SidebarItem icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} collapsed={sidebarCollapsed} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`relative z-10 pt-28 pb-12 transition-all duration-300 ${sidebarCollapsed ? "pl-24" : "pl-72"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + userRole}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {userRole === "admin" ? (
                <AdminController activeTab={activeTab} />
              ) : (
                <MentorController activeTab={activeTab} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// --- ADMIN VIEWS ---
const AdminController = ({ activeTab }: { activeTab: string }) => {
  switch (activeTab) {
    case "dashboard": return (
      <div className="space-y-8">
        <PageHeader title="System Console" subtitle="Core Platform Live" icon={<LayoutDashboard size={40} />} />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={<UserCheck />} label="Verified Mentors" value="142" trend="+12" />
          <StatCard icon={<ShieldAlert />} label="Security Flags" value="0" color="rose" />
          <StatCard icon={<BarChart3 />} label="Total Revenue" value="$14.2k" />
          <StatCard icon={<Activity />} label="Server Load" value="22%" />
        </div>
        <ActivityFeed />
      </div>
    );
    case "roadmap": return (
      <div className="space-y-8">
        <PageHeader title="Skill Architecture" subtitle="Managing 7 Mastery Levels" icon={<Map size={40} />} />
        <div className="grid gap-4">
          {roadmapLevels.map(lvl => (
            <div key={lvl.level} className="glass-panel p-6 flex justify-between items-center group hover:border-primary/40 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">L{lvl.level}</div>
                <div>
                  <h4 className="font-bold text-lg">{lvl.name}</h4>
                  <p className="text-sm text-slate-500">{lvl.modules} Global Modules</p>
                </div>
              </div>
              <button className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg font-bold text-xs hover:bg-primary hover:text-black transition-all">Edit Nodes</button>
            </div>
          ))}
        </div>
      </div>
    );
    default: return <div className="text-slate-500 italic">View under construction...</div>;
  }
};

// --- MENTOR VIEWS ---
const MentorController = ({ activeTab }: { activeTab: string }) => {
  switch (activeTab) {
    case "dashboard": return (
      <div className="space-y-8">
        <PageHeader title="Mentor Hub" subtitle="Performance Analytics" icon={<Users size={40} />} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-8 bg-primary/5 border-primary/20">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2"><Star className="text-primary" /> Top Mentee</h3>
            <div className="flex items-center gap-6 bg-white/[0.03] p-6 rounded-3xl border border-white/5">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-black font-black text-2xl">JA</div>
              <div className="flex-1">
                <h4 className="font-black text-xl">Julian Alvarez</h4>
                <p className="text-xs text-primary font-bold tracking-widest uppercase">Level 3: Fundamental • 98% Progress</p>
              </div>
              <button className="bg-white text-black px-6 py-2 rounded-xl font-black text-sm">Review</button>
            </div>
          </div>
          <div className="glass-panel p-8">
            <h3 className="font-black text-xl mb-6">Inbox</h3>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm font-medium">Inquiry #{i}20 - Blocked on L3</div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 glass-panel p-8 h-80">
            <h3 className="font-black text-xl mb-6 tracking-tighter">Student Engagement Stream</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/><stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/></linearGradient></defs>
                <Area type="monotone" dataKey="val" stroke="#2dd4bf" strokeWidth={3} fill="url(#c)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
    case "roadmap": return (
        <div className="space-y-8">
            <PageHeader title="Student Tracking" subtitle="12 Active Mentees" icon={<Users size={40} />} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Sarah J.", "Michael S.", "Elena R.", "Julian A."].map((name, i) => (
                    <div key={i} className="glass-panel p-6 flex items-center gap-4 group cursor-pointer hover:border-primary/40 transition-all">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-black text-primary border border-white/10">{name[0]}</div>
                        <div className="flex-1">
                            <h4 className="font-bold">{name}</h4>
                            <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${80 - i*15}%` }}></div>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-600 group-hover:text-primary transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    );
    case "ai-mentor": return (
        <div className="glass-panel p-12 text-center bg-primary/5 border-primary/20">
            <BrainCircuit size={60} className="text-primary mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl font-black tracking-tighter mb-4">AI Mentor Copilot</h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-8 font-medium">The AI has analyzed 400+ student interactions this week. Common blocker identified: <span className="text-white">"State Management Hooks"</span>.</p>
            <button className="bg-primary text-black px-10 py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Generate Custom Lesson</button>
        </div>
    );
    default: return <div className="text-slate-500 italic">Mentor view under construction...</div>;
  }
};

// --- UNIVERSAL COMPONENTS ---

const PageHeader = ({ title, subtitle, icon }: any) => (
  <div className="glass-panel p-10 bg-primary/5 border-primary/20 flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
    <div className="flex items-center gap-6">
      <div className="p-5 bg-primary/10 rounded-3xl text-primary border border-primary/20">{icon}</div>
      <div>
        <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{title}</h1>
        <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mt-1 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> {subtitle}
        </p>
      </div>
    </div>
    <button className="bg-white text-black px-8 py-3 rounded-xl font-black hover:bg-primary transition-colors">Global Update</button>
  </div>
);

const SidebarItem = ({ icon, label, active, onClick, collapsed }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
    {icon}
    {!collapsed && <span className="font-bold text-sm">{label}</span>}
  </button>
);

const StatCard = ({ icon, label, value, trend, color = "primary" }: any) => (
  <div className="glass-panel p-6 bg-white/[0.02] border-white/5 hover:border-white/20 transition-all group">
    <div className={`${color === 'rose' ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/10 text-primary'} w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>{icon}</div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <h3 className="text-2xl font-black">{value}</h3>
      {trend && <span className="text-[10px] text-emerald-500 font-bold">{trend}</span>}
    </div>
  </div>
);

const ActivityFeed = () => (
    <div className="glass-panel p-8 border-white/5">
        <h3 className="font-black text-xl mb-6 flex items-center gap-3"><Database className="text-primary" /> System Logs</h3>
        <div className="space-y-4 font-mono">
            {[1, 2, 3].map(i => (
                <div key={i} className="text-xs p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between">
                    <span className="text-slate-300"><span className="text-primary font-bold">INFO:</span> New User Registration Protocol Success</span>
                    <span className="text-slate-600">04:2{i} AM</span>
                </div>
            ))}
        </div>
    </div>
);

export default UnifiedDashboard;