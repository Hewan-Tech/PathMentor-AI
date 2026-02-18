import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

/* ================= MAIN ================= */

const UnifiedDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [pendingMentors, setPendingMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/auth");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, []);

  /* ================= FETCH DATA ================= */
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
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /* ================= ACTIONS ================= */
  const approveMentor = async (id: string) => {
    await api.put(`/admin/mentor/${id}/approve`);
    const pending = await api.get("/admin/pending-mentors");
    setPendingMentors(pending.data);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* ================= SIDEBAR ================= */}
      <div
        className={`bg-slate-900 p-4 transition-all ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className={`${!sidebarOpen && "hidden"} font-bold text-lg`}>
            Admin
          </h1>
          <Menu
            className="cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        <nav className="flex flex-col gap-4 text-gray-300">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" open={sidebarOpen}/>
          <NavItem
            icon={<UserCheck />}
            label="Mentors"
            open={sidebarOpen}
            onClick={() => navigate("/admin/mentors")}
          />
          <NavItem
            icon={<Users />}
            label="Students"
            open={sidebarOpen}
            onClick={() => navigate("/admin/students")}
          />
          <NavItem
            icon={<ClipboardList />}
            label="Assessments"
            open={sidebarOpen}
            onClick={() => navigate("/admin/assessments")}
          />
          <NavItem
            icon={<Settings />}
            label="Settings"
            open={sidebarOpen}
            onClick={() => navigate("/admin/settings")}
          />
        </nav>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 p-6">
        {/* TOP BAR */}
        <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl mb-6">
          <h2 className="text-lg font-semibold">PathMentor AI</h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">{user.email}</span>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ================= ADMIN VIEW ================= */}
        {user.role === "admin" && (
          <>
            {/* CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <Card title="Verified Mentors" value={stats?.verifiedMentors} />
              <Card title="Total Students" value={stats?.totalStudents} />
              <Card
                title="Pending Mentors"
                value={stats?.pendingMentors}
                button="Review Applications"
              />
            </div>

            {/* TABLE */}
            <div className="bg-slate-900 p-6 rounded-xl">
              <h3 className="mb-4 font-semibold">Pending Applications</h3>

              <table className="w-full text-sm">
                <thead className="text-gray-400 border-b border-slate-700">
                  <tr>
                    <th className="text-left py-2">Name</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {pendingMentors.map((m: any) => (
                    <tr
                      key={m._id}
                      className="border-b border-slate-800"
                    >
                      <td className="py-3">{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.date || "2024-05-10"}</td>
                      <td>
                        <button
                          onClick={() => approveMentor(m._id)}
                          className="bg-green-500 px-2 py-1 rounded mr-2 text-xs"
                        >
                          Approve
                        </button>
                        <button className="bg-red-500 px-2 py-1 rounded text-xs">
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ================= MENTOR VIEW ================= */}
        {user.role === "mentor" && (
          <div className="grid grid-cols-2 gap-6">
            <Card title="Assigned Students" value={stats?.students} />
            <Card title="Pending Reviews" value={stats?.pendingReviews} />
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= REUSABLE ================= */

const NavItem = ({ icon, label, open, onClick }: any) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 cursor-pointer hover:text-white"
  >
    {icon}
    {open && <span>{label}</span>}
  </div>
);

const Card = ({ title, value, button }: any) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-xl shadow">
    <p className="text-gray-400 text-sm">{title}</p>
    <h2 className="text-2xl font-bold mt-2">{value}</h2>

    {button && (
      <button className="mt-3 bg-red-500 text-xs px-3 py-1 rounded">
        {button}
      </button>
    )}
  </div>
);

export default UnifiedDashboard;