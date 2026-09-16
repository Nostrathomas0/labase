import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';

const usePremiumAccess = () => {
  const { currentUser } = useAuth();
  const [hasPremium, setHasPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    console.log('usePremiumAccess - currentUser:', currentUser);
    console.log('usePremiumAccess - premium:', currentUser.premium);
    setHasPremium(currentUser.premium === true);
    setLoading(false);

  }, [currentUser]);

  return { hasPremium, loading };
};

export default usePremiumAccess;