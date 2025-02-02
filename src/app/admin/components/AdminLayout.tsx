// AdminLayout.tsx
'use client';
import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { Workspace } from "@/types/workspace";
import { useAuthContext } from "@/contexts/AuthContext";
import WorkspaceContext from "@/contexts/WorkspaceContext";
import AdminNavbar from "./AdminNavbar";
import SecondaryNavbar from "./SecondaryNavbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  const refreshDashboards = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists() || !userSnap.data().defaultWorkspace) {
        console.error("No default workspace found");
        return;
      }

      const workspaceRef = doc(db, "workspaces", userSnap.data().defaultWorkspace);
      const workspaceSnap = await getDoc(workspaceRef);
      
      if (workspaceSnap.exists()) {
        setSelectedWorkspace({ id: workspaceSnap.id, ...workspaceSnap.data() } as Workspace);
      }
    } catch (error) {
      console.error("Error fetching workspace:", error);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      refreshDashboards();
    }
  }, [user, router, refreshDashboards]);

  // Only show the secondary navbar when on the /admin page
  const showSecondaryNav = pathname === "/admin";

  return (
    <WorkspaceContext.Provider value={{ selectedWorkspace, refreshDashboards, setSelectedWorkspace }}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AdminNavbar />
        {showSecondaryNav && <SecondaryNavbar />}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </WorkspaceContext.Provider>
  );
}