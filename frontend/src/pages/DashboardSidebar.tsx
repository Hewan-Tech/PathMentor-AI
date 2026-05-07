import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  MessageSquare,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Settings,
  Users,
  Award,
  ClipboardCheck,
  Calendar,
  Bell,
} from "lucide-react";
const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "My courses", path: "/mentor/my-classes", icon: BookOpen },
  { name: "Students", path: "/mentor/students", icon: Users },
  { name: "Grades", path: "/mentor/grades", icon: Award },
  { name: "Assignments", path: "/mentor/assignments", icon: ClipboardCheck },
  { name: "Projects", path: "/mentor/projects", icon: ClipboardList },
  { name: "Schedule", path: "/mentor/schedule", icon: Calendar },
  { name: "Messages", path: "/mentor/messages", icon: MessageSquare },
  { name: "Notifications", path: "/mentor/notifications", icon: Bell },
  { name: "Analytics", path: "/mentor/course-analysis/1", icon: BarChart3 },
  { name: "Settings", path: "/mentor/settings", icon: Settings },
];


const DashboardSidebar = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: any) => {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path: string) => {
    navigate(path);

    // close sidebar only on mobile
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* MOBILE BACKDROP */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 88 : 270,
        }}
   className={`
  fixed top-0 left-0 h-screen z-50
  bg-[#081120]/95 backdrop-blur-xl
  border-r border-white/10
  flex flex-col
  shadow-2xl
  transition-transform duration-300

  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0
`}
      >
        {/* HEADER */}
        <div className="h-20 px-4 flex items-center justify-between border-b border-white/10">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">
                Mentor
                <span className="text-[#33b6ff]"> Panel</span>
              </h1>

              <p className="text-xs text-white/40 mt-1">
                Teaching Dashboard
              </p>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="
              w-10 h-10 rounded-xl
              bg-white/5 hover:bg-[#33b6ff]/20
              flex items-center justify-center
              text-white transition
            "
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path;

            return (
              <motion.button
                key={item.name}
                onClick={() => go(item.path)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                title={isCollapsed ? item.name : ""}
                className={`
                  group w-full flex items-center gap-4
                  px-4 py-3 rounded-2xl
                  transition-all duration-300

                  ${
                    active
                      ? "bg-[#33b6ff] text-black shadow-lg shadow-[#33b6ff]/30"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon
                  size={20}
                  className={`
                    ${
                      active
                        ? "text-black"
                        : "text-[#33b6ff]"
                    }
                  `}
                />

                {!isCollapsed && (
                  <span className="font-medium text-sm">
                    {item.name}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* FOOTER */}
        {!isCollapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#33b6ff]/20 to-cyan-500/10 border border-[#33b6ff]/20">
              <h3 className="font-semibold text-sm text-white">
                PathMentor AI
              </h3>

              <p className="text-xs text-white/50 mt-1">
                Smart teaching platform for mentors
              </p>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
};

export default DashboardSidebar;