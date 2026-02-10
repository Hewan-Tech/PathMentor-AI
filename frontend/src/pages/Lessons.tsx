// import { useState, useMemo } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// import { ParticlesBackground } from "@/components/landing/ParticlesBackground";
// import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
// import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
// import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
// import { LessonCard } from "@/components/lessons/LessonCard";
// import { LessonContent } from "@/components/lessons/LessonContent";
// import { LessonFilters } from "@/components/lessons/LessonFilters";
// import { EmptyLessonsState } from "@/components/lessons/EmptyLessonsState";
// import { GlassCard } from "@/components/ui/GlassCard";
// import { Skeleton } from "@/components/ui/skeleton";
// import { BookOpen } from "lucide-react";

// const Lessons = () => {
//   const navigate = useNavigate();
//  // const { user, signOut } = useAuth();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

//  // const { lessons, progress, loading, error } = useLessons();
//   // const { 
//   //   lesson: selectedLesson, 
//   //   quizzes, 
//   //   progress: lessonProgress, 
//   //   loading: lessonLoading,
//   //   updateProgress 
//   // } = useLessonDetail(selectedLessonId || "");

//   // const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Learner";
//   // const userEmail = user?.email || "";

//   const handleSignOut = async () => {
//     await signOut();
//     navigate("/");
//   };

//   // Extract unique categories and levels
//   const categories = useMemo(() => {
//     const cats = [...new Set(lessons.map((l) => l.category))];
//     return cats.sort();
//   }, [lessons]);

//   const experienceLevels = useMemo(() => {
//     const levels = [...new Set(lessons.map((l) => l.experience_level))];
//     return levels.sort();
//   }, [lessons]);

//   // Filter lessons
//   const filteredLessons = useMemo(() => {
//     return lessons.filter((lesson) => {
//       if (selectedCategory && lesson.category !== selectedCategory) return false;
//       if (selectedLevel && lesson.experience_level !== selectedLevel) return false;
//       return true;
//     });
//   }, [lessons, selectedCategory, selectedLevel]);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen relative bg-background">
//         <ParticlesBackground />
//         <DashboardTopNav
//           userName={userName}
//           userEmail={userEmail}
//           onSignOut={handleSignOut}
//           onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
//         />
//         <DashboardSidebar
//           isOpen={sidebarOpen}
//           onClose={() => setSidebarOpen(false)}
//           isCollapsed={sidebarCollapsed}
//           onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
//         />
//         <main className={`relative z-10 pt-24 pb-24 lg:pb-8 transition-all duration-300 ${
//           sidebarCollapsed ? "lg:pl-24" : "lg:pl-72"
//         }`}>
//           <div className="max-w-7xl mx-auto px-4 md:px-6">
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[...Array(6)].map((_, i) => (
//                 <GlassCard key={i} className="p-0 overflow-hidden">
//                   <Skeleton className="h-40 w-full" />
//                   <div className="p-4 space-y-3">
//                     <Skeleton className="h-5 w-3/4" />
//                     <Skeleton className="h-4 w-full" />
//                     <Skeleton className="h-3 w-1/2" />
//                   </div>
//                 </GlassCard>
//               ))}
//             </div>
//           </div>
//         </main>
//         <MobileBottomNav />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen relative bg-background">
//       <ParticlesBackground />

//       <DashboardTopNav
//         userName={userName}
//         userEmail={userEmail}
//         onSignOut={handleSignOut}
//         onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
//       />

//       <DashboardSidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         isCollapsed={sidebarCollapsed}
//         onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
//       />

//       <main
//         className={`relative z-10 pt-24 pb-24 lg:pb-8 transition-all duration-300 ${
//           sidebarCollapsed ? "lg:pl-24" : "lg:pl-72"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 md:px-6">
//           {/* Show lesson detail or list */}
//           {selectedLessonId && selectedLesson ? (
//             <LessonContent
//               lesson={selectedLesson}
//               quizzes={quizzes}
//               progress={lessonProgress}
//               onBack={() => setSelectedLessonId(null)}
//               onUpdateProgress={updateProgress}
//             />
//           ) : (
//             <>
//               {/* Header */}
//               <motion.div
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mb-8"
//               >
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
//                     <BookOpen className="w-5 h-5 text-white" />
//                   </div>
//                   <h1 className="text-3xl font-bold text-foreground">Lessons</h1>
//                 </div>
//                 <p className="text-muted-foreground">
//                   {lessons.length > 0 
//                     ? `${lessons.length} lesson${lessons.length > 1 ? 's' : ''} available`
//                     : 'Explore our learning content'
//                   }
//                 </p>
//               </motion.div>

//               {/* Filters */}
//               {lessons.length > 0 && (categories.length > 1 || experienceLevels.length > 1) && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 }}
//                   className="mb-6"
//                 >
//                   <LessonFilters
//                     categories={categories}
//                     selectedCategory={selectedCategory}
//                     onCategoryChange={setSelectedCategory}
//                     experienceLevels={experienceLevels}
//                     selectedLevel={selectedLevel}
//                     onLevelChange={setSelectedLevel}
//                   />
//                 </motion.div>
//               )}

//               {/* Lessons grid or empty state */}
//               {filteredLessons.length === 0 ? (
//                 <EmptyLessonsState />
//               ) : (
//                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredLessons.map((lesson, index) => (
//                     <LessonCard
//                       key={lesson.id}
//                       lesson={lesson}
//                       progress={progress[lesson.id]}
//                       onClick={() => setSelectedLessonId(lesson.id)}
//                       index={index}
//                     />
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </main>

//       <MobileBottomNav />
//     </div>
//   );
// };

// export default Lessons;
