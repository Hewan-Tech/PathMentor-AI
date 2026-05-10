import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ParticlesBackground } from "@/components/landing/ParticlesBackground";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { ProgressHeroCard } from "@/components/dashboard/ProgressHeroCard";
import { SkillGrowthChart } from "@/components/dashboard/SkillGrowthChart";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RoadmapSnapshot } from "@/components/dashboard/RoadmapSnapshot";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, Trophy, Zap, BookOpen, AlertCircle, Loader2 } from "lucide-react";
import { useProfile, useXP, useAchievements, useAI, useCourses, useProgress } from "@/hooks/useStudentApi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [aiData, setAiData] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const { user, loading: profileLoading } = useProfile();
  const { totalXP } = useXP();
  const { achievements } = useAchievements();
  const { courses } = useCourses();
  const ai = useAI();

  const firstCourseId = user?.learningProfile?.course?.id || courses[0]?._id || null;
  const { progress } = useProgress(firstCourseId);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/auth"); return; }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const loadAI = async () => {
      setAiLoading(true);
      try {
        const [path, gap] = await Promise.all([ai.getLearningPath(), ai.getSkillGap()]);
        setAiData({ path, gap });
      } catch { /* AI data optional */ }
      finally { setAiLoading(false); }
    };
    loadAI();
  }, [user]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const completedLessons = progress?.completedLessons || 0;
  const totalLessons = progress?.totalLessons || 0;
  const progressPct = progress?.progressPercentage || 0;

  return (
    <div className="min-h-screen relative bg-background text-white">
      <ParticlesBackground />
      <DashboardTopNav
        userName={user?.name || "Learner"}
        userEmail={user?.email || ""}
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
        pendingMode={false}
      />

      <main className={`relative z-10 pt-24 pb-24 transition-all duration-300 ${sidebarCollapsed ? "lg:pl-24" : "lg:pl-72"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">

          <WelcomeSection
            userName={user?.name || "Learner"}
            personaType={user?.learningProfile?.persona}
          />

          {/* Stats */}
          <StatsGrid
            inProgress={totalLessons - completedLessons}
            completed={completedLessons}
            dailyGoal={user?.learningProfile?.commitmentTime || "1h"}
            learningStyle={user?.learningProfile?.learningStyle || "Visual"}
          />

          {/* XP + Achievements */}
          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard className="p-6 flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl"><Zap className="text-yellow-400" size={24} /></div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Total XP</p>
                <p className="text-2xl font-black text-white">{totalXP.toLocaleString()}</p>
              </div>
            </GlassCard>
            <GlassCard className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl"><Trophy className="text-primary" size={24} /></div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Achievements</p>
                <p className="text-2xl font-black text-white">{achievements.length}</p>
              </div>
            </GlassCard>
            <GlassCard className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl"><BookOpen className="text-blue-400" size={24} /></div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">Progress</p>
                <p className="text-2xl font-black text-white">{progressPct}%</p>
              </div>
            </GlassCard>
          </div>

          <ProgressHeroCard
            stage={user?.learningProfile?.experienceLevel || "Beginner"}
            progressPercent={progressPct}
            totalLessons={totalLessons}
            completedLessons={completedLessons}
          />

          <div className="grid lg:grid-cols-2 gap-8">
            <RoadmapSnapshot currentStage={1} />
            <SkillGrowthChart />
          </div>

          {/* AI Insights Panel */}
          <GlassCard className="p-6 border-primary/20">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-4">
              <Sparkles size={14} /> AI Insights
            </h3>
            {aiLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 size={16} className="animate-spin" /> Analyzing your learning profile...
              </div>
            ) : aiData ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-2">Skill Gap</p>
                  <p className="text-sm text-white">{aiData.gap?.recommendation || "No gaps detected."}</p>
                  {aiData.gap?.identifiedGaps?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {aiData.gap.identifiedGaps.map((g: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-orange-500/10 text-orange-400 text-[10px] font-bold rounded-full border border-orange-500/20">{g}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-2">Recommended Path</p>
                  <p className="text-sm text-white">{aiData.path?.aiRecommendation || "Complete your profile for recommendations."}</p>
                  {aiData.path?.suggestedLevels?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {aiData.path.suggestedLevels.map((l: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">{l}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <AlertCircle size={16} /> Complete your learning profile to unlock AI insights.
              </div>
            )}
          </GlassCard>

          {/* Recent Achievements */}
          {achievements.length > 0 && (
            <GlassCard className="p-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                <Trophy size={14} className="text-yellow-400" /> Recent Achievements
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.slice(0, 4).map((a: any) => (
                  <div key={a._id} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <Trophy className="text-yellow-400 mx-auto mb-2" size={20} />
                    <p className="text-xs font-bold text-white">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{a.description}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
