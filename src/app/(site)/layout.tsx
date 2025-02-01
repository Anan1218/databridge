import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Content */}
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
} 