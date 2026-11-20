import { useAuth } from '../components/AuthContext';

// Premium comes from the user's Firestore profile (live), or from the
// website JWT during the transition. See AuthContext.
const usePremiumAccess = () => {
  const { currentUser, loading, profileLoading } = useAuth();
  return { hasPremium: !!(currentUser && currentUser.premium === true), loading: loading || profileLoading };
};

export default usePremiumAccess;