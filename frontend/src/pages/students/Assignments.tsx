import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Shield, ArrowRight, CheckCircle, Loader2, BookOpen, AlertCircle, X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useCourses, useRoadmap, useQuiz, useProgress, useProfile } from "@/hooks/useStudentApi";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

const QuizModal = ({ quiz, onClose, onSubmit }: { quiz: any; onClose: () => void; onSubmit: (score: number) => void }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((q: any, i: number) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    const pct = Math.round((correct / quiz.questions.length) * 100);
    setScore(pct);
    setSubmitted(true);
    onSubmit(pct);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg bg-[#0f0f14] border border-white/10 rounded-3xl p-8 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-white text-xl">Quiz</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-white"><X size={20} /></button>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className={`text-6xl font-black mb-4 ${score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
              {score}%
            </div>
            <p className="text-white font-bold text-lg mb-2">
              {score >= 80 ? "🎉 Level Unlocked!" : score >= 60 ? "Good effort!" : "Keep practicing!"}
            </p>
            <p className="text-muted-foreground text-sm">
              {score >= 80 ? "You passed and unlocked the next level." : "Score 80% or above to unlock the next level."}
            </p>
            <button onClick={onClose} className="mt-6 px-6 py-3 bg-primary text-black rounded-xl font-black text-sm">
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {quiz.questions.map((q: any, i: number) => (
              <div key={i} className="space-y-3">
                <p className="text-sm font-bold text-white">{i + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt: string, j: number) => (
                    <button
                      key={j}
                      onClick={() => setAnswers({ ...answers, [i]: j })}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${
                        answers[i] === j
                          ? "bg-primary/10 border-primary/40 text-primary"
                          : "bg-white/5 border-white/10 text-muted-foreground hover:text-white hover:border-white/20"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < quiz.questions.length}
              className="w-full py-3 bg-primary text-black rounded-xl font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const LessonQuizRow = ({ lesson, levelId }: { lesson: any; levelId: string }) => {
  const { quiz, loading } = useQuiz(lesson._id);
  const [showQuiz, setShowQuiz] = useState(false);
  const { toast } = useToast();

  const handleQuizSubmit = async (score: number) => {
    try {
      await api.post("/progress/level/score", { levelId, score });
      toast({ title: `Score submitted: ${score}%`, description: score >= 80 ? "Level unlocked!" : "Keep practicing!" });
    } catch { /* silent */ }
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg"><BookOpen size={16} className="text-primary" /></div>
          <div>
            <p className="text-sm font-bold text-white">{lesson.title}</p>
            {lesson.description && <p className="text-[10px] text-muted-foreground">{lesson.description}</p>}
          </div>
        </div>
        {loading ? (
          <Loader2 size={14} className="animate-spin text-muted-foreground" />
        ) : quiz ? (
          <button
            onClick={() => setShowQuiz(true)}
            className="text-[10px] font-bold text-primary border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-all flex items-center gap-1"
          >
            <Shield size={12} /> Take Quiz
          </button>
        ) : (
          <span className="text-[10px] text-muted-foreground">No quiz</span>
        )}
      </div>
      <AnimatePresence>
        {showQuiz && quiz && (
          <QuizModal quiz={quiz} onClose={() => setShowQuiz(false)} onSubmit={handleQuizSubmit} />
        )}
      </AnimatePresence>
    </>
  );
};

const Assignments = () => {
  const { user } = useProfile();
  const { courses, loading: coursesLoading } = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const { levels, loading: roadmapLoading } = useRoadmap(selectedCourseId);

  useEffect(() => {
    const profileCourseId = user?.learningProfile?.course?.id;
    if (profileCourseId) { setSelectedCourseId(profileCourseId); return; }
    if (courses.length > 0) setSelectedCourseId(courses[0]._id);
  }, [user, courses]);

  if (coursesLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <header>
        <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">
          Quizzes & <span className="text-primary">Assignments</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Complete quizzes to unlock the next level.</p>
      </header>

      {/* Course Selector */}
      {courses.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {courses.map((c: any) => (
            <button key={c._id} onClick={() => setSelectedCourseId(c._id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedCourseId === c._id
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:text-white"
              }`}>
              {c.title}
            </button>
          ))}
        </div>
      )}

      {roadmapLoading ? (
        <div className="flex items-center justify-center h-32"><Loader2 className="animate-spin text-primary" size={24} /></div>
      ) : levels.length === 0 ? (
        <GlassCard className="p-12 text-center border-dashed border-white/10">
          <AlertCircle className="mx-auto mb-3 text-muted-foreground" size={32} />
          <p className="text-muted-foreground">No assignments available yet.</p>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {levels.map((level: any) => (
            <GlassCard key={level._id} className="p-6">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-4">
                <Shield size={14} /> {level.title} — Quizzes
              </h3>
              {level.lessons?.length > 0 ? (
                <div className="space-y-2">
                  {level.lessons.map((lesson: any) => (
                    <LessonQuizRow key={lesson._id} lesson={lesson} levelId={level._id} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No lessons in this level yet.</p>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Assignments;
