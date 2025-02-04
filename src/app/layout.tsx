import type { Metadata } from "next";
import "./globals.css";
import { AuthContextProvider } from '@/contexts/AuthContext';
import Script from 'next/script';

export const metadata: Metadata = {
  title: "ProspectAI",
  description: "The best way to generate leads with AI",
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
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WCG2YRWT2T"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WCG2YRWT2T');
          `}
        </Script>
      </head>
      <body>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
