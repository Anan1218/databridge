import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = {
    help: {
      title: 'Help',
      links: [
        { name: 'Contact', href: '/contact' },
        { name: 'Book Demo', href: '/book-demo' },
      ],
    },
    legal: {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
      ],
    },
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {/* Logo and Copyright */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/prospectailogo.png" alt="ProspectAI" width={32} height={32} />
              <span className="text-gray-900 font-semibold">ProspectAI</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              © {currentYear} ProspectAI.
              <br />
              All rights reserved.
            </p>
          </div>

          {/* Help Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-gray-900 font-semibold mb-4">{sections.help.title}</h3>
            <ul className="space-y-3">
              {sections.help.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-[#8b5cf6] text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-gray-900 font-semibold mb-4">{sections.legal.title}</h3>
            <ul className="space-y-3">
              {sections.legal.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-[#8b5cf6] text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
} 