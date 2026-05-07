import React, { useState, useMemo } from 'react';
import { ArrowUpRight, ArrowDownLeft, Search, Filter, Download, CreditCard, AlertCircle, CheckCircle2, Clock, Wallet } from 'lucide-react';

const Transactions = () => {
  const [selectedCourse, setSelectedCourse] = useState('All Programs');
  const [statusFilter, setStatusFilter] = useState('All');

  const transactionData = [
    { id: "TX-9012", user: "Liam Neeson", course: "React Masterclass", amount: 120.00, method: "Visa ****4242", status: "Success", date: "Oct 24, 2023" },
    { id: "TX-9011", user: "Emma Watson", course: "UI/UX Design", amount: 45.00, method: "PayPal", status: "Pending", date: "Oct 24, 2023" },
    { id: "TX-9010", user: "Bruce Wayne", course: "Data Science", amount: 2500.00, method: "Bank Transfer", status: "Failed", date: "Oct 23, 2023" },
    { id: "TX-9009", user: "Cillian Murphy", course: "React Masterclass", amount: 499.00, method: "Visa ****1111", status: "Success", date: "Oct 22, 2023" },
    { id: "TX-9008", user: "Margot Robbie", course: "UI/UX Design", amount: 199.00, method: "MasterCard", status: "Success", date: "Oct 21, 2023" },
  ];

  const courses = ["All Programs", ...new Set(transactionData.map(t => t.course))];

  // Filtered Logic
  const filteredTxs = useMemo(() => {
    return transactionData.filter(tx => {
      const courseMatch = selectedCourse === 'All Programs' || tx.course === selectedCourse;
      const statusMatch = statusFilter === 'All' || tx.status === statusFilter;
      return courseMatch && statusMatch;
    });
  }, [selectedCourse, statusFilter]);

  // Totals Calculation
  const stats = useMemo(() => {
    return {
      revenue: filteredTxs.filter(t => t.status === 'Success').reduce((acc, t) => acc + t.amount, 0),
      failed: filteredTxs.filter(t => t.status === 'Failed').length,
      pending: filteredTxs.filter(t => t.status === 'Pending').length
    };
  }, [filteredTxs]);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header & Financial Overview */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Wallet className="text-blue-500" size={28} />
            Financial Ledger
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time revenue tracking and transaction history.</p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex-1 lg:min-w-[160px]">
            <p className="text-[10px] text-emerald-500 font-black uppercase">Success Revenue</p>
            <p className="text-2xl font-bold text-white">${stats.revenue.toLocaleString()}</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex-1 lg:min-w-[160px]">
            <p className="text-[10px] text-red-400 font-black uppercase">Failed Tx</p>
            <p className="text-2xl font-bold text-white">{stats.failed}</p>
          </div>
        </div>
      </div>

      {/* Categorization & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by User, Transaction ID, or Method..."
            className="w-full bg-slate-900/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <label htmlFor="course-filter" className="sr-only">Filter by Course</label>
          <select 
            id="course-filter"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full bg-slate-900/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white appearance-none focus:outline-none cursor-pointer"
          >
            {courses.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
          </select>
        </div>

        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-blue-900/20">
          <Download size={18} /> Export Reports
        </button>
      </div>

      {/* Transaction Table */}
      <div className="bg-slate-900/40 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl">
        <div className="p-1 bg-white/5 flex border-b border-white/5">
          {['All', 'Success', 'Pending', 'Failed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                statusFilter === status ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-white/5">
              <th className="px-8 py-6">Reference ID</th>
              <th className="px-6 py-6">Customer / Enrollment</th>
              <th className="px-6 py-6">Amount</th>
              <th className="px-6 py-6">Payment Method</th>
              <th className="px-6 py-6 text-center">Status</th>
              <th className="px-8 py-6 text-right">Processed Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTxs.map((tx) => (
              <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5 font-mono text-xs text-blue-400/80">{tx.id}</td>
                <td className="px-6 py-5">
                  <div className="text-white text-sm font-bold">{tx.user}</div>
                  <div className="text-slate-500 text-[11px] font-medium">{tx.course}</div>
                </td>
                <td className={`px-6 py-5 font-black text-base ${tx.status === 'Failed' ? 'text-slate-500 line-through' : 'text-white'}`}>
                  ${tx.amount.toLocaleString()}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <CreditCard size={14} className="text-slate-600" />
                    {tx.method}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                      tx.status === 'Success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                      tx.status === 'Pending' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 
                      'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                      {tx.status === 'Success' ? <CheckCircle2 size={12}/> : tx.status === 'Pending' ? <Clock size={12}/> : <AlertCircle size={12}/>}
                      {tx.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right text-slate-500 text-xs font-medium">
                  {tx.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTxs.length === 0 && (
          <div className="py-24 text-center">
            <CreditCard size={48} className="mx-auto text-slate-800 mb-4" />
            <p className="text-slate-500">No transactions found for this selection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;