// src/components/premium/PremiumRoute.js
import React from 'react';
import { usePremiumAccess } from '../../hooks/usePremiumAccess';
import UpgradePrompt from './UpgradePrompt';

const PremiumRoute = ({ children }) => {
  const { hasPremium, loading } = usePremiumAccess();

  if (loading) return <div className="access-loading">Loading...</div>;
  if (!hasPremium) return <UpgradePrompt />;

  return children;
};

export default PremiumRoute;