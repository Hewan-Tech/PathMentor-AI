import { motion } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  Activity, 
  TrendingUp, 
  ArrowUpRight,
  ShieldAlert,
  Clock
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

// Simulated data for the analytics node
const data = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 600 },
  { name: "Thu", value: 800 },
  { name: "Fri", value: 500 },
  { name: "Sat", value: 900 },
  { name: "Sun", value: 1100 },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 font-sans">
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#33b6ff]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#a855f7]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-[#33b6ff] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">System Core v2.0</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">
              Admin <span className="text-[#33b6ff]">Nexus</span>
            </h1>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Network Load</p>
            <p className="text-2xl font-black text-white">0.42ms <span className="text-xs text-green-500">Optimal</span></p>
          </div>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Students" value="1,284" icon={<Users />} trend="+12%" />
          <StatCard title="Active Mentors" value="42" icon={<UserCheck />} trend="+3%" color="text-[#a855f7]" />
          <StatCard title="Roadmaps" value="312" icon={<BookOpen />} trend="+18%" />
          <StatCard title="Pending Verifications" value="07" icon={<ShieldAlert />} trend="Critical" color="text-amber-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ANALYTICS NODE */}
          <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Activity size={20} className="text-[#33b6ff]" /> Platform Engagement
              </h3>
              <select className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#33b6ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#33b6ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#33b6ff' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#33b6ff" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RECENT ACTIVITY NODE */}
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-2xl overflow-hidden">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Clock size={20} className="text-[#a855f7]" /> Neural Feed
            </h3>
            <div className="space-y-6">
              <ActivityItem user="Sarah J." action="Applied as Mentor" time="2m ago" />
              <ActivityItem user="Nexus AI" action="Generated 12 Roadmaps" time="14m ago" />
              <ActivityItem user="John Doe" action="Completed Python Mastery" time="1h ago" />
              <ActivityItem user="System" action="Backup Synchronized" time="4h ago" />
            </div>
            <button className="w-full mt-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              View All Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const StatCard = ({ title, value, icon, trend, color = "text-[#33b6ff]" }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white/[0.05] border border-white/10 p-6 rounded-[32px] transition-all hover:border-white/20 shadow-xl"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-white/5 ${color}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black bg-white/5 px-2 py-1 rounded-md text-slate-400">{trend}</span>
    </div>
    <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h4>
    <p className="text-3xl font-black">{value}</p>
  </motion.div>
);

const ActivityItem = ({ user, action, time }: any) => (
  <div className="flex gap-4 items-start relative group">
    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center font-black text-xs">
      {user.charAt(0)}
    </div>
    <div>
      <p className="text-sm font-bold text-white group-hover:text-[#33b6ff] transition-colors">{user}</p>
      <p className="text-xs text-slate-500">{action}</p>
      <p className="text-[9px] text-slate-600 mt-1 uppercase font-black">{time}</p>
    </div>
  </div>
);

export default AdminDashboard;