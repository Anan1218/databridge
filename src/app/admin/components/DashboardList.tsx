import React, { useState } from 'react';
import EventCalendar from './EventCalendar';
import { Dashboard } from '@/types/workspace';
import { MdSettings, MdDelete } from 'react-icons/md';
import DataSourceModal from './DataSourceModal';
import DashboardCard from './DashboardCard';

interface DashboardListProps {
  dashboards: Dashboard[];
  isEditing: boolean;
  onDeleteClick: (dashboardId: string) => void;
}

export default function DashboardList({ dashboards, isEditing, onDeleteClick }: DashboardListProps) {
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);

  const handleSaveDataSources = async (sources: string[]) => {
    if (!selectedDashboard) return;
    
    // Update the dashboard with new data sources
    // You'll need to implement the actual update logic
    console.log('Updating dashboard with sources:', sources);
    setIsDataSourceModalOpen(false);
  };

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
}