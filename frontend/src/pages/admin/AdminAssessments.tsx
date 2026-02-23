import { useEffect, useState } from "react";
import api from "@/services/api";
import { 
  ClipboardList, Plus, Eye, Edit3, Trash2, 
  Clock, BookOpen 
} from "lucide-react";
import { motion } from "framer-motion";

// UI Components
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

const AdminAssessments = () => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const res = await api.get("/admin/assessments");
      setAssessments(res.data);
    } catch (err) {
      console.error(err);
      // Simulation data if API fails
      setAssessments([
        { _id: "1", title: "Frontend Basics", track: "Frontend", questions: [1,2,3,4,5], duration: 30 },
        { _id: "2", title: "Node.js Advanced", track: "Backend", questions: [1,2,3,4,5,6,7,8,9,10], duration: 45 },
      ]);
    } finally {
      setLoading(false);
    }
  };

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
            Assessments <span className="text-primary">Hub</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Design and manage learning evaluations for all tracks.
          </p>
        </div>
        <GlassButton variant="primary" glow onClick={() => {}}>
          <Plus className="w-4 h-4 mr-2" /> Create New Quiz
        </GlassButton>
      </div>

      {/* TABLE CARD */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-muted-foreground uppercase text-[11px] font-bold tracking-wider bg-white/[0.02]">
              <tr>
                <th className="px-6 py-4 text-white/70">Title</th>
                <th className="px-6 py-4 text-white/70">Track</th>
                <th className="px-6 py-4 text-white/70">Content</th>
                <th className="px-6 py-4 text-white/70">Duration</th>
                <th className="px-6 py-4 text-right text-white/70">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assessments.map((test) => (
                <tr key={test._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-bold text-white group-hover:text-primary transition-colors">
                    {test.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {test.track}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-primary/60" />
                      {test.questions?.length || 0} Questions
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-primary/60" />
                      {test.duration} mins
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 bg-white/5 text-muted-foreground hover:text-white rounded-lg transition-all border border-white/10">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg transition-all border border-amber-500/10">
                        <Edit3 size={16} />
                      </button>
                      <button className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/10">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {assessments.length === 0 && (
          <div className="p-20 text-center">
            <ClipboardList className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-muted-foreground">No assessments created yet.</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default AdminAssessments;