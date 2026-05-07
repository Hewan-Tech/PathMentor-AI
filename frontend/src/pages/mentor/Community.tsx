import { useState } from "react";
import { Users, MessageCircle, BookOpen, Calendar, ThumbsUp, Search, Plus, Heart } from "lucide-react";

const Community = () => {
  const [activeTab, setActiveTab] = useState("discussions");
  const [searchQuery, setSearchQuery] = useState("");
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const discussions = [
    {
      id: 1,
      author: "Sarah Chen",
      avatar: "https://i.pravatar.cc/100?img=1",
      title: "Best practices for teaching React hooks",
      category: "Teaching",
      replies: 24,
      likes: 156,
      date: "2 hours ago",
    },
    {
      id: 2,
      author: "James Wilson",
      avatar: "https://i.pravatar.cc/100?img=2",
      title: "How to handle difficult students?",
      category: "Students",
      replies: 18,
      likes: 98,
      date: "4 hours ago",
    },
    {
      id: 3,
      author: "Maria Garcia",
      avatar: "https://i.pravatar.cc/100?img=3",
      title: "New course creation tips and tricks",
      category: "Courses",
      replies: 32,
      likes: 203,
      date: "1 day ago",
    },
    {
      id: 4,
      author: "Alex Kumar",
      avatar: "https://i.pravatar.cc/100?img=4",
      title: "Tools for creating better course materials",
      category: "Resources",
      replies: 15,
      likes: 87,
      date: "2 days ago",
    },
  ];

  const mentors = [
    {
      id: 1,
      name: "Emily Rodriguez",
      avatar: "https://i.pravatar.cc/100?img=5",
      specialty: "Web Development",
      students: 250,
      rating: 4.9,
      connected: false,
    },
    {
      id: 2,
      name: "David Lee",
      avatar: "https://i.pravatar.cc/100?img=6",
      specialty: "Data Science",
      students: 180,
      rating: 4.8,
      connected: true,
    },
    {
      id: 3,
      name: "Lisa Anderson",
      avatar: "https://i.pravatar.cc/100?img=7",
      specialty: "UI/UX Design",
      students: 160,
      rating: 4.9,
      connected: false,
    },
    {
      id: 4,
      name: "Tom Bradley",
      avatar: "https://i.pravatar.cc/100?img=8",
      specialty: "Mobile Development",
      students: 220,
      rating: 4.7,
      connected: true,
    },
  ];

  const resources = [
    {
      id: 1,
      title: "Complete React Course Template",
      author: "Sarah Chen",
      downloads: 452,
      rating: 4.8,
      category: "Templates",
    },
    {
      id: 2,
      title: "Student Assessment Rubric",
      author: "James Wilson",
      downloads: 328,
      rating: 4.6,
      category: "Tools",
    },
    {
      id: 3,
      title: "Video Production Guide for Mentors",
      author: "Maria Garcia",
      downloads: 521,
      rating: 4.9,
      category: "Guides",
    },
    {
      id: 4,
      title: "Engagement Tracking Spreadsheet",
      author: "Alex Kumar",
      downloads: 196,
      rating: 4.5,
      category: "Tools",
    },
  ];

  const events = [
    {
      id: 1,
      title: "Monthly Mentor Meetup",
      date: "May 15, 2026",
      time: "7:00 PM",
      attendees: 45,
      type: "Networking",
    },
    {
      id: 2,
      title: "Advanced Teaching Techniques Workshop",
      date: "May 22, 2026",
      time: "2:00 PM",
      attendees: 62,
      type: "Workshop",
    },
    {
      id: 3,
      title: "Q&A: Student Retention Strategies",
      date: "May 29, 2026",
      time: "6:00 PM",
      attendees: 38,
      type: "Q&A",
    },
  ];

  const qaItems = [
    {
      id: 1,
      question: "What's the best way to structure a 12-week course?",
      author: "Tom Bradley",
      answers: 8,
      views: 234,
      votes: 12,
    },
    {
      id: 2,
      question: "How to motivate students who are falling behind?",
      author: "Lisa Anderson",
      answers: 15,
      views: 456,
      votes: 28,
    },
    {
      id: 3,
      question: "Certificate programs vs individual courses - pros and cons?",
      author: "David Lee",
      answers: 6,
      views: 189,
      votes: 9,
    },
  ];

  const toggleLike = (id: number) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
        activeTab === id
          ? "bg-[#33b6ff] text-black font-semibold"
          : "bg-slate-700 text-slate-100 hover:bg-slate-600"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mentor Community</h1>
          <p className="text-slate-400">Connect, share, and grow with thousands of mentors</p>
        </div>

        {/* SEARCH */}
        <div className="mb-8 flex gap-2">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search discussions, resources, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-[#33b6ff]"
            />
          </div>
          <button className="px-6 py-2 bg-[#33b6ff] text-black font-semibold rounded-lg hover:shadow-lg transition flex items-center gap-2">
            <Plus size={18} />
            New Post
          </button>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-900 p-4 rounded-xl border border-slate-700">
          <TabButton id="discussions" label="Discussions" icon={MessageCircle} />
          <TabButton id="mentors" label="Mentor Network" icon={Users} />
          <TabButton id="resources" label="Resources" icon={BookOpen} />
          <TabButton id="events" label="Events" icon={Calendar} />
          <TabButton id="qa" label="Q&A" icon={MessageCircle} />
        </div>

        {/* DISCUSSIONS TAB */}
        {activeTab === "discussions" && (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div key={discussion.id} className="p-6 bg-slate-900 border border-slate-700 rounded-xl hover:border-[#33b6ff] transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <img src={discussion.avatar} alt={discussion.author} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{discussion.title}</h3>
                        <span className="px-2 py-1 bg-[#33b6ff]/20 text-[#33b6ff] text-xs rounded-full">{discussion.category}</span>
                      </div>
                      <p className="text-sm text-slate-400">by {discussion.author} • {discussion.date}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={16} />
                    <span>{discussion.replies} replies</span>
                  </div>
                  <button
                    onClick={() => toggleLike(discussion.id)}
                    className="flex items-center gap-2 hover:text-[#33b6ff] transition"
                  >
                    <Heart size={16} fill={liked[discussion.id] ? "currentColor" : "none"} />
                    <span>{discussion.likes + (liked[discussion.id] ? 1 : 0)} likes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MENTOR NETWORK TAB */}
        {activeTab === "mentors" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="p-6 bg-slate-900 border border-slate-700 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <img src={mentor.avatar} alt={mentor.name} className="w-16 h-16 rounded-full" />
                    <div>
                      <h3 className="font-semibold text-lg">{mentor.name}</h3>
                      <p className="text-slate-400 text-sm">{mentor.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-400">★ {mentor.rating}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{mentor.students} students</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className={`w-full py-2 rounded-lg font-semibold transition ${
                    mentor.connected
                      ? "bg-slate-700 text-slate-100 hover:bg-slate-600"
                      : "bg-[#33b6ff] text-black hover:shadow-lg"
                  }`}
                >
                  {mentor.connected ? "Connected" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === "resources" && (
          <div className="space-y-4">
            {resources.map((resource) => (
              <div key={resource.id} className="p-6 bg-slate-900 border border-slate-700 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{resource.title}</h3>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">{resource.category}</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">by {resource.author}</p>
                    <div className="flex gap-6 text-slate-400 text-sm">
                      <span>⬇️ {resource.downloads} downloads</span>
                      <span>★ {resource.rating} rating</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#33b6ff] text-black font-semibold rounded-lg hover:shadow-lg transition">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === "events" && (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="p-6 bg-slate-900 border border-slate-700 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">{event.type}</span>
                    </div>
                    <div className="flex gap-4 text-slate-400 text-sm mb-4">
                      <span>📅 {event.date}</span>
                      <span>🕐 {event.time}</span>
                      <span>👥 {event.attendees} attending</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#33b6ff] text-black font-semibold rounded-lg hover:shadow-lg transition">
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Q&A TAB */}
        {activeTab === "qa" && (
          <div className="space-y-4">
            {qaItems.map((item) => (
              <div key={item.id} className="p-6 bg-slate-900 border border-slate-700 rounded-xl">
                <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
                <p className="text-sm text-slate-400 mb-4">asked by {item.author}</p>
                <div className="flex gap-6 text-slate-400 text-sm">
                  <span>💬 {item.answers} answers</span>
                  <span>👁️ {item.views} views</span>
                  <button onClick={() => toggleLike(item.id)} className="flex items-center gap-1 hover:text-[#33b6ff] transition">
                    <ThumbsUp size={16} fill={liked[item.id] ? "currentColor" : "none"} />
                    <span>{item.votes + (liked[item.id] ? 1 : 0)} votes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
