import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';  
import { getUserToken } from '../utils/authUtils';

const HomePage = () => {
  const { user } = useAuth();  // ✅ Get user from AuthContext

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        if (user) {
          const token = await getUserToken();  // ✅ Uses shared auth instance
          console.log('User token:', token);
        }
      } catch (error) {
        console.error('Error fetching user token:', error);
      }
    };

    authenticateUser();
  }, [user]);

  return <div>Welcome to HomePage!</div>;
};

export default HomePage;
