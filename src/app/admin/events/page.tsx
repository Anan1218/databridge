"use client";

import NewsSummary from "../components/NewsSummary";

export default function EventsPage() {
  return (
    <div className="flex-1">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-700">LOCAL EVENTS & NEWS</h1>
        </div>

        <NewsSummary />
      </div>
    </div>
  );
} 