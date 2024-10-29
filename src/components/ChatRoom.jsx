import React, { useRef, useState, useEffect } from 'react';
import { collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import ChatMessage from './ChatMessage';

const MESSAGES_LIMIT = 25;

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
    return <div>Loading messages...</div>;
  }

  return (
    <div className="chat-room">
      {error && <div className="error-message">{error}</div>}
      
      <main className="messages-container">
        {messages && [...messages].reverse().map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </main>

      <form onSubmit={sendMessage} className="message-form">
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type a message..."
          maxLength={500}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!formValue.trim() || isSubmitting || !currentUser}
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
