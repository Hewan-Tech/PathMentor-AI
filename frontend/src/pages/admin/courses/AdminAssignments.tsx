import { User, FileCheck, AlertCircle } from "lucide-react";

const AdminAssignments = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assignment Submissions</h1>
      <div className="grid grid-cols-1 gap-3">
        {[
          { name: "John Doe", task: "Project 1", date: "2m ago", status: "Needs Grading" },
          { name: "Jane Smith", task: "Final Quiz", date: "1h ago", status: "Graded" }
        ].map((sub, i) => (
          <div key={i} className="p-4 bg-card border border-white/5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-secondary rounded-lg"><User size={18}/></div>
              <div>
                <p className="font-bold text-sm">{sub.name}</p>
                <p className="text-xs text-muted-foreground">{sub.task} • {sub.date}</p>
              </div>
            </div>
            <button className={`px-4 py-1.5 text-xs font-bold rounded-lg ${sub.status === 'Needs Grading' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              {sub.status === 'Needs Grading' ? 'Grade Now' : 'View Submission'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminAssignments;