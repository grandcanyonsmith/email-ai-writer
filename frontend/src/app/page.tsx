'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from "next/image";
import EmailViewer from './components/EmailViewer';

interface EmailSequence {
  id: string;
  businessName: string;
  emails: Array<{
    type: string;
    subject: string;
    content: string;
    order: number;
  }>;
  emailCount: number;
  distribution: {
    leadIn: number;
    engage: number;
    guide: number;
    offer: number;
  };
  createdAt: string;
}

interface FormData {
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
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessDescription: '',
    targetAudience: '',
    leadMagnet: '',
    primaryCTA: 'book_call',
    secondaryCTA: '',
    heroJourney: '',
    resources: [],
    engageCount: 3,
    guideCount: 2,
    offerCount: 1
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailSequence | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [showEmailViewer, setShowEmailViewer] = useState(false);

  // Progress bar logic
  const steps = [
    { label: 'Business Info', key: 'businessName' },
    { label: 'Description', key: 'businessDescription' },
    { label: 'Audience', key: 'targetAudience' },
    { label: 'Lead Magnet', key: 'leadMagnet' },
    { label: 'Preferences', key: 'primaryCTA' },
    { label: 'Story', key: 'heroJourney' },
    { label: 'Resources', key: 'resources' },
    { label: 'Distribution', key: 'engageCount' }
  ];
  const currentStep = useMemo(() => {
    for (let i = 0; i < steps.length; i++) {
      const key = steps[i].key;
      if (!formData[key] || (Array.isArray(formData[key]) && formData[key].length === 0)) {
        return i;
      }
    }
    return steps.length - 1;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/generate-sequence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate sequence');
      }

      setResult(data.sequence);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResourceChange = (resource: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, resource]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        resources: prev.resources.filter(r => r !== resource)
      }));
    }
  };

  const handleEmailClick = (email: any) => {
    setSelectedEmail(email);
    setShowEmailViewer(true);
  };

  const handleEmailUpdate = (updatedEmail: any) => {
    if (result) {
      const updatedEmails = result.emails.map(email => 
        email.order === updatedEmail.order ? updatedEmail : email
      );
      setResult({
        ...result,
        emails: updatedEmails
      });
    }
  };

  const handleCloseEmailViewer = () => {
    setShowEmailViewer(false);
    setSelectedEmail(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Email AI Writer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate personalized email sequences using AI and the proven LEGO framework
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white shadow-xl rounded-2xl p-8"
          >
            {/* Progress Bar */}
            <div className="flex items-center mb-8">
              {steps.map((step, idx) => (
                <div key={step.key} className="flex-1 flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm
                    ${idx < currentStep ? 'bg-blue-400' : idx === currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}>{idx + 1}</div>
                  <span className={`ml-2 text-xs font-medium ${idx === currentStep ? 'text-blue-700' : 'text-gray-500'}`}>{step.label}</span>
                  {idx < steps.length - 1 && <div className="flex-1 h-1 mx-2 rounded bg-gray-200" />}
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Business Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Course Creator Pro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description *
                </label>
                <textarea
                  required
                  value={formData.businessDescription}
                  onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what your business does..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience *
                </label>
                <input
                  type="text"
                  required
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Course creators and educators"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Magnet *
                </label>
                <input
                  type="text"
                  required
                  value={formData.leadMagnet}
                  onChange={(e) => setFormData({...formData, leadMagnet: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Free website builder"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary CTA
                  </label>
                  <select
                    value={formData.primaryCTA}
                    onChange={(e) => setFormData({...formData, primaryCTA: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="book_call">Book a Call</option>
                    <option value="free_trial">Free Trial</option>
                    <option value="purchase">Direct Purchase</option>
                    <option value="download">Download</option>
                    <option value="signup">Sign Up</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary CTA
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryCTA}
                    onChange={(e) => setFormData({...formData, secondaryCTA: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional secondary action"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero's Journey/Story
                </label>
                <textarea
                  value={formData.heroJourney}
                  onChange={(e) => setFormData({...formData, heroJourney: e.target.value})}
                  rows={4}
                  placeholder="Tell us about your founder's story, credibility, and journey..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Resources
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Videos', 'Templates', 'PDFs', 'Webinars', 'Tools', 'Case Studies'].map((resource) => (
                    <label key={resource} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.resources.includes(resource.toLowerCase())}
                        onChange={(e) => handleResourceChange(resource.toLowerCase(), e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{resource}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Engage Emails
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.engageCount}
                    onChange={(e) => setFormData({...formData, engageCount: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guide Emails
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={formData.guideCount}
                    onChange={(e) => setFormData({...formData, guideCount: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offer Emails
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={formData.offerCount}
                    onChange={(e) => setFormData({...formData, offerCount: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Email Sequence...
                  </div>
                ) : (
                  'Generate Email Sequence'
                )}
              </motion.button>
            </form>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Preview Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white shadow-xl rounded-2xl p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Generated Sequence
            </h2>

            {!result ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">Fill out the form and generate your email sequence</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">{result.businessName}</h3>
                  <div className="text-sm text-blue-700">
                    <p>Total Emails: {result.emailCount}</p>
                    <p>Distribution: {result.distribution.leadIn} Lead-In, {result.distribution.engage} Engage, {result.distribution.guide} Guide, {result.distribution.offer} Offer</p>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {result.emails.map((email, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleEmailClick(email)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          Email {email.order}: {email.type.replace('_', ' ').toUpperCase()}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          email.type === 'lead_in' ? 'bg-green-100 text-green-800' :
                          email.type === 'engage' ? 'bg-blue-100 text-blue-800' :
                          email.type === 'guide' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {email.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 font-medium">Subject: {email.subject}</p>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
                        {email.content}
                      </div>
                      <div className="mt-3 text-xs text-blue-600 font-medium">
                        Click to view and edit →
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      const dataStr = JSON.stringify(result, null, 2);
                      const dataBlob = new Blob([dataStr], {type: 'application/json'});
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${result.businessName}-email-sequence.json`;
                      link.click();
                    }}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Download JSON
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Email Viewer Modal */}
      {showEmailViewer && selectedEmail && (
        <EmailViewer
          email={selectedEmail}
          businessData={formData}
          onClose={handleCloseEmailViewer}
          onSave={handleEmailUpdate}
        />
      )}
    </div>
  );
}
