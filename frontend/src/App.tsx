import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Standard Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import Roadmap from "./pages/Roadmap";
import Dashboard from "./pages/students/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

//Students page
import dashboard from "./pages/students/Dashboard";
import assignments, { Assignments } from "./pages/students/Assignments";
import MyCourses from "./pages/students/MyCourses";
import PerformanceAnalytics from "./pages/students/PerformanceAnalytics";
import Scheduling from "./pages/students/Scheduling";
import Settings from "./pages/students/Settings";
import UserProfile from "./pages/students/UserProfile";
import StudentLayout from "./pages/students/StudentLayout";

// Mentor Pages
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorPendingApproval from "./pages/mentor/MentorPendingApproval";
import MyClasses from "./pages/mentor/MyClasses";
import ProjectsAndQuizzes from "./pages/mentor/ProjectsAndQuizzes";
import UploadMaterial from "./pages/mentor/UploadMaterial";
import StudentProfile from "./pages/mentor/StudentProfile";
import CourseStudents from "./pages/mentor/CourseStudents";
import CourseAnalysis from "./pages/mentor/CourseAnalysis";
import StudentProgress from "./pages/mentor/StudentProgress";
import CourseProgress from "./pages/mentor/CourseProgress";
import MentorSettings from "./pages/mentor/Settings";
import Community from "./pages/mentor/Community";
import Messages from "./pages/mentor/Messages";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Activities from "./pages/admin/Activities";

// Admin Mentor
import AllMentors from "./pages/admin/mentors/AllMentors";
import MentorApplications from "./pages/admin/mentors/MentorApplications";
import MentorPerformance from "./pages/admin/mentors/MentorPerformance";
import MentorEarnings from "./pages/admin/mentors/MentorEarnings";
import MentorReviews from "./pages/admin/mentors/MentorReviews";

// Admin Student
import AllStudents from "./pages/admin/students/AllStudents";
import StudentEnrollments from "./pages/admin/students/StudentEnrollments";
import GradesStatus from "./pages/admin/students/GradesStatus";
import AdminStudentProgress from "./pages/admin/students/AdminStudentProgress";
import StudentReports from "./pages/admin/students/StudentReports";

// Admin Courses
import AdminCourses from "./pages/admin/courses/AdminCourses";
import AdminCategories from "./pages/admin/courses/AdminCategories";
import AdminLessons from "./pages/admin/courses/AdminLessons";
import AdminReviews from "./pages/admin/courses/AdminReviews";
import AdminAssignments from "./pages/admin/courses/AdminAssignments";

// Payments
import Transactions from "./pages/admin/payments/Transactions";
import Subscriptions from "./pages/admin/payments/Subscriptions";
import Invoices from "./pages/admin/payments/Invoices";
import Refunds from "./pages/admin/payments/Refunds";

// Chats
import Conversations from "./pages/admin/chats/Conversations";
import SupportTickets from "./pages/admin/chats/SupportTickets";

// Feedback
import AllFeedback from "./pages/admin/feedback/AllFeedback";
import FeedbackReports from "./pages/admin/feedback/FeedbackReports";
import Ratings from "./pages/admin/feedback/Ratings";

// Settings
import AdminTeam from "./pages/admin/settings/AdminTeam";
import SystemSettings from "./pages/admin/settings/SystemSettings";
import ProfileSettings from "./pages/admin/settings/ProfileSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register" element={<Register />} />

          {/* STUDENT */}
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
  <Route path="/courses" element={<MyCourses currentLesson={undefined} preferences={undefined} />} />
  <Route path="/assignments" element={<Assignments />} />
  <Route path="/analytics" element={<PerformanceAnalytics />} />
  <Route path="/scheduling" element={<Scheduling />} />
  <Route path="/user-profile" element={<UserProfile user={undefined} stats={undefined} />} />
  <Route path="/settings" element={<Settings preferences={undefined} updatePreferences={undefined} />} />
  <Route path="/roadmap" element={<Roadmap />} />
  <Route path="/community" element={<Community />} />
  <Route path="/profile" element={<ProfilePage />} />

          {/* MENTOR */}
          <Route path="/mentor/pending" element={<MentorPendingApproval />} />
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />
          <Route path="/mentor/courses" element={<MyClasses />} />
          <Route path="/mentor/projects" element={<ProjectsAndQuizzes />} />
          <Route path="/mentor/upload" element={<UploadMaterial />} />
          <Route path="/mentor/student/:id" element={<StudentProfile />} />
          <Route path="/mentor/course-students" element={<CourseStudents />} />
          <Route path="/mentor/course-analysis/:id" element={<CourseAnalysis />} />
          <Route path="/mentor/student-progress/:id" element={<StudentProgress />} />
          <Route path="/mentor/progress" element={<CourseProgress />} />
          <Route path="/mentor/settings" element={<MentorSettings />} />
          <Route path="/mentor/community" element={<Community />} />
          <Route path="/mentor/messages" element={<Messages />} />

          {/* ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="Activities" element={<Activities />} />

            {/* Mentors */}
            <Route path="mentors" element={<AllMentors />} />
            <Route path="applications" element={<MentorApplications />} />
            <Route path="performance" element={<MentorPerformance />} />
            <Route path="earnings" element={<MentorEarnings />} />
            <Route path="mentor-reviews" element={<MentorReviews />} />
           
            {/* Students */}
            <Route path="allstudents" element={<AllStudents />} />
            <Route path="enrollments" element={<StudentEnrollments />} />
            <Route path="progress" element={<AdminStudentProgress />} /> 
            <Route path="grades" element={<GradesStatus />} />
            <Route path="reports" element={<StudentReports />} />

            {/* Courses */}
            <Route path="all-courses" element={<AdminCourses />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="lessons" element={<AdminLessons />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="assignments" element={<AdminAssignments />} />

            {/* Payments */}
            <Route path="transactions" element={<Transactions />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="refunds" element={<Refunds />} />

            {/* Chats */}
            <Route path="chats" element={<Conversations />} />
            <Route path="tickets" element={<SupportTickets />} />

            {/* Feedback */}
            <Route path="feedback" element={<AllFeedback />} />
            <Route path="feedback-reports" element={<FeedbackReports />} />
            <Route path="ratings" element={<Ratings />} />

            {/* Settings */}
            <Route path="settings/team" element={<AdminTeam />} />
            <Route path="settings/system" element={<SystemSettings />} />
            <Route path="settings/profile" element={<ProfileSettings/>} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
