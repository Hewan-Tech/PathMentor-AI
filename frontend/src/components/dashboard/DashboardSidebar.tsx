import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  icon: LucideIcon;
  label: string;
  id: string;
  path?: string;
};

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
  const navigate = useNavigate();

  const normalNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
    { icon: BookOpen, label: "My courses", id: "courses", path: "/mentor/courses" },
    { icon: BarChart, label: "Progress", id: "progress", path: "/mentor/progress" },
    { icon: FolderKanban, label: "Projects", id: "projects", path: "/mentor/projects" },
    { icon: Users, label: "Community", id: "community", path: "/mentor/community" },
    { icon: Settings, label: "Settings", id: "settings", path: "/mentor/settings" },
  ];

  const pendingNavItems: NavItem[] = [
    { icon: ShieldCheck, label: "Application", id: "application" },
    { icon: Clock3, label: "Status", id: "status" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  const navItems = pendingMode ? pendingNavItems : normalNavItems;

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

          {!isCollapsed && (
            <div className="mb-6 px-3">
              <h2 className="font-extrabold text-lg tracking-tight">
                PathMentor <span className="text-primary">{pendingMode ? "Pending" : "AI"}</span>
              </h2>
            </div>
          )}

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    } else {
                      onViewChange(item.id);
                    }
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group",
                    isActive ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon size={20} />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>
      </motion.aside>
    </>
  );
};