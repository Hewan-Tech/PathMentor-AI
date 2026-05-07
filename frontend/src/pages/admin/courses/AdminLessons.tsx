import React, { useState, useMemo } from 'react';
import { PlayCircle, Upload, EyeOff, Search, Plus, ListTree, MoreVertical, BookOpen, Layers } from "lucide-react";

const AdminLessons = () => {
  const [selectedCourse, setSelectedCourse] = useState('AI 101');
  const [searchQuery, setSearchQuery] = useState('');

  const lessonData = [
    { id: 1, title: "The fundamentals of AI", course: "AI 101", module: "Introduction", duration: "14:02", status: "Visible" },
    { id: 2, title: "Neural Networks Explained", course: "AI 101", module: "Advanced Theory", duration: "22:15", status: "Visible" },
    { id: 3, title: "History of Computing", course: "AI 101", module: "Introduction", duration: "08:45", status: "Hidden" },
    { id: 4, title: "React State Management", course: "React Masterclass", module: "Core Concepts", duration: "18:20", status: "Visible" },
    { id: 5, title: "Context API deep dive", course: "React Masterclass", module: "Advanced React", duration: "25:10", status: "Visible" },
  ];

  // 1. Get dynamic course list
  const courses = [...new Set(lessonData.map(l => l.course))];

  // 2. Filter and then Group by Module
  const groupedLessons = useMemo(() => {
    const filtered = lessonData.filter(l => 
      l.course === selectedCourse && 
      l.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.reduce((acc, lesson) => {
      if (!acc[lesson.module]) acc[lesson.module] = [];
      acc[lesson.module].push(lesson);
      return acc;
    }, {} as Record<string, typeof lessonData>);
  }, [selectedCourse, searchQuery]);

  return (
    <div className="p-8 max-w-[1200px] mx-auto animate-in fade-in duration-700">
      
      {/* Header & Global Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="text-indigo-500" size={28} />
            Curriculum Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">Organize and manage content for {selectedCourse}</p>
        </div>

        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-900/20">
          <Plus size={18} /> New Lesson
        </button>
      </div>

      {/* Course Enrollment Tabs */}
      <div className="flex gap-2 mb-8 p-1 bg-slate-900/40 border border-white/5 rounded-2xl w-fit overflow-x-auto">
        {courses.map(course => (
          <button
            key={course}
            onClick={() => setSelectedCourse(course)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedCourse === course 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
            }`}
          >
            {course}
          </button>
        ))}
      </div>

      {/* Utility Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search lessons within this course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-2xl hover:bg-white/10 transition-all font-bold text-xs">
          <ListTree size={16} /> Reorder Curriculum
        </button>
      </div>

      {/* Grouped Content View */}
      <div className="space-y-12">
        {Object.entries(groupedLessons).map(([moduleName, lessons]) => (
          <div key={moduleName} className="animate-in slide-in-from-bottom-4 duration-500">
            {/* Module Header */}
            <div className="flex items-center gap-3 mb-4 px-4">
              <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
                <Layers size={16} />
              </div>
              <h2 className="text-lg font-bold text-white">{moduleName}</h2>
              <span className="text-xs text-slate-500 font-medium">({lessons.length} Lessons)</span>
              <div className="h-px flex-1 bg-white/5 ml-4" />
            </div>

            {/* Lesson Cards */}
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="group p-4 bg-slate-900/40 border border-white/10 rounded-2xl flex items-center gap-4 hover:border-indigo-500/30 transition-all backdrop-blur-xl">
                  <div className="w-20 h-12 bg-white/5 rounded-xl flex items-center justify-center relative overflow-hidden group-hover:bg-indigo-500/10 transition-colors">
                    <PlayCircle size={24} className="text-slate-500 group-hover:text-indigo-400 transition-colors z-10"/>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate">{lesson.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Duration: {lesson.duration} • ID: LES-00{lesson.id}</p>
                  </div>

                  <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all">
                      <Upload size={14}/> Replace
                    </button>
                    <button type="button" aria-label="Toggle visibility" className={`p-2 rounded-lg border transition-all ${
                      lesson.status === 'Hidden' ? 'border-rose-500/50 text-rose-400 bg-rose-500/5' : 'border-white/10 text-slate-400 hover:text-white'
                    }`}>
                      <EyeOff size={16}/>
                    </button>
                    <button type="button" aria-label="More options" className="p-2 text-slate-500 hover:text-white transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedLessons).length === 0 && (
          <div className="py-24 text-center">
            <PlayCircle size={48} className="mx-auto text-slate-800 mb-4" />
            <p className="text-slate-500 italic">No lessons found matching this criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLessons;