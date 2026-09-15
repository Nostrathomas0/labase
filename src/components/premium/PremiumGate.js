// src/components/premium/PremiumGate.js
import React from 'react';
import usePremiumAccess from '../../hooks/usePremiumAccess';

const PremiumGate = ({ children, fallback }) => {
  const { hasPremium, loading } = usePremiumAccess();

  if (loading) return <div className="access-loading">Loading...</div>;

  if (!hasPremium) {
    return fallback || (
      <div className="premium-upsell">
        <p>This activity is available to premium members.</p>
        <a href="/upgrade">Upgrade your account</a>
      </div>
    );
  }

  return children;
};

export default PremiumGate;