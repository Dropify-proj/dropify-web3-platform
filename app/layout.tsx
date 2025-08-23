import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PrivyWrapper from './components/PrivyWrapper';
// Using temporary wallet context to avoid Aptos dependency errors
import { WalletProvider } from '../lib/wallet-context';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dropify | Receipts to Web3 Rewards",
  description: "Transform everyday purchases into valuable Web3 assets. Scan receipts, earn tokens & NFTs, redeem real rewards. The future of retail loyalty is here.",
  keywords: "Dropify, Receipt Scanner, Web3 Rewards, NFT, Tokens, Blockchain Rewards, Retail Loyalty, Digital Assets",
  authors: [{ name: "Dropify Team" }],
  openGraph: {
    title: "Dropify - Receipts to Web3 Rewards",
    description: "Turn every purchase into valuable digital assets with receipt scanning technology",
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
        <WalletProvider>
          <PrivyWrapper>
            {children}
          </PrivyWrapper>
        </WalletProvider>
      </body>
    </html>
  );
}
