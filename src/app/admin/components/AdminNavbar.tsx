// src/app/admin/components/AdminNavbar.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import { MdStorage, MdHome, MdEvent } from "react-icons/md";

export default function AdminNavbar() {
  const navItems = [
    {
      icon: <MdHome className="w-5 h-5" />,
      label: "Dashboard",
      href: "/admin",
    },
    {
      icon: <MdEvent className="w-5 h-5" />,
      label: "Events",
      href: "/admin/events",
    },
    {
      icon: <MdStorage className="w-5 h-5" />,
      label: "Data Sources",
      href: "/admin/data-sources"
    },
  ];

  return (
    <nav className="bg-[#1a1f37] border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Image
              src="/databridgelogo.png"
              alt="Logo"
              width={32}
              height={32}
              className="mr-4"
            />
            <div className="flex space-x-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-[#252d4a] rounded-md transition-colors"
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Optional: Add profile/settings dropdown here if needed */}
        </div>
      </div>
    </nav>
  );
}