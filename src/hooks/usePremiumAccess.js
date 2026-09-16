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

    // Premium field is baked into the JWT payload
    // currentUser is the decoded JWT object
    setHasPremium(currentUser.premium === true);
    setLoading(false);

  }, [currentUser]);

  return { hasPremium, loading };
};

export default usePremiumAccess;