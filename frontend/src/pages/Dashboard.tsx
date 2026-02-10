import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
import { ArrowRight, Sparkles } from "lucide-react";

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

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // MongoDB data (future use)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [lessons, setLessons] = useState<RecommendedLesson[]>([]);
  const [loadingData, setLoadingData] = useState(false); // ✅ FIXED

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 🔐 Fetch user from Express (JWT)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/auth");
      } finally {
        setIsLoading(false);
        setLoadingData(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // 🚪 Logout
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  // ⏳ Loading state
  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-16 h-16 rounded-full bg-gradient-primary"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // 👤 User info from MongoDB
  const userName =
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "Learner";

  const userEmail = user?.email || "";

  const completedLessons = lessons.filter(l => l.is_completed).length;
  const inProgressLessons = lessons.filter(l => !l.is_completed).length;

  const currentStageNum =
    preferences?.starting_stage?.includes("Beginner")
      ? 1
      : preferences?.starting_stage?.includes("Basic")
      ? 2
      : 3;

  return (
    <div className="min-h-screen relative bg-background">
      <ParticlesBackground />

      {/* Top Navigation */}
      <DashboardTopNav
        userName={userName}
        userEmail={userEmail}
        onSignOut={handleSignOut}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main
        className={`relative z-10 pt-24 pb-24 lg:pb-8 transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-24" : "lg:pl-72"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <WelcomeSection
            userName={userName}
            personaType={preferences?.persona_type}
          />

          {/* No preferences yet */}
          {!preferences && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <GlassCard variant="elevated" className="p-8 text-center">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  Complete Your Profile
                </h2>
                <p className="text-muted-foreground mb-6">
                  Take a quick quiz to personalize your learning experience
                </p>
                <GlassButton
                  variant="primary"
                  glow
                  onClick={() => navigate("/register")}
                >
                  Start Personalization <ArrowRight className="w-5 h-5" />
                </GlassButton>
              </GlassCard>
            </motion.div>
          )}

          {preferences && (
            <>
              <StatsGrid
                inProgress={inProgressLessons}
                completed={completedLessons}
                dailyGoal={preferences.lesson_length?.split(" ")[0] || "1h"}
                learningStyle={preferences.content_priority || "Mixed"}
              />

              <ProgressHeroCard
                stage={preferences.starting_stage || "Getting Started"}
                progressPercent={
                  completedLessons > 0
                    ? Math.round(
                        (completedLessons / lessons.length) * 100
                      )
                    : 15
                }
                totalLessons={lessons.length || 10}
                completedLessons={completedLessons}
              />

              {lessons.length > 0 && (
                <ContinueLearningCard
                  lessonTitle={lessons[0].lesson_title}
                  lessonCategory={lessons[0].lesson_category}
                  duration={preferences.lesson_length || "30 min"}
                  progress={lessons[0].is_completed ? 100 : 0}
                  matchScore={lessons[0].match_score}
                />
              )}

              <div className="grid lg:grid-cols-2 gap-8">
                <TodaysLearningPlan
                  commitmentTime={preferences.commitment_time || "1 hour"}
                  tasks={[]}
                />
                <RoadmapSnapshot currentStage={currentStageNum} />
              </div>

              <AIRecommendations
                recommendations={[]}
                learningGoal={preferences.learning_goal}
                learningStyle={preferences.learning_style}
              />

              <SkillGrowthChart />
            </>
          )}
        </div>
      </main>

      <MobileBottomNav />
      <AIMentorOrb />
    </div>
  );
};

export default Dashboard;
