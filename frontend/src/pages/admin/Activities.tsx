import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { Activity, ChevronLeft, ChevronRight, Clock, User } from "lucide-react";

const Activities = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/activities/all", { params: { page, limit: 15 } });
        setActivities(res.data.activities || []);
        setPages(res.data.pages || 1);
      } catch (err) {
        console.error("Failed to load logs", err);
      } finally {
        setLoading(false);
      }
    };
    loadActivities();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">System Activities</h1>
          <p className="text-slate-400 mt-1">Full audit logs of all admin and mentor actions.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400 uppercase text-[10px] tracking-widest font-bold">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Target</th>
              <th className="px-6 py-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={4} className="p-10 text-center text-slate-500">Syncing logs...</td></tr>
            ) : activities.map((log) => (
              <tr key={log._id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4 text-white font-medium">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-blue-400" />
                    {log.user?.name || "System"}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-300">{log.message}</td>
                <td className="px-6 py-4 text-slate-400">{log.target || "N/A"}</td>
                <td className="px-6 py-4 text-slate-500">
                  <div className="flex items-center gap-2"><Clock size={12}/> {new Date(log.createdAt).toLocaleString()}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm text-slate-400">
        <span>Page {page} of {pages}</span>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 bg-white/5 rounded-lg disabled:opacity-50"><ChevronLeft size={20}/></button>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="p-2 bg-white/5 rounded-lg disabled:opacity-50"><ChevronRight size={20}/></button>
        </div>
      </div>
    </div>
  );
};

export default Activities;
