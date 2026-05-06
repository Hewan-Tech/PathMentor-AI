import { useParams, useNavigate } from "react-router-dom";

const students = [
  {
    id: "1",
    name: "Abel Tesfaye",
    email: "abel@gmail.com",
    grade: "B+",
    progress: 78,
    attendance: 85,
    quizAvg: 75,
    assignments: [
      { title: "Intro Project", score: 80 },
      { title: "Mid Exam", score: 75 },
      { title: "Final Project", score: 85 },
    ],
    courses: [
      { name: "React", progress: 80 },
      { name: "Node.js", progress: 70 },
      { name: "UI/UX", progress: 85 },
    ],
  },
  {
    id: "2",
    name: "Sara Mengistu",
    email: "sara@gmail.com",
    grade: "A",
    progress: 92,
    attendance: 96,
    quizAvg: 90,
    assignments: [
      { title: "Intro Project", score: 95 },
      { title: "Mid Exam", score: 90 },
      { title: "Final Project", score: 93 },
    ],
    courses: [
      { name: "React", progress: 95 },
      { name: "Node.js", progress: 90 },
      { name: "UI/UX", progress: 92 },
    ],
  },
];

const StudentProgress = () => {
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

  const performance =
    student.progress >= 85
      ? "Excellent"
      : student.progress >= 60
      ? "Good"
      : "At Risk";

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{student.name}</h1>
        <p className="text-white/60">{student.email}</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <div className="p-4 bg-white/5 rounded-xl">
          <p className="text-white/60">Overall Progress</p>
          <h2 className="text-2xl font-bold">{student.progress}%</h2>
        </div>

        <div className="p-4 bg-white/5 rounded-xl">
          <p className="text-white/60">Grade</p>
          <h2 className="text-2xl font-bold">{student.grade}</h2>
        </div>

        <div className="p-4 bg-white/5 rounded-xl">
          <p className="text-white/60">Attendance</p>
          <h2 className="text-2xl font-bold">{student.attendance}%</h2>
        </div>

        <div className="p-4 bg-white/5 rounded-xl">
          <p className="text-white/60">Performance</p>
          <h2 className="text-2xl font-bold">{performance}</h2>
        </div>

      </div>

      {/* COURSE PROGRESS */}
      <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
        <h2 className="text-xl font-bold mb-4">📚 Course Progress</h2>

        {student.courses.map((c, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between">
              <span>{c.name}</span>
              <span>{c.progress}%</span>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full mt-1">
              <div
                className="h-2 bg-[#33b6ff] rounded-full"
                style={{ width: `${c.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ASSIGNMENTS */}
      <div className="p-6 bg-white/5 rounded-xl border border-white/10">
        <h2 className="text-xl font-bold mb-4">📝 Assignments</h2>

        {student.assignments.map((a, i) => (
          <div
            key={i}
            className="flex justify-between p-3 bg-white/5 rounded-lg mb-2"
          >
            <span>{a.title}</span>
            <span className="font-bold">{a.score}%</span>
          </div>
        ))}
      </div>

      {/* WARNING */}
      {student.progress < 60 && (
        <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
          ⚠️ This student is at risk and needs attention
        </div>
      )}

    </div>
  );
};

export default StudentProgress;