"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { Workspace } from "@/types/workspace";
import { Dashboard } from "@/types/workspace";
import DashboardList from "./components/DashboardList";
import DashboardInitialSetup from "./components/DashboardInitialSetup";
import DeleteModal from "./components/DeleteModal";
import PremiumUpgradeModal from "@/components/PremiumUpgradeModal";
import { useWorkspace } from '@/contexts/WorkspaceContext';

export default function AdminDashboard() {
  const { user, userData, refreshUserData } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";
  
  const { selectedWorkspace, setSelectedWorkspace, refreshDashboards } = useWorkspace();
  const dashboards = selectedWorkspace?.dashboards || [];

  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [dashboardToDelete, setDashboardToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkspaceData = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.error("User document not found");
        return;
      }

      const userData = userSnap.data();
      
      if (!userData?.defaultWorkspace) {
        console.error("No default workspace found");
        return;
      }

      const workspaceRef = doc(db, "workspaces", userData.defaultWorkspace);
      const workspaceSnap = await getDoc(workspaceRef);
      
      if (workspaceSnap.exists()) {
        const workspaceData = { id: workspaceSnap.id, ...workspaceSnap.data() } as Workspace;
        setSelectedWorkspace(workspaceData);
      }
    } catch (error) {
      console.error("Error fetching workspace:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchWorkspaceData();
  }, [fetchWorkspaceData]);

  const handleDelete = async (dashboardId: string) => {
    if (!selectedWorkspace?.id) return;
    try {
      const updatedDashboards = dashboards.filter(d => d.id !== dashboardId);
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
            dashboards={dashboards}
            isEditing={isEditing}
            onDeleteClick={setDashboardToDelete}
            selectedWorkspace={selectedWorkspace}
            setDashboards={setSelectedWorkspace}
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