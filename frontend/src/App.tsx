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
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

// Mentor Pages
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorPendingApproval from "./pages/mentor/MentorPendingApproval";

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
import StudentProgress from "./pages/admin/students/StudentProgress";
import GradesStatus from "./pages/admin/students/GradesStatus";
import StudentReports from "./pages/admin/students/StudentReports";

// Admin Courses
import AdminCourses from "./pages/admin/courses/AdminCourses";
import AdminCategories from "./pages/admin/courses/AdminCategories";
import AdminLessons from "./pages/admin/courses/AdminLessons";
import AdminReviews from "./pages/admin/courses/AdminReviews";
import AdminAssignments from "./pages/admin/courses/AdminAssignments";

// --- NEW: Admin Payments ---
import Transactions from "./pages/admin/payments/Transactions";
import Subscriptions from "./pages/admin/payments/Subscriptions";
import Invoices from "./pages/admin/payments/Invoices";
import Refunds from "./pages/admin/payments/Refunds";

// --- NEW: Admin Chat & Support ---
import Conversations from "./pages/admin/chats/Conversations";
import SupportTickets from "./pages/admin/chats/SupportTickets";

// --- NEW: Admin Feedback ---
import AllFeedback from "./pages/admin/feedback/AllFeedback";
import FeedbackReports from "./pages/admin/feedback/FeedbackReports";
import Ratings from "./pages/admin/feedback/Ratings";

// --- NEW: Admin Settings ---
import AdminTeam from "./pages/admin/settings/AdminTeam";
import RolesPermissions from "./pages/admin/settings/RolesPermissions";
import SystemSettings from "./pages/admin/settings/SystemSettings";
import ProfileSettings from "./pages/admin/settings/ProfileSettings";
import DeveloperTools from "./pages/admin/settings/DeveloperTools";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register" element={<Register />} />

          {/* Student */}
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Mentor */}
          <Route path="/mentor/pending" element={<MentorPendingApproval />} />
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="activities" element={<Activities />} />

            {/* Mentor Management */}
            <Route path="mentors" element={<AllMentors />} />
            <Route path="applications" element={<MentorApplications />} />
            <Route path="performance" element={<MentorPerformance />} />
            <Route path="earnings" element={<MentorEarnings />} />
            <Route path="mentor-reviews" element={<MentorReviews />} />

            {/* Student Management */}
            <Route path="allstudents" element={<AllStudents />} />
            <Route path="enrollments" element={<StudentEnrollments />} />
            <Route path="progress" element={<StudentProgress />} />
            <Route path="grades" element={<GradesStatus />} />
            <Route path="reports" element={<StudentReports />} />
            
            {/* Course Management */}
            <Route path="all-courses" element={<AdminCourses />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="lessons" element={<AdminLessons />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="assignments" element={<AdminAssignments />} />

            {/* Payment Management - MATCHING SIDEBAR PATHS */}
            <Route path="transactions" element={<Transactions />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="refunds" element={<Refunds />} />
            
             {/* Chats */}
            <Route path="chats" element={<Conversations />} />
           <Route path="tickets" element={<SupportTickets />} />

           {/* CFeedback  */}
           <Route path="feedback" element={<AllFeedback />} />
           <Route path="feedback-reports" element={<FeedbackReports />} />
           <Route path="ratings" element={<Ratings />} />

                       {/* Settings */}
            <Route path="settings/profile" element={<ProfileSettings />} />
            <Route path="settings/team" element={<AdminTeam />} />
            <Route path="settings/roles" element={<RolesPermissions />} />
            <Route path="settings/system" element={<SystemSettings />} />
            <Route path="settings/dev" element={<DeveloperTools />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;