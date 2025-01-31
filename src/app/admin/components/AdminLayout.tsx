// AdminLayout.tsx
'use client';
import React from 'react';
import { useAuthContext } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import AdminNavbar from "./AdminNavbar";
import SecondaryNavbar from "./SecondaryNavbar";
import { Workspace } from "@/types/workspace";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  
  // Only show SecondaryNavbar on the main dashboard page
  const showSecondaryNav = pathname === '/admin';

  const refreshDashboards = async () => {
    if (!user?.uid) return;
    
    try {
      // First get user's default workspace
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists() || !userSnap.data().defaultWorkspace) {
        console.error('No default workspace found');
        return;
      }

      // Then fetch the workspace
      const workspaceRef = doc(db, 'workspaces', userSnap.data().defaultWorkspace);
      const workspaceSnap = await getDoc(workspaceRef);
      
      if (workspaceSnap.exists()) {
        setSelectedWorkspace({ id: workspaceSnap.id, ...workspaceSnap.data() } as Workspace);
      }
    } catch (error) {
      console.error('Error fetching workspace:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else {
      refreshDashboards();
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavbar />
      {showSecondaryNav && <SecondaryNavbar refreshDashboards={refreshDashboards} />}
      <main className="flex-1 p-6">
        {React.cloneElement(children as React.ReactElement, {
          selectedWorkspace
        })}
      </main>
    </div>
  );
}