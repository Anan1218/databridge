'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import '../../styles/components/GlowButton.css';

interface GlowButtonProps {
  text: string;
}

const GlowButton: React.FC<GlowButtonProps> = ({ text }) => {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const showButton = pathname === '/admin' || pathname === '/admin/events';
  
  if (!showButton) return null;

  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email,
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button className="glow-button" onClick={handleSubscribe}>
      {text}
    </button>
  );
};

export default GlowButton; 