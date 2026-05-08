import { useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"; // Adjust path
import { cn } from "@/lib/utils";

const MentorLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar 
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        // You can add logic here to detect if the mentor is "pending"
        pendingMode={false} 
      />
      
      <main className={cn(
        "transition-all duration-300 pt-20",
        isCollapsed ? "lg:ml-20" : "lg:ml-[260px]"
      )}>
        <div className="p-6">
          <Outlet /> {/* This renders the specific Mentor Page */}
        </div>
      </main>
    </div>
  );
};

export default MentorLayout;