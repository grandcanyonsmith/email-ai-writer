"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import EmailViewer from '../../../components/EmailViewer';

interface Email {
  type: string;
  subject: string;
  content: string;
  order: number;
}

interface Sequence {
  id: string;
  businessName: string;
  businessDescription: string;
  targetAudience: string;
  leadMagnet: string;
  primaryCTA: string;
  secondaryCTA: string;
  heroJourney: string;
  resources: string[];
  engageCount: number;
  guideCount: number;
  offerCount: number;
  emails: Email[];
  emailCount: number;
  distribution: {
    leadIn: number;
    engage: number;
    guide: number;
    offer: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function SequenceDetailPage() {
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showEmailViewer, setShowEmailViewer] = useState(false);
  const router = useRouter();
  const params = useParams();
  const sequenceId = params.id as string;

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

    // Fetch sequence details
    fetch(`${API_URL}/api/sequences/${sequenceId}`, {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Sequence not found');
        }
        return res.json();
      })
      .then((data) => {
        setSequence(data.sequence);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [sequenceId, API_URL, router]);

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setShowEmailViewer(true);
  };

  const handleBackToSequences = () => {
    router.push('/dashboard/sequences');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackToSequences}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Sequences
          </button>
        </div>
      </div>
    );
  }

  if (!sequence) return null;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={handleBackToSequences}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Sequences
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{sequence.businessName}</h1>
          <p className="text-gray-600 mt-2">{sequence.businessDescription}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Created: {new Date(sequence.createdAt).toLocaleDateString()}</p>
          <p className="text-sm text-gray-500">Total Emails: {sequence.emailCount}</p>
        </div>
      </div>

      {/* Sequence Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Business Details</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Target Audience:</span> {sequence.targetAudience}</p>
            <p><span className="font-medium">Lead Magnet:</span> {sequence.leadMagnet}</p>
            <p><span className="font-medium">Primary CTA:</span> {sequence.primaryCTA}</p>
            {sequence.secondaryCTA && (
              <p><span className="font-medium">Secondary CTA:</span> {sequence.secondaryCTA}</p>
            )}
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Email Distribution</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Lead-In:</span> {sequence.distribution.leadIn}</p>
            <p><span className="font-medium">Engage:</span> {sequence.distribution.engage}</p>
            <p><span className="font-medium">Guide:</span> {sequence.distribution.guide}</p>
            <p><span className="font-medium">Offer:</span> {sequence.distribution.offer}</p>
          </div>
        </div>
      </div>

      {/* Emails List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Sequence</h2>
        <div className="space-y-4">
          {sequence.emails.map((email, index) => (
            <div
              key={email.order || index}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleEmailClick(email)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">
                  Email {email.order}: {email.type.replace('_', ' ').toUpperCase()}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  email.type === 'lead_in' ? 'bg-green-100 text-green-800' :
                  email.type === 'engage' ? 'bg-blue-100 text-blue-800' :
                  email.type === 'guide' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {email.type.replace('_', ' ')}
                </span>
              </div>
              <p className="text-gray-600 mb-2"><strong>Subject:</strong> {email.subject}</p>
              <p className="text-gray-500 text-sm line-clamp-3">
                {email.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
              </p>
              <p className="text-blue-600 text-sm mt-2">Click to view and edit →</p>
            </div>
          ))}
        </div>
      </div>

      {/* Email Viewer Modal */}
      {showEmailViewer && selectedEmail && (
        <EmailViewer
          email={selectedEmail}
          businessData={{
            businessName: sequence.businessName,
            businessDescription: sequence.businessDescription,
            targetAudience: sequence.targetAudience,
            leadMagnet: sequence.leadMagnet,
            primaryCTA: sequence.primaryCTA,
            secondaryCTA: sequence.secondaryCTA,
            heroJourney: sequence.heroJourney,
            resources: sequence.resources,
            engageCount: sequence.engageCount,
            guideCount: sequence.guideCount,
            offerCount: sequence.offerCount
          }}
          onClose={() => setShowEmailViewer(false)}
          onSave={(updatedEmail) => {
            // Update the email in the sequence
            const updatedEmails = sequence.emails.map(email => 
              email.order === updatedEmail.order ? updatedEmail : email
            );
            setSequence({
              ...sequence,
              emails: updatedEmails
            });
            setShowEmailViewer(false);
          }}
        />
      )}
    </div>
  );
} 