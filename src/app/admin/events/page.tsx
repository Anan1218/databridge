"use client";

import LocalEvents from "../components/LocalEvents";
import { useState } from "react";

export default function EventsPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Add your report generation logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1">
      {/* Page Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-700">LOCAL EVENTS & NEWS</h1>
        
        {/* Generate Report Button */}
        <div className="mt-4">
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

      <LocalEvents />
    </div>
  );
} 