import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Submission = {
  id: string;
  student: string;
  task: string;
  type: "Quiz" | "Project";
  status: "Pending" | "Reviewed";
};

const MentorReviewQueue = () => {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "s1",
      student: "Neural Learner",
      task: "Async Patterns Quiz",
      type: "Quiz",
      status: "Pending",
    },
    {
      id: "s2",
      student: "AI Explorer",
      task: "Node.js API Project",
      type: "Project",
      status: "Pending",
    },
    {
      id: "s3",
      student: "Frontend Pro",
      task: "React Hooks Quiz",
      type: "Quiz",
      status: "Reviewed",
    },
  ]);

  const handleReview = (id: string, decision: "approve" | "reject") => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "Reviewed" } : s
      )
    );

    alert(`Submission ${decision}`);
  };

  return (
    <div className="p-6 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Review Queue</h1>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg"
        >
          Back
        </button>
      </div>

      {/* LIST */}
      <div className="mt-6 space-y-4">
        {submissions.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <h2 className="text-lg font-semibold">{item.task}</h2>

            <p className="text-sm text-gray-400">
              Student: {item.student}
            </p>

            <p className="text-sm text-gray-400">
              Type: {item.type}
            </p>

            <p
              className={`text-xs mt-2 ${
                item.status === "Pending"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {item.status}
            </p>

            {/* ACTIONS */}
            {item.status === "Pending" && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleReview(item.id, "approve")}
                  className="px-3 py-2 bg-green-500/20 text-green-300 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReview(item.id, "reject")}
                  className="px-3 py-2 bg-red-500/20 text-red-300 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorReviewQueue;