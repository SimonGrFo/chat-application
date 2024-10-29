import React from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';

const ChatMessage = ({ message }) => {
  const { currentUser } = useAuth();
  const { text, uid, photoURL, createdAt } = message;
  const messageClass = uid === currentUser?.uid ? 'sent' : 'received';
 
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      return timestamp.toDate().toLocaleString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  return (
    <div className={`message ${messageClass}`}>
      <img
        src={photoURL || '/default-avatar.png'}
        alt="User avatar"
        className="message-avatar"
      />
      <div className="message-content">
        <p>{text}</p>
        <span className="timestamp">{formatTimestamp(createdAt)}</span>
      </div>
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    photoURL: PropTypes.string,
    createdAt: PropTypes.object
  }).isRequired
};

export default ChatMessage;
