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
    <div className="min-h-screen flex bg-[#020617] text-slate-200">
      {/* SIDEBAR */}
      <aside
        className={`h-screen sticky top-0 transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-24"
        } bg-[#050b18] border-r border-white/5 flex flex-col z-50`}
      >
        {/* EXACT LOGO SECTION FROM IMAGE */}
        <div className="p-6 mb-6">
          <div className="flex items-center justify-between gap-2">
            
            <div className={`flex items-center gap-3 p-1.5 ${sidebarOpen ? "pr-6 border border-white/5 bg-white/[0.02] rounded-[22px]" : ""}`}>
              {/* The Icon Box (Squircle + 3-Color Gradient) */}
              <div className="w-11 h-11 rounded-[14px] bg-gradient-to-tr from-[#33b6ff] via-[#8b5cf6] to-[#a855f7] flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/10">
                <span className="text-[#020617] font-black text-xl leading-none">P</span>
              </div>

              {/* PathMentor Text */}
              {sidebarOpen && (
                <span className="text-white text-[22px] font-bold tracking-tight whitespace-nowrap">
                  PathMentor
                </span>
              )}
            </div>

            {/* Menu Toggle Button */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
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
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1.5 h-6 bg-sky-400 rounded-r-full"
                />
              )}
              
              <item.icon size={22} className={isActive(item.path) ? "text-sky-400" : "group-hover:text-white"} />
              
              {sidebarOpen && (
                <span className={`font-semibold tracking-wide ${isActive(item.path) ? "text-sky-400" : ""}`}>
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group"
          >
            <LogOut size={22} className="group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="font-bold uppercase tracking-widest text-[10px]">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative bg-[#020617]">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative z-10 p-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;