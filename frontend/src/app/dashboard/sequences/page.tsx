"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SequenceList from '../../components/SequenceList';

export default function SequencesPage() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (!t) {
      router.replace('/login');
      return;
    }
    setToken(t);
    setUser(u ? JSON.parse(u) : null);
    setLoading(false);
  }, [router]);

  const handleSelectSequence = (sequence: any) => {
    router.push(`/dashboard/sequences/${sequence.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Email Sequences</h1>
          <p className="text-gray-600 mt-2">Manage and view all your generated email sequences</p>
        </div>
        <Link 
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Create New Sequence
        </Link>
      </div>

      <div className="bg-white rounded-lg">
        <SequenceList token={token} onSelectSequence={handleSelectSequence} />
      </div>

      {!token && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Please log in to view your sequences</p>
          <Link 
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      )}
    </div>
  );
} 