import { useState } from "react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";

const CreateClass = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  const handleCreate = async () => {
    try {
      await api.post("/mentor/create-class", { title });
      navigate("/mentor/classes");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Create Class</h1>

      <input
        className="w-full p-3 bg-white/10 rounded mb-4"
        placeholder="Class Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <button
        onClick={handleCreate}
        className="bg-[#33b6ff] text-black px-6 py-2 rounded font-bold"
      >
        Create
      </button>
    </div>
  );
};

export default CreateClass;