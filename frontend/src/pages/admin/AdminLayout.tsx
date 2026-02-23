import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ParticlesBackground } from "@/components/landing/ParticlesBackground";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const logout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: UserCheck, label: "Mentors", path: "/admin/mentors" },
    { icon: Users, label: "Students", path: "/admin/students" },
    { icon: ClipboardList, label: "Assessments", path: "/admin/assessments" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-200 overflow-hidden">
      {/* GLOBAL BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticlesBackground />
        {/* Animated Orbs/Blobs */}
        <motion.div 
          animate={{ 
            x: [0, 30, 0], 
            y: [0, 50, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0], 
            y: [0, -20, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px]" 
        />
      </div>

      {/* SIDEBAR */}
      <aside
        className={`h-screen sticky top-0 transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-24"
        } bg-[#050b18]/60 backdrop-blur-2xl border-r border-white/5 flex flex-col z-50`}
      >
        <div className="p-6 mb-6">
          <div className="flex items-center justify-between gap-2">
            <div className={`flex items-center gap-3 p-1.5 transition-all duration-300 ${
              sidebarOpen ? "pr-6 border border-white/5 bg-white/[0.02] rounded-[22px]" : ""
            }`}>
              <div className="w-11 h-11 rounded-[14px] bg-gradient-to-tr from-[#33b6ff] via-[#8b5cf6] to-[#a855f7] flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                <span className="text-[#020617] font-black text-xl leading-none">P</span>
              </div>
              {sidebarOpen && (
                <span className="text-white text-[22px] font-bold tracking-tight whitespace-nowrap leading-none">
                  PathMentor
                </span>
              )}
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-500 hover:text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 relative group ${
                isActive(item.path)
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {isActive(item.path) && (
                <motion.div layoutId="sidebar-active" className="absolute left-0 w-1.5 h-6 bg-sky-400 rounded-r-full" />
              )}
              <item.icon size={22} />
              {sidebarOpen && <span className="font-semibold tracking-wide">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={logout} className="w-full flex items-center gap-4 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all">
            <LogOut size={22} />
            {sidebarOpen && <span className="font-bold uppercase tracking-widest text-[10px]">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative z-10 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;