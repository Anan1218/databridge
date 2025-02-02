'use client';

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useAuthContext } from '@/contexts/AuthContext';
import LoginModal from '../LoginModal';
import { MdMenu } from 'react-icons/md';

export default function Navbar() {
  const { user, signOut } = useAuthContext();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // const scrollToPricing = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   const pricingSection = document.getElementById('pricing');
  //   if (pricingSection) {
  //     const offset = 115; // Adjust this value to control how much higher it stops
  //     const elementPosition = pricingSection.getBoundingClientRect().top;
  //     const offsetPosition = elementPosition + window.pageYOffset - offset;
      
  //     window.scrollTo({
  //       top: offsetPosition
  //     });
  //   }
  // };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav className="backdrop-blur-sm bg-white/80 border-b border-gray-200 transition-colors duration-200">
        <div className="container mx-auto px-4 sm:px-[6rem]">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/databridgelogo.png" alt="DataBridge" width={32} height={32} />
              <span className="text-gray-900 font-semibold text-lg">DataBridge</span>
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <MdMenu className="w-6 h-6" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {/* <button onClick={scrollToPricing} className="text-gray-600 hover:text-gray-900">
                Pricing
              </button> */}
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
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-[#974eea] text-white px-3.5 py-2 rounded-lg hover:bg-[#8b5cf6] transition-all"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-2">
              {user ? (
                <div className="flex flex-col gap-2 px-4 py-2">
                  <Link 
                    href="/admin"
                    className="bg-[#8b5cf6] text-white px-4 py-2 rounded-lg hover:bg-[#7c3aed] transition-colors text-center"
                  >
                    Admin Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-[#8b5cf6] text-white px-4 py-2 rounded-lg hover:bg-[#7c3aed] transition-colors w-full"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-4 py-2">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="bg-[#974eea] text-white px-3.5 py-2 rounded-lg hover:bg-[#8b5cf6] transition-all w-full"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
} 