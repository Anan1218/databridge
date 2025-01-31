import { Dashboard } from '@/types/workspace';
import { MdDelete, MdSettings } from 'react-icons/md';
import EventCalendar from './EventCalendar';

interface DashboardCardProps {
  dashboard: Dashboard;
  isEditing: boolean;
  onSettingsClick: () => void;
  onDeleteClick: () => void;
}

export default function DashboardCard({ 
  dashboard, 
  isEditing, 
  onSettingsClick, 
  onDeleteClick 
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{dashboard.title}</h3>
        </div>
        {isEditing && (
          <div className="flex space-x-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={onSettingsClick}
            >
              <MdSettings className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={onDeleteClick}
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
  );
} 