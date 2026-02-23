import { useEffect, useState } from "react";
import api from "@/services/api";
import { 
  UserPlus, Edit3, Trash2, Check, ShieldCheck, 
  AlertCircle 
} from "lucide-react";
import { motion } from "framer-motion";

// UI Components
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

const AdminMentors = () => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await api.get("/admin/mentors");
      setMentors(res.data);
    } catch (err) {
      // Simulation data if API fails
      setMentors([
        {
          _id: "1",
          name: "John Doe",
          expertise: "Frontend Development",
          status: "pending",
          mentorProfile: { bio: "Senior Developer with 10+ years of experience in React and UI/UX." },
        },
        {
          _id: "2",
          name: "Sarah Smith",
          expertise: "Backend Engineering",
          status: "approved",
          mentorProfile: { bio: "Cloud architect specializing in Node.js and scalable microservices." },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter((m) => {
    if (filter === "all") return true;
    return m.status === filter;
  });

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <motion.div
          className="w-16 h-16 rounded-full bg-gradient-primary"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* WELCOME & ACTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Mentor <span className="text-primary">Management</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and verify expert registrations.
          </p>
        </div>
        <GlassButton variant="primary" glow onClick={() => {}}>
          <UserPlus className="w-4 h-4 mr-2" /> Add Mentor
        </GlassButton>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {["all", "pending", "approved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              filter === f
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* MENTOR GRID */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredMentors.map((mentor) => (
          <GlassCard key={mentor._id} className="p-6 flex flex-col group hover:border-primary/30 transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 flex items-center justify-center text-primary font-bold text-2xl shadow-inner">
                {mentor.name.charAt(0)}
              </div>
              {mentor.status === "pending" ? (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                  <AlertCircle size={12} /> Pending
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                  <ShieldCheck size={12} /> Verified
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{mentor.name}</h3>
            <p className="text-sm text-primary font-semibold mb-4">{mentor.expertise}</p>
            
            <p className="text-sm text-muted-foreground line-clamp-3 italic mb-8 bg-white/5 p-3 rounded-xl border border-white/5">
              "{mentor.mentorProfile?.bio || "No professional bio provided."}"
            </p>

            <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
              <div className="flex gap-2">
                <button className="p-2.5 rounded-xl bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-all border border-white/10">
                  <Edit3 size={16} />
                </button>
                <button className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/10">
                  <Trash2 size={16} />
                </button>
              </div>

              {mentor.status !== "approved" && (
                <GlassButton variant="secondary" className="px-5 py-2 text-[11px] font-bold h-auto rounded-xl" onClick={() => {}}>
                  <Check className="w-3.5 h-3.5 mr-1.5" /> Approve
                </GlassButton>
              )}
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <p className="text-muted-foreground">No mentors found matching this criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AdminMentors;