import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, BookOpen, Loader2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useEnrolledCourse, useAI, useProgress, useRoadmap } from "@/hooks/useStudentApi";

const KeyConceptsPage = () => {
  const navigate = useNavigate();
  const { courseId, courseTitle } = useEnrolledCourse();
  const { levels } = useRoadmap(courseId);
  const { progress } = useProgress(courseId);
  const ai = useAI();

  const [concepts, setConcepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    if (!courseId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await ai.getKeyConcepts(courseId);
        setConcepts(res?.keyConcepts || []);
      } catch { setConcepts([]); }
      finally { setLoading(false); }
    };
    load();
  }, [courseId]);

  const completedLessonIds = new Set<string>(
    progress?.levelsProgress?.flatMap((lp: any) => lp.completedLessons.map((id: any) => id.toString())) || []
  );

  // Group concepts by level
  const conceptsByLevel = levels.map((level: any) => {
    const levelLessons = level.lessons || [];
    const completedLessons = levelLessons.filter((l: any) => completedLessonIds.has(l._id.toString()));
    const levelConcepts = concepts.filter((c: any) =>
      completedLessons.some((l: any) => l.title === c.lesson)
    );
    return { level, completedLessons, levelConcepts };
  }).filter((g: any) => g.completedLessons.length > 0);

  const toggle = (i: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <button onClick={() => navigate("/students/courses")}
        className="flex items-center gap-2 text-muted-foreground hover:text-white text-sm transition-colors">
        <ArrowLeft size={16} /> Back to Course
      </button>

      <div>
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-2">
          <Sparkles size={12} /> AI Key Concepts
        </p>
        <h1 className="text-2xl font-black text-white">{courseTitle}</h1>
        <p className="text-muted-foreground text-sm mt-1">Review everything you've learned so far.</p>
      </div>

      {loading ? (
        <GlassCard className="p-12 flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-muted-foreground text-sm">AI is reviewing your completed lessons...</p>
        </GlassCard>
      ) : conceptsByLevel.length === 0 ? (
        <GlassCard className="p-16 text-center border-dashed border-white/10">
          <AlertCircle className="mx-auto mb-4 text-muted-foreground" size={40} />
          <p className="text-white font-bold">No concepts to review yet.</p>
          <p className="text-muted-foreground text-sm mt-2">Complete some lessons first to unlock AI concept reviews.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {conceptsByLevel.map(({ level, completedLessons, levelConcepts }: any, i: number) => (
            <GlassCard key={level._id} className="overflow-hidden border-primary/10">
              <button onClick={() => toggle(i)}
                className="w-full p-5 flex items-center justify-between text-left">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{level.title}</p>
                    <p className="text-[10px] text-muted-foreground">{completedLessons.length} lessons completed · {levelConcepts.length} concepts</p>
                  </div>
                </div>
                {expanded.has(i) ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
              </button>

              {expanded.has(i) && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  className="border-t border-white/5 px-5 pb-5 pt-4 space-y-3">
                  {levelConcepts.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No AI concepts extracted yet for this level.</p>
                  ) : levelConcepts.map((kc: any, j: number) => (
                    <motion.div key={j} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: j * 0.05 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-black text-primary">{j + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{kc.lesson}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{kc.concept}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default KeyConceptsPage;
