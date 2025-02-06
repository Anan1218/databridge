import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { Workspace } from '@/types/workspace';
import { useAuthContext } from '@/contexts/AuthContext';

export interface WorkspaceContextType {
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>;
  refreshDashboards: () => Promise<void>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  selectedWorkspace: null,
  setSelectedWorkspace: () => {},
  refreshDashboards: async () => {},
  isEditing: false,
  setIsEditing: () => {},
});

export function useWorkspace() {
  return useContext(WorkspaceContext);
}

export default WorkspaceContext;

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const refreshDashboards = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists() || !userSnap.data().defaultWorkspace) {
        console.error('No default workspace found');
        return;
      }

      const workspaceId = userSnap.data().defaultWorkspace;
      const workspaceRef = doc(db, 'workspaces', workspaceId);
      const workspaceSnap = await getDoc(workspaceRef);
      
      if (workspaceSnap.exists()) {
        // Fetch all dashboards from the subcollection
        const dashboardsRef = collection(db, 'workspaces', workspaceId, 'dashboards');
        const dashboardsSnap = await getDocs(dashboardsRef);
        
        const dashboards = dashboardsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setSelectedWorkspace({
          id: workspaceSnap.id,
          ...workspaceSnap.data(),
          dashboards // Add the fetched dashboards
        } as Workspace);
      }
    } catch (error) {
      console.error('Error fetching workspace:', error);
    }
  }, [user?.uid]);

  useEffect(() => {
    refreshDashboards();
  }, [user, refreshDashboards]);

  return (
    <WorkspaceContext.Provider
      value={{ selectedWorkspace, setSelectedWorkspace, refreshDashboards, isEditing, setIsEditing }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}; 