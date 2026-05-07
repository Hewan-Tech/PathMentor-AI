import React, { useState, useMemo } from 'react';
import { User, FileCheck, AlertCircle, Search, Filter, BookOpen, CheckCircle2, ChevronRight, Clock } from "lucide-react";

const AdminAssignments = () => {
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Needs Grading');

  const submissions = [
    { id: 1, name: "John Doe", task: "Project 1: Portfolio", course: "React Masterclass", date: "2m ago", status: "Needs Grading", priority: "High" },
    { id: 2, name: "Jane Smith", task: "Final Quiz", course: "UI/UX Design", date: "1h ago", status: "Graded", priority: "Low" },
    { id: 3, name: "Robert Fox", task: "Project 1: Portfolio", course: "React Masterclass", date: "3h ago", status: "Needs Grading", priority: "High" },
    { id: 4, name: "Esther Howard", task: "Wireframe Set", course: "UI/UX Design", date: "5h ago", status: "Needs Grading", priority: "Medium" },
    { id: 5, name: "Cody Fisher", task: "Project 1: Portfolio", course: "React Masterclass", date: "Yesterday", status: "Graded", priority: "Low" },
  ];

  // Unique lists for filtering
  const courseList = ["All", ...new Set(submissions.map(s => s.course))];

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const courseMatch = selectedCourse === 'All' || sub.course === selectedCourse;
      const statusMatch = statusFilter === 'All' || sub.status === statusFilter;
      return courseMatch && statusMatch;
    });
  }, [selectedCourse, statusFilter]);

  return (
    <div className="p-8 max-w-[1200px] mx-auto animate-in fade-in duration-700">
      
      {/* Header & Priority Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileCheck className="text-indigo-500" size={28} />
            Submissions Inbox
          </h1>
          <p className="text-slate-400 text-sm mt-1">Reviewing student work across {selectedCourse} enrollment.</p>
        </div>

        <div className="flex gap-2">
           <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl">
              <span className="text-[10px] text-rose-400 font-black uppercase block">Urgent Grading</span>
              <span className="text-xl font-bold text-white">{submissions.filter(s => s.priority === 'High' && s.status !== 'Graded').length}</span>
           </div>
           <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl">
              <span className="text-[10px] text-indigo-400 font-black uppercase block">Total Pending</span>
              <span className="text-xl font-bold text-white">{submissions.filter(s => s.status === 'Needs Grading').length}</span>
           </div>
        </div>
      </div>

      {/* Primary Filtering Bar */}
      <div className="flex flex-wrap gap-3 mb-6 p-1.5 bg-slate-900/40 border border-white/5 rounded-2xl w-fit">
        {courseList.map(course => (
          <button
            key={course}
            onClick={() => setSelectedCourse(course)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCourse === course 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {course}
          </button>
        ))}
      </div>

      {/* Secondary Status Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by student name..."
            className="w-full bg-slate-900/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        
        <div className="flex bg-slate-900/40 border border-white/10 rounded-2xl p-1">
          {['Needs Grading', 'Graded', 'All'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all ${
                statusFilter === status ? 'bg-white/10 text-white' : 'text-slate-500'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSubmissions.map((sub) => (
          <div 
            key={sub.id} 
            className="group p-5 bg-slate-900/40 border border-white/10 rounded-[2rem] flex flex-col md:flex-row items-center justify-between hover:bg-white/[0.02] hover:border-white/20 transition-all backdrop-blur-xl"
          >
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="relative">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/5">
                  <User size={24}/>
                </div>
                {sub.priority === 'High' && sub.status === 'Needs Grading' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-900 animate-pulse" />
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white text-base">{sub.name}</p>
                  <span className="text-[10px] px-2 py-0.5 bg-white/5 text-slate-500 rounded font-bold uppercase tracking-widest">{sub.course}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-slate-400 text-xs">
                  <span className="flex items-center gap-1"><BookOpen size={12}/> {sub.task}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span className="flex items-center gap-1 text-slate-500 font-medium"><Clock size={12}/> Submitted {sub.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto justify-between">
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                sub.status === 'Needs Grading' 
                ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                : 'bg-white/5 border-white/10 text-slate-500'
              }`}>
                {sub.status}
              </div>

              <div className="flex items-center gap-2">
                <button className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all shadow-lg ${
                  sub.status === 'Needs Grading' 
                  ? 'bg-indigo-600 text-white shadow-indigo-900/20 hover:bg-indigo-500' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}>
                  {sub.status === 'Needs Grading' ? 'Grade Work' : 'Review Details'}
                </button>
                <button type="button" className="p-2.5 text-slate-500 hover:text-white bg-white/5 rounded-xl" title="View details">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredSubmissions.length === 0 && (
          <div className="py-24 text-center">
            <CheckCircle2 size={48} className="mx-auto text-emerald-500/20 mb-4" />
            <p className="text-slate-500 font-medium italic">All caught up! No assignments found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAssignments;