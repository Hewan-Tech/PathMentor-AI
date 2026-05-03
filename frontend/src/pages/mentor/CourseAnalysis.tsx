import { useParams, useNavigate } from "react-router-dom";

const CourseAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // MOCK DATABASE (replace later with backend)
  const courses: any = {
    c1: {
      title: "React Fundamentals",
      students: 45,
      active: 38,
      progress: 78,
      completion: 72,
      dropOff: 15,
      quizzes: 8,
    },
    c2: {
      title: "Node.js Essentials",
      students: 32,
      active: 20,
      progress: 62,
      completion: 55,
      dropOff: 28,
      quizzes: 6,
    },
    c3: {
      title: "UI/UX Design Basics",
      students: 28,
      active: 12,
      progress: 35,
      completion: 22,
      dropOff: 40,
      quizzes: 4,
    },
    c4: {
      title: "Fullstack Roadmap",
      students: 60,
      active: 55,
      progress: 90,
      completion: 88,
      dropOff: 8,
      quizzes: 12,
    },
  };

  const course = courses[id || ""];

  if (!course) {
    return (
      <div className="p-6 text-white">
        <h2>Course not found</h2>
        <button
          onClick={() => navigate("/mentor/classes")}
          className="mt-4 px-4 py-2 bg-blue-500/20 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const health =
    course.progress > 80
      ? "Excellent"
      : course.progress > 50
      ? "Good"
      : "Needs Improvement";

  const suggestion =
    course.dropOff > 25
      ? "Add quizzes + interactive content to reduce drop-off"
      : "Increase advanced lessons and projects";

  return (
    <div className="p-6 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{course.title} Analysis</h1>

        <button
          onClick={() => navigate("/mentor/classes")}
          className="px-4 py-2 bg-red-500/20 rounded"
        >
          Back
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

        {/* STUDENTS */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <h2 className="font-semibold">Students</h2>
          <p>Total: {course.students}</p>
          <p>Active: {course.active}</p>
        </div>

        {/* PROGRESS */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <h2 className="font-semibold">Progress</h2>
          <p>{course.progress}% Avg Progress</p>

          <div className="w-full h-2 bg-white/10 mt-2 rounded">
            <div
              className="h-2 bg-green-500 rounded"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* ENGAGEMENT */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <h2 className="font-semibold">Engagement</h2>
          <p>Drop-off: {course.dropOff}%</p>
          <p>Quizzes: {course.quizzes}</p>
        </div>

      </div>

      {/* INSIGHTS */}
      <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
        <h2 className="font-semibold">Course Health</h2>
        <p className="text-blue-400">{health}</p>
      </div>

      <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
        <h2 className="font-semibold">AI Suggestion</h2>
        <p className="text-gray-300">{suggestion}</p>
      </div>
    </div>
  );
};

export default CourseAnalysis;