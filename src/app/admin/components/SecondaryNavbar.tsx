'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SecondaryNavbar() {
  const { signOut, user } = useAuthContext();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="text-gray-700 hover:text-gray-900 font-medium">
              Dashboard
            </Link>
            <Link href="/admin/settings" className="text-gray-700 hover:text-gray-900 font-medium">
              Settings
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-2xl">
              <input
                type="text"
                placeholder="Search across admin panels..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#8b5cf6] flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.email?.[0].toUpperCase()}
                </span>
              </div>

              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-gray-600 hover:bg-gray-100/50 p-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50 top-full">
                  <Link
                    href="#"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Account Settings
                  </Link>
                  <Link
                    href="/admin/subscription"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Subscription
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}