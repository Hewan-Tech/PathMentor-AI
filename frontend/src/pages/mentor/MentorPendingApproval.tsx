import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCcw,
  ExternalLink
} from "lucide-react";
import { ParticlesBackground } from "@/components/landing/ParticlesBackground";
import { toast } from "sonner";

const MentorPendingApproval = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending' | 'reviewing' | 'approved'>('pending');
  const [loading, setLoading] = useState(true); // Keep this

  useEffect(() => {
    // 1. Check current status immediately on load
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.status === "approved") {
        navigate("/mentor/MentordDashboard");
        return;
      }
      // If they are pending, update local state to match their actual status
      if (user.status) setStatus(user.status);
    }

    // 2. STOP LOADING so the page actually shows
    setLoading(false);

    // 3. Keep your "Magic" storage listener for real-time updates from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        const updatedUser = JSON.parse(e.newValue || "{}");
        if (updatedUser.status === "approved") {
          toast.success("Identity Verified. Accessing Nexus...");
          setTimeout(() => navigate("/mentor/MentordDashboard"), 1500);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  if (loading) return null; 

  return (
    <div className="min-h-screen relative bg-[#020617] text-slate-200 overflow-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none z-0">
        <ParticlesBackground />
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#33b6ff]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#a855f7]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#33b6ff] text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <ShieldCheck size={14} /> Verification Node
          </div>
          <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            Mentor <span className="text-[#33b6ff]">Status</span>
          </h1>
        </motion.div>

        <div className="w-full max-w-5xl grid md:grid-cols-5 gap-8">
          {/* LEFT: FLOW SEQUENCE */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white/[0.07] backdrop-blur-3xl border border-white/20 p-8 rounded-[32px] h-full shadow-2xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-10 flex items-center gap-2">
                <Clock size={16} className="text-[#33b6ff]" /> Flow Sequence
              </h3>
              <div className="space-y-10 relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-white/10" />
                <Step label="Submission" sub="Account Created" done={true} />
                <Step label="Neural Audit" sub="Awaiting Admin" active={status !== 'approved'} done={status === 'approved'} />
                <Step label="Portal Unlock" sub="Full access" active={status === 'approved'} done={status === 'approved'} />
              </div>
            </div>
          </div>

          {/* RIGHT: STATUS CARD */}
          <div className="md:col-span-3">
            <div className="bg-white/[0.1] backdrop-blur-3xl border border-white/20 p-10 rounded-[40px] shadow-2xl text-center">
              <div className="mb-8 flex justify-center">
                <div className="p-6 rounded-full bg-[#33b6ff]/10 text-[#33b6ff] animate-pulse">
                   <RefreshCcw size={40} />
                </div>
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Manual Audit in Progress</h3>
              <p className="text-slate-400 text-sm mb-8 px-6 leading-relaxed">
                Our administrators are currently reviewing your credentials. Once approved, this page will update automatically.
              </p>
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-left">
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Network Status</p>
                   <p className="text-sm font-bold text-[#33b6ff]">Synchronizing with Admin Node...</p>
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#33b6ff] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#33b6ff] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#33b6ff] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step = ({ label, sub, active, done }: any) => (
  <div className="relative flex items-start gap-6">
    <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
      done ? 'bg-[#33b6ff] border-[#33b6ff]' : 
      active ? 'bg-[#020617] border-[#33b6ff] shadow-[0_0_15px_rgba(51,182,255,0.3)]' : 'bg-[#020617] border-white/10'
    }`}>
      {done ? <CheckCircle2 size={12} className="text-black" /> : <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#33b6ff] animate-pulse' : 'bg-white/10'}`} />}
    </div>
    <div>
      <p className={`text-sm font-black tracking-tighter ${active || done ? 'text-white' : 'text-slate-600'}`}>{label}</p>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{sub}</p>
    </div>
  </div>
);

export default MentorPendingApproval;