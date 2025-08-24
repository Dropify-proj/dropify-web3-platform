import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Using Supra native wallet context for direct Supra L1 integration
import { SupraWalletProvider } from '../lib/wallet-context-supra';
// Enhanced authentication with automatic wallet generation
import { EnhancedAuthProvider } from '../lib/enhanced-auth-context';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dropify | Receipts to Rewards on Supra L1",
  description: "Transform everyday purchases into valuable on-chain assets. Scan receipts, earn DROP tokens, redeem real rewards. Built on Supra Layer 1 blockchain.",
  keywords: "Dropify, Receipt Scanner, Supra L1, Blockchain Rewards, On-chain Data, DROP Tokens, DRF Tokens, Digital Assets, Retail Loyalty",
  authors: [{ name: "Dropify Team" }],
  openGraph: {
    title: "Dropify - On-Chain Receipt Rewards",
    description: "The first platform to bring real-world purchase data on-chain with Supra L1 blockchain technology",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SupraWalletProvider>
          <EnhancedAuthProvider>
            {children}
          </EnhancedAuthProvider>
        </SupraWalletProvider>
      </body>
    </html>
  );
}
