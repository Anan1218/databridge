import type { Metadata } from "next";
import "./globals.css";
import { AuthContextProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: "DataBridge",
  description: "Connect, monitor, and analyze data with AI",
  icons: {
    icon: '/databridgelogo.png',
    apple: '/databridgelogo.png',
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
