"use client";

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ChannelData {
  name: string;
  sessions: number;
  sessionsChange: string;
  reservations: number;
  reservationsChange: string;
  conversionRate: number;
  conversionRateChange: string;
}

const WebsitePerformance = () => {
  // Sample data - replace with actual data
  const yearlySessionsData = [
    { month: 'Jan', current: 800, previous: 1200 },
    { month: 'Feb', current: 600, previous: 1700 },
    { month: 'Mar', current: 1000, previous: 700 },
    { month: 'Apr', current: 1200, previous: 1800 },
    { month: 'May', current: 900, previous: 1400 },
    { month: 'Jun', current: 1500, previous: 1400 },
    { month: 'Jul', current: 1400, previous: 1300 },
    { month: 'Aug', current: 1500, previous: 700 },
    { month: 'Sep', current: 1200, previous: 1700 },
    { month: 'Oct', current: 800, previous: 1500 },
    { month: 'Nov', current: 800, previous: 1600 },
    { month: 'Dec', current: 700, previous: 800 },
  ];

  const visitorsPieData = [
    { name: "Segment 1", value: 18.5 },
    { name: "Segment 2", value: 18.3 },
    { name: "Segment 3", value: 13.6 },
    { name: "Segment 4", value: 13.5 },
    { name: "Segment 5", value: 10.3 },
    { name: "Segment 6", value: 9.8 },
    { name: "Other", value: 8.1 },
  ];

  const channelsData: ChannelData[] = [
    {
      name: "Ipsum scelerisque",
      sessions: 1990,
      sessionsChange: "+1,990",
      reservations: 4294.54,
      reservationsChange: "+4,294.54",
      conversionRate: 26.98,
      conversionRateChange: "+26.98%"
    },
    {
      name: "Augue curabitur bibendum",
      sessions: 1952,
      sessionsChange: "+1,952",
      reservations: 2595.13,
      reservationsChange: "+2,595.13",
      conversionRate: 97.00,
      conversionRateChange: "+97.00%"
    },
    // Add more channel data as needed
  ];

  const COLORS = ['#4ade80', '#f87171', '#60a5fa', '#fbbf24', '#a78bfa', '#34d399', '#f472b6'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Year-over-Year Sessions */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-medium text-gray-600 mb-4">YEAR-OVER-YEAR SESSIONS</h3>
          <BarChart width={700} height={300} data={yearlySessionsData}>
            <Bar dataKey="current" fill="#4ade80" name="2024 Jan - 2024 Dec" />
            <Bar dataKey="previous" fill="#f87171" name="2023 Jan - 2023 Dec" />
          </BarChart>
        </div>

        {/* New vs Returning Visitors */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-4">NEW VS RETURNING VISITORS</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={visitorsPieData}
              cx={150}
              cy={150}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {visitorsPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>

      {/* Bounce Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-4">BOUNCE RATE</h3>
          <div className="text-4xl font-bold mb-4">36.00%</div>
          <LineChart width={300} height={100} data={[{ value: 40 }, { value: 30 }, { value: 45 }, { value: 35 }]}>
            <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2} dot={false} />
          </LineChart>
          <div className="flex justify-between mt-4 text-sm">
            <div>
              <span className="text-gray-500">Previous period</span>
              <span className="ml-2 text-red-500">-42%</span>
            </div>
            <div>
              <span className="text-gray-500">Previous year</span>
              <span className="ml-2 text-red-500">-8%</span>
            </div>
          </div>
        </div>

        {/* Top Channel by Sessions */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-medium text-gray-600 mb-4">TOP CHANNEL BY SESSIONS</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-4">Default Channel Grouping</th>
                  <th className="pb-4">Sessions</th>
                  <th className="pb-4">Tables Reservations</th>
                  <th className="pb-4">Conversion Rate</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {channelsData.map((channel, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="py-3">{channel.name}</td>
                    <td className="py-3">
                      {channel.sessions.toLocaleString()}
                      <span className="ml-2 text-green-500">{channel.sessionsChange}</span>
                    </td>
                    <td className="py-3">
                      {channel.reservations.toLocaleString()}
                      <span className="ml-2 text-green-500">{channel.reservationsChange}</span>
                    </td>
                    <td className="py-3">
                      {channel.conversionRate.toFixed(2)}%
                      <span className="ml-2 text-green-500">{channel.conversionRateChange}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsitePerformance; 