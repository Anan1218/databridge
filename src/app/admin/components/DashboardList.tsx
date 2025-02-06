import React, { useState, useCallback, useEffect } from 'react';
import { Dashboard } from '@/types/workspace';
import DataSourceModal from './DataSourceModal';
import DashboardCard from './DashboardCard';
import { doc, updateDoc, collection, getDocs, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useAuthContext } from '@/contexts/AuthContext';

type WorkspaceDisplay = {
  id: string;
  name: string;
  role: 'Owner' | 'User';
};

interface DashboardListProps {
  dashboards: Dashboard[];
  isEditing: boolean;
  onDeleteClick: (dashboardId: string) => void;
}

export default function DashboardList({ 
  dashboards, 
  isEditing, 
  onDeleteClick,
}: DashboardListProps) {
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<WorkspaceDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { selectedWorkspace, setSelectedWorkspace } = useWorkspace();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoading(true);
      try {
        // Adjust the collection path as needed (this example assumes all workspaces are in a top-level "workspaces" collection)
        const querySnapshot = await getDocs(collection(db, 'workspaces'));
        const fetchedWorkspaces = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            // You may need to determine the role based on your data
            role: data.owner?.uid === user?.uid ? 'Owner' : 'User'
          };
        });
        setWorkspaces(fetchedWorkspaces);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchWorkspaces();
    }
  }, [user]);

  const handleSaveDataSources = useCallback(async (sources: string[]) => {
    if (!selectedDashboard || !selectedWorkspace?.id) return;
    
    try {
      const dashboardRef = doc(db, 'workspaces', selectedWorkspace.id, 'dashboards', selectedDashboard.id);

      await updateDoc(dashboardRef, {
        dataSources: sources,
        updatedAt: new Date()
      });

      // Update local state
      setSelectedWorkspace(prev => {
        if (!prev || !prev.dashboards) return null;
        const updatedDashboards = prev.dashboards.map(d => 
          d.id === selectedDashboard.id 
            ? { ...d, dataSources: sources } 
            : d
        );
        return { ...prev, dashboards: updatedDashboards };
      });
      
      setIsDataSourceModalOpen(false);
    } catch (error) {
      console.error('Error updating data sources:', error);
    }
  }, [selectedDashboard, selectedWorkspace, setSelectedWorkspace]);

  const handleRenameDashboard = useCallback(async (dashboardId: string, newTitle: string) => {
    if (!selectedWorkspace?.id) {
      console.error('No workspace selected');
      return;
    }

    if (!newTitle.trim()) {
      console.error('Title cannot be empty');
      return;
    }

    try {
      // Reference to the specific dashboard document in the subcollection
      const dashboardRef = doc(db, 'workspaces', selectedWorkspace.id, 'dashboards', dashboardId);
      
      // Update the dashboard document
      await updateDoc(dashboardRef, {
        title: newTitle.trim(),
        updatedAt: new Date()
      });
      
      // Update local state
      setSelectedWorkspace(prev => {
        if (!prev || !prev.dashboards) return prev;
        const updatedDashboards = prev.dashboards.map(d => 
          d.id === dashboardId ? { ...d, title: newTitle.trim() } : d
        );
        return { ...prev, dashboards: updatedDashboards };
      });
      
    } catch (error) {
      console.error('Error renaming dashboard:', error);
      // You might want to add toast notification or other error feedback here
      throw new Error('Failed to rename dashboard');
    }
  }, [selectedWorkspace, setSelectedWorkspace]);

  return (
    <div className="grid grid-cols-1 gap-6">
      {dashboards.map((dashboard) => (
        <DashboardCard
          key={dashboard.id}
          dashboard={dashboard}
          isEditing={isEditing}
          onSettingsClick={() => {
            setSelectedDashboard(dashboard);
            setIsDataSourceModalOpen(true);
          }}
          onDeleteClick={() => onDeleteClick(dashboard.id)}
          onRename={(newTitle) => handleRenameDashboard(dashboard.id, newTitle)}
        />
      ))}

      {selectedDashboard && (
        <DataSourceModal
          isOpen={isDataSourceModalOpen}
          onClose={() => setIsDataSourceModalOpen(false)}
          currentSources={selectedDashboard.dataSources || []}
          onSave={handleSaveDataSources}
        />
      )}
    </div>
  );
}