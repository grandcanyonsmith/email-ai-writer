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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-8">
        Error: {error}
      </div>
    );
  }

  if (sequences.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No sequences found. Create your first email sequence!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Your Sequences</h3>
      <div className="grid gap-4">
        {sequences.map((sequence, index) => (
          <motion.div
            key={sequence.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectSequence(sequence)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{sequence.businessName}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {sequence.businessDescription}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>{sequence.emailCount} emails</span>
                  <span>Created {new Date(sequence.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSequence(sequence.id);
                }}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 