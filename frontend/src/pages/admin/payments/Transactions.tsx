import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Search, Filter, Download } from 'lucide-react';

const Transactions = () => {
  const transactions = [
    { id: "TX-9012", user: "Liam Neeson", amount: "+$120.00", method: "Visa ****4242", status: "Success", date: "Oct 24, 2023" },
    { id: "TX-9011", user: "Emma Watson", amount: "+$45.00", method: "PayPal", status: "Pending", date: "Oct 24, 2023" },
    { id: "TX-9010", user: "Bruce Wayne", amount: "+$2,500.00", method: "Bank Transfer", status: "Failed", date: "Oct 23, 2023" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Financial Transactions</h1>
        <div className="flex gap-2">
          <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white"><Download size={18}/></button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-900/20">Export CSV</button>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              <th className="p-4">Transaction ID</th>
              <th className="p-4">User</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Method</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-white/5 transition-colors text-sm">
                <td className="p-4 font-mono text-blue-400">{tx.id}</td>
                <td className="p-4 text-white font-medium">{tx.user}</td>
                <td className="p-4 font-bold text-emerald-400">{tx.amount}</td>
                <td className="p-4 text-slate-400">{tx.method}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                    tx.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' : 
                    tx.status === 'Pending' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
                  }`}>{tx.status}</span>
                </td>
                <td className="p-4 text-slate-500">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;