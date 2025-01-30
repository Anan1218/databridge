import { Dashboard } from '@/types/workspace';
import { MdDelete, MdSettings } from 'react-icons/md';

interface DashboardCardProps {
  dashboard: Dashboard;
  onDelete: () => void;
}

export default function DashboardCard({ dashboard, onDelete }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{dashboard.title}</h3>
          <p className="text-sm text-gray-500 capitalize">{dashboard.type}</p>
        </div>
        <div className="flex space-x-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => {/* Add settings handler */}}
          >
            <MdSettings className="w-5 h-5 text-gray-600" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onDelete}
          >
            <MdDelete className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Add dashboard type specific content here */}
      <div className="mt-4">
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