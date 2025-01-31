import React, { useState } from 'react';
import EventCalendar from './EventCalendar';
import { Dashboard } from '@/types/workspace';
import { MdSettings, MdDelete } from 'react-icons/md';
import DataSourceModal from './DataSourceModal';

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
                  onClick={() => {
                    setSelectedDashboard(dashboard);
                    setIsDataSourceModalOpen(true);
                  }}
                >
                  <MdSettings className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => onDeleteClick(dashboard.id)}
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