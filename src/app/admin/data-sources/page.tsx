"use client";
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PremiumUpgradeModal from '@/components/PremiumUpgradeModal';

const dataSourceOptions = [
  { id: 'ticketmaster', name: 'Ticketmaster' },
];

export default function DataSourcesPage() {
  const { user, userData } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<string | null>(null);
  const [dataSources, setDataSources] = useState<Array<{ id: string; name: string; status?: string }>>([]);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (userData?.dataSources) {
      const formattedSources = userData.dataSources.map((id: string) => {
        const source = dataSourceOptions.find(opt => opt.id === id);
        return source || { id, name: id };
      });
      setDataSources(formattedSources);
    }
  }, [userData?.dataSources]);

  const handleAddDataSource = async () => {
    if (selectedDataSource && user?.uid) {
      const newSource = dataSourceOptions.find(opt => opt.id === selectedDataSource);
      if (newSource && !dataSources.find(ds => ds.id === newSource.id)) {
        setDataSources(prev => [...prev, newSource]);
        
        try {
          const response = await fetch('/api/data-sources', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: user.uid,
              dataSource: selectedDataSource
            })
          });
          
          if (!response.ok) {
            throw new Error('Failed to update data sources');
          }
        } catch (error) {
          console.error('Failed to update data sources:', error);
          setDataSources(prev => prev.filter(ds => ds.id !== newSource.id));
        }
      }
      setIsModalOpen(false);
      setSelectedDataSource(null);
    }
  };

  const handleDisconnect = async (sourceId: string) => {
    if (!user?.uid) return;
    
    const sourceToRemove = dataSources.find(ds => ds.id === sourceId);
    if (!sourceToRemove) return;

    setIsDisconnecting(true);
    setDataSources(prev => prev.filter(ds => ds.id !== sourceId));
    
    try {
      const response = await fetch('/api/data-sources', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          dataSource: sourceId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to disconnect data source');
      }
    } catch (error) {
      console.error('Failed to disconnect data source:', error);
      setDataSources(prev => [...prev, sourceToRemove]);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleConnectSource = () => {
    // Check if user has premium subscription
    const isPremium = userData?.subscription?.status === 'active';
    
    if (!isPremium) {
      // Show premium modal instead of redirect
      setIsPremiumModalOpen(true);
      return;
    }
    
    // If premium, open the modal
    setIsModalOpen(true);
  };

  const handleSourceSelect = async (sourceId: string) => {
    if (!user) return;
    
    const source = dataSources.find(s => s.id === sourceId);
    if (source?.status !== 'available') return;

    // Check if user already has this data source
    if (userData?.dataSources?.includes(sourceId)) {
      return; // Source already connected
    }

    try {
      const response = await fetch('/api/data-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          dataSource: sourceId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to connect data source');
      }

      // Refresh user data to get updated data sources
      await refreshUserData();
    } catch (error) {
      console.error('Error connecting data source:', error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-black">Data Sources</h1>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
            {dataSources.length} / {userData?.subscription?.status === 'active' ? '10' : '3'} sources
          </span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/admin/integrated')}
            className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Integrated Sources
          </button>
          <button
            onClick={handleConnectSource}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Custom Sources
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-3 gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="text-sm font-medium text-gray-500">Name</div>
          <div className="text-sm font-medium text-gray-500">Status</div>
          <div className="text-sm font-medium text-gray-500">Action</div>
        </div>

        {dataSources.length === 0 ? (
          <div className="px-6 py-4 text-sm text-gray-500">
            No data sources connected yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {dataSources.map((source) => (
              <div key={source.id} className="grid grid-cols-3 gap-4 px-6 py-4 items-center">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">
                      {source.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {source.name}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                </div>
                <div>
                  <button 
                    onClick={() => handleDisconnect(source.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isDisconnecting}
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
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

            <h2 className="text-xl font-bold mb-6 text-black">Connect custom data</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {dataSourceOptions.map((option) => (
              <button
                  key={option.id}
                  onClick={() => setSelectedDataSource(option.id)}
                  className={`p-4 rounded border text-black ${
                    selectedDataSource === option.id
                      ? 'border-purple-500 bg-blue-50'
                      : 'border-purple-200 hover:border-purple-300'
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
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Add data source
              </button>
            </div>
          </div>
        </div>
      )}

      <PremiumUpgradeModal 
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onUpgrade={() => {
          setIsPremiumModalOpen(false);
          router.push('/admin/billing');
        }}
        title="Premium Feature"
        description="You need to upgrade to a premium plan to connect custom data sources."
      />
    </div>
  );
}