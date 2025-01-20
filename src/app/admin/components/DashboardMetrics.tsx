"use client";

import { LineChart, Line, BarChart, Bar } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  chart: React.ReactNode;
  comparison: {
    previousPeriod: string;
    previousYear: string;
  };
}

const MetricCard = ({ title, value, chart, comparison }: MetricCardProps) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <h3 className="text-gray-600 uppercase text-sm font-medium mb-4">{title}</h3>
    <div className="text-3xl font-bold mb-4">{value}</div>
    <div className="h-32">
      {chart}
    </div>
    <div className="flex justify-between mt-2 text-sm">
      <div>
        <span className="text-gray-500">Previous period</span>
        <span className={`ml-2 ${
          parseFloat(comparison.previousPeriod) >= 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          {comparison.previousPeriod}
        </span>
      </div>
      <div>
        <span className="text-gray-500">Previous year</span>
        <span className={`ml-2 ${
          parseFloat(comparison.previousYear) >= 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          {comparison.previousYear}
        </span>
      </div>
    </div>
  </div>
);

export default function DashboardMetrics() {
  // Sample data - replace with actual data
  const sessionsData = Array(12).fill(0).map((_, i) => ({ value: Math.random() * 1000 + 500 }));
  const reservationsData = Array(12).fill(0).map((_, i) => ({ value: Math.random() * 3000 + 2000 }));
  const conversionData = Array(12).fill(0).map((_, i) => ({ value: Math.random() * 20 + 60 }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="SESSIONS"
        value="793"
        chart={
          <LineChart width={300} height={100} data={sessionsData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#6ee7b7" 
              strokeWidth={2} 
              dot={false}
            />
          </LineChart>
        }
        comparison={{
          previousPeriod: "-3%",
          previousYear: "-8%"
        }}
      />

      <MetricCard
        title="TABLE RESERVATIONS"
        value="2,626.14"
        chart={
          <BarChart width={300} height={100} data={reservationsData}>
            <Bar dataKey="value" fill="#6ee7b7" />
          </BarChart>
        }
        comparison={{
          previousPeriod: "-13%",
          previousYear: "-4%"
        }}
      />

      <MetricCard
        title="RESERVATIONS CONV. RATE"
        value="71.00%"
        chart={
          <LineChart width={300} height={100} data={conversionData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#6ee7b7" 
              strokeWidth={2} 
              dot={false}
            />
          </LineChart>
        }
        comparison={{
          previousPeriod: "-4%",
          previousYear: "-4%"
        }}
      />
    </div>
  );
} 