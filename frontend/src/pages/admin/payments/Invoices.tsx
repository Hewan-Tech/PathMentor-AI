import React from 'react';
import { FileText, Download, Mail, ExternalLink } from 'lucide-react';

const Invoices = () => {
  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-white mb-2">Billing History</h1>
      <p className="text-slate-500 mb-8">Manage and track all generated invoices.</p>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="group p-5 bg-slate-900/40 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-white/5 rounded-xl text-slate-400 group-hover:text-blue-400 transition-colors">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-white font-bold">Invoice #INV-2023-00{i}</p>
                <p className="text-xs text-slate-500">Issued: Oct {20-i}, 2023 • Due in 15 days</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
               <div className="text-right">
                  <p className="text-white font-bold">$129.00</p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">Paid</p>
               </div>
               <div className="flex gap-2">
                 <button title="Download PDF" className="p-2 hover:bg-blue-500/10 hover:text-blue-400 rounded-lg text-slate-500 transition-all"><Download size={18}/></button>
                 <button title="Resend Email" className="p-2 hover:bg-purple-500/10 hover:text-purple-400 rounded-lg text-slate-500 transition-all"><Mail size={18}/></button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invoices;