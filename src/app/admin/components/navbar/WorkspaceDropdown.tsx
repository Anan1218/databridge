import { MdWork, MdArrowDropDown, MdAdd, MdSettings } from 'react-icons/md';

interface WorkspaceDisplay {
  id: string;
  name: string;
  role: 'Owner' | 'User';
}

interface WorkspaceDropdownProps {
  showDropdown: boolean;
  selectedWorkspace: WorkspaceDisplay | null;
  workspaces: WorkspaceDisplay[];
  isLoading: boolean;
  onToggleDropdown: () => void;
  onSelectWorkspace: (workspace: WorkspaceDisplay) => void;
  onNewWorkspace: () => void;
  onSettingsClick: () => void;
}

export default function WorkspaceDropdown({
  showDropdown,
  selectedWorkspace,
  workspaces,
  isLoading,
  onToggleDropdown,
  onSelectWorkspace,
  onNewWorkspace,
  onSettingsClick
}: WorkspaceDropdownProps) {
  return (
    <div className="relative">
      <button 
        className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
        onClick={onToggleDropdown}
      >
        <MdWork className="w-5 h-5" />
        <span className="text-sm font-medium">
          {selectedWorkspace?.name || 'Select Workspace'}
        </span>
        <MdArrowDropDown className="w-5 h-5" />
      </button>

      {showDropdown && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
          ) : workspaces.length > 0 ? (
            <>
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  onClick={() => onSelectWorkspace(workspace)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between cursor-pointer"
                >
                  <span>{workspace.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${
                      workspace.role === 'Owner' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    } px-2 py-1 rounded`}>
                      {workspace.role}
                    </span>
                    {workspace.role === 'Owner' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSettingsClick();
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <MdSettings className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="border-t mt-1 pt-1">
                <button 
                  onClick={onNewWorkspace}
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
  );
} 