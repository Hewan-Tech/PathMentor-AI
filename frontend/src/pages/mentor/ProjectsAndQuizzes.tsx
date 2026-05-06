import { useState } from "react";
import { motion } from "framer-motion";

/* ================= MAIN COMPONENT ================= */

const ProjectsAndQuizzes = () => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const [projects, setProjects] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);

  /* ================= HANDLERS ================= */

  const addProject = (project: any) => {
    setProjects([...projects, project]);
    setShowProjectModal(false);
  };

  const addQuiz = (quiz: any) => {
    setQuizzes([...quizzes, quiz]);
    setShowQuizModal(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">

      <h1 className="text-4xl font-bold mb-6">
        Projects & Quizzes
      </h1>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setShowProjectModal(true)}
          className="px-5 py-3 bg-[#33b6ff] text-black rounded-xl font-bold"
        >
          ➕ Add Project
        </button>

        <button
          onClick={() => setShowQuizModal(true)}
          className="px-5 py-3 bg-white/10 rounded-xl"
        >
          ➕ Add Quiz
        </button>
      </div>

      {/* ================= PROJECT LIST ================= */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>

        {projects.length === 0 && (
          <p className="text-white/50">No projects yet</p>
        )}

        <div className="space-y-3">
          {projects.map((p, i) => (
            <div
              key={i}
              className="p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <h3 className="font-bold">{p.title}</h3>
              <p className="text-sm text-white/60">{p.description}</p>
              <p className="text-xs text-white/40 mt-1">
                Deadline: {p.deadline}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= QUIZ LIST ================= */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quizzes</h2>

        {quizzes.length === 0 && (
          <p className="text-white/50">No quizzes yet</p>
        )}

        <div className="space-y-3">
          {quizzes.map((q, i) => (
            <div
              key={i}
              className="p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <h3 className="font-bold">{q.question}</h3>
              <p className="text-sm text-white/60">
                Answer: {q.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PROJECT MODAL ================= */}
      {showProjectModal && (
        <Modal onClose={() => setShowProjectModal(false)}>
          <ProjectForm onSubmit={addProject} />
        </Modal>
      )}

      {/* ================= QUIZ MODAL ================= */}
      {showQuizModal && (
        <Modal onClose={() => setShowQuizModal(false)}>
          <QuizForm onSubmit={addQuiz} />
        </Modal>
      )}
    </div>
  );
};

/* ================= MODAL ================= */

const Modal = ({ children, onClose }: any) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-[#0b1220] p-6 rounded-xl w-full max-w-md relative">

      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white/60"
      >
        ✖
      </button>

      {children}
    </div>
  </div>
);

/* ================= PROJECT FORM ================= */

const ProjectForm = ({ onSubmit }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">New Project</h2>

      <input
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 bg-white/10 rounded"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 bg-white/10 rounded"
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="w-full p-2 bg-white/10 rounded"
      />

      <button
        onClick={() =>
          onSubmit({ title, description, deadline })
        }
        className="w-full py-2 bg-[#33b6ff] text-black rounded"
      >
        Create Project
      </button>
    </div>
  );
};

/* ================= QUIZ FORM ================= */

const QuizForm = ({ onSubmit }: any) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">New Quiz</h2>

      <input
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-2 bg-white/10 rounded"
      />

      <input
        placeholder="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full p-2 bg-white/10 rounded"
      />

      <button
        onClick={() =>
          onSubmit({ question, answer })
        }
        className="w-full py-2 bg-[#33b6ff] text-black rounded"
      >
        Create Quiz
      </button>
    </div>
  );
};

export default ProjectsAndQuizzes;