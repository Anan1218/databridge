"use client";
import { useState } from 'react';

const dataSourceOptions = [
  { id: 'google-analytics', name: 'Google Analytics' },
  { id: 'stripe', name: 'Stripe' },
  { id: 'shopify', name: 'Shopify' },
  { id: 'firebase', name: 'Firebase' },
  { id: 'bigquery', name: 'BigQuery' },
  { id: 'postgres', name: 'PostgreSQL' },
];

export default function DataSourcesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<string | null>(null);
  const [dataSources, setDataSources] = useState<Array<{ id: string; name: string }>>([]);

  const handleAddDataSource = () => {
    if (selectedDataSource) {
      const newSource = dataSourceOptions.find(opt => opt.id === selectedDataSource);
      if (newSource && !dataSources.find(ds => ds.id === newSource.id)) {
        setDataSources(prev => [...prev, newSource]);
      }
      setIsModalOpen(false);
      setSelectedDataSource(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Data Sources</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Connect Data Source
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {dataSources.length === 0 ? (
          <p className="text-gray-600">No data sources connected yet.</p>
        ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="pb-3">Name</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
              {dataSources.map((source) => (
                <tr key={source.id} className="border-b">
                  <td className="py-4 text-gray-600">{source.name}</td>
                  <td className="py-4">
                    <span className="text-green-600">Connected</span>
                  </td>
                  <td className="py-4">
                    <button className="text-red-600 hover:text-red-700">
                      Disconnect
                    </button>
                  </td>
            </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedDataSource(null);
                }}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
              >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              </button>

            <h2 className="text-xl font-bold mb-6">Connect data source</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {dataSourceOptions.map((option) => (
              <button
                  key={option.id}
                  onClick={() => setSelectedDataSource(option.id)}
                  className={`p-4 rounded border ${
                    selectedDataSource === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                  {option.name}
              </button>
              ))}
          </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddDataSource}
                disabled={!selectedDataSource}
                className={`px-4 py-2 rounded-lg w-full ${
                  selectedDataSource
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Add data source
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}