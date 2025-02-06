'use client';
import { useState } from 'react';
import { MdAdd, MdEdit } from 'react-icons/md';
import { useAuthContext } from '@/contexts/AuthContext';
import { db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Workspace, Dashboard, DashboardType } from '@/types/workspace';
import { useRouter } from 'next/navigation';
import PremiumUpgradeModal from '@/components/PremiumUpgradeModal';
import WorkspaceDropdown from './navbar/WorkspaceDropdown';
import SearchBar from './navbar/SearchBar';
import DashboardModal from './navbar/DashboardModal';
import { nanoid } from 'nanoid';
import { useWorkspace } from '@/contexts/WorkspaceContext';

type WorkspaceDisplay = {
  id: string;
  name: string;
  role: 'Owner' | 'User';
};

interface SecondaryNavbarProps {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SecondaryNavbar({
  isEditing,
  setIsEditing,
}: SecondaryNavbarProps) {
  const {
    selectedWorkspace: contextWorkspace,
    setSelectedWorkspace: contextSetSelectedWorkspace,
    refreshDashboards,
  } = useWorkspace();
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [workspaces, setWorkspaces] = useState<WorkspaceDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, userData, refreshUserData } = useAuthContext();
  const router = useRouter();
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const handleNewWorkspace = () => {
    if (!isPremium) {
      setShowWorkspaceDropdown(false);
      setIsPremiumModalOpen(true);
      return;
    }
    // Implementation for creating new workspace
  };

  const handleCreateDashboard = async (type: DashboardType) => {
    if (!contextWorkspace || !contextWorkspace.id) return;
    
    try {
      const dashboardId = nanoid();
      const newDashboard = {
        id: dashboardId,
        type: type,
        title: 'New Leads Collection',
        workspaceId: contextWorkspace.id,
        dataSources: [],
        settings: {},
        position: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'workspaces', contextWorkspace.id, 'dashboards', dashboardId), newDashboard);
      await refreshUserData();
      refreshDashboards();
      setIsDashboardModalOpen(false);
    } catch (error) {
      console.error('Failed to create dashboard:', error);
    }
  };

  const handleEditLayout = () => {
    setIsEditing((prev) => !prev);
  };

  const isWorkspaceOwnerOrAdmin =
    user &&
    contextWorkspace &&
    (contextWorkspace.owner.uid === user.uid ||
      (contextWorkspace.members &&
        contextWorkspace.members.some(
          (member) => member.uid === user.uid && member.role === 'owner'
        )));

  const isPremium = userData?.subscription?.status === 'active';

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12 items-center">
          <div className="flex items-center gap-4">
            <WorkspaceDropdown 
              showDropdown={showWorkspaceDropdown}
              selectedWorkspace={
                contextWorkspace
                  ? {
                      id: contextWorkspace.id!,
                      name: contextWorkspace.name,
                      role: user && contextWorkspace.owner?.uid === user.uid ? 'Owner' : 'User'
                    }
                  : null
              }
              workspaces={workspaces}
              isLoading={isLoading}
              onToggleDropdown={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
              onSelectWorkspace={async (workspaceDisplay: WorkspaceDisplay) => {
                const workspaceRef = doc(db, 'workspaces', workspaceDisplay.id);
                const workspaceSnap = await getDoc(workspaceRef);
                if (workspaceSnap.exists()) {
                  const data = workspaceSnap.data();
                  contextSetSelectedWorkspace({
                    ...data,
                    id: workspaceSnap.id,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date()
                  } as Workspace);
                }
                setShowWorkspaceDropdown(false);
              }}
              onNewWorkspace={handleNewWorkspace}
              onSettingsClick={() => {
                if (contextWorkspace) {
                  router.push(`/admin/workspace/${contextWorkspace.id}/settings`);
                }
              }}
            />

            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <div className="flex items-center gap-4">
            {isWorkspaceOwnerOrAdmin && (
              <button
                onClick={handleEditLayout}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                  isEditing
                    ? 'text-white bg-purple-600 hover:bg-purple-700'
                    : 'text-purple-600 border border-purple-600 hover:bg-purple-50'
                } rounded-lg`}
              >
                <MdEdit className="w-5 h-5" />
                {isEditing ? 'Done Editing' : 'Edit Layout'}
              </button>
            )}
            
            <button 
              onClick={() => setIsDashboardModalOpen(true)} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              <MdAdd className="w-5 h-5" />
              New Leads Collection
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