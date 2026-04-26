import React from 'react';
import { Terminal, Copy, Zap, Code, Database, RefreshCw } from 'lucide-react';

const DeveloperTools = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg"><Terminal size={24}/></div>
        <h1 className="text-2xl font-bold text-white">Developer Console</h1>
      </div>

      <div className="p-8 bg-slate-900/40 border border-white/10 rounded-3xl backdrop-blur-xl">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Live API Keys</h3>
        <div className="space-y-4">
          <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-xs flex justify-between items-center group">
            <span className="text-blue-300">sk_live_51Mv9...pZ9q2</span>
            <button className="text-slate-500 group-hover:text-white"><Copy size={16}/></button>
          </div>
          <p className="text-[10px] text-red-400 font-bold uppercase tracking-tighter">Warning: Never share your production keys.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/40 border border-white/10 rounded-3xl space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <RefreshCw size={14} className="text-orange-400"/> System Cache
          </h4>
          <p className="text-xs text-slate-500">Purge all cached assets and database query results.</p>
          <button className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 transition-all">Clear Cache</button>
        </div>

        <div className="p-6 bg-slate-900/40 border border-white/10 rounded-3xl space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Database size={14} className="text-emerald-400"/> Webhook Logs
          </h4>
          <p className="text-xs text-slate-500">Last event: <span className="text-emerald-400">payment.succeeded</span> 2m ago</p>
          <button className="w-full py-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold">View History</button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperTools;