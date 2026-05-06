import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const mockStudents = [
  {
    id: 1,
    name: "Abel Tesfaye",
    email: "abel@gmail.com",
    progress: 78,
    grade: "B+",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Sara Mengistu",
    email: "sara@gmail.com",
    progress: 92,
    grade: "A",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Yonatan Bekele",
    email: "yonatan@gmail.com",
    progress: 55,
    grade: "C+",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: 4,
    name: "Liya Alem",
    email: "liya@gmail.com",
    progress: 88,
    grade: "A-",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 5,
    name: "Daniel Girma",
    email: "daniel@gmail.com",
    progress: 60,
    grade: "B",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    id: 6,
    name: "Mekdes Tadesse",
    email: "mekdes@gmail.com",
    progress: 73,
    grade: "B+",
    avatar: "https://i.pravatar.cc/150?img=18",
  },
  {
    id: 7,
    name: "Henok Desta",
    email: "henok@gmail.com",
    progress: 45,
    grade: "C",
    avatar: "https://i.pravatar.cc/150?img=20",
  },
  {
    id: 8,
    name: "Rahel Kebede",
    email: "rahel@gmail.com",
    progress: 95,
    grade: "A",
    avatar: "https://i.pravatar.cc/150?img=22",
  },
  {
    id: 9,
    name: "Samuel Worku",
    email: "samuel@gmail.com",
    progress: 68,
    grade: "B",
    avatar: "https://i.pravatar.cc/150?img=25",
  },
  {
    id: 10,
    name: "Hana Solomon",
    email: "hana@gmail.com",
    progress: 82,
    grade: "A-",
    avatar: "https://i.pravatar.cc/150?img=30",
  },
];

const CourseStudents = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold mb-8">
        Students in This Course
      </h1>

      <div className="grid gap-6">
        {mockStudents.map((student) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 flex justify-between items-center"
          >

            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">

              {/* AVATAR */}
              <img
                src={student.avatar}
                alt={student.name}
                className="w-14 h-14 rounded-full object-cover border border-white/10"
              />

              <div>
                <h2 className="text-lg font-semibold">
                  {student.name}
                </h2>
                <p className="text-white/60 text-sm">
                  {student.email}
                </p>

                {/* PROGRESS BAR */}
                <div className="w-52 mt-2 bg-white/10 h-2 rounded-full">
                  <div
                    className="h-2 bg-[#33b6ff] rounded-full"
                    style={{ width: `${student.progress}%` }}
                  />
                </div>

                <p className="text-xs text-white/60 mt-1">
                  {student.progress}% complete
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex gap-3">

              <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">
                📊 Grade ({student.grade})
              </button>

              <button
  onClick={() => navigate(`/mentor/student-progress/${student.id}`)}
  className="
    w-full sm:w-auto
    px-4 py-2 rounded-lg
    bg-[#33b6ff] text-black font-bold
    hover:shadow-lg active:scale-95
    transition text-sm
  "
>
  📈 Progress
</button>

            </div>

          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CourseStudents;