import { useState, useEffect } from "react";
import api from "@/services/api";
import { 
  UserPlus, Edit3, Trash2, X, Check, 
  ShieldCheck, AlertCircle 
} from "lucide-react";
import { toast } from "sonner";

const AdminMentors = () => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMentor, setEditingMentor] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => { fetchMentors(); }, []);

  const fetchMentors = async () => {
    try {
      // For Frontend-only testing, if API fails, we could load from local array
      const res = await api.get("/admin/mentors");
      setMentors(res.data);
    } catch (err) { 
      console.error(err); 
      toast.error("Using local data for simulation");
      // Fallback for demo purposes if backend isn't running
      setMentors([
        { _id: "1", name: "John Doe", expertise: "Frontend", status: "pending", mentorProfile: { bio: "Senior Dev at Google" } }
      ]);
    } finally { 
      setLoading(false); 
    }
  };

  /**
   * FRONTEND-ONLY APPROVAL LOGIC
   * This updates localStorage which triggers the storage event in the Mentor's tab
   */
  const approveMentor = async (id: string) => {
    try {
      // 1. (Optional) Still try to hit backend
      await api.put(`/admin/mentors/${id}/approve`, { status: 'approved' });
      
      // 2. TRIGGER REDIRECT IN OTHER TAB (The "Magic" part)
      // We simulate that the approved mentor is the one currently "logged in" in the other tab
      const simulatedUser = {
        id: id,
        name: mentors.find(m => m._id === id)?.name || "Mentor",
        status: "approved"
      };
      
      // This line is what the Mentor's "storage" listener is waiting for
      localStorage.setItem("user", JSON.stringify(simulatedUser));

      // 3. Update Admin UI
      setMentors(prev => prev.map(m => m._id === id ? { ...m, status: 'approved' } : m));
      toast.success("Mentor approved! Other tab will now redirect.");
      
    } catch (err) {
      // Even if backend fails, let's force the localStorage for your test
      const simulatedUser = { status: "approved" };
      localStorage.setItem("user", JSON.stringify(simulatedUser));
      
      setMentors(prev => prev.map(m => m._id === id ? { ...m, status: 'approved' } : m));
      toast.success("Simulation: Mentor approved via LocalStorage");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/admin/mentors/${editingMentor._id}`, editingMentor);
      setEditingMentor(null);
      fetchMentors();
      toast.success("Mentor profile synchronized");
    } catch (err) { console.error("Update failed", err); }
  };

  const deleteMentor = async (id: string) => {
    if (!confirm("De-authorize this mentor permanently?")) return;
    try {
      await api.delete(`/admin/mentors/${id}`);
      setMentors(prev => prev.filter(m => m._id !== id));
      toast.info("Mentor record purged");
    } catch (err) { console.error(err); }
  };

  const filteredMentors = mentors.filter(m => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="text-[#33b6ff] animate-pulse font-black tracking-widest text-xs uppercase">Syncing Admin Node...</div>
    </div>
  );

  return (
    <div className="min-h-screen p-8 text-white relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-[#020617]" />
      <div className="fixed inset-0 -z-10 opacity-30" 
           style={{ backgroundImage: 'radial-gradient(at 20% 10%, #33b6ff33 0px, transparent 50%), radial-gradient(at 80% 20%, #a855f722 0px, transparent 50%)' }} 
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">
            Mentor <span className="text-[#33b6ff]">Nexus</span>
          </h1>
          <div className="flex gap-4 mt-4">
            {['all', 'pending', 'approved'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                  filter === f ? 'bg-[#33b6ff] text-black border-[#33b6ff]' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-black text-sm transition-all hover:scale-105">
          <UserPlus size={18} /> Add New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMentors.map((mentor) => (
          <div 
            key={mentor._id} 
            className="group relative bg-white/[0.06] backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] hover:border-[#33b6ff]/40 transition-all duration-500 shadow-2xl"
          >
            {mentor.status !== 'approved' && (
              <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full text-[9px] font-black uppercase tracking-tighter">
                <AlertCircle size={10} /> Pending Approval
              </div>
            )}

            <div className="flex items-center gap-5 mb-8">
              <div className="h-16 w-16 rounded-[22px] bg-gradient-to-tr from-[#33b6ff] to-[#a855f7] p-[2px]">
                <div className="w-full h-full rounded-[20px] bg-[#020617] flex items-center justify-center text-white font-black text-2xl">
                  {mentor.name.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">{mentor.name}</h3>
                <p className="text-slate-500 text-xs font-bold">{mentor.expertise || "General Mastery"}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8 bg-black/20 p-4 rounded-2xl border border-white/5">
              <p className="text-xs text-slate-400 line-clamp-2 italic leading-relaxed">
                "{mentor.mentorProfile?.bio || "No professional bio provided yet..."}"
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-2">
                <button onClick={() => setEditingMentor(mentor)} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => deleteMentor(mentor._id)} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500/50 hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={16} />
                </button>
              </div>

              {mentor.status !== 'approved' ? (
                <button 
                  onClick={() => approveMentor(mentor._id)}
                  className="flex items-center gap-2 bg-[#33b6ff] text-black px-5 py-3 rounded-xl font-black text-xs hover:shadow-[0_0_15px_rgba(51,182,255,0.4)] transition-all"
                >
                  <Check size={16} strokeWidth={3} /> Approve Mentor
                </button>
              ) : (
                <div className="flex items-center gap-2 text-[#33b6ff] font-black text-[10px] uppercase tracking-widest px-2">
                  <ShieldCheck size={14} /> Verified
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {editingMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="bg-[#020617] border border-white/20 w-full max-w-lg rounded-[40px] p-12 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black tracking-tighter">Edit <span className="text-[#a855f7]">Node</span></h2>
              <button onClick={() => setEditingMentor(null)} className="text-slate-500 hover:text-white transition-colors">
                <X size={28} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Identity</label>
                <input 
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#33b6ff] transition-all font-bold"
                  value={editingMentor.name}
                  onChange={(e) => setEditingMentor({...editingMentor, name: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-white text-black py-5 rounded-2xl font-black text-sm shadow-xl">Sync Changes</button>
                <button type="button" onClick={() => setEditingMentor(null)} className="flex-1 bg-white/5 border border-white/10 py-5 rounded-2xl font-black text-sm">Abort</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMentors;