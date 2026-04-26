import React, { useEffect, useRef } from "react";
import {
  Users,
  UserCheck,
  Bell,
  ArrowUpRight,
  Activity,
  CreditCard,
  Star,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

const glass =
  "relative overflow-hidden rounded-2xl " +
  "bg-white/10 backdrop-blur-3xl border border-white/20 " + "bg-hero-bg.jpg" + 
  "shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.18),0_0_20px_rgba(34,211,238,0.12)] " +
  "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-transparent before:pointer-events-none " +
  "hover:border-cyan-300/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_25px_rgba(34,211,238,0.2)] transition-all duration-300";

const AdminDashboard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawChart = () => {
      const W =
        (canvas.width =
          canvas.parentElement?.clientWidth || 800);
      const H = (canvas.height = 340);

      const data = [
        1050, 1200, 1150, 1350, 1500, 1400, 1900, 2100,
        2300, 2100, 2750, 3000, 3200, 3500, 3750, 3820,
      ];

      const padLeft = 48;
      const padBottom = 40;
      const chartW = W - padLeft - 20;
      const chartH = H - 20 - padBottom;
      const maxVal = 4000;

      ctx.clearRect(0, 0, W, H);
      ctx.font = "11px Inter";

      [0, 1000, 2000, 3000, 4000].forEach((tick) => {
        const y =
          20 + chartH - (tick / maxVal) * chartH;

        ctx.fillStyle = "rgba(148,163,184,.8)";
        ctx.textAlign = "right";
        ctx.fillText(
          tick === 0 ? "0" : tick / 1000 + "K",
          padLeft - 10,
          y + 4
        );

        ctx.strokeStyle =
          "rgba(255,255,255,.08)";
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(padLeft + chartW, y);
        ctx.stroke();
      });

      const pts = data.map((v, i) => ({
        x:
          padLeft +
          (i / (data.length - 1)) * chartW,
        y:
          20 +
          chartH -
          (v / maxVal) * chartH,
      }));

      const grad = ctx.createLinearGradient(
        0,
        20,
        0,
        20 + chartH
      );
      grad.addColorStop(
        0,
        "rgba(34,211,238,.28)"
      );
      grad.addColorStop(
        1,
        "rgba(34,211,238,0)"
      );

      ctx.beginPath();
      ctx.moveTo(pts[0].x, 20 + chartH);
      pts.forEach((p) =>
        ctx.lineTo(p.x, p.y)
      );
      ctx.lineTo(
        pts[pts.length - 1].x,
        20 + chartH
      );
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach((p) =>
        ctx.lineTo(p.x, p.y)
      );
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 3;
      ctx.stroke();
    };

    drawChart();
    window.addEventListener("resize", drawChart);

    return () =>
      window.removeEventListener(
        "resize",
        drawChart
      );
  }, []);

  return (
    <div className="space-y-8 pb-10 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-2">
      {/* TOP */}
      <div className="grid grid-cols-4 gap-6">
        <GlassStatCard
          label="Total Students"
          value="3,281"
          trend="+12.5%"
          icon={<Users className="text-cyan-300" />}
          color="#22d3ee"
        />
        <GlassStatCard
          label="Mentors"
          value="142"
          trend="+8.3%"
          icon={
            <UserCheck className="text-fuchsia-400" />
          }
          color="#d946ef"
        />
        <GlassStatCard
          label="Courses"
          value="87"
          trend="+5.7%"
          icon={
            <BookOpen className="text-emerald-400" />
          }
          color="#10b981"
        />
        <GlassStatCard
          label="Pending Requests"
          value="24"
          trend="-3.1%"
          icon={
            <Bell className="text-orange-400" />
          }
          color="#fb923c"
          isNegative
        />
      </div>

      {/* CENTER */}
      <div className="grid grid-cols-3 gap-6">
        <div className={`${glass} col-span-2 p-8`}>
          <div className="relative z-10 flex justify-between items-center mb-10">
            <h3 className="text-lg font-bold text-white">
              Platform Overview
            </h3>

            <div className="flex gap-2">
              <select className="bg-white/10 border border-white/20 rounded px-3 py-1 text-xs text-cyan-200 outline-none backdrop-blur-xl">
                <option>This Month</option>
              </select>

              <select className="bg-white/10 border border-white/20 rounded px-3 py-1 text-xs text-cyan-200 outline-none backdrop-blur-xl">
                <option>Line Chart</option>
              </select>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-4 gap-4 mb-8">
            <MiniStat
              label="Active Students"
              value="2,341"
              trend="10.2%"
            />
            <MiniStat
              label="Active Mentors"
              value="98"
              trend="6.1%"
            />
            <MiniStat
              label="Enrollments"
              value="4,871"
              trend="14.6%"
            />
            <MiniStat
              label="Completion Rate"
              value="68.4%"
              trend="5.7%"
            />
          </div>

          <canvas
            ref={canvasRef}
            className="relative z-10 w-full"
          />

          <div className="relative z-10 flex justify-between mt-6 px-12 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <span>May 1</span>
            <span>May 6</span>
            <span>May 11</span>
            <span>May 16</span>
            <span>May 21</span>
            <span>May 26</span>
            <span>May 31</span>
          </div>
        </div>

        <div className={`${glass} p-8`}>
          <div className="relative z-10 flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white">
              Live Activity
            </h3>
            <button className="text-cyan-300 text-xs font-bold hover:underline">
              View All
            </button>
          </div>

          <div className="relative z-10 space-y-6">
            <ActivityItem
              icon={<Activity size={16} />}
              color="bg-cyan-500/20 text-cyan-300"
              text="Mentor Samuel graded 34 students"
              time="2m ago"
            />
            <ActivityItem
              icon={<Users size={16} />}
              color="bg-indigo-500/20 text-indigo-300"
              text="Student Hana enrolled in React Course"
              time="5m ago"
            />
            <ActivityItem
              icon={<CreditCard size={16} />}
              color="bg-emerald-500/20 text-emerald-300"
              text="Payment received from 18 students"
              time="18m ago"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-4 gap-6">
        <DataList title="Top Mentors">
          <RankRow
            rank="1"
            name="Jane Cooper"
            rating="4.9"
            count="256"
          />
          <RankRow
            rank="2"
            name="Cody Fisher"
            rating="4.8"
            count="189"
          />
          <RankRow
            rank="3"
            name="Esther Howard"
            rating="4.8"
            count="176"
          />
        </DataList>

        <DataList title="Recent Enrollments">
          <EnrollRow
            name="Brooklyn Simmons"
            course="React for Beginners"
            time="2m ago"
          />
          <EnrollRow
            name="Ralph Edwards"
            course="UI/UX Design Mastery"
            time="5m ago"
          />
          <EnrollRow
            name="Wade Warren"
            course="Python Programming"
            time="10m ago"
          />
        </DataList>

        <DataList title="Recent Payments">
          <PaymentRow
            name="Savannah Nguyen"
            amount="$49.00"
            time="2m ago"
          />
          <PaymentRow
            name="Marvin McKinney"
            amount="$79.00"
            time="5m ago"
          />
          <PaymentRow
            name="Jerome Bell"
            amount="$49.00"
            time="18m ago"
          />
        </DataList>

        <div className={`${glass} p-6`}>
          <h4 className="relative z-10 text-sm font-bold text-white mb-6">
            System Health
          </h4>

          <div className="relative z-10 flex justify-center mb-8">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="rgba(255,255,255,.08)"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="251"
                  strokeDashoffset="25"
                />
              </svg>

              <div className="absolute text-center">
                <p className="text-xl font-bold text-white leading-none">
                  98%
                </p>
                <p className="text-[9px] text-emerald-400 font-bold uppercase mt-1">
                  Healthy
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            <HealthRow
              icon={
                <CheckCircle2
                  size={14}
                  className="text-emerald-400"
                />
              }
              label="Server Status"
              status="Operational"
            />
            <HealthRow
              icon={
                <CheckCircle2
                  size={14}
                  className="text-emerald-400"
                />
              }
              label="Database"
              status="Operational"
            />
            <HealthRow
              icon={
                <Activity
                  size={14}
                  className="text-orange-400"
                />
              }
              label="Storage"
              status="85% Used"
              isWarn
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* COMPONENTS */

const GlassStatCard = ({
  label,
  value,
  trend,
  icon,
  color,
  isNegative,
}: any) => (
  <div className={`${glass} p-6 flex flex-col group`}>
    <div className="relative z-10 flex justify-between items-start mb-2">
      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
        {icon}
      </div>

      <div className="text-right">
        <h2 className="text-2xl font-bold text-white leading-none">
          {value}
        </h2>

        <p
          className={`text-[10px] font-bold mt-1 ${
            isNegative
              ? "text-red-400"
              : "text-emerald-400"
          }`}
        >
          {trend}
          <span className="text-slate-500 font-normal ml-1">
            this month
          </span>
        </p>
      </div>
    </div>

    <p className="relative z-10 text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1 mb-4">
      {label}
    </p>

    <div className="relative z-10 h-10 w-full mt-auto opacity-50 group-hover:opacity-80 transition-opacity">
      <svg viewBox="0 0 100 20" className="w-full h-full">
        <path
          d="M0,15 C20,12 40,18 60,10 C80,2 100,15 100,15"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      </svg>
    </div>
  </div>
);

const MiniStat = ({
  label,
  value,
  trend,
}: any) => (
  <div>
    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">
      {label}
    </p>

    <div className="flex items-center gap-2">
      <span className="text-xl font-bold text-white">
        {value}
      </span>

      <span className="text-emerald-400 text-[10px] flex items-center font-bold">
        <ArrowUpRight
          size={10}
          className="mr-0.5"
        />
        {trend}
      </span>
    </div>
  </div>
);

const ActivityItem = ({
  icon,
  color,
  text,
  time,
}: any) => (
  <div className="flex gap-4 group cursor-pointer">
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}
    >
      {icon}
    </div>

    <div className="flex-1 pb-1">
      <p className="text-xs text-slate-200 font-medium group-hover:text-white transition-colors leading-tight">
        {text}
      </p>
      <span className="text-[10px] text-slate-500 font-bold uppercase block mt-1">
        {time}
      </span>
    </div>
  </div>
);

const DataList = ({
  title,
  children,
}: any) => (
  <div className={`${glass} p-6`}>
    <div className="relative z-10 flex justify-between items-center mb-6">
      <h4 className="text-sm font-bold text-white">
        {title}
      </h4>
      <button className="text-cyan-300 text-[10px] font-bold uppercase hover:underline">
        View All
      </button>
    </div>

    <div className="relative z-10 space-y-4">
      {children}
    </div>
  </div>
);

const RankRow = ({
  rank,
  name,
  rating,
  count,
}: any) => (
  <div className="flex items-center justify-between text-xs font-semibold">
    <div className="flex items-center gap-3">
      <span className="text-slate-500 w-3">
        {rank}
      </span>
      <img
        src={`https://i.pravatar.cc/80?u=${name}`}
        className="w-7 h-7 rounded-full border border-white/20"
      />
      <span className="text-slate-200">
        {name}
      </span>
    </div>

    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1 text-amber-400">
        <Star
          size={10}
          fill="currentColor"
        />
        {rating}
      </span>

      <span className="text-slate-500 font-normal">
        {count} Students
      </span>
    </div>
  </div>
);

const EnrollRow = ({
  name,
  course,
  time,
}: any) => (
  <div className="flex items-center justify-between text-xs font-semibold">
    <div className="flex items-center gap-3">
      <img
        src={`https://i.pravatar.cc/80?u=${name}`}
        className="w-7 h-7 rounded-full border border-white/20"
      />
      <div>
        <p className="text-slate-200 leading-none">
          {name}
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          {course}
        </p>
      </div>
    </div>

    <span className="text-[10px] text-slate-500">
      {time}
    </span>
  </div>
);

const PaymentRow = ({
  name,
  amount,
  time,
}: any) => (
  <div className="flex items-center justify-between text-xs font-semibold">
    <div className="flex items-center gap-3">
      <img
        src={`https://i.pravatar.cc/80?u=${name}`}
        className="w-7 h-7 rounded-full border border-white/20"
      />
      <span className="text-slate-200">
        {name}
      </span>
    </div>

    <div className="flex items-center gap-4">
      <span className="text-white">
        {amount}
      </span>
      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
        Completed
      </span>
    </div>
  </div>
);

const HealthRow = ({
  icon,
  label,
  status,
  isWarn,
}: any) => (
  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
    <div className="flex items-center gap-2 text-slate-400">
      {icon}
      <span>{label}</span>
    </div>

    <span
      className={
        isWarn
          ? "text-orange-400"
          : "text-emerald-400"
      }
    >
      {status}
    </span>
  </div>
);

export default AdminDashboard;