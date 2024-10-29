import React from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';

const ChatMessage = ({ message }) => {
  const { currentUser } = useAuth();
  const { text, uid, photoURL, createdAt } = message;
  const isSent = uid === currentUser?.uid;

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      return timestamp.toDate().toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  return (
    <div className={`flex w-full space-x-3 mx-2 my-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
      {!isSent && (
        <div className="flex-shrink-0">
          <img
            src={photoURL || '/default-avatar.png'}
            alt="User avatar"
            className="h-8 w-8 rounded-full"
          />
        </div>
      )}
      
      <div className={`flex flex-col max-w-[70%] ${isSent ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative px-4 py-2 rounded-2xl
            ${isSent 
              ? 'bg-blue-500 text-white rounded-tr-none' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
            }
          `}
        >
          <p className="text-sm break-words">{text}</p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
          {formatTimestamp(createdAt)}
        </span>
      </div>

      {isSent && (
        <div className="flex-shrink-0">
          <img
            src={photoURL || '/default-avatar.png'}
            alt="User avatar"
            className="h-8 w-8 rounded-full"
          />
        </div>
      )}
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