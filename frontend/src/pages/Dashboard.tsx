import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import { initSocket } from "@/services/socket";
import { PersonaType } from "@/lib/registrationTypes";
import { ParticlesBackground } from "@/components/landing/ParticlesBackground";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { ProgressHeroCard } from "@/components/dashboard/ProgressHeroCard";
import { SkillGrowthChart } from "@/components/dashboard/SkillGrowthChart";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RoadmapSnapshot } from "@/components/dashboard/RoadmapSnapshot";
import { AIMentorOrb } from "@/components/dashboard/AIMentorOrb";
import { DailyMotivation } from "@/components/dashboard/DailyMotivation";
import { WeeklyGrowthReport } from "@/components/dashboard/WeeklyGrowthReport";
import { SmartReminder } from "@/components/dashboard/SmartReminder";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { 
  ArrowRight, Sparkles, CheckCircle2, Moon, Sun, 
  Bell, Shield, Monitor, PlayCircle, BookOpen, Clock, Star,
  User, Calendar, MessageSquare
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
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [lessons, setLessons] = useState<RecommendedLesson[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [assignedMentor, setAssignedMentor] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/auth"); return; }

    // Initialize socket for real-time notifications
    initSocket();

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

        // Fetch assigned mentor
        try {
          const mentorRes = await api.get("/users/my-mentor");
          setAssignedMentor(mentorRes.data.mentor);
        } catch { /* mentor fetch is non-critical */ }
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
  
  // LOGIC FOR CATEGORIZED LISTS
  // 1. "Undergoing": The first lesson that isn't finished
  const currentLesson = lessons.find(l => !l.is_completed);
  
  // 2. "New": All other lessons that aren't finished and aren't the current active one
  const newLessons = lessons.filter(l => !l.is_completed && l.id !== currentLesson?.id);
  
  // 3. "Finished": History
  const finishedLessons = lessons.filter(l => l.is_completed);

  return (
    <div className={`min-h-screen relative ${isDarkMode ? "bg-background text-white" : "bg-slate-50 text-slate-900"}`}>
      <ParticlesBackground />
      <DashboardTopNav userName={userName} userEmail={userEmail} onSignOut={handleSignOut} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeView={activeView}
        onViewChange={(view) => {
          // Dedicated pages — navigate away
          if (view === "lessons")       { navigate("/lessons");       return; }
          if (view === "courses")       { navigate("/courses");       return; }
          if (view === "leaderboard")   { navigate("/leaderboard");   return; }
          if (view === "achievements")  { navigate("/achievements");  return; }
          if (view === "announcements") { navigate("/announcements"); return; }
          if (view === "community")     { navigate("/study-buddies"); return; }
          if (view === "sessions")      { navigate("/sessions");      return; }
          if (view === "profile")       { navigate("/profile");       return; }
          if (view === "settings")      { navigate("/settings");      return; }
          if (view === "projects")      { navigate("/projects");      return; }
          // In-page views (dashboard, progress)
          setActiveView(view);
        }}
        pendingMode={user?.status === 'pending'}
      />

      <main className={`relative z-10 pt-24 pb-24 transition-all duration-300 ${sidebarCollapsed ? "lg:pl-24" : "lg:pl-72"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <AnimatePresence mode="wait">
            
            {/* --- DASHBOARD VIEW --- */}
            {activeView === "dashboard" && (
              <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <WelcomeSection userName={userName} personaType={preferences?.persona_type} />
                
                {/* Smart Reminder Banner */}
                <SmartReminder />

                <div className="space-y-8 mt-6">
                  <StatsGrid inProgress={lessons.length - completedLessonsCount} completed={completedLessonsCount} dailyGoal={preferences?.lesson_length || "1h"} learningStyle={preferences?.learning_style || "Visual"} />
                  
                  {/* Daily Motivation + Weekly Growth Report */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    <DailyMotivation />
                    <WeeklyGrowthReport />
                  </div>

                  <ProgressHeroCard 
                    stage={preferences?.starting_stage || "Beginner"} 
                    progressPercent={Math.round((completedLessonsCount / (lessons.length || 1)) * 100)} 
                    totalLessons={lessons.length} 
                    completedLessons={completedLessonsCount}
                    onStartLearning={() => {
                      if (user?.learningProfile?.course?.id) {
                        navigate("/lessons");
                      } else {
                        navigate("/courses");
                      }
                    }}
                  />

                  {/* ── Assigned Mentor Card ── */}
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <User size={18} className="text-primary" /> Your Mentor
                      </h3>
                      {assignedMentor && (
                        <button
                          onClick={() => navigate("/sessions")}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <Calendar size={12} /> Book Session
                        </button>
                      )}
                    </div>

                    {assignedMentor ? (
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-black shrink-0">
                          {assignedMentor.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-lg truncate">{assignedMentor.name}</p>
                          <p className="text-sm text-muted-foreground">{assignedMentor.skillTrack}</p>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            {assignedMentor.avgRating && (
                              <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                                <Star size={11} fill="currentColor" /> {assignedMentor.avgRating} ({assignedMentor.reviewCount} reviews)
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {assignedMentor.studentCount}/20 students
                            </span>
                          </div>
                        </div>
                        <GlassButton variant="secondary" size="sm" onClick={() => navigate("/sessions")}>
                          <MessageSquare size={14} /> Message
                        </GlassButton>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                          <User size={24} className="opacity-40" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">No mentor assigned yet</p>
                          <p className="text-sm">A mentor will be assigned based on your skill track and level.</p>
                        </div>
                      </div>
                    )}
                  </GlassCard>

                  <div className="grid lg:grid-cols-2 gap-8">
                    <RoadmapSnapshot currentStage={1} />
                    <SkillGrowthChart />
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- MY COURSES VIEW --- */}
            {activeView === "courses" && (
              <motion.div key="courses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                <h2 className="text-4xl font-bold">My Learning Path</h2>

                {/* 1. SECTION: UNDERGOING (Ongoing) */}
                <div className="space-y-4">
                  <h3 className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <PlayCircle size={16} className="animate-pulse" /> Undergoing Module
                  </h3>
                  {currentLesson ? (
                    <GlassCard className="p-8 border-primary/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <BookOpen size={160} />
                      </div>
                      <div className="relative z-10 space-y-4">
                        <h3 className="text-3xl font-bold">{currentLesson.lesson_title}</h3>
                        <p className="text-muted-foreground max-w-xl">
                          Continue your journey in <strong>{currentLesson.lesson_category}</strong>. 
                          This module is optimized for your {preferences?.learning_style} learning style.
                        </p>
                        <GlassButton className="px-8 py-6 text-lg group bg-primary text-black border-none hover:bg-primary/90">
                          Resume Learning <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </GlassButton>
                      </div>
                    </GlassCard>
                  ) : (
                    <GlassCard className="p-8 text-center text-muted-foreground border-dashed">
                      No active courses. Start a new module below!
                    </GlassCard>
                  )}
                </div>

                {/* 2. SECTION: NEW FOR YOU */}
                <div className="space-y-4">
                  <h3 className="text-white/70 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={16} /> New for You
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newLessons.length > 0 ? (
                      newLessons.map((lesson) => (
                        <GlassCard key={lesson.id} className="p-6 hover:border-white/20 transition-all flex flex-col justify-between group">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div className="bg-white/5 p-2 rounded-lg">
                                <BookOpen size={18} className="text-primary/60" />
                              </div>
                              <span className="text-[10px] font-bold px-2 py-1 rounded bg-primary/10 text-primary">NEW</span>
                            </div>
                            <h4 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{lesson.lesson_title}</h4>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{lesson.lesson_category}</p>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <span className="text-xs font-mono text-primary/60">{lesson.match_score}% AI Match</span>
                            <button className="text-sm font-bold flex items-center gap-1 text-white hover:text-primary transition-colors">
                              Start Module <ArrowRight size={14} />
                            </button>
                          </div>
                        </GlassCard>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm col-span-full italic">No new modules available in this track yet.</p>
                    )}
                  </div>
                </div>

                {/* 3. SECTION: COMPLETED (HISTORY) */}
                {finishedLessons.length > 0 && (
                   <div className="space-y-4 opacity-60">
                    <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest">Recently Completed</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {finishedLessons.map(lesson => (
                        <GlassCard key={lesson.id} className="p-4 flex items-center justify-between group hover:opacity-100 transition-opacity">
                          <span className="text-sm font-medium truncate mr-2">{lesson.lesson_title}</span>
                          <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                        </GlassCard>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* --- PROGRESS VIEW --- */}
            {activeView === "progress" && (
              <motion.div key="progress" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-1">Learning Progress</h2>
                  <p className="text-muted-foreground">Your weekly activity and skill growth</p>
                </div>
                <SkillGrowthChart />
                <ProgressHeroCard
                  stage={preferences?.starting_stage || "Beginner"}
                  progressPercent={Math.round((completedLessonsCount / (lessons.length || 1)) * 100)}
                  totalLessons={lessons.length}
                  completedLessons={completedLessonsCount}
                />
                <div className="grid sm:grid-cols-3 gap-4">
                  <GlassCard className="p-5 text-center">
                    <p className="text-3xl font-bold text-primary">{completedLessonsCount}</p>
                    <p className="text-sm text-muted-foreground mt-1">Lessons Completed</p>
                  </GlassCard>
                  <GlassCard className="p-5 text-center">
                    <p className="text-3xl font-bold text-yellow-400">{lessons.length - completedLessonsCount}</p>
                    <p className="text-sm text-muted-foreground mt-1">Lessons Remaining</p>
                  </GlassCard>
                  <GlassCard className="p-5 text-center">
                    <p className="text-3xl font-bold text-green-400">
                      {Math.round((completedLessonsCount / (lessons.length || 1)) * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Overall Progress</p>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {/* --- PROJECTS VIEW --- */}
            {activeView === "projects" && (
              <motion.div key="projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-1">Projects</h2>
                    <p className="text-muted-foreground">Practical projects assigned by your mentor</p>
                  </div>
                  <GlassButton variant="primary" onClick={() => navigate("/projects")}>
                    View All Projects <ArrowRight size={16} />
                  </GlassButton>
                </div>
                <GlassCard className="p-8 text-center border-primary/20">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Star size={28} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Your Projects</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Your mentor assigns hands-on projects to help you apply what you've learned.
                    Submit your work and get graded feedback.
                  </p>
                  <GlassButton variant="primary" onClick={() => navigate("/projects")}>
                    Open Projects <ArrowRight size={16} />
                  </GlassButton>
                </GlassCard>
              </motion.div>
            )}

            {/* --- SETTINGS VIEW (UNTOUCHED) --- */}
            {activeView === "settings" && (
              <motion.div key="sett" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl space-y-8">
                <h2 className="text-3xl font-bold">Settings</h2>
                
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><Monitor size={20} className="text-primary"/> Appearance</h3>
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">Adjust the interface theme</p>
                      </div>
                      <button 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`w-14 h-7 rounded-full p-1 transition-colors ${isDarkMode ? "bg-primary" : "bg-slate-400"}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${isDarkMode ? "translate-x-7" : "translate-x-0"} flex items-center justify-center`}>
                          {isDarkMode ? <Moon size={12} className="text-primary"/> : <Sun size={12} className="text-orange-500"/>}
                        </div>
                      </button>
                    </div>
                  </GlassCard>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><Bell size={20} className="text-primary"/> Notifications</h3>
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Get alerts for lesson reminders</p>
                      </div>
                      <button 
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`w-14 h-7 rounded-full p-1 transition-colors ${notificationsEnabled ? "bg-primary" : "bg-slate-300"}`}
                      >
                         <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationsEnabled ? "translate-x-7" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </GlassCard>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><Shield size={20} className="text-primary"/> Account Security</h3>
                  <GlassCard className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm">Email: <span className="text-muted-foreground">{userEmail}</span></p>
                      <GlassButton variant="secondary" className="text-xs h-8">Change Password</GlassButton>
                    </div>
                  </GlassCard>
                </section>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <MobileBottomNav />
      <AIMentorOrb />
    </div>
  );
};

export default Dashboard;