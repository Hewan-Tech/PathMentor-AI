import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, ArrowRight, CheckCircle } from 'lucide-react';

export const Assignments = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
       <div className="grid gap-4">
        <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Active Assessments</h3>
        <div className="p-6 rounded-3xl border border-orange-500/30 bg-orange-500/5 flex justify-between items-center group cursor-pointer hover:bg-orange-500/10 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/20 rounded-2xl text-orange-500"><Shield size={24}/></div>
            <div>
              <h4 className="text-xl font-bold">Final Knowledge Check</h4>
              <p className="text-sm text-orange-500/70 italic">Due in 4 hours • 20 Questions</p>
            </div>
          </div>
          <ArrowRight className="group-hover:translate-x-2 transition-transform"/>
        </div>
      </div>

      <div className="rounded-3xl border border-white/5 bg-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-bold uppercase text-muted-foreground">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Score</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/5">
              <td className="p-4 text-sm">Intro to UI Principles</td>
              <td className="p-4 font-mono text-green-500">98/100</td>
              <td className="p-4"><span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-1 rounded-full font-bold">GRADED</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
export default Assignments;