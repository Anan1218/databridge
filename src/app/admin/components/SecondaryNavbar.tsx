'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdWork, MdArrowDropDown, MdAdd, MdSearch } from 'react-icons/md';
import { useAuthContext } from '@/contexts/AuthContext';
import { db } from '@/utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Workspace as FirebaseWorkspace } from '@/types/workspace';
import { useRouter } from 'next/navigation';
import PremiumUpgradeModal from '@/components/PremiumUpgradeModal';

type WorkspaceDisplay = {
  id: string;
  name: string;
  role: 'Owner' | 'User';
};

export default function SecondaryNavbar() {
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [workspaces, setWorkspaces] = useState<WorkspaceDisplay[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, userData } = useAuthContext();
  const router = useRouter();
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [selectedDashboardType, setSelectedDashboardType] = useState<string | null>(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const isPremium = userData?.subscription?.status === 'active';

  const dashboardOptions = [
    { id: 'analytics', name: 'Analytics Dashboard' },
    { id: 'events', name: 'Events Dashboard' },
    { id: 'custom', name: 'Custom Dashboard' },
  ];

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!user?.uid) {
        return;
      }

      try {
        const workspacesRef = collection(db, 'workspaces');
        const query1 = query(workspacesRef, where('ownerId', '==', user.uid));
        const querySnapshot = await getDocs(query1);
        
        const workspacesData: WorkspaceDisplay[] = querySnapshot.docs.map(doc => {
          const data = doc.data() as FirebaseWorkspace;
          return {
            id: doc.id,
            name: data.name,
            role: 'Owner'
          };
        });

        setWorkspaces(workspacesData);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, [user?.uid]);

  useEffect(() => {
    if (workspaces.length > 0 && !selectedWorkspace) {
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces, selectedWorkspace]);

  const handleNewWorkspace = () => {
    if (!isPremium) {
      setShowWorkspaceDropdown(false);
      setIsPremiumModalOpen(true);
      return;
    }
    // Implementation for creating new workspace
    // This would call the existing workspace creation API
  };

  const handleCreateDashboard = async () => {
    if (!selectedDashboardType || !selectedWorkspace) return;
    
    try {
      // Here you would implement the dashboard creation logic
      // Similar to handleAddDataSource in the data-sources page
      
      setIsDashboardModalOpen(false);
      setSelectedDashboardType(null);
    } catch (error) {
      console.error('Failed to create dashboard:', error);
    }
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12 items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
              >
                <MdWork className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {selectedWorkspace?.name || 'Select Workspace'}
                </span>
                <MdArrowDropDown className="w-5 h-5" />
              </button>

              {showWorkspaceDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {isLoading ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                  ) : workspaces.length > 0 ? (
                    <>
                      {workspaces.map((workspace) => (
                        <button
                          key={workspace.id}
                          onClick={() => {
                            setSelectedWorkspace(workspace);
                            setShowWorkspaceDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                        >
                          <span>{workspace.name}</span>
                          <span className={`text-xs ${
                            workspace.role === 'Owner' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          } px-2 py-1 rounded`}>
                            {workspace.role}
                          </span>
                        </button>
                      ))}
                      <div className="border-t mt-1 pt-1">
                        <button 
                          onClick={handleNewWorkspace}
                          className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 flex items-center"
                        >
                          <MdAdd className="mr-2" />
                          New Workspace
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">No workspaces found</div>
                  )}
                </div>
              )}
            </div>

            <div className="w-64 relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search dashboards..."
                className="w-full pl-10 pr-4 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href={selectedWorkspace ? `/admin/workspace/${selectedWorkspace.id}/settings` : '#'} 
              className={`text-sm font-medium ${
                selectedWorkspace 
                  ? 'text-gray-700 hover:text-blue-600' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              Manage Workspace
            </Link>
            
            <button 
              onClick={() => setIsDashboardModalOpen(true)} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              <MdAdd className="w-5 h-5" />
              New Dashboard
            </button>
          </div>
        </div>
      </div>

      {isDashboardModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setIsDashboardModalOpen(false);
                setSelectedDashboardType(null);
              }}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold mb-6 text-black">Create new dashboard</h2>
            <div className="grid grid-cols-1 gap-3 mb-6">
              {dashboardOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedDashboardType(option.id)}
                  className={`p-4 rounded border text-black ${
                    selectedDashboardType === option.id
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
        description="You need to upgrade to a premium plan to create additional workspaces."
      />
    </nav>
  );
}