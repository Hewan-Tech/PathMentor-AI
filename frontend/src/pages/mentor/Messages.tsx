import { useLocation } from "react-router-dom";

const mockMessages = [
  {
    id: 1,
    student: "Abel Tesfaye",
    message: "Can you review my project?",
    unread: true,
  },
  {
    id: 2,
    student: "Selam Worku",
    message: "I have a question about Node.js",
    unread: false,
  },
];

const Messages = () => {
  const query = new URLSearchParams(useLocation().search);
  const filter = query.get("filter");

  const filteredMessages =
    filter === "unread"
      ? mockMessages.filter((m) => m.unread)
      : mockMessages;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        {filter === "unread" ? "Unread Messages" : "All Messages"}
      </h1>

      <div className="space-y-4">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded-xl border ${
              msg.unread
                ? "bg-[#33b6ff]/10 border-[#33b6ff]"
                : "bg-white/[0.04] border-white/10"
            }`}
          >
            <h3 className="font-semibold">{msg.student}</h3>
            <p className="text-white/70 text-sm">{msg.message}</p>

            {msg.unread && (
              <span className="text-xs text-[#33b6ff]">Unread</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;