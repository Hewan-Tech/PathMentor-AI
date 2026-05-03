import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const MentorTaskBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quizTitle, setQuizTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");

  const [questions, setQuestions] = useState<string[]>([]);

  const addQuestion = () => {
    if (question.trim()) {
      setQuestions([...questions, question]);
      setQuestion("");
    }
  };

  return (
    <div className="p-6 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Assign Task → {id}
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg"
        >
          Back
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        {/* QUIZ SECTION */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <h2 className="text-lg font-semibold mb-3">Create Quiz</h2>

          <input
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Quiz Title"
            className="w-full p-2 mb-3 bg-black/20 border border-white/10 rounded"
          />

          <div className="flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Add question"
              className="w-full p-2 bg-black/20 border border-white/10 rounded"
            />

            <button
              onClick={addQuestion}
              className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded"
            >
              Add
            </button>
          </div>

          <div className="mt-3 space-y-1 text-gray-300">
            {questions.map((q, i) => (
              <p key={i}>• {q}</p>
            ))}
          </div>

          <button
            onClick={() => alert("Quiz saved (frontend only)")}
            className="mt-4 px-4 py-2 bg-green-500/20 text-green-300 rounded"
          >
            Save Quiz
          </button>
        </div>

        {/* PROJECT SECTION */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <h2 className="text-lg font-semibold mb-3">Assign Project</h2>

          <input
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="Project Title"
            className="w-full p-2 mb-3 bg-black/20 border border-white/10 rounded"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project Description"
            className="w-full p-2 h-24 bg-black/20 border border-white/10 rounded"
          />

          <button
            onClick={() => alert("Project assigned (frontend only)")}
            className="mt-4 px-4 py-2 bg-purple-500/20 text-purple-300 rounded"
          >
            Assign Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorTaskBuilder;