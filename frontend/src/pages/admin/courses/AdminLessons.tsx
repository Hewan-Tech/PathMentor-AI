import { PlayCircle, Upload, EyeOff } from "lucide-react";

const AdminLessons = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lesson Content Overview</h1>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 bg-card border border-white/5 rounded-xl flex items-center gap-4">
            <div className="w-16 h-10 bg-muted rounded flex items-center justify-center">
              <PlayCircle size={20} className="text-muted-foreground"/>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Lesson {i}: The fundamentals of AI</p>
              <p className="text-xs text-muted-foreground">Duration: 14:02 • Course: AI 101</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-secondary text-xs rounded-lg flex items-center gap-2">
                <Upload size={14}/> Replace
              </button>
              <button className="px-3 py-1 text-xs border border-white/10 rounded-lg"><EyeOff size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminLessons;