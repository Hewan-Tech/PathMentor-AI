import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  MessageSquare,
  Star,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";
import { ParticlesBackground } from "@/components/landing/ParticlesBackground";

/* ================= MOCK ACTIVITY DATA ================= */

const activityData = [
  { name: "Mon", val: 400 },
  { name: "Tue", val: 300 },
  { name: "Wed", val: 600 },
  { name: "Thu", val: 800 },
  { name: "Fri", val: 500 },
  { name: "Sat", val: 900 },
  { name: "Sun", val: 750 },
];

/* ================= MAIN DASHBOARD ================= */

const MentorDashboard = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mentees, setMentees] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ================= AUTH + STATUS GUARD ================= */

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

  /* ================= FETCH DATA ================= */

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

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#33b6ff]/20 border-t-[#33b6ff] rounded-full animate-spin" />
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen relative bg-[#020617] text-white overflow-hidden font-sans">
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticlesBackground />

        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#33b6ff]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#a855f7]/10 rounded-full blur-[150px]" />
      </div>

      {/* NAVBAR */}
      <DashboardTopNav
        userName="Lead Mentor"
        userEmail="mentor@pathmentor.ai"
        onSignOut={() => {
          localStorage.removeItem("token");
          navigate("/auth");
        }}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* SIDEBAR */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() =>
          setSidebarCollapsed(!sidebarCollapsed)
        }
      />

      {/* MAIN */}
      <main
        className={`relative z-10 pt-28 pb-16 transition-all duration-500 ${
          sidebarCollapsed ? "lg:pl-28" : "lg:pl-80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <MainMentorView mentees={mentees} stats={stats} />
        </div>
      </main>
    </div>
  );
};

/* ================= VIEW COMPONENT ================= */

const MainMentorView = ({ mentees, stats }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="space-y-12"
  >
    {/* HEADER */}
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
          Mentor <span className="text-[#33b6ff]">Nexus</span>
        </h1>

        <p className="text-slate-400 text-xs mt-3 flex items-center gap-2 tracking-widest uppercase font-bold">
          <Activity size={14} className="text-[#33b6ff]" />
          Live Performance Analytics
        </p>
      </div>

      <div className="flex gap-4">
        <button className="px-6 py-3 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/10 transition-all font-semibold text-sm backdrop-blur-xl">
          Review Queue
        </button>

        <button className="px-6 py-3 rounded-xl bg-[#33b6ff] text-black font-bold text-sm hover:shadow-[0_0_30px_rgba(51,182,255,0.45)] transition-all">
          Assign Task
        </button>
      </div>
    </header>

    {/* GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* TOP MENTEE */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-[#33b6ff]/20 blur-[140px] rounded-full" />

        <h3 className="font-bold text-lg mb-8 flex items-center gap-2 tracking-tight">
          <Star className="text-[#33b6ff] w-5 h-5 fill-[#33b6ff]" />
          Top Performing Mentee
        </h3>

        <div className="flex items-center gap-8">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-[#33b6ff] to-[#a855f7] p-[2px]">
            <div className="w-full h-full rounded-3xl bg-[#020617] flex items-center justify-center font-extrabold text-3xl">
              {stats?.topMentee?.name?.[0] || "S"}
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-3xl tracking-tight">
              {stats?.topMentee?.name || "Neural Learner"}
            </h4>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs bg-[#33b6ff]/10 text-[#33b6ff] px-4 py-1 rounded-full font-bold uppercase tracking-wide">
                {stats?.topMentee?.score || "98"}% Mastery
              </span>

              <span className="text-xs text-slate-500 font-semibold">
                Lvl 7 Roadmap
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INQUIRIES */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl p-8 shadow-xl">
        <h3 className="font-bold text-lg mb-6 tracking-tight">
          Direct <span className="text-[#a855f7]">Inquiries</span>
        </h3>

        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <div className="p-3 rounded-xl bg-[#a855f7]/10 text-[#a855f7]">
                <MessageSquare size={18} />
              </div>

              <div>
                <h4 className="font-semibold text-sm">
                  Node Block #{i}02
                </h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Stuck on Async Patterns
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHART */}
      <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-10 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-extrabold text-3xl tracking-tight">
            Engagement <span className="text-[#33b6ff]">Neural-Flow</span>
          </h3>

          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 font-bold">
            <div className="w-3 h-3 rounded-full bg-[#33b6ff]" />
            Student Interaction Index
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#33b6ff" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#33b6ff" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontWeight: "bold",
                }}
                itemStyle={{ color: "#33b6ff" }}
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }}
              />

              <Area
                type="monotone"
                dataKey="val"
                stroke="#33b6ff"
                strokeWidth={3}
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
