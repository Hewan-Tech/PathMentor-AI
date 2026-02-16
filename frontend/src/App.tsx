import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import Roadmap from "./pages/Roadmap";
import Dashboard from "./pages/Dashboard";
import MentorDashboard from "./pages/MentorDashboard"; // Add this
import AdminDashboard from "./pages/AdminDashboard";   // Add this
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
  <Routes>
    {/* These MUST match the navigate() paths exactly */}
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/mentor-dashboard" element={<MentorDashboard />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/register" element={<Register />} /> 
    
    {/* Other routes... */}
    <Route path="/auth" element={<Auth />} />
    <Route path="/" element={<Index />} />
  </Routes>
</BrowserRouter>
)
export default App;