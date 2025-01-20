"use client";

import { BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface LandingPageData {
  page: string;
  reservations: number;
  reservationsChange: string;
  conversionRate: number;
  conversionRateChange: string;
}

const TableReservations = () => {
  // Sample data - replace with actual data
  const appointmentsData = [
    { month: 'Jan', current: 4200, previous: 3800 },
    { month: 'Feb', current: 3200, previous: 4100 },
    { month: 'Mar', current: 2800, previous: 4500 },
    { month: 'Apr', current: 4300, previous: 2800 },
    { month: 'May', current: 4400, previous: 4100 },
    { month: 'Jun', current: 4300, previous: 3500 },
    { month: 'Jul', current: 2800, previous: 2000 },
    { month: 'Aug', current: 2200, previous: 3000 },
    { month: 'Sep', current: 2000, previous: 4500 },
    { month: 'Oct', current: 2800, previous: 3100 },
    { month: 'Nov', current: 3000, previous: 2000 },
    { month: 'Dec', current: 2600, previous: 2800 },
  ];

  const deviceData = [
    { name: "Desktop", value: 15.1, color: "#60a5fa" },
    { name: "Mobile", value: 15.0, color: "#f87171" },
    { name: "Tablet", value: 13.3, color: "#4ade80" },
    { name: "iOS App", value: 12.9, color: "#fbbf24" },
    { name: "Android App", value: 11.8, color: "#a78bfa" },
    { name: "Other", value: 11.4, color: "#34d399" },
    { name: "Smart TV", value: 10.5, color: "#f472b6" },
    { name: "Watch", value: 10.0, color: "#94a3b8" },
  ];

  const landingPagesData: LandingPageData[] = [
    {
      page: "Leo suscipit",
      reservations: 4941.07,
      reservationsChange: "+4,941.07",
      conversionRate: 96.04,
      conversionRateChange: "+100.00%"
    },
    {
      page: "Ipsum ut lectus",
      reservations: 4682.14,
      reservationsChange: "+4,682.14",
      conversionRate: 38.73,
      conversionRateChange: "+38.73%"
    },
    {
      page: "Sit amet tempor",
      reservations: 4482.02,
      reservationsChange: "+4,482.02",
      conversionRate: 87.24,
      conversionRateChange: "+87.24%"
    },
    // Add more landing page data as needed
  ];

  return (
    <div className="space-y-8">
      {/* Appointments Over Time Chart */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-4">APPOINTMENTS OVER TIME</h3>
        <div className="h-64">
          <BarChart width={1000} height={250} data={appointmentsData}>
            <Bar dataKey="current" fill="#4ade80" name="2024 Jan - 2024 Dec" />
            <Bar dataKey="previous" fill="#f87171" name="2023 Jan - 2023 Dec" />
          </BarChart>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Landing Pages Table */}
        <div className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-4">Landing Page ↑</th>
                  <th className="pb-4">Table Reservation ↓</th>
                  <th className="pb-4">Reservation Conversion Rate ↓</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {landingPagesData.map((page, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="py-3">{page.page}</td>
                    <td className="py-3">
                      {page.reservations.toLocaleString()}
                      <span className="ml-2 text-green-500">{page.reservationsChange}</span>
                    </td>
                    <td className="py-3">
                      {page.conversionRate.toFixed(2)}%
                      <span className="ml-2 text-green-500">{page.conversionRateChange}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table Reservation per Device */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-4">TABLE RESERVATION PER DEVICE</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={deviceData}
              cx={150}
              cy={150}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {deviceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default TableReservations; 