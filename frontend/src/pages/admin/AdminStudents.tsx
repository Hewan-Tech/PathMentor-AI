import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

const AdminStudents = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const pageSize = 5;

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/students");
        const mentorRes = await api.get("/admin/mentors");

        setStudents(res.data);
        setMentors(mentorRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= SEARCH ================= */
  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= PAGINATION ================= */
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  /* ================= ACTIONS ================= */

  const deleteStudent = async (id: string) => {
    if (!confirm("Delete this student?")) return;

    await api.delete(`/admin/students/${id}`);
    setStudents((prev) => prev.filter((s) => s._id !== id));
  };

  const assignMentor = async (studentId: string, mentorId: string) => {
    await api.put(`/admin/assign-mentor`, {
      studentId,
      mentorId,
    });

    setStudents((prev) =>
      prev.map((s) =>
        s._id === studentId ? { ...s, mentor: mentorId } : s
      )
    );
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Students</h1>

        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-900 px-4 py-2 rounded-lg outline-none"
        />
      </div>

      {/* TABLE */}
<div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
  <table className="w-full text-sm">
    <thead className="text-gray-400 border-b border-slate-700">
      <tr>
        <th className="text-left py-4 px-2">Name</th>
        <th className="text-left py-4 px-2">Email</th>
        <th className="text-left py-4 px-2">Track</th>
        <th className="text-left py-4 px-2">Mentor</th>
        <th className="text-left py-4 px-2">Status</th>
        <th className="text-center py-4 px-2 w-48">Actions</th> {/* Added width */}
      </tr>
    </thead>

    <tbody>
      {paginated.map((student) => (
        <tr key={student._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
          <td className="py-4 px-2 font-medium">{student.name}</td>
          <td className="py-4 px-2 text-gray-400">{student.email}</td>
          <td className="py-4 px-2">{student.track || "Frontend"}</td>
          <td className="py-4 px-2">
            <select
              value={student.mentor || ""}
              onChange={(e) => assignMentor(student._id, e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs px-2 py-1 rounded outline-none focus:border-blue-500"
            >
              <option value="">Assign Mentor</option>
              {mentors.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </td>
          <td className="py-4 px-2">
            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-[10px] uppercase font-bold">
              Active
            </span>
          </td>
          <td className="py-4 px-2">
            <div className="flex justify-center gap-2">
              <button
                onClick={() => navigate(`/admin/students/edit/${student._id}`)}
                className="bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-white px-3 py-1 rounded transition-all text-xs font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => deleteStudent(student._id)}
                className="bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white px-3 py-1 rounded transition-all text-xs font-medium"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        {/* EMPTY */}
        {paginated.length === 0 && (
          <p className="text-gray-400 mt-4">No students found</p>
        )}

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="bg-slate-800 px-4 py-2 rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-slate-800 px-4 py-2 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
   
  );
};

export default AdminStudents;
