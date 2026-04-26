import React from 'react';
import { Award, AlertCircle, CheckCircle2 } from 'lucide-react';

const GradesStatus = () => {
  const grades = [
    { student: "Alex Rivera", exam: "Module 1 Quiz", score: 94, status: "Pass" },
    { student: "Sarah Chen", exam: "Final Project", score: 88, status: "Pass" },
    { student: "Jordan Smith", exam: "Module 1 Quiz", score: 52, status: "Needs Review" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Grades & Status</h1>
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-slate-400 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Assessment</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {grades.map((g, i) => (
              <tr key={i} className="text-slate-300">
                <td className="px-6 py-4 font-medium text-white">{g.student}</td>
                <td className="px-6 py-4">{g.exam}</td>
                <td className="px-6 py-4">
                   <span className={`text-lg font-bold ${g.score >= 90 ? 'text-indigo-400' : g.score < 60 ? 'text-red-400' : 'text-white'}`}>
                    {g.score}%
                   </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {g.status === 'Pass' ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : (
                      <AlertCircle size={16} className="text-amber-500" />
                    )}
                    <span className={g.status === 'Pass' ? 'text-emerald-400' : 'text-amber-400'}>{g.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradesStatus;