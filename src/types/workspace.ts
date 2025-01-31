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
  dashboards: Array<Dashboard>;
  createdAt: Date;
  updatedAt: Date;
}

export type DashboardType = 'calendar' | 'graph' | 'text';

export interface Dashboard {
  id: string;
  type: DashboardType;
  title: string;
  workspaceId: string;
  dataSources?: string[];  // IDs of connected data sources
  settings?: {
    [key: string]: any;  // Custom settings specific to each dashboard type
  };
  position?: number;  // Optional position for ordering
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
