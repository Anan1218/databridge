'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import AdminNavbar from "./AdminNavbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems = [
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: "Home",
      href: "/admin",
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: "Local Events",
      href: "/admin/events",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      label: "Data Sources",
      href: "/admin/data-sources",
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
            {isCollapsed ? '→' : '←'}
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