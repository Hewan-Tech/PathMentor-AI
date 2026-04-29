import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ParticlesBackground } from "@/components/landing/ParticlesBackground";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  FileText,
  BadgeCheck,
  Mail,
  User,
  Briefcase,
  CalendarDays,
  RefreshCcw,
  LogOut,
} from "lucide-react";

const MentorPendingDashboard = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [mentor, setMentor] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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

      // If approved go to real mentor dashboard
      if (user.mentorVerification?.status === "approved") {
        navigate("/mentor/dashboard");
        return;
      }

      setMentor(user);
    } catch (error) {
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const getStatusUI = () => {
    const status = mentor?.mentorVerification?.status;

    if (status === "approved") {
      return {
        text: "Approved",
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        icon: <CheckCircle2 size={18} />,
      };
    }

    if (status === "rejected") {
      return {
        text: "Rejected",
        color: "text-red-400",
        bg: "bg-red-400/10",
        icon: <XCircle size={18} />,
      };
    }

    return {
      text: "Pending Review",
      color: "text-[#33b6ff]",
      bg: "bg-[#33b6ff]/10",
      icon: <Clock3 size={18} />,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#33b6ff]/20 border-t-[#33b6ff] rounded-full animate-spin" />
      </div>
    );
  }

  const status = getStatusUI();

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 inset-0 z-0 pointer-events-none">
        <ParticlesBackground />

        <div className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-[#33b6ff]/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-[#a855f7]/10 rounded-full blur-[180px]" />
      </div>

      {/* Top Nav */}
      <DashboardTopNav
        userName={mentor?.name || "Mentor"}
        userEmail={mentor?.email || "mentor@email.com"}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        onSignOut={logout}
      />

      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() =>
          setSidebarCollapsed(!sidebarCollapsed)
        }
      />

      {/* Main */}
      <main
        className={`relative z-10 pt-28 pb-16 transition-all duration-500 ${
          sidebarCollapsed ? "lg:pl-28" : "lg:pl-80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight">
                Mentor <span className="text-[#33b6ff]">Approval</span>
              </h1>

              <p className="text-slate-400 mt-3 uppercase tracking-widest text-xs font-bold">
                Submitted Application Dashboard
              </p>
            </div>

            <button
              onClick={loadData}
              className="px-5 py-3 rounded-xl bg-[#33b6ff] text-black font-bold flex items-center gap-2 hover:shadow-[0_0_25px_rgba(51,182,255,0.45)]"
            >
              <RefreshCcw size={16} />
              Refresh Status
            </button>
          </motion.div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#33b6ff] to-[#a855f7] p-[2px]">
                  <div className="w-full h-full rounded-3xl bg-[#020617] flex items-center justify-center">
                    <ShieldCheck className="text-[#33b6ff]" size={34} />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold">
                    Application Status
                  </h3>

                  <div
                    className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.bg} ${status.color} font-semibold text-sm`}
                  >
                    {status.icon}
                    {status.text}
                  </div>
                </div>
              </div>

              <p className="text-slate-400 max-w-md text-sm">
                Your mentor profile is being reviewed by the
                admin team. You’ll gain dashboard access once
                approved.
              </p>
            </div>
          </motion.div>

          {/* Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Submitted Data */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-8">
                Submitted Information
              </h3>

              <div className="grid md:grid-cols-2 gap-5">
                <InfoCard
                  icon={<User size={18} />}
                  title="Full Name"
                  value={mentor?.name || "Not Provided"}
                />

                <InfoCard
                  icon={<Mail size={18} />}
                  title="Email"
                  value={mentor?.email || "Not Provided"}
                />

                <InfoCard
                  icon={<Briefcase size={18} />}
                  title="Expertise"
                  value={mentor?.expertise || "Software Engineering"}
                />

                <InfoCard
                  icon={<BadgeCheck size={18} />}
                  title="Experience"
                  value={
                    mentor?.experience || "3+ Years Experience"
                  }
                />

                <InfoCard
                  icon={<CalendarDays size={18} />}
                  title="Submitted Date"
                  value={
                    mentor?.createdAt
                      ? new Date(
                          mentor.createdAt
                        ).toLocaleDateString()
                      : "Today"
                  }
                />

                <InfoCard
                  icon={<FileText size={18} />}
                  title="Documents"
                  value="CV + Certificates Uploaded"
                />
              </div>

              {/* Bio */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">
                  Professional Bio
                </p>

                <p className="text-slate-200 leading-relaxed">
                  {mentor?.bio ||
                    "Experienced mentor passionate about guiding students in career growth, coding skills and professional development."}
                </p>
              </div>
            </motion.div>

            {/* Right Side */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Timeline */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-7">
                <h3 className="text-xl font-bold mb-6">
                  Approval Progress
                </h3>

                <div className="space-y-5">
                  <Step
                    done
                    title="Application Submitted"
                  />
                  <Step
                    done
                    title="Profile Received"
                  />
                  <Step
                    active
                    title="Admin Reviewing"
                  />
                  <Step
                    title="Approval Granted"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-7 space-y-4">
                <button
                  onClick={loadData}
                  className="w-full px-4 py-3 rounded-xl bg-[#33b6ff] text-black font-bold"
                >
                  Check Again
                </button>

                <button
                  onClick={logout}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoCard = ({
  icon,
  title,
  value,
}: {
  icon: any;
  title: string;
  value: string;
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
    <div className="flex items-center gap-2 text-[#33b6ff] mb-3">
      {icon}
      <span className="text-xs uppercase tracking-widest font-bold">
        {title}
      </span>
    </div>

    <p className="font-semibold text-slate-100">
      {value}
    </p>
  </div>
);

const Step = ({
  title,
  done,
  active,
}: {
  title: string;
  done?: boolean;
  active?: boolean;
}) => (
  <div className="flex items-center gap-4">
    <div
      className={`w-4 h-4 rounded-full ${
        done
          ? "bg-emerald-400"
          : active
          ? "bg-[#33b6ff]"
          : "bg-white/10"
      }`}
    />

    <p
      className={`font-medium ${
        active
          ? "text-white"
          : done
          ? "text-slate-200"
          : "text-slate-500"
      }`}
    >
      {title}
    </p>
  </div>
);

export default MentorPendingDashboard;