"use client";

import EventCalendar from "../components/EventCalendar";
// import { useState } from "react";

// type ValuePiece = Date | null;
// type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function EventsPage() {
  // const [selectedDates, setSelectedDates] = useState<Value>(new Date());

  return (
    <div className="flex-1">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-700 mb-6">LOCAL EVENTS & NEWS</h1>
        <div className="mt-6">
          {/* <EventCalendar onDateChange={setSelectedDates} /> */}
          <EventCalendar />
        </div>
      </div>
    </div>
  );
} 