import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, User, ExternalLink, Flag } from 'lucide-react';

const FeedbackReports = () => {
  const reports = [
    { id: "REP-402", type: "Abuse", subject: "Harmful comment in Course #22", reporter: "Jane D.", status: "Urgent" },
    { id: "REP-401", type: "Technical", subject: "Video player buffering on Lesson 4", reporter: "Mike R.", status: "Investigating" },
    { id: "REP-400", type: "Spam", subject: "Multiple duplicate posts in Forum", reporter: "Auto-Mod", status: "Resolved" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl"><ShieldAlert size={24}/></div>
        <div>
          <h1 className="text-2xl font-bold text-white">Incident Reports</h1>
          <p className="text-slate-500 text-sm">Monitor and resolve reported violations or system issues.</p>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
        <div className="divide-y divide-white/5">
          {reports.map((report) => (
            <div key={report.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-all">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg mt-1 ${
                  report.type === 'Abuse' ? 'bg-red-500/10 text-red-400' : 
                  report.type === 'Technical' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Flag size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-slate-500">#{report.id}</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      report.status === 'Urgent' ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
                    }`}>{report.status}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{report.subject}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                     <span className="flex items-center gap-1"><User size={12}/> Reported by: {report.reporter}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all">
                  Dismiss
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                  Take Action <ExternalLink size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackReports;