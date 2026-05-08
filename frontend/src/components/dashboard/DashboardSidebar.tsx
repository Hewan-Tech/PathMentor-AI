import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  Users,
  Settings,
  ChevronLeft,
  Clock3,
  ShieldCheck,
  BarChart,
  Map,
  ClipboardList,
  Calendar,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeView?: string;
  onViewChange?: (view: string) => void;
  pendingMode?: boolean;
}

export const DashboardSidebar = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  activeView = "dashboard",
  onViewChange = () => {},
  pendingMode = false,
}: DashboardSidebarProps) => {
  const location = useLocation();

  // MENTOR ITEMS
  const mentorNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", path: "/mentor/dashboard" },
    { icon: BookOpen, label: "My Classes", id: "courses", path: "/mentor/courses" },
    { icon: BarChart, label: "Progress", id: "progress", path: "/mentor/progress" },
    { icon: FolderKanban, label: "Projects & Quizzes", id: "projects", path: "/mentor/projects" },
    { icon: Users, label: "Community", id: "community", path: "/mentor/community" },
    { icon: Settings, label: "Settings", id: "settings", path: "/mentor/settings" },
  ];

  // STUDENT ITEMS 
  const studentNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", path: "/students/dashboard" },
  { icon: BookOpen, label: "My Courses", id: "courses", path: "/students/courses" },
  { icon: ClipboardList, label: "Assignments", id: "assignments", path: "/students/assignments" },
  { icon: BarChart, label: "Analytics", id: "analytics", path: "/students/analytics" },
  { icon: Map, label: "Roadmap", id: "roadmap", path: "/students/roadmap" },
  { icon: Calendar, label: "Schedule", id: "schedule", path: "/students/scheduling" },
  { icon: Users, label: "Community", id: "community", path: "/students/community" },
  { icon: User, label: "Profile", id: "profile", path: "/students/user-profile" },
  { icon: Settings, label: "Settings", id: "settings", path: "/students/settings" },
];

  // PENDING MENTOR ITEMS
  const pendingNavItems = [
    { icon: ShieldCheck, label: "Application", id: "application", path: "/mentor/pending" },
    { icon: Clock3, label: "Status", id: "status", path: "/mentor/pending" },
    { icon: Settings, label: "Settings", id: "settings", path: "/mentor/settings" },
  ];

  const isMentorPath = location.pathname.startsWith("/mentor");
  
  let navItems = isMentorPath ? mentorNavItems : studentNavItems;
  if (isMentorPath && pendingMode) {
    navItems = pendingNavItems;
  }

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%",
          width: isCollapsed ? 80 : 260,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-0 left-0 h-full z-50 pt-20 bg-background/80 backdrop-blur-xl border-r border-white/10 lg:translate-x-0 lg:z-30"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 rounded-full bg-muted border border-border items-center justify-center hover:bg-muted/80 transition shadow-md"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
          </button>

          <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
            {navItems.map((item) => {
              // IMPROVED: isActive logic checks if current path matches item path
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => {
                    onViewChange(item.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group mb-1",
                    isActive 
                      ? "bg-primary/15 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon size={20} className={cn(isActive && "drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]")} />
                  {!isCollapsed && <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>}
                  
                  {isActive && (
                    <motion.div 
                      layoutId="sidebarActive"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary),1)]" 
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>
    </>
  );
};

export default DashboardSidebar;