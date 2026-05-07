import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Download, ArrowUpRight, Wallet, Calendar, Info, Search, History } from 'lucide-react';

const MentorEarnings = () => {
  const [filterQuery, setFilterQuery] = useState('');

  const transactions = [
    { id: "PAY-001", name: "Jane Cooper", amount: 1200.00, fee: 180.00, status: "Completed", date: "Apr 20, 2026", method: "Direct Deposit" },
    { id: "PAY-002", name: "Cody Fisher", amount: 850.00, fee: 127.50, status: "Processing", date: "Apr 22, 2026", method: "PayPal" },
    { id: "PAY-003", name: "Esther Howard", amount: 2100.00, fee: 315.00, status: "Completed", date: "Apr 18, 2026", method: "Bank Transfer" },
  ];

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => tx.name.toLowerCase().includes(filterQuery.toLowerCase()));
  }, [filterQuery]);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header & Global Export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Wallet className="text-cyan-500" size={32} />
            Payout Ecosystem
          </h2>
          <p className="text-slate-400 text-sm mt-1">Audit mentor disbursements and platform commission logs.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-slate-300 hover:text-white transition-all hover:bg-white/10">
            <History size={16} /> Payout History
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden transition-all hover:border-cyan-500/30">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign size={120} className="text-white" />
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Mentor Payouts (MTD)</p>
          <h3 className="text-4xl font-black text-white leading-tight">$42,850.50</h3>
          <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 w-fit px-3 py-1 rounded-full">
            <TrendingUp size={14} /> +12% Growth
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 group transition-all hover:border-orange-500/30">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Pending Escrow</p>
          <h3 className="text-4xl font-black text-white leading-tight">$3,120.00</h3>
          <div className="mt-4 flex items-center gap-2 text-orange-400 text-xs font-bold">
            <Calendar size={14} /> Next Cycle: May 01
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 border-l-4 border-l-cyan-500/50">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Platform Fee (15%)</p>
            <Info size={14} className="text-slate-600 hover:text-cyan-400 cursor-help transition-colors" />
          </div>
          <h3 className="text-4xl font-black text-cyan-400 leading-tight">$7,560.25</h3>
          <p className="mt-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">Net Retained Revenue</p>
        </div>
      </div>

      {/* Transaction Management */}
      <div className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <h4 className="text-white font-black uppercase tracking-widest text-sm">Disbursement Log</h4>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Filter by mentor..." 
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-6 hover:bg-white/[0.02] transition-all group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-all border border-white/5">
                  <ArrowUpRight size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-white">{tx.name}</p>
                    <span className="text-[10px] text-slate-600 font-mono">{tx.id}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 tracking-tighter">
                    {tx.date} • via {tx.method}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-12 mt-4 lg:mt-0 px-4 lg:px-0">
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Gross</p>
                  <p className="text-sm font-bold text-white">${tx.amount.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest text-rose-500/70">Fee</p>
                  <p className="text-sm font-bold text-slate-400">-${tx.fee.toFixed(2)}</p>
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Status</p>
                  <p className={`text-xs font-black uppercase tracking-tighter ${
                    tx.status === 'Completed' ? 'text-emerald-400' : 'text-orange-400'
                  }`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-500 text-sm italic">No disbursements match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorEarnings;