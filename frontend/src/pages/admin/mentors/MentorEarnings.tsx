import React from 'react';
import { DollarSign, TrendingUp, Download, ArrowUpRight } from 'lucide-react';

const MentorEarnings = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">Financial Overview</h2>
        <button className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest hover:text-cyan-300 transition-colors">
          <Download size={16} /> Export Reports
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={80} className="text-white" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Paid to Mentors</p>
          <h3 className="text-4xl font-bold text-white">$42,850.50</h3>
          <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <TrendingUp size={16} /> +12% from last month
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl p-8">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pending Payouts</p>
          <h3 className="text-4xl font-bold text-white">$3,120.00</h3>
          <p className="mt-4 text-slate-400 text-xs font-medium">Scheduled for May 1st</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl p-8">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Platform Fee (15%)</p>
          <h3 className="text-4xl font-bold text-cyan-400">$7,560.25</h3>
          <p className="mt-4 text-slate-400 text-xs font-medium">Net platform revenue</p>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
        <h4 className="text-white font-bold mb-6 tracking-tight">Recent Transactions</h4>
        <div className="space-y-4">
          {[
            { name: "Jane Cooper", amount: "$1,200.00", status: "Completed", date: "Apr 20" },
            { name: "Cody Fisher", amount: "$850.00", status: "Processing", date: "Apr 22" }
          ].map((tx, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                  <ArrowUpRight size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{tx.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{tx.amount}</p>
                <p className={`text-[9px] font-bold uppercase ${tx.status === 'Completed' ? 'text-emerald-400' : 'text-orange-400'}`}>
                  {tx.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorEarnings;