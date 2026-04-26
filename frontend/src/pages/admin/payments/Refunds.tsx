import React from 'react';
import { RefreshCcw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const Refunds = () => {
  return (
    <div className="p-2">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-red-500/20 text-red-400 rounded-lg"><RefreshCcw size={20}/></div>
        <h1 className="text-2xl font-bold text-white">Refund Requests</h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { name: "Wanda Maximoff", reason: "Accidental purchase", amount: "$89.00", status: "New" },
          { name: "Peter Parker", reason: "Content not as expected", amount: "$15.00", status: "Processing" }
        ].map((ref, idx) => (
          <div key={idx} className="p-6 bg-slate-900/40 border border-white/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex gap-4">
              <AlertCircle className="text-orange-400 shrink-0" size={24} />
              <div>
                <p className="text-white font-bold">{ref.name} <span className="text-slate-500 font-normal ml-2">— Requested {ref.amount}</span></p>
                <p className="text-sm text-slate-400 mt-1 italic">"{ref.reason}"</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${ref.status === 'New' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                {ref.status}
              </span>
              <div className="h-8 w-[1px] bg-white/10 mx-2" />
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all">
                <CheckCircle size={14}/> Approve
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-500 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all">
                <XCircle size={14}/> Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Refunds;