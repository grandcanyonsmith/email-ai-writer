'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Sequence {
  id: number;
  businessName: string;
  businessDescription: string;
  emailCount: number;
  createdAt: string;
  updatedAt: string;
}

interface SequenceListProps {
  token: string;
  onSelectSequence: (sequence: Sequence) => void;
}

export default function SequenceList({ token, onSelectSequence }: SequenceListProps) {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://email-ai-writer-backend-production.up.railway.app';

  useEffect(() => {
    fetchSequences();
  }, [token]);

  const fetchSequences = async () => {
    try {
      const response = await fetch(`${API_URL}/api/sequences`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sequences');
      }

      const data = await response.json();
      setSequences(data.sequences || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSequence = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sequence?')) return;

    try {
      const response = await fetch(`${API_URL}/api/sequences/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete sequence');
      }

      setSequences(sequences.filter(seq => seq.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="space-y-6">
      {sequences.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No sequences found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sequences.map(seq => (
            <div
              key={seq.id}
              className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition cursor-pointer group flex flex-col justify-between"
              onClick={() => onSelectSequence(seq)}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition">{seq.businessName}</h3>
                  <button
                    className="text-xs text-red-500 hover:underline ml-2"
                    onClick={e => { e.stopPropagation(); deleteSequence(seq.id); }}
                  >Delete</button>
                </div>
                <div className="text-gray-600 text-sm mb-2 line-clamp-2">{seq.businessDescription}</div>
                <div className="flex items-center text-xs text-gray-400 gap-4">
                  <span>{seq.emailCount} emails</span>
                  <span>Created: {new Date(seq.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 