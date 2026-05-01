import React, { useEffect, useState } from 'react';
import { Search, UserPlus, MoreHorizontal, Filter, Edit3, Trash2, RefreshCw } from 'lucide-react';
import api from '../../../services/api';

const AllStudents = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentConfirmPassword, setStudentConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isActionOpen, setIsActionOpen] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string>('');
  const [selectedLevelTitle, setSelectedLevelTitle] = useState<string>('');

  const buildStudentId = (id: string) => {
    return id ? `STU${id.slice(-6).toUpperCase()}` : 'N/A';
  };

  const fetchStudents = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please sign in as an admin to load student data.');
      setLoading(false);
      return;
    }

    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.set('search', searchTerm);
      if (statusFilter !== 'all') queryParams.set('status', statusFilter);

      const res = await api.get(`/admin/students?${queryParams.toString()}`);
      setStudents(res.data.data || []);
    } catch (err: any) {
      console.error('Failed to load students', err);
      setError(err?.response?.data?.message || 'Unable to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get('/admin/courses');
      setCourses(res.data.data || res.data || []);
    } catch (err: any) {
      console.error('Failed to load courses', err);
      setCourses([]);
    }
  };

  const fetchLevels = async (courseId: string) => {
    if (!courseId) {
      setLevels([]);
      return;
    }

    try {
      const res = await api.get(`/levels/course/${courseId}`);
      setLevels(res.data.data || []);
    } catch (err: any) {
      console.error('Failed to load course levels', err);
      setLevels([]);
    }
  };

  const resetForm = () => {
    setStudentName('');
    setStudentEmail('');
    setStudentPassword('');
    setStudentConfirmPassword('');
    setSelectedCourseId('');
    setSelectedCourseTitle('');
    setSelectedLevelTitle('');
    setFormError('');
    setFormSuccess('');
    setIsEditing(false);
    setSelectedStudentId(null);
  };

  const handleCreateStudent = async () => {
    setFormError('');
    setFormSuccess('');

    if (!studentName.trim() || !studentEmail.trim() || !studentPassword.trim() || !studentConfirmPassword.trim()) {
      setFormError('Name, email, password, and confirmation are required.');
      return;
    }

    if (studentPassword !== studentConfirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(studentPassword)) {
      setFormError('Password must contain uppercase, number, symbol, and be at least 8 characters.');
      return;
    }

    if (!selectedCourseId || !selectedCourseTitle) {
      setFormError('Please select a course for the student.');
      return;
    }

    if (!selectedLevelTitle) {
      setFormError('Please select a level for the student.');
      return;
    }

    setFormLoading(true);

    try {
      await api.post('/admin/students', {
        name: studentName.trim(),
        email: studentEmail.trim().toLowerCase(),
        password: studentPassword,
        courseId: selectedCourseId,
        courseTitle: selectedCourseTitle,
        courseLevel: selectedLevelTitle,
      });

      setFormSuccess('Student created successfully.');
      resetForm();
      fetchStudents();
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess('');
      }, 1200);
    } catch (err: any) {
      console.error('Failed to create student', err);
      setFormError(err?.response?.data?.message || 'Unable to create student.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenCreateStudent = () => {
    resetForm();
    setIsModalOpen(true);
    fetchCourses();
  };

  const handleOpenEditStudent = (student: any) => {
    setIsEditing(true);
    setSelectedStudentId(student._id);
    setStudentName(student.name || '');
    setStudentEmail(student.email || '');
    setStudentPassword('');
    setStudentConfirmPassword('');
    setSelectedCourseId(student.learningProfile?.course?.id || '');
    setSelectedCourseTitle(student.learningProfile?.course?.title || student.learningProfile?.skillTrack || '');
    setSelectedLevelTitle(student.learningProfile?.courseLevel || student.learningProfile?.experienceLevel || '');
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
    setIsActionOpen(null);
    fetchCourses();

    if (student.learningProfile?.course?.id) {
      fetchLevels(student.learningProfile.course.id);
    }
  };

  const handleUpdateStudent = async () => {
    if (!selectedStudentId) return;

    setFormError('');
    setFormSuccess('');

    if (!studentName.trim() || !studentEmail.trim()) {
      setFormError('Name and email are required.');
      return;
    }

    if (studentPassword || studentConfirmPassword) {
      if (studentPassword !== studentConfirmPassword) {
        setFormError('Passwords do not match.');
        return;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!passwordRegex.test(studentPassword)) {
        setFormError('Password must contain uppercase, number, symbol, and be at least 8 characters.');
        return;
      }
    }

    setFormLoading(true);

    try {
      await api.put(`/admin/students/${selectedStudentId}`, {
        name: studentName.trim(),
        email: studentEmail.trim().toLowerCase(),
        ...(studentPassword ? { password: studentPassword } : {}),
        ...(selectedCourseTitle ? { courseTitle: selectedCourseTitle, courseId: selectedCourseId } : {}),
        ...(selectedLevelTitle ? { courseLevel: selectedLevelTitle } : {}),
      });

      setFormSuccess('Student updated successfully.');
      fetchStudents();
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess('');
      }, 1200);
    } catch (err: any) {
      console.error('Failed to update student', err);
      setFormError(err?.response?.data?.message || 'Unable to update student.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    const confirmed = window.confirm('Delete this student? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await api.delete(`/admin/students/${studentId}`);
      fetchStudents();
    } catch (err: any) {
      console.error('Failed to delete student', err);
      setError(err?.response?.data?.message || 'Unable to delete student.');
    } finally {
      setIsActionOpen(null);
    }
  };

  const handleToggleStudentStatus = async (student: any) => {
    try {
      await api.patch(`/admin/students/${student._id}/status`, {
        status: student.onboardingCompleted ? 'inactive' : 'active',
      });
      fetchStudents();
    } catch (err: any) {
      console.error('Failed to update student status', err);
      setError(err?.response?.data?.message || 'Unable to change student status.');
    } finally {
      setIsActionOpen(null);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Directory</h1>
          <p className="text-slate-400 text-sm">Manage and view all registered students.</p>
        </div>
        <button
          onClick={handleOpenCreateStudent}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          <UserPlus size={18} /> Add New Student
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isEditing ? 'Edit Student' : 'Add New Student'}
                </h2>
                <p className="text-slate-400 text-sm">
                  {isEditing
                    ? 'Update student details for the e-learning platform.'
                    : 'Create a student account for the e-learning platform.'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-white/5 p-3 text-slate-300 hover:bg-white/10"
                aria-label="Close add student modal"
              >
                ✕
              </button>
            </div>

            {(formError || formSuccess) && (
              <div
                className={`rounded-2xl border p-4 mb-5 text-sm ${
                  formError ? 'border-red-500/30 bg-red-500/10 text-red-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                }`}
              >
                {formError || formSuccess}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200">
                Full Name
                <input
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                  type="text"
                  placeholder="Student name"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                Email Address
                <input
                  value={studentEmail}
                  onChange={(event) => setStudentEmail(event.target.value)}
                  type="email"
                  placeholder="student@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                Course
                <select
                  value={selectedCourseId}
                  onChange={(event) => {
                    const selectedId = event.target.value;
                    const selected = courses.find((course) => course._id === selectedId);
                    setSelectedCourseId(selectedId);
                    setSelectedCourseTitle(selected?.title || '');
                    setSelectedLevelTitle('');
                    fetchLevels(selectedId);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">Select course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                Course Level
                <select
                  value={selectedLevelTitle}
                  onChange={(event) => setSelectedLevelTitle(event.target.value)}
                  disabled={!selectedCourseId || levels.length === 0}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select level</option>
                  {levels.map((level) => (
                    <option key={level._id} value={level.title}>
                      {level.title}
                    </option>
                  ))}
                </select>
              </label>
              {!isEditing ? (
                <>
                  <label className="space-y-2 text-sm text-slate-200">
                    Password
                    <input
                      value={studentPassword}
                      onChange={(event) => setStudentPassword(event.target.value)}
                      type="password"
                      placeholder="Strong password"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-200">
                    Confirm Password
                    <input
                      value={studentConfirmPassword}
                      onChange={(event) => setStudentConfirmPassword(event.target.value)}
                      type="password"
                      placeholder="Confirm password"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </label>
                </>
              ) : (
                <>
                  <label className="space-y-2 text-sm text-slate-200">
                    New Password
                    <input
                      value={studentPassword}
                      onChange={(event) => setStudentPassword(event.target.value)}
                      type="password"
                      placeholder="Leave blank to keep current password"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-200">
                    Confirm New Password
                    <input
                      value={studentConfirmPassword}
                      onChange={(event) => setStudentConfirmPassword(event.target.value)}
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </label>
                </>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={isEditing ? handleUpdateStudent : handleCreateStudent}
                disabled={formLoading}
                className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-500 transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formLoading ? (isEditing ? 'Saving...' : 'Creating Student...') : isEditing ? 'Save Changes' : 'Create Student'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            type="text"
            placeholder="Search by name or email..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | 'active' | 'inactive')}
            className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2 text-white outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Student</th>
              <th className="px-6 py-4 font-semibold">Student ID</th>
              <th className="px-6 py-4 font-semibold">Course</th>
              <th className="px-6 py-4 font-semibold">Joined Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                  Loading students...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                        {student.name?.[0] || 'S'}
                      </div>
                      <div>
                        <div className="text-white font-medium">{student.name || 'Student'}</div>
                        <div className="text-slate-500 text-xs">{student.email || 'No email'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-mono text-sm">{buildStudentId(student._id)}</td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">
                      {student.learningProfile?.course?.title || student.learningProfile?.skillTrack || 'Unassigned'}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {student.learningProfile?.courseLevel || student.learningProfile?.experienceLevel || 'No level selected'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${student.onboardingCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                      {student.onboardingCompleted ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400">
                    <div className="relative inline-flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => setIsActionOpen(isActionOpen === student._id ? null : student._id)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Open student actions"
                      >
                        <MoreHorizontal size={20} />
                      </button>
                      {isActionOpen === student._id && (
                        <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl text-left z-10">
                          <button
                            type="button"
                            onClick={() => handleOpenEditStudent(student)}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-200 hover:bg-white/5"
                          >
                            <Edit3 size={16} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStudentStatus(student)}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-200 hover:bg-white/5"
                          >
                            <RefreshCw size={16} /> {student.onboardingCompleted ? 'Set Inactive' : 'Set Active'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(student._id)}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-300 hover:bg-white/5"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllStudents;
