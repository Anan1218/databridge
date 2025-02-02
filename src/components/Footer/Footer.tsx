import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaDiscord } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = {
    help: {
      title: 'Help',
      links: [
        { name: 'FAQs', href: '/faq' },
        { name: 'Email Support', href: '/support' },
      ],
    },
    socials: {
      title: 'Connect',
      links: [
        { name: 'Discord', href: 'https://discord.gg/databridge', icon: <FaDiscord className="w-5 h-5" /> },
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
              <Image src="/databridgelogo.png" alt="DataBridge" width={32} height={32} />
              <span className="text-gray-900 font-semibold">DataBridge</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              © {currentYear} DataBridge.
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

          {/* Social Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-gray-900 font-semibold mb-4">{sections.socials.title}</h3>
            <ul className="space-y-3">
              {sections.socials.links.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#8b5cf6] text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex justify-center items-center gap-4">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-[#8b5cf6]">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-[#8b5cf6]">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 