import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import Roadmap from "./pages/Roadmap";
import Dashboard from "./pages/Dashboard";

// Mentor Pages
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorPendingApproval from "./pages/mentor/MentorPendingApproval";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminStudents from "./pages/admin/AdminStudents";
import EditStudent from './pages/admin/EditStudent'; 
import AdminMentors from "./pages/admin/AdminMentors";
import AdminAssessments from "./pages/admin/AdminAssessments";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * FIXED: Mentor Guard Component
 * This ensures mentors don't get stuck in a loading loop.
 * If they are approved, they go to dashboard. If not, they stay at pending.
 */
const MentorGuard = ({ children }: { children: React.ReactNode }) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // If no user found, send to login
  if (!user) return <Navigate to="/auth" replace />;

  // If user is a mentor but not approved yet, redirect to pending
  if (user.status !== "approved") {
    return <Navigate to="/mentor/pending" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student Routes */}
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Mentor Routes */}
          <Route path="/mentor/pending" element={<MentorPendingApproval />} />
          
          {/* FIXED: Protected Mentor Dashboard */}
          <Route 
            path="/mentor/dashboard" 
            element={
              <MentorGuard>
                <MentorDashboard />
              </MentorGuard>
            } 
          />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/students/:id" element={<AdminStudents />} />
          <Route path="/admin/students/edit/:id" element={<EditStudent />} />
          <Route path="/admin/mentors" element={<AdminMentors />} />
          <Route path="/admin/assessments" element={<AdminAssessments/>} />
          <Route path="/admin/settings" element={<AdminSettings/>} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;