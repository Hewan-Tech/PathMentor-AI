import React, { useEffect, useState } from 'react';
import { Search, Plus, MoreVertical, Star, Eye, EyeOff } from 'lucide-react';
import api from '../../../services/api';

const AllMentors = () => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddMentor, setShowAddMentor] = useState(false);
  const [savingMentor, setSavingMentor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mentorForm, setMentorForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    skillTrack: "",
  });
  const [formError, setFormError] = useState("");

  const fetchMentors = async (name = "") => {
    setLoading(true);
    try {
      const endpoint = name ? `/admin/search-mentors?name=${encodeURIComponent(name)}` : '/admin/mentors';
      const response = await api.get(endpoint);
      setMentors(response.data?.mentors || []);
    } catch (error) {
      console.error('Failed to load mentors', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddMentor = () => {
    setMentorForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      skillTrack: "",
    });
    setFormError("");
    setShowAddMentor(true);
  };

  const closeAddMentor = () => setShowAddMentor(false);

  const handleMentorFormChange = (field: string, value: string) => {
    setMentorForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleCreateMentor = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!mentorForm.name || !mentorForm.email || !mentorForm.password || !mentorForm.confirmPassword) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (mentorForm.password !== mentorForm.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordPattern.test(mentorForm.password)) {
      setFormError("Password must include one uppercase letter, one number, one symbol, and be at least 8 characters.");
      return;
    }

    setSavingMentor(true);

    try {
      await api.post('/admin/mentor', {
        name: mentorForm.name,
        email: mentorForm.email,
        password: mentorForm.password,
        skillTrack: mentorForm.skillTrack,
      });
      await fetchMentors();
      closeAddMentor();
    } catch (error: any) {
      console.error('Failed to create mentor', error);
      const responseMessage = error?.response?.data?.message;
      setFormError(
        responseMessage || error?.message || 'Unable to create mentor. Please try again.'
      );
    } finally {
      setSavingMentor(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMentors(searchTerm.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const mentorCards = mentors.map((mentor) => ({
    id: mentor._id,
    name: mentor.name || 'Mentor',
    role: mentor.learningProfile?.skillTrack || 'Mentor',
    students: mentor.mentorVerification?.status || 'Unknown',
    rating: mentor.onboardingCompleted ? 4.9 : 4.5,
    image: `https://i.pravatar.cc/150?u=${mentor._id}`,
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Mentors</h2>
          <p className="text-slate-400 text-sm mt-1">Manage and monitor all platform educators.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search mentors..." 
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all w-64"
            />
          </div>
          <button
            onClick={openAddMentor}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus size={18} /> Add Mentor
          </button>
        </div>
      </div>

      {showAddMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-6">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Add Mentor</h3>
                <p className="text-slate-400 text-sm">Create a new mentor account with the required details.</p>
              </div>
              <button
                type="button"
                onClick={closeAddMentor}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 transition"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateMentor} className="space-y-4">
              {formError && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {formError}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-200">
                  Name
                  <input
                    value={mentorForm.name}
                    onChange={(event) => handleMentorFormChange('name', event.target.value)}
                    placeholder="Mentor name"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-200">
                  Email
                  <input
                    type="email"
                    value={mentorForm.email}
                    onChange={(event) => handleMentorFormChange('email', event.target.value)}
                    placeholder="mentor@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="relative space-y-2 text-sm text-slate-200">
                  Password
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={mentorForm.password}
                    onChange={(event) => handleMentorFormChange('password', event.target.value)}
                    placeholder="Strong password"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-[38px] text-slate-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>

                <label className="relative space-y-2 text-sm text-slate-200">
                  Confirm Password
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={mentorForm.confirmPassword}
                    onChange={(event) => handleMentorFormChange('confirmPassword', event.target.value)}
                    placeholder="Confirm password"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-[38px] text-slate-300 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>
              </div>

              <label className="space-y-2 text-sm text-slate-200">
                Mentor Skill Track
                <input
                  value={mentorForm.skillTrack}
                  onChange={(event) => handleMentorFormChange('skillTrack', event.target.value)}
                  placeholder="e.g. Web Development"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </label>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeAddMentor}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMentor}
                  className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingMentor ? 'Creating Mentor...' : 'Create Mentor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-slate-300">Loading mentors...</div>
        ) : mentorCards.length ? (
          mentorCards.map((mentor) => (
            <div key={mentor.id} className="group relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl p-6 hover:border-cyan-500/30 transition-all duration-300 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <img src={mentor.image} className="w-16 h-16 rounded-2xl object-cover border border-white/10" alt={mentor.name} />
                <button className="text-slate-500 hover:text-white transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
              <h3 className="text-lg font-bold text-white">{mentor.name}</h3>
              <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">{mentor.role}</p>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Status</p>
                  <p className="text-white font-bold">{mentor.students}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Rating</p>
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star size={12} fill="currentColor" /> {mentor.rating}
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 py-2 rounded-xl bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-colors border border-white/5">
                View Full Profile
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-slate-300">No mentors found.</div>
        )}
      </div>
    </div>
  );
};

export default AllMentors;