"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { UserData } from '@/types/user';
import { useEffect } from "react";

interface WelcomeFlowProps {
  onComplete: (completed: boolean) => void;
}

export default function WelcomeFlow({ onComplete }: WelcomeFlowProps) {
  const { user } = useAuthContext();

  useEffect(() => {
    let mounted = true;

    const handleInitialize = async () => {
      if (!user?.uid || !mounted) return;

      try {
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

        const response = await fetch('/api/users/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uid: user.uid,
            userData
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to initialize user');
        }

        // Create default workspace
        const workspacePayload = {
          uid: user.uid,
          workspace: {
            name: 'My Workspace',
            ownerEmail: user.email,
            ownerName: 'User'
          }
        };

        const workspaceResponse = await fetch('/api/workspaces', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(workspacePayload)
        });

        if (!workspaceResponse.ok) {
          throw new Error('Failed to create workspace');
        }

        if (mounted) {
          onComplete(true);
        }
      } catch (error) {
        console.error("Error during initialization:", error);
        if (mounted) {
          onComplete(false);
        }
      }
    };

    handleInitialize();

    return () => {
      mounted = false;
    };
  }, [user?.uid, onComplete]);

  return null;
}
