import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, BarChart3, Users, BookOpen } from "lucide-react";

type ClassType = {
  id: string;
  title: string;
  students: number;
  lessons: number;
  status: string;
  progress: number;
};

const MyClasses = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);

  const classes: ClassType[] = [
    {
      id: "c1",
      title: "React Fundamentals",
      students: 45,
      lessons: 12,
      status: "Active",
      progress: 78,
    },
    {
      id: "c2",
      title: "Node.js Essentials",
      students: 32,
      lessons: 10,
      status: "Active",
      progress: 62,
    },
    {
      id: "c3",
      title: "UI/UX Design Basics",
      students: 28,
      lessons: 8,
      status: "Draft",
      progress: 35,
    },
    {
      id: "c4",
      title: "Fullstack Roadmap",
      students: 60,
      lessons: 18,
      status: "Active",
      progress: 90,
    },
  ];

  return (
    <div className="p-6 text-white">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">My Classes</h1>

      {/* CLASS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
          >
            {/* TITLE */}
            <h2 className="text-lg font-semibold">{cls.title}</h2>

            {/* STATS */}
            <div className="flex gap-4 mt-3 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <Users size={14} /> {cls.students}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={14} /> {cls.lessons}
              </span>
            </div>

            {/* STATUS + PROGRESS */}
            <div className="mt-3 flex items-center justify-between">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  cls.status === "Active"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {cls.status}
              </span>

              <span className="text-xs text-gray-400">
                {cls.progress}% complete
              </span>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-2 bg-white/10 rounded mt-2">
              <div
                className="h-2 bg-blue-500 rounded"
                style={{ width: `${cls.progress}%` }}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-4">
              {/* VIEW (SAFE LOCAL UI) */}
              <button
                onClick={() => setSelectedClass(cls)}
                className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 w-full justify-center"
              >
                <Eye size={14} /> View
              </button>

              {/* ANALYSIS → NEW PAGE */}
              <button
                onClick={() => navigate(`/mentor/analysis/${cls.id}`)}
                className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 w-full justify-center"
              >
                <BarChart3 size={14} /> Analysis
              </button>

              {/* UPLOAD → NEW PAGE */}
              <button
                onClick={() => navigate(`/mentor/upload/${cls.id}`)}
                className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 w-full justify-center"
              >
                Upload
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW PANEL */}
      {selectedClass && (
        <div className="mt-6 p-5 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold">{selectedClass.title}</h2>

          <div className="mt-3 text-gray-300 space-y-1">
            <p>Students: {selectedClass.students}</p>
            <p>Lessons: {selectedClass.lessons}</p>
            <p>Status: {selectedClass.status}</p>
            <p>Progress: {selectedClass.progress}%</p>
          </div>

          <button
            onClick={() => setSelectedClass(null)}
            className="mt-4 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default MyClasses;