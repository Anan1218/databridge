// AdminLayout.tsx
'use client';
import { useAuthContext } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
import SecondaryNavbar from "./SecondaryNavbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  
  // Only show SecondaryNavbar on the main dashboard page
  const showSecondaryNav = pathname === '/admin';

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavbar />
      {showSecondaryNav && <SecondaryNavbar />}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}