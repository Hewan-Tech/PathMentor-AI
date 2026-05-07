import React, { useEffect, useState } from 'react';
import { Search, UserPlus, Edit3, Trash2, Filter, ChevronDown, GraduationCap } from 'lucide-react';
import api from '../../../services/api';
import { cn } from "@/lib/utils";

const AllStudents = () => {
  // State for data
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  
  // State for filters
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchStudents();
  }, [searchTerm, selectedCourse, selectedLevel, selectedBatch]);

  const fetchInitialData = async () => {
    try {
      const res = await api.get('/admin/courses');
      setCourses(res.data.data || []);
      fetchStudents();
    } catch (err) { console.error("Data load failed", err); }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (selectedCourse) params.set('course', selectedCourse);
      if (selectedLevel) params.set('level', selectedLevel);
      if (selectedBatch) params.set('batch', selectedBatch);

      const res = await api.get(`/admin/students?${params.toString()}`);
      setStudents(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // Grouping logic: Organize students by Course Title
  const groupedStudents = students.reduce((acc, student) => {
    const groupKey = student.learningProfile?.course?.title || 'Unassigned / General';
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(student);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-8 text-white min-h-screen bg-[#0b0e14]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Directory</h1>
          <p className="text-gray-400 mt-1">Classified by Major, Class, and Batch</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-blue-600/20">
          <UserPlus size={18} /> Enroll New Student
        </button>
      </div>

      {/* Advanced Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="relative col-span-1 md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" placeholder="Search name..."
            className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 outline-none focus:border-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="bg-black/20 border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500"
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">All Majors</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>

        <select className="bg-black/20 border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500">
          <option value="">All Batches</option>
          <option value="2024">2024 Intake</option>
          <option value="2025">2025 Intake</option>
        </select>

        <div className="flex items-center gap-2 text-sm text-gray-400 px-2">
          <Filter size={14} /> {students.length} Students Found
        </div>
      </div>

      {/* Grouped Content */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Updating list...</div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedStudents).map(([courseName, list]) => (
            <div key={courseName} className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <GraduationCap size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-200">{courseName}</h2>
                <span className="bg-white/10 text-xs px-2 py-1 rounded-full text-gray-400">
                  {list.length} Students
                </span>
              </div>

              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-medium">Student Info</th>
                      <th className="p-4 font-medium">Class/Level</th>
                      <th className="p-4 font-medium">Batch</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {list.map((student) => (
                      <tr key={student._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4">
                          <div className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                            {student.name}
                          </div>
                          <div className="text-xs text-gray-500">{student.email}</div>
                        </td>
                        <td className="p-4 text-sm text-gray-400">
                          {student.learningProfile?.courseLevel || 'Standard'}
                        </td>
                        <td className="p-4 text-sm text-gray-400">
                          {student.learningProfile?.batch || '2024-A'}
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                            student.onboardingCompleted ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          )}>
                            {student.onboardingCompleted ? 'Active' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                              <Edit3 size={16} />
                            </button>
                            <button className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllStudents;
