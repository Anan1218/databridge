import Link from 'next/link';
import { useAuthContext } from '@/contexts/AuthContext';
import { db } from '@/utils/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableDataSources: string[];
  selectedDashboardType: string | null;
  onSelectDashboardType: (type: string) => void;
  onCreateDashboard: () => void;
}

export default function DashboardModal({
  isOpen,
  onClose,
  availableDataSources,
  selectedDashboardType,
  onSelectDashboardType,
  onCreateDashboard
}: DashboardModalProps) {
  const { user, refreshUserData } = useAuthContext();
  
  if (!isOpen) return null;

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCreateDashboard = async () => {
    if (!selectedDashboardType || !user?.uid) return;

    try {
      // Update user document in Firebase
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        enabledDashboards: arrayUnion(selectedDashboardType),
        updatedAt: new Date()
      });

      // Refresh user data in context
      await refreshUserData();

      // Call the original onCreateDashboard function
      onCreateDashboard();
    } catch (error) {
      console.error('Error creating dashboard:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-6 text-black">Create new dashboard</h2>
        
        {availableDataSources.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">No data sources connected yet.</p>
            <Link 
              href="/admin/data-sources"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Connect a data source
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">Select a data source for your dashboard:</p>
            <div className="grid grid-cols-1 gap-3 mb-6">
              {availableDataSources.map((source) => (
                <button
                  key={source}
                  onClick={() => onSelectDashboardType(source)}
                  className={`p-4 rounded border text-black ${
                    selectedDashboardType === source
                      ? 'border-purple-500 bg-blue-50'
                      : 'border-purple-200 hover:border-purple-300'
                  }`}
                >
                  {source.charAt(0).toUpperCase() + source.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCreateDashboard}
                disabled={!selectedDashboardType}
                className={`px-4 py-2 rounded-lg w-full ${
                  selectedDashboardType
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Create Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 