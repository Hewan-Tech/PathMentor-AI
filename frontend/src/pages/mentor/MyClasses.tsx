import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "React Mastery",
    students: 120,
    progress: 70,
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
  },
  {
    id: 2,
    title: "Node.js Backend Development",
    students: 95,
    progress: 55,
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    students: 80,
    progress: 40,
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e",
  },
  {
    id: 4,
    title: "Data Structures & Algorithms",
    students: 150,
    progress: 85,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
];

const MyClasses = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/mentor/dashboard")}
        className="mb-6 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
      >
        ← Back to Dashboard
      </button>

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-8">
        My Classes
      </h1>

      {/* COURSES GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-[#33b6ff]/40 transition"
          >

            {/* IMAGE */}
            <div className="h-40 w-full overflow-hidden">
              <img
                src={course.image}
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-4">

              {/* TITLE */}
              <h2 className="text-xl font-semibold">
                {course.title}
              </h2>

              {/* STUDENTS */}
              <p className="text-white/60">
                👨‍🎓 {course.students} students enrolled
              </p>

              {/* PROGRESS BAR */}
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-[#33b6ff] h-2 rounded-full"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <p className="text-sm text-white/60">
                📈 Progress: {course.progress}%
              </p>

              {/* BUTTONS */}
              <div className="grid grid-cols-2 gap-3 pt-3">

                <button
  onClick={() => navigate("/mentor/upload")}
  className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition"
>
  📤 Upload Material
</button>

                <button
                  onClick={() =>
                    navigate("/mentor/course-students")
                  }
                  className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition"
                >
                  👨‍🎓 Students
                </button>

                <button
  onClick={() => navigate(`/mentor/course-analysis/${course.id}`)}
  className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition"
>
  📊 Analysis
</button>

                

              </div>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyClasses;