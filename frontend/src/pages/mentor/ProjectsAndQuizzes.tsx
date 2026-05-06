import { useState } from "react";
import { motion } from "framer-motion";

/* ================= MAIN COMPONENT ================= */

const ProjectsAndQuizzes = () => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const [projects, setProjects] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);

  const addProject = (project: any) => {
    setProjects([...projects, project]);
    setShowProjectModal(false);
  };

  const addQuiz = (quiz: any) => {
    setQuizzes([...quizzes, quiz]);
    setShowQuizModal(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold">Projects & Quizzes</h1>
          <p className="text-white/50 mt-1">
            Create assignments and evaluate your students
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowProjectModal(true)}
            className="px-5 py-3 bg-[#33b6ff] text-black rounded-xl font-bold hover:scale-105 transition"
          >
            + Project
          </button>

          <button
            onClick={() => setShowQuizModal(true)}
            className="px-5 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
          >
            + Quiz
          </button>
        </div>
      </div>

      {/* ================= PROJECTS ================= */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Projects</h2>

        {projects.length === 0 ? (
          <EmptyState text="No projects yet" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden"
              >
                <img
                  src={p.image || "https://images.unsplash.com/photo-1518779578993-ec3579fee39f"}
                  className="h-40 w-full object-cover"
                />

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <p className="text-sm text-white/60">{p.description}</p>

                  <div className="flex justify-between items-center text-xs text-white/50 mt-3">
                    <span>Deadline: {p.deadline}</span>
                    <span className="px-2 py-1 bg-[#33b6ff]/20 rounded">
                      Active
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ================= QUIZZES ================= */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Quizzes</h2>

        {quizzes.length === 0 ? (
          <EmptyState text="No quizzes yet" />
        ) : (
          <div className="space-y-4">
            {quizzes.map((q, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01 }}
                className="p-5 bg-white/[0.04] border border-white/10 rounded-xl"
              >
                <h3 className="font-semibold">{q.question}</h3>

                <div className="mt-2 text-sm text-white/60">
                  Answer: <span className="text-white">{q.answer}</span>
                </div>

                <div className="mt-3 text-xs text-[#33b6ff]">
                  Multiple Choice
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* MODALS */}
      {showProjectModal && (
        <Modal onClose={() => setShowProjectModal(false)}>
          <ProjectForm onSubmit={addProject} />
        </Modal>
      )}

      {showQuizModal && (
        <Modal onClose={() => setShowQuizModal(false)}>
          <QuizForm onSubmit={addQuiz} />
        </Modal>
      )}
    </div>
  );
};

/* ================= EMPTY STATE ================= */

const EmptyState = ({ text }: any) => (
  <div className="flex flex-col items-center justify-center py-16 text-white/40">
    <div className="text-6xl mb-4">📂</div>
    <p>{text}</p>
  </div>
);

/* ================= MODAL ================= */

const Modal = ({ children, onClose }: any) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-[#0b1220] p-6 rounded-xl w-full max-w-md relative border border-white/10"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white/60"
      >
        ✖
      </button>

      {children}
    </motion.div>
  </div>
);

/* ================= PROJECT FORM ================= */

const ProjectForm = ({ onSubmit }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState("");

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">New Project</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input"
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="input"
      />

      <input
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="input"
      />

      <button
        onClick={() =>
          onSubmit({ title, description, deadline, image })
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
        className="input"
      />

      <input
        placeholder="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="input"
      />

      <button
        onClick={() => onSubmit({ question, answer })}
        className="w-full py-2 bg-[#33b6ff] text-black rounded"
      >
        Create Quiz
      </button>
    </div>
  );
};

export default ProjectsAndQuizzes;