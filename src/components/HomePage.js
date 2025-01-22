// HomePage.js - Simple HomePage for your React Application

import React, { useEffect, useState } from 'react';
import { authenticateWithBackendJwt, getUserToken } from '../utils/authUtils';

const HomePage = () => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const fetchUserToken = async () => {
      try {
        await authenticateWithBackendJwt();
        const token = await getUserToken();
        setUserToken(token);
      } catch (error) {
        console.error('Authentication error:', error);
      }
    };

    fetchUserToken();
  }, []);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {userToken ? <p>Your token: {userToken}</p> : <p>Authenticating...</p>}
    </div>
  );
};

export default HomePage;
