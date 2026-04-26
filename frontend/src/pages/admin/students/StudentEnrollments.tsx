import React from 'react';
import { BookOpen, CreditCard, Calendar } from 'lucide-react';

const StudentEnrollments = () => {
  const enrollments = [
    { student: "Alex Rivera", course: "React Masterclass", date: "Oct 12, 2023", plan: "Premium", payment: "Paid" },
    { student: "Sarah Chen", course: "UI/UX Design Essentials", date: "Nov 05, 2023", plan: "Basic", payment: "Pending" },
    { student: "Michael Scott", course: "Management 101", date: "Dec 01, 2023", plan: "Premium", payment: "Paid" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Course Enrollments</h1>
      <div className="grid gap-4">
        {enrollments.map((item, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold">{item.course}</h3>
                <p className="text-slate-400 text-sm">{item.student}</p>
              </div>
            </div>
            <div className="flex gap-8 items-center text-sm">
              <div className="flex flex-col items-start">
                <span className="text-slate-500 flex items-center gap-1"><Calendar size={14}/> Enrolled</span>
                <span className="text-slate-200">{item.date}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-slate-500 flex items-center gap-1"><CreditCard size={14}/> Payment</span>
                <span className={item.payment === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}>{item.payment}</span>
              </div>
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-medium transition">
                Manage Access
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentEnrollments;