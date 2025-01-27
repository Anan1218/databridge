import AdminLayout from './components/AdminLayout';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminLayout>{children}</AdminLayout>
    </div>
  );
}
