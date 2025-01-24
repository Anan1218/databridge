"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useAuthContext } from "@/contexts/AuthContext";
import GenerateReport from "./components/GenerateReport";

interface Report {
  status: 'pending' | 'completed' | 'error' | 'no_reports';
  createdAt: Date;
  data: any;
}

export default function AdminDashboard() {
  const [reportStatus, setReportStatus] = useState<Report['status'] | null>(null);
  const { user } = useAuthContext();
  const router = useRouter();

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

  if (!user) {
    return null;
  }

  if (reportStatus === null || reportStatus === 'no_reports') {
    return <GenerateReport type="business" onSuccess={() => setReportStatus('pending')} />;
  }

  if (reportStatus === 'pending') {
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
    return <GenerateReport type="business" onSuccess={() => setReportStatus('pending')} />;
  }

  // Only show dashboard if report status is 'completed'
  return (
    <div className="flex-1">
      {/* Report Header */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold text-slate-700">RESTAURANT MARKETING REPORT</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Report for</span>
            <select className="bg-white text-slate-700 border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
              <option>Dec 1, 2024 - Dec 31, 2024</option>
              <option>Nov 1, 2024 - Nov 30, 2024</option>
              <option>Oct 1, 2024 - Oct 31, 2024</option>
            </select>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
