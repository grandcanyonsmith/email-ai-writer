'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Email {
  type: string;
  subject: string;
  content: string;
  order: number;
}

interface EmailViewerProps {
  email: Email;
  businessData: any;
  onClose: () => void;
  onSave: (updatedEmail: Email) => void;
}

export default function EmailViewer({ email, businessData, onClose, onSave }: EmailViewerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(email.content);
  const [editedSubject, setEditedSubject] = useState(email.subject);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const formatEmailContent = (content: string) => {
    // Clean up the content for markdown rendering
    return content
      .replace(/Subject:.*$/gm, '') // Remove subject line from content
      .trim();
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/edit-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailType: email.type,
          currentContent: editedContent,
          currentSubject: editedSubject,
          businessData,
          aiPrompt,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setEditedContent(data.content);
        setEditedSubject(data.subject);
        setAiPrompt('');
      } else {
        alert('Error generating content: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    onSave({
      ...email,
      content: editedContent,
      subject: editedSubject,
    });
    setIsEditing(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Email {email.order}: {email.type.replace('_', ' ').toUpperCase()}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {businessData.businessName} • {businessData.targetAudience}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {isEditing ? (
              <div className="p-6 space-y-6">
                {/* AI Edit Section */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">AI-Powered Editing</h3>
                  <div className="space-y-3">
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Describe how you want to edit this email (e.g., 'Make it more casual', 'Add urgency', 'Include a story')"
                      className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <button
                      onClick={handleAIGenerate}
                      disabled={isGenerating || !aiPrompt.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isGenerating ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </div>
                      ) : (
                        'Generate with AI'
                      )}
                    </button>
                  </div>
                </div>

                {/* Subject Line */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter subject line..."
                  />
                </div>

                {/* Email Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Content
                  </label>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    rows={20}
                    placeholder="Enter email content..."
                  />
                </div>
              </div>
            ) : (
              <div className="p-6">
                {/* Email Preview */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Subject:</h3>
                    <p className="text-gray-700 font-medium">{email.subject}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Content:</h3>
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({children}) => <h1 className="text-xl font-bold mb-3">{children}</h1>,
                            h2: ({children}) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                            h3: ({children}) => <h3 className="text-base font-bold mb-2">{children}</h3>,
                            p: ({children}) => <p className="mb-3 leading-relaxed">{children}</p>,
                            strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                            em: ({children}) => <em className="italic">{children}</em>,
                            ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                            li: ({children}) => <li className="text-gray-700">{children}</li>,
                            blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-3">{children}</blockquote>,
                            code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                            pre: ({children}) => <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto mb-3">{children}</pre>,
                          }}
                        >
                          {formatEmailContent(email.content)}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-blue-900">Type</p>
                    <p className="text-blue-700 capitalize">{email.type.replace('_', ' ')}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-medium text-green-900">Order</p>
                    <p className="text-green-700">#{email.order}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="font-medium text-purple-900">Business</p>
                    <p className="text-purple-700">{businessData.businessName}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="font-medium text-orange-900">Audience</p>
                    <p className="text-orange-700">{businessData.targetAudience}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 