import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
//const { user, signOut, isLoading } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [lessons, setLessons] = useState<RecommendedLesson[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // useEffect(() => {
  //   if (!isLoading && !user) {
  //     navigate("/auth");
  //   }
  // }, [user, isLoading, navigate]);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (!user) return;
  //     try {
  //       const { data: prefsData } = await supabase
  //         .from("user_preferences")
  //         .select("*")
  //         .eq("user_id", user.id)
  //         .maybeSingle();

  //       if (prefsData) setPreferences(prefsData as UserPreferences);

  //       const { data: lessonsData } = await supabase
  //         .from("recommended_lessons")
  //         .select("*")
  //         .eq("user_id", user.id)
  //         .order("match_score", { ascending: false })
  //         .limit(5);

  //       if (lessonsData) setLessons(lessonsData as RecommendedLesson[]);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     } finally {
  //       setLoadingData(false);
  //     }
  //   };
  //   fetchUserData();
  // }, [user]);

  // const handleSignOut = async () => {
  //   await signOut();
  //   navigate("/");
  // };

  // if (isLoading || loadingData) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <motion.div
  //         className="w-16 h-16 rounded-full bg-gradient-primary"
  //         animate={{ rotate: 360, scale: [1, 1.1, 1] }}
  //         transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
  //       />
  //     </div>
  //   );
  // }

  //const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Learner";
  //const userEmail = user?.email || "";
  const completedLessons = lessons.filter((l) => l.is_completed).length;
  const inProgressLessons = lessons.filter((l) => !l.is_completed).length;
  const currentStageNum = preferences?.starting_stage?.includes("Beginner") ? 1 : preferences?.starting_stage?.includes("Basic") ? 2 : 3;

  return (
    <div className="min-h-screen relative bg-background">
      <ParticlesBackground />

      {/* Top Navigation */}
      {/* <DashboardTopNav
        userName={userName}
        userEmail={userEmail}
        onSignOut={handleSignOut}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      /> */}

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
          {/* Welcome Section */}
          <WelcomeSection userName="mr.x" personaType={preferences?.persona_type} />

          {/* No preferences - prompt to complete profile */}
          {!preferences && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <GlassCard variant="elevated" className="p-8 text-center">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Complete Your Profile</h2>
                <p className="text-muted-foreground mb-6">Take a quick quiz to personalize your learning experience</p>
                <GlassButton variant="primary" glow onClick={() => navigate("/register")}>
                  Start Personalization <ArrowRight className="w-5 h-5" />
                </GlassButton>
              </GlassCard>
            </motion.div>
          )}

          {preferences && (
            <>
              {/* Stats Grid */}
              <StatsGrid
                inProgress={inProgressLessons}
                completed={completedLessons}
                dailyGoal={preferences.lesson_length?.split(" ")[0] || "1h"}
                learningStyle={preferences.content_priority || "Mixed"}
              />

              {/* Progress Hero */}
              <ProgressHeroCard
                stage={preferences.starting_stage || "Getting Started"}
                progressPercent={completedLessons > 0 ? Math.round((completedLessons / lessons.length) * 100) : 15}
                totalLessons={lessons.length || 10}
                completedLessons={completedLessons}
              />

              {/* Continue Learning */}
              {lessons.length > 0 && (
                <ContinueLearningCard
                  lessonTitle={lessons[0].lesson_title}
                  lessonCategory={lessons[0].lesson_category}
                  duration={preferences.lesson_length || "30 min"}
                  progress={lessons[0].is_completed ? 100 : 0}
                  matchScore={lessons[0].match_score}
                />
              )}

              {/* Two Column Layout */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Today's Plan */}
                <TodaysLearningPlan commitmentTime={preferences.commitment_time || "1 hour"} tasks={[]} />

                {/* Roadmap Snapshot */}
                <RoadmapSnapshot currentStage={currentStageNum} />
              </div>

              {/* AI Recommendations */}
              <AIRecommendations
                recommendations={[]}
                learningGoal={preferences.learning_goal}
                learningStyle={preferences.learning_style}
              />

              {/* Analytics Chart */}
              <SkillGrowthChart />
            </>
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />

      {/* AI Mentor Orb */}
      <AIMentorOrb />
    </div>
  );
};

export default Dashboard;
