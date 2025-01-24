'use client';

import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AdminNavbar from "./AdminNavbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuthContext();
  const router = useRouter();

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
      {/* Sidebar */}
      <div className="w-64 bg-[#1a1f37] fixed h-screen overflow-y-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-700">
          <Image
            src="/databridgelogo.png"
            alt="Logo"
            width={32}
            height={32}
          />
          <span className="text-white text-xl font-semibold">DataBridge</span>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 py-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-[#252d4a] rounded-lg transition-colors"
                >
                  <span>{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="ml-64 flex-1 bg-gray-50">
        <AdminNavbar />
        {/* Page Content */}
        <main className="p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}