import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Bell, User, Menu, Sparkles, LogOut, Settings, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardTopNavProps {
  userName: string;
  userEmail: string;
  role?: "Admin" | "Mentor" | "Student"; // Added role for context
  onSignOut: () => void;
  onMenuToggle: () => void;
  hasNotifications?: boolean;
}

export const DashboardTopNav = ({
  userName,
  userEmail,
  role = "Admin",
  onSignOut,
  onMenuToggle,
  hasNotifications = true,
}: DashboardTopNavProps) => {
  const [aiActive] = useState(true);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-none"
    >
      <div className="glass-premium flex items-center justify-between px-6 py-3 rounded-2xl border border-white/20 shadow-2xl pointer-events-auto bg-white/80 backdrop-blur-md">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#1E5350] flex items-center justify-center shadow-lg shadow-teal-900/20 group-hover:rotate-6 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black leading-none uppercase tracking-tighter">PathMentor</span>
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">AI Platform</span>
            </div>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* AI Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase">AI Neural Link Active</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-all active:scale-95">
            <Bell className="w-5 h-5 text-slate-600" />
            {hasNotifications && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 border-2 border-white" />
            )}
          </button>

          <div className="h-8 w-[1px] bg-slate-200 mx-1" />

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
                  {userName.charAt(0)}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-xs font-bold leading-none">{userName}</span>
                  <span className="text-[10px] font-medium text-slate-400">{role}</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-slate-200 shadow-xl">
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold">{userName}</p>
                  <p className="text-xs text-slate-500">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg py-2 cursor-pointer">
                <ShieldCheck className="w-4 h-4 mr-2 text-teal-600" /> Account Security
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg py-2 cursor-pointer">
                <Settings className="w-4 h-4 mr-2 text-slate-400" /> System Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onSignOut}
                className="rounded-lg py-2 text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};