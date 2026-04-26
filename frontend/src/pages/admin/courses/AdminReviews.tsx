import { Star, CheckCircle, XCircle } from "lucide-react";

const AdminReviews = () => {
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Review Moderation</h1>
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="p-6 bg-card border border-white/5 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary" />
                <div>
                  <p className="font-bold text-sm">User_{i}42</p>
                  <div className="flex text-yellow-500 gap-0.5"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12}/><Star size={12}/></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg" title="Approve"><CheckCircle size={20}/></button>
                <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg" title="Reject"><XCircle size={20}/></button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">"I didn't like the third module, it was too fast."</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminReviews;