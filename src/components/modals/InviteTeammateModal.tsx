import React, { useState } from 'react';
import Modal from './BaseModal';

interface InviteTeammateModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  onSuccess?: (message: string) => void;
}

export default function InviteTeammateModal({
  isOpen,
  onClose,
  workspaceId,
  onSuccess,
}: InviteTeammateModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member'); // Default role
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email) {
      setError('Please enter an email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/invites/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, invitedEmail: email, role }),
      });
      const data = await res.json();
      if (data.success) {
        if (onSuccess) onSuccess(data.message);
        onClose();
      } else {
        setError(data.error || 'An error occurred.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Invite Teammate</h2>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Role *
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="border p-2 w-full mb-2"
        >
          <option value="admin">Admin</option>
          <option value="member">Member</option>
          <option value="viewer">Viewer</option>
        </select>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleInvite}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            {loading ? 'Inviting...' : 'Invite'}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}