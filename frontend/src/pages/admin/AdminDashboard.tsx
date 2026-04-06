import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/services/api";
import { Check, X, Users, UserCheck, Clock, Activity } from "lucide-react";

import { ParticlesBackground } from "@/components/landing/ParticlesBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [pendingMentors, setPendingMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= ADMIN PROTECTION ================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/auth");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.role !== "admin") {
      if (parsedUser.role === "mentor") {
        navigate("/mentor/dashboard");
      } else {
        navigate("/dashboard");
      }
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setStats(res.data);

        const pending = await api.get("/admin/pending-mentors");

        // ✅ FIX: extract mentors array
        setPendingMentors(pending.data.mentors || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /* ================= APPROVE ================= */

  const approveMentor = async (id: string) => {
    await api.put(`/admin/mentor/${id}/approve`);

    const pending = await api.get("/admin/pending-mentors");

    // ✅ FIX AGAIN
    setPendingMentors(pending.data.mentors || []);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/auth");
  };
    /* ------------------rejected-------------------*/
    const rejectMentor = async(id: string) => {
      await api.put(`/admin/mentor/${id}/reject`);
      const pending = await api.get("/admin/pending-mentors");

    // ✅ FIX AGAIN
    setPendingMentors(pending.data.mentors || []);

    }
  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-transparent">
        <motion.div
          className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#33b6ff] to-[#a855f7]"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* HEADER */}

      <header className="mb-10">
        <div className="flex items-center justify-between px-6 py-4 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              PathMentor AI
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-white/90">
                {user?.email?.split("@")[0]}
              </span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                {user?.role}
              </span>
            </div>

            <GlassButton
              variant="primary"
              glow
              className="px-6 py-2.5 rounded-xl text-xs font-bold"
              onClick={logout}
            >
              Sign Out
            </GlassButton>
          </div>
        </div>
      </header>

      {/* DASHBOARD */}

      {user.role === "admin" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Verified Mentors" value={stats?.verifiedMentors || 0} />
            <StatCard title="Total Students" value={stats?.totalStudents || 0} />
            <StatCard title="Pending Review" value={stats?.pendingMentors || 0} highlight />
          </div>

          <GlassCard className="p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h3 className="font-bold text-lg text-white">
                Pending Applications
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-muted-foreground uppercase text-[11px] font-bold tracking-wider bg-white/[0.02]">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {pendingMentors.map((m: any) => (
                    <tr key={m._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium">{m.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{m.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-[10px] font-bold">
                          PENDING
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => approveMentor(m._id)}
                          className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all"
                        >
                          <Check size={16} />
                        </button>

                        <button onClick={()=> rejectMentor(m._id)}
                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {user.role === "mentor" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Assigned Students" value={stats?.students || 0} />
          <StatCard title="Pending Reviews" value={stats?.pendingReviews || 0} />
        </div>
      )}
    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, highlight }: any) => (
  <GlassCard className={`p-6 ${highlight ? "border-primary/20 bg-primary/[0.02]" : ""}`}>
    <p className="text-muted-foreground text-sm font-medium">{title}</p>

    <div className="flex items-end justify-between mt-2">
      <h2 className="text-4xl font-bold tracking-tight text-white">{value}</h2>

      {highlight && (
        <GlassButton variant="primary" className="px-3 py-1 text-[10px] h-auto">
          Review All
        </GlassButton>
      )}
    </div>
  </GlassCard>
);

export default AdminDashboard;