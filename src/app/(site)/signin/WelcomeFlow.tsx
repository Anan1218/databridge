"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { UserData } from '@/types/user';
import { useEffect, useRef } from "react";

interface WelcomeFlowProps {
  onComplete: (completed: boolean) => void;
}

export default function WelcomeFlow({ onComplete }: WelcomeFlowProps) {
  const { user } = useAuthContext();
  const isInitializing = useRef(false);

  useEffect(() => {
    const handleInitialize = async () => {
      // Prevent concurrent initialization attempts
      if (!user?.uid || isInitializing.current) return;
      
      isInitializing.current = true;

      try {
        // Prepare user data
        const userData: UserData = {
          email: user.email || '',
          location: 'default',
          businessType: 'restaurant',
          businessName: 'My Business',
          createdAt: new Date(),
          dataSources: [],
          enabledDashboards: [],
          website: ''
        };

        // Initialize user
        const [userResponse, workspaceResponse] = await Promise.all([
          fetch('/api/users/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: user.uid, userData })
          }),
          fetch('/api/workspaces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: user.uid,
              workspace: {
                name: 'My Workspace',
                ownerEmail: user.email,
                ownerName: 'User'
              }
            })
          })
        ]);

        // Check for errors
        if (!userResponse.ok || !workspaceResponse.ok) {
          const errorData = !userResponse.ok 
            ? await userResponse.json() 
            : await workspaceResponse.json();
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
  }, [user?.uid, onComplete]);

  return null;
}
