"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { MdStorage, MdIntegrationInstructions, MdDashboard, MdDelete, MdDragIndicator, MdSettings } from "react-icons/md";
import { useState, useEffect } from "react";
import PremiumUpgradeModal from "@/components/PremiumUpgradeModal";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, updateDoc, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { Workspace } from "@/types/workspace";
import EventCalendar from "./components/EventCalendar";
import DashboardCard from "./components/DashboardCard";
import DashboardList from "./components/DashboardList";
import DashboardInitialSetup from "./components/DashboardInitialSetup";
import DeleteModal from "./components/DeleteModal";

export default function AdminDashboard() {
  const { user, userData, refreshUserData } = useAuthContext();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';
  const [dashboardToDelete, setDashboardToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkspaceData = async () => {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [user?.uid]);

  // Add effect to refresh when workspace changes
  useEffect(() => {
    const refreshInterval = setInterval(fetchWorkspaceData, 2000); // Poll every 2 seconds
    return () => clearInterval(refreshInterval);
  }, [user?.uid]);

  const handleDelete = async (dashboardId: string) => {
    if (!user?.uid || !selectedWorkspace?.id) return;

    try {
      // Remove from local state first for optimistic update
      const updatedDashboards = selectedWorkspace.dashboards.filter(d => d.id !== dashboardId);
      
      // Update workspace document in Firebase
      const workspaceRef = doc(db, 'workspaces', selectedWorkspace.id);
      await updateDoc(workspaceRef, {
        dashboards: updatedDashboards,
        updatedAt: new Date()
      });

      // Update local state
      setSelectedWorkspace(prev => prev ? {
        ...prev,
        dashboards: updatedDashboards
      } : null);

      // Refresh user data
      await refreshUserData();
      await fetchWorkspaceData();
    } catch (error) {
      console.error('Error deleting dashboard:', error);
    }
  };

  const handleCustomIntegration = (e: React.MouseEvent) => {
    e.preventDefault();
    const isPremium = userData?.subscription?.status === 'active';
    
    if (!isPremium) {
      setIsPremiumModalOpen(true);
      return;
    }
    
    router.push('/admin/custom-data');
  };

  const handleDeleteClick = (dashboardId: string) => {
    setDashboardToDelete(dashboardId);
  };

  const handleConfirmDelete = async () => {
    if (!dashboardToDelete) return;
    
    await handleDelete(dashboardToDelete);
    setDashboardToDelete(null);
  };

  const handleCancelDelete = () => {
    setDashboardToDelete(null);
  };

  const renderDashboards = () => {
    if (!selectedWorkspace?.dashboards) return null;
    
    return (
      <div className="grid grid-cols-1 gap-6">
        {selectedWorkspace.dashboards
          .sort((a, b) => (a.position || 0) - (b.position || 0))
          .map((dashboard) => (
            <div key={dashboard.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{dashboard.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">{dashboard.type}</p>
                </div>
                {isEditing && (
                  <div className="flex space-x-2">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => {/* Add settings handler */}}
                    >
                      <MdSettings className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => handleDeleteClick(dashboard.id)}
                    >
                      <MdDelete className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Dashboard type specific content */}
              <div className="mt-4">
                {dashboard.type === 'calendar' ? (
                  <EventCalendar />
                ) : dashboard.type === 'graph' ? (
                  <div className="text-gray-500 text-center py-4">
                    Graph visualization coming soon
                  </div>
                ) : dashboard.type === 'text' ? (
                  <div className="text-gray-500 text-center py-4">
                    Text component coming soon
                  </div>
                ) : null}
              </div>

              <div className="mt-4 pt-4 border-t">
                {dashboard.dataSources?.length ? (
                  <p className="text-sm text-gray-600">
                    {dashboard.dataSources.length} connected data source(s)
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">No data sources connected</p>
                )}
              </div>
            </div>
          ))}
      </div>
    );
  };

  const renderInitialSetup = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Browse Integrated Data Sources Card */}
        <Link href="/admin/integrated" className="group">
          <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-500 transition-all duration-300 h-full flex flex-col">
            <div className="flex-1">
              <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <MdStorage className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Browse Integrated Data Sources</h3>
              <p className="text-black mb-6">
                Explore and connect to our collection of integrated data sources including social media, analytics, and review platforms.
              </p>
            </div>
          </div>
        </Link>

        {/* Custom Data Integration Card */}
        <a href="#" onClick={handleCustomIntegration} className="group">
          <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-500 transition-all duration-300 h-full flex flex-col">
            <div className="flex-1">
              <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <MdIntegrationInstructions className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Add Custom Data Source</h3>
              <p className="text-gray-600 mb-6">
                Import your own data sources or connect custom APIs to create personalized monitoring dashboards.
              </p>
            </div>
          </div>
        </a>
      </div>
    );
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
        {!selectedWorkspace?.dashboards?.length && (
          <>
            <h1 className="text-3xl font-bold mb-8 text-black">Build Your Dashboard</h1>
            <p className="text-black mb-12 text-lg">
              Select a category below to get started with your data monitoring setup.
            </p>
          </>
        )}

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
          router.push('/admin/billing');
        }}
        title="Premium Feature"
        description="You need to upgrade to a premium plan to integrate custom data sources."
      />
    </div>
  );
}