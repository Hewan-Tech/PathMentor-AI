import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bell, User, Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardTopNavProps {
  userName: string;
  userEmail: string;
  onSignOut: () => void;
  onMenuToggle: () => void;
  hasNotifications?: boolean;
}

export const DashboardTopNav = ({
  userName,
  userEmail,
  onSignOut,
  onMenuToggle,
  hasNotifications = true,
}: DashboardTopNavProps) => {
  const [aiActive] = useState(true);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
    >
      <div className="glass-premium flex items-center justify-between px-4 md:px-6 py-3">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg font-bold text-primary-foreground">P</span>
            </motion.div>
            <span className="text-lg font-semibold hidden sm:block">PathMentor AI</span>
          </Link>
        </div>

        {/* Right: AI Status, Notifications, User */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* AI Status Indicator */}
          <motion.div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
            whileHover={{ scale: 1.02 }}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                aiActive ? "bg-teal ai-status-glow" : "bg-muted-foreground"
              }`}
            />
            <span className="text-xs text-muted-foreground">AI Active</span>
          </motion.div>

          {/* Notifications */}
          <motion.button
            className="relative p-2.5 rounded-xl hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" />
            {hasNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent notification-glow" />
            )}
          </motion.button>

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
                <span className="hidden md:block text-sm font-medium max-w-[120px] truncate">
                  {userName}
                </span>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 glass-premium border-white/20"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="cursor-pointer">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/roadmap" className="cursor-pointer">
                  Roadmap
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={onSignOut}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};
