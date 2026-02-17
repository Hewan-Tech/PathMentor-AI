import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    track: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH STUDENT ================= */
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get(`/admin/students/${id}`);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          track: res.data.track || "",
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  /* ================= UPDATE ================= */
  const updateStudent = async () => {
    try {
      setSaving(true);
      await api.put(`/admin/students/${id}`, form);
      navigate("/admin/students");
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="text-white text-center mt-20">
        Loading student data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Student</h1>

        <button
          onClick={() => navigate("/admin/students")}
          className="bg-slate-800 px-4 py-2 rounded-lg text-sm"
        >
          ← Back
        </button>
      </div>

      {/* FORM CARD */}
      <div className="max-w-xl bg-slate-900 p-6 rounded-xl shadow flex flex-col gap-4">
        
        {/* NAME */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Full Name</label>
          <input
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="bg-slate-800 p-2 rounded outline-none"
          />
        </div>

        {/* EMAIL */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Email</label>
          <input
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="bg-slate-800 p-2 rounded outline-none"
          />
        </div>

        {/* TRACK */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Track</label>
          <input
            value={form.track}
            onChange={(e) =>
              setForm({ ...form, track: e.target.value })
            }
            className="bg-slate-800 p-2 rounded outline-none"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={updateStudent}
          disabled={saving}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded mt-2 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditStudent;
