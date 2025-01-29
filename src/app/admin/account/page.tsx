'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/utils/firebase';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Workspace } from '@/types/workspace';

export default function AccountSettings() {
  const { user, userData, refreshUserData } = useAuthContext();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    businessName: userData?.businessName || '',
    location: userData?.location || '',
    businessType: userData?.businessType || '',
    receiveUpdates: userData?.receiveUpdates || false
  });

  // Fetch user's workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!user) return;

      try {
        const workspacesQuery = query(
          collection(db, 'workspaces'),
          where('members', 'array-contains', user.email)
        );
        const workspacesSnap = await getDocs(workspacesQuery);
        const workspacesData = workspacesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Workspace));
        setWorkspaces(workspacesData);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        businessName: formData.businessName,
        location: formData.location,
        businessType: formData.businessType,
        receiveUpdates: formData.receiveUpdates,
        updatedAt: new Date()
      });

      // Refresh user data in context
      await refreshUserData();
      
      setUpdateMessage('Profile updated successfully!');
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateMessage('Failed to update profile. Please try again.');
      setTimeout(() => setUpdateMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Here you would implement the actual deletion logic
    }
  };

  if (!user || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-black">Account Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-black">Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Your email address
              </label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-black"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Business Type *
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-black"
              >
                <option value="">Select business type</option>
                <option value="restaurant">Restaurant</option>
                <option value="retail">Retail</option>
                <option value="service">Service</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="receiveUpdates"
                checked={formData.receiveUpdates}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-black">
                I'd like to receive product updates
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      {/* Workspace Memberships Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-black">Workspace Memberships</h2>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <div className="grid grid-cols-3 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-500">Workspace</div>
            <div className="text-sm font-medium text-gray-500">Role</div>
            <div className="text-sm font-medium text-gray-500">Members</div>
          </div>
          
          {workspaces.map((workspace) => (
            <div key={workspace.id} className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-gray-200 last:border-0">
              <div className="flex items-center">
                <span className="font-medium text-gray-900">{workspace.name}</span>
              </div>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {workspace.ownerEmail === user.email ? 'Owner' : 'Member'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {workspace.members?.length || 1} member{workspace.members?.length !== 1 ? 's' : ''}
              </div>
            </div>
          ))}

          {workspaces.length === 0 && (
            <div className="px-6 py-4 text-sm text-gray-500">
              No workspaces found
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-black">
          If you would like to delete your account,{' '}
          <button
            onClick={handleDeleteAccount}
            className="text-purple-600 hover:text-purple-700 underline"
          >
            click here
          </button>
        </p>
      </div>

      {updateMessage && (
        <div className={`mt-4 p-4 rounded-md ${
          updateMessage.includes('Failed') 
            ? 'bg-red-50 text-red-700' 
            : 'bg-green-50 text-green-700'
        }`}>
          {updateMessage}
        </div>
      )}
    </div>
  );
}