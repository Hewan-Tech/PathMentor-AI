import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Briefcase, Mail, Lock, User, Upload } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { ParticlesBackground } from "@/components/landing/ParticlesBackground";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// 1. Zod Schema
const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.enum(["student", "mentor", "admin"]),
});

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "register");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as "student" | "mentor" | "admin",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);

  useEffect(() => {
    setIsLogin(searchParams.get("mode") !== "register");
  }, [searchParams]);

  // --- FIXED HANDLESUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate a small delay like a real database
      setTimeout(() => {
        // Create the user object based on what the user typed
        const user = {
          name: formData.name || "Test User",
          email: formData.email,
          role: formData.role, 
          onboardingCompleted: true 
        };

        // Save to local storage so the other pages can see who is logged in
        localStorage.setItem("token", "mock-token-123");
        localStorage.setItem("user", JSON.stringify(user));

        toast({ 
          title: isLogin ? "Welcome back!" : "Account created!", 
          description: `Successfully signed in as ${user.role}` 
        });

        // --- REDIRECTION LOGIC ---
        const role = user.role.toLowerCase();

        if (role === "mentor") {
          navigate("/mentor-dashboard");
        } else if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "student") {
          if (user.onboardingCompleted === false) {
            navigate("/register"); 
          } else {
            navigate("/dashboard");
          }
        }

        setIsSubmitting(false);
      }, 1000);

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Something went wrong with the mock login.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-background overflow-hidden">
      <ParticlesBackground />
      
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground z-20 transition-all font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>

      <div className="w-full max-w-md relative z-10">
        <GlassCard variant="elevated" className="p-8 border-white/10 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1E5350] flex items-center justify-center shadow-lg shadow-teal-900/20">
                <span className="text-2xl font-black text-white">M</span>
              </div>
              <span className="text-2xl font-black tracking-tight">MentorConnect</span>
            </div>
          </div>

          <div className="flex gap-2 p-1 bg-black/20 rounded-2xl mb-8">
            <button 
              type="button"
              onClick={() => setIsLogin(true)} 
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isLogin ? "bg-[#1E5350] text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => setIsLogin(false)} 
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isLogin ? "bg-[#1E5350] text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
            >
              Sign Up
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#1E5350] transition-colors" />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-2xl text-sm font-bold outline-none appearance-none focus:border-[#1E5350] transition-all text-white"
                >
                  <option value="student" className="bg-slate-900">Student Access</option>
                  <option value="mentor" className="bg-slate-900">Mentor Console</option>
                  <option value="admin" className="bg-slate-900">Admin Authority</option>
                </select>
              </div>
            )}

            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#1E5350] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-[#1E5350] transition-all font-medium text-white" 
                  required 
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#1E5350] transition-colors" />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-[#1E5350] transition-all font-medium text-white" 
                required 
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#1E5350] transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Secure Password" 
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                className="w-full pl-12 pr-12 py-4 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-[#1E5350] transition-all font-medium text-white" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {!isLogin && formData.role === "mentor" && (
              <div className="space-y-2 py-2">
                <label className="text-[10px] text-[#1E5350] font-black uppercase tracking-[0.2em] ml-1">
                  Mentor Verification
                </label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:border-[#1E5350] hover:bg-[#1E5350]/5 transition-all group">
                  <input 
                    type="file" 
                    className="hidden" 
                    id="cv-upload" 
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)} 
                  />
                  <label htmlFor="cv-upload" className="cursor-pointer block">
                    {cvFile ? (
                      <span className="text-white font-bold text-sm">{cvFile.name}</span>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-[#1E5350]">
                        <Upload size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest">Upload Credentials (PDF)</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            {!isLogin && formData.role === "admin" && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest text-center leading-relaxed">
                  Notice: Administrator roles require manual activation from the root console after signup.
                </p>
              </div>
            )}

            <GlassButton 
              type="submit" 
              variant="primary" 
              className="w-full bg-[#1E5350] hover:bg-teal-900 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-teal-900/20 disabled:opacity-50" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Authenticating..." : isLogin ? "Access System" : "Establish Account"}
            </GlassButton>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default Auth;