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

        // Initialize workspace
        const workspaceData: Workspace = {
          name: 'My Workspace',
          owner: {
            uid: user.uid,
            email: user.email || '',
            firstName: '',
            lastName: ''
          },
          members: [{
            uid: user.uid,
            email: user.email || '',
            firstName: '',
            lastName: '',
            role: 'owner'
          }],
          dashboards: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Initialize user and workspace
        const response = await fetch('/api/users/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            uid: user.uid, 
            userData,
            workspaceData 
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Initialization failed');
        }

        onComplete(true);
      } catch (error) {
        console.error("Error during initialization:", error);
        onComplete(false);
      } finally {
        isInitializing.current = false;
      }
    };

    handleInitialize();
  }, [user?.uid, user?.email, onComplete]);

  return null;
}
