const MentorReviews = () => { // Renamed for consistency
  return (
    <div className="p-8 max-w-4xl">
      <h2 className="text-2xl font-bold text-white mb-6">Student Reviews</h2>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl relative">
             <div className="flex gap-1 text-amber-400 mb-2">★★★★★</div>
             <p className="text-slate-300 italic">"The React course by Jane was life-changing. Great mentor!"</p>
             <p className="text-slate-500 text-xs mt-4 font-bold uppercase">— Hana T. for Jane Cooper</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorReviews; 