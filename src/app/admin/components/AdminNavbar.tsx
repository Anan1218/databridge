// src/app/admin/components/AdminNavbar.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { MdArrowDropDown, MdPerson, MdHelpOutline, MdLogout } from "react-icons/md";
import NotificationBell from './NotificationBell';

export default function AdminNavbar() {
  const { signOut, user } = useAuthContext();
  const router = useRouter();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const navItems = [
    {
      // icon: <MdHome className="w-5 h-5" />,
      label: "Dashboard",
      href: "/admin",
    },
    {
      // icon: <MdStorage className="w-5 h-5" />,
      label: "Data Sources",
      href: "/admin/data-sources",
    },
    {
      // icon: <MdSettings className="w-5 h-5" />,
      label: "Billing",
      href: "/admin/billing"
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    async function fetchNotifications() {
      if (!user) return;
      const res = await fetch(`/api/notifications?uid=${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    }
    console.log("Fetching notifications for user:", user);
    console.log(notifications)
    fetchNotifications();

    // Optionally, add polling or real-time listeners
  }, [user, notifications]);

  return (
    <nav className="bg-[#1a1f37] border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center">
              <Image
                src="/databridgelogo.png"
                alt="Logo"
                width={32}
                height={32}
                className="mr-4"
              />
              <span className="text-white text-lg font-semibold mr-8">DataBridge</span>
            </Link>
            <div className="flex space-x-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-[#252d4a] rounded-md transition-colors"
                >
                  {/* {item.icon} */}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationBell notifications={notifications} />
            
            <div className="relative">
              <button 
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex items-center gap-2 text-gray-300 hover:text-white p-2 rounded-lg transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-[#8b5cf6] flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.[0].toUpperCase()}
                  </span>
                </div>
                <MdArrowDropDown className="w-5 h-5" />
              </button>

              {showAccountDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                  <Link
                    href="/admin/account"
                    onClick={() => setShowAccountDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <MdPerson className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    href="/admin/help"
                    onClick={() => setShowAccountDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <MdHelpOutline className="w-4 h-4" />
                    Support
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <MdLogout className="w-4 h-4" />
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