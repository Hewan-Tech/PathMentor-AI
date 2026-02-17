import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api"; // Updated to use your local api service
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  Users, MessageSquare,
  Search, Upload, Star, 
  Clock, ChevronRight,
  BrainCircuit, Activity,
  TrendingUp
} from "lucide-react";
import { ResponsiveContainer, Tooltip, XAxis, AreaChart, Area } from "recharts";
import { motion } from "framer-motion";
import { ParticlesBackground } from "@/components/landing/ParticlesBackground";

const activityData = [
  { name: "Mon", val: 400 },
  { name: "Tue", val: 300 },
  { name: "Wed", val: 600 },
  { name: "Thu", val: 800 },
  { name: "Fri", val: 500 },
  { name: "Sat", val: 900 },
  { name: "Sun", val: 750 },
];

const MentorDashboard = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mentees, setMentees] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. APPROVAL STATUS GUARD
  useEffect(() => {
    const checkAuthAndStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        const res = await api.get("/users/profile");
        const user = res.data.user;

        if (user.role !== "mentor") {
          navigate("/dashboard");
          return;
        }

        // 🚨 Redirect if not approved
        if (user.status !== "approved") {
          navigate("/mentor/pending");
          return;
        }

        fetchMentorData();
      } catch (err) {
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndStatus();
  }, [navigate]);

  const fetchMentorData = async () => {
    try {
      const res = await api.get("/mentor/dashboard");
      setMentees(res.data.mentees || []);
      setReviews(res.data.reviews || []);
      setStats(res.data.stats || null);
    } catch (err) {
      console.error("Failed to load mentor data");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-[#33b6ff]/20 border-t-[#33b6ff] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen relative bg-[#020617] text-white font-sans overflow-hidden">
      {/* MASTERY BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ParticlesBackground />
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#33b6ff]/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#a855f7]/10 rounded-full blur-[150px] animate-pulse" />
      </div>

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
      />

      <main className={`relative z-10 pt-28 pb-12 transition-all duration-500 ${sidebarCollapsed ? "lg:pl-28" : "lg:pl-80"}`}>
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <MainMentorView mentees={mentees} stats={stats} />
        </div>
      </main>
    </div>
  );
};

/* ================= COMPONENT VIEWS (Styled with Milky Glass) ================= */

const MainMentorView = ({ mentees, stats }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-5xl font-black tracking-tighter">Mentor <span className="text-[#33b6ff]">Nexus</span></h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 flex items-center gap-2">
          <Activity size={14} className="text-[#33b6ff]" /> Live Performance Analytics
        </p>
      </div>
      <div className="flex gap-3">
        <button className="px-6 py-3 rounded-2xl bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-all font-bold text-sm">Review Queue</button>
        <button className="px-6 py-3 rounded-2xl bg-[#33b6ff] text-black font-black text-sm hover:shadow-[0_0_20px_rgba(51,182,255,0.4)] transition-all">Assign Task</button>
      </div>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Top Mentee Card */}
      <div className="lg:col-span-2 bg-white/[0.08] backdrop-blur-3xl border border-white/20 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} className="text-[#33b6ff]" />
        </div>
        <h3 className="font-black text-xl mb-8 flex items-center gap-2 tracking-tight">
          <Star className="text-[#33b6ff] w-5 h-5 fill-[#33b6ff]" /> Top Performing Mentee
        </h3>

        <div className="flex items-center gap-8">
          <div className="h-24 w-24 rounded-[30px] bg-gradient-to-tr from-[#33b6ff] to-[#a855f7] p-[2px]">
             <div className="w-full h-full rounded-[28px] bg-[#020617] flex items-center justify-center font-black text-3xl">
                {stats?.topMentee?.name?.[0] || "S"}
             </div>
          </div>
          <div>
            <h4 className="font-black text-3xl tracking-tighter">
              {stats?.topMentee?.name || "Neural Learner"}
            </h4>
            <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-[#33b6ff]/10 text-[#33b6ff] px-3 py-1 rounded-full font-black uppercase tracking-tighter">
                  {stats?.topMentee?.score || "98"}% Mastery
                </span>
                <span className="text-xs text-slate-500 font-bold">Lvl 7 Roadmap</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Cards */}
      <div className="bg-white/[0.08] backdrop-blur-3xl border border-white/20 p-8 rounded-[40px] shadow-2xl">
        <h3 className="font-black text-xl mb-8 tracking-tight">Direct <span className="text-[#a855f7]">Inquiries</span></h3>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="p-3 rounded-xl bg-[#a855f7]/10 text-[#a855f7] group-hover:scale-110 transition-transform">
                <MessageSquare size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Node Block #{i}02</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Stuck on Async Patterns</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="lg:col-span-3 bg-white/[0.08] backdrop-blur-3xl border border-white/20 p-10 rounded-[40px] shadow-2xl">
        <div className="flex justify-between items-center mb-10">
            <h3 className="font-black text-3xl tracking-tighter">Engagement <span className="text-[#33b6ff]">Neural-Flow</span></h3>
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#33b6ff]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Student Interaction Index</span>
            </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#33b6ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#33b6ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontWeight: 'bold' }}
                itemStyle={{ color: '#33b6ff' }}
              />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
              <Area
                type="monotone"
                dataKey="val"
                stroke="#33b6ff"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorVal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </motion.div>
);

export default MentorDashboard;