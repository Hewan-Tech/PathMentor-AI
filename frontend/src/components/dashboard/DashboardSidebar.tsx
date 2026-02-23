import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  BookOpen,
  FolderKanban,
  Bot,
  TrendingUp,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Map, label: "Roadmap", path: "/roadmap" },
  { icon: BookOpen, label: "Lessons", path: "/lessons" },
  { icon: FolderKanban, label: "Projects", path: "/projects" },
  { icon: Bot, label: "AI Mentor", path: "/ai-mentor" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const DashboardSidebar = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: DashboardSidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%",
          width: isCollapsed ? 80 : 260,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-0 left-0 h-full z-50 pt-20",
          "glass-sidebar",
          "lg:translate-x-0 lg:z-30"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Collapse toggle - desktop only */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 rounded-full bg-muted border border-border items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft
              className={cn(
                "w-4 h-4 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </button>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 mt-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                    "hover:bg-white/10",
                    isActive && "bg-primary/20 border border-primary/30",
                    isCollapsed && "justify-center px-3"
                  )}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </motion.div>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {isActive && !isCollapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* AI Mentor Quick Access - at bottom */}
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-auto"
            >
              <div className="glass-inner-glow p-4 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-teal flex items-center justify-center">
                    <Bot className="w-5 h-5 text-teal-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">AI Mentor</p>
                    <p className="text-xs text-muted-foreground">Ready to help</p>
                  </div>
                </div>
                <button className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-medium transition-colors">
                  Ask a question
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.aside>
    </>
  );
};
