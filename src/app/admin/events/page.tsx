"use client";

import LocalEvents from "../components/LocalEvents";
import GenerateReport from "../components/GenerateReport";
import { useState } from "react";

export default function EventsPage() {
  const [hasReport, setHasReport] = useState(false);

  if (!hasReport) {
    return <GenerateReport type="events" onSuccess={() => setHasReport(true)} />;
  }

  return (
    <div className="flex-1">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-700">LOCAL EVENTS & NEWS</h1>
      </div>
      <LocalEvents />
    </div>
  );
} 