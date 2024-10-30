import React, { useRef, useState, useEffect } from 'react';
import { collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import ChatMessage from './ChatMessage';

const MESSAGES_LIMIT = 60;

const ChatRoom = () => {
  const { currentUser } = useAuth();
  const [formValue, setFormValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef();
  const [error, setError] = useState(null);

  const messagesRef = collection(db, 'messages');
  const messagesQuery = query(
    messagesRef,
    orderBy('createdAt', 'desc'),
    limit(MESSAGES_LIMIT)
  );

  const [messages, loading] = useCollectionData(messagesQuery, { idField: 'id' });

  useEffect(() => {
    if (!loading && messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!formValue.trim() || isSubmitting || !currentUser) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newMessage = {
        text: formValue.trim(),
        createdAt: serverTimestamp(),
        uid: currentUser.uid,
        photoURL: currentUser.photoURL || null
      };
      
      await addDoc(messagesRef, newMessage);
      setFormValue('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {error && (
        <div className="fixed top-16 left-0 right-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 z-10" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <main className="flex-1 overflow-y-auto p-4 space-y-4 mb-16">
        {messages && [...messages].reverse().map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </main>

      <form onSubmit={sendMessage} className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex space-x-2">
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Type a message..."
            maxLength={500}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          <button
            type="submit"
            disabled={!formValue.trim() || isSubmitting || !currentUser}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin"></div>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;