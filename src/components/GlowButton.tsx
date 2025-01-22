'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import '../../styles/components/GlowButton.css';

interface GlowButtonProps {
  text: string;
  onClick: () => void;
}

const GlowButton: React.FC<GlowButtonProps> = ({ text, onClick }) => {
  const pathname = usePathname();
  const showButton = pathname === '/admin' || pathname === '/admin/events';
  
  if (!showButton) return null;

  return (
    <button className="glow-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default GlowButton; 