import React from 'react';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const SignOut = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) return null;
  
  return (
    <button
      onClick={() => auth.signOut()}
      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span>Sign Out</span>
    </button>
  );
};

export default SignOut;