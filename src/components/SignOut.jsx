import React from 'react';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const SignOut = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) return null;
  
  return (
    <button className="sign-out" onClick={() => auth.signOut()}>
      Sign Out
    </button>
  );
};

export default SignOut;
