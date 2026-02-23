import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// PAGES
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import Roadmap from "./pages/Roadmap";
import Dashboard from "./pages/Dashboard";

// Mentor Pages
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorPendingApproval from "./pages/mentor/MentorPendingApproval";

// Admin Pages - UPDATED IMPORT HERE
import AdminLayout from "./pages/admin/AdminLayout"; // Adjusted to match your folder structure
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminMentors from "./pages/admin/AdminMentors";
import AdminAssessments from "./pages/admin/AdminAssessments";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />

          {/* ADMIN ROUTES - Wrapped in the Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* Redirects /admin to /admin/dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* All these children will render INSIDE the AdminLayout's <Outlet /> */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="students/:id" element={<AdminStudents />} />
            <Route path="mentors" element={<AdminMentors />} />
            <Route path="assessments" element={<AdminAssessments/>} />
            <Route path="settings" element={<AdminSettings/>} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;