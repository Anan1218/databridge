import React, { useState, useCallback } from 'react';
import { Dashboard } from '@/types/workspace';
import DataSourceModal from './DataSourceModal';
import DashboardCard from './DashboardCard';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { Workspace } from '@/types/workspace';

interface DashboardListProps {
  dashboards: Dashboard[];
  isEditing: boolean;
  onDeleteClick: (dashboardId: string) => void;
  setDashboards: React.Dispatch<React.SetStateAction<Dashboard[]>>;
  selectedWorkspace: Workspace;
}

export default React.memo(function DashboardList({ 
  dashboards, 
  isEditing, 
  onDeleteClick,
  setDashboards,
  selectedWorkspace 
}: DashboardListProps) {
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);

  // Memoize handlers
  const handleSaveDataSources = useCallback(async (sources: string[]) => {
    if (!selectedDashboard || !selectedWorkspace?.id) return;
    
    try {
      const workspaceRef = doc(db, 'workspaces', selectedWorkspace.id);
      
      // Update the specific dashboard in the array
      const updatedDashboards = dashboards.map(d => 
        d.id === selectedDashboard.id 
          ? { ...d, dataSources: sources } 
          : d
      );
      
      await updateDoc(workspaceRef, {
        dashboards: updatedDashboards,
        updatedAt: new Date()
      });
      
      // Update local state
      setDashboards(updatedDashboards);
      setIsDataSourceModalOpen(false);
    } catch (error) {
      console.error('Error updating data sources:', error);
    }
  }, [selectedDashboard, selectedWorkspace, dashboards, setDashboards]);

  const handleRenameDashboard = useCallback(async (dashboardId: string, newTitle: string) => {
    if (!selectedWorkspace) {
      console.error('No workspace selected');
      return;
    }

    try {
      if (!selectedWorkspace?.id) throw new Error('Workspace ID is undefined');
      const workspaceRef = doc(db, 'workspaces', selectedWorkspace.id);
      
      // Update the specific dashboard in the array
      const updatedDashboards = dashboards.map(d => 
        d.id === dashboardId ? { ...d, title: newTitle } : d
      );
      
      await updateDoc(workspaceRef, {
        dashboards: updatedDashboards,
        updatedAt: new Date()
      });
      
      // Update local state to trigger re-render of just that card
      setDashboards(updatedDashboards);
      
    } catch (error) {
      console.error('Error renaming dashboard:', error);
    }
  }, [selectedWorkspace, dashboards, setDashboards]);

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
});