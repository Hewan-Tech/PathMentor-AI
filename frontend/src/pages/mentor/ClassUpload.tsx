import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ClassUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [files, setFiles] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const handleFileChange = (e: any) => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const handleVideoChange = (e: any) => {
    setVideos([...videos, ...Array.from(e.target.files)]);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-2">
        Upload Content for Class: {id}
      </h1>

      <p className="text-gray-400 mb-6">
        Add files, videos, and learning materials
      </p>

      {/* FILE UPLOAD */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-4">
        <h2 className="font-semibold mb-2">Upload Files (PDF, Docs)</h2>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm"
        />

        <div className="mt-3 space-y-1 text-gray-300">
          {files.map((file, i) => (
            <p key={i}>📄 {file.name}</p>
          ))}
        </div>
      </div>

      {/* VIDEO UPLOAD */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-4">
        <h2 className="font-semibold mb-2">Upload Videos</h2>

        <input
          type="file"
          accept="video/*"
          multiple
          onChange={handleVideoChange}
          className="block w-full text-sm"
        />

        <div className="mt-3 space-y-1 text-gray-300">
          {videos.map((video, i) => (
            <p key={i}>🎥 {video.name}</p>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={() => alert("Saved (frontend only)")}
          className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg"
        >
          Save Content
        </button>

        <button
          onClick={() => navigate("/mentor/classes")}
          className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ClassUpload;