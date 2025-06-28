"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";
import PageContainer from "../components/PageContainer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://email-ai-writer-production.up.railway.app";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch (err: any) {
      setError(err.message);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100">
      <PageContainer width="max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Sign in to Email AI Writer</h1>
        <p className="text-gray-500 mb-6 text-center">Welcome back! Please enter your details.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition disabled:opacity-60 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <Spinner /> : "Sign In"}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-500 text-sm">
          Don&apos;t have an account? <a href="/signup" className="text-blue-600 hover:underline font-medium">Sign up</a>
        </div>
      </PageContainer>
      {showToast && error && (
        <Toast message={error} type="error" onClose={() => setShowToast(false)} />
      )}
    </div>
  );
} 