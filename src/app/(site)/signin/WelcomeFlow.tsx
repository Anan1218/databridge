"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { UserData } from '@/types/user';
import { useEffect, useRef } from "react";
import { Workspace } from '@/types/workspace';

interface WelcomeFlowProps {
  onComplete: (completed: boolean) => void;
}

export default function WelcomeFlow({ onComplete }: WelcomeFlowProps) {
  const { user } = useAuthContext();
  const isInitializing = useRef(false);

  useEffect(() => {
    const handleInitialize = async () => {
      if (!user?.uid || isInitializing.current) return;
      
      isInitializing.current = true;

      try {
        const userData: UserData = {
          email: user.email || '',
          location: 'default',
          businessType: 'restaurant',
          businessName: '',
          createdAt: new Date(),
          dataSources: [],
          website: '',
          firstName: '',
          lastName: '',
          updatedAt: new Date(),
          receiveUpdates: false
        };

        const response = await fetch('/api/users/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            uid: user.uid, 
            userData
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Initialization failed');
        }

        onComplete(true);
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        isInitializing.current = false;
      }
    };

    handleInitialize();
  }, [user?.uid, user?.email, onComplete]);

  return null;
}
