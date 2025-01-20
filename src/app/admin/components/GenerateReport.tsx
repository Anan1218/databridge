'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { useState } from 'react';

interface GenerateReportProps {
  type: 'events' | 'business';
  onSuccess?: () => void;
}

export default function GenerateReport({ type, onSuccess }: GenerateReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuthContext();

  const getReportConfig = () => {
    switch (type) {
      case 'events':
        return {
          searchQueries: ["local events", "community events", "upcoming events"],
          businessName: "Events Report"
        };
      case 'business':
        return {
          searchQueries: ["business trends", "market analysis", "industry news"],
          businessName: "Business Report"
        };
      default:
        return {
          searchQueries: [],
          businessName: "Report"
        };
    }
  };

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const config = getReportConfig();
      const response = await fetch('/api/process-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.uid,
          email: user?.email,
          searchQueries: config.searchQueries,
          urls: [],
          location: "local",
          businessName: config.businessName
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="text-center max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">No Reports Available</h2>
      <p className="text-gray-600 mb-6">
        Generate your first report to get insights about {type === 'events' ? 'local events' : 'your business'}.
      </p>
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
  );
} 