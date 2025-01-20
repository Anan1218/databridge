"use client";

import NewsSummary from "../components/NewsSummary";

export default function EventsPage() {
  return (
    <div className="flex-1">
      {/* Page Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-700">LOCAL EVENTS & NEWS</h1>
      </div>

      <NewsSummary />
    </div>
  );
} 