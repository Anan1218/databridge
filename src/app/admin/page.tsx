"use client";

import { useAuthContext } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuthContext();
  if (!user) {
    return null;
  }

  return (

    <div className="flex-1">
      <div className="flex items-center justify-center h-[50vh] relative">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">No dashboards found.</p>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}