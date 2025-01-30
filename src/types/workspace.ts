export interface Workspace {
  id?: string;
  name: string;
  owner: {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  members: Array<{
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'owner' | 'member';
  }>;
  enabledDashboards: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface WorkspaceMember {
  userId: string;
  role: WorkspaceRole;
  joinedAt: Date;
  email: string;
  name: string;
}
