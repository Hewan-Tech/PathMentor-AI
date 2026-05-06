const DashboardSidebar = () => {
  return (
    <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-[#020617] border-r border-white/10 text-white p-6">
      <h2 className="text-xl font-bold mb-6">Mentor Panel</h2>

      <ul className="space-y-3 text-white/70">
        <li className="hover:text-white cursor-pointer">Dashboard</li>
        <li className="hover:text-white cursor-pointer">My Classes</li>
        <li className="hover:text-white cursor-pointer">Projects</li>
        <li className="hover:text-white cursor-pointer">Settings</li>
      </ul>
    </div>
  );
};

export default DashboardSidebar;