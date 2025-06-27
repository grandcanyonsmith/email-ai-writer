"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SequenceList from "../components/SequenceList";
import UserMenu from "../components/UserMenu";
import Spinner from "../components/Spinner";

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ name: string; company: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://email-ai-writer-production.up.railway.app";

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (!t) {
      router.replace("/login");
      return;
    }
    setToken(t);
    setUser(u ? JSON.parse(u) : null);
    fetch(`${API_URL}/api/profile`, {
      headers: { "Authorization": `Bearer ${t}` },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.profile || !data.profile.name || !data.profile.company) {
          router.replace("/profile");
        } else {
          setProfile(data.profile);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [API_URL, router]);

  if (loading || !profile) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!token) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome, {profile.name}!</h1>
          <p className="text-gray-500">Your AI-powered email dashboard</p>
        </div>
        <UserMenu user={user} onLogout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/login");
        }} />
      </div>
      {/* Dashboard widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-700 mb-1">🚀</div>
          <div className="text-lg font-semibold text-gray-900">Generate Sequence</div>
          <div className="text-gray-500 text-sm mt-1">Start a new AI-powered email sequence</div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-700 mb-1">📈</div>
          <div className="text-lg font-semibold text-gray-900">Your Stats</div>
          <div className="text-gray-500 text-sm mt-1">Track your email performance</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 text-center shadow-sm">
          <div className="text-2xl font-bold text-yellow-700 mb-1">👤</div>
          <div className="text-lg font-semibold text-gray-900">Profile</div>
          <div className="text-gray-500 text-sm mt-1">Update your account details</div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Sequences</h2>
        <SequenceList token={token} onSelectSequence={() => {}} />
      </div>
    </div>
  );
} 