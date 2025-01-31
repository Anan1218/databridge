// AdminLayout.tsx
'use client';
import React, { useCallback, useEffect, useState, createContext, useContext } from 'react';
import { useAuthContext } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import AdminNavbar from "./AdminNavbar";
import SecondaryNavbar from "./SecondaryNavbar";
import { Workspace } from "@/types/workspace";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const WorkspaceContext = createContext<{
  selectedWorkspace: Workspace | null;
  refreshDashboards: () => Promise<void>;
}>({
  selectedWorkspace: null,
  refreshDashboards: async () => {}
});

export function useWorkspace() {
  return useContext(WorkspaceContext);
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  
  // Only show SecondaryNavbar on the main dashboard page
  const showSecondaryNav = pathname === '/admin';

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
    if (!user) {
      router.push('/');
    } else {
      refreshDashboards();
    }
  }, [user, router, refreshDashboards]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavbar />
      {showSecondaryNav && <SecondaryNavbar />}
      <main className="flex-1 p-6">
        <WorkspaceContext.Provider value={{ selectedWorkspace, refreshDashboards }}>
          {children}
        </WorkspaceContext.Provider>
      </main>
    </div>
  );
}