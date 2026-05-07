import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Lock, User, Mail, Globe, Moon, DollarSign, LogOut } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState({
    fullName: "John Mentor",
    email: "mentor@pathmentor.ai",
    bio: "Passionate about teaching web development",
    profileImage: "https://i.pravatar.cc/100?img=33",
    notificationsEmail: true,
    notificationsMessages: true,
    darkMode: true,
    courseReminders: true,
    payoutMethod: "Bank Transfer",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
  }, [navigate]);

  const handleSave = () => {
    console.log("Settings saved:", settings);
    alert("Settings saved successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
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
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-slate-400">Manage your mentor profile and preferences</p>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-900 p-4 rounded-xl border border-slate-700">
          <TabButton id="profile" label="Profile" icon={User} />
          <TabButton id="notifications" label="Notifications" icon={Bell} />
          <TabButton id="security" label="Security" icon={Lock} />
          <TabButton id="payments" label="Payments" icon={DollarSign} />
          <TabButton id="preferences" label="Preferences" icon={Globe} />
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl space-y-6">
            <h2 className="text-2xl font-semibold">Profile Information</h2>

            {/* Profile Image */}
            <div className="flex items-center gap-6">
              <img
                src={settings.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-[#33b6ff]"
              />
              <button className="px-4 py-2 bg-[#33b6ff] text-black rounded-lg font-semibold hover:shadow-lg transition">
                Change Photo
              </button>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input
                type="text"
                value={settings.fullName}
                onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-[#33b6ff]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-[#33b6ff]"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
              <textarea
                value={settings.bio}
                onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-[#33b6ff]"
              />
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#33b6ff] text-black font-semibold rounded-lg hover:shadow-lg transition"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl space-y-6">
            <h2 className="text-2xl font-semibold">Notification Preferences</h2>

            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-slate-400">Receive updates via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notificationsEmail}
                  onChange={(e) => setSettings({ ...settings, notificationsEmail: e.target.checked })}
                  className="w-5 h-5"
                />
              </div>

              {/* Message Notifications */}
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div>
                  <p className="font-medium">Message Notifications</p>
                  <p className="text-sm text-slate-400">Get alerts for new messages</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notificationsMessages}
                  onChange={(e) => setSettings({ ...settings, notificationsMessages: e.target.checked })}
                  className="w-5 h-5"
                />
              </div>

              {/* Course Reminders */}
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div>
                  <p className="font-medium">Course Reminders</p>
                  <p className="text-sm text-slate-400">Reminders about upcoming classes</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.courseReminders}
                  onChange={(e) => setSettings({ ...settings, courseReminders: e.target.checked })}
                  className="w-5 h-5"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#33b6ff] text-black font-semibold rounded-lg hover:shadow-lg transition"
            >
              Save Preferences
            </button>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl space-y-6">
            <h2 className="text-2xl font-semibold">Security Settings</h2>

            <div className="space-y-4">
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="font-medium mb-2">Change Password</p>
                <input type="password" placeholder="Current Password" className="w-full px-3 py-2 mb-2 bg-slate-700 border border-slate-600 rounded" />
                <input type="password" placeholder="New Password" className="w-full px-3 py-2 mb-2 bg-slate-700 border border-slate-600 rounded" />
                <input type="password" placeholder="Confirm Password" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded" />
                <button className="mt-3 px-4 py-2 bg-[#33b6ff] text-black font-semibold rounded-lg">
                  Update Password
                </button>
              </div>

              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="font-medium mb-2">Two-Factor Authentication</p>
                <p className="text-sm text-slate-400 mb-3">Add an extra layer of security to your account</p>
                <button className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg hover:bg-slate-600">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl space-y-6">
            <h2 className="text-2xl font-semibold">Payment Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Payout Method</label>
                <select
                  value={settings.payoutMethod}
                  onChange={(e) => setSettings({ ...settings, payoutMethod: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-[#33b6ff]"
                >
                  <option>Bank Transfer</option>
                  <option>PayPal</option>
                  <option>Stripe</option>
                </select>
              </div>

              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="font-medium mb-2">Bank Details</p>
                <input type="text" placeholder="Account Holder Name" className="w-full px-3 py-2 mb-2 bg-slate-700 border border-slate-600 rounded" />
                <input type="text" placeholder="Account Number" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded" />
              </div>

              <button
                onClick={handleSave}
                className="px-6 py-2 bg-[#33b6ff] text-black font-semibold rounded-lg hover:shadow-lg transition"
              >
                Save Payment Details
              </button>
            </div>
          </div>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === "preferences" && (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl space-y-6">
            <h2 className="text-2xl font-semibold">Display Preferences</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                  <Moon size={20} className="text-[#33b6ff]" />
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-slate-400">Always use dark theme</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                  className="w-5 h-5"
                />
              </div>

              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="font-medium mb-3">Language</p>
                <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-[#33b6ff]">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>

              <button
                onClick={handleSave}
                className="px-6 py-2 bg-[#33b6ff] text-black font-semibold rounded-lg hover:shadow-lg transition"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* LOGOUT BUTTON */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
