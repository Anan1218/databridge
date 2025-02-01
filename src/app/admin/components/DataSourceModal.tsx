"use client";

import { useState } from 'react';
import { MdClose, MdCheck } from 'react-icons/md';
import { useAuthContext } from '@/contexts/AuthContext';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSources: string[];
  onSave: (sources: string[]) => void;
}

export default function DataSourceModal({ 
  isOpen, 
  onClose, 
  currentSources,
  onSave 
}: DataSourceModalProps) {
  const { userData } = useAuthContext();
  const [selectedSources, setSelectedSources] = useState<string[]>(currentSources);

  if (!isOpen) return null;

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative mx-auto max-w-md w-full rounded-xl bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">
              Compatible Data Sources
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-3">
            {userData?.dataSources?.map((sourceId: string) => (
              <div
                key={sourceId}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-purple-500 transition-colors"
              >
                <span className="text-gray-700">{sourceId}</span>
                <button
                  onClick={() => handleSourceToggle(sourceId)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedSources.includes(sourceId)
                      ? 'border-purple-600 bg-purple-600'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedSources.includes(sourceId) && (
                    <MdCheck className="w-3 h-3 text-white" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(selectedSources)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 