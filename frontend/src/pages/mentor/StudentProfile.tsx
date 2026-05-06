import { useParams, useNavigate } from "react-router-dom";

const students = [
  {
    id: "1",
    name: "Abel Tesfaye",
    email: "abel@gmail.com",
    grade: "B+",
    progress: 78,
    assignments: [
      { title: "Intro Project", score: 80 },
      { title: "Mid Exam", score: 75 },
      { title: "Final Project", score: 85 },
    ],
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Sara Mengistu",
    email: "sara@gmail.com",
    grade: "A",
    progress: 92,
    assignments: [
      { title: "Intro Project", score: 95 },
      { title: "Mid Exam", score: 90 },
      { title: "Final Project", score: 93 },
    ],
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = students.find((s) => s.id === id);

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#020617]">
        Student not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-white/10 rounded-lg"
      >
        ← Back
      </button>

      {/* HEADER */}
      <div className="flex items-center gap-5 mb-8">
        <img
          src={student.avatar}
          className="w-20 h-20 rounded-full"
        />

        <div>
          <h1 className="text-3xl font-bold">
            {student.name}
          </h1>
          <p className="text-white/60">{student.email}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="p-5 bg-white/5 rounded-xl">
          <h3 className="text-sm text-white/60">Grade</h3>
          <p className="text-2xl font-bold">{student.grade}</p>
        </div>

        <div className="p-5 bg-white/5 rounded-xl">
          <h3 className="text-sm text-white/60">Progress</h3>
          <p className="text-2xl font-bold">{student.progress}%</p>
        </div>

        <div className="p-5 bg-white/5 rounded-xl">
          <h3 className="text-sm text-white/60">Performance</h3>
          <p className="text-2xl font-bold">
            {student.progress > 80 ? "Excellent" : "Average"}
          </p>
        </div>

      </div>

      {/* ASSIGNMENTS */}
      <div className="p-6 bg-white/[0.04] border border-white/10 rounded-xl">
        <h2 className="text-xl font-bold mb-4">
          Assignment Results
        </h2>

        <div className="space-y-3">
          {student.assignments.map((a, i) => (
            <div
              key={i}
              className="flex justify-between bg-white/5 p-3 rounded-lg"
            >
              <span>{a.title}</span>
              <span className="font-bold">{a.score}%</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default StudentProfile;