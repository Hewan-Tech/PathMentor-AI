import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, ArrowRight, CheckCircle2, Sparkles,
  Loader2, AlertCircle, PlayCircle, Lock, ChevronDown, ChevronUp, Zap,
  LayoutDashboard, Shield, Brain
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { useEnrolledCourse, useRoadmap, useProgress, useAI, useProfile } from "@/hooks/useStudentApi";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useProfile();
  const { courseId, courseTitle, loading: courseLoading } = useEnrolledCourse();
  const { levels, loading: roadmapLoading } = useRoadmap(courseId);
  const { progress, loading: progressLoading, completeLesson } = useProgress(courseId);
  const ai = useAI();

  const [summary, setSummary] = useState<any>(null);
  const [nextCourses, setNextCourses] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());

  // Load AI summary once courseId is known
  useEffect(() => {
    if (!courseId) return;
    const load = async () => {
      setAiLoading(true);
      try {
        const [s, n] = await Promise.all([
          ai.summarize(courseId),
          ai.suggestNext(),
        ]);
        setSummary(s);
        setNextCourses(n?.suggestedCourses || []);
      } catch { /* optional */ }
      finally { setAiLoading(false); }
    };
    load();
  }, [courseId]);

  // Auto-expand first incomplete level
  useEffect(() => {
    if (!levels.length || !progress) return;
    const completedLevelIds = new Set(
      progress.levelsProgress?.filter((lp: any) => lp.isCompleted).map((lp: any) => lp.level) || []
    );
    const firstIncomplete = levels.find((l: any) => !completedLevelIds.has(l._id));
    if (firstIncomplete) {
      setExpandedLevels(new Set([firstIncomplete._id]));
    }
  }, [levels, progress]);

  const toggleLevel = (id: string) => {
    setExpandedLevels(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCompleteLesson = async (lessonId: string, lessonTitle: string) => {
    try {
      const res = await completeLesson(lessonId);
      toast({
        title: `✅ "${lessonTitle}" completed!`,
        description: `+${res.xpEarned ?? 0} XP earned`,
      });
    } catch (e: any) {
      toast({ title: "Error", description: e.response?.data?.message || "Failed", variant: "destructive" });
    }
  };

  // Build a set of completed lesson IDs from progress
  const completedLessonIds = new Set<string>(
    progress?.levelsProgress?.flatMap((lp: any) =>
      lp.completedLessons.map((id: any) => id.toString())
    ) || []
  );

  const getLevelProgress = (levelId: string) =>
    progress?.levelsProgress?.find((lp: any) => lp.level?.toString() === levelId?.toString());

  const isLoading = courseLoading || roadmapLoading || progressLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-muted-foreground text-sm">Loading your course...</p>
      </div>
    );
  }

  if (!courseId) {
    return (
      <GlassCard className="p-16 text-center border-dashed border-white/10">
        <AlertCircle className="mx-auto mb-4 text-muted-foreground" size={40} />
        <p className="text-white font-bold text-lg">No course assigned yet</p>
        <p className="text-muted-foreground text-sm mt-2">Complete your onboarding to get assigned a course.</p>
      </GlassCard>
    );
  }

  const totalLessons = levels.reduce((acc: number, l: any) => acc + (l.lessons?.length || 0), 0);
  const completedCount = completedLessonIds.size;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const completedLevelsCount = levels.filter((l: any) => getLevelProgress(l._id)?.isCompleted).length;

  // Tab nav items
  const tabs = [
    { label: "Roadmap", icon: LayoutDashboard, path: "/students/courses" },
    { label: "Overview", icon: BookOpen, path: "/students/courses/overview" },
    { label: "Key Concepts", icon: Brain, path: "/students/courses/concepts" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab.path} onClick={() => navigate(tab.path)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/30 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all">
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Enrolled Course</p>
          <h2 className="text-3xl font-black tracking-tighter text-white">{courseTitle}</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Track: <span className="text-white font-semibold">{user?.learningProfile?.skillTrack?.replace("_", " ") || "Full Stack"}</span>
            {" · "}Style: <span className="text-white font-semibold">{user?.learningProfile?.learningStyle || "Visual"}</span>
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="text-2xl font-black text-primary">{progressPct}%</p>
            <p className="text-[10px] text-muted-foreground uppercase">Complete</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-white">{completedLevelsCount}/{levels.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Levels</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-yellow-400">{progress?.xpEarned || 0}</p>
            <p className="text-[10px] text-muted-foreground uppercase">XP</p>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <GlassCard className="p-5 border-primary/20">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground font-bold uppercase tracking-wider">Overall Progress</span>
          <span className="text-primary font-black">{completedCount} / {totalLessons} lessons</span>
        </div>
        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
          />
        </div>
      </GlassCard>

      {/* AI Summary */}
      {aiLoading ? (
        <GlassCard className="p-5 flex items-center gap-3 text-muted-foreground text-sm border-primary/10">
          <Loader2 size={16} className="animate-spin text-primary" />
          Generating AI summary of your progress...
        </GlassCard>
      ) : summary && (
        <GlassCard className="p-6 border-primary/10 bg-primary/[0.03]">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-3">
            <Sparkles size={14} /> AI Learning Summary
          </h3>
          <p className="text-sm text-white/80 leading-relaxed">{summary.summary}</p>
          {summary.lessonsCompleted?.length > 0 && (
            <div className="mt-4 grid md:grid-cols-2 gap-2">
              {summary.lessonsCompleted.slice(0, 4).map((l: any, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 size={13} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white/70">{l.title}</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}

      {/* Roadmap Levels */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Course Roadmap</h3>

        {levels.map((level: any, li: number) => {
          const lp = getLevelProgress(level._id);
          const isCompleted = lp?.isCompleted || false;
          const isExpanded = expandedLevels.has(level._id);
          const levelLessons: any[] = level.lessons || [];
          const levelCompletedCount = levelLessons.filter((ls: any) =>
            completedLessonIds.has(ls._id.toString())
          ).length;
          const levelPct = levelLessons.length > 0
            ? Math.round((levelCompletedCount / levelLessons.length) * 100)
            : 0;

          // Lock levels after the first incomplete one
          const prevLevel = li > 0 ? levels[li - 1] : null;
          const prevLp = prevLevel ? getLevelProgress(prevLevel._id) : null;
          const isLocked = li > 0 && !prevLp?.isCompleted && !isCompleted;

          return (
            <GlassCard
              key={level._id}
              className={`overflow-hidden transition-all ${
                isCompleted ? "border-green-500/20" :
                isLocked ? "border-white/5 opacity-60" :
                "border-primary/20"
              }`}
            >
              {/* Level Header — clickable */}
              <button
                onClick={() => !isLocked && toggleLevel(level._id)}
                className="w-full p-5 flex items-center justify-between gap-4 text-left"
                disabled={isLocked}
              >
                <div className="flex items-center gap-4">
                  {/* Level number badge */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${
                    isCompleted ? "bg-green-500/20 text-green-400" :
                    isLocked ? "bg-white/5 text-white/30" :
                    "bg-primary/20 text-primary"
                  }`}>
                    {isCompleted ? <CheckCircle2 size={18} /> : isLocked ? <Lock size={16} /> : li + 1}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{level.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {levelCompletedCount}/{levelLessons.length} lessons
                      {lp?.score > 0 && <span className="ml-2 text-primary">· Score: {lp.score}%</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Mini progress bar */}
                  <div className="hidden md:block w-24">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isCompleted ? "bg-green-400" : "bg-primary"}`}
                        style={{ width: `${levelPct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 text-right">{levelPct}%</p>
                  </div>

                  {isCompleted && (
                    <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded-full font-bold border border-green-500/20 hidden md:block">
                      DONE
                    </span>
                  )}
                  {!isLocked && (
                    isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Lessons List */}
              {isExpanded && !isLocked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-white/5 px-5 pb-5 pt-4 space-y-2"
                >
                  {levelLessons.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">No lessons added yet.</p>
                  ) : levelLessons.map((lesson: any, lsi: number) => {
                    const done = completedLessonIds.has(lesson._id.toString());
                    return (
                      <div
                        key={lesson._id}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          done
                            ? "bg-green-500/5 border-green-500/10"
                            : "bg-white/[0.02] border-white/5 hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            done ? "bg-green-500/20" : "bg-white/5"
                          }`}>
                            {done
                              ? <CheckCircle2 size={14} className="text-green-400" />
                              : <PlayCircle size={14} className="text-primary" />
                            }
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm font-medium truncate ${done ? "text-muted-foreground line-through" : "text-white"}`}>
                              {lesson.title}
                            </p>
                            {lesson.description && (
                              <p className="text-[10px] text-muted-foreground truncate">{lesson.description}</p>
                            )}
                          </div>
                        </div>

                        {!done ? (
                          <div className="ml-4 flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => navigate(`/students/courses/lesson/${lesson._id}`)}
                              className="text-[10px] font-bold text-white border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all whitespace-nowrap flex items-center gap-1">
                              <PlayCircle size={11} /> Start
                            </button>
                            <button
                              onClick={() => navigate(`/students/courses/quiz/${lesson._id}`)}
                              className="text-[10px] font-bold text-primary border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-all whitespace-nowrap flex items-center gap-1">
                              <Shield size={11} /> Quiz
                            </button>
                            <button
                              onClick={() => handleCompleteLesson(lesson._id, lesson.title)}
                              className="text-[10px] font-bold text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg hover:bg-green-500/10 transition-all whitespace-nowrap">
                              ✓ Done
                            </button>
                          </div>
                        ) : (
                          <div className="ml-4 flex items-center gap-1 text-[10px] text-green-400 font-bold flex-shrink-0">
                            <Zap size={11} /> Done
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* AI Suggested Next Courses */}
      {nextCourses.length > 0 && (
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={13} className="text-primary" /> Up Next — AI Suggestions
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {nextCourses.map((c: any) => (
              <GlassCard key={c.id} className="p-5 hover:border-primary/30 transition-all group cursor-pointer">
                <div className="bg-primary/10 p-2 rounded-lg w-fit mb-3">
                  <BookOpen size={16} className="text-primary" />
                </div>
                <p className="font-bold text-white text-sm">{c.title}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{c.category}</p>
                <div className="mt-4 text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight size={12} />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MyCourses;
