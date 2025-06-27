"use client";
import { useState, useEffect } from "react";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", company: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    // TODO: Fetch profile from backend if available
    // For now, load from localStorage
    const saved = localStorage.getItem("profile");
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const handleChange = (e: any) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    // TODO: Save to backend
    localStorage.setItem("profile", JSON.stringify(profile));
    setToastMsg("Profile updated!");
    setShowToast(true);
    setSaving(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Profile</h1>
      <p className="text-gray-500 mb-6">Update your account details below.</p>
      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={profile.name}
            onChange={handleChange}
            required
            autoFocus
            disabled={saving}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Company</label>
          <input
            type="text"
            name="company"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={profile.company}
            onChange={handleChange}
            required
            disabled={saving}
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition disabled:opacity-60 flex items-center justify-center"
          disabled={saving}
        >
          {saving ? <Spinner /> : "Save Changes"}
        </button>
      </form>
      {showToast && (
        <Toast message={toastMsg} type="success" onClose={() => setShowToast(false)} />
      )}
    </div>
  );
} 