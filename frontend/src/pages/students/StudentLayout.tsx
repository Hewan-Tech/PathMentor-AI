import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  BarChart3,
  Calendar,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";

const StudentLayout = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      label: "My Courses",
      icon: BookOpen,
      path: "/students/courses",
    },
    {
      label: "Assignments",
      icon: ClipboardList,
      path: "/students/assignments",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      path: "/students/analytics",
    },
    {
      label: "Scheduling",
      icon: Calendar,
      path: "/students/scheduling",
    },
    {
      label: "Profile",
      icon: User,
      path: "/students/user-profile",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/students/settings",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-white overflow-hidden">
      {/* SIDEBAR */}
      <motion.aside
        animate={{
          width: isSidebarOpen ? 280 : 80,
        }}
        transition={{ duration: 0.25 }}
        className="relative z-50 h-screen bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col"
      >
        {/* LOGO */}
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-400 flex items-center justify-center shadow-lg">
            <span className="text-black font-black text-xl italic">
              N
            </span>
          </div>

        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-400/10 text-cyan-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={22} />

                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-bold uppercase tracking-wider"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={22} />

            {isSidebarOpen && (
              <span className="text-sm font-bold uppercase tracking-wider">
                Logout
              </span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* MAIN */}
      <div className="relative flex-1 flex flex-col h-screen overflow-hidden">
        {/* BACKGROUND GLOWS */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* HEADER */}
        <header className="relative z-40 h-20 border-b border-white/10 bg-black/20 backdrop-blur-xl flex items-center justify-between px-6">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/5 transition"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* SEARCH */}
            <div className="relative hidden md:block">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search..."
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-400 w-64"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* NOTIFICATION */}
            <button className="relative p-2 rounded-full hover:bg-white/5">
              <Bell size={20} />

              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
            </button>

            <div className="w-px h-8 bg-white/10" />

            {/* PROFILE */}
            <div
              onClick={() => navigate("/students/user-profile")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold uppercase">
                  Student_01
                </p>

                <p className="text-[10px] text-cyan-400">
                  Level 14
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-400 transition-all">
                <User size={20} className="text-cyan-400" />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
              {/* <Outlet /> */}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;