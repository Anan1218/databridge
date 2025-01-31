import { useState } from 'react';
import { Dashboard } from '@/types/workspace';
import { MdDelete, MdSettings, MdEdit, MdCheck } from 'react-icons/md';
import EventCalendar from './EventCalendar';

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
        <div>
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
            <h3 className="text-lg font-semibold text-gray-900">{dashboard.title}</h3>
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
    </div>
  );
} 