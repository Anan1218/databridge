"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useAuthContext } from "@/contexts/AuthContext";

interface Report {
  status: 'pending' | 'completed' | 'error';
  createdAt: Date;
  data: any;
}

export default function AdminDashboard() {
  const [reportStatus, setReportStatus] = useState<Report['status'] | null>(null);
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const checkReports = async () => {
      if (!user?.uid) {
        setReportStatus(null);
        return;
      }

      try {
        console.log("Checking reports for user:", user.uid);
        const reportsRef = collection(db, "users", user.uid, "reports");
        const q = query(reportsRef, orderBy('createdAt', 'desc'), limit(1));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setReportStatus(null);
        } else {
          const latestReport = snapshot.docs[0].data() as Report;
          setReportStatus(latestReport.status);
          console.log("Latest report status:", latestReport.status);
        }
      } catch (error) {
        console.error("Error checking reports:", error);
        setReportStatus(null);
      }
    };

    checkReports();
  }, [user?.uid]);

  if (!user || !reportStatus || reportStatus === 'pending') {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center max-w-md p-4">
          <h2 className="text-2xl font-bold mb-4">Report Generation in Progress</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 mb-6">
            We're currently processing your report. This usually takes about 5 minutes. 
            You'll be notified when it's ready.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (reportStatus === 'error') {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center max-w-md p-4">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Report Generation Failed</h2>
          <p className="text-gray-500 mb-6">
            There was an error generating your report. Our team has been notified and will look into this.
            Please try again later.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Only show dashboard if report status is 'completed'
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Analytics Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Analytics</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600">Total Views</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div>
              <p className="text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold">2.6%</p>
            </div>
          </div>
        </div>

        {/* Reports Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Reports</h2>
          <div className="space-y-3">
            <div className="border-b pb-2">
              <p className="font-medium">Weekly Summary</p>
              <p className="text-sm text-gray-600">Generated on May 1, 2024</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Performance Analysis</p>
              <p className="text-sm text-gray-600">Generated on April 24, 2024</p>
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Quick Settings</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Enabled
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Auto-generate Reports</span>
              <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Weekly
              </button>
            </div>
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Statistics</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600">Active Users</p>
              <p className="text-2xl font-bold">856</p>
            </div>
            <div>
              <p className="text-gray-600">Average Session</p>
              <p className="text-2xl font-bold">24m</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
          <div className="space-y-3">
            <div className="border-b pb-2">
              <p className="font-medium">New Report Generated</p>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Settings Updated</p>
              <p className="text-sm text-gray-600">5 hours ago</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>API Status</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Database</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Healthy
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
