'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import AdminNavbar from "./AdminNavbar";
import { MdStorage, MdHome, MdEvent, MdChevronLeft, MdChevronRight } from "react-icons/md";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems = [
    { 
      icon: <MdHome className="w-5 h-5" />,
      label: "Home",
      href: "/admin",
    },
    { 
      icon: <MdEvent className="w-5 h-5" />,
      label: "Local Events",
      href: "/admin/events",
    },
    {
      key: 'data-sources',
      label: 'Data Sources',
      icon: <MdStorage className="w-5 h-5" />,
      href: '/admin/data-sources'
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className={`bg-[#1a1f37] fixed h-screen overflow-y-auto transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col`}>
        <div className="flex-grow">
        <div className="flex items-center gap-2 px-6 py-4">
          <Image
            src="/databridgelogo.png"
            alt="Logo"
            width={32}
            height={32}
          />
          {!isCollapsed && <span className="text-white text-xl font-semibold">DataBridge</span>}
        </div>

        <nav className="px-2 py-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 ${isCollapsed ? 'px-3 justify-center' : 'px-4'} py-2.5 text-gray-300 hover:bg-[#252d4a] rounded-lg transition-colors`}
                >
                  <span>{item.icon}</span>
                  {!isCollapsed && <span className="flex-1">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white transition-colors flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-700"
          >
            {isCollapsed ? <MdChevronRight size={20} /> : <MdChevronLeft size={20} />}
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <AdminNavbar />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}