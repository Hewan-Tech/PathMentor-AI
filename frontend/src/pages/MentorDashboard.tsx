import { useState } from "react";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { 
  Users, CheckCircle2, MessageSquare, 
  Search, TrendingUp, Upload, LayoutGrid, Zap, BookOpen,
  Star, Clock, ChevronRight, FileText, BrainCircuit
} from "lucide-react";
import { ResponsiveContainer, Tooltip, XAxis, AreaChart, Area } from 'recharts';

const activityData = [
  { name: 'Mon', val: 400 }, { name: 'Tue', val: 300 }, { name: 'Wed', val: 600 },
  { name: 'Thu', val: 800 }, { name: 'Fri', val: 500 }, { name: 'Sat', val: 900 },
  { name: 'Sun', val: 750 },
];

const MentorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // Added for navigation
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // --- NAVIGATION RENDERER ---
  const renderView = () => {
    switch (activeTab) {
      case "dashboard": return <MainMentorView />;
      case "roadmap": return <MenteesTrackingView />; // Mentors track people, not just nodes
      case "projects": return <ProjectReviewQueue />;
      case "ai-mentor": return <AIInsightsHub />;
      default: return <MainMentorView />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020617] text-white font-sans selection:bg-primary/30">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1E5350]/20 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0" />
      
      <DashboardTopNav
        userName={user.name || "Lead Mentor"}
        userEmail={user.email || "mentor@pathmentor.ai"}
        onSignOut={() => {
          localStorage.clear();
          window.location.href = "/auth";
        }}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeTab={activeTab} // Pass activeTab to Sidebar
        setActiveTab={setActiveTab} // Pass setter to Sidebar
      />

      <main className={`relative z-10 pt-24 pb-12 transition-all duration-300 ${sidebarCollapsed ? "lg:pl-24" : "lg:pl-72"}`}>
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

// --- SUB-VIEW 1: MAIN DASHBOARD ---
const MainMentorView = () => (
  <>
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Mentor Results</h1>
        <p className="text-slate-400 font-medium mt-1">Tracking performance across AI modules</p>
      </div>
      <div className="glass-panel p-2 flex items-center px-4 gap-2 bg-white/5 border-white/10">
        <Search size={18} className="text-slate-400" />
        <input type="text" placeholder="Search cohorts..." className="bg-transparent border-none focus:ring-0 text-sm font-bold text-white" />
      </div>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-panel p-8 bg-primary/5 border-primary/20 hover:border-white/20 transition-all duration-300 group">
         <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl tracking-tight flex items-center gap-2">
              <Star className="text-primary w-5 h-5" /> Top Performing Mentee
            </h3>
         </div>
         <div className="flex items-center gap-6 bg-white/[0.05] p-6 rounded-3xl border border-white/5">
            <div className="bg-gradient-to-br from-[#1E5350] to-primary p-5 rounded-2xl text-white">
              <Users size={32}/>
            </div>
            <div>
              <h4 className="font-black text-2xl">Julian Alvarez</h4>
              <p className="text-sm text-primary font-bold uppercase tracking-widest">AI Mentorship • 98% Score</p>
            </div>
            <button className="ml-auto bg-white text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-primary hover:text-white transition-all">Review</button>
         </div>
      </div>

      <div className="glass-panel p-8 bg-primary/5 border-primary/20">
         <h3 className="font-black text-xl mb-8">Recent Inquiries</h3>
         <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.05]">
                <MessageSquare size={20} className="text-primary"/>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Student Block #{i}02</h4>
                  <p className="text-xs text-slate-500">Stuck on Module 2 patterns</p>
                </div>
              </div>
            ))}
         </div>
      </div>

      <div className="lg:col-span-3 glass-panel p-10 bg-primary/5 border-primary/20">
        <h3 className="font-black text-3xl tracking-tighter mb-10">Engagement Analytics</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b' }} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 700}} />
              <Area type="monotone" dataKey="val" stroke="#2dd4bf" strokeWidth={4} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </>
);

// --- SUB-VIEW 2: MENTEES LIST ---
const MenteesTrackingView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-black tracking-tighter">Your Mentees</h2>
        <p className="text-slate-400">Manage 12 active students</p>
      </div>
      <button className="bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">Download Report</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {["Sarah Jenkins", "Michael Scott", "Elena Rodriguez", "David Kim"].map((name, i) => (
        <div key={i} className="glass-panel p-6 flex items-center gap-4 hover:border-primary/50 transition-all group">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-bold text-primary">{name[0]}</div>
          <div className="flex-1">
            <h4 className="font-bold">{name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${70 - i*10}%` }}></div>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{70 - i*10}%</span>
            </div>
          </div>
          <ChevronRight className="text-slate-600 group-hover:text-primary transition-colors" />
        </div>
      ))}
    </div>
  </div>
);

// --- SUB-VIEW 3: PROJECT REVIEWS ---
const ProjectReviewQueue = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-black tracking-tighter">Review Queue</h2>
    <div className="glass-panel overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-slate-500">
          <tr>
            <th className="p-4 font-black">Student</th>
            <th className="p-4 font-black">Project</th>
            <th className="p-4 font-black">Submitted</th>
            <th className="p-4 font-black text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {[1, 2, 3].map(i => (
            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-bold text-sm text-white">Student_ID_0{i}4</td>
              <td className="p-4 text-sm text-slate-400 font-medium">Neural Architecture v2</td>
              <td className="p-4 text-xs font-mono text-slate-500 flex items-center gap-2"><Clock size={12}/> 2h ago</td>
              <td className="p-4 text-right">
                <button className="bg-primary text-black px-4 py-1.5 rounded-lg font-black text-xs hover:scale-105 transition-transform">GRADE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- SUB-VIEW 4: AI INSIGHTS ---
const AIInsightsHub = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="glass-panel p-10 bg-primary/5 border-primary/20">
      <BrainCircuit size={40} className="text-primary mb-6" />
      <h2 className="text-3xl font-black tracking-tighter mb-4">AI Mentor Copilot</h2>
      <p className="text-slate-400 font-medium leading-relaxed">The AI has identified a common blocker in <strong>Module 4: Transformers</strong>. 65% of your mentees are struggling with "Attention Mechanisms".</p>
      <div className="mt-8 p-4 bg-black/40 rounded-2xl border border-white/5">
        <h4 className="text-xs font-black uppercase text-primary mb-2">Recommended Action</h4>
        <p className="text-sm text-slate-200">Push a supplementary video lesson on "Self-Attention Visualized".</p>
      </div>
      <button className="w-full mt-6 py-4 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-2">
        <Upload size={18} /> Push Supplementary Content
      </button>
    </div>
    
    <div className="space-y-4">
      <h3 className="font-black text-lg flex items-center gap-2"><FileText size={20} className="text-slate-400" /> System Reports</h3>
      {[1, 2, 3].map(i => (
        <div key={i} className="glass-panel p-5 flex justify-between items-center group cursor-pointer hover:bg-white/5 transition-all">
          <span className="font-bold text-slate-300">Weekly Performance Report - Jan W{i}</span>
          <div className="bg-white/10 p-2 rounded-lg group-hover:bg-primary/20 group-hover:text-primary transition-all">
            <LayoutGrid size={16} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default MentorDashboard;