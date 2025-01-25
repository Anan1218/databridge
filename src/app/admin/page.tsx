"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useState } from "react";

interface WidgetSidebarProps {
  onClose: () => void;
  onSelectWidget: (widgetType: string) => void;
}

const WidgetSidebar = ({ onClose, onSelectWidget }: WidgetSidebarProps) => {
  const widgets = [
    {
      type: 'localEvents',
      name: 'Local Events',
      emoji: '🗓️',
      description: 'Embed local events calendar'
    },
    {
      type: 'salesMetrics',
      name: 'Sales Metrics',
      emoji: '📈',
      description: 'Add sales performance charts'
    },
    {
      type: 'userActivity',
      name: 'User Activity',
      emoji: '👥',
      description: 'Track user engagement metrics'
    }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50 p-6 transition-transform duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold">Add Widget</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="space-y-4">
        {widgets.map((widget) => (
          <button
            key={widget.type}
            onClick={() => onSelectWidget(widget.type)}
            className="w-full p-4 text-left rounded-lg border hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-start gap-4"
          >
            <span className="text-2xl">{widget.emoji}</span>
            <div>
              <h3 className="font-medium">{widget.name}</h3>
              <p className="text-sm text-gray-500">{widget.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { user } = useAuthContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelectWidget = (widgetType: string) => {
    console.log('Selected widget:', widgetType);
    // Add logic to create dashboard with selected widget
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center h-[50vh] relative">
      <div className="text-center">
        <p className="text-gray-500 text-lg mb-4">No dashboards found.</p>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setIsSidebarOpen(true)}
        >
          Create Your First Dashboard
        </button>
      </div>

      {isSidebarOpen && (
        <WidgetSidebar
          onClose={() => setIsSidebarOpen(false)}
          onSelectWidget={handleSelectWidget}
        />
      )}
    </div>
  );
}