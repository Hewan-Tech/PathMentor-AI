import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";

// Types
import { PersonaType } from "@/lib/registrationTypes";

// Layout & Background
import { ParticlesBackground } from "@/components/landing/ParticlesBackground";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

// Section Components
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { ProgressHeroCard } from "@/components/dashboard/ProgressHeroCard";
import { SkillGrowthChart } from "@/components/dashboard/SkillGrowthChart";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RoadmapSnapshot } from "@/components/dashboard/RoadmapSnapshot";

// UI Components
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

// Icons
import { 
  ArrowRight, Sparkles, CheckCircle2, Moon, Sun, 
  Bell, Shield, Monitor, PlayCircle, BookOpen, Clock, Star 
} from "lucide-react";

interface UserPreferences {
  skill_track: string;
  experience_level: string;
  persona_type: PersonaType;
  starting_stage: string;
  lesson_length: string;
  content_priority: string;
  project_recommendation: string;
  commitment_time: string;
  learning_goal: string;
  learning_style: string;
}

interface RecommendedLesson {
  id: string;
  lesson_title: string;
  lesson_category: string;
  match_score: number;
  is_completed: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [lessons, setLessons] = useState<RecommendedLesson[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/auth"); return; }

    const fetchUser = async () => {
      try {
        const res = await api.get("/users/profile");
        const userData = res.data.user;
        setUser(userData);
        if (userData.learningProfile) {
          setPreferences({
            skill_track: userData.learningProfile.skillTrack,
            experience_level: userData.learningProfile.experienceLevel,
            persona_type: userData.learningProfile.persona,
            starting_stage: userData.learningProfile.experienceLevel,
            lesson_length: userData.learningProfile.commitmentTime,
            content_priority: "Mixed",
            project_recommendation: "",
            commitment_time: userData.learningProfile.commitmentTime,
            learning_goal: userData.learningProfile.learningGoal,
            learning_style: userData.learningProfile.learningStyle,
          });
        }
        if (userData.recommendedLessons) setLessons(userData.recommendedLessons);
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/auth");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  if (isLoading) return <div className="min-h-screen bg-background" />;

  const userName = user?.name || user?.username || "Learner";
  const userEmail = user?.email || "";
  const completedLessonsCount = lessons.filter(l => l.is_completed).length;
  
  const currentLesson = lessons.find(l => !l.is_completed);
  const newLessons = lessons.filter(l => !l.is_completed && l.id !== currentLesson?.id);
  const finishedLessons = lessons.filter(l => l.is_completed);

  return (
    <div className={`min-h-screen relative ${isDarkMode ? "bg-background text-white" : "bg-slate-50 text-slate-900"}`}>
      <ParticlesBackground />
      
      <DashboardTopNav 
        userName={userName} 
        userEmail={userEmail} 
        onSignOut={handleSignOut} 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeView={activeView}
        onViewChange={setActiveView}
        pendingMode={user?.status === 'pending'}
      />

      <main className={`relative z-10 pt-24 pb-24 transition-all duration-300 ${sidebarCollapsed ? "lg:pl-24" : "lg:pl-72"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <AnimatePresence mode="wait">
            
            {/* --- DASHBOARD VIEW --- */}
            {activeView === "dashboard" && (
              <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <WelcomeSection userName={userName} personaType={preferences?.persona_type} />
                <div className="space-y-8 mt-6">
                  <StatsGrid 
                    inProgress={lessons.length - completedLessonsCount} 
                    completed={completedLessonsCount} 
                    dailyGoal={preferences?.lesson_length || "1h"} 
                    learningStyle={preferences?.learning_style || "Visual"} 
                  />
                  <ProgressHeroCard 
                    stage={preferences?.starting_stage || "Beginner"} 
                    progressPercent={Math.round((completedLessonsCount / (lessons.length || 1)) * 100)} 
                    totalLessons={lessons.length} 
                    completedLessons={completedLessonsCount} 
                  />
                  <div className="grid lg:grid-cols-2 gap-8">
                    <RoadmapSnapshot currentStage={1} />
                    <SkillGrowthChart />
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- MY COURSES VIEW --- */}
            {activeView === "courses" && (
              <motion.div 
                key="courses" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }} 
                className="space-y-10"
              >
                <header>
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">
                    My Learning <span className="text-primary">Path</span>
                  </h2>
                  <p className="text-muted-foreground mt-2">Your curriculum is dynamically optimized based on your learning style.</p>
                </header>

                <section className="space-y-4">
                  <h3 className="text-primary text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" /> 
                    Undergoing Module
                  </h3>
                  {currentLesson ? (
                    <GlassCard className="p-8 border-primary/30 bg-primary/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                        <BookOpen size={200} />
                      </div>
                      <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-2 space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold border border-primary/30">
                              {currentLesson.lesson_category}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock size={12} /> {preferences?.commitment_time || "45m"} remaining
                            </span>
                          </div>
                          <h3 className="text-3xl font-bold text-white group-hover:text-primary transition-colors">{currentLesson.lesson_title}</h3>
                          <p className="text-muted-foreground max-w-xl leading-relaxed">
                            Tailored for your <span className="text-white font-medium">{preferences?.learning_style}</span> style.
                          </p>
                          <div className="pt-4 flex flex-wrap gap-4">
                            <GlassButton className="px-8 py-6 text-lg bg-primary text-black border-none">
                              Resume Learning <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </GlassButton>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Module Completion</span>
                              <span className="text-primary font-bold">45%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: "45%" }} className="h-full bg-primary" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  ) : (
                    <GlassCard className="p-12 text-center border-dashed border-white/10">
                      <p className="text-muted-foreground">Select a module from the track to begin.</p>
                    </GlassCard>
                  )}
                </section>

                <section className="space-y-6">
                  <h3 className="text-white/70 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" /> Recommended for your Track
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newLessons.map((lesson) => (
                      <GlassCard key={lesson.id} className="p-6 hover:border-primary/30 transition-all group relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-6">
                            <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
                              <BookOpen size={20} className="text-primary" />
                            </div>
                            <span className="text-xs font-mono text-primary">{lesson.match_score}% Match</span>
                          </div>
                          <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{lesson.lesson_title}</h4>
                          <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{lesson.lesson_category}</p>
                          <button className="text-sm font-bold flex items-center gap-1 text-white hover:text-primary transition-all pt-4 border-t border-white/5 w-full">
                            Start <ArrowRight size={14} />
                          </button>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </section>

                {finishedLessons.length > 0 && (
                  <section className="space-y-4 pt-4">
                    <h3 className="text-white/30 text-xs font-bold uppercase tracking-widest">Archive / Completed</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {finishedLessons.map(lesson => (
                        <GlassCard key={lesson.id} className="p-4 flex items-center justify-between opacity-60 hover:opacity-100 transition-all">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium truncate">{lesson.lesson_title}</span>
                          </div>
                          <ArrowRight size={12} />
                        </GlassCard>
                      ))}
                    </div>
                  </section>
                )}
              </motion.div>
            )}

            {/* --- PLACEHOLDERS FOR OTHER VIEWS --- */}
            {activeView === "assignments" && <div className="text-white">Assignments View Content...</div>}
            {activeView === "roadmap" && <div className="text-white">Full Roadmap Content...</div>}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
