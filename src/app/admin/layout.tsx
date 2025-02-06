'use client';
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useWorkspace, WorkspaceProvider } from "@/contexts/WorkspaceContext";
import AdminNavbar from "./components/AdminNavbar";
import SecondaryNavbar from "./components/SecondaryNavbar";

function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const { selectedWorkspace, isEditing, setIsEditing } = useWorkspace();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, router, loading]);

  if (loading || !selectedWorkspace) {
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

  const showSecondaryNav = pathname === "/admin";

  return (
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
  );
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceProvider>
      <AdminLayout>{children}</AdminLayout>
    </WorkspaceProvider>
  );
}
