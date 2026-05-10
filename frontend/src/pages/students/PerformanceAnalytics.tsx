import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Trophy, Activity, Target, Sparkles, Loader2, BookOpen, Star, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useXP, useAchievements, useAI, useProfile, useCourses } from "@/hooks/useStudentApi";
import { useToast } from "@/hooks/use-toast";

const PerformanceAnalytics = () => {
  const { toast } = useToast();
  const { user } = useProfile();
  const { totalXP, loading: xpLoading } = useXP();
  const { achievements, loading: achLoading } = useAchievements();
  const { courses } = useCourses();
  const ai = useAI();

  const [report, setReport] = useState<any>(null);
  const [skillGap, setSkillGap] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setReportLoading(true);
      try {
        const [r, g] = await Promise.all([ai.getProgressReport(), ai.getSkillGap()]);
        setReport(r);
        setSkillGap(g);
      } catch { /* optional */ }
      finally { setReportLoading(false); }
    };
    load();
  }, []);

  const statCards = [
    { label: "Total XP", val: xpLoading ? "..." : totalXP.toLocaleString(), icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Achievements", val: achLoading ? "..." : achievements.length, icon: Trophy, color: "text-primary", bg: "bg-primary/10" },
    { label: "Courses", val: report?.totalCoursesEnrolled ?? courses.length, icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Levels Done", val: report?.totalLevelsCompleted ?? "—", icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10" },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
      <header>
        <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">
          Performance <span className="text-primary">Analytics</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">AI-powered insights into your learning performance.</p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <GlassCard key={i} className="p-6">
            <div className={`p-2 ${s.bg} rounded-xl w-fit mb-3`}>
              <s.icon className={s.color} size={20} />
            </div>
            <p className="text-xs text-muted-foreground font-bold uppercase">{s.label}</p>
            <p className="text-2xl font-black text-white mt-1">{s.val}</p>
          </GlassCard>
        ))}
      </div>

      {/* AI Progress Report */}
      {reportLoading ? (
        <GlassCard className="p-8 flex items-center justify-center gap-3 text-muted-foreground">
          <Loader2 size={20} className="animate-spin text-primary" />
          <span className="text-sm">Generating AI progress report...</span>
        </GlassCard>
      ) : report && (
        <GlassCard className="p-6 border-primary/20">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-6">
            <Sparkles size={14} /> AI Progress Report
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Skill Track</p>
                <p className="text-white font-bold">{report.skillTrack || "Not set"}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Current Level</p>
                <p className="text-white font-bold">{report.currentLevel || "Not set"}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Lessons Completed</p>
                <p className="text-white font-bold">{report.totalLessonsCompleted}</p>
              </div>
            </div>
            <div className="space-y-3">
              {report.courseReports?.map((cr: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-bold text-white truncate">{cr.course || "Course"}</p>
                    <span className="text-primary font-black text-sm">{cr.progressPercentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cr.progressPercentage}%` }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                    <span>{cr.lessonsCompleted}/{cr.totalLessons} lessons</span>
                    <span className="text-yellow-400">+{cr.xpEarned} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Skill Gap Analysis */}
      {skillGap && (
        <GlassCard className="p-6 border-orange-500/20">
          <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest flex items-center gap-2 mb-4">
            <Target size={14} /> Skill Gap Analysis
          </h3>
          <p className="text-sm text-white/80 mb-4">{skillGap.recommendation}</p>
          <div className="flex flex-wrap gap-2">
            {skillGap.identifiedGaps?.map((g: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs font-bold rounded-full border border-orange-500/20">
                {g}
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Weekly Activity Chart */}
      <GlassCard className="p-8">
        <h3 className="font-bold mb-6 flex items-center gap-2 text-white">
          <Activity size={18} className="text-primary" /> Weekly Activity
        </h3>
        <div className="h-48 flex items-end justify-between gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
            const heights = [40, 70, 45, 90, 65, 80, 95];
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heights[i]}%` }}
                  transition={{ delay: i * 0.1 }}
                  className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-lg"
                />
                <span className="text-[10px] text-muted-foreground">{day}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Achievements */}
      {achievements.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4">
            <Star size={14} className="text-yellow-400" /> Earned Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((a: any) => (
              <div key={a._id} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-primary/30 transition-all">
                <Trophy className="text-yellow-400 mx-auto mb-2" size={20} />
                <p className="text-xs font-bold text-white">{a.title}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{a.description}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
};

export default PerformanceAnalytics;
