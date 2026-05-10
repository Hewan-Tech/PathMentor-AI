import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Layers, Trophy, Zap, Sparkles, ArrowRight,
  Loader2, Bell, Target, TrendingUp, Users
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  useEnrolledCourse, useRoadmap, useProgress,
  useAI, useAnnouncements, useProfile, useXP
} from "@/hooks/useStudentApi";

const CourseOverview = () => {
  const navigate = useNavigate();
  const { user } = useProfile();
  const { courseId, courseTitle } = useEnrolledCourse();
  const { levels } = useRoadmap(courseId);
  const { progress } = useProgress(courseId);
  const { totalXP } = useXP();
  const { announcements } = useAnnouncements();
  const ai = useAI();

  const [learningPath, setLearningPath] = useState<any>(null);
  const [skillGap, setSkillGap] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setAiLoading(true);
      try {
        const [path, gap] = await Promise.all([ai.getLearningPath(), ai.getSkillGap()]);
        setLearningPath(path);
        setSkillGap(gap);
      } catch { /* optional */ }
      finally { setAiLoading(false); }
    };
    load();
  }, []);

  const totalLessons = levels.reduce((a: number, l: any) => a + (l.lessons?.length || 0), 0);
  const completedLessonIds = new Set<string>(
    progress?.levelsProgress?.flatMap((lp: any) => lp.completedLessons.map((id: any) => id.toString())) || []
  );
  const completedCount = completedLessonIds.size;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const completedLevels = levels.filter((l: any) =>
    progress?.levelsProgress?.find((lp: any) => lp.level?.toString() === l._id?.toString())?.isCompleted
  ).length;

  const currentLevel = levels.find((l: any) =>
    !progress?.levelsProgress?.find((lp: any) => lp.level?.toString() === l._id?.toString())?.isCompleted
  );

  const courseAnnouncements = announcements.filter((a: any) =>
    !a.course || a.course === courseId
  ).slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Hero */}
      <GlassCard className="p-8 border-primary/20 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-5"><BookOpen size={200} /></div>
        <div className="relative z-10">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Your Enrolled Course</p>
          <h1 className="text-3xl font-black text-white mb-1">{courseTitle || "Loading..."}</h1>
          <p className="text-muted-foreground text-sm mb-6">
            {user?.learningProfile?.skillTrack?.replace(/_/g, " ")} · {user?.learningProfile?.experienceLevel} · {user?.learningProfile?.learningStyle}
          </p>
          <div className="flex flex-wrap gap-6">
            {[
              { label: "Progress", val: `${progressPct}%`, color: "text-primary" },
              { label: "Levels Done", val: `${completedLevels}/${levels.length}`, color: "text-blue-400" },
              { label: "Lessons Done", val: `${completedCount}/${totalLessons}`, color: "text-green-400" },
              { label: "XP Earned", val: progress?.xpEarned || 0, color: "text-yellow-400" },
            ].map((s, i) => (
              <div key={i}>
                <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                <p className="text-[10px] text-muted-foreground uppercase">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full" />
          </div>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Current Level + Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Level */}
          {currentLevel && (
            <GlassCard className="p-6 border-primary/20">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" /> Currently In Progress
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-black text-white">{currentLevel.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{currentLevel.lessons?.length || 0} lessons in this level</p>
                </div>
                <button onClick={() => navigate("/students/courses")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black rounded-xl text-sm font-black hover:opacity-90 transition-all">
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </GlassCard>
          )}

          {/* Level Roadmap Preview */}
          <GlassCard className="p-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4">
              <Layers size={14} className="text-primary" /> Level Roadmap
            </h3>
            <div className="space-y-2">
              {levels.map((level: any, i: number) => {
                const lp = progress?.levelsProgress?.find((p: any) => p.level?.toString() === level._id?.toString());
                const done = lp?.isCompleted;
                const active = level._id === currentLevel?._id;
                return (
                  <div key={level._id} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                    active ? "bg-primary/10 border border-primary/20" :
                    done ? "bg-green-500/5 border border-green-500/10" :
                    "bg-white/[0.02] border border-white/5"
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                      done ? "bg-green-500/20 text-green-400" :
                      active ? "bg-primary/20 text-primary" :
                      "bg-white/5 text-white/30"
                    }`}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${done ? "text-green-400" : active ? "text-white" : "text-white/40"}`}>{level.title}</p>
                      <p className="text-[10px] text-muted-foreground">{level.lessons?.length || 0} lessons{lp?.score > 0 ? ` · Score: ${lp.score}%` : ""}</p>
                    </div>
                    {done && <span className="text-[10px] text-green-400 font-bold">✓ DONE</span>}
                    {active && <span className="text-[10px] text-primary font-bold animate-pulse">ACTIVE</span>}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* AI Learning Path */}
          {aiLoading ? (
            <GlassCard className="p-6 flex items-center gap-3 text-muted-foreground text-sm">
              <Loader2 size={16} className="animate-spin text-primary" /> Loading AI insights...
            </GlassCard>
          ) : learningPath && (
            <GlassCard className="p-6 border-primary/10">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-4">
                <Sparkles size={14} /> AI Learning Path
              </h3>
              <p className="text-sm text-white/80 mb-4">{learningPath.aiRecommendation}</p>
              <div className="flex flex-wrap gap-2">
                {learningPath.suggestedLevels?.map((l: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">{l}</span>
                ))}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right: Stats + Announcements */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <GlassCard className="p-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" /> Your Stats
            </h3>
            <div className="space-y-4">
              {[
                { label: "Total XP", val: totalXP.toLocaleString(), icon: Zap, color: "text-yellow-400" },
                { label: "Course XP", val: (progress?.xpEarned || 0).toString(), icon: Trophy, color: "text-primary" },
                { label: "Skill Track", val: user?.learningProfile?.skillTrack?.replace(/_/g, " ") || "—", icon: Target, color: "text-blue-400" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3">
                    <s.icon size={16} className={s.color} />
                    <span className="text-xs text-muted-foreground font-bold uppercase">{s.label}</span>
                  </div>
                  <span className={`text-sm font-black ${s.color}`}>{s.val}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Skill Gap */}
          {skillGap && (
            <GlassCard className="p-6 border-orange-500/20">
              <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                <Target size={14} /> Skill Gap
              </h3>
              <p className="text-xs text-white/70 mb-3">{skillGap.recommendation}</p>
              <div className="flex flex-wrap gap-2">
                {skillGap.identifiedGaps?.slice(0, 3).map((g: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-orange-500/10 text-orange-400 text-[10px] font-bold rounded-full border border-orange-500/20">{g}</span>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Announcements */}
          {courseAnnouncements.length > 0 && (
            <GlassCard className="p-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                <Bell size={14} className="text-primary" /> Announcements
              </h3>
              <div className="space-y-3">
                {courseAnnouncements.map((a: any) => (
                  <div key={a._id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-xs font-bold text-white">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{a.message}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseOverview;
