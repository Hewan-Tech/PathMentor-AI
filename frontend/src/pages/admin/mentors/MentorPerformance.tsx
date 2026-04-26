const MentorPerformance = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-white">Mentor Performance & Earnings</h2>
      
      {/* Earnings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
          <p className="text-emerald-400 text-xs font-bold uppercase mb-2">Total Paid Out</p>
          <h3 className="text-3xl font-bold text-white">$12,450.00</h3>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
          <p className="text-blue-400 text-xs font-bold uppercase mb-2">Platform Revenue</p>
          <h3 className="text-3xl font-bold text-white">$3,120.00</h3>
        </div>
      </div>

      {/* Basic Metric Table */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
        <h4 className="text-white font-bold mb-4">Mentor Efficiency</h4>
        <div className="space-y-4">
          {["Jane Cooper", "Cody Fisher"].map(name => (
            <div key={name} className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-slate-300">{name}</span>
              <span className="text-blue-400 font-mono">94% Success Rate</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MentorPerformance; 