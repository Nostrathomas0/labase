// NavBar.js

import React, { useEffect, useState } from 'react';
import Auth from '../Auth';

const NavCorner = ({ onLogout }) => {
  // Get the authenticated user state using the useAuthState hook
  const user = Auth.useAuthState();
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  // Whenever user changes, update the state
  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  // Function to handle clicking on the status indicator
  const handleStatusClick = async () => {
    if (user) {
      try {
        const progress = { lastUpdated: new Date().toISOString() };
        await Auth.updateJwtProgress(progress); // Update progress using the Auth.js function
        console.log("User progress updated successfully");
      } catch (error) {
        console.error("Error updating user progress:", error);
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#007bff',
        padding: '10px',
        borderRadius: '8px',
        color: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {isLoggedIn ? (
        <div
          onClick={handleStatusClick}
          title="Click to update progress"
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#28a745',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        />
      ) : (
        <div
          title="Not logged in"
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#ccc',
            marginRight: '10px',
          }}
        />
      )}
      {isLoggedIn ? (
        <button
          onClick={onLogout}
          style={{
            padding: '5px 10px',
            backgroundColor: '#0056b3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      ) : (
        <a
          href="/login"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Login
        </a>
      )}
    </div>
  );
};

export default NavCorner;
