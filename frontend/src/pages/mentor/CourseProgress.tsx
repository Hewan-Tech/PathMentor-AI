import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CourseProgress = () => {
  const navigate = useNavigate();

  const stats = {
    courseName: "React Mastery",
    totalStudents: 120,
    completed: 78,
    inProgress: 32,
    notStarted: 10,
    averageScore: 82,
  };

  const completionRate = Math.round(
    (stats.completed / stats.totalStudents) * 100
  );

  const data = [
    { label: "Completed", value: stats.completed, color: "bg-green-400" },
    { label: "In Progress", value: stats.inProgress, color: "bg-[#33b6ff]" },
    { label: "Not Started", value: stats.notStarted, color: "bg-white/30" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-8 py-8">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
      >
        ← Back
      </button>

      {/* HERO */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          📊 Course Analytics
        </h1>
        <p className="text-white/60 mt-1">
          {stats.courseName} performance overview
        </p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="p-5 rounded-2xl bg-white/[0.04] border border-white/10"
        >
          <p className="text-white/60 text-sm">Total Students</p>
          <h2 className="text-3xl font-bold">{stats.totalStudents}</h2>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="p-5 rounded-2xl bg-white/[0.04] border border-white/10"
        >
          <p className="text-white/60 text-sm">Average Score</p>
          <h2 className="text-3xl font-bold text-[#33b6ff]">
            {stats.averageScore}%
          </h2>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="p-5 rounded-2xl bg-white/[0.04] border border-white/10"
        >
          <p className="text-white/60 text-sm">Completion Rate</p>
          <h2 className="text-3xl font-bold text-green-400">
            {completionRate}%
          </h2>
        </motion.div>

      </div>

      {/* BIG PROGRESS SECTION */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.04] border border-white/10 mb-10">

        <h2 className="text-xl font-bold mb-6">
          Student Progress Breakdown
        </h2>

        <div className="space-y-5">

          {data.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1 text-white/60">
                <span>{item.label}</span>
                <span>{item.value} students</span>
              </div>

              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(item.value / stats.totalStudents) * 100}%`,
                  }}
                  transition={{ duration: 0.8 }}
                  className={`h-3 rounded-full ${item.color}`}
                />
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* BOTTOM INSIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10">
          <h3 className="font-semibold mb-2">📈 Insight</h3>
          <p className="text-white/60 text-sm">
            Most students are actively engaged. Completion rate is strong,
            but there are still {stats.notStarted} students who need attention.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10">
          <h3 className="font-semibold mb-2">🎯 Recommendation</h3>
          <p className="text-white/60 text-sm">
            Consider sending reminders or additional support materials to
            improve completion rate and reduce inactive students.
          </p>
        </div>

      </div>

    </div>
  );
};

export default CourseProgress;