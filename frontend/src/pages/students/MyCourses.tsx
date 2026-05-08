import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const GlassCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl ${className}`}>
    {children}
  </div>
);

const GlassButton = ({ children, className = "", variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-primary text-black hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10"
  };
  return (
    <button className={`px-4 py-2 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const MyCourses = ({ currentLesson, newLessons = [], finishedLessons = [], preferences }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="space-y-10"
    >
      <header>
        <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">
          My Learning <span className="text-primary">Path</span>
        </h2>
        <p className="text-muted-foreground mt-2">Personalized curriculum for your {preferences?.learning_style} style.</p>
      </header>

      {/* ACTIVE MODULE */}
      <section className="space-y-4">
        <h3 className="text-primary text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping" /> Undergoing Module
        </h3>
        <GlassCard className="p-8 border-primary/30 bg-primary/5 relative overflow-hidden group">
          <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold border border-primary/30">
                {currentLesson?.lesson_category || "General"}
              </span>
              <h3 className="text-3xl font-bold text-white">{currentLesson?.lesson_title || "Select a module"}</h3>
              <div className="pt-4 flex gap-4">
                <GlassButton className="px-8 py-4">Resume <ArrowRight className="ml-2" size={18} /></GlassButton>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
               <div className="flex justify-between text-xs mb-2">
                 <span className="text-muted-foreground">Completion</span>
                 <span className="text-primary font-bold">45%</span>
               </div>
               <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[45%]" />
               </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* RECOMMENDED */}
      <section className="grid md:grid-cols-3 gap-6">
        {newLessons.map((lesson) => (
          <GlassCard key={lesson.id} className="p-6 hover:border-primary/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="bg-primary/10 p-2 rounded-lg text-primary"><BookOpen size={20} /></div>
                <span className="text-xs font-mono text-primary">{lesson.match_score}% Match</span>
              </div>
              <h4 className="text-lg font-bold mb-2">{lesson.lesson_title}</h4>
            </div>
            <button className="mt-4 text-sm font-bold flex items-center gap-1 text-white hover:text-primary transition-all">
              Start Module <ArrowRight size={14} />
            </button>
          </GlassCard>
        ))}
      </section>
    </motion.div>
  );
};
export default MyCourses;