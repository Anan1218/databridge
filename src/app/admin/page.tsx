"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { Workspace, Dashboard } from "@/types/workspace";
import DashboardList from "./components/DashboardList";
import DashboardInitialSetup from "./components/DashboardInitialSetup";
import DeleteModal from "./components/DeleteModal";
import PremiumUpgradeModal from "@/components/PremiumUpgradeModal";
import { useWorkspace } from '@/contexts/WorkspaceContext';

export default function AdminDashboard() {
  const { user, userData, refreshUserData, loading } = useAuthContext();
  const router = useRouter();

  const { selectedWorkspace, setSelectedWorkspace, isEditing } = useWorkspace();
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
        
        const dashboardsRef = collection(db, "workspaces", workspaceSnap.id, "dashboards");
        const dashboardsSnap = await getDocs(dashboardsRef);
        
        const dashboards = dashboardsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        } as Dashboard));

        setSelectedWorkspace({
          ...workspaceData,
          dashboards
        });
      }
    } catch (error) {
      console.error("Error fetching workspace:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, setSelectedWorkspace]);

  useEffect(() => {
    fetchWorkspaceData();
  }, [fetchWorkspaceData]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleDelete = async (dashboardId: string) => {
    try {
      await fetch(`/api/workspaces`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId: selectedWorkspace?.id,
          dashboardId
        })
      });
      
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

  return (
    <div className="flex-1">
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        {selectedWorkspace?.dashboards?.length ? (
          <DashboardList
            dashboards={dashboards}
            isEditing={isEditing}
            onDeleteClick={setDashboardToDelete}
            selectedWorkspace={selectedWorkspace}
            setDashboards={setSelectedWorkspace}
          />
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8 text-black">Start Collecting Leads</h1>
            <DashboardInitialSetup onCustomIntegrationClick={handleCustomIntegration} />
          </>
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
        description="You need to upgrade to a premium plan to create additional workspaces."
      />
    </div>
  );
}