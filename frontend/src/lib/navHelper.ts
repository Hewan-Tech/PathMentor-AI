// Shared sidebar navigation handler for all student pages
export const handleSidebarNav = (view: string, navigate: (path: string) => void) => {
  const routes: Record<string, string> = {
    dashboard:     "/dashboard",
    courses:       "/lessons",
    leaderboard:   "/leaderboard",
    achievements:  "/achievements",
    announcements: "/announcements",
    community:     "/study-buddies",
    sessions:      "/sessions",
    profile:       "/profile",
    settings:      "/settings",
    // progress and projects are in-page views on Dashboard
    progress:      "/dashboard",
    projects:      "/dashboard",
  };
  if (routes[view]) navigate(routes[view]);
};
