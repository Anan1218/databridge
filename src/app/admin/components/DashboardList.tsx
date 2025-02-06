import React, { useState, useCallback } from 'react';
import { Dashboard } from '@/types/workspace';
import DataSourceModal from './DataSourceModal';
import DashboardCard from './DashboardCard';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useWorkspace } from '@/contexts/WorkspaceContext';

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

  const { selectedWorkspace, setSelectedWorkspace } = useWorkspace();

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