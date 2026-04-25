import React, { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, UserCheck, BarChart3, 
  DollarSign, Star, GraduationCap, Clock, 
  Activity, FileText, CheckSquare, BookOpen, 
  Layers, MessageSquare, Ticket, Settings, 
  ShieldCheck, LogOut, Menu, ChevronDown,
  CreditCard, RefreshCcw, MessageCircle, UserPlus, 
  Lock, Cog, Terminal, ClipboardList, Bell, User,
  UserCircle, Settings2
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuGroups = [
    {
      title: "Overview",
      items: [{ icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" }]
    },
    {
      title: "Mentors",
      hasArrow: true,
      items: [
        { icon: Users, label: "All Mentors", path: "/admin/mentors" },
        { icon: UserCheck, label: "Applications", path: "/admin/applications" },
        { icon: BarChart3, label: "Performance", path: "/admin/performance" },
        { icon: DollarSign, label: "Earnings", path: "/admin/earnings" },
        { icon: Star, label: "Reviews", path: "/admin/mentor-reviews" },
      ]
    },
    {
      title: "Students",
      hasArrow: true,
      items: [
        { icon: GraduationCap, label: "All Students", path: "/admin/students" },
        { icon: Clock, label: "Enrollments", path: "/admin/enrollments" },
        { icon: Activity, label: "Progress", path: "/admin/progress" },
        { icon: CheckSquare, label: "Grades & Status", path: "/admin/grades" },
        { icon: FileText, label: "Reports", path: "/admin/student-reports" },
      ]
    },
    {
      title: "Courses",
      hasArrow: true,
      items: [
        { icon: BookOpen, label: "All Courses", path: "/admin/courses" },
        { icon: Layers, label: "Categories", path: "/admin/categories" },
        { icon: FileText, label: "Lessons", path: "/admin/lessons" },
        { icon: Star, label: "Reviews", path: "/admin/course-reviews" },
        { icon: ClipboardList, label: "Assignments", path: "/admin/assignments" },
      ]
    },
    {
      title: "Payments",
      hasArrow: true,
      items: [
        { icon: RefreshCcw, label: "Transactions", path: "/admin/transactions" },
        { icon: CreditCard, label: "Subscriptions", path: "/admin/subscriptions" },
        { icon: FileText, label: "Invoices", path: "/admin/invoices" },
        { icon: RefreshCcw, label: "Refunds", path: "/admin/refunds" },
      ]
    },
    {
      title: "Chats",
      hasArrow: true,
      items: [
        { icon: MessageCircle, label: "Conversations", path: "/admin/chats" },
        { icon: Ticket, label: "Support Tickets", path: "/admin/tickets" },
      ]
    },
    {
      title: "Feedback",
      hasArrow: true,
      items: [
        { icon: MessageSquare, label: "All Feedback", path: "/admin/feedback" },
        { icon: FileText, label: "Reports", path: "/admin/feedback-reports" },
        { icon: Star, label: "Ratings", path: "/admin/ratings" },
      ]
    },
    {
      title: "Settings",
      hasArrow: true,
      items: [
        { icon: Users, label: "Profile Settings", path: "/admin/settings/profile" },
        { icon: UserPlus, label: "Admin Team", path: "/admin/settings/team" },
        { icon: Lock, label: "Roles & Permissions", path: "/admin/settings/roles" },
        { icon: Cog, label: "System Settings", path: "/admin/settings/system" },
        { icon: Terminal, label: "Developer Tools", path: "/admin/settings/dev" },
      ]
    }
  ];

  const hideScrollbar = "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

  return (
    <div className={`flex h-screen bg-[#020617] text-slate-400 overflow-hidden font-sans relative ${hideScrollbar}`}>
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      <aside className={`relative z-20 bg-slate-900/40 backdrop-blur-2xl border-r border-white/10 flex flex-col transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} ${hideScrollbar}`}>
        <div className="h-20 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            {sidebarOpen && <span className="text-white font-bold text-xl">PathMentor</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-white">
            <Menu size={20} />
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto px-3 py-2 space-y-7 pb-10 ${hideScrollbar}`}>
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {sidebarOpen && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">{group.title}</p>}
              {group.items.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive(item.path) ? "bg-white/10 text-white" : "hover:bg-white/5"}`}
                >
                  <item.icon size={18} className={isActive(item.path) ? "text-blue-400" : "text-slate-500"} />
                  {sidebarOpen && <span className="text-xs font-semibold text-left flex-1">{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      <main className={`flex-1 overflow-y-auto relative z-10 flex flex-col ${hideScrollbar}`}>
        <header className="h-20 shrink-0 border-b border-white/10 bg-slate-900/20 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
             {!sidebarOpen && (
               <div className="w-8 h-8 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] rounded-lg flex items-center justify-center lg:hidden">
                 <span className="text-white font-bold text-sm">P</span>
               </div>
             )}
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-full border-2 border-[#020617]" />
            </button>

            <div className="h-8 w-[1px] bg-white/10" />

            {/* PROFILE DROPDOWN */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 group focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-all">
                  <User size={18} className="text-slate-300 group-hover:text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-white leading-tight">Admin User</p>
                  <p className="text-[10px] text-slate-500 font-medium">Super Admin</p>
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-white/5 mb-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Account</p>
                  </div>
                  
                  <button 
                    onClick={() => { navigate("/admin/settings/profile"); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <UserCircle size={16} className="text-blue-400" />
                    Edit Profile
                  </button>

                  <div className="h-[1px] bg-white/5 my-1" />

                  <button 
                    onClick={() => { /* Add your logout logic here */ console.log("Logging out..."); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-8 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
