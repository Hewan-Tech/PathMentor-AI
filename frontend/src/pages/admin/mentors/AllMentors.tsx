import React, { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";

const AllMentors = () => {
  const [loading, setLoading] = useState(false);
  const [mentorCards, setMentorCards] = useState<any[]>([]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        <div className="col-span-full text-slate-300">
          Loading mentors...
        </div>
      ) : mentorCards.length > 0 ? (
        mentorCards.map((mentor) => (
          <div
            key={mentor.id}
            className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-4"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <img
                src={mentor.image}
                className="w-16 h-16 rounded-2xl object-cover border border-white/10"
              />

              <button
                type="button"
                title="More options"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Info */}
            <h3 className="text-lg font-bold text-white">
              {mentor.name}
            </h3>

            <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
              {mentor.role}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/10">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">
                  Status
                </p>
                <p className="text-white font-bold">{mentor.status}</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">
                  Students
                </p>
                <p className="text-white font-bold">{mentor.students}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-slate-300">
          No mentors found
        </div>
      )}
    </div>
  );
};

export default AllMentors;