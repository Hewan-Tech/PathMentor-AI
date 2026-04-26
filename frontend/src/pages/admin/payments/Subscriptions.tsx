import React from 'react';
import { CreditCard, Zap, Users, TrendingUp } from 'lucide-react';

const Subscriptions = () => {
  const subs = [
    { user: "Tony Stark", plan: "Pro Plan", price: "$29/mo", status: "Active", renewal: "Nov 12, 2023" },
    { user: "Steve Rogers", plan: "Basic", price: "$9/mo", status: "Canceled", renewal: "Expired" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
          <TrendingUp className="text-blue-400 mb-2" />
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Active Subs</p>
          <h3 className="text-2xl font-bold text-white">1,284</h3>
        </div>
        <div className="p-6 bg-purple-600/10 border border-purple-500/20 rounded-2xl">
          <Zap className="text-purple-400 mb-2" />
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Monthly Revenue</p>
          <h3 className="text-2xl font-bold text-white">$14,320</h3>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-white mb-6">Recent Subscriber Activity</h2>
        <div className="space-y-4">
          {subs.map((sub, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400"><CreditCard size={20}/></div>
                <div>
                  <p className="text-white font-bold">{sub.user}</p>
                  <p className="text-xs text-slate-500">{sub.plan} • {sub.price}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-[10px] font-black uppercase mb-1 ${sub.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}`}>{sub.status}</p>
                <p className="text-xs text-slate-500">Renews: {sub.renewal}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;