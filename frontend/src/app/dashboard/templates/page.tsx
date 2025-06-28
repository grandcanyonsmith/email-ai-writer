"use client";
import { useEffect, useState } from "react";
import Toast from "../../components/Toast";
import Spinner from "../../components/Spinner";
import PageContainer from "../../components/PageContainer";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<{ name: string; content: string }[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://email-ai-writer-production.up.railway.app";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API_URL}/api/templates`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setTemplates(data.templates || []);
        if (data.templates && data.templates.length > 0) {
          setSelected(data.templates[0].name);
          setContent(data.templates[0].content);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [API_URL]);

  useEffect(() => {
    const t = templates.find(t => t.name === selected);
    if (t) setContent(t.content);
  }, [selected, templates]);

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/templates`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name: selected, content }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update template");
      setToastMsg("Template updated!");
      setShowToast(true);
      setTemplates(templates.map(t => t.name === selected ? { ...t, content } : t));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <PageContainer width="max-w-2xl" className="mt-8 w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Email Templates</h1>
      <p className="text-gray-500 mb-6">These are the core templates and instructions the AI uses to write your sequences.</p>
      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Select Template</label>
          <select
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={selected}
            onChange={e => setSelected(e.target.value)}
            required
          >
            {templates.map(t => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Template Content</label>
          <textarea
            className="w-full min-h-[180px] px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-mono text-sm"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
        </div>
        {error && <div className="bg-red-50 text-red-600 rounded-md p-3 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition disabled:opacity-60 flex items-center justify-center"
          disabled={saving}
        >
          {saving ? <Spinner /> : "Save Template"}
        </button>
      </form>
      {showToast && (
        <Toast message={toastMsg} type="success" onClose={() => setShowToast(false)} />
      )}
    </PageContainer>
  );
}
