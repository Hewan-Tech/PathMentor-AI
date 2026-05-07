import { useParams, useNavigate } from "react-router-dom";

const CourseAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <button
        onClick={() => navigate("/mentor/courses")}
        className="mb-6 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-4">
        📊 Course Analysis
      </h1>

      <p className="text-white/60 mb-6">
        Analyzing course ID: <span className="text-white">{id}</span>
      </p>

      {/* EXAMPLE ANALYTICS */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="p-4 bg-white/5 rounded-xl">
          📈 Completion Rate
          <h2 className="text-2xl font-bold">72%</h2>
        </div>

        <div className="p-4 bg-white/5 rounded-xl">
          👨‍🎓 Active Students
          <h2 className="text-2xl font-bold">98</h2>
        </div>

        <div className="p-4 bg-white/5 rounded-xl">
          ⏱ Avg Watch Time
          <h2 className="text-2xl font-bold">4h 20m</h2>
        </div>

      </div>
    </div>
  );
};

export default CourseAnalysis;