export interface Workspace {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  logo?: string;
  members: WorkspaceMember[];
  enabledDashboards: string[];
  dataSources: string[];
}

export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface WorkspaceMember {
  userId: string;
  role: WorkspaceRole;
  joinedAt: Date;
  email: string;
  name: string;
}
