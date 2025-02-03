import type { Metadata } from "next";
import "./globals.css";
import { AuthContextProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: "ProspectAI",
  description: "Connect, monitor, and analyze data with AI",
  icons: {
    icon: '/prospectailogo.png',
    apple: '/prospectailogo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
