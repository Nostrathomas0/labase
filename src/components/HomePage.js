// HomePage.js - Simple HomePage for your React Application

import React, { useEffect, useState } from 'react';
import Auth from './Auth';
import NavCorner from './common/NavBar';

const HomePage = () => {
  const user = Auth.useAuthState();
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    if (user) {
      setWelcomeMessage(`Welcome back to Languapps, ${user.displayName || 'User'}!`);
    } else {
      setWelcomeMessage('Welcome to the Grammar for ESL Learners Platform. Please log in to continue.');
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await Auth.getAuth().signOut();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="page-content" style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      textAlign: 'center'
    }}>
      <NavCorner onLogout={handleLogout} />
      <h1>{welcomeMessage}</h1>
      {user ? (
        <div>
          <p>Your current progress is being tracked. Continue learning to see your improvements!</p>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <a
            href="/login"
            style={{
              textDecoration: 'none',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Login
          </a>
        </div>
      )}
    </div>
  );
};

export default HomePage;
