import React, { useState, useMemo } from 'react';
import { Award, AlertCircle, CheckCircle2, Search, Filter, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';

const GradesStatus = () => {
  const [selectedCourse, setSelectedCourse] = useState('React Web Development');
  const [selectedClass, setSelectedClass] = useState('Batch A');

  const gradeData = [
    { id: 1, student: "Alex Rivera", course: "React Web Development", class: "Batch A", exam: "Module 1 Quiz", score: 94, status: "Pass" },
    { id: 2, student: "Sarah Chen", course: "UI/UX Design", class: "Design Alpha", exam: "Final Project", score: 88, status: "Pass" },
    { id: 3, student: "Jordan Smith", course: "React Web Development", class: "Batch A", exam: "Module 1 Quiz", score: 52, status: "Needs Review" },
    { id: 4, student: "Tina Fey", course: "React Web Development", class: "Batch B", exam: "Module 1 Quiz", score: 76, status: "Pass" },
    { id: 5, student: "Mila Kunis", course: "Data Science", class: "Data 101", exam: "Python Basics", score: 91, status: "Pass" },
  ];

  // Logic to get unique categories for filters
  const courses = [...new Set(gradeData.map(g => g.course))];
  const classes = [...new Set(gradeData.filter(g => g.course === selectedCourse).map(g => g.class))];

  // Filtered list based on drill-down selection
  const filteredGrades = useMemo(() => {
    return gradeData.filter(g => g.course === selectedCourse && g.class === selectedClass);
  }, [selectedCourse, selectedClass]);

  // Quick Stats for the selected class
  const avgScore = filteredGrades.length ? (filteredGrades.reduce((acc, curr) => acc + curr.score, 0) / filteredGrades.length).toFixed(1) : 0;
  const passRate = filteredGrades.length ? ((filteredGrades.filter(g => g.status === 'Pass').length / filteredGrades.length) * 100).toFixed(0) : 0;

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      
      {/* Header & Stats Cards */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Award className="text-indigo-500" size={28} />
            Grades & Academic Status
          </h1>
          <p className="text-slate-400 text-sm mt-1">Tracking performance across {selectedCourse} — {selectedClass}</p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 lg:w-40 backdrop-blur-md">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Class Avg</p>
            <p className="text-2xl font-bold text-indigo-400">{avgScore}%</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 lg:w-40 backdrop-blur-md">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Pass Rate</p>
            <p className="text-2xl font-bold text-emerald-400">{passRate}%</p>
          </div>
        </div>
      </div>

      {/* Navigation & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Course Select */}
        <div className="relative">
          <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <select 
            title="Select a course"
            value={selectedCourse}
            onChange={(e) => { setSelectedCourse(e.target.value); setSelectedClass('All'); }}
            className="w-full bg-slate-900/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-indigo-500/50 cursor-pointer"
          >
            {courses.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
          </select>
        </div>

        {/* Class Select */}
        <div className="relative">
          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <select 
            title="Select a class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full bg-slate-900/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-indigo-500/50 cursor-pointer"
          >
            {classes.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search student grades..."
            className="w-full bg-slate-900/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>

      {/* Main Grades Table */}
      <div className="bg-slate-900/40 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left">
          <thead className="border-b border-white/5 text-slate-500 text-[10px] uppercase font-bold tracking-widest bg-white/5">
            <tr>
              <th className="px-8 py-5">Student Name</th>
              <th className="px-6 py-5">Assessment Type</th>
              <th className="px-6 py-5">Score Percentage</th>
              <th className="px-6 py-5">Progress Status</th>
              <th className="px-8 py-5 text-right">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredGrades.map((g) => (
              <tr key={g.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5">
                  <div className="text-white text-sm font-bold">{g.student}</div>
                  <div className="text-slate-500 text-[11px]">{g.class}</div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-slate-300 text-xs px-2 py-1 bg-white/5 border border-white/5 rounded-md">
                    {g.exam}
                  </span>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col gap-1.5">
                      <span className={`text-lg font-black ${g.score >= 90 ? 'text-indigo-400' : g.score < 60 ? 'text-red-400' : 'text-white'}`}>
                        {g.score}%
                      </span>
                      {/* Visual Mini Progress Bar */}
                      <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${g.score >= 90 ? 'bg-indigo-500' : g.score < 60 ? 'bg-red-500' : 'bg-slate-400'}`} 
                          style={{ width: `${g.score}%` }}
                        />
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border ${
                    g.status === 'Pass' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    {g.status === 'Pass' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    {g.status}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button type="button" title="View grade trend" className="p-2 text-slate-500 hover:text-white transition-all">
                    <TrendingUp size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredGrades.length === 0 && (
          <div className="py-24 text-center">
            <AlertCircle size={40} className="mx-auto text-slate-800 mb-4" />
            <p className="text-slate-500">No grading records found for this selection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradesStatus;