import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  MessageSquare,
  BarChart3,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/mentor/dashboard", icon: LayoutDashboard },
  { name: "Courses", path: "/mentor/courses", icon: BookOpen },
  { name: "Projects", path: "/mentor/projects", icon: ClipboardList },
  { name: "Messages", path: "/mentor/messages", icon: MessageSquare },
  { name: "Analytics", path: "/mentor/course-analysis/1", icon: BarChart3 },
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
    onClose(); // mobile close
  };

  return (
    <>
      {/* MOBILE BACKDROP */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 260,
        }}
        className={`
          fixed top-0 left-0 h-full z-50
          bg-[#0b1220] border-r border-white/10
          flex flex-col
          transition-all duration-300

          /* RESPONSIVE BEHAVIOR */
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {!isCollapsed && (
            <h1 className="text-white font-bold">
              Mentor <span className="text-[#33b6ff]">Panel</span>
            </h1>
          )}

          <button
            onClick={onToggleCollapse}
            className="text-white/60 hover:text-white"
          >
            ☰
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 p-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <button
                key={item.name}
                onClick={() => go(item.path)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg
                  transition cursor-pointer

                  ${
                    active
                      ? "bg-[#33b6ff]/20 text-[#33b6ff]"
                      : "text-white/70 hover:bg-white/10"
                  }
                `}
              >
                <Icon size={18} />
                {!isCollapsed && <span>{item.name}</span>}
              </button>
            );
          })}
        </div>
      </motion.aside>
    </>
  );
};

export default DashboardSidebar;