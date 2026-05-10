import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar, ChevronLeft, ChevronRight, Plus, X, Loader2, Video, CheckCircle, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { useSessions, useProfile } from "@/hooks/useStudentApi";
import { useToast } from "@/hooks/use-toast";

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const Scheduling = () => {
  const { toast } = useToast();
  const { user } = useProfile();
  const { sessions, loading, bookSession, cancelSession } = useSessions();
  const [showBook, setShowBook] = useState(false);
  const [form, setForm] = useState({ mentorId: "", date: "", meetingLink: "" });
  const [submitting, setSubmitting] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mentorId || !form.date) {
      toast({ title: "Missing fields", description: "Mentor ID and date are required", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await bookSession(form);
      toast({ title: "Session booked!", description: "Your session has been scheduled." });
      setShowBook(false);
      setForm({ mentorId: "", date: "", meetingLink: "" });
    } catch (e: any) {
      toast({ title: "Error", description: e.response?.data?.message || "Failed to book", variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelSession(id);
      toast({ title: "Session cancelled" });
    } catch (e: any) {
      toast({ title: "Error", description: e.response?.data?.message || "Failed", variant: "destructive" });
    }
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const sessionDates = new Set(sessions.map((s: any) => new Date(s.date).getDate()));

  const upcoming = sessions.filter((s: any) => s.status === "scheduled");
  const past = sessions.filter((s: any) => s.status !== "scheduled");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">
            My <span className="text-primary">Schedule</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Manage your mentor sessions.</p>
        </div>
        <GlassButton onClick={() => setShowBook(true)} className="flex items-center gap-2 px-4 py-2 text-sm">
          <Plus size={16} /> Book Session
        </GlassButton>
      </div>

      {/* Book Session Modal */}
      <AnimatePresence>
        {showBook && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#0f0f14] border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-white text-xl">Book a Session</h3>
                <button onClick={() => setShowBook(false)} className="text-muted-foreground hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Mentor ID</label>
                  <input
                    value={form.mentorId}
                    onChange={e => setForm({ ...form, mentorId: e.target.value })}
                    placeholder="Paste mentor's user ID"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Meeting Link (optional)</label>
                  <input
                    value={form.meetingLink}
                    onChange={e => setForm({ ...form, meetingLink: e.target.value })}
                    placeholder="https://meet.google.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowBook(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-sm font-bold text-muted-foreground hover:text-white transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 py-3 rounded-xl bg-primary text-black text-sm font-black flex items-center justify-center gap-2">
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : "Confirm"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sessions Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> Upcoming Sessions
                  </h3>
                  {upcoming.map((s: any) => (
                    <GlassCard key={s._id} className="p-5 border-primary/20 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl"><Video size={20} className="text-primary" /></div>
                        <div>
                          <p className="font-bold text-white text-sm">
                            Session with {s.mentorId?.name || "Mentor"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(s.date).toLocaleString()}
                          </p>
                          {s.meetingLink && (
                            <a href={s.meetingLink} target="_blank" rel="noreferrer"
                              className="text-[10px] text-primary hover:underline mt-1 block">
                              Join Meeting →
                            </a>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancel(s._id)}
                        className="text-[10px] font-bold text-red-400 hover:text-red-300 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
                      >
                        Cancel
                      </button>
                    </GlassCard>
                  ))}
                </div>
              )}

              {past.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Past Sessions</h3>
                  {past.map((s: any) => (
                    <GlassCard key={s._id} className="p-5 opacity-60">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {s.status === "completed"
                            ? <CheckCircle size={18} className="text-green-400" />
                            : <XCircle size={18} className="text-red-400" />
                          }
                          <div>
                            <p className="font-bold text-white text-sm">
                              Session with {s.mentorId?.name || "Mentor"}
                            </p>
                            <p className="text-xs text-muted-foreground">{new Date(s.date).toLocaleString()}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${STATUS_STYLES[s.status]}`}>
                          {s.status.toUpperCase()}
                        </span>
                      </div>
                      {s.summary && <p className="text-xs text-muted-foreground mt-3 ml-10">{s.summary}</p>}
                    </GlassCard>
                  ))}
                </div>
              )}

              {sessions.length === 0 && (
                <GlassCard className="p-12 text-center border-dashed border-white/10">
                  <Calendar className="mx-auto mb-3 text-muted-foreground" size={32} />
                  <p className="text-muted-foreground text-sm">No sessions yet. Book your first session!</p>
                </GlassCard>
              )}
            </>
          )}
        </div>

        {/* Mini Calendar */}
        <GlassCard className="p-6 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-white">
              {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
            </h4>
            <div className="flex gap-2">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-1 hover:bg-white/10 rounded-lg transition-all">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-1 hover:bg-white/10 rounded-lg transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const today = new Date();
              const isToday = day === today.getDate() && currentMonth.getMonth() === today.getMonth();
              const hasSession = sessionDates.has(day);
              return (
                <div key={day} className={`p-1.5 rounded-lg text-xs transition-all relative ${isToday ? "bg-primary text-black font-black" : "hover:bg-white/10 text-white/70"}`}>
                  {day}
                  {hasSession && !isToday && (
                    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default Scheduling;
