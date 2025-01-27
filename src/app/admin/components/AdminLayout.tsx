// AdminLayout.tsx
'use client';
import { useAuthContext } from "@/contexts/AuthContext";
import AdminNavbar from "./AdminNavbar";
import SecondaryNavbar from "./SecondaryNavbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuthContext();
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavbar/>
      <SecondaryNavbar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}