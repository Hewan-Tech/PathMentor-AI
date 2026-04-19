import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import { PersonaType } from "@/lib/registrationTypes";
import { ParticlesBackground } from "@/components/landing/ParticlesBackground";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { ProgressHeroCard } from "@/components/dashboard/ProgressHeroCard";
import { ContinueLearningCard } from "@/components/dashboard/ContinueLearningCard";
import { TodaysLearningPlan } from "@/components/dashboard/TodaysLearningPlan";
import { AIRecommendations } from "@/components/dashboard/AIRecommendations";
import { RoadmapSnapshot } from "@/components/dashboard/RoadmapSnapshot";
import { SkillGrowthChart } from "@/components/dashboard/SkillGrowthChart";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { AIMentorOrb } from "@/components/dashboard/AIMentorOrb";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { 
  ArrowRight, Sparkles, CheckCircle2, Moon, Sun, 
  Bell, Shield, Monitor, Smartphone 
} from "lucide-react";

// Types stay the same
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
  
  // 1. STATE FOR NAVIGATION & THEME
  const [activeView, setActiveView] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="w-16 h-16 rounded-full bg-primary" animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
      </div>
    );
  }

  const userName = user?.name || user?.username || "Learner";
  const userEmail = user?.email || "";
  const completedLessons = lessons.filter(l => l.is_completed).length;

  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${isDarkMode ? "bg-background text-white" : "bg-slate-50 text-slate-900"}`}>
      <ParticlesBackground />

      <DashboardTopNav
        userName={userName}
        userEmail={userEmail}
        onSignOut={handleSignOut}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* 2. SIDEBAR NOW DRIVES THE VIEW */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeView={activeView}
        onViewChange={(view: string) => setActiveView(view)} 
      />

      <main className={`relative z-10 pt-24 pb-24 transition-all duration-300 ${sidebarCollapsed ? "lg:pl-24" : "lg:pl-72"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          <AnimatePresence mode="wait">
            {/* --- DASHBOARD VIEW --- */}
            {activeView === "dashboard" && (
              <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <WelcomeSection userName={userName} personaType={preferences?.persona_type} />
                <div className="space-y-8 mt-6">
                  <StatsGrid inProgress={lessons.length - completedLessons} completed={completedLessons} dailyGoal={preferences?.lesson_length || "1h"} learningStyle={preferences?.learning_style || "Visual"} />
                  <ProgressHeroCard stage={preferences?.starting_stage || "Beginner"} progressPercent={Math.round((completedLessons / (lessons.length || 1)) * 100)} totalLessons={lessons.length} completedLessons={completedLessons} />
                  <div className="grid lg:grid-cols-2 gap-8">
                    <RoadmapSnapshot currentStage={1} />
                    <SkillGrowthChart />
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- PROJECTS VIEW --- */}
            {activeView === "projects" && (
              <motion.div key="proj" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <h2 className="text-3xl font-bold">My Projects</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-bold mb-2">Portfolio Build</h3>
                    <p className="text-muted-foreground mb-4">Applying {preferences?.skill_track} concepts.</p>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-1/3" />
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {/* --- LESSONS / QUIZZES VIEW --- */}
            {activeView === "lessons" && (
              <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <h2 className="text-3xl font-bold">Quizzes & Grades</h2>
                <GlassCard className="overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr><th className="p-4">Lesson</th><th className="p-4">Score</th><th className="p-4">Status</th></tr>
                    </thead>
                    <tbody>
                      {lessons.map(l => (
                        <tr key={l.id} className="border-b border-white/5">
                          <td className="p-4">{l.lesson_title}</td>
                          <td className="p-4 font-mono text-primary">{l.is_completed ? "94%" : "--"}</td>
                          <td className="p-4">{l.is_completed ? <CheckCircle2 className="text-green-500" /> : "Pending"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </GlassCard>
              </motion.div>
            )}

            {/* --- ENHANCED SETTINGS VIEW --- */}
            {activeView === "settings" && (
              <motion.div key="sett" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl space-y-8">
                <h2 className="text-3xl font-bold">Settings</h2>
                
                {/* Appearance Section */}
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
                        className={`w-14 h-7 rounded-full p-1 transition-colors ${isDarkMode ? "bg-primary" : "bg-slate-300"}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${isDarkMode ? "translate-x-7" : "translate-x-0"} flex items-center justify-center`}>
                          {isDarkMode ? <Moon size={12} className="text-primary"/> : <Sun size={12} className="text-orange-500"/>}
                        </div>
                      </button>
                    </div>
                  </GlassCard>
                </section>

                {/* Notifications Section */}
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

                {/* Privacy & Safety */}
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