import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { motion } from "framer-motion";
import { ParticlesBackground } from "@/components/landing/ParticlesBackground";
import { MessageSquare, Star, Activity, X } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

/* ================= ACTIVITY DATA ================= */

const activityData = [
  { name: "Mon", value: 40 },
  { name: "Tue", value: 60 },
  { name: "Wed", value: 30 },
  { name: "Thu", value: 80 },
  { name: "Fri", value: 55 },
  { name: "Sat", value: 90 },
  { name: "Sun", value: 70 },
];

/* ================= REVIEW QUEUE DATA ================= */

const reviewQueue = [
  {
    id: 1,
    student: "Abel Tesfaye",
    avatar: "https://i.pravatar.cc/100?img=12",
    course: "React Mastery",
    rating: 5,
    comment: "Amazing teaching style! Very clear and practical.",
  },
  {
    id: 2,
    student: "Selam Worku",
    avatar: "https://i.pravatar.cc/100?img=5",
    course: "Node.js Backend",
    rating: 4,
    comment: "Good content but more real-world examples needed.",
  },
  {
    id: 3,
    student: "Hana Mekonnen",
    avatar: "https://i.pravatar.cc/100?img=8",
    course: "UI/UX Design",
    rating: 5,
    comment: "Loved the explanations and design breakdowns!",
  },
];

/* ================= MAIN DASHBOARD ================= */

const MentorDashboard = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        const res = await api.get("/users/profile");
        const user = res.data?.user;

        console.log("USER FROM API:", user); // 🔍 DEBUG (remove later)

        const role = user?.role?.toLowerCase().trim();

        if (!user || role !== "mentor") {
          navigate("/auth"); // 🔥 FIXED (better than /dashboard)
          return;
        }
      } catch (err) {
        console.log("AUTH ERROR:", err);
        navigate("/auth");
        return;
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#33b6ff]/20 border-t-[#33b6ff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-[#020617] text-white overflow-hidden">

      {/* PARTICLES */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticlesBackground />
      </div>

      {/* HERO BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-[420px] z-0">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=80"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617]/80 to-[#020617]" />
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
        onToggleCollapse={() =>
          setSidebarCollapsed(!sidebarCollapsed)
        }
      />

      <main
        className={`relative z-10 pt-28 pb-16 transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-28" : "lg:pl-80"
        }`}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-10 pt-10">

          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h1 className="text-5xl font-extrabold">
              Welcome back,{" "}
              <span className="text-[#33b6ff]">Mentor</span>
            </h1>

            <p className="text-white/60">
              Manage your students, courses, and teaching activity
            </p>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => navigate("/mentor/courses")}
                className="px-6 py-3 bg-[#33b6ff] text-black font-bold rounded-xl hover:shadow-[0_0_25px_rgba(51,182,255,0.4)] transition"
              >
                My Classes
              </button>

              <button
                onClick={() => navigate("/mentor/projects")}
                className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
              >
                Projects & Quizzes
              </button>

              <button
                onClick={() => setShowReviews(true)}
                className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
              >
                Review Queue
              </button>
            </div>
          </motion.div>

          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-6">
            <div
  onClick={() => navigate("/mentor/messages?filter=unread")}
  className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 
             cursor-pointer transition hover:scale-[1.03] 
             hover:bg-[#33b6ff]/10 active:scale-[0.98]"
>
  <MessageSquare className="mb-3 text-[#33b6ff]" />

  <h3 className="text-xl font-bold">24</h3>
  <p className="text-white/60">New Messages</p>
</div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10">
              <Star className="mb-3 text-[#33b6ff]" />
              <h3 className="text-xl font-bold">4.8</h3>
              <p className="text-white/60">Average Rating</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10">
              <Activity className="mb-3 text-[#33b6ff]" />
              <h3 className="text-xl font-bold">78%</h3>
              <p className="text-white/60">Engagement</p>
            </div>
          </div>

          {/* CHART */}
          <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10">
            <h2 className="text-xl font-bold mb-4">
              Weekly Activity
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={activityData}>
                <XAxis dataKey="name" stroke="#888" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#33b6ff"
                  fill="#33b6ff33"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>
      </main>

      {/* REVIEW MODAL */}
      {showReviews && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#0b1220] border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">⭐ Review Queue</h2>
              <button
                onClick={() => setShowReviews(false)}
                className="p-2 bg-white/10 rounded-lg"
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              {reviewQueue.map((r) => (
                <div
                  key={r.id}
                  className="p-4 bg-white/[0.04] border border-white/10 rounded-xl flex gap-4"
                >
                  <img src={r.avatar} className="w-12 h-12 rounded-full" />

                  <div>
                    <h3 className="font-semibold">{r.student}</h3>
                    <p className="text-white/50 text-sm">{r.course}</p>
                    <p className="text-white/70 text-sm mt-1">{r.comment}</p>
                    <p className="text-yellow-400 text-sm mt-1">
                      ⭐ {r.rating}/5
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MentorDashboard; 