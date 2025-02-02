import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { Workspace } from '@/types/workspace';
import { useAuthContext } from '@/contexts/AuthContext';

export interface WorkspaceContextType {
  selectedWorkspace: Workspace | null;
  refreshDashboards: () => Promise<void>;
  setSelectedWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  selectedWorkspace: null,
  refreshDashboards: async () => {},
  setSelectedWorkspace: () => {},
});

export function useWorkspace() {
  return useContext(WorkspaceContext);
}

export default WorkspaceContext;

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  const refreshDashboards = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists() || !userSnap.data().defaultWorkspace) {
        console.error('No default workspace found');
        return;
      }

      const workspaceRef = doc(db, 'workspaces', userSnap.data().defaultWorkspace);
      const workspaceSnap = await getDoc(workspaceRef);
      if (workspaceSnap.exists()) {
        setSelectedWorkspace({ id: workspaceSnap.id, ...workspaceSnap.data() } as Workspace);
      }
    } catch (error) {
      console.error('Error fetching workspace:', error);
    }
  }, [user?.uid]);

  useEffect(() => {
    refreshDashboards();
  }, [user, refreshDashboards]);

  return (
    <WorkspaceContext.Provider value={{ selectedWorkspace, setSelectedWorkspace, refreshDashboards }}>
      {children}
    </WorkspaceContext.Provider>
  );
}; 