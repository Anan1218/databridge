'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MdWork, MdArrowDropDown, MdAdd } from 'react-icons/md';

export default function SecondaryNavbar() {
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12 items-center">
          <div className="relative">
            <button 
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
            >
              <MdWork className="w-5 h-5" />
              <span className="text-sm font-medium">Workspace Name</span>
              <MdArrowDropDown className="w-5 h-5" />
            </button>

            {showWorkspaceDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Workspace 1
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Workspace 2
                </button>
                <div className="border-t mt-1 pt-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100">
                    <MdAdd className="mr-2 inline" />
                    New Workspace
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="w-64">
              <input
                type="text"
                placeholder="Search dashboards..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <MdAdd className="w-5 h-5" />
              New Dashboard
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}