import { useEffect, useState } from "react";
import api from "@/services/api";

const AdminAssessments = () => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await api.get("/admin/assessments");
        setAssessments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assessments</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold">
          Create New Quiz
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 text-gray-400 border-b border-slate-700">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Track</th>
              <th className="p-4">Questions</th>
              <th className="p-4">Duration</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((test) => (
              <tr key={test._id} className="border-b border-slate-800 hover:bg-slate-800/30">
                <td className="p-4 font-medium">{test.title}</td>
                <td className="p-4">
                  <span className="bg-slate-700 px-2 py-1 rounded text-xs">{test.track}</span>
                </td>
                <td className="p-4 text-gray-400">{test.questions?.length || 0} Qs</td>
                <td className="p-4 text-gray-400">{test.duration} mins</td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button className="text-blue-400 hover:text-blue-300">View</button>
                    <button className="text-amber-500 hover:text-amber-400">Edit</button>
                    <button className="text-rose-500 hover:text-rose-400">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {assessments.length === 0 && <p className="p-10 text-center text-gray-500">No assessments created yet.</p>}
      </div>
    </div>
  );
};

export default AdminAssessments;