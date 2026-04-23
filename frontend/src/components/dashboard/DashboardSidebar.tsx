import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Award,
  BookOpen,
  FolderKanban,
  Bot,
  Users,
  Settings,
  ChevronLeft,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;

  /* optional so old pages won't break */
  activeView?: string;
  onViewChange?: (view: string) => void;

  /* optional pending mode */
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
  const normalNavItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      id: "dashboard",
    },
    {
      icon: BookOpen,
      label: "Lessons",
      id: "lessons",
    },
    {
      icon: FolderKanban,
      label: "Projects",
      id: "projects",
    },
    {
      icon: Award,
      label: "Achievements",
      id: "progress",
    },
    {
      icon: Users,
      label: "Community",
      id: "community",
    },
    {
      icon: Settings,
      label: "Settings",
      id: "settings",
    },
  ];

  const pendingNavItems = [
    {
      icon: ShieldCheck,
      label: "Application",
      id: "application",
    },
    {
      icon: Clock3,
      label: "Approval Status",
      id: "status",
    },
    {
      icon: Settings,
      label: "Settings",
      id: "settings",
    },
  ];

  const navItems = pendingMode
    ? pendingNavItems
    : normalNavItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%",
          width: isCollapsed ? 80 : 260,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className={cn(
          "fixed top-0 left-0 h-full z-50 pt-20",
          "bg-background/80 backdrop-blur-xl border-r border-white/10",
          "lg:translate-x-0 lg:z-30"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Collapse */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 rounded-full bg-muted border border-border items-center justify-center hover:bg-muted/80 transition"
          >
            <ChevronLeft
              className={cn(
                "w-4 h-4 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </button>

          {/* Logo */}
          {!isCollapsed && (
            <div className="mb-6 px-3">
              <h2 className="font-extrabold text-lg tracking-tight">
                PathMentor{" "}
                <span className="text-primary">
                  {pendingMode ? "Pending" : "AI"}
                </span>
              </h2>

              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                {pendingMode
                  ? "Approval Center"
                  : "Learning Platform"}
              </p>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive =
                activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);

                    if (
                      window.innerWidth < 1024
                    ) {
                      onClose();
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon size={20} />

                  {!isCollapsed && (
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Card */}
          {!isCollapsed && (
            <div className="mt-auto p-4 rounded-2xl border border-white/10 bg-white/5">
              {pendingMode ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock3
                      size={18}
                      className="text-primary"
                    />
                    <span className="text-xs font-bold">
                      Pending Review
                    </span>
                  </div>

                  <p className="text-[10px] opacity-60 mb-3 leading-relaxed">
                    Admin team is reviewing your
                    mentor application.
                  </p>

                  <button className="w-full py-2 rounded-lg bg-primary/10 text-primary text-[11px] font-bold">
                    Check Status
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Bot
                      size={18}
                      className="text-primary"
                    />
                    <span className="text-xs font-bold">
                      PathMentor AI
                    </span>
                  </div>

                  <p className="text-[10px] opacity-60 mb-3 leading-relaxed">
                    Ask me anything about your
                    current module.
                  </p>

                  <button className="w-full py-2 rounded-lg bg-primary/10 text-primary text-[11px] font-bold">
                    Ask Question
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};