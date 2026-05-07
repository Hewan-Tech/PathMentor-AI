import React, { useState, useMemo } from 'react';
import { Download, FileText, PieChart, Users, Filter, BarChart3, ChevronRight, ArrowUpRight } from 'lucide-react';

const StudentReports = () => {
  const [selectedCourse, setSelectedCourse] = useState('All Programs');

  const courseData = {
    "All Programs": { students: "1,284", completion: "68.2%", avgScore: "84%", trend: "+12%" },
    "React Masterclass": { students: "450", completion: "72.1%", avgScore: "88%", trend: "+5.2%" },
    "UI/UX Design": { students: "320", completion: "55.4%", avgScore: "79%", trend: "-2.1%" },
    "Data Science": { students: "514", completion: "77.1%", avgScore: "85%", trend: "+8.4%" },
  };

  const reports = [
    { name: "March_2024_Audit.pdf", course: "React Masterclass", type: "PDF", size: "2.4 MB" },
    { name: "Q1_Performance.csv", course: "UI/UX Design", type: "CSV", size: "1.1 MB" },
    { name: "Enrollment_Trends.xlsx", course: "Data Science", type: "XLSX", size: "4.8 MB" },
    { name: "Student_Feedback_Summary.pdf", course: "React Masterclass", type: "PDF", size: "3.2 MB" },
  ];

  const activeStats = courseData[selectedCourse];

  // Filter reports based on course selection
  const filteredReports = useMemo(() => {
    if (selectedCourse === 'All Programs') return reports;
    return reports.filter(r => r.course === selectedCourse);
  }, [selectedCourse]);

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      
      {/* Header with Course Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="text-indigo-500" size={28} />
            Institutional Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1">Deep dive into performance metrics and compliance exports.</p>
        </div>

        <div className="relative min-w-[220px]">
          <label htmlFor="course-select" className="sr-only">Select a course</label>
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <select 
            id="course-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full bg-slate-900/40 border border-white/10 rounded-2xl pl-12 pr-10 py-3 text-sm text-white appearance-none focus:outline-none focus:border-indigo-500/50 cursor-pointer"
          >
            {Object.keys(courseData).map((c) => <option key={c} value={c} className="bg-slate-950">{c}</option>)}
          </select>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { title: "Enrolled Students", value: activeStats.students, icon: <Users />, color: "text-blue-400" },
          { title: "Completion Rate", value: activeStats.completion, icon: <PieChart />, color: "text-indigo-400" },
          { title: "Average Score", value: activeStats.avgScore, icon: <FileText />, color: "text-emerald-400" },
        ].map((card, i) => (
          <div key={i} className="bg-slate-900/40 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 bg-white/5 rounded-2xl ${card.color} group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg text-[10px] font-black">
                <ArrowUpRight size={12} /> {activeStats.trend}
              </div>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{card.title}</h3>
            <div className="text-3xl font-black text-white">{card.value}</div>
            {/* Subtle background decoration */}
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
               {React.cloneElement(card.icon, { size: 100 })}
            </div>
          </div>
        ))}
      </div>

      {/* Reports Section */}
      <div className="bg-slate-900/40 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-lg font-bold text-white">Exportable Data Logs</h2>
            <p className="text-slate-500 text-xs mt-1">Generated reports for {selectedCourse}</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all">
            Generate New Report
          </button>
        </div>

        <div className="p-4 space-y-2">
          {filteredReports.map((file, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                  <FileText size={24} />
                </div>
                <div>
                  <span className="text-white text-sm font-bold block">{file.name}</span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter bg-white/5 px-1.5 py-0.5 rounded text-indigo-300">{file.type}</span>
                    <span className="text-[10px] text-slate-600 font-medium italic">{file.size}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 mt-4 md:mt-0 px-4 md:px-0">
                <div className="hidden lg:block text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Classification</p>
                  <p className="text-xs text-slate-300">{file.course}</p>
                </div>
                <button className="flex items-center gap-2 bg-white/5 hover:bg-indigo-600 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="py-20 text-center">
              <FileText className="mx-auto text-slate-800 mb-4" size={40} />
              <p className="text-slate-500 text-sm">No report history found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentReports;