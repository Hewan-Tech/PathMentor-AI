import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  Users, MessageSquare,
  Search, Upload, LayoutGrid,
  Star, Clock, ChevronRight,
  FileText, BrainCircuit
} from "lucide-react";
import { ResponsiveContainer, Tooltip, XAxis, AreaChart, Area } from "recharts";

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

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");



  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    if (user.role !== "mentor") {
      navigate("/dashboard");
      return;
    }

    fetchMentorData();
  }, []);

  const fetchMentorData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/mentor/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMentees(res.data.mentees || []);
      setReviews(res.data.reviews || []);
      setStats(res.data.stats || null);
    } catch (err) {
      console.error("Failed to load mentor data");
    }
  };

  const renderView = () => {
    switch (activeTab) {
      case "dashboard":
        return <MainMentorView mentees={mentees} stats={stats} />;
      case "roadmap":
        return <MenteesTrackingView mentees={mentees} />;
      case "projects":
        return <ProjectReviewQueue reviews={reviews} />;
      case "ai-mentor":
        return <AIInsightsHub />;
      default:
        return <MainMentorView mentees={mentees} stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020617] text-white font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1E5350]/20 blur-[140px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />

      <DashboardTopNav
        userName={user.name || "Lead Mentor"}
        userEmail={user.email || "mentor@pathmentor.ai"}
        onSignOut={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
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

      <main
        className={`relative z-10 pt-24 pb-12 transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-24" : "lg:pl-72"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

/* ================= MAIN DASHBOARD ================= */

const MainMentorView = ({ mentees, stats }: any) => (
  <>
    <header className="flex justify-between">
      <div>
        <h1 className="text-4xl font-black">Mentor Results</h1>
        <p className="text-slate-400">Tracking performance</p>
      </div>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-panel p-8 bg-primary/5 border-primary/20">
        <h3 className="font-black text-xl mb-6 flex items-center gap-2">
          <Star className="text-primary w-5 h-5" /> Top Performing Mentee
        </h3>

        {stats?.topMentee ? (
          <div className="flex items-center gap-6 bg-white/[0.05] p-6 rounded-3xl">
            <div className="bg-primary p-5 rounded-2xl">
              <Users size={32} />
            </div>
            <div>
              <h4 className="font-black text-2xl">
                {stats.topMentee.name}
              </h4>
              <p className="text-sm text-primary font-bold uppercase">
                {stats.topMentee.score}% Score
              </p>
            </div>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>

      <div className="glass-panel p-8 bg-primary/5 border-primary/20">
        <h3 className="font-black text-xl mb-8">Recent Inquiries</h3>
        <div className="space-y-4">
          {[1, 2].map((i)  => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-2xl"
            >
              <MessageSquare size={20} className="text-primary" />
              <div>
                <h4 className="font-bold text-sm">Student Block #{i}02</h4>
                  <p className="text-xs text-slate-500">Stuck on Module 2 patterns</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3 glass-panel p-10 bg-primary/5 border-primary/20">
        <h3 className="font-black text-3xl mb-10">Engagement Analytics</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <Tooltip />
              <XAxis dataKey="name" />
              <Area
                type="monotone"
                dataKey="val"
                stroke="#2dd4bf"
                fillOpacity={0.2}
                fill="#2dd4bf"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </>
);

/* ================= MENTEES ================= */

const MenteesTrackingView = ({ mentees }: any) => (
  <div className="space-y-6">
    <h2 className="text-3xl font-black">Your Mentees</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mentees.map((student: any, i: number) => (
        <div key={i} className="glass-panel p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary">
            {student.name[0]}
          </div>
          <div className="flex-1">
            <h4 className="font-bold">{student.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${student.progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-slate-500">
                {student.progress}%
              </span>
            </div>
          </div>
          <ChevronRight className="text-slate-600" />
        </div>
      ))}
    </div>
  </div>
);

/* ================= REVIEWS ================= */

const ProjectReviewQueue = ({ reviews }: any) => (
  <div className="space-y-6">
    <h2 className="text-3xl font-black">Review Queue</h2>

    <div className="glass-panel overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-xs text-slate-500">
          <tr>
            <th className="p-4">Student</th>
            <th className="p-4">Project</th>
            <th className="p-4">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review: any, i: number) => (
            <tr key={i} className="border-t border-white/5">
              <td className="p-4">{review.studentName}</td>
              <td className="p-4">{review.projectTitle}</td>
              <td className="p-4 text-xs flex items-center gap-2">
                <Clock size={12} />
                {review.submittedAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ================= AI ================= */

const AIInsightsHub = () => (
  <div className="glass-panel p-10 bg-primary/5 border-primary/20">
    <BrainCircuit size={40} className="text-primary mb-6" />
    <h2 className="text-3xl font-black mb-4">AI Mentor Copilot</h2>
    <button className="w-full mt-6 py-4 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-2">
      <Upload size={18} /> Push Supplementary Content
    </button>
  </div>
);

export default MentorDashboard;
