'use client';

import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { signOut, user } = useAuthContext();
  const router = useRouter();

  const sidebarItems = [
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: "Dashboards",
      href: "/admin",
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

      {/* Main Content Area - removed border and adjusted background */}
      <div className="ml-64 flex-1 bg-gray-50">
        {/* Navbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Left side - Welcome Message */}
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Welcome back, {user?.email?.split('@')[0]}!
              </h1>
              <p className="text-sm text-gray-500">
                Track your sales activity, leads and deals here.
              </p>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
              <div className="h-8 w-8 rounded-full bg-[#8b5cf6] flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.email?.[0].toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content - removed any potential borders */}
        <main className="p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
} 