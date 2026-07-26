import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseInit';

const usePremiumAccess = () => {
  const { currentUser } = useAuth();
  const [hasPremium, setHasPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const checkAccess = async () => {
      try {
        // First: check JWT custom claim (set by Stripe webhook or admin)
        const token = await currentUser.getIdTokenResult(true);
        if (token.claims.premium) {
          setHasPremium(true);
          setLoading(false);
          return;
        }

        // Second: fallback to Firestore (admin-assignable)
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setHasPremium(userDoc.data().premium === true);
        }
      } catch (err) {
        console.error('usePremiumAccess error:', err);
        setHasPremium(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [currentUser]);

  return { hasPremium, loading };
};

export default usePremiumAccess;