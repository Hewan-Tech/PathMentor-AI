import { useState } from "react";
import { Upload, FileText, Video, Plus, FolderPlus } from "lucide-react";

const MentorContentManager = () => {
  const [modules, setModules] = useState([
    {
      id: 1,
      name: "Module 1 - Introduction",
      videos: ["Intro to React.mp4"],
      files: ["React Basics.pdf"],
    },
    {
      id: 2,
      name: "Module 2 - Components",
      videos: [],
      files: [],
    },
  ]);

  const [newModule, setNewModule] = useState("");

  const addModule = () => {
    if (!newModule.trim()) return;

    setModules([
      ...modules,
      {
        id: Date.now(),
        name: newModule,
        videos: [],
        files: [],
      },
    ]);

    setNewModule("");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Content Manager</h1>
        <p className="text-sm text-muted-foreground">
          Organize your course into modules, upload videos and materials
        </p>
      </div>

      {/* Add Module */}
      <div className="flex gap-2 mb-6">
        <input
          value={newModule}
          onChange={(e) => setNewModule(e.target.value)}
          placeholder="New Module Name (e.g. Week 1 - Basics)"
          className="flex-1 p-2 rounded bg-muted"
        />
        <button
          onClick={addModule}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FolderPlus size={16} /> Add Module
        </button>
      </div>

      {/* Modules */}
      <div className="grid gap-4">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="p-5 bg-card border border-white/5 rounded-xl"
          >
            {/* Module Title */}
            <h2 className="font-bold text-lg mb-4">{mod.name}</h2>

            {/* Videos */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Video size={16} /> Videos
              </h3>

              {mod.videos.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No videos uploaded yet
                </p>
              ) : (
                mod.videos.map((v, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    {v}
                  </p>
                ))
              )}

              <button className="mt-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded flex items-center gap-1">
                <Upload size={14} /> Upload Video
              </button>
            </div>

            {/* Files */}
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <FileText size={16} /> Materials
              </h3>

              {mod.files.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No files uploaded yet
                </p>
              ) : (
                mod.files.map((f, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    {f}
                  </p>
                ))
              )}

              <button className="mt-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded flex items-center gap-1">
                <Upload size={14} /> Upload PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorContentManager;