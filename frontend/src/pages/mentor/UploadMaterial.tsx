import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UploadMaterial = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (type: "file" | "video") => {
    if (!title || !file) {
      alert("Please add title and select a file/video");
      return;
    }

    alert(`${type.toUpperCase()} uploaded successfully!`);
    navigate("/mentor/courses");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-10">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
      >
        ← Back
      </button>

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-5xl font-extrabold">
          Upload <span className="text-[#33b6ff]">Studio</span>
        </h1>
        <p className="text-white/60 mt-2">
          Upload course materials, videos, and resources for your students
        </p>
      </div>

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white/[0.04] border border-white/10 rounded-2xl p-8 space-y-6"
      >

        {/* TITLE INPUT */}
        <div>
          <label className="text-sm text-white/60">Material Title</label>
          <input
            type="text"
            placeholder="e.g. React Hooks Lecture"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-2 p-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#33b6ff] outline-none"
          />
        </div>

        {/* FILE INPUT */}
        <div>
          <label className="text-sm text-white/60">
            Select File or Video
          </label>
          <input
            type="file"
            accept="video/*,application/pdf"
            onChange={(e) =>
              setFile(e.target.files ? e.target.files[0] : null)
            }
            className="w-full mt-2 p-3 rounded-xl bg-white/5 border border-white/10"
          />
        </div>

        {/* PREVIEW */}
        {file && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-white/60 mb-2">
              Selected File:
            </p>
            <p className="font-semibold">{file.name}</p>

            {file.type.startsWith("video/") && (
              <video
                className="mt-4 w-full rounded-lg"
                controls
                src={URL.createObjectURL(file)}
              />
            )}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-4 pt-4">

          <button
            onClick={() => handleUpload("file")}
            className="py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold"
          >
            📄 Upload File
          </button>

          <button
            onClick={() => handleUpload("video")}
            className="py-3 rounded-xl bg-[#33b6ff] text-black font-bold hover:shadow-lg transition"
          >
            🎥 Upload Video
          </button>

        </div>

      </motion.div>
    </div>
  );
};

export default UploadMaterial;