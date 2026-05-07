import React, { useState, useMemo } from 'react';
import { Search, Send, ShieldAlert, MoreVertical, Users, GraduationCap, LifeBuoy, Bell, Megaphone, Globe, Check, ChevronDown, BookOpen } from 'lucide-react';

const Conversations = () => {
  type ChatItem = {
    id: number;
    role: 'student' | 'mentor' | 'admin';
    course: string;
    name: string;
    lastMsg: string;
    time: string;
    online: boolean;
  };

  const [selectedChat, setSelectedChat] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'student' | 'mentor' | 'admin' | 'announcement'>('student');
  const [targetAudience, setTargetAudience] = useState('all');
  const [announcementText, setAnnouncementText] = useState("");

  // Enhanced Data: Added 'course' field
  const chatData: ChatItem[] = [
    { id: 0, role: 'student', course: 'React Web Development', name: "Liam Johnson", lastMsg: "I can't access the React module...", time: "2m ago", online: true },
    { id: 1, role: 'mentor', course: 'React Web Development', name: "Sarah Smith", lastMsg: "The payment has been processed.", time: "1h ago", online: true },
    { id: 2, role: 'admin', course: 'System', name: "Bruce Wayne", lastMsg: "System maintenance at 12 PM.", time: "3h ago", online: false },
    { id: 3, role: 'student', course: 'UI/UX Design', name: "Emma Wilson", lastMsg: "When is the next Q&A?", time: "5h ago", online: true },
    { id: 4, role: 'student', course: 'React Web Development', name: "Noah Garcia", lastMsg: "Assignment submitted!", time: "10m ago", online: false },
    { id: 5, role: 'mentor', course: 'UI/UX Design', name: "Ava Chen", lastMsg: "Great work on the wireframes.", time: "4h ago", online: true },
  ];

  // Grouping Logic: Categorize users by course based on active tab
  const categorizedList = useMemo<Record<string, ChatItem[]>>(() => {
    const filtered = chatData.filter((chat) => chat.role === activeTab);
    return filtered.reduce<Record<string, ChatItem[]>>((acc, chat) => {
      if (!acc[chat.course]) acc[chat.course] = [];
      acc[chat.course].push(chat);
      return acc;
    }, {});
  }, [activeTab]);

  const tabs = [
          { id: 'student', label: 'Students', icon: GraduationCap },
          { id: 'mentor', label: 'Mentors', icon: LifeBuoy },
          { id: 'admin', label: 'Admin Team', icon: Users },
          { id: 'announcement', label: 'Announcements', icon: Bell },
        ] as const;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-4 animate-in fade-in duration-500">
      
      {/* Top Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
                setActiveTab(tab.id);
                setSelectedChat(tab.id === 'announcement' ? null : null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
              : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Sidebar with Categorization */}
        <div className="w-80 bg-slate-900/40 border border-white/10 rounded-2xl flex flex-col overflow-hidden backdrop-blur-xl">
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="text" placeholder={`Search by name or course...`} className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto [scrollbar-width:none]">
            {activeTab === 'announcement' ? (
              <div className="p-4 space-y-2 opacity-50"><p className="text-[10px] text-slate-500 font-bold uppercase">Recent History</p></div>
            ) : (
              Object.entries(categorizedList).map(([courseName, users]) => (
                <div key={courseName} className="mb-2">
                  {/* Category Header */}
                  <div className="px-4 py-2 bg-white/5 flex items-center gap-2 sticky top-0 z-10 border-y border-white/5 backdrop-blur-md">
                    <BookOpen size={12} className="text-blue-400" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{courseName}</span>
                    <span className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400">{users.length}</span>
                  </div>
                  
                  {/* Users in Category */}
                  {users.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`w-full p-4 flex gap-3 border-b border-white/5 transition-all text-left ${selectedChat === chat.id ? 'bg-blue-600/10 border-r-2 border-r-blue-500' : 'hover:bg-white/5'}`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 font-bold text-xs">{chat.name.charAt(0)}</div>
                        {chat.online && <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#020617]" />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{chat.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{chat.lastMsg}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content Area (Same as previous logic for Announcements/Chat) */}
        <div className="flex-1 bg-slate-900/40 border border-white/10 rounded-2xl flex flex-col overflow-hidden backdrop-blur-xl">
           {/* ... Rest of your Main Content logic (Announcement Composer or Chat View) */}
           {activeTab === 'announcement' ? (
             <div className="p-8">
               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Megaphone className="text-blue-500" /> Create Announcement</h2>
               {/* Same audience selection and textarea as before */}
               <div className="grid grid-cols-3 gap-3 mb-6">
                  {['all', 'student', 'mentor'].map(role => (
                    <button key={role} onClick={() => setTargetAudience(role)} className={`p-3 rounded-xl border text-xs font-bold capitalize ${targetAudience === role ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                      {role}s
                    </button>
                  ))}
               </div>
               <textarea className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none mb-4" placeholder="Announcement details..." />
               <button className="w-full bg-blue-600 py-4 rounded-2xl text-white font-bold">Post Announcement</button>
             </div>
           ) : selectedChat !== null ? (
             <div className="flex-1 flex flex-col">
               <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">{chatData.find(c => c.id === selectedChat)?.name.charAt(0)}</div>
                   <div>
                     <p className="text-sm font-bold text-white">{chatData.find(c => c.id === selectedChat)?.name}</p>
                     <p className="text-[10px] text-blue-400 font-medium uppercase">{chatData.find(c => c.id === selectedChat)?.course}</p>
                   </div>
                 </div>
               </div>
               <div className="flex-1 p-6 text-slate-500 text-center italic text-sm">Beginning of conversation in {chatData.find(c => c.id === selectedChat)?.course}</div>
               <div className="p-4 border-t border-white/5 flex gap-2">
                 <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none" placeholder="Message..." />
                 <button type="button" title="Send message" className="bg-blue-600 p-2 rounded-xl text-white"><Send size={18} /></button>
               </div>
             </div>
           ) : (
             <div className="flex-1 flex items-center justify-center text-slate-500">Select a contact from {activeTab}s</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Conversations;