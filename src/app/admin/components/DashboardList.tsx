import React, { useState, useCallback } from 'react';
import EventCalendar from './EventCalendar';
import { Dashboard, Workspace } from '@/types/workspace';
import { MdSettings, MdDelete } from 'react-icons/md';
import DataSourceModal from './DataSourceModal';
import DashboardCard from './DashboardCard';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useWorkspace } from './AdminLayout';

interface DashboardListProps {
  dashboards: Dashboard[];
  isEditing: boolean;
  onDeleteClick: (dashboardId: string) => void;
  setDashboards: React.Dispatch<React.SetStateAction<Dashboard[]>>;
}

export default React.memo(function DashboardList({ 
  dashboards, 
  isEditing, 
  onDeleteClick,
  setDashboards 
}: DashboardListProps) {
  const { selectedWorkspace } = useWorkspace();
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);

  // Memoize handlers
  const handleSaveDataSources = useCallback(async (sources: string[]) => {
    if (!selectedDashboard) return;
    
    // Update the dashboard with new data sources
    // You'll need to implement the actual update logic
    console.log('Updating dashboard with sources:', sources);
    setIsDataSourceModalOpen(false);
  }, [selectedDashboard]);

  const handleRenameDashboard = useCallback(async (dashboardId: string, newTitle: string) => {
    if (!selectedWorkspace) {
      console.error('No workspace selected');
      return;
    }

    try {
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
          dashboardId={selectedDashboard.id}
          currentSources={selectedDashboard.dataSources || []}
          onSave={handleSaveDataSources}
        />
      )}
    </div>
  );
});