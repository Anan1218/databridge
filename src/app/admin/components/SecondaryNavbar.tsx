'use client';
import { useState, useEffect } from 'react';
import { MdAdd, MdEdit } from 'react-icons/md';
import { useAuthContext } from '@/contexts/AuthContext';
import { db } from '@/utils/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Workspace, DashboardType } from '@/types/workspace';
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
  const { user, userData, refreshUserData } = useAuthContext();
  const router = useRouter();

  const [workspaces, setWorkspaces] = useState<WorkspaceDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const isPremium = userData?.subscription?.status === 'active';

  useEffect(() => {
    if (user) {
      const fetchUserWorkspaces = async () => {
        setIsLoading(true);
        try {
          const userDocSnap = await getDoc(doc(db, 'users', user.uid));
          if (userDocSnap.exists()) {
            const userDocData = userDocSnap.data();
            const workspaceIds: string[] = userDocData.workspaces || [];
            const workspacePromises = workspaceIds.map((id) =>
              getDoc(doc(db, 'workspaces', id))
            );
            const workspaceDocs = await Promise.all(workspacePromises);
            const fetchedWorkspaces = workspaceDocs.reduce(
              (acc, docSnap) => {
                if (docSnap.exists()) {
                  const data = docSnap.data();
                  acc.push({
                    id: docSnap.id,
                    name: data.name,
                    role: data.owner?.uid === user.uid ? 'Owner' : 'User',
                  } as WorkspaceDisplay);
                }
                return acc;
              },
              [] as WorkspaceDisplay[]
            );
            setWorkspaces(fetchedWorkspaces);
          }
        } catch (err) {
          console.error('Error fetching user workspaces:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserWorkspaces();
    }
  }, [user]);

  const handleNewWorkspace = async () => {
    try {
      if (!isPremium) {
        setShowWorkspaceDropdown(false);
        setIsPremiumModalOpen(true);
        return;
      }
      // TODO: Implementation for creating a new workspace
    } catch (err) {
      console.error("Error creating workspace:", err);
    }
  };

  const handleCreateDashboard = async (type: DashboardType) => {
    try {
      if (!contextWorkspace || !contextWorkspace.id) return;

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
        updatedAt: new Date(),
      };

      await setDoc(
        doc(db, 'workspaces', contextWorkspace.id, 'dashboards', dashboardId),
        newDashboard
      );
      await refreshUserData();
      refreshDashboards();
      setIsDashboardModalOpen(false);
    } catch (err) {
      console.error("Error creating dashboard:", err);
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
                      role:
                        user && contextWorkspace.owner?.uid === user.uid
                          ? 'Owner'
                          : 'User',
                    }
                  : null
              }
              workspaces={workspaces}
              isLoading={isLoading}
              onToggleDropdown={() =>
                setShowWorkspaceDropdown(!showWorkspaceDropdown)
              }
              onSelectWorkspace={async (workspaceDisplay: WorkspaceDisplay) => {
                const workspaceRef = doc(db, 'workspaces', workspaceDisplay.id);
                const workspaceSnap = await getDoc(workspaceRef);
                if (workspaceSnap.exists()) {
                  const data = workspaceSnap.data();
                  contextSetSelectedWorkspace({
                    ...data,
                    id: workspaceSnap.id,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
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

            <SearchBar value={searchQuery} onChange={setSearchQuery} />
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