"use client";

import React, { useState } from 'react';
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import DashboardList from "@/components/admin/dashboard/DashboardList";
import DashboardInitialSetup from "@/components/admin/dashboard/DashboardInitialSetup";
import DeleteModal from "@/components/admin/modals/DeleteModal";
import PremiumUpgradeModal from "@/components/PremiumUpgradeModal";
import { useWorkspace } from '@/contexts/WorkspaceContext';

export default function AdminDashboard() {
  const { userData, refreshUserData } = useAuthContext();
  const router = useRouter();
  const { selectedWorkspace, isEditing, refreshDashboards, isLoading } = useWorkspace();
  const dashboards = selectedWorkspace?.dashboards || [];

  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [dashboardToDelete, setDashboardToDelete] = useState<string | null>(null);

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
      await refreshDashboards();
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
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1">
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        {dashboards.length > 0 ? (
          <DashboardList
            dashboards={dashboards}
            isEditing={isEditing}
            onDeleteClick={setDashboardToDelete}
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