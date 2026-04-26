import React from 'react';
import { Ticket, Filter, Clock, CheckCircle2, AlertCircle, ExternalLink, User } from 'lucide-react';

const SupportTickets = () => {
  const tickets = [
    { id: "TCK-1024", subject: "Unable to upload assignments", priority: "High", status: "Open", user: "Liam N.", date: "10m ago" },
    { id: "TCK-1023", subject: "Payment gateway error", priority: "Critical", status: "In Progress", user: "Emma W.", date: "2h ago" },
    { id: "TCK-1022", subject: "Course content video typo", priority: "Low", status: "Resolved", user: "Bruce B.", date: "1d ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
          <p className="text-slate-500 text-sm">Manage and track student/mentor support requests.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 hover:text-white transition-all">
            <Filter size={16} /> Filter
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-900/20">New Ticket</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="group p-5 bg-slate-900/40 border border-white/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-all">
            <div className="flex items-start gap-4 flex-1">
              <div className={`p-3 rounded-xl ${
                ticket.status === 'Open' ? 'bg-red-500/10 text-red-400' : 
                ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
              }`}>
                <Ticket size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-mono text-blue-400 tracking-tighter">#{ticket.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    ticket.priority === 'High' || ticket.priority === 'Critical' ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-400'
                  }`}>{ticket.priority}</span>
                </div>
                <h3 className="text-white font-bold mb-1">{ticket.subject}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><User size={12}/> {ticket.user}</span>
                  <span className="flex items-center gap-1"><Clock size={12}/> {ticket.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right min-w-[100px]">
                <p className={`text-xs font-bold flex items-center justify-end gap-1.5 ${
                  ticket.status === 'Open' ? 'text-red-400' : 
                  ticket.status === 'Resolved' ? 'text-emerald-400' : 'text-blue-400'
                }`}>
                  {ticket.status === 'Resolved' ? <CheckCircle2 size={14}/> : <AlertCircle size={14}/>}
                  {ticket.status}
                </p>
                <p className="text-[10px] text-slate-600 font-medium">Assigned to: Support Lead</p>
              </div>
              <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-blue-500/50 transition-all">
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportTickets;