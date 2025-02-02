import React, { useEffect, useState } from 'react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Trigger the animation once mounted.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close modal on Escape key press.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isMounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Blurred overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal content container */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4 p-6 z-10 transform transition-all duration-300">
        {children}
      </div>
    </div>
  );
}