'use client';
import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { Workspace } from "@/types/workspace";
import { useAuthContext } from "@/contexts/AuthContext";
import WorkspaceContext from "@/contexts/WorkspaceContext";
import AdminNavbar from "./components/AdminNavbar";
import SecondaryNavbar from "./components/SecondaryNavbar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  // Auth protection
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, router, loading]);

  // Show skeleton layout while loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="h-16 bg-[#1a1f37] border-b border-gray-700 animate-pulse" />
        {pathname === "/admin" && (
          <div className="h-14 bg-white border-b border-gray-200 animate-pulse" />
        )}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Only show the secondary navbar when on the /admin page
  const showSecondaryNav = pathname === "/admin";

  return (
    <WorkspaceContext.Provider
      value={{ selectedWorkspace, isEditing, setIsEditing, refreshDashboards, setSelectedWorkspace }}
    >
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AdminNavbar />
        {showSecondaryNav && (
          <SecondaryNavbar
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        )}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </WorkspaceContext.Provider>
  );
}
