'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthContext } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuthContext();

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Pricing", href: "#pricing" },
  ];

  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      const offset = 115; // Adjust this value to control how much higher it stops
      const elementPosition = pricingSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition
      });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav className="backdrop-blur-sm bg-white/80 border-b border-gray-200 transition-colors duration-200">
        <div className="container mx-auto px-4 md:px-20">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/databridgelogo.png" alt="DataBridge" width={28} height={28} className="md:w-8 md:h-8" />
              <span className="hidden md:inline text-gray-900 font-semibold text-lg">DataBridge</span>
            </Link>

            <div className="flex items-center gap-5 md:gap-6">
              <button 
                onClick={scrollToPricing} 
                className="text-gray-600 hover:text-gray-900 text-sm md:text-base"
              >
                Pricing
              </button>
              {user ? (
                <>
                  <Link 
                    href="/admin"
                    className="bg-[#8b5cf6] text-white px-4 py-2 rounded-lg hover:bg-[#7c3aed] transition-colors"
                  >
                    Admin Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-[#8b5cf6] text-white px-4 py-2 rounded-lg hover:bg-[#7c3aed] transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/signup"
                  className="bg-[#974eea] text-white px-3.5 py-2 rounded-lg hover:bg-[#8b5cf6] transition-all text-sm md:text-base"
                >
                  Start for Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
} 