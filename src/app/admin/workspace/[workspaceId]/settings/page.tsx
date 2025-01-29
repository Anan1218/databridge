'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/utils/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Workspace } from '@/types/workspace';
import { useAuthContext } from '@/contexts/AuthContext';
import PremiumUpgradeModal from '@/components/PremiumUpgradeModal';

export default function WorkspaceSettings() {
  const { workspaceId } = useParams();
  const { userData } = useAuthContext();
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [workspaceName, setWorkspaceName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState('');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const isPremium = userData?.subscription?.status === 'active';

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!workspaceId) return;

      try {
        const workspaceRef = doc(db, 'workspaces', workspaceId as string);
        const workspaceSnap = await getDoc(workspaceRef);
        
        if (workspaceSnap.exists()) {
          const data = workspaceSnap.data() as Workspace;
          setWorkspace(data);
          setWorkspaceName(data.name);
          setOriginalName(data.name);
        }
      } catch (error) {
        console.error('Error fetching workspace:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspace();
  }, [workspaceId]);

  const handleUpdateName = async () => {
    if (!workspaceId || !workspaceName.trim()) return;

    try {
      const workspaceRef = doc(db, 'workspaces', workspaceId as string);
      await updateDoc(workspaceRef, {
        name: workspaceName.trim()
      });
      setOriginalName(workspaceName.trim());
      setUpdateMessage('Workspace name updated successfully!');
      
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (error) {
      console.error('Error updating workspace:', error);
      setUpdateMessage('Failed to update workspace name');
      setTimeout(() => setUpdateMessage(''), 3000);
    }
  };

  const isNameChanged = workspaceName.trim() !== originalName;

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName) return '?';
    return firstName[0].toUpperCase();
  };

  const getDisplayName = (member: Workspace['members'][0]) => {
    if (!member.firstName && !member.lastName) {
      return member.email.split('@')[0];
    }
    return `${member.firstName || ''} ${member.lastName || ''}`.trim();
  };

  const handleInviteClick = () => {
    if (!isPremium) {
      setIsPremiumModalOpen(true);
      return;
    }
    // Future implementation: Handle invite functionality
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Workspace Settings</h1>
      
      {/* Workspace Name Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Workspace Name</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
          />
          <button
            onClick={handleUpdateName}
            disabled={!isNameChanged}
            className={`px-6 py-2 rounded-lg font-medium ${
              isNameChanged
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Update
          </button>
        </div>
        {updateMessage && (
          <p className={`mt-2 text-sm ${
            updateMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'
          }`}>
            {updateMessage}
          </p>
        )}
      </div>

      {/* Workspace Members Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-gray-900">Workspace Members</h2>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
              {workspace?.members?.length || 0} / {isPremium ? '10' : '1'} users
            </span>
          </div>
          <button 
            onClick={handleInviteClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span>Invite teammate</span>
          </button>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div className="text-sm font-medium text-gray-500">Name</div>
            <div className="text-sm font-medium text-gray-500">Status</div>
            <div className="text-sm font-medium text-gray-500">Role</div>
            <div className="text-sm font-medium text-gray-500">Email Address</div>
          </div>
          
          {workspace && workspace.members && (
            <div className="divide-y divide-gray-200">
              {workspace.members.map((member) => (
                <div key={member.uid || member.email} className="grid grid-cols-4 gap-4 px-6 py-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full ${
                      member.role === 'owner' ? 'bg-[#8b5cf6]' : 'bg-gray-200'
                    } flex items-center justify-center`}>
                      <span className={`text-sm font-medium ${
                        member.role === 'owner' ? 'text-white' : 'text-gray-600'
                      }`}>
                        {getInitials(member.firstName, member.lastName)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {getDisplayName(member)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.role === 'owner' ? 
                          `Owner since ${new Date(workspace.createdAt).toLocaleDateString()}` : 
                          'Member'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <div className="text-gray-900 capitalize">{member.role}</div>
                  <div className="text-gray-500">{member.email}</div>
                </div>
              ))}
            </div>
          )}

          {(!workspace?.members || workspace.members.length === 0) && (
            <div className="px-6 py-4 text-sm text-gray-500">
              No members found
            </div>
          )}
        </div>
      </div>

      <PremiumUpgradeModal 
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onUpgrade={() => {
          setIsPremiumModalOpen(false);
          router.push('/admin/billing');
        }}
        title="Premium Feature"
        description="You need to upgrade to a premium plan to invite additional team members."
      />
    </div>
  );
} 