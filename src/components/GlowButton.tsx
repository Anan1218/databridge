'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import '../../styles/components/GlowButton.css';

interface GlowButtonProps {
  text: string;
}

const GlowButton: React.FC<GlowButtonProps> = ({ text }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthContext();
  const showButton = pathname === '/admin' || pathname === '/admin/events';
  
  if (!showButton) return null;

  const handleClick = () => {
    router.push('/subscribe');
  };

  return (
    <button className="glow-button" onClick={handleClick}>
      {text}
    </button>
  );
};

export default GlowButton; 