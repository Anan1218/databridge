"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { Workspace } from "@/types/workspace";
import DashboardList from "./components/DashboardList";
import DashboardInitialSetup from "./components/DashboardInitialSetup";
import DeleteModal from "./components/DeleteModal";
import PremiumUpgradeModal from "@/components/PremiumUpgradeModal";

export default function AdminDashboard() {
  const { user, userData, refreshUserData } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";
  
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [dashboardToDelete, setDashboardToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkspaceData = async () => {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [user?.uid]);

  const handleDelete = async (dashboardId: string) => {
    if (!user?.uid || !selectedWorkspace?.id) return;
    try {
      const updatedDashboards = selectedWorkspace.dashboards.filter(d => d.id !== dashboardId);
      const workspaceRef = doc(db, "workspaces", selectedWorkspace.id);
      await updateDoc(workspaceRef, {
        dashboards: updatedDashboards,
        updatedAt: new Date()
      });
      setSelectedWorkspace(prev => (prev ? { ...prev, dashboards: updatedDashboards } : null));
      await refreshUserData();
      await fetchWorkspaceData();
    } catch (error) {
      console.error("Error deleting dashboard:", error);
    }
  };

  const handleCustomIntegration = (e: React.MouseEvent) => {
    e.preventDefault();
    const isPremium = userData?.subscription?.status === "active";
    if (!isPremium) {
      setIsPremiumModalOpen(true);
      return;
    }
    router.push("/admin/custom-data");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="flex-1">
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        {/* Render initial setup when there are no dashboards */}
        {!selectedWorkspace?.dashboards?.length && (
          <>
            <h1 className="text-3xl font-bold mb-8 text-black">Build Your Dashboard</h1>
            <p className="text-black mb-12 text-lg">
              Select a category below to get started with your data monitoring setup.
            </p>
          </>
        )}

        {/* Render dashboards list or initial setup based on workspace data */}
        {selectedWorkspace?.dashboards?.length ? (
          <DashboardList
            dashboards={selectedWorkspace.dashboards}
            isEditing={isEditing}
            onDeleteClick={setDashboardToDelete}
          />
        ) : (
          <DashboardInitialSetup handleCustomIntegration={handleCustomIntegration} />
        )}

        {dashboardToDelete && (
          <DeleteModal
            onCancel={() => setDashboardToDelete(null)}
            onConfirm={() => {
              handleDelete(dashboardToDelete);
              setDashboardToDelete(null);
            }}
          />
        )}
      </div>
      
      <PremiumUpgradeModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onUpgrade={() => {
          setIsPremiumModalOpen(false);
          router.push("/admin/billing");
        }}
        title="Premium Feature"
        description="You need to upgrade to a premium plan to integrate custom data sources."
      />
    </div>
  );
}