import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle2, PlayCircle,
  BookOpen, Loader2, FileText, Video, Sparkles
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useProgress, useAI, useEnrolledCourse } from "@/hooks/useStudentApi";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

const LessonViewer = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { courseId } = useEnrolledCourse();
  const { progress, completeLesson, refetch } = useProgress(courseId);
  const ai = useAI();

  const [lesson, setLesson] = useState<any>(null);
  const [level, setLevel] = useState<any>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyConcepts, setKeyConcepts] = useState<any[]>([]);
  const [conceptsLoading, setConceptsLoading] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!lessonId || !courseId) return;
    const load = async () => {
      setLoading(true);
      try {
        // fetch roadmap to get lesson + siblings
        const roadmap = await api.get(`/courses/${courseId}/roadmap`);
        const levels: any[] = roadmap.data.levels || [];
        let found: any = null;
        let foundLevel: any = null;
        let siblings: any[] = [];
        for (const lv of levels) {
          const match = lv.lessons?.find((l: any) => l._id === lessonId);
          if (match) { found = match; foundLevel = lv; siblings = lv.lessons; break; }
        }
        setLesson(found);
        setLevel(foundLevel);
        setAllLessons(siblings);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, [lessonId, courseId]);

  useEffect(() => {
    if (!courseId) return;
    const load = async () => {
      setConceptsLoading(true);
      try {
        const res = await ai.getKeyConcepts(courseId);
        setKeyConcepts(res?.keyConcepts?.slice(0, 4) || []);
      } catch { /* optional */ }
      finally { setConceptsLoading(false); }
    };
    load();
  }, [courseId]);

  const isDone = progress?.levelsProgress
    ?.flatMap((lp: any) => lp.completedLessons.map((id: any) => id.toString()))
    .includes(lessonId) || false;

  const currentIndex = allLessons.findIndex((l: any) => l._id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleComplete = async () => {
    if (isDone || !lessonId) return;
    setCompleting(true);
    try {
      const res = await completeLesson(lessonId!);
      toast({ title: "✅ Lesson completed!", description: `+${res.xpEarned ?? 0} XP earned` });
      if (nextLesson) navigate(`/students/courses/lesson/${nextLesson._id}`);
    } catch (e: any) {
      toast({ title: "Error", description: e.response?.data?.message || "Failed", variant: "destructive" });
    } finally { setCompleting(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  if (!lesson) return (
    <GlassCard className="p-16 text-center border-dashed border-white/10">
      <p className="text-muted-foreground">Lesson not found.</p>
    </GlassCard>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      {/* Back */}
      <button onClick={() => navigate("/students/courses")}
        className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm">
        <ArrowLeft size={16} /> Back to Course
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{level?.title}</p>
          <h1 className="text-2xl font-black text-white">{lesson.title}</h1>
          {lesson.description && <p className="text-muted-foreground text-sm mt-1">{lesson.description}</p>}
        </div>
        {isDone && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full flex-shrink-0">
            <CheckCircle2 size={12} /> COMPLETED
          </span>
        )}
      </div>

      {/* Video */}
      {lesson.videoUrl && (
        <GlassCard className="overflow-hidden border-primary/20">
          <div className="aspect-video bg-black/60 flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <a href={lesson.videoUrl} target="_blank" rel="noreferrer"
                className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:bg-primary/30 transition-all">
                  <PlayCircle size={32} className="text-primary" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">Watch Lesson Video</span>
              </a>
            </div>
            <Video size={120} className="text-white/5" />
          </div>
        </GlassCard>
      )}

      {/* Content */}
      {lesson.content && (
        <GlassCard className="p-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4">
            <FileText size={14} className="text-primary" /> Lesson Content
          </h3>
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-white/80 leading-relaxed whitespace-pre-line">{lesson.content}</p>
          </div>
        </GlassCard>
      )}

      {/* Key Concepts */}
      {!conceptsLoading && keyConcepts.length > 0 && (
        <GlassCard className="p-6 border-primary/10">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-4">
            <Sparkles size={14} /> AI Key Concepts
          </h3>
          <div className="space-y-3">
            {keyConcepts.map((kc: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-black text-primary">{i + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{kc.lesson}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{kc.concept}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Navigation + Complete */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={() => prevLesson && navigate(`/students/courses/lesson/${prevLesson._id}`)}
          disabled={!prevLesson}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-muted-foreground hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} /> Previous
        </button>

        <button
          onClick={handleComplete}
          disabled={isDone || completing}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
            isDone
              ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-default"
              : "bg-primary text-black hover:opacity-90"
          }`}
        >
          {completing ? <Loader2 size={16} className="animate-spin" /> : isDone ? <><CheckCircle2 size={16} /> Done</> : "Mark as Complete"}
        </button>

        <button
          onClick={() => nextLesson && navigate(`/students/courses/lesson/${nextLesson._id}`)}
          disabled={!nextLesson}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-muted-foreground hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default LessonViewer;
