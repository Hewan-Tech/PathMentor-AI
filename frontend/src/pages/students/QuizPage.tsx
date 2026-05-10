import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, XCircle, Clock, Trophy,
  Loader2, Shield, ArrowRight, RotateCcw
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useProgress, useEnrolledCourse } from "@/hooks/useStudentApi";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

const QuizPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { courseId } = useEnrolledCourse();
  const { updateScore } = useProgress(courseId);

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lessonTitle, setLessonTitle] = useState("");
  const [levelId, setLevelId] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);

  useEffect(() => {
    if (!lessonId || !courseId) return;
    const load = async () => {
      setLoading(true);
      try {
        const [quizRes, roadmap] = await Promise.all([
          api.get(`/quizzes/lesson/${lessonId}`),
          api.get(`/courses/${courseId}/roadmap`),
        ]);
        const q = quizRes.data.data;
        setQuiz(q);
        if (q) {
          setTimeLeft(q.questions.length * 45); // 45s per question
          setTimerActive(true);
        }
        // find lesson title + levelId from roadmap
        const levels: any[] = roadmap.data.levels || [];
        for (const lv of levels) {
          const match = lv.lessons?.find((l: any) => l._id === lessonId);
          if (match) { setLessonTitle(match.title); setLevelId(lv._id); break; }
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, [lessonId, courseId]);

  // Countdown timer
  useEffect(() => {
    if (!timerActive || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerActive, submitted]);

  const handleSubmit = useCallback(async () => {
    if (!quiz || submitted) return;
    setTimerActive(false);
    let correct = 0;
    quiz.questions.forEach((q: any, i: number) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    const pct = Math.round((correct / quiz.questions.length) * 100);
    setScore(pct);
    setSubmitted(true);
    if (levelId) {
      try {
        await updateScore(levelId, pct);
        if (pct >= 80) toast({ title: "🎉 Level Unlocked!", description: `You scored ${pct}% — next level is now available.` });
        else toast({ title: `Score: ${pct}%`, description: "Score 80% or above to unlock the next level.", variant: "destructive" });
      } catch { /* silent */ }
    }
  }, [quiz, answers, submitted, levelId, updateScore, toast]);

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setCurrentQ(0);
    if (quiz) { setTimeLeft(quiz.questions.length * 45); setTimerActive(true); }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const answeredCount = Object.keys(answers).length;
  const totalQ = quiz?.questions?.length || 0;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  if (!quiz) return (
    <GlassCard className="p-16 text-center border-dashed border-white/10">
      <Shield className="mx-auto mb-4 text-muted-foreground" size={40} />
      <p className="text-white font-bold">No quiz available for this lesson.</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-sm text-primary hover:underline">Go back</button>
    </GlassCard>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-white text-sm transition-colors">
        <ArrowLeft size={16} /> Back to Lesson
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Quiz</p>
          <h1 className="text-xl font-black text-white">{lessonTitle}</h1>
        </div>
        {!submitted && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm ${
            timeLeft < 30 ? "border-red-500/30 text-red-400 bg-red-500/10" : "border-white/10 text-white bg-white/5"
          }`}>
            <Clock size={14} /> {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Result Screen */}
      <AnimatePresence>
        {submitted && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassCard className={`p-10 text-center ${score >= 80 ? "border-green-500/30" : "border-red-500/20"}`}>
              <div className={`text-7xl font-black mb-4 ${score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                {score}%
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                {score >= 80 ? <Trophy className="text-yellow-400" size={24} /> : <XCircle className="text-red-400" size={24} />}
                <p className="text-white font-black text-xl">
                  {score >= 80 ? "Level Unlocked! 🎉" : score >= 60 ? "Good Effort!" : "Keep Practicing"}
                </p>
              </div>
              <p className="text-muted-foreground text-sm mb-8">
                {score >= 80
                  ? "You passed! The next level is now available."
                  : `You need 80% to unlock the next level. You scored ${score}%.`}
              </p>

              {/* Answer Review */}
              <div className="text-left space-y-3 mb-8">
                {quiz.questions.map((q: any, i: number) => {
                  const correct = answers[i] === q.correctAnswer;
                  return (
                    <div key={i} className={`p-4 rounded-xl border ${correct ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                      <div className="flex items-start gap-2">
                        {correct ? <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" /> : <XCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />}
                        <div>
                          <p className="text-sm font-bold text-white">{q.question}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Your answer: <span className={correct ? "text-green-400" : "text-red-400"}>{q.options[answers[i]] ?? "Not answered"}</span>
                          </p>
                          {!correct && (
                            <p className="text-xs text-green-400 mt-0.5">Correct: {q.options[q.correctAnswer]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 justify-center">
                <button onClick={handleRetry}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-sm font-bold text-white hover:bg-white/5 transition-all">
                  <RotateCcw size={16} /> Retry
                </button>
                <button onClick={() => navigate("/students/courses")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-black text-sm font-black hover:opacity-90 transition-all">
                  Back to Course <ArrowRight size={16} />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Questions */}
      {!submitted && (
        <>
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Question {currentQ + 1} of {totalQ}</span>
            <span>{answeredCount}/{totalQ} answered</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((currentQ + 1) / totalQ) * 100}%` }} />
          </div>

          {/* Current Question */}
          <AnimatePresence mode="wait">
            <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <GlassCard className="p-6 border-primary/20">
                <p className="text-white font-bold text-lg mb-6">{quiz.questions[currentQ].question}</p>
                <div className="space-y-3">
                  {quiz.questions[currentQ].options.map((opt: string, j: number) => (
                    <button key={j} onClick={() => setAnswers({ ...answers, [currentQ]: j })}
                      className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all ${
                        answers[currentQ] === j
                          ? "bg-primary/10 border-primary/50 text-primary font-bold"
                          : "bg-white/[0.02] border-white/10 text-white hover:border-white/20 hover:bg-white/5"
                      }`}>
                      <span className={`inline-flex w-6 h-6 rounded-lg items-center justify-center text-[10px] font-black mr-3 ${
                        answers[currentQ] === j ? "bg-primary text-black" : "bg-white/10 text-muted-foreground"
                      }`}>
                        {String.fromCharCode(65 + j)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setCurrentQ(p => Math.max(0, p - 1))} disabled={currentQ === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-muted-foreground hover:text-white transition-all disabled:opacity-30">
              <ArrowLeft size={16} /> Prev
            </button>

            {currentQ < totalQ - 1 ? (
              <button onClick={() => setCurrentQ(p => Math.min(totalQ - 1, p + 1))}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-white hover:bg-white/5 transition-all">
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={answeredCount < totalQ}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-black text-sm font-black disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all">
                Submit Quiz <Shield size={16} />
              </button>
            )}
          </div>

          {/* Question dots */}
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {quiz.questions.map((_: any, i: number) => (
              <button key={i} onClick={() => setCurrentQ(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  i === currentQ ? "bg-primary text-black" :
                  answers[i] !== undefined ? "bg-green-500/20 text-green-400 border border-green-500/20" :
                  "bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}>
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default QuizPage;
