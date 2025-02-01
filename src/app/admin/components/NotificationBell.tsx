'use client';

import { MdNotifications } from 'react-icons/md';
import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
}

interface NotificationBellProps {
  notifications?: Notification[];
}

export default function NotificationBell({ notifications = [] }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasNotifications = notifications.length > 0;

  return (
    <div className="relative">
      <button 
        className="p-2 text-gray-300 hover:text-white rounded-lg transition-colors relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MdNotifications className="w-6 h-6" />
        {hasNotifications && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
          <div className="max-h-64 overflow-y-auto">
            {hasNotifications ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b last:border-b-0"
                >
                  <p>{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-700">
                No new notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 