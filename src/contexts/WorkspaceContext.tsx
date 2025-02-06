import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { Workspace } from "@/types/workspace";
import { useAuthContext } from "@/contexts/AuthContext";

interface WorkspaceContextProps {
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  refreshDashboards: () => Promise<void>;
  isLoading: boolean;
}

export const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const updateSelectedWorkspace = useCallback((newData: Workspace | null | ((prev: Workspace | null) => Workspace | null)) => {
    setSelectedWorkspace(newData);
  }, []);

  const refreshDashboards = useCallback(async () => {
    if (!user?.uid) return;
    setIsLoading(true);

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists() || !userSnap.data().defaultWorkspace) {
        console.error("No default workspace found");
        setSelectedWorkspace(null);
        return;
      }

      const workspaceId = userSnap.data().defaultWorkspace;
      const workspaceRef = doc(db, "workspaces", workspaceId);
      const workspaceSnap = await getDoc(workspaceRef);

      if (workspaceSnap.exists()) {
        const dashboardsRef = collection(db, "workspaces", workspaceId, "dashboards");
        const dashboardsSnap = await getDocs(dashboardsRef);
        
        const dashboards = dashboardsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const workspaceData = {
          id: workspaceSnap.id,
          ...workspaceSnap.data(),
          dashboards
        } as Workspace;

        updateSelectedWorkspace(workspaceData);
      }
    } catch (error) {
      console.error("Error fetching workspace:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, updateSelectedWorkspace]);

  useEffect(() => {
    if (user?.uid) {
      refreshDashboards();
    }
  }, [user?.uid, refreshDashboards]);

  return (
    <WorkspaceContext.Provider
      value={{ 
        selectedWorkspace, 
        setSelectedWorkspace: updateSelectedWorkspace, 
        isEditing, 
        setIsEditing, 
        refreshDashboards,
        isLoading 
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};