'use client';

import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminNavbar() {
  const { signOut, user } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
      <div className="flex justify-between items-center">
        {/* Left side - Logo and Business Name */}
        <div className="flex items-center space-x-4">
          <Image
            src="/databridgelogo.png"
            alt="DataBridge Logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-semibold text-gray-800">DataBridge</span>
        </div>

        {/* Right side - User Profile and Logout */}
        <div className="flex items-center space-x-4">
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{user?.email}</p>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-[#8b5cf6] flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.email?.[0].toUpperCase()}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
} 