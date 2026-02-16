import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { LayoutDashboard, Users, UserCheck } from "lucide-react";

/* ================= MAIN DASHBOARD ================= */

const UnifiedDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [pendingMentors, setPendingMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER ================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/auth");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  /* ================= FETCH DASHBOARD ================= */

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        if (user.role === "admin") {
          const res = await api.get("/admin/dashboard");
          setStats(res.data);

          const pending = await api.get("/admin/pending-mentors");
          setPendingMentors(pending.data);
        }

        if (user.role === "mentor") {
          const res = await api.get("/mentor/dashboard");
          setStats(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /* ================= APPROVE MENTOR ================= */

  const approveMentor = async (id: string) => {
    await api.put(`/admin/approve-mentor/${id}`);

    const pending = await api.get("/admin/pending-mentors");
    setPendingMentors(pending.data);
  };

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  if (loading) {
    return <div className="text-center mt-20 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <div className="flex justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">
            {user.role === "admin" ? "Admin Dashboard" : "Mentor Dashboard"}
          </h1>
          <p className="text-gray-400">{user.email}</p>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {user.role === "admin" && (
        <>
          <div className="grid grid-cols-3 gap-6 mb-10">
            <StatCard
              icon={<UserCheck />}
              label="Verified Mentors"
              value={stats?.verifiedMentors}
            />
            <StatCard
              icon={<Users />}
              label="Pending Mentors"
              value={stats?.pendingMentors}
            />
            <StatCard
              icon={<LayoutDashboard />}
              label="Total Students"
              value={stats?.totalStudents}
            />
          </div>

          <div className="bg-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">
              Pending Mentor Approvals
            </h2>

            {pendingMentors.length === 0 && (
              <p className="text-gray-400">No pending mentors</p>
            )}

            {pendingMentors.map((mentor) => (
              <div
                key={mentor._id}
                className="flex justify-between items-center border-b py-3"
              >
                <div>
                  <p className="font-semibold">{mentor.name}</p>
                  <p className="text-sm text-gray-400">
                    {mentor.email}
                  </p>
                </div>

                <button
                  onClick={() => approveMentor(mentor._id)}
                  className="bg-green-600 px-4 py-1 rounded-lg text-sm"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {user.role === "mentor" && (
        <div className="grid grid-cols-2 gap-6">
          <StatCard
            icon={<Users />}
            label="Assigned Students"
            value={stats?.students}
          />
          <StatCard
            icon={<LayoutDashboard />}
            label="Pending Reviews"
            value={stats?.pendingReviews}
          />
        </div>
      )}
    </div>
  );
};

/* ================= REUSABLE CARD ================= */

const StatCard = ({ icon, label, value }: any) => (
  <div className="bg-slate-800 p-6 rounded-xl">
    <div className="mb-3">{icon}</div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default UnifiedDashboard;
