"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, getDocs, limit } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useAuthContext } from "@/contexts/AuthContext";
import NewsSummary from "./components/NewsSummary";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [hasReports, setHasReports] = useState(false);
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const checkReports = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        console.log("Checking reports for user:", user.uid); // Debug log
        const reportsRef = collection(db, "users", user.uid, "reports");
        const q = query(reportsRef, limit(1));
        const snapshot = await getDocs(q);
        
        const hasReportsData = !snapshot.empty;
        console.log("Has reports:", hasReportsData); // Debug log
        setHasReports(hasReportsData);
      } catch (error) {
        console.error("Error checking reports:", error);
        setHasReports(false);
      } finally {
        setLoading(false);
      }
    };

    checkReports();
  }, [user?.uid]);

  // Debug logs
  console.log("Loading:", loading);
  console.log("Has Reports:", hasReports);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">Please sign in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!hasReports) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
          <p className="text-gray-500 mb-6">
            We're currently processing your first report. This usually takes about 5 minutes. 
            We'll notify you when it's ready.
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

  return (
    <div className="min-h-screen bg-black p-6">
    <div className="max-w-7xl mx-auto">
      <NewsSummary />
    </div>
  </div>
  );
}
