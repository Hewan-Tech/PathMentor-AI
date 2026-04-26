import React from 'react';
import { Download, FileText, PieChart, Users } from 'lucide-react';

const StudentReports = () => {
  const reportCards = [
    { title: "Active Students", value: "1,284", change: "+12% vs last month", icon: <Users /> },
    { title: "Completion Rate", value: "68.2%", change: "+3.4% improvement", icon: <PieChart /> },
    { title: "Average Score", value: "84%", change: "Steady", icon: <FileText /> },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Analytics & Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {reportCards.map((card, i) => (
          <div key={i} className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">{card.icon}</div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full font-bold">{card.change}</span>
            </div>
            <h3 className="text-slate-400 text-sm mb-1">{card.title}</h3>
            <div className="text-3xl font-bold text-white">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Monthly Exportable Reports</h2>
          <button className="text-xs text-indigo-400 hover:underline">Clear all history</button>
        </div>
        <div className="space-y-3">
          {['March_2024_Student_Audit.pdf', 'Q1_Performance_Summary.csv', 'Enrollment_Trends_Full.xlsx'].map((file, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <FileText className="text-slate-400" size={20} />
                <span className="text-slate-200 text-sm">{file}</span>
              </div>
              <Download size={18} className="text-slate-500 group-hover:text-white" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentReports;