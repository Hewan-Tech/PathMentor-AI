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
import ProfilePage from "./pages/ProfilePage";

// Mentor Pages
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorPendingApproval from "./pages/mentor/MentorPendingApproval";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout"; 
import AdminDashboard from "./pages/admin/AdminDashboard";


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
          {/* MOVED: Profile is now accessible at /profile */}
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Mentor Routes */}
          <Route path="/mentor/pending" element={<MentorPendingApproval />} />
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/Dashboard" element={<AdminDashboard />} />
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
           
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;