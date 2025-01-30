'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdAdd, MdEdit } from 'react-icons/md';
import { useAuthContext } from '@/contexts/AuthContext';
import { db } from '@/utils/firebase';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Workspace as FirebaseWorkspace } from '@/types/workspace';
import { useRouter, useSearchParams } from 'next/navigation';
import PremiumUpgradeModal from '@/components/PremiumUpgradeModal';
import WorkspaceDropdown from './navbar/WorkspaceDropdown';
import SearchBar from './navbar/SearchBar';
import DashboardModal from './navbar/DashboardModal';

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
  const [availableDataSources, setAvailableDataSources] = useState<string[]>([]);
  const searchParams = useSearchParams();

  const isPremium = userData?.subscription?.status === 'active';

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

  useEffect(() => {
    if (userData?.dataSources) {
      setAvailableDataSources(userData.dataSources);
    }
  }, [userData?.dataSources]);

  const handleNewWorkspace = () => {
    if (!isPremium) {
      setShowWorkspaceDropdown(false);
      setIsPremiumModalOpen(true);
      return;
    }
    // Implementation for creating new workspace
    // This would call the existing workspace creation API
  };

  const handleCreateDashboard = async (type: string) => {
    if (!selectedWorkspace) return;
    
    try {
      const workspaceRef = doc(db, 'workspaces', selectedWorkspace.id);
      
      let newDashboard;
      switch (type) {
        case 'calendar':
          newDashboard = 'event-calendar';
          break;
        case 'graph':
          newDashboard = 'data-graph';
          break;
        case 'text':
          newDashboard = 'text-component';
          break;
        default:
          return;
      }

      // Add the new dashboard to the workspace's enabledDashboards array
      await updateDoc(workspaceRef, {
        enabledDashboards: arrayUnion(newDashboard),
        updatedAt: new Date()
      });

      // Refresh user data to update the UI
      await refreshUserData();
      
      // Close the modal
      setIsDashboardModalOpen(false);
    } catch (error) {
      console.error('Failed to create dashboard:', error);
    }
  };

  const handleEditLayout = () => {
    const currentUrl = new URL(window.location.href);
    const isEditing = currentUrl.searchParams.get('edit') === 'true';
    
    if (isEditing) {
      router.push('/admin');
    } else {
      router.push('/admin?edit=true');
    }
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12 items-center">
          <div className="flex items-center gap-4">
            <WorkspaceDropdown 
              showDropdown={showWorkspaceDropdown}
              selectedWorkspace={selectedWorkspace}
              workspaces={workspaces}
              isLoading={isLoading}
              onToggleDropdown={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
              onSelectWorkspace={(workspace) => {
                setSelectedWorkspace(workspace);
                setShowWorkspaceDropdown(false);
              }}
              onNewWorkspace={handleNewWorkspace}
            />

            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
            />
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
              onClick={handleEditLayout}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                searchParams.get('edit') === 'true'
                  ? 'text-white bg-purple-600 hover:bg-purple-700'
                  : 'text-purple-600 border border-purple-600 hover:bg-purple-50'
              } rounded-lg`}
            >
              <MdEdit className="w-5 h-5" />
              {searchParams.get('edit') === 'true' ? 'Done Editing' : 'Edit Layout'}
            </button>
            
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

      <DashboardModal 
        isOpen={isDashboardModalOpen}
        onClose={() => setIsDashboardModalOpen(false)}
        onCreateDashboard={handleCreateDashboard}
      />

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