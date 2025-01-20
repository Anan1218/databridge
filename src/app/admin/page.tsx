"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, getDoc, doc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useAuthContext } from "@/contexts/AuthContext";
import NewsSummary from "./components/NewsSummary";
import { businessTypes } from "@/utils/businessQueries";
import DashboardMetrics from "./components/DashboardMetrics";
import WebsitePerformance from "./components/WebsitePerformance";

interface Report {
  status: 'pending' | 'completed' | 'error' | 'no_reports';
  createdAt: Date;
  data: any;
}

export default function AdminDashboard() {
  const [reportStatus, setReportStatus] = useState<Report['status'] | null>(null);
  const { user } = useAuthContext();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const reportsRef = collection(db, 'users', user.uid, 'reports');
    const unsubscribe = onSnapshot(reportsRef, (snapshot) => {
      if (snapshot.empty) {
        setReportStatus('no_reports');
        return;
      }

      // Get the most recent report
      const latestReport = snapshot.docs
        .map(doc => ({
          status: doc.data().status,
          createdAt: doc.data().timestamp,
          data: doc.data().data,
          id: doc.id
        }))
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        })[0] as Report;

      if (latestReport) {
        console.log("Latest report status:", latestReport.status);
        setReportStatus(latestReport.status);
      } else {
        setReportStatus(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user?.uid) return;

    // Fetch user data from Firestore
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    };

    fetchUserData();
  }, [user]);

  const generateReport = async () => {
    if (!user?.uid || !userData || isGenerating) return;
    
    try {
      setIsGenerating(true);
      
      // Get the business type queries based on userData.businessType
      const businessTypeData = businessTypes[userData.businessType as keyof typeof businessTypes] || {
        queries: [],
        urls: []
      };
      
      // Send all necessary data to the API
      const response = await fetch('/api/process-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          searchQueries: [
            ...businessTypeData.queries,           // Add predefined queries for business type
            ...(userData.searchQueries || [])      // Add custom user queries
          ],
          urls: [
            ...businessTypeData.urls,              // Add predefined URLs for business type
            ...(userData.urls || [])               // Add custom user URLs
          ],
          location: userData.location || null,
          businessName: userData.businessName || null,
          businessType: userData.businessType || null
        }),
      });

      if (!response.ok) throw new Error('Failed to process report');
      setReportStatus('pending');
    } catch (error) {
      console.error('Error generating report:', error);
      setReportStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return null;
  }

  if (reportStatus === null) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
            There was an error generating your report. Please try regenerating the report.
          </p>
          <button
            onClick={generateReport}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Regenerate Report
          </button>
        </div>
      </div>
    );
  }

  if (reportStatus === 'no_reports') {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center max-w-md p-4">
          <h2 className="text-2xl font-bold mb-4">No Reports Available</h2>
          <p className="text-gray-500 mb-6">
            You haven't generated any reports yet. Click below to generate your first report.
          </p>
          <button
            onClick={generateReport}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Report
          </button>
        </div>
      </div>
    );
  }

  // Only show dashboard if report status is 'completed'
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-slate-700">
        <div className="container mx-auto">
          {/* Report Filter Bar */}
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">REPORT FOR</span>
              <select className="bg-transparent text-white border border-white/30 rounded px-2 py-1">
                <option>Dec 1, 2024 - Dec 31, 2024</option>
                <option>Nov 1, 2024 - Nov 30, 2024</option>
                <option>Oct 1, 2024 - Oct 31, 2024</option>
              </select>
            </div>
            <button className="text-white/80 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </button>
          </div>

          {/* Report Title */}
          <div className="p-4">
            <h1 className="text-2xl font-bold text-white">RESTAURANT MARKETING REPORT</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Overview Section */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-700 mb-6">OVERVIEW</h2>
            <DashboardMetrics />
          </div>
        </div>

        {/* Website Performance Section */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-700 mb-6">WEBSITE PERFORMANCE</h2>
            <WebsitePerformance />
          </div>
        </div>

        {/* News Summary Section */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-700 mb-6">NEWS & UPDATES</h2>
            <NewsSummary />
          </div>
        </div>

        {/* Generate Report Button */}
        <button
          onClick={generateReport}
          disabled={isGenerating}
          className={`w-full bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors ${
            isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
    </div>
  );
}
