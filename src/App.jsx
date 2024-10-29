import React from 'react';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import ChatRoom from './components/ChatRoom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

const ChatApp = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header>
        <h1>Chatroom</h1>
        <SignOut />
      </header>
      <section>
        {currentUser ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ChatApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;