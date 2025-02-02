'use client';

import { useState, useEffect } from 'react';
import { MdNotifications } from 'react-icons/md';
import { useAuthContext } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  type?: string;
}

interface NotificationBellProps {
  notifications?: Notification[];
}

export default function NotificationBell({ notifications = [] }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthContext();

  // Log whenever notifications change
  useEffect(() => {
    console.log("NotificationBell: notifications prop updated:", notifications);
  }, [notifications]);

  // Log on every render
  // console.log("NotificationBell render:", { notifications, user });

  const handleAcceptInvite = async (inviteId: string) => {
    console.log("Accept invite clicked for id:", inviteId);
    try {
      const res = await fetch('/api/invites/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId, userId: user.uid }),
      });
      const data = await res.json();
      console.log("Response from accept invite:", data);
      if (data.success) {
        console.log("Invite accepted successfully");
        window.location.reload();
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error accepting invite:", error);
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    console.log("Decline invite clicked for id:", inviteId);
    try {
      const res = await fetch('/api/invites/decline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId, userId: user.uid }),
      });
      const data = await res.json();
      console.log("Response from decline invite:", data);
      if (data.success) {
        console.log("Invite declined successfully");
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error declining invite:", error);
    }
  };

  return (
    <div className="relative">
      <button
        className="p-2 text-gray-300 hover:text-white rounded-lg transition-colors relative"
        onClick={() => {
          const newState = !isOpen;
          setIsOpen(newState);
        }}
      >
        <MdNotifications className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-700">
                No notifications available.
              </div>
            )}
            {notifications.map((notification) => {
              console.log("Rendering notification:", notification);
              return (
                <div
                  key={notification.id}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b last:border-b-0 flex justify-between items-center"
                >
                  <div>
                    <p>{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {notification.type === 'invite' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleAcceptInvite(notification.id)}
                        className="bg-green-500 text-white text-xs px-2 py-1 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeclineInvite(notification.id)}
                        className="bg-red-500 text-white text-xs px-2 py-1 rounded"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 