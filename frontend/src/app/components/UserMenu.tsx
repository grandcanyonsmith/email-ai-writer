'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserMenuProps {
  user: any;
  onLogout: () => void;
}

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border hover:shadow-md transition-shadow"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {user.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-gray-700 font-medium text-sm hidden sm:block">
          {user.email}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
          >
            <div className="py-1">
              <div className="px-4 py-2 text-sm text-gray-700 border-b">
                <div className="font-medium">{user.email}</div>
                <div className="text-gray-500">User ID: {user.id}</div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 