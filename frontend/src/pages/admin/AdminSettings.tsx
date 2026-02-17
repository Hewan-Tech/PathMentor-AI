import { useState } from "react";
import { User, Bell, Shield, Database, Save } from "lucide-react";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* SIDEBAR TABS */}
        <div className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "profile" ? "bg-blue-600 text-white" : "hover:bg-slate-900 text-gray-400"
            }`}
          >
            <User size={18} /> Profile
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "security" ? "bg-blue-600 text-white" : "hover:bg-slate-900 text-gray-400"
            }`}
          >
            <Shield size={18} /> Security
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "notifications" ? "bg-blue-600 text-white" : "hover:bg-slate-900 text-gray-400"
            }`}
          >
            <Bell size={18} /> Notifications
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "system" ? "bg-blue-600 text-white" : "hover:bg-slate-900 text-gray-400"
            }`}
          >
            <Database size={18} /> System Data
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-8">
          {activeTab === "profile" && (
            <div className="max-w-xl animate-in fade-in duration-300">
              <h2 className="text-xl font-semibold mb-6">Admin Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Display Name</label>
                  <input type="text" defaultValue="Hewan Admin" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                  <input type="email" defaultValue="hewanadmin@gmail.com" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500" />
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors">
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="max-w-xl animate-in fade-in duration-300">
              <h2 className="text-xl font-semibold mb-6">Password & Security</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500" />
                </div>
                <button className="bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded-lg font-medium transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-semibold mb-6">System Maintenance</h2>
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg mb-6">
                <p className="text-rose-400 text-sm">Danger Zone: These actions are irreversible.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-800 rounded-lg">
                  <div>
                    <p className="font-medium">Clear All Logs</p>
                    <p className="text-xs text-gray-500">Delete all system activity logs older than 30 days.</p>
                  </div>
                  <button className="text-rose-500 hover:bg-rose-500/10 px-4 py-2 rounded-lg text-sm transition-colors">Execute</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;