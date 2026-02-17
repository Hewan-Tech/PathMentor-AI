import { motion } from "framer-motion";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Star, 
  Zap, 
  CheckCircle,
  Clock,
  LayoutDashboard
} from "lucide-react";

const MentorDashboard = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 font-sans">
      {/* GLOW EFFECTS */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-[#33b6ff]/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="px-3 py-1 rounded-full bg-[#33b6ff]/10 border border-[#33b6ff]/20 text-[#33b6ff] text-[10px] font-black uppercase tracking-widest">
                Identity Verified
              </div>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">
              Welcome to <span className="text-[#33b6ff]">Nexus</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2">Your mentorship node is fully operational.</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center min-w-[100px]">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Impact Score</p>
              <p className="text-xl font-black text-[#a855f7]">98.2</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center min-w-[100px]">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Rank</p>
              <p className="text-xl font-black text-[#33b6ff]">Elite</p>
            </div>
          </div>
        </header>

        {/* TOP METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard title="Active Mentees" value="12" icon={<Users />} detail="+2 this week" />
          <MetricCard title="Hours Logged" value="148" icon={<Clock />} detail="Top 5% in Nexus" />
          <MetricCard title="Average Rating" value="4.9" icon={<Star />} detail="From 84 reviews" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MENTEE LIST (Milky Glass) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Zap size={20} className="text-[#33b6ff]" /> Priority Mentees
                </h3>
                <button className="text-xs font-black uppercase tracking-widest text-[#33b6ff] hover:underline">View All</button>
              </div>

              <div className="space-y-4">
                <MenteeRow name="Alex Rivera" goal="Fullstack Dev" progress={75} status="On Track" />
                <MenteeRow name="Sarah Chen" goal="UI/UX Mastery" progress={40} status="Behind" warning />
                <MenteeRow name="Marcus Thorne" goal="Cloud Architecture" progress={92} status="Near Completion" />
              </div>
            </div>
          </div>

          {/* UPCOMING SESSIONS */}
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Calendar size={20} className="text-[#a855f7]" /> Upcoming Sprints
            </h3>
            <div className="space-y-6">
              <SessionItem time="14:00" date="Today" title="Code Review: Alex" />
              <SessionItem time="10:30" date="Tomorrow" title="Career Coaching" />
              <SessionItem time="16:00" date="Feb 20" title="Roadmap Sync" />
            </div>
            <button className="w-full mt-10 py-4 rounded-2xl bg-[#33b6ff] text-black font-black text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(51,182,255,0.4)] transition-all">
              Schedule New Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const MetricCard = ({ title, value, icon, detail }: any) => (
  <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[32px] hover:border-white/20 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-2xl bg-white/5 text-[#33b6ff]">{icon}</div>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{detail}</span>
    </div>
    <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</h4>
    <p className="text-3xl font-black">{value}</p>
  </div>
);

const MenteeRow = ({ name, goal, progress, status, warning }: any) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#33b6ff] to-[#a855f7] p-[1px]">
        <div className="w-full h-full rounded-[11px] bg-[#020617] flex items-center justify-center font-black text-xs">{name.charAt(0)}</div>
      </div>
      <div>
        <p className="text-sm font-bold group-hover:text-[#33b6ff] transition-colors">{name}</p>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">{goal}</p>
      </div>
    </div>
    <div className="text-right">
      <p className={`text-[10px] font-black uppercase tracking-widest ${warning ? 'text-red-400' : 'text-[#33b6ff]'}`}>{status}</p>
      <div className="w-24 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
        <div className="h-full bg-[#33b6ff]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  </div>
);

const SessionItem = ({ time, date, title }: any) => (
  <div className="flex gap-4 items-center">
    <div className="text-center min-w-[50px]">
      <p className="text-sm font-black text-white">{time}</p>
      <p className="text-[9px] text-slate-500 uppercase font-black">{date}</p>
    </div>
    <div className="h-8 w-[1px] bg-white/10" />
    <p className="text-sm font-medium text-slate-300">{title}</p>
  </div>
);

export default MentorDashboard;