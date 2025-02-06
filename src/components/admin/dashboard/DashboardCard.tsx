import { useState } from 'react';
import { Dashboard } from '@/types/workspace';
import { MdDelete, MdSettings, MdEdit, MdCheck, MdDownload } from 'react-icons/md';
import { LeadMonitoringTable } from '@/app/admin/components/leads/LeadMonitoringTable';

interface DashboardCardProps {
  dashboard: Dashboard;
  isEditing: boolean;
  onSettingsClick: () => void;
  onDeleteClick: () => void;
  onRename: (newTitle: string) => void;
}

export default function DashboardCard({ 
  dashboard, 
  isEditing, 
  onSettingsClick, 
  onDeleteClick,
  onRename
}: DashboardCardProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(dashboard.title);

  const handleRename = () => {
    if (newTitle.trim() !== dashboard.title) {
      onRename(newTitle.trim());
    }
    setIsRenaming(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          {isRenaming ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-lg font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <button
                onClick={handleRename}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MdCheck className="w-5 h-5 text-green-600" />
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900">{dashboard.title}</h3>
              {dashboard.type === 'leads_table' && (
                <button
                  className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  title="Download CSV"
                >
                  <MdDownload className="w-4 h-4" />
                  <span>CSV</span>
                </button>
              )}
            </>
          )}
        </div>
        {isEditing && (
          <div className="flex space-x-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsRenaming(true)}
            >
              <MdEdit className="w-5 h-5 text-gray-600" />
            </button>
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
        {dashboard.type === 'leads_table' ? (
          <LeadMonitoringTable leads={dashboard.leads} />
        ) : null}
      </div>
    </div>
  );
} 